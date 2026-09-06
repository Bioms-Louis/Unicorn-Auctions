import { getCurrentBidder } from "@/lib/bidders/current-bidder";
import { getBidderInvoices } from "@/lib/bidders/dashboard-queries";
import { formatNaira, kobo } from "@/lib/money";
import { Row, EmptyRow } from "@/components/dashboard-ui";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  issued: "Issued",
  partially_paid: "Partially paid",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export default async function InvoicesPage() {
  const { bidder } = await getCurrentBidder();
  const invoices = await getBidderInvoices(bidder.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Invoices</h1>
      <p className="mt-2 text-sm text-ink/70">Statements issued for lots you&apos;ve won.</p>

      <div className="mt-8 border-t border-hairline">
        {invoices.length === 0 ? (
          <EmptyRow>No invoices yet.</EmptyRow>
        ) : (
          invoices.map((invoice) => {
            const balanceDue = invoice.total_kobo - invoice.amount_paid_kobo;
            return (
              <Row key={invoice.id}>
                <div>
                  <p className="font-display text-base text-ink">
                    Invoice #{invoice.id.slice(0, 8).toUpperCase()}
                  </p>
                  {invoice.payment_deadline && (
                    <p className="text-sm text-muted">
                      Due {new Date(invoice.payment_deadline).toLocaleDateString("en-NG")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink">
                    {formatNaira(kobo(invoice.total_kobo), { withDecimals: false })}
                  </p>
                  <p className={`text-sm ${balanceDue > 0 ? "text-brass" : "text-muted"}`}>
                    {STATUS_LABEL[invoice.status] ?? invoice.status}
                    {balanceDue > 0 &&
                      ` · ${formatNaira(kobo(balanceDue), { withDecimals: false })} due`}
                  </p>
                </div>
              </Row>
            );
          })
        )}
      </div>
    </div>
  );
}
