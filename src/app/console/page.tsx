import Link from "next/link";
import { redirect } from "next/navigation";
import { canOperateConsole, getCurrentUserOperatorRoles, listLiveAuctionsForConsole } from "@/lib/auctions/console-queries";

export default async function ConsolePage() {
  const { userId, roles } = await getCurrentUserOperatorRoles();

  if (!userId) redirect("/sign-in");
  if (!canOperateConsole(roles)) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="font-display text-2xl text-ink">Not authorized</p>
        <p className="mt-2 text-muted">
          The clerk console is restricted to auctioneers, clerks, and admin staff.
        </p>
      </div>
    );
  }

  const auctions = await listLiveAuctionsForConsole();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl text-ink">Clerk console</h1>
      <p className="mt-2 text-sm text-muted">Select a live auction to operate.</p>

      <div className="mt-8 border-t border-hairline">
        {auctions.length === 0 ? (
          <p className="border-b border-hairline py-8 text-muted">No auctions are currently live or paused.</p>
        ) : (
          auctions.map((auction) => (
            <Link
              key={auction.id}
              href={`/console/${auction.slug}`}
              className="flex items-center justify-between border-b border-hairline py-5 hover:bg-ink/[0.02]"
            >
              <span className="font-display text-lg text-ink">{auction.title}</span>
              <span className="text-sm text-brass capitalize">{auction.status}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
