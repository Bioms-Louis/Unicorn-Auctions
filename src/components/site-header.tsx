"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/auctions", label: "Auctions" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/partners", label: "For partners" },
  { href: "/brokers", label: "For brokers" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-ink"
          onClick={() => setOpen(false)}
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

        <nav className="hidden items-center gap-8 text-sm text-ink/80 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brass">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/sign-in" className="text-ink/80 hover:border-brass hover:text-brass">
            Sign in
          </Link>
          <Link
            href="/register"
            className="border border-ink px-4 py-2 text-ink transition hover:border-brass hover:text-brass"
          >
            Register to bid
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-ink md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-hairline px-6 py-4 text-sm md:hidden"
        >
          <ul className="flex flex-col gap-5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-ink/80 hover:text-brass"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 border-t border-hairline pt-4">
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-center text-ink transition hover:border-brass hover:text-brass"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="border border-ink px-4 py-2 text-center text-ink transition hover:border-brass hover:text-brass"
            >
              Register to bid
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
