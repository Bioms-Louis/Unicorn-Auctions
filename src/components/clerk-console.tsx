"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, kobo, type Kobo } from "@/lib/money";
import { submitFloorBid, closeLotAction } from "@/app/console/actions";

interface ConsoleLot {
  id: string;
  lot_number: string;
  title: string;
  starting_bid_kobo: number;
  current_bid_kobo: number | null;
  bid_increment_kobo: number;
  status: string;
}

export function ClerkConsole({
  auctionId,
  auctionTitle,
  initialLot,
}: {
  auctionId: string;
  auctionTitle: string;
  initialLot: ConsoleLot | null;
}) {
  const [lot, setLot] = useState(initialLot);
  const [currentBidKobo, setCurrentBidKobo] = useState<number | null>(initialLot?.current_bid_kobo ?? null);
  const [paddleNumber, setPaddleNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    if (!lot) return;
    const supabase = supabaseRef.current;
    const channel = supabase
      .channel(`console:lot:${lot.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_auction_state", filter: `lot_id=eq.${lot.id}` },
        (payload) => {
          const row = payload.new as { current_bid_kobo: number | null };
          setCurrentBidKobo(row.current_bid_kobo);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lot]);

  if (!lot) {
    return <p className="mt-8 border border-hairline px-4 py-6 text-muted">No lot is currently active for {auctionTitle}.</p>;
  }

  function handleEnterBid() {
    if (!lot) return;
    const amountNaira = Number(amount);
    if (!paddleNumber || !amountNaira) {
      setMessage("Enter a paddle number and an amount.");
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const result = await submitFloorBid({
        auctionId,
        lotId: lot.id,
        paddleNumber,
        amountKobo: Math.round(amountNaira * 100),
      });
      if (!result.success) {
        setMessage(result.error?.message ?? "Bid rejected.");
      } else {
        setMessage(`Accepted: paddle ${paddleNumber} at ${formatNaira(result.currentBid as Kobo, { withDecimals: false })}`);
        setAmount("");
      }
    });
  }

  function handleCloseLot() {
    if (!lot) return;
    startTransition(async () => {
      const result = await closeLotAction(lot.id);
      if (!result.success) {
        setMessage(result.error?.message ?? "Could not close lot.");
      } else {
        setMessage(`Lot ${lot.lot_number} closed — ${result.status}.`);
        setLot(null);
      }
    });
  }

  return (
    <div className="mt-8">
      <div className="border border-hairline p-6">
        <p className="text-sm text-muted">Lot {lot.lot_number}</p>
        <p className="mt-1 font-display text-2xl text-ink">{lot.title}</p>
        <p className="mt-3 text-sm text-muted">Current bid</p>
        <p className="font-display text-3xl text-ink">
          {currentBidKobo !== null ? formatNaira(kobo(currentBidKobo), { withDecimals: false }) : "No bids yet"}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="text-sm text-ink/80">Paddle number</span>
          <input
            value={paddleNumber}
            onChange={(e) => setPaddleNumber(e.target.value)}
            placeholder="P-104"
            className="mt-1 w-full border border-hairline bg-transparent px-3 py-2 text-ink outline-none focus:border-brass"
          />
        </label>
        <label className="block">
          <span className="text-sm text-ink/80">Bid amount (₦)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="5500000"
            className="mt-1 w-full border border-hairline bg-transparent px-3 py-2 text-ink outline-none focus:border-brass"
          />
        </label>
        <button
          onClick={handleEnterBid}
          disabled={isPending}
          className="self-end border border-ink px-5 py-2 text-sm text-ink transition hover:border-brass hover:text-brass disabled:opacity-50"
        >
          Enter bid
        </button>
      </div>

      <button
        onClick={handleCloseLot}
        disabled={isPending}
        className="mt-6 border border-forest px-5 py-2 text-sm text-forest transition hover:bg-forest hover:text-paper disabled:opacity-50"
      >
        Close lot (gavel)
      </button>

      {message && <p className="mt-4 text-sm text-ink">{message}</p>}
    </div>
  );
}
