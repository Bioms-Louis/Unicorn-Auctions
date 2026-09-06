import Link from "next/link";
import {
    ArrowRight,
    Cookie,
    Database,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { TocNav } from "@/components/toc-nav";

export const metadata = { title: "Privacy Policy - Unicorn Auctions" };


const sections = [
    {
        id: "introduction",
        number: "01",
        title: "Introduction",
    },
    {
        id: "information-we-collect",
        number: "02",
        title: "Information We Collect",
    },
    {
        id: "how-we-use-information",
        number: "03",
        title: "How We Use Your Information",
    },
    {
        id: "auction-information",
        number: "04",
        title: "Auction and Bidding Information",
    },
    {
        id: "cookies",
        number: "05",
        title: "Cookies and Similar Technologies",
    },
    {
        id: "sharing",
        number: "06",
        title: "How We Share Information",
    },
    {
        id: "third-party-services",
        number: "07",
        title: "Third-Party Services",
    },
    {
        id: "data-retention",
        number: "08",
        title: "Data Retention",
    },
    {
        id: "data-security",
        number: "09",
        title: "Data Security",
    },
    {
        id: "your-rights",
        number: "10",
        title: "Your Privacy Rights",
    },
    {
        id: "children",
        number: "11",
        title: "Children's Privacy",
    },
    {
        id: "international-transfers",
        number: "12",
        title: "International Data Transfers",
    },
    {
        id: "policy-changes",
        number: "13",
        title: "Changes to This Policy",
    },
    {
        id: "contact",
        number: "14",
        title: "Contact Us",
    },
];

export default function PrivacyPolicyPage() {
    return (
        <main>
            {/* Hero */}
            <section>
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28">
                    <div className="flex flex-col justify-end border-l border-hairline pl-8 md:pl-10">
                        <div>
                            <p className="mb-4 text-sm text-brass">
                                Privacy
                            </p>

                            <h1 className="max-w-4xl text-4xl font-bold font-display tracking-tight text-ink md:text-6xl">
                                Privacy Policy
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 md:text-xl">
                                We respect your privacy and are committed to
                                handling your personal information responsibly
                                when you use Unicorn Auctions.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/50">
                                <span>
                                    Last updated: September 4, 2026
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy overview */}
            <section className="border-y border-hairline">
                <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-3">
                    <div className="border-b border-hairline p-8 md:border-b-0 md:border-r md:py-12">
                        <div className="flex h-11 w-11 items-center justify-center border border-hairline">
                            <Database className="h-5 w-5 text-ink" />
                        </div>

                        <h2 className="mt-6 text-lg font-bold font-display text-ink">
                            Your Information
                        </h2>

                        <p className="mt-2 leading-7 text-ink/65">
                            We collect information needed to operate accounts,
                            auctions and the services you request.
                        </p>
                    </div>

                    <div className="border-b border-hairline p-8 md:border-b-0 md:border-r md:py-12">
                        <div className="flex h-11 w-11 items-center justify-center border border-hairline">
                            <LockKeyhole className="h-5 w-5 text-ink" />
                        </div>

                        <h2 className="mt-6 text-lg font-bold font-display text-ink">
                            Data Security
                        </h2>

                        <p className="mt-2 leading-7 text-ink/65">
                            We use appropriate technical and organisational
                            measures designed to protect personal information.
                        </p>
                    </div>

                    <div className="p-8 md:py-12">
                        <div className="flex h-11 w-11 items-center justify-center border border-hairline">
                            <UserRound className="h-5 w-5 text-ink" />
                        </div>

                        <h2 className="mt-6 text-lg font-bold font-display text-ink">
                            Your Choices
                        </h2>

                        <p className="mt-2 leading-7 text-ink/65">
                            You may have rights concerning your personal
                            information depending on applicable law.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section>
                <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-[260px_1fr] md:gap-20 md:py-28">
                    {/* Table of contents */}
                    <aside className="md:sticky md:top-24 md:self-start">
                        <TocNav sections={sections} />
                    </aside>

                    {/* Policy */}
                    <article className="max-w-3xl">
                        <section
                            id="introduction"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="01" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Introduction
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    This Privacy Policy explains how Unicorn
                                    Auctions (&quot;Unicorn Auctions&quot;,
                                    &quot;we&quot;, &quot;us&quot; or &quot;our&quot;)
                                    collects, uses, stores and protects
                                    personal information when you use our
                                    website, auction platform and related
                                    services (collectively, the
                                    &quot;Platform&quot;).
                                </p>

                                <p>
                                    This Policy applies to visitors, registered
                                    users, bidders and other individuals who
                                    interact with the Platform.
                                </p>

                                <p>
                                    We aim to handle personal information
                                    responsibly and transparently. By using
                                    the Platform, you acknowledge the practices
                                    described in this Privacy Policy.
                                </p>

                                <p>
                                    This Policy should be read together with
                                    our{" "}
                                    <Link
                                        href="/terms"
                                        className="font-semibold font-display text-ink underline underline-offset-4 hover:text-brass"
                                    >
                                        Terms &amp; Conditions
                                    </Link>
                                    .
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="information-we-collect"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="02" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Information We Collect
                            </h2>

                            <div className="mt-6 space-y-7 leading-8 text-ink/70">
                                <PolicyBlock title="Information you provide">
                                    <p>
                                        We may collect information you provide
                                        when you create an account, register
                                        for an auction, contact us, subscribe
                                        to communications or otherwise use
                                        features of the Platform.
                                    </p>

                                    <ul className="mt-4 list-disc space-y-2 pl-6">
                                        <li>Name and contact details.</li>
                                        <li>Email address.</li>
                                        <li>Phone number.</li>
                                        <li>Account credentials.</li>
                                        <li>
                                            Auction registration information.
                                        </li>
                                        <li>
                                            Information you provide through
                                            contact or enquiry forms.
                                        </li>
                                        <li>
                                            Other information you voluntarily
                                            provide to us.
                                        </li>
                                    </ul>
                                </PolicyBlock>

                                <PolicyBlock title="Auction activity">
                                    <p>
                                        When you participate in auctions, we
                                        may collect information relating to
                                        your registrations, bids, bidding
                                        activity, winning lots and settlement
                                        status.
                                    </p>
                                </PolicyBlock>

                                <PolicyBlock title="Technical information">
                                    <p>
                                        We may automatically receive certain
                                        technical information when you use the
                                        Platform, such as browser type,
                                        device information, IP address,
                                        operating system, pages visited,
                                        referring information and information
                                        about how you interact with the
                                        Platform.
                                    </p>
                                </PolicyBlock>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="how-we-use-information"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="03" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                How We Use Your Information
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We may use personal information to provide,
                                    maintain and improve the Platform and its
                                    services.
                                </p>

                                <ul className="list-disc space-y-3 pl-6">
                                    <li>
                                        Create and manage your account.
                                    </li>
                                    <li>
                                        Authenticate users and maintain
                                        account security.
                                    </li>
                                    <li>
                                        Process auction registrations.
                                    </li>
                                    <li>
                                        Enable and administer bidding.
                                    </li>
                                    <li>
                                        Maintain accurate auction records.
                                    </li>
                                    <li>
                                        Determine and communicate auction
                                        outcomes.
                                    </li>
                                    <li>
                                        Support settlement and related
                                        processes.
                                    </li>
                                    <li>
                                        Respond to enquiries and customer
                                        support requests.
                                    </li>
                                    <li>
                                        Send important service and auction
                                        communications.
                                    </li>
                                    <li>
                                        Send newsletters or marketing
                                        communications where permitted and
                                        where you have subscribed or otherwise
                                        consented where required.
                                    </li>
                                    <li>
                                        Monitor, investigate and prevent
                                        fraudulent, abusive or unauthorised
                                        activity.
                                    </li>
                                    <li>
                                        Improve Platform performance,
                                        usability and security.
                                    </li>
                                    <li>
                                        Comply with legal and regulatory
                                        obligations.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="auction-information"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="04" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Auction and Bidding Information
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    Auction participation requires us to
                                    maintain reliable records of registrations
                                    and bidding activity.
                                </p>

                                <p>
                                    Your bid history may be associated with
                                    your account and retained as part of the
                                    official auction record.
                                </p>

                                <p>
                                    Auction records may be used to establish
                                    the validity and sequence of bids,
                                    determine auction outcomes, investigate
                                    disputes and maintain the integrity of the
                                    auction process.
                                </p>

                                <p>
                                    Certain information relating to an auction
                                    may be displayed to other participants or
                                    visitors where necessary to operate the
                                    auction. We aim to avoid publicly exposing
                                    unnecessary personal information.
                                </p>

                                <p>
                                    We may use account and auction activity to
                                    identify suspicious behaviour, enforce
                                    auction rules and protect the integrity of
                                    the Platform.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="cookies" className="scroll-mt-24">
                            <SectionNumber number="05" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Cookies and Similar Technologies
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We may use cookies and similar technologies
                                    to provide essential Platform
                                    functionality, remember preferences,
                                    maintain sessions and understand how users
                                    interact with our services.
                                </p>

                                <div className="border border-hairline p-6">
                                    <div className="flex items-start gap-4">
                                        <Cookie className="mt-1 h-5 w-5 shrink-0 text-ink" />

                                        <div>
                                            <h3 className="font-bold font-display text-ink">
                                                Essential cookies
                                            </h3>

                                            <p className="mt-2 leading-7 text-ink/70">
                                                These may be required for
                                                authentication, security and
                                                core Platform functionality.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p>
                                    Where non-essential cookies or similar
                                    technologies are used, we will provide
                                    appropriate information and choices where
                                    required by applicable law.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="sharing" className="scroll-mt-24">
                            <SectionNumber number="06" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                How We Share Information
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We do not treat your personal information
                                    as a commodity to be sold. We may share
                                    information where necessary to operate the
                                    Platform, provide requested services,
                                    protect users or comply with applicable
                                    requirements.
                                </p>

                                <p>Depending on the circumstances, this may include:</p>

                                <ul className="list-disc space-y-3 pl-6">
                                    <li>
                                        Service providers that support hosting,
                                        authentication, storage, email,
                                        communications, analytics or other
                                        Platform functions.
                                    </li>
                                    <li>
                                        Professional advisers where reasonably
                                        necessary.
                                    </li>
                                    <li>
                                        Payment or transaction service
                                        providers where payment functionality
                                        is used.
                                    </li>
                                    <li>
                                        Authorities or regulators where
                                        disclosure is required or permitted
                                        by applicable law.
                                    </li>
                                    <li>
                                        Other parties where necessary to
                                        protect our rights, users, property or
                                        Platform.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="third-party-services"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="07" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Third-Party Services
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    The Platform may rely on third-party
                                    providers for infrastructure, authentication,
                                    database services, content management,
                                    forms, communications and other technical
                                    functions.
                                </p>

                                <p>
                                    For example, information submitted through
                                    certain website enquiry or newsletter forms
                                    may be processed by our form service
                                    provider.
                                </p>

                                <p>
                                    Third-party providers may process
                                    information according to their own privacy
                                    policies and contractual obligations.
                                </p>

                                <p>
                                    We aim to select service providers
                                    appropriate for the nature of the services
                                    they provide and the information they
                                    process.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="data-retention" className="scroll-mt-24">
                            <SectionNumber number="08" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Data Retention
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We retain personal information only for as
                                    long as reasonably necessary for the
                                    purposes described in this Policy,
                                    including providing services, maintaining
                                    records, resolving disputes and complying
                                    with legal or regulatory obligations.
                                </p>

                                <p>
                                    Auction and bidding records may need to be
                                    retained for longer periods because they
                                    form part of the Platform&apos;s transaction
                                    and audit history.
                                </p>

                                <p>
                                    When information is no longer required, we
                                    may delete it, anonymise it or otherwise
                                    securely dispose of it, subject to
                                    applicable retention requirements.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="data-security" className="scroll-mt-24">
                            <SectionNumber number="09" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Data Security
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We use reasonable technical and
                                    organisational measures designed to protect
                                    personal information against unauthorised
                                    access, alteration, disclosure, loss or
                                    destruction.
                                </p>

                                <p>
                                    Security measures may include access
                                    controls, authentication, encryption where
                                    appropriate, logging, monitoring and
                                    database security controls.
                                </p>

                                <p>
                                    However, no internet transmission or
                                    electronic storage system can be guaranteed
                                    to be completely secure.
                                </p>

                                <p>
                                    You are responsible for protecting your
                                    account credentials and should notify us if
                                    you believe your account has been
                                    compromised.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="your-rights" className="scroll-mt-24">
                            <SectionNumber number="10" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Your Privacy Rights
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    Depending on applicable law, you may have
                                    rights concerning your personal
                                    information.
                                </p>

                                <ul className="list-disc space-y-3 pl-6">
                                    <li>
                                        Request access to personal information
                                        we hold about you.
                                    </li>
                                    <li>
                                        Request correction of inaccurate or
                                        incomplete information.
                                    </li>
                                    <li>
                                        Request deletion of personal
                                        information where applicable.
                                    </li>
                                    <li>
                                        Request restriction of certain
                                        processing where applicable.
                                    </li>
                                    <li>
                                        Object to certain processing where
                                        applicable.
                                    </li>
                                    <li>
                                        Withdraw consent where processing is
                                        based on consent, subject to applicable
                                        limitations.
                                    </li>
                                    <li>
                                        Request information about how your
                                        personal information is processed.
                                    </li>
                                </ul>

                                <p>
                                    Some rights may be subject to exceptions or
                                    limitations, particularly where we are
                                    required to retain information for legal,
                                    security, contractual or legitimate
                                    business purposes.
                                </p>

                                <p>
                                    To exercise a privacy-related right,
                                    contact us using the details in the
                                    <a
                                        href="#contact"
                                        className="ml-1 font-semibold font-display text-ink underline underline-offset-4 hover:text-brass"
                                    >
                                        Contact Us
                                    </a>{" "}
                                    section.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="children" className="scroll-mt-24">
                            <SectionNumber number="11" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Children&apos;s Privacy
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    The Platform is not intended for individuals
                                    who are not legally eligible to participate
                                    in auctions under applicable law.
                                </p>

                                <p>
                                    We do not knowingly collect personal
                                    information from children where such
                                    collection is prohibited by applicable law.
                                </p>

                                <p>
                                    If you believe that a child has provided us
                                    with personal information in circumstances
                                    where it should not have been collected,
                                    please contact us so that we can review the
                                    matter.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="international-transfers"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="12" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                International Data Transfers
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    Some of our technology and service
                                    providers may process information in
                                    countries outside Nigeria.
                                </p>

                                <p>
                                    Where personal information is transferred
                                    or processed across borders, we will seek
                                    to do so in accordance with applicable
                                    privacy and data protection requirements.
                                </p>

                                <p>
                                    By using the Platform, you acknowledge that
                                    information may be processed by service
                                    providers operating in different
                                    jurisdictions, subject to appropriate
                                    safeguards where required.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section
                            id="policy-changes"
                            className="scroll-mt-24"
                        >
                            <SectionNumber number="13" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Changes to This Policy
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    We may update this Privacy Policy from time
                                    to time to reflect changes to our services,
                                    technology, legal requirements or data
                                    practices.
                                </p>

                                <p>
                                    When we make changes, we will update the
                                    &quot;Last updated&quot; date at the top of
                                    this page.
                                </p>

                                <p>
                                    Where required, we may provide additional
                                    notice or obtain consent for material
                                    changes.
                                </p>

                                <p>
                                    We encourage you to review this page
                                    periodically so that you remain informed
                                    about how we handle personal information.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        <section id="contact" className="scroll-mt-24">
                            <SectionNumber number="14" />

                            <h2 className="mt-3 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Contact Us
                            </h2>

                            <div className="mt-6 space-y-5 leading-8 text-ink/70">
                                <p>
                                    If you have questions about this Privacy
                                    Policy, want to exercise an applicable
                                    privacy right or have concerns about how
                                    your personal information is handled,
                                    please contact us.
                                </p>

                                <div className="border border-hairline p-6 md:p-7">
                                    <div className="flex items-start gap-4">
                                        <Mail className="mt-1 h-5 w-5 shrink-0 text-ink" />

                                        <div>
                                            <p className="font-bold font-display text-ink">
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
                                    </div>
                                </div>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 font-semibold font-display text-ink underline underline-offset-4 hover:text-brass"
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
                            <div className="flex h-10 w-10 items-center justify-center border border-hairline">
                                <ShieldCheck className="h-5 w-5 text-ink" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold font-display tracking-tight text-ink md:text-3xl">
                                Questions about your privacy?
                            </h2>

                            <p className="mt-3 max-w-2xl leading-7 text-ink/70">
                                If you have questions about how your information
                                is handled, our team is available to help.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3.5 text-sm font-bold transition-opacity hover:border-brass hover:text-brass"
                            >
                                Contact Us
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="/terms"
                                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-ink/70 transition-colors hover:text-brass"
                            >
                                Terms &amp; Conditions
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

function PolicyBlock({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="text-lg font-bold text-ink">{title}</h3>
            <div className="mt-3">{children}</div>
        </div>
    );
}