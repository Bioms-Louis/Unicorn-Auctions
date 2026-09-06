import { Web3Form } from "@/components/web3form";

export const metadata = { title: "For partners - Unicorn Auctions" };

const PARTNER_TYPES = [
  "Financial institutions",
  "Corporate fleets",
  "Government agencies",
  "Liquidators",
  "Private asset owners",
];

const PROCESS = [
  {
    step: "01",
    title: "Consignment",
    body: "You submit the asset documentation, photographs, condition reports, and a proposed reserve price.",
  },
  {
    step: "02",
    title: "Verification",
    body: "Our team reviews ownership documentation, condition, and the proposed reserve before anything goes public.",
  },
  {
    step: "03",
    title: "Catalog & inspection",
    body: "Approved lots are published to the catalog, typically 7–14 days ahead of the auction, with a window for physical inspection.",
  },
  {
    step: "04",
    title: "Hybrid auction",
    body: "Your asset sells to the highest bidder across both the floor and online one synchronized bidding process, one price.",
  },
  {
    step: "05",
    title: "Settlement",
    body: "You receive a settlement statement: hammer price less seller commission and VAT on that commission, paid out to you directly.",
  },
];

export default function PartnersPage() {
  return (
    <div>
            <section>
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28">
                    <div className="flex flex-col justify-end border-l border-hairline pl-8 md:pl-10">
                        <dl className="space-y-6">
                            <div>
                                <dt className="mb-4 text-sm tracking-[0.2em] text-brass">
                                    For partners
                                </dt>

                                <dd>
                                    <h1 className="font-display max-w-3xl text-4xl font-bold tracking-tight text-ink md:text-6xl">
                                        Consign an asset. We verify, catalog, and sell it floor and online, at once.
                                    </h1>

                                    <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 md:text-xl">
                                        Unicorn Auctions works with financial institutions, corporate
                                        fleets, government agencies, liquidators, and private owners to
                                        move vehicles, real estate, machinery, and commercial inventory
                                        through hybrid live auctions.
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
          {PARTNER_TYPES.map((type) => (
            <li key={type} className="border-b border-hairline pb-4">
              {type}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl text-ink">How consignment works</h2>
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
            <p className="text-sm text-brass">Seller commission</p>
            <p className="mt-1 font-display text-2xl text-ink">5%–15%</p>
            <p className="mt-1 text-sm text-ink/70">Set per auction, lot, or category.</p>
          </div>
          <div>
            <p className="text-sm text-brass">VAT</p>
            <p className="mt-1 font-display text-2xl text-ink">7.5%</p>
            <p className="mt-1 text-sm text-ink/70">
              Applies to seller commission. Real estate is VAT-exempt.
            </p>
          </div>
          <div>
            <p className="text-sm text-brass">Settlement</p>
            <p className="mt-1 font-display text-2xl text-ink">Itemized</p>
            <p className="mt-1 text-sm text-ink/70">
              Full line-item statement for every sold lot, downloadable from
              your partner dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-xl px-6 py-16">
          <h2 className="font-display text-2xl text-ink">Apply to become a partner</h2>
          <p className="mt-2 text-sm text-ink/70">
            Tell us about the assets you&apos;re looking to consign. Our team
            will follow up to walk through onboarding and KYC.
          </p>
          <div className="mt-8">
            <Web3Form
              subject="New partner application — Unicorn Auctions"
              submitLabel="Submit application"
              successMessage="Thanks — your application has been received. Our partnerships team will be in touch within a few business days."
              fields={[
                { name: "organization_name", label: "Organization / business name" },
                {
                  name: "partner_type",
                  label: "Partner type",
                  placeholder: "Financial institution, corporate fleet, liquidator, etc.",
                },
                { name: "contact_name", label: "Contact name" },
                { name: "email", label: "Email", type: "email" },
                { name: "phone", label: "Phone", type: "tel" },
                {
                  name: "assets",
                  label: "What are you looking to consign?",
                  type: "textarea",
                  placeholder: "Asset type, approximate quantity, condition, location…",
                },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
