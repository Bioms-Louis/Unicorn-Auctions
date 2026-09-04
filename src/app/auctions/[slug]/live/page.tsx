import { notFound } from "next/navigation";
import { getAuctionBySlug } from "@/lib/auctions/public-queries";
import { getCurrentActiveLot, getLiveAuctionState, listRecentBidsForLot } from "@/lib/auctions/live-queries";
import { createClient } from "@/lib/supabase/server";
import { isEligibleToBid, type BidderState } from "@/lib/bidders/state-machine";
import { LiveAuctionRoom } from "@/components/live-auction-room";

export default async function LiveAuctionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const auction = await getAuctionBySlug(slug);
  if (!auction || auction.status !== "live") notFound();

  const lot = await getCurrentActiveLot(auction.id);
  if (!lot) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="font-display text-2xl text-ink">No lot is currently active.</p>
        <p className="mt-2 text-muted">The auctioneer will start the next lot shortly.</p>
      </div>
    );
  }

  const [liveState, bids] = await Promise.all([
    getLiveAuctionState(lot.id),
    listRecentBidsForLot(lot.id),
  ]);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let eligible = false;
  if (user) {
    const { data: bidder } = await supabase
      .from("bidders")
      .select("state")
      .eq("user_id", user.id)
      .maybeSingle();
    if (bidder) eligible = isEligibleToBid(bidder.state as BidderState);
  }

  return (
    <LiveAuctionRoom
      auctionId={auction.id}
      auctionTitle={auction.title}
      initialLot={lot}
      initialState={liveState}
      initialBids={bids}
      isEligibleToBid={eligible}
    />
  );
}
