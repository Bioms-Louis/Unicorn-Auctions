import Link from "next/link";
import { getCurrentBidder } from "@/lib/bidders/current-bidder";
import { getBidderBidHistory } from "@/lib/bidders/dashboard-queries";
import { formatNaira, kobo } from "@/lib/money";
import { Row, EmptyRow } from "@/components/dashboard-ui";

const RESULT_LABEL: Record<string, string> = { accepted: "Accepted", rejected: "Rejected" };
const SOURCE_LABEL: Record<string, string> = {
  online: "Online",
  floor: "Floor",
  clerk: "Clerk",
  admin: "Admin",
};

export default async function BidsPage() {
  const { bidder } = await getCurrentBidder();
  const bids = await getBidderBidHistory(bidder.id, 200);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Your bids</h1>
      <p className="mt-2 text-sm text-ink/70">Every bid you&apos;ve placed, accepted or rejected.</p>

      <div className="mt-8 border-t border-hairline">
        {bids.length === 0 ? (
          <EmptyRow>
            No bids placed yet.{" "}
            <Link href="/auctions" className="underline underline-offset-4 hover:text-brass">
              Browse auctions
            </Link>
            .
          </EmptyRow>
        ) : (
          bids.map((bid) => (
            <Row key={bid.id}>
              <div>
                {bid.lot ? (
                  <Link
                    href={`/auctions/${bid.lot.auction_slug}/lots/${bid.lot.id}`}
                    className="font-display text-base text-ink hover:text-brass"
                  >
                    Lot {bid.lot.lot_number} — {bid.lot.title}
                  </Link>
                ) : (
                  <span className="font-display text-base text-ink">Lot no longer available</span>
                )}
                <p className="text-sm text-muted">
                  {new Date(bid.server_created_at).toLocaleString("en-NG")} ·{" "}
                  {SOURCE_LABEL[bid.source] ?? bid.source}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-ink">
                  {formatNaira(kobo(bid.amount_kobo), { withDecimals: false })}
                </p>
                <p className={`text-sm ${bid.result === "accepted" ? "text-brass" : "text-muted"}`}>
                  {RESULT_LABEL[bid.result] ?? bid.result}
                </p>
              </div>
            </Row>
          ))
        )}
      </div>
    </div>
  );
}
