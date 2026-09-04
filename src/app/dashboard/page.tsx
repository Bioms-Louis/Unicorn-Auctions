import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

const STATE_LABEL: Record<string, string> = {
  pending: "Registration received",
  kyc_pending: "KYC under review",
  kyc_approved: "KYC approved — deposit required",
  deposit_pending: "Deposit required",
  deposit_verified: "Deposit verified",
  bidding_enabled: "Eligible to bid",
  suspended: "Suspended",
  rejected: "Application rejected",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: bidder } = await supabase
    .from("bidders")
    .select("id, state")
    .eq("user_id", user.id)
    .single();

  if (!bidder) redirect("/register");

  const { data: kyc } = await supabase
    .from("kyc_submissions")
    .select("status")
    .eq("bidder_id", bidder.id)
    .eq("subject_type", "bidder")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: deposits } = await supabase
    .from("bidder_deposits")
    .select("id, status, amount_kobo, auction_id")
    .eq("bidder_id", bidder.id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl text-ink">Your dashboard</h1>
        <form action={signOut}>
          <button type="submit" className="text-sm text-muted hover:text-ink">
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-8 border border-hairline p-6">
        <p className="text-sm text-muted">Eligibility status</p>
        <p className="mt-1 font-display text-2xl text-ink">
          {STATE_LABEL[bidder.state] ?? bidder.state}
        </p>

        {bidder.state === "pending" && (
          <Link
            href="/dashboard/kyc"
            className="mt-4 inline-block border border-ink px-4 py-2 text-sm text-ink hover:border-brass hover:text-brass"
          >
            Complete KYC
          </Link>
        )}
        {kyc?.status === "rejected" && (
          <p className="mt-4 text-sm text-red-700">
            Your KYC submission was not approved.{" "}
            <Link href="/dashboard/kyc" className="underline">
              Review and resubmit
            </Link>
            .
          </p>
        )}
        {bidder.state === "kyc_approved" && (
          <Link
            href="/dashboard/deposit"
            className="mt-4 inline-block border border-ink px-4 py-2 text-sm text-ink hover:border-brass hover:text-brass"
          >
            Pay cautionary deposit
          </Link>
        )}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="font-display text-xl text-ink">KYC</h2>
          <p className="mt-2 text-sm text-ink/70">
            Status: {kyc?.status ?? "Not yet submitted"}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Deposits</h2>
          {!deposits || deposits.length === 0 ? (
            <p className="mt-2 text-sm text-ink/70">No deposits on record.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-ink/70">
              {deposits.map((d) => (
                <li key={d.id}>
                  {(d.amount_kobo / 100).toLocaleString("en-NG")} NGN — {d.status}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-10 border-t border-hairline pt-8">
        <Link href="/auctions" className="text-sm text-ink underline underline-offset-4 hover:text-brass">
          Browse auctions →
        </Link>
      </div>
    </div>
  );
}
