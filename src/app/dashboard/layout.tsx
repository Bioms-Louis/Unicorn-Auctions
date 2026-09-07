import { LogOut } from "lucide-react";
import { getCurrentBidder } from "@/lib/bidders/current-bidder";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import { DashboardNav } from "@/components/dashboard-nav";

const STATUS_BADGE: Record<string, { label: string; tone: "neutral" | "brass" | "warning" }> = {
  pending: { label: "Registered", tone: "neutral" },
  kyc_pending: { label: "KYC under review", tone: "neutral" },
  kyc_approved: { label: "KYC approved", tone: "brass" },
  deposit_pending: { label: "Deposit required", tone: "brass" },
  deposit_verified: { label: "Deposit verified", tone: "brass" },
  bidding_enabled: { label: "Eligible to bid", tone: "brass" },
  suspended: { label: "Suspended", tone: "warning" },
  rejected: { label: "Application rejected", tone: "warning" },
};

const BADGE_TONE_CLASS: Record<string, string> = {
  neutral: "border-hairline text-ink/70",
  brass: "border-brass text-brass",
  warning: "border-red-700 text-red-700",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const { user, bidder } = await getCurrentBidder();

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const badge = STATUS_BADGE[bidder.state] ?? { label: bidder.state, tone: "neutral" as const };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="text-sm text-muted">Welcome back</p>
          <h1 className="font-display text-3xl text-ink">
            {profile ? `${profile.first_name} ${profile.last_name}` : "there"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`border px-3 py-1 text-xs uppercase tracking-wide ${BADGE_TONE_CLASS[badge.tone]}`}
          >
            {badge.label}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 border border-hairline px-3 py-1.5 text-sm text-ink/70 transition-colors hover:border-ink hover:text-ink"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 md:grid md:grid-cols-[200px_1fr] md:gap-12">
        <DashboardNav />
        <div className="mt-6 md:mt-0">{children}</div>
      </div>
    </div>
  );
}
