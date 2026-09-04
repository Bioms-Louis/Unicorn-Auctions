import Link from "next/link";
import {
    ArrowRight,
    Check,
    Clock3,
    Gavel,
    HelpCircle,
    Mail,
    ShieldCheck,
    UserPlus,
} from "lucide-react";

const steps = [
    {
        number: "01",
        icon: UserPlus,
        title: "Create your account",
        description:
            "Create your account with your details and verify your email address. Your account gives you access to auctions, registrations, bidding and your personal dashboard.",
    },
    {
        number: "02",
        icon: Gavel,
        title: "Find an auction",
        description:
            "Browse upcoming, live and completed auctions. Open an auction to explore its lots, review the descriptions, images, starting prices and bidding information.",
    },
    {
        number: "03",
        icon: Check,
        title: "Register to bid",
        description:
            "Select an auction and register to participate. Some auctions may require your registration to be reviewed and approved before you can place bids.",
    },
    {
        number: "04",
        icon: Gavel,
        title: "Place your bid",
        description:
            "When the auction is live, choose an eligible lot and place a bid that meets the displayed minimum bid. Your bid is securely validated before it is accepted.",
    },
    {
        number: "05",
        icon: Clock3,
        title: "Follow the auction live",
        description:
            "Watch the current bid and countdown update in real time. If another bidder places a higher bid, you can respond with a new qualifying bid while the lot remains live.",
    },
    {
        number: "06",
        icon: ShieldCheck,
        title: "Win and settle",
        description:
            "When bidding closes, the highest valid bidder wins where the reserve price has been met. Winning lots then move into the settlement process.",
    },
];

const faqs = [
    {
        question: "Do I need an account to place a bid?",
        answer:
            "Yes. You need an account and must be eligible to participate in the relevant auction before you can place a bid.",
    },
    {
        question: "How do I know the minimum amount I can bid?",
        answer:
            "Each live lot displays its current bid and minimum next bid. Your bid must meet the minimum amount calculated from the current auction state and bid increment.",
    },
    {
        question: "What happens if I am outbid?",
        answer:
            "The live auction interface will reflect the new highest bid. You can place another qualifying bid while the lot remains open and you are still eligible to participate.",
    },
    {
        question: "What happens when the countdown reaches zero?",
        answer:
            "The auction system stops accepting bids once the lot has officially ended. The highest valid bid is then used to determine the winner, subject to the auction's rules and reserve price.",
    },
    {
        question: "Can an auction be extended?",
        answer:
            "Yes. The platform supports anti-sniping protection. A qualifying bid placed during the final period of a lot can extend its closing time, giving other eligible bidders an opportunity to respond.",
    },
    {
        question: "What currency are bids displayed in?",
        answer:
            "All auction values are displayed in Nigerian Naira (NGN / ₦).",
    },
];

