"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Gavel, Heart, Receipt, TicketCheck, ShieldCheck, Wallet } from "lucide-react";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Overview", icon: Gauge },
    { href: "/dashboard/bids", label: "My bids", icon: Gavel },
    { href: "/dashboard/watchlist", label: "Watchlist", icon: Heart },
    { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
    { href: "/dashboard/gate-passes", label: "Gate passes", icon: TicketCheck },
    { href: "/dashboard/kyc", label: "KYC", icon: ShieldCheck },
    { href: "/dashboard/deposit", label: "Deposit", icon: Wallet },
];

function isActive(pathname: string, href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
}

export function DashboardNav() {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile: horizontal scrollable tabs */}
            <nav className="-mx-6 flex gap-1 overflow-x-auto border-b border-hairline px-6 pb-3 text-sm md:hidden">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 transition-colors ${
                                active
                                    ? "border-brass text-ink"
                                    : "border-transparent text-ink/55 hover:text-ink"
                            }`}
                        >
                            <item.icon size={15} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Desktop: sticky sidebar */}
            <aside className="hidden md:sticky md:top-24 md:block md:self-start">
                <nav className="flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(pathname, item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 border-l-2 py-2 pl-4 text-sm transition-colors ${
                                    active
                                        ? "border-brass font-medium text-ink"
                                        : "border-transparent text-ink/60 hover:border-hairline hover:text-ink"
                                }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
