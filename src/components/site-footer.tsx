export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Unicorn Auctions.</p>
      </div>
    </footer>
  );
}
