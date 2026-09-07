import Link from "next/link";
import { Award, Bell, Check, Gavel, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentBidder } from "@/lib/bidders/current-bidder";
import { getBidderDashboardData, getBidderOverviewStats } from "@/lib/bidders/dashboard-queries";
import { formatNaira, kobo } from "@/lib/money";

const STEPS: { state: string; label: string }[] = [
  { state: "pending", label: "Registered" },
  { state: "kyc_pending", label: "KYC submitted" },
  { state: "kyc_approved", label: "KYC approved" },
  { state: "deposit_verified", label: "Deposit verified" },
  { state: "bidding_enabled", label: "Bidding enabled" },
];

function stepIndex(state: string): number {
  if (state === "deposit_pending") return STEPS.findIndex((s) => s.state === "deposit_verified");
  const idx = STEPS.findIndex((s) => s.state === state);
  return idx === -1 ? 0 : idx;
}

export default async function DashboardOverviewPage() {
  const { user, bidder } = await getCurrentBidder();
  const supabase = await createClient();

  const { data: kyc } = await supabase
    .from("kyc_submissions")
    .select("status")
    .eq("bidder_id", bidder.id)
    .eq("subject_type", "bidder")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { recentBids, wonLots, watchlist, unreadNotificationCount } = await getBidderDashboardData(
    bidder.id,
    user.id,
  );
  const stats = await getBidderOverviewStats(bidder.id, user.id);

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const isBlocked = bidder.state === "suspended" || bidder.state === "rejected";
  const currentStep = stepIndex(bidder.state);

  return (
    <div>
      {isBlocked && (
        <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {bidder.state === "suspended"
            ? "Your account is currently suspended. Contact our team if you believe this is a mistake."
            : "Your application was not approved. Contact our team for more information."}
        </p>
      )}

      {kyc?.status === "rejected" && (
        <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Your KYC submission was not approved.{" "}
          <Link href="/dashboard/kyc" className="underline">
            Review and resubmit
          </Link>
          .
        </p>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-px border border-hairline bg-hairline md:grid-cols-4">
        <StatCard
          icon={Gavel}
          label="Bids placed"
          value={stats.totalBidCount}
          href="/dashboard/bids"
        />
        <StatCard icon={Award} label="Lots won" value={wonLots.length} />
        <StatCard icon={Heart} label="Watchlist" value={watchlist.length} href="/dashboard/watchlist" />
        <StatCard
          icon={Bell}
          label="Unread alerts"
          value={unreadNotificationCount}
          highlight={unreadNotificationCount > 0}
        />
      </div>

      {/* Eligibility stepper */}
      {!isBlocked && (
        <div className="mt-10 border border-hairline p-6">
          <p className="text-sm text-muted">Eligibility progress</p>

          <ol className="mt-6 flex flex-wrap items-start gap-y-6">
            {STEPS.map((step, index) => {
              const done = index < currentStep || (bidder.state === "bidding_enabled" && index <= currentStep);
              const isCurrent = index === currentStep && bidder.state !== "bidding_enabled";
              const isLast = index === STEPS.length - 1;

              return (
                <li key={step.state} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs transition-colors ${
                        done
                          ? "border-brass bg-brass text-white"
                          : isCurrent
                            ? "border-ink text-ink"
                            : "border-hairline text-muted"
                      }`}
                    >
                      {done ? <Check size={14} /> : index + 1}
                    </span>
                    <span
                      className={`w-20 text-center text-xs leading-tight ${
                        done || isCurrent ? "text-ink" : "text-muted"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {!isLast && (
                    <span
                      className={`mx-1 mb-5 h-px w-8 shrink-0 sm:w-16 ${
                        index < currentStep ? "bg-brass" : "bg-hairline"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {bidder.state === "pending" && (
            <Link
              href="/dashboard/kyc"
              className="mt-6 inline-block border border-ink px-4 py-2 text-sm text-ink hover:border-brass hover:text-brass"
            >
              Complete KYC
            </Link>
          )}
          {bidder.state === "kyc_approved" && (
            <Link
              href="/dashboard/deposit"
              className="mt-6 inline-block border border-ink px-4 py-2 text-sm text-ink hover:border-brass hover:text-brass"
            >
              Pay cautionary deposit
            </Link>
          )}
        </div>
      )}

      {/* Recent activity */}
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl text-ink">Recent bids</h2>
            <Link href="/dashboard/bids" className="text-sm text-muted hover:text-brass">
              View all
            </Link>
          </div>
          <div className="mt-4 border-t border-hairline">
            {recentBids.length === 0 ? (
              <p className="border-b border-hairline py-6 text-sm text-muted">No bids placed yet.</p>
            ) : (
              recentBids.slice(0, 5).map((bid) => (
                <div key={bid.id} className="flex items-center justify-between border-b border-hairline py-3">
                  <p className="truncate text-sm text-ink">{bid.lot?.title ?? "Lot unavailable"}</p>
                  <p className="shrink-0 text-sm text-muted">
                    {formatNaira(kobo(bid.amount_kobo), { withDecimals: false })}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Notifications</h2>
          <div className="mt-4 border-t border-hairline">
            {!notifications || notifications.length === 0 ? (
              <p className="border-b border-hairline py-6 text-sm text-muted">Nothing new.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="flex items-center justify-between gap-3 border-b border-hairline py-3">
                  <p className="text-sm capitalize text-ink">{n.type.replaceAll("_", " ")}</p>
                  {!n.read_at && <span className="h-2 w-2 shrink-0 rounded-full bg-brass" />}
                </div>
              ))
            )}
          </div>
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

function StatCard({
  icon: Icon,
  label,
  value,
  highlight = false,
  href,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  highlight?: boolean;
  href?: string;
}) {
  const content = (
    <div className={`bg-paper p-6 ${href ? "transition-colors hover:bg-ink/[0.03]" : ""}`}>
      <Icon size={18} className={highlight ? "text-brass" : "text-ink/40"} />
      <p className="mt-3 text-sm text-muted">{label}</p>
      <p className={`mt-1 font-display text-3xl ${highlight ? "text-brass" : "text-ink"}`}>{value}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
