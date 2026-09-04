import "server-only";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { roleHasPermission } from "@/lib/auth/roles";
import { z } from "zod";
import type { Kobo } from "@/lib/money";

const OnlineBidInput = z.object({
  auctionId: z.string().uuid(),
  lotId: z.string().uuid(),
  amountKobo: z.number().int().positive(),
});

const FloorBidInput = z.object({
  auctionId: z.string().uuid(),
  lotId: z.string().uuid(),
  paddleId: z.string().uuid(),
  amountKobo: z.number().int().positive(),
});

export type BidErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "LOT_NOT_FOUND"
  | "AUCTION_NOT_FOUND"
  | "AUCTION_NOT_LIVE"
  | "LOT_NOT_ACTIVE"
  | "BIDDER_NOT_ELIGIBLE"
  | "PADDLE_REQUIRED"
  | "PADDLE_NOT_VALID"
  | "BID_TOO_LOW"
  | "UNKNOWN_ERROR";

export interface PlaceBidResult {
  success: boolean;
  bid?: {
    id: string;
    amountKobo: Kobo;
    result: "accepted" | "rejected";
  };
  currentBid?: Kobo;
  error?: { code: BidErrorCode; message: string };
}

/**
 * Place an ONLINE bid on behalf of the currently authenticated bidder.
 * The bidder identity is taken from the server session — never from the
 * request body — so a client cannot bid as someone else.
 */
export async function placeOnlineBid(input: unknown): Promise<PlaceBidResult> {
  const parsed = OnlineBidInput.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHENTICATED", message: "Sign in to bid." } };
  }

  const { data: bidder } = await supabase
    .from("bidders")
    .select("id, state")
    .eq("user_id", user.id)
    .single();

  if (!bidder) {
    return { success: false, error: { code: "FORBIDDEN", message: "No bidder profile found." } };
  }

  const service = createServiceRoleClient();
  const { data, error } = await service.rpc("place_bid", {
    p_auction_id: parsed.data.auctionId,
    p_lot_id: parsed.data.lotId,
    p_bidder_id: bidder.id,
    p_paddle_id: null,
    p_amount_kobo: parsed.data.amountKobo,
    p_source: "online",
    p_created_by: user.id,
  });

  if (error) {
    return { success: false, error: { code: "UNKNOWN_ERROR", message: error.message } };
  }

  const row = data as { id: string; amount_kobo: number; result: "accepted" | "rejected"; rejection_reason: string | null };

  if (row.result === "rejected") {
    return {
      success: false,
      error: { code: (row.rejection_reason as BidErrorCode) ?? "UNKNOWN_ERROR", message: row.rejection_reason ?? "Bid rejected." },
    };
  }

  return {
    success: true,
    bid: { id: row.id, amountKobo: row.amount_kobo as Kobo, result: row.result },
    currentBid: row.amount_kobo as Kobo,
  };
}

/**
 * Place a FLOOR bid entered by an authorized clerk/auctioneer on behalf of
 * a paddle-holding bidder. Requires the caller to hold clerk/auctioneer/admin
 * permissions server-side — permission is re-checked here, not just in the UI.
 */
export async function placeFloorBid(input: unknown): Promise<PlaceBidResult> {
  const parsed = FloorBidInput.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHENTICATED", message: "Sign in required." } };
  }

  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  const hasPermission = (roles ?? []).some((r) => roleHasPermission(r.role, "bid:place_floor"));
  if (!hasPermission) {
    return { success: false, error: { code: "FORBIDDEN", message: "Not authorized to enter floor bids." } };
  }

  const service = createServiceRoleClient();

  const { data: paddle } = await service
    .from("paddles")
    .select("bidder_id")
    .eq("id", parsed.data.paddleId)
    .single();

  if (!paddle) {
    return { success: false, error: { code: "PADDLE_NOT_VALID", message: "Paddle not found." } };
  }

  const { data, error } = await service.rpc("place_bid", {
    p_auction_id: parsed.data.auctionId,
    p_lot_id: parsed.data.lotId,
    p_bidder_id: paddle.bidder_id,
    p_paddle_id: parsed.data.paddleId,
    p_amount_kobo: parsed.data.amountKobo,
    p_source: "floor",
    p_created_by: user.id,
  });

  if (error) {
    return { success: false, error: { code: "UNKNOWN_ERROR", message: error.message } };
  }

  const row = data as { id: string; amount_kobo: number; result: "accepted" | "rejected"; rejection_reason: string | null };

  if (row.result === "rejected") {
    return {
      success: false,
      error: { code: (row.rejection_reason as BidErrorCode) ?? "UNKNOWN_ERROR", message: row.rejection_reason ?? "Bid rejected." },
    };
  }

  return {
    success: true,
    bid: { id: row.id, amountKobo: row.amount_kobo as Kobo, result: row.result },
    currentBid: row.amount_kobo as Kobo,
  };
}
