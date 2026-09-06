"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
    ArrowRight,
    Mail,
    MapPin,
    Phone,
    Check,
    X
} from "lucide-react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";
import Image from "next/image";

const menu = [
    { label: "Auctions", href: "/auctions" },
    { label: "Contact Us", href: "/contact" },
    { label: "How it works", href: "/how-it-works" },
    { label: "For Partners", href: "/partners" },
    { label: "For Brokers", href: "/brokers" },
];

const legal = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
];

export function SiteFooter() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleNewsletterSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setIsSubmitting(true);
        setIsSuccess(false);
        setError("");

        const formData = new FormData();
        formData.append(
            "access_key",
            process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || ""
        );
        formData.append("email", email);
        formData.append("subject", "New Newsletter Subscription");
        formData.append("from_name", "Unicorn Auctions Newsletter");
        formData.append("form_type", "Newsletter Subscription");

        try {
            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    body: formData,
                }
            );

            const result = await response.json();

            if (result.success) {
                setIsSuccess(true);
                setEmail("");
            } else {
                setError(
                    result.message ||
                        "Unable to subscribe right now. Please try again."
                );
            }
        } catch {
            setError(
                "Something went wrong. Please check your connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <footer className="border-t border-hairline bg-brass text-ink">
            <div className="mx-auto max-w-6xl px-6">
                {/* Main footer */}
                <div className="grid gap-14 py-16 md:grid-cols-[1.3fr_0.7fr_0.9fr_1.2fr] md:py-20">
                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            className="inline-block font-display text-2xl font-bold tracking-tight"
                        >
                            <Image
                                src="/images/auctions-logo-2.jfif"
                                alt="Unicorn Auctions"
                                width={160}
                                height={50}
                                className="h-auto w-40 object-contain"
                                priority
                            />
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                            A modern auction platform connecting bidders with
                            exceptional lots and live auctions.
                        </p>

                        {/* Social media */}
                        <div className="mt-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                                Follow Us
                            </p>

                            <div className="mt-4 flex items-center text-white/65 gap-3">
                                <Link
                                    href="https://instagram.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex h-10 w-10 items-center justify-center border border-white/15 transition-colors hover:border-white hover:bg-white hover:text-ink"
                                >
                                    <FaInstagram className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="https://facebook.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="flex h-10 w-10 items-center justify-center border border-white/15 transition-colors hover:border-white hover:bg-white hover:text-ink"
                                >
                                    <FaFacebookF className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="https://linkedin.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="flex h-10 w-10 items-center justify-center border border-white/15 transition-colors hover:border-white hover:bg-white hover:text-ink"
                                >
                                    <FaLinkedinIn className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="https://x.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="X"
                                    className="flex h-10 w-10 items-center justify-center border border-white/15 transition-colors hover:border-white hover:bg-white hover:text-ink"
                                >
                                    <FaXTwitter className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Menu */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                            Explore
                        </p>

                        <nav className="mt-5 flex flex-col gap-3">
                            {menu.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white"
                                >
                                    <span>{item.label}</span>
                                    <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                            Contact
                        </p>

                        <div className="mt-5 space-y-5">
                            <a
                                href="mailto:info@unicornauctions.org"
                                className="flex items-start gap-3 text-sm text-white/65 transition-colors hover:text-white"
                            >
                                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>
                                    info@unicornauctions.org
                                </span>
                            </a>

                            <a
                                href="tel:+2348033124399"
                                className="flex items-start gap-3 text-sm text-white/65 transition-colors hover:text-white"
                            >
                                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>08033124399</span>
                            </a>

                            <div className="flex items-start gap-3 text-sm text-white/65">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>
                                    Plot 1699 Sanusi Fafunwa Street, Victoria Island, Lagos, Nigeria.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                            Newsletter
                        </p>


                        <p className="mt-3 text-sm leading-7 text-white/60">
                            Get updates about upcoming auctions, featured lots
                            and important auction announcements.
                        </p>

                        {isSuccess ? (
                            <div className="mt-6 border border-white/15 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-ink">
                                        <Check className="h-3.5 w-3.5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            You&apos;re subscribed.
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-white/50">
                                            Thank you for joining our
                                            newsletter.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsSuccess(false)}
                                        aria-label="Close success message"
                                        className="ml-auto text-white/40 transition-colors hover:text-white"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleNewsletterSubmit}
                                className="mt-6"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <label
                                        htmlFor="newsletter-email"
                                        className="sr-only"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="newsletter-email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="Your email address"
                                        className="min-w-0 flex-1 border border-white/15 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white"
                                    />

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        aria-label="Subscribe to newsletter"
                                        className="flex items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting
                                            ? "Sending..."
                                            : "Subscribe"}
                                        {!isSubmitting && (
                                            <ArrowRight className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {error && (
                                    <p
                                        role="alert"
                                        className="mt-3 text-xs leading-5 text-white/70"
                                    >
                                        {error}
                                    </p>
                                )}

                                <p className="mt-3 text-xs leading-5 text-white">
                                    By subscribing, you agree to receive
                                    updates from Unicorn Auctions.
                                </p>
                            </form>
                        )}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col gap-5 border-t border-white/10 py-7 text-xs text-white md:flex-row md:items-center md:justify-between">
                    <p>
                        &copy; {new Date().getFullYear()} Unicorn Auctions.
                        All rights reserved.
                    </p>

                    <div className="flex flex-wrap gap-5">
                        {legal.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="transition-colors hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}