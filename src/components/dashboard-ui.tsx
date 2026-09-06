export function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline py-4">
      {children}
    </div>
  );
}

export function EmptyRow({ children }: { children: React.ReactNode }) {
  return <p className="border-b border-hairline py-6 text-sm text-muted">{children}</p>;
}
