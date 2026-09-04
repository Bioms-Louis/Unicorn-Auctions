import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuctionBySlug, listLotsForAuction } from "@/lib/auctions/public-queries";
import { formatNaira, kobo } from "@/lib/money";

export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const auction = await getAuctionBySlug(slug);
  if (!auction) notFound();

  const lots = await listLotsForAuction(auction.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm text-brass">{auction.venue ?? "Venue to be announced"}</p>
      <h1 className="mt-2 font-display text-3xl text-ink">{auction.title}</h1>
      {auction.description && <p className="mt-4 max-w-2xl text-ink/70">{auction.description}</p>}

      <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-hairline py-6 text-sm md:grid-cols-4">
        <div>
          <dt className="text-muted">Status</dt>
          <dd className="mt-1 text-ink">{auction.status.replaceAll("_", " ")}</dd>
        </div>
        <div>
          <dt className="text-muted">Starts</dt>
          <dd className="mt-1 text-ink">
            {auction.starts_at
              ? new Date(auction.starts_at).toLocaleString("en-NG")
              : "TBA"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Registration deadline</dt>
          <dd className="mt-1 text-ink">
            {auction.registration_deadline
              ? new Date(auction.registration_deadline).toLocaleDateString("en-NG")
              : "TBA"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Lots</dt>
          <dd className="mt-1 text-ink">{lots.length}</dd>
        </div>
      </dl>

      <h2 className="mt-12 font-display text-2xl text-ink">Lots</h2>
      <div className="mt-4 border-t border-hairline">
        {lots.length === 0 ? (
          <p className="border-b border-hairline py-8 text-muted">
            No lots have been published for this auction yet.
          </p>
        ) : (
          lots.map((lot) => (
            <Link
              key={lot.id}
              href={`/auctions/${slug}/lots/${lot.id}`}
              className="flex items-center justify-between gap-4 border-b border-hairline py-5 hover:bg-ink/[0.02]"
            >
              <div className="flex items-baseline gap-4">
                <span className="w-14 shrink-0 text-sm text-muted">Lot {lot.lot_number}</span>
                <div>
                  <p className="font-display text-lg text-ink">{lot.title}</p>
                  <p className="text-sm text-muted capitalize">{lot.category.replaceAll("_", " ")}</p>
                </div>
              </div>
              <p className="shrink-0 text-sm text-ink">
                {formatNaira(
                  kobo(lot.current_bid_kobo ?? lot.starting_bid_kobo),
                  { withDecimals: false },
                )}
                <span className="ml-1 text-muted">
                  {lot.current_bid_kobo ? "current" : "starting"}
                </span>
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
