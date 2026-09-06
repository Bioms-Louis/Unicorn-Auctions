import Link from "next/link";
import { getCurrentBidder } from "@/lib/bidders/current-bidder";
import { getBidderWatchlist } from "@/lib/bidders/dashboard-queries";
import { Row, EmptyRow } from "@/components/dashboard-ui";
import { removeFromWatchlist } from "@/lib/watchlist/actions";

export default async function WatchlistPage() {
  const { user } = await getCurrentBidder();
  const watchlist = await getBidderWatchlist(user.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Watchlist</h1>
      <p className="mt-2 text-sm text-ink/70">Lots you&apos;re keeping an eye on.</p>

      <div className="mt-8 border-t border-hairline">
        {watchlist.length === 0 ? (
          <EmptyRow>
            Nothing saved yet.{" "}
            <Link href="/auctions" className="underline underline-offset-4 hover:text-brass">
              Browse auctions
            </Link>
            .
          </EmptyRow>
        ) : (
          watchlist.map((entry) => (
            <Row key={entry.id}>
              {entry.lot ? (
                <Link
                  href={`/auctions/${entry.lot.auction_slug}/lots/${entry.lot.id}`}
                  className="font-display text-base text-ink hover:text-brass"
                >
                  Lot {entry.lot.lot_number} — {entry.lot.title}
                </Link>
              ) : (
                <span className="font-display text-base text-ink">Lot no longer available</span>
              )}
              <form action={removeFromWatchlist.bind(null, entry.id)}>
                <button type="submit" className="text-sm text-muted hover:text-red-700">
                  Remove
                </button>
              </form>
            </Row>
          ))
        )}
      </div>
    </div>
  );
}
