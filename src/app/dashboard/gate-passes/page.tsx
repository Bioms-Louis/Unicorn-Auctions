import { getCurrentBidder } from "@/lib/bidders/current-bidder";
import { getBidderGatePasses } from "@/lib/bidders/dashboard-queries";
import { Row, EmptyRow } from "@/components/dashboard-ui";

const STATUS_LABEL: Record<string, string> = {
  issued: "Issued",
  verified: "Verified",
  expired: "Expired",
  revoked: "Revoked",
};

export default async function GatePassesPage() {
  const { bidder } = await getCurrentBidder();
  const gatePasses = await getBidderGatePasses(bidder.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Gate passes</h1>
      <p className="mt-2 text-sm text-ink/70">
        Issued once a won lot is fully settled — bring this when collecting your asset.
      </p>

      <div className="mt-8 border-t border-hairline">
        {gatePasses.length === 0 ? (
          <EmptyRow>No gate passes issued yet.</EmptyRow>
        ) : (
          gatePasses.map((pass) => (
            <Row key={pass.id}>
              <div>
                <p className="font-display text-base text-ink">{pass.gate_pass_number}</p>
                <p className="text-sm text-muted">
                  Issued {new Date(pass.issue_date).toLocaleDateString("en-NG")}
                </p>
              </div>
              <p className="text-sm text-ink">{STATUS_LABEL[pass.status] ?? pass.status}</p>
            </Row>
          ))
        )}
      </div>
    </div>
  );
}
