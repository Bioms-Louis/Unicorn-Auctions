import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTopButton } from "@/components/scroll-to-top";
import { getHeaderUser } from "@/lib/auth/current-user";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unicorn Auctions",
  description:
    "Unicorn Auctions runs hybrid live auctions where floor and online bidders compete in one synchronized bidding process.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerUser = await getHeaderUser();

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink">
        <SiteHeader user={headerUser} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
