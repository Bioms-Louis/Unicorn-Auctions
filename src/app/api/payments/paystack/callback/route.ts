import { NextResponse, type NextRequest } from "next/server";
import { verifyPaystackTransaction } from "@/lib/payments/paystack";

/**
 * Browser lands here after completing Paystack checkout. This does a
 * best-effort server-side verify so we can redirect to a sensible page
 * immediately — but it is NOT what marks the deposit as paid. That only
 * ever happens via the signature-verified webhook
 * (src/app/api/payments/paystack/webhook), since a browser redirect can be
 * spoofed or interrupted and must never be trusted as payment proof.
 */
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

  if (!reference) {
    return NextResponse.redirect(`${appUrl}/dashboard/deposit?status=missing_reference`);
  }

  const result = await verifyPaystackTransaction(reference);
  const status = result.data?.status === "success" ? "pending_confirmation" : "failed";

  return NextResponse.redirect(`${appUrl}/dashboard/deposit?status=${status}`);
}
