import "server-only";

import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { writeAuditEvent } from "@/lib/audit";
import { assertValidBidderTransition, type BidderState } from "@/lib/bidders/state-machine";

const SubmitBidderKycInput = z.object({
  bidderId: z.string().uuid(),
  identity: z.object({
    fullName: z.string().min(2),
    dateOfBirth: z.string().min(1),
    idType: z.string().min(1), // e.g. "NIN", "International Passport", "Driver's License"
    idNumber: z.string().min(1),
  }),
  address: z.object({
    line1: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    phone: z.string().min(1),
  }),
  tin: z.string().optional(),
});

export type SubmitBidderKycInput = z.infer<typeof SubmitBidderKycInput>;

/**
 * Records a bidder's KYC submission and moves them from `pending` to
 * `kyc_pending` (awaiting staff review). Document uploads are handled
 * separately (see uploadKycDocument) since they go through Storage, not
 * this JSON payload — this only records the submission + structured data.
 */
export async function submitBidderKyc(input: unknown, actorId: string) {
  const parsed = SubmitBidderKycInput.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid KYC data." };
  }

  const service = createServiceRoleClient();

  const { data: bidder, error: bidderError } = await service
    .from("bidders")
    .select("id, state")
    .eq("id", parsed.data.bidderId)
    .single();

  if (bidderError || !bidder) {
    return { success: false as const, error: "Bidder not found." };
  }

  // Idempotency: if a pending/in_review submission already exists, update
  // it rather than creating a duplicate row every time the form is saved.
  const { data: existing } = await service
    .from("kyc_submissions")
    .select("id, status")
    .eq("bidder_id", bidder.id)
    .eq("subject_type", "bidder")
    .in("status", ["pending", "in_review"])
    .maybeSingle();

  const payload = {
    subject_type: "bidder" as const,
    bidder_id: bidder.id,
    status: "pending" as const,
    identity_info: parsed.data.identity,
    address_info: parsed.data.address,
    tin: parsed.data.tin ?? null,
  };

  const { error: writeError } = existing
    ? await service.from("kyc_submissions").update(payload).eq("id", existing.id)
    : await service.from("kyc_submissions").insert(payload);

  if (writeError) {
    return { success: false as const, error: writeError.message };
  }

  if (bidder.state === "pending") {
    assertValidBidderTransition(bidder.state as BidderState, "kyc_pending");
    await service.from("bidders").update({ state: "kyc_pending" }).eq("id", bidder.id);
  }

  await writeAuditEvent({
    actorId,
    action: existing ? "kyc.resubmit" : "kyc.submit",
    entityType: "bidder",
    entityId: bidder.id,
  });

  return { success: true as const };
}

/**
 * Staff-only: approve or reject a bidder's KYC submission. Transitions the
 * bidder state accordingly (kyc_pending -> kyc_approved, or -> rejected).
 * Caller is responsible for verifying the actor holds kyc_officer/admin
 * permission before calling this (see src/lib/auth/roles.ts PERMISSIONS).
 */
export async function reviewBidderKyc(
  kycSubmissionId: string,
  decision: "approved" | "rejected",
  reviewerId: string,
  notes?: string,
) {
  const service = createServiceRoleClient();

  const { data: submission, error: fetchError } = await service
    .from("kyc_submissions")
    .select("id, bidder_id, status")
    .eq("id", kycSubmissionId)
    .single();

  if (fetchError || !submission || !submission.bidder_id) {
    return { success: false as const, error: "KYC submission not found." };
  }

  const { data: bidder } = await service
    .from("bidders")
    .select("id, state")
    .eq("id", submission.bidder_id)
    .single();

  if (!bidder) {
    return { success: false as const, error: "Bidder not found." };
  }

  await service
    .from("kyc_submissions")
    .update({
      status: decision,
      review_notes: notes ?? null,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", kycSubmissionId);

  const nextState: BidderState = decision === "approved" ? "kyc_approved" : "rejected";
  assertValidBidderTransition(bidder.state as BidderState, nextState);
  await service.from("bidders").update({ state: nextState }).eq("id", bidder.id);

  await writeAuditEvent({
    actorId: reviewerId,
    action: `kyc.${decision}`,
    entityType: "bidder",
    entityId: bidder.id,
    metadata: { kyc_submission_id: kycSubmissionId, notes },
  });

  return { success: true as const };
}
