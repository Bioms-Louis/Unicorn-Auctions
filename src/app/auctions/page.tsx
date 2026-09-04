import Link from "next/link";
import { listPublicAuctions } from "@/lib/auctions/public-queries";

export const metadata = { title: "Auctions — Unicorn Auctions" };

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  scheduled: "Scheduled",
  registration_open: "Registration open",
  inspection_open: "Inspection open",
  completed: "Completed",
};

export default async function AuctionsPage() {
  const auctions = await listPublicAuctions();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink">Auctions</h1>
      <p className="mt-2 max-w-xl text-ink/70">
        Every auction listed here runs as a hybrid sale — floor and online
        bidders in the same synchronized bidding process.
      </p>

      <div className="mt-10 border-t border-hairline">
        {auctions.length === 0 ? (
          <p className="border-b border-hairline py-10 text-muted">
            No auctions are published yet. Check back soon.
          </p>
        ) : (
          auctions.map((auction) => (
            <Link
              key={auction.id}
              href={`/auctions/${auction.slug}`}
              className="flex flex-col gap-1 border-b border-hairline py-6 hover:bg-ink/[0.02] md:flex-row md:items-baseline md:justify-between"
            >
              <div>
                <p className="font-display text-xl text-ink">{auction.title}</p>
                <p className="text-sm text-muted">{auction.venue ?? "Venue to be announced"}</p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-brass">{STATUS_LABEL[auction.status] ?? auction.status}</span>
                <span className="text-muted">
                  {auction.starts_at
                    ? new Date(auction.starts_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date TBA"}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
