import { NextResponse, type NextRequest } from "next/server";
import { verifyPaystackWebhookSignature } from "@/lib/payments/paystack";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { writeAuditEvent } from "@/lib/audit";

/**
 * Paystack webhook endpoint.
 *
 * Idempotency: every inbound event is inserted into `payment_webhooks`
 * under a UNIQUE(provider, event_id) constraint BEFORE we act on it. If
 * Paystack retries the same event (which it does, by design, until it gets
 * a 200), the insert conflicts, we detect that, and return 200 without
 * reprocessing — so a payment can never be double-applied.
 *
 * Never trust a payment-success signal from anywhere except this verified,
 * server-to-server webhook (or an explicit verifyPaystackTransaction() call).
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const validSignature = await verifyPaystackWebhookSignature(rawBody, signature);
  if (!validSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    id?: string | number;
    event: string;
    data: { reference: string; status: string; amount: number; metadata?: Record<string, unknown> };
  };

  const service = createServiceRoleClient();
  const eventId = String(event.id ?? event.data.reference); // fall back to reference if Paystack omits an event id

  const { error: insertError } = await service.from("payment_webhooks").insert({
    provider: "paystack",
    event_id: eventId,
    event_type: event.event,
    payload: event,
  });

  if (insertError) {
    // Unique constraint violation => already processed this exact event.
    // Any other error also gets a 200 here deliberately, per Paystack's
    // guidance, to avoid infinite retry storms on a payload we can't parse;
    // real infra would alert on this via error monitoring.
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.event === "charge.success") {
    await handleChargeSuccess(service, event.data);
  }

  await service
    .from("payment_webhooks")
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq("provider", "paystack")
    .eq("event_id", eventId);

  return NextResponse.json({ received: true });
}

async function handleChargeSuccess(
  service: ReturnType<typeof createServiceRoleClient>,
  data: { reference: string; status: string; amount: number; metadata?: Record<string, unknown> },
) {
  const { data: transaction } = await service
    .from("payment_transactions")
    .select("id, payment_id")
    .eq("provider", "paystack")
    .eq("provider_reference", data.reference)
    .maybeSingle();

  if (!transaction) return; // Unknown reference — nothing to reconcile against.

  await service
    .from("payment_transactions")
    .update({ status: "success", raw_response: data })
    .eq("id", transaction.id);

  const { data: payment } = await service
    .from("payments")
    .select("id, related_deposit_id, purpose")
    .eq("id", transaction.payment_id)
    .single();

  if (!payment) return;

  await service.from("payments").update({ status: "success" }).eq("id", payment.id);

  if (payment.purpose === "deposit" && payment.related_deposit_id) {
    await service
      .from("bidder_deposits")
      .update({ status: "paid" })
      .eq("id", payment.related_deposit_id)
      .eq("status", "awaiting_payment"); // guards against re-applying if already advanced

    const { data: deposit } = await service
      .from("bidder_deposits")
      .select("bidder_id")
      .eq("id", payment.related_deposit_id)
      .single();

    if (deposit) {
      await writeAuditEvent({
        actorId: null,
        action: "deposit.payment_confirmed",
        entityType: "bidder_deposit",
        entityId: payment.related_deposit_id,
        metadata: { reference: data.reference, amount_kobo: data.amount },
      });

      await service.from("notifications").insert({
        user_id: (
          await service.from("bidders").select("user_id").eq("id", deposit.bidder_id).single()
        ).data?.user_id,
        type: "deposit_received",
        payload: { deposit_id: payment.related_deposit_id },
      });
    }
  }
}
