import Link from "next/link";
import { listPublicAuctions } from "@/lib/auctions/public-queries";

export default async function HomePage() {
  const auctions = await listPublicAuctions();
  const live = auctions.filter((a) => a.status === "live");
  const upcoming = auctions.filter((a) => a.status !== "live");

  return (
    <div>
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.2fr_1fr] md:py-28">
          <div>
            <p className="text-sm text-brass">Floor &amp; online, one gavel</p>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.1] text-ink md:text-5xl">
              The bidder on the floor and the bidder online compete for the same lot, in real time.
            </h1>
            <p className="mt-6 max-w-md text-ink/70">
              Unicorn Auctions runs hybrid live auctions across vehicles,
              real estate, industrial machinery and commercial inventory —
              one synchronized bidding engine, one authoritative price.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/auctions"
                className="border border-ink px-5 py-3 text-sm text-ink transition hover:border-brass hover:text-brass"
              >
                View auctions
              </Link>
              <Link href="/how-it-works" className="px-5 py-3 text-sm text-ink/70 hover:text-ink">
                How hybrid bidding works
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-end border-l border-hairline pl-8">
            <dl className="space-y-6">
              <div>
                <dt className="text-sm text-muted">Settlement currency</dt>
                <dd className="font-display text-2xl text-ink">Nigerian Naira</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Categories</dt>
                <dd className="text-ink">Vehicles · Real estate · Machinery · Commercial inventory</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <AuctionLedger title="Live now" auctions={live} emptyLabel="No auctions are live right now." />
      <AuctionLedger title="Upcoming" auctions={upcoming} emptyLabel="No upcoming auctions are published yet." />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 border-t border-hairline pt-14 md:grid-cols-3">
          <PathCard
            eyebrow="Bidders"
            title="Register, verify, bid"
            body="Complete KYC, pay a refundable cautionary deposit, and bid from the floor or online — the same rules apply either way."
            href="/register"
            cta="Register to bid"
          />
          <PathCard
            eyebrow="Partners"
            title="Consign an asset"
            body="Submit documentation, photographs and a proposed reserve. Our team verifies and catalogs before it goes live."
            href="/partners"
            cta="Become a partner"
          />
          <PathCard
            eyebrow="Brokers"
            title="Refer buyers, earn commission"
            body="Track referred bidders, winning bids and payouts against your own referral code."
            href="/brokers"
            cta="Become a broker"
          />
        </div>
      </section>
    </div>
  );
}

function AuctionLedger({
  title,
  auctions,
  emptyLabel,
}: {
  title: string;
  auctions: Awaited<ReturnType<typeof listPublicAuctions>>;
  emptyLabel: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-6 border-t border-hairline">
        {auctions.length === 0 ? (
          <p className="border-b border-hairline py-8 text-muted">{emptyLabel}</p>
        ) : (
          auctions.map((auction) => (
            <Link
              key={auction.id}
              href={`/auctions/${auction.slug}`}
              className="flex items-baseline justify-between border-b border-hairline py-5 hover:bg-ink/[0.02]"
            >
              <div>
                <p className="font-display text-lg text-ink">{auction.title}</p>
                <p className="text-sm text-muted">{auction.venue ?? "Venue to be announced"}</p>
              </div>
              <p className="text-sm text-muted">
                {auction.starts_at
                  ? new Date(auction.starts_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Date TBA"}
              </p>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

function PathCard({
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div>
      <p className="text-sm text-brass">{eyebrow}</p>
      <h3 className="mt-2 font-display text-xl text-ink">{title}</h3>
      <p className="mt-3 text-sm text-ink/70">{body}</p>
      <Link href={href} className="mt-4 inline-block text-sm text-ink underline decoration-hairline underline-offset-4 hover:decoration-brass">
        {cta}
      </Link>
    </div>
  );
}
