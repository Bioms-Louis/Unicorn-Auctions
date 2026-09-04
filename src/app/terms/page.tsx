import Link from "next/link";
import {
    ArrowRight,
    ChevronRight,
    FileText,
    Gavel,
    ShieldCheck,
} from "lucide-react";

const sections = [
    {
        id: "introduction",
        number: "01",
        title: "Introduction",
    },
    {
        id: "eligibility",
        number: "02",
        title: "Eligibility and Accounts",
    },
    {
        id: "auction-process",
        number: "03",
        title: "Auction Process",
    },
    {
        id: "bidding",
        number: "04",
        title: "Bidding Terms",
    },
    {
        id: "winning",
        number: "05",
        title: "Winning a Lot",
    },
    {
        id: "settlement",
        number: "06",
        title: "Settlement and Payment",
    },
    {
        id: "lot-information",
        number: "07",
        title: "Lot Information",
    },
    {
        id: "platform-use",
        number: "08",
        title: "Use of the Platform",
    },
    {
        id: "intellectual-property",
        number: "09",
        title: "Intellectual Property",
    },
    {
        id: "liability",
        number: "10",
        title: "Liability",
    },
    {
        id: "suspension",
        number: "11",
        title: "Suspension and Termination",
    },
    {
        id: "privacy",
        number: "12",
        title: "Privacy",
    },
    {
        id: "changes",
        number: "13",
        title: "Changes to These Terms",
    },
    {
        id: "contact",
        number: "14",
        title: "Contact Us",
    },
];

