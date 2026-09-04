import Link from "next/link";

const NAV = [
  { href: "/auctions", label: "Auctions" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/partners", label: "For partners" },
  { href: "/brokers", label: "For brokers" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl tracking-tight text-ink">
          Unicorn Auctions
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink/80 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/sign-in" className="text-ink/80 hover:text-ink">
            Sign in
          </Link>
          <Link
            href="/register"
            className="border border-ink px-4 py-2 text-ink transition hover:border-brass hover:text-brass"
          >
            Register to bid
          </Link>
        </div>
      </div>
    </header>
  );
}
