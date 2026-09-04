import Link from "next/link";
import { notFound } from "next/navigation";
import { getLot } from "@/lib/auctions/public-queries";
import { formatNaira, kobo } from "@/lib/money";

export default async function LotDetailPage({
  params,
}: {
  params: Promise<{ slug: string; lotId: string }>;
}) {
  const { slug, lotId } = await params;
  const lot = await getLot(slug, lotId);
  if (!lot) notFound();

  const auction = lot.auctions as unknown as { title: string; status: string };
  const currentOrStarting = lot.current_bid_kobo ?? lot.starting_bid_kobo;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href={`/auctions/${slug}`} className="text-sm text-muted hover:text-ink">
        &larr; {auction.title}
      </Link>

      <div className="mt-6 grid gap-12 md:grid-cols-[1.1fr_1fr]">
        <div className="aspect-[4/3] border border-hairline bg-ink/[0.03]">
          {/* Photo/video gallery wires up to lot_media in a later phase. */}
        </div>

        <div>
          <p className="text-sm text-muted">Lot {lot.lot_number}</p>
          <h1 className="mt-1 font-display text-3xl text-ink">{lot.title}</h1>
          <p className="mt-1 text-sm capitalize text-muted">{lot.category.replaceAll("_", " ")}</p>

          {lot.description && <p className="mt-6 text-ink/80">{lot.description}</p>}

          <div className="mt-8 border-t border-hairline pt-6">
            <p className="text-sm text-muted">{lot.current_bid_kobo ? "Current bid" : "Starting bid"}</p>
            <p className="mt-1 font-display text-3xl text-ink">
              {formatNaira(kobo(currentOrStarting), { withDecimals: false })}
            </p>
            <p className="mt-1 text-sm text-muted">
              Bid increment: {formatNaira(kobo(lot.bid_increment_kobo), { withDecimals: false })}
            </p>
          </div>

          <div className="mt-8">
            {auction.status === "live" && lot.status === "active" ? (
              <Link
                href={`/auctions/${slug}/live`}
                className="block w-full border border-ink py-3 text-center text-sm text-ink transition hover:border-brass hover:text-brass"
              >
                Join live bidding
              </Link>
            ) : (
              <p className="border border-hairline py-3 text-center text-sm text-muted">
                Bidding opens once this auction goes live.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