export default function TermsPage() {
    return (
        <main>
            {/* Hero */}
            <section>
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28">
                    <div className="flex flex-col justify-end border-l border-hairline pl-8 md:pl-10">
                        <div>
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
                                Legal
                            </p>

                            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-ink md:text-6xl">
                                Terms &amp; Conditions
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 md:text-xl">
                                Please read these terms carefully before using
                                the Unicorn Auctions platform or participating
                                in an auction.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/50">
                                <span>
                                    Last updated: September 4, 2026
                                </span>
                                <span>Version 1.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Legal notice */}
            <section className="border-y border-hairline">
                <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[auto_1fr] md:items-start md:py-12">
                    <div className="flex h-12 w-12 items-center justify-center border border-hairline">
                        <ShieldCheck className="h-5 w-5 text-ink" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-ink">
                            Important notice
                        </h2>

                        <p className="mt-2 max-w-3xl leading-7 text-ink/70">
                            These Terms &amp; Conditions govern your use of the
                            Unicorn Auctions website and participation in
                            auctions operated through the platform. By creating
                            an account, registering for an auction or placing
                            a bid, you agree to be bound by these terms and
                            any auction-specific terms displayed for the
                            relevant auction or lot.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section>
                <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-[260px_1fr] md:gap-20 md:py-28">
                    {/* Table of contents */}
                    <aside className="md:sticky md:top-24 md:self-start">
                        <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-ink" />

                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
                                Contents
                            </p>
                        </div>

                        <nav className="mt-5 border-l border-hairline">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="group flex items-center gap-3 border-l-2 border-transparent py-2 pl-4 text-sm text-ink/55 transition-colors hover:border-ink hover:text-ink"
                                >
                                    <span className="text-xs text-ink/30">
                                        {section.number}
                                    </span>

                                    <span>{section.title}</span>

                                    <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                </a>
                            ))}
                        </nav>
                    </aside>

                    {/* Terms */}
                    <article className="max-w-3xl">
                        <section
                            id="introduction"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="01" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Introduction
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    These Terms &amp; Conditions (&quot;Terms&quot;)
                                    apply to your use of the Unicorn Auctions
                                    website, applications, services and
                                    auction platform (collectively, the
                                    &quot;Platform&quot;).
                                </p>

                                <p>
                                    &quot;Unicorn Auctions&quot;, &quot;we&quot;,
                                    &quot;us&quot; and &quot;our&quot; refer to
                                    the operator of the Platform. &quot;You&quot;
                                    and &quot;your&quot; refer to any person
                                    accessing the Platform, creating an
                                    account, registering for an auction or
                                    participating in bidding.
                                </p>

                                <p>
                                    By accessing or using the Platform, you
                                    confirm that you have read, understood and
                                    agreed to these Terms. If you do not agree
                                    with these Terms, you should not use the
                                    Platform.
                                </p>

                                <p>
                                    Individual auctions or lots may have
                                    additional terms. Where additional
                                    auction-specific terms apply, those terms
                                    form part of the agreement governing your
                                    participation in that auction.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="eligibility"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="02" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Eligibility and Accounts
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    You must provide accurate, complete and
                                    current information when creating an
                                    account. You are responsible for ensuring
                                    that information associated with your
                                    account remains accurate.
                                </p>

                                <p>
                                    You are responsible for maintaining the
                                    confidentiality of your account credentials
                                    and for activity carried out through your
                                    account.
                                </p>

                                <p>
                                    We may require additional information or
                                    verification before approving your
                                    registration for particular auctions.
                                </p>

                                <p>
                                    We may refuse, suspend or restrict an
                                    account where we reasonably believe that
                                    the account has been used in breach of
                                    these Terms, applicable law or auction
                                    rules.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="auction-process"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="03" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Auction Process
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    Auctions may be listed as upcoming,
                                    scheduled, live, ended or otherwise
                                    unavailable. The status displayed on the
                                    Platform is intended to communicate the
                                    current state of an auction.
                                </p>

                                <p>
                                    Each auction may contain one or more lots.
                                    Lot information may include descriptions,
                                    images, starting prices, bid increments,
                                    closing times, reserve information and
                                    other applicable conditions.
                                </p>

                                <p>
                                    We reserve the right, subject to applicable
                                    law and the relevant auction terms, to
                                    modify, postpone, suspend, withdraw or
                                    cancel an auction or individual lot.
                                </p>

                                <p>
                                    Auction times are determined by the
                                    Platform&apos;s official auction system.
                                    Displayed countdowns are provided to help
                                    participants follow the auction and should
                                    not be treated as an independent source of
                                    time.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="bidding" className="scroll-mt-24">
                            <SectionNumber number="04" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Bidding Terms
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    You must be registered and authorised to
                                    participate in an auction before placing
                                    bids.
                                </p>

                                <p>
                                    A bid must meet the minimum qualifying bid
                                    displayed by the Platform at the time it
                                    is submitted. The Platform may reject a
                                    bid that does not meet the applicable
                                    bidding requirements.
                                </p>

                                <p>
                                    Once a bid has been accepted by the
                                    Platform, it is treated as a binding
                                    commitment subject to these Terms, the
                                    applicable auction rules and applicable
                                    law.
                                </p>

                                <p>
                                    You must not place bids using another
                                    person&apos;s account, impersonate another
                                    bidder or attempt to manipulate auction
                                    activity.
                                </p>

                                <p>
                                    Bids are processed using the Platform&apos;s
                                    authoritative auction system. The
                                    information shown to you may be affected by
                                    network latency or temporary connection
                                    issues, but the Platform&apos;s recorded
                                    auction state determines whether a bid was
                                    accepted.
                                </p>

                                <p>
                                    Where anti-sniping rules apply, a
                                    qualifying bid placed near the scheduled
                                    closing time may extend the closing time of
                                    the relevant lot. The applicable extension
                                    rules will be determined by the auction
                                    configuration.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="winning" className="scroll-mt-24">
                            <SectionNumber number="05" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Winning a Lot
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    When bidding closes, the Platform
                                    determines the highest valid accepted bid
                                    according to the applicable auction rules.
                                </p>

                                <p>
                                    A lot may be subject to a reserve price. If
                                    the applicable reserve price is not met, the
                                    lot may be recorded as unsold even where
                                    valid bids have been placed.
                                </p>

                                <p>
                                    If you are determined to be the successful
                                    bidder, the relevant lot may be displayed
                                    in your account and you may receive a
                                    notification confirming the outcome.
                                </p>

                                <p>
                                    A winning bid does not remove your
                                    responsibility to comply with the
                                    settlement requirements applicable to the
                                    auction.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="settlement" className="scroll-mt-24">
                            <SectionNumber number="06" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Settlement and Payment
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    Winning lots may enter a settlement process
                                    after the relevant auction has ended.
                                    Settlement instructions will be provided
                                    through the applicable channels.
                                </p>

                                <p>
                                    Unless otherwise stated for a particular
                                    auction, winning bidders are responsible
                                    for completing all applicable settlement
                                    requirements within the stated timeframe.
                                </p>

                                <p>
                                    Additional charges, taxes, delivery costs,
                                    applicable fees or other transaction
                                    expenses may apply depending on the
                                    auction and lot. Any applicable charges
                                    will be communicated in the relevant
                                    auction terms or settlement information.
                                </p>

                                <p>
                                    Payment functionality may be introduced or
                                    changed over time. Where a third-party
                                    payment provider is used, its applicable
                                    terms may also apply to the transaction.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="lot-information"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="07" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Lot Information
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We aim to present lot descriptions,
                                    photographs and other information as
                                    accurately as reasonably possible.
                                </p>

                                <p>
                                    However, images and descriptions may not
                                    represent every characteristic, condition
                                    or detail of a lot. You should review all
                                    available information and any
                                    auction-specific terms before bidding.
                                </p>

                                <p>
                                    Where inspection or additional information
                                    is offered for a particular auction, you
                                    should make use of the available
                                    opportunity before placing a bid.
                                </p>

                                <p>
                                    Unless expressly stated otherwise, lots are
                                    offered subject to the conditions and
                                    information displayed for the relevant
                                    auction.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="platform-use" className="scroll-mt-24">
                            <SectionNumber number="08" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Use of the Platform
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    You agree to use the Platform only for
                                    lawful purposes and in accordance with
                                    these Terms.
                                </p>

                                <p>
                                    You must not attempt to interfere with the
                                    operation, security or availability of the
                                    Platform.
                                </p>

                                <p>
                                    You must not use automated systems,
                                    scraping tools, bots or other mechanisms to
                                    interfere with auction activity or gain an
                                    unfair advantage unless expressly
                                    authorised by us.
                                </p>

                                <p>
                                    You must not attempt to gain unauthorised
                                    access to accounts, systems, databases,
                                    APIs or other parts of the Platform.
                                </p>

                                <p>
                                    We may monitor activity on the Platform for
                                    security, operational and compliance
                                    purposes.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="intellectual-property"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="09" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Intellectual Property
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    Unless otherwise stated, the Platform and
                                    its content, including its branding,
                                    designs, text, graphics, software and
                                    other materials, are owned by or licensed
                                    to Unicorn Auctions.
                                </p>

                                <p>
                                    You may use the Platform for its intended
                                    purpose, but you must not reproduce,
                                    distribute, modify, sell or commercially
                                    exploit Platform content without
                                    appropriate permission.
                                </p>

                                <p>
                                    Third-party trademarks, logos and other
                                    intellectual property remain the property
                                    of their respective owners.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="liability" className="scroll-mt-24">
                            <SectionNumber number="10" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Liability
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We will take reasonable steps to operate and
                                    maintain the Platform, but we do not
                                    guarantee that the Platform will always be
                                    available, uninterrupted or error-free.
                                </p>

                                <p>
                                    We are not responsible for delays or
                                    failures caused by circumstances outside
                                    our reasonable control, including network
                                    failures, internet outages, third-party
                                    service interruptions or other technical
                                    events.
                                </p>

                                <p>
                                    Nothing in these Terms excludes or limits
                                    any liability that cannot lawfully be
                                    excluded or limited under applicable law.
                                </p>

                                <p>
                                    To the extent permitted by law, you agree
                                    that your use of the Platform and
                                    participation in auctions is undertaken at
                                    your own responsibility and subject to the
                                    applicable auction terms.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="suspension" className="scroll-mt-24">
                            <SectionNumber number="11" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Suspension and Termination
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We may suspend or restrict access to an
                                    account where we reasonably believe that
                                    the account has breached these Terms,
                                    applicable auction rules or applicable law.
                                </p>

                                <p>
                                    We may also take action where activity
                                    creates a security, operational or
                                    integrity risk to the Platform or other
                                    users.
                                </p>

                                <p>
                                    Suspension or termination does not
                                    automatically remove obligations that arose
                                    before the suspension or termination,
                                    including obligations relating to
                                    successfully completed bids or settlements.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="privacy" className="scroll-mt-24">
                            <SectionNumber number="12" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Privacy
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    Your use of the Platform may involve the
                                    collection and processing of personal
                                    information.
                                </p>

                                <p>
                                    Our Privacy Policy explains how we collect,
                                    use, store and protect personal information
                                    and should be read together with these
                                    Terms.
                                </p>

                                <p>
                                    By using the Platform, you acknowledge that
                                    your information may be processed in
                                    accordance with our Privacy Policy.
                                </p>

                                <p>
                                    <Link
                                        href="/privacy"
                                        className="font-semibold text-ink underline underline-offset-4"
                                    >
                                        Read our Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="changes" className="scroll-mt-24">
                            <SectionNumber number="13" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Changes to These Terms
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We may update these Terms from time to time
                                    to reflect changes to the Platform,
                                    services, auction processes or applicable
                                    requirements.
                                </p>

                                <p>
                                    When changes are made, the updated version
                                    will be published on this page with a
                                    revised effective or update date.
                                </p>

                                <p>
                                    Your continued use of the Platform after
                                    updated Terms are published constitutes
                                    acceptance of the revised Terms, subject
                                    to applicable law.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="contact" className="scroll-mt-24">
                            <SectionNumber number="14" />

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Contact Us
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    If you have questions about these Terms or
                                    require clarification about an auction,
                                    please contact our team.
                                </p>

                                <div className="border border-hairline p-6">
                                    <p className="font-bold text-ink">
                                        Unicorn Auctions
                                    </p>

                                    <p className="mt-3">
                                        Location: Plot 1699 Sanusi Fafunwa Street, Victoria Island, Lagos, Nigeria
                                    </p>

                                    <p className="mt-1">
                                        Email: <a href="mailto:info@unicornauctions.org"
                                            className="underline underline-offset-4 hover:text-brass">
                                            info@unicornauctions.org
                                        </a>
                                    </p>
                                </div>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 font-semibold text-ink underline underline-offset-4 hover:text-brass"
                                >
                                    Contact our team
                                    <ArrowRight className="h-4 w-4 hover:text-brass" />
                                </Link>
                            </div>
                        </section>
                    </article>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="border-t border-hairline">
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <div className="grid gap-8 border border-hairline p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline">
                                <Gavel className="h-5 w-5 text-ink" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                Ready to explore an auction?
                            </h2>

                            <p className="mt-3 max-w-2xl leading-7 text-ink/70">
                                Review our available auctions and discover the
                                lots currently open for bidding.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                            <Link
                                href="/auctions"
                                className="inline-flex items-center justify-center gap-2 border broder-ink px-6 py-3.5 text-sm font-bold transition-opacity hover:border-brass hover:text-brass"
                            >
                                Browse Auctions
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="/how-it-works"
                                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:text-brass"
                            >
                                How It Works
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function SectionNumber({ number }: { number: string }) {
    return (
        <p className="text-sm font-semibold tracking-[0.16em] text-ink/40">
            {number}
        </p>
    );
}

function Divider() {
    return <div className="my-16 border-t border-hairline md:my-20" />;
}