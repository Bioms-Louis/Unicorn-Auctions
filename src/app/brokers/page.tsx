import { Web3Form } from "@/components/web3form";

export const metadata = { title: "For brokers - Unicorn Auctions" };

const BROKER_TYPES = [
  "Agents",
  "Dealmakers",
  "Auto dealers",
  "Property brokers",
  "Introducing partners",
];

const PROCESS = [
  {
    step: "01",
    title: "Apply & get approved",
    body: "Submit your details and KYC. Once approved, you receive a unique referral code tied to your account.",
  },
  {
    step: "02",
    title: "Register buyer clients",
    body: "Bring bidders in under your referral code every registration, deposit, and bid they place is tracked against it.",
  },
  {
    step: "03",
    title: "They bid, floor or online",
    body: "Your referred bidders compete in the same hybrid auctions as everyone else nothing changes for them.",
  },
  {
    step: "04",
    title: "Commission calculated automatically",
    body: "When a referred bidder wins a lot, your commission is calculated from the configured split no manual tallying.",
  },
  {
    step: "05",
    title: "Payout",
    body: "Withholding tax is deducted per the statutory rate, and the net payout lands in your broker dashboard's payout history.",
  },
];

export default function BrokersPage() {
  return (
    <div>
<section>
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28">
                    <div className="flex flex-col justify-end border-l border-hairline pl-8 md:pl-10">
                        <dl className="space-y-6">
                            <div>
                                <dt className="mb-4 text-sm tracking-[0.2em] text-brass">
                                    For brokers
                                </dt>

                                <dd>
                                    <h1 className="font-display max-w-3xl text-4xl font-bold tracking-tight text-ink md:text-6xl">
                                        Refer buyers. Track every bid and commission against your own code.
                                    </h1>

                                    <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 md:text-xl">
                                          Unicorn Auctions works with agents, dealmakers, auto dealers,
                                          property brokers, and introducing partners to bring bidders into
                                          hybrid live auctions floor and online, one synchronized price.
                                    </p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl text-ink">Who we work with</h2>
        <ul className="mt-6 grid gap-4 border-t border-hairline pt-6 text-ink/80 sm:grid-cols-2 md:grid-cols-3">
          {BROKER_TYPES.map((type) => (
            <li key={type} className="border-b border-hairline pb-4">
              {type}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl text-ink">How referrals work</h2>
        <div className="mt-6 border-t border-hairline">
          {PROCESS.map((item) => (
            <div key={item.step} className="flex gap-6 border-b border-hairline py-6">
              <span className="w-10 shrink-0 font-display text-lg text-brass">{item.step}</span>
              <div>
                <h3 className="font-display text-lg text-ink">{item.title}</h3>
                <p className="mt-1 max-w-xl text-sm text-ink/70">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 border-t border-hairline pt-14 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted">Commission split</p>
            <p className="mt-1 font-display text-2xl text-ink">10%–25%</p>
            <p className="mt-1 text-sm text-ink/70">Of Unicorn Auctions&apos; commission on the sale.</p>
          </div>
          <div>
            <p className="text-sm text-muted">Withholding tax</p>
            <p className="mt-1 font-display text-2xl text-ink">5%</p>
            <p className="mt-1 text-sm text-ink/70">
              Deducted from gross commission per statutory rate. TIN required.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted">Tracking</p>
            <p className="mt-1 font-display text-2xl text-ink">Automatic</p>
            <p className="mt-1 text-sm text-ink/70">
              Referred bidders, activity, and payouts, all against your
              referral code in your broker dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-xl px-6 py-16">
          <h2 className="font-display text-2xl text-ink">Apply to become a broker</h2>
          <p className="mt-2 text-sm text-ink/70">
            Tell us a bit about yourself and the buyers you work with. Our
            team will follow up to walk through onboarding and KYC.
          </p>
          <div className="mt-8">
            <Web3Form
              subject="New broker application — Unicorn Auctions"
              submitLabel="Submit application"
              successMessage="Thanks — your application has been received. Our team will be in touch within a few business days."
              fields={[
                { name: "full_name", label: "Full name" },
                {
                  name: "broker_type",
                  label: "Broker type",
                  placeholder: "Agent, auto dealer, property broker, etc.",
                },
                { name: "email", label: "Email", type: "email" },
                { name: "phone", label: "Phone", type: "tel" },
                {
                  name: "buyer_network",
                  label: "Tell us about the buyers you work with",
                  type: "textarea",
                  placeholder: "Typical buyer profile, categories of interest, estimated volume…",
                },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
