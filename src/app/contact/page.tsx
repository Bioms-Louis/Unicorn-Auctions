"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Check,
    HelpCircle,
    Mail,
    MapPin,
    Phone,
    Send,
} from "lucide-react";

const contactReasons = [
    "General Enquiry",
    "Auction Enquiry",
    "Bidding Support",
    "Registration Support",
    "Lot Enquiry",
    "Technical Support",
    "Partnership Enquiry",
    "Other",
];

const faqs = [
    {
        question: "How do I register for an auction?",
        answer:
            "Create an account, open the auction you are interested in and complete the registration process. Some auctions may require approval before you can participate.",
    },
    {
        question: "I have a question about a particular lot.",
        answer:
            "Include the auction and lot number in your message so our team can identify the item and provide the most relevant assistance.",
    },
    {
        question: "I am having trouble placing a bid.",
        answer:
            "Make sure you are signed in, registered for the auction and that the auction and lot are currently live. If the issue continues, contact our support team.",
    },
    {
        question: "Can I contact you about consigning an item?",
        answer:
            "Yes. Select the relevant enquiry type in the contact form and provide details about the item or collection you would like to discuss.",
    },
];

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSubmitting(true);
        setIsSuccess(false);
        setError("");

        const form = event.currentTarget;
        const formData = new FormData(form);

        formData.append(
            "access_key",
            process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || ""
        );

        formData.append(
            "subject",
            `New Contact Enquiry - ${formData.get("reason") || "General Enquiry"}`
        );

        formData.append("from_name", "Auction Platform Website");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setIsSuccess(true);
                form.reset();
            } else {
                setError(
                    result.message ||
                        "Something went wrong while sending your message. Please try again."
                );
            }
        } catch {
            setError(
                "We could not send your message right now. Please check your connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main>
            {/* Hero */}
            <section>
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:py-28">
                    <div className="flex flex-col justify-end border-l border-hairline pl-8 md:pl-10">
                        <dl className="space-y-6">
                            <div>
                                <dt className="mb-4 text-sm tracking-[0.2em] text-brass">
                                    Get In Touch
                                </dt>

                                <dd>
                                    <h1 className="font-display max-w-3xl text-4xl font-bold tracking-tight text-ink md:text-6xl">
                                        Contact Us
                                    </h1>

                                    <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 md:text-xl">
                                        Have a question about an auction, a
                                        lot, registration or bidding? Send us a
                                        message and our team will get back to
                                        you.
                                    </p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* Contact overview */}
            <section className="border-y border-hairline">
                <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-3">
                    <div className="border-b border-hairline p-8 md:border-b-0 md:border-r md:py-12">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline">
                            <Mail className="h-5 w-5 text-ink" />
                        </div>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
                            Email
                        </p>

                        <h3 className="font-display mt-2 leading-7 font-bold text-lg text-brass">
                            <a href="mailto:info@unicornauctions.org">
                                info@unicornauctions.org
                            </a>
                        </h3>
                    </div>

                    <div className="border-b border-hairline p-8 md:border-b-0 md:border-r md:py-12">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline">
                            <Phone className="h-5 w-5 text-ink" />
                        </div>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
                            Call
                        </p>

                        <h3 className="font-display mt-2 leading-7 font-bold text-lg text-brass">
                            <a href="tel:+2348033124399">08033124399</a>, <a href="tel:+2348026222555">08026222555</a>
                        </h3>
                    </div>

                    <div className="p-8 md:py-12">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline">
                            <MapPin className="h-5 w-5 text-ink" />
                        </div>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
                            Location
                        </p>

                        <h3 className="font-display mt-2 leading-7 font-bold text-lg text-brass">
                            Plot 1699 Sanusi Fafunwa Street, Victoria Island, Lagos, Nigeria.
                        </h3>
                    </div>
                </div>
            </section>

            {/* Main contact section */}
            <section>
                <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-[0.7fr_1.3fr] md:gap-20 md:py-28">
                    {/* Left information */}
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                            Let&apos;s Talk
                        </p>

                        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                            How can we help?
                        </h2>

                        <p className="mt-5 leading-8 text-ink/70">
                            Whether you have a question about an upcoming
                            auction or need help with your account, send us
                            the details and our team will point you in the
                            right direction.
                        </p>

                        <div className="mt-10 space-y-7">
                            <div className="flex gap-4">
                                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline">
                                    <Mail className="h-4 w-4 text-ink" />
                                </div>

                                <div>
                                    <p className="font-bold text-ink">
                                        General enquiries
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-ink/60">
                                        Questions about the platform, auctions
                                        or our services.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline">
                                    <Phone className="h-4 w-4 text-ink" />
                                </div>

                                <div>
                                    <p className="font-bold text-ink">
                                        Auction support
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-ink/60">
                                        Need assistance with registration,
                                        bidding or a particular lot?
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline">
                                    <HelpCircle className="h-4 w-4 text-ink" />
                                </div>

                                <div>
                                    <p className="font-bold text-ink">
                                        Before contacting us
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-ink/60">
                                        You may find the answer in our How It
                                        Works guide.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                            <Link
                                href="/how-it-works"
                                className="inline-flex items-center justify-center gap-2 border border-ink px-5 py-3 text-sm font-bold text-ink transition-colors hover:border-brass hover:text-brass"
                            >
                                How It Works
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="/auctions"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-ink transition-colors hover:text-brass"
                            >
                                Browse Auctions
                            </Link>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="border border-hairline p-6 md:p-8">
                        {isSuccess ? (
                            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white">
                                    <Check className="h-6 w-6" />
                                </div>

                                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                                    Message Sent
                                </p>

                                <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink">
                                    Thank you for reaching out.
                                </h2>

                                <p className="mt-4 max-w-md leading-7 text-ink/70">
                                    Your message has been received. Our team
                                    will review your enquiry and get back to
                                    you as soon as possible.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() => setIsSuccess(false)}
                                        className="inline-flex items-center justify-center border border-ink px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-brass hover:text-brass"
                                    >
                                        Send Another Message
                                    </button>

                                    <Link
                                        href="/auctions"
                                        className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                                    >
                                        Browse Auctions
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                                        Send A Message
                                    </p>

                                    <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-ink md:text-3xl">
                                        Tell us what you need.
                                    </h2>

                                    <p className="mt-3 leading-7 text-ink/70">
                                        Complete the form below and we&apos;ll
                                        get your enquiry to the right team.
                                    </p>
                                </div>

                                {error && (
                                    <div
                                        role="alert"
                                        className="mt-8 border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-800"
                                    >
                                        {error}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-8 space-y-6"
                                >
                                    {/* Web3Forms redirect prevention */}
                                    <input
                                        type="hidden"
                                        name="redirect"
                                        value=""
                                    />

                                    {/* Honeypot */}
                                    <input
                                        type="checkbox"
                                        name="botcheck"
                                        className="hidden"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="text-sm font-semibold text-ink"
                                            >
                                                Full Name
                                            </label>

                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                autoComplete="name"
                                                placeholder="Your full name"
                                                className="mt-2 w-full border border-hairline bg-transparent px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-semibold text-ink"
                                            >
                                                Email Address
                                            </label>

                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                className="mt-2 w-full border border-hairline bg-transparent px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="text-sm font-semibold text-ink"
                                            >
                                                Phone Number
                                                <span className="ml-1 font-normal text-ink/40">
                                                    (Optional)
                                                </span>
                                            </label>

                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                placeholder="+234..."
                                                className="mt-2 w-full border border-hairline bg-transparent px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="reason"
                                                className="text-sm font-semibold text-ink"
                                            >
                                                Enquiry Type
                                            </label>

                                            <select
                                                id="reason"
                                                name="reason"
                                                required
                                                defaultValue=""
                                                className="mt-2 w-full appearance-none border border-hairline bg-transparent px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-ink"
                                            >
                                                <option value="" disabled>
                                                    Select an enquiry type
                                                </option>

                                                {contactReasons.map((reason) => (
                                                    <option
                                                        key={reason}
                                                        value={reason}
                                                    >
                                                        {reason}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="auction"
                                            className="text-sm font-semibold text-ink"
                                        >
                                            Auction / Lot
                                            <span className="ml-1 font-normal text-ink/40">
                                                (Optional)
                                            </span>
                                        </label>

                                        <input
                                            id="auction"
                                            name="auction"
                                            type="text"
                                            placeholder="Auction name, lot number or reference"
                                            className="mt-2 w-full border border-hairline bg-transparent px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="text-sm font-semibold text-ink"
                                        >
                                            Subject
                                        </label>

                                        <input
                                            id="subject"
                                            name="user_subject"
                                            type="text"
                                            required
                                            placeholder="What can we help you with?"
                                            className="mt-2 w-full border border-hairline bg-transparent px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="text-sm font-semibold text-ink"
                                        >
                                            Message
                                        </label>

                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={7}
                                            placeholder="Tell us how we can help..."
                                            className="mt-2 w-full resize-y border border-hairline bg-transparent px-4 py-3.5 text-sm leading-7 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink"
                                        />
                                    </div>

                                    <div className="border-t border-hairline pt-6">
                                        <p className="text-xs leading-5 text-ink/50">
                                            By submitting this form, you agree
                                            that we may use the information you
                                            provide to respond to your enquiry.
                                        </p>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-ink px-6 py-4 text-sm font-bold text-ink transition-opacity hover:text-brass hover:border-brass disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    Sending Message...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="border-y border-hairline">
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr]">
                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline">
                                <HelpCircle className="h-5 w-5 text-ink" />
                            </div>

                            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                                Quick Help
                            </p>

                            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                                Before you contact us
                            </h2>

                            <p className="mt-5 leading-8 text-ink/70">
                                You may find the answer to your question below.
                                If not, send us a message and we&apos;ll be
                                happy to help.
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

            {/* Final CTA */}
            <section>
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <div className="border border-hairline p-8 md:p-12">
                        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
                                    Ready To Bid?
                                </p>

                                <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                                    Explore our latest auctions.
                                </h2>

                                <p className="mt-4 max-w-2xl leading-7 text-ink/70">
                                    Find an auction, discover the lots and
                                    register to participate in live bidding.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                                <Link
                                    href="/auctions"
                                    className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3.5 text-sm font-bold text-ink transition-opacity hover:text-brass hover:border-brass"
                                >
                                    Browse Auctions
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:text-brass"
                                >
                                    Create Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}