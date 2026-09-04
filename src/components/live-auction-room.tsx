"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, kobo, type Kobo } from "@/lib/money";
import { submitOnlineBid } from "@/app/auctions/[slug]/live/actions";

type ConnectionStatus = "connected" | "reconnecting" | "disconnected";

interface LiveLot {
  id: string;
  lot_number: string;
  title: string;
  starting_bid_kobo: number;
  current_bid_kobo: number | null;
  bid_increment_kobo: number;
  status: string;
}

interface LiveState {
  is_open_for_bids: boolean;
  current_bid_kobo: number | null;
  next_min_bid_kobo: number | null;
}

interface BidRow {
  id: string;
  amount_kobo: number;
  source: string;
  server_created_at: string;
}

export function LiveAuctionRoom({
  auctionId,
  auctionTitle,
  initialLot,
  initialState,
  initialBids,
  isEligibleToBid,
}: {
  auctionId: string;
  auctionTitle: string;
  initialLot: LiveLot;
  initialState: LiveState | null;
  initialBids: BidRow[];
  isEligibleToBid: boolean;
}) {
  const [lot] = useState(initialLot);
  const [liveState, setLiveState] = useState<LiveState | null>(initialState);
  const [bids, setBids] = useState<BidRow[]>(initialBids);
  const [status, setStatus] = useState<ConnectionStatus>("connected");
  const [bidError, setBidError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const supabaseRef = useRef(createClient());

  const resync = useCallback(async () => {
    const supabase = supabaseRef.current;
    const { data: freshState } = await supabase
      .from("live_auction_state")
      .select("is_open_for_bids, current_bid_kobo, next_min_bid_kobo")
      .eq("lot_id", lot.id)
      .maybeSingle();
    if (freshState) setLiveState(freshState);
  }, [lot.id]);

  useEffect(() => {
    const supabase = supabaseRef.current;

    const channel = supabase
      .channel(`lot:${lot.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_auction_state", filter: `lot_id=eq.${lot.id}` },
        (payload) => {
          setLiveState(payload.new as LiveState);
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bids", filter: `lot_id=eq.${lot.id}` },
        (payload) => {
          const row = payload.new as BidRow & { result: string };
          if (row.result !== "accepted") return;
          setBids((prev) => [row, ...prev].slice(0, 20));
        },
      )
      .subscribe((subscribeStatus) => {
        if (subscribeStatus === "SUBSCRIBED") {
          setStatus("connected");
          // Never trust that nothing changed while we were (re)connecting —
          // pull the authoritative state before rendering it as current.
          resync();
        } else if (subscribeStatus === "CHANNEL_ERROR" || subscribeStatus === "TIMED_OUT") {
          setStatus("reconnecting");
        } else if (subscribeStatus === "CLOSED") {
          setStatus("disconnected");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lot.id, resync]);

  const currentBidKobo = (liveState?.current_bid_kobo ?? lot.current_bid_kobo ?? null) as Kobo | null;
  const nextMinBidKobo = (liveState?.next_min_bid_kobo ??
    (currentBidKobo ? currentBidKobo + lot.bid_increment_kobo : lot.starting_bid_kobo)) as Kobo;
  const isOpen = liveState?.is_open_for_bids ?? lot.status === "active";

  function handleBid() {
    setBidError(null);
    startTransition(async () => {
      const result = await submitOnlineBid({
        auctionId,
        lotId: lot.id,
        amountKobo: nextMinBidKobo,
      });
      if (!result.success) {
        setBidError(result.error?.message ?? "Bid was not accepted.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-brass">{auctionTitle} — live</p>
          <h1 className="mt-1 font-display text-2xl text-ink">
            Lot {lot.lot_number} — {lot.title}
          </h1>
        </div>
        <ConnectionBadge status={status} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-sm text-muted">Current bid</p>
          <p className="mt-1 font-display text-4xl text-ink">
            {currentBidKobo !== null ? formatNaira(currentBidKobo, { withDecimals: false }) : "No bids yet"}
          </p>

          <p className="mt-6 text-sm text-muted">Next bid</p>
          <p className="mt-1 font-display text-2xl text-ink">
            {formatNaira(nextMinBidKobo, { withDecimals: false })}
          </p>

          <div className="mt-8">
            {!isEligibleToBid ? (
              <p className="border border-hairline px-4 py-3 text-sm text-muted">
                Complete KYC and your cautionary deposit to bid online.
              </p>
            ) : !isOpen ? (
              <p className="border border-hairline px-4 py-3 text-sm text-muted">
                This lot is not currently accepting bids.
              </p>
            ) : status !== "connected" ? (
              <p className="border border-hairline px-4 py-3 text-sm text-muted">
                Reconnecting — bidding is paused until the connection is restored.
              </p>
            ) : (
              <button
                onClick={handleBid}
                disabled={isPending}
                className="w-full border border-ink py-4 text-sm text-ink transition hover:border-brass hover:text-brass disabled:opacity-50"
              >
                {isPending ? "Placing bid…" : `Bid ${formatNaira(nextMinBidKobo, { withDecimals: false })}`}
              </button>
            )}
            {bidError && <p className="mt-2 text-sm text-red-700">{bidError}</p>}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted">Bid history</p>
          <ol className="mt-3 divide-y divide-hairline border-t border-hairline">
            {bids.length === 0 ? (
              <li className="py-3 text-sm text-muted">No bids yet.</li>
            ) : (
              bids.map((bid) => (
                <li key={bid.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-ink">{formatNaira(kobo(bid.amount_kobo), { withDecimals: false })}</span>
                  <span className="text-muted capitalize">{bid.source}</span>
                </li>
              ))
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const label = { connected: "Connected", reconnecting: "Reconnecting…", disconnected: "Disconnected" }[status];
  const color = { connected: "bg-forest", reconnecting: "bg-brass", disconnected: "bg-red-700" }[status];
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}
