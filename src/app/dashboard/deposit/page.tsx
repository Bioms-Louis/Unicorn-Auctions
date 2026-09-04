import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatNaira, kobo } from "@/lib/money";
import { initiateDepositAction } from "@/app/dashboard/actions";

export default async function DepositPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: auctions } = await supabase
    .from("auctions")
    .select("id, title, default_deposit_kobo")
    .in("status", ["registration_open", "inspection_open"])
    .gt("default_deposit_kobo", 0);

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink">Cautionary deposit</h1>
      <p className="mt-2 text-sm text-ink/70">
        The deposit is refundable and unlocks bidding for the auction it&apos;s
        paid against. Payment is processed by Paystack.
      </p>

      {status === "pending_confirmation" && (
        <p className="mt-4 border border-hairline p-4 text-sm text-ink">
          Payment received — awaiting confirmation. This usually clears within a
          few minutes.
        </p>
      )}
      {status === "failed" && (
        <p className="mt-4 border border-hairline p-4 text-sm text-red-700">
          That payment didn&apos;t go through. You can try again below.
        </p>
      )}
      {status === "init_failed" && (
        <p className="mt-4 border border-hairline p-4 text-sm text-red-700">
          We couldn&apos;t start that payment. Please try again in a moment.
        </p>
      )}

      <div className="mt-8 border-t border-hairline">
        {!auctions || auctions.length === 0 ? (
          <p className="border-b border-hairline py-8 text-muted">
            No auctions currently require a deposit.
          </p>
        ) : (
          auctions.map((auction) => (
            <form
              key={auction.id}
              action={initiateDepositAction.bind(null, auction.id, auction.default_deposit_kobo)}
              className="flex items-center justify-between border-b border-hairline py-5"
            >
              <div>
                <p className="font-display text-lg text-ink">{auction.title}</p>
                <p className="text-sm text-muted">
                  Deposit: {formatNaira(kobo(auction.default_deposit_kobo), { withDecimals: false })}
                </p>
              </div>
              <button
                type="submit"
                className="border border-ink px-4 py-2 text-sm text-ink hover:border-brass hover:text-brass"
              >
                Pay deposit
              </button>
            </form>
          ))
        )}
      </div>
    </div>
  );
}
