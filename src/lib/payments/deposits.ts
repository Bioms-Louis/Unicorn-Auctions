import "server-only";

import { randomUUID } from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { initializePaystackTransaction } from "@/lib/payments/paystack";
import { writeAuditEvent } from "@/lib/audit";
import { assertValidBidderTransition, type BidderState } from "@/lib/bidders/state-machine";

export interface InitiateDepositInput {
  bidderId: string;
  auctionId: string;
  amountKobo: number;
  payerEmail: string;
  actorId: string;
}

/**
 * Creates (or reuses) a pending bidder_deposits + payments row, then
 * initializes a Paystack transaction against it. The webhook handler
 * (src/app/api/payments/paystack/webhook) is what actually marks the
 * deposit `paid`/`verified` — this function never marks it paid itself,
 * since a client-side "initialize succeeded" is not proof of payment.
 */
export async function initiateBidderDeposit(input: InitiateDepositInput) {
  const service = createServiceRoleClient();

  // Reuse an existing pending deposit for this bidder+auction rather than
  // creating a new one on every retry.
  const { data: existingDeposit } = await service
    .from("bidder_deposits")
    .select("id, status")
    .eq("bidder_id", input.bidderId)
    .eq("auction_id", input.auctionId)
    .in("status", ["pending", "awaiting_payment"])
    .maybeSingle();

  const depositId =
    existingDeposit?.id ??
    (
      await service
        .from("bidder_deposits")
        .insert({
          bidder_id: input.bidderId,
          auction_id: input.auctionId,
          amount_kobo: input.amountKobo,
          status: "awaiting_payment",
        })
        .select("id")
        .single()
    ).data?.id;

  if (!depositId) {
    return { success: false as const, error: "Could not create deposit record." };
  }

  const { data: bidder } = await service
    .from("bidders")
    .select("user_id")
    .eq("id", input.bidderId)
    .single();

  const { data: payment, error: paymentError } = await service
    .from("payments")
    .insert({
      payer_id: bidder?.user_id,
      purpose: "deposit",
      related_deposit_id: depositId,
      amount_kobo: input.amountKobo,
      channel: "paystack",
      status: "pending",
    })
    .select("id")
    .single();

  if (paymentError || !payment) {
    return { success: false as const, error: paymentError?.message ?? "Could not create payment record." };
  }

  const reference = `deposit_${depositId}_${randomUUID().slice(0, 8)}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const result = await initializePaystackTransaction({
    email: input.payerEmail,
    amountKobo: input.amountKobo,
    reference,
    callbackUrl: `${appUrl}/api/payments/paystack/callback`,
    metadata: { payment_id: payment.id, deposit_id: depositId, purpose: "deposit" },
  });

  if (!result.status || !result.data) {
    return { success: false as const, error: result.message || "Paystack initialization failed." };
  }

  await service.from("payment_transactions").insert({
    payment_id: payment.id,
    provider: "paystack",
    provider_reference: reference,
    status: "pending",
  });

  await writeAuditEvent({
    actorId: input.actorId,
    action: "deposit.initiate",
    entityType: "bidder_deposit",
    entityId: depositId,
    metadata: { amount_kobo: input.amountKobo, reference },
  });

  return { success: true as const, authorizationUrl: result.data.authorization_url, reference };
}

/**
 * Staff-only: verify a paid deposit, which is what actually unlocks
 * bidding (deposit_verified -> bidding_enabled). Kept separate from the
 * webhook so a human (finance/admin) explicitly confirms verification —
 * matches the deposit_status set in the operational brief (paid is not
 * the same as verified). Caller must check permission before invoking.
 */
export async function verifyDeposit(depositId: string, verifierId: string) {
  const service = createServiceRoleClient();

  const { data: deposit } = await service
    .from("bidder_deposits")
    .select("id, bidder_id, status")
    .eq("id", depositId)
    .single();

  if (!deposit || deposit.status !== "paid") {
    return { success: false as const, error: "Deposit is not in a paid state." };
  }

  await service.from("bidder_deposits").update({ status: "verified" }).eq("id", depositId);

  const { data: bidder } = await service
    .from("bidders")
    .select("state")
    .eq("id", deposit.bidder_id)
    .single();

  if (bidder) {
    assertValidBidderTransition(bidder.state as BidderState, "deposit_verified");
    await service.from("bidders").update({ state: "deposit_verified" }).eq("id", deposit.bidder_id);
  }

  await writeAuditEvent({
    actorId: verifierId,
    action: "deposit.verify",
    entityType: "bidder_deposit",
    entityId: depositId,
  });

  return { success: true as const };
}
