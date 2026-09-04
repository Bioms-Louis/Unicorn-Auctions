"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { submitBidderKyc } from "@/lib/kyc/service";
import { initiateBidderDeposit } from "@/lib/payments/deposits";

async function requireBidder() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: bidder } = await supabase
    .from("bidders")
    .select("id, state")
    .eq("user_id", user.id)
    .single();

  if (!bidder) redirect("/register");

  return { user, bidder };
}

export interface DashboardActionResult {
  success: boolean;
  error?: string;
}

export async function submitKycAction(
  _prev: DashboardActionResult,
  formData: FormData,
): Promise<DashboardActionResult> {
  const { user, bidder } = await requireBidder();

  const result = await submitBidderKyc(
    {
      bidderId: bidder.id,
      identity: {
        fullName: formData.get("fullName"),
        dateOfBirth: formData.get("dateOfBirth"),
        idType: formData.get("idType"),
        idNumber: formData.get("idNumber"),
      },
      address: {
        line1: formData.get("addressLine1"),
        city: formData.get("city"),
        state: formData.get("state"),
        phone: formData.get("phone"),
      },
      tin: formData.get("tin") || undefined,
    },
    user.id,
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  redirect("/dashboard?kyc=submitted");
}

export async function initiateDepositAction(auctionId: string, amountKobo: number) {
  const { user, bidder } = await requireBidder();

  const result = await initiateBidderDeposit({
    bidderId: bidder.id,
    auctionId,
    amountKobo,
    payerEmail: user.email!,
    actorId: user.id,
  });

  if (!result.success) {
    redirect("/dashboard/deposit?status=init_failed");
  }

  redirect(result.authorizationUrl);
}
