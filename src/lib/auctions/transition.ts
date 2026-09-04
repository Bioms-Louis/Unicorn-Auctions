import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { writeAuditEvent } from "@/lib/audit";
import {
  assertValidAuctionTransition,
  type AuctionStatus,
} from "@/lib/auctions/state-machine";

export interface TransitionAuctionInput {
  auctionId: string;
  toStatus: AuctionStatus;
  actorId: string;
}

/**
 * The only sanctioned way to change auctions.status. Reads the current
 * status, validates the transition against the state machine, writes the
 * update, and logs an audit event — all in one place so no caller can set
 * status to an arbitrary value directly via a raw update.
 */
export async function transitionAuctionStatus(input: TransitionAuctionInput) {
  const service = createServiceRoleClient();

  const { data: auction, error: fetchError } = await service
    .from("auctions")
    .select("id, status")
    .eq("id", input.auctionId)
    .single();

  if (fetchError || !auction) {
    throw new Error(`Auction ${input.auctionId} not found.`);
  }

  assertValidAuctionTransition(auction.status as AuctionStatus, input.toStatus);

  const { data: updated, error: updateError } = await service
    .from("auctions")
    .update({ status: input.toStatus, updated_at: new Date().toISOString() })
    .eq("id", input.auctionId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update auction status: ${updateError.message}`);
  }

  await writeAuditEvent({
    actorId: input.actorId,
    action: "auction.transition_status",
    entityType: "auction",
    entityId: input.auctionId,
    metadata: { from: auction.status, to: input.toStatus },
  });

  return updated;
}