export default function HowItWorksPage() {
    return (
        <main>
            {/* Hero */}
            <section>
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28">
                    <div className="flex flex-col justify-end border-l border-hairline pl-8 md:pl-10">
                        <dl className="space-y-6">
                            <div>
                                <dt className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
                                    The Auction Process
                                </dt>

                                <dd>
                                    <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-ink md:text-6xl">
                                        How It Works
                                    </h1>

                                    <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 md:text-xl">
                                        From creating your account to winning a
                                        lot, discover how to participate in live
                                        auctions on our platform.
                                    </p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* Quick overview */}
            <section className="border-y border-hairline">
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:py-16">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
                            01
                        </p>
                        <h2 className="mt-3 text-xl font-bold text-ink">
                            Discover
                        </h2>
                        <p className="mt-2 leading-7 text-ink/70">
                            Explore upcoming and live auctions and find the
                            lots you want to bid on.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
                            02
                        </p>
                        <h2 className="mt-3 text-xl font-bold text-ink">
                            Participate
                        </h2>
                        <p className="mt-2 leading-7 text-ink/70">
                            Register for an auction and participate in live
                            bidding when it opens.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
                            03
                        </p>
                        <h2 className="mt-3 text-xl font-bold text-ink">
                            Win
                        </h2>
                        <p className="mt-2 leading-7 text-ink/70">
                            If you hold the highest valid bid when the lot
                            closes and the reserve is met, the lot is yours.
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section>
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                            Step by Step
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                            Your journey from registration to winning
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-ink/70">
                            The process is straightforward. Create an account,
                            register for an auction, bid when the lots go live,
                            and keep an eye on the auction until it closes.
                        </p>
                    </div>

                    <div className="mt-16 divide-y divide-hairline border-y border-hairline">
                        {steps.map((step) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.number}
                                    className="grid gap-8 py-10 md:grid-cols-[80px_56px_1fr] md:items-start"
                                >
                                    <span className="text-sm font-semibold tracking-[0.16em] text-ink/40">
                                        {step.number}
                                    </span>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline">
                                        <Icon className="h-5 w-5 text-ink" />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold text-ink">
                                            {step.title}
                                        </h3>

                                        <p className="mt-3 max-w-2xl leading-7 text-ink/70">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Live bidding */}
            <section className="border-y border-hairline">
                <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                            Live Bidding
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                            Built for real-time auctions
                        </h2>

                        <p className="mt-5 leading-8 text-ink/70">
                            When a lot goes live, the bidding interface keeps
                            you informed of the current auction state. Bid
                            amounts, bid activity and the remaining time are
                            updated in real time.
                        </p>

                        <div className="mt-8 space-y-4">
                            {[
                                "Bids are validated securely on the server.",
                                "The current bid is updated in real time.",
                                "The minimum next bid is always displayed.",
                                "Your bid is only confirmed after successful processing.",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-3"
                                >
                                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                                        <Check className="h-3 w-3" />
                                    </div>

                                    <p className="text-ink/75">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Example bid panel */}
                    <div className="border border-hairline bg-ink p-6 text-white md:p-8">
                        <div className="flex items-center justify-between border-b border-white/20 pb-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                                    Live Lot
                                </p>
                                <p className="mt-2 font-semibold">
                                    Lot 024
                                </p>
                            </div>

                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-white/60">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                Live
                            </span>
                        </div>

                        <div className="py-8">
                            <p className="text-sm text-white/50">
                                Current Bid
                            </p>

                            <p className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                                ₦850,000
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-white/40">
                                        Next Minimum
                                    </p>
                                    <p className="mt-2 text-lg font-semibold">
                                        ₦875,000
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-white/40">
                                        Ends In
                                    </p>
                                    <p className="mt-2 text-lg font-semibold">
                                        01:42
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/20 pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/50">
                                    Minimum qualifying bid
                                </span>

                                <span className="font-semibold">
                                    ₦875,000
                                </span>
                            </div>

                            <Link
                                href="/auctions"
                                className="mt-5 flex w-full items-center justify-center gap-2 bg-white px-5 py-3.5 text-sm font-bold text-ink transition-opacity hover:opacity-90"
                            >
                                Explore Auctions
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bidding rules */}
            <section>
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                                Before You Bid
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                                Know the rules
                            </h2>

                            <p className="mt-5 leading-8 text-ink/70">
                                Every auction can have its own terms and
                                conditions. Review the auction and lot details
                                before placing a bid.
                            </p>
                        </div>

                        <div className="divide-y divide-hairline border-y border-hairline">
                            <div className="py-6">
                                <h3 className="font-bold text-ink">
                                    Bids are binding
                                </h3>
                                <p className="mt-2 leading-7 text-ink/70">
                                    Only place a bid when you are prepared to
                                    honour the applicable auction terms if you
                                    are successful.
                                </p>
                            </div>

                            <div className="py-6">
                                <h3 className="font-bold text-ink">
                                    Bid increments apply
                                </h3>
                                <p className="mt-2 leading-7 text-ink/70">
                                    Each lot has a minimum bid increment. Your
                                    bid must meet the minimum amount shown by
                                    the live bidding interface.
                                </p>
                            </div>

                            <div className="py-6">
                                <h3 className="font-bold text-ink">
                                    Reserve prices may apply
                                </h3>
                                <p className="mt-2 leading-7 text-ink/70">
                                    A lot may have a reserve price. If the
                                    reserve is not met, the lot may remain
                                    unsold even when bidding has ended.
                                </p>
                            </div>

                            <div className="py-6">
                                <h3 className="font-bold text-ink">
                                    Auction extensions may occur
                                </h3>
                                <p className="mt-2 leading-7 text-ink/70">
                                    Qualifying bids placed near the end of a
                                    lot may extend its closing time under the
                                    platform&apos;s anti-sniping rules.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* After winning */}
            <section className="border-y border-hairline">
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                            After the Auction
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                            What happens when you win?
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-ink/70">
                            Once a lot closes, the platform determines the
                            highest valid bidder based on the final auction
                            state and applicable auction rules.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        <div className="border border-hairline p-7 shadow-lg">
                            <span className="text-sm font-semibold text-ink/40">
                                01
                            </span>
                            <h3 className="mt-5 text-xl font-bold text-ink">
                                Winner confirmed
                            </h3>
                            <p className="mt-3 leading-7 text-ink/70">
                                If your bid is the highest valid bid and the
                                applicable reserve has been met, the lot is
                                marked as sold to you.
                            </p>
                        </div>

                        <div className="border border-hairline p-7 shadow-lg">
                            <span className="text-sm font-semibold text-ink/40">
                                02
                            </span>
                            <h3 className="mt-5 text-xl font-bold text-ink">
                                Settlement
                            </h3>
                            <p className="mt-3 leading-7 text-ink/70">
                                Your winning lot moves into the settlement
                                process, where the relevant next steps are
                                provided.
                            </p>
                        </div>

                        <div className="border border-hairline p-7 shadow-lg">
                            <span className="text-sm font-semibold text-ink/40">
                                03
                            </span>
                            <h3 className="mt-5 text-xl font-bold text-ink">
                                Complete your purchase
                            </h3>
                            <p className="mt-3 leading-7 text-ink/70">
                                Follow the settlement instructions to complete
                                the transaction and arrange the next steps for
                                your winning lot.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section>
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr]">
                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline">
                                <HelpCircle className="h-5 w-5 text-ink" />
                            </div>

                            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                                FAQ
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                                Frequently asked questions
                            </h2>

                            <p className="mt-5 leading-8 text-ink/70">
                                Have another question? Our team is here to
                                help.
                            </p>
                        </div>

                        <div className="divide-y divide-hairline border-y border-hairline">
                            {faqs.map((faq) => (
                                <details
                                    key={faq.question}
                                    className="group py-6"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold text-ink [&::-webkit-details-marker]:hidden">
                                        {faq.question}

                                        <span className="text-2xl font-normal text-ink/40 transition-transform group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>

                                    <p className="mt-4 max-w-2xl leading-7 text-ink/70">
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="border-t border-hairline">
                <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
                    <div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline">
                            <Mail className="h-5 w-5 text-ink" />
                        </div>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                            Need Help?
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                            We&apos;re here to help.
                        </h2>

                        <p className="mt-5 max-w-lg leading-8 text-ink/70">
                            If you have questions about registration, bidding,
                            an auction or a particular lot, get in touch with
                            our team.
                        </p>

                        <Link
                            href="/contact"
                            className="mt-8 inline-flex items-center gap-2 border border-ink px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-brass hover:text-brass"
                        >
                            Contact Us
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="border border-hairline shadow-lg p-6 md:p-8">
                        <h3 className="text-xl font-bold text-ink">
                            Ready to start?
                        </h3>

                        <p className="mt-3 leading-7 text-ink/70">
                            Create your account and explore the latest
                            auctions available on the platform.
                        </p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center border border-ink gap-2 px-6 py-3.5 text-sm font-medium text-ink transition-opacity hover:border-brass hover:text-brass"
                            >
                                Create Account
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="/auctions"
                                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:text-brass"
                            >
                                Browse Auctions
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}