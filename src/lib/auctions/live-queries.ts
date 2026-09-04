import { createClient } from "@/lib/supabase/server";

export async function getCurrentActiveLot(auctionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lots")
    .select("id, lot_number, title, category, starting_bid_kobo, current_bid_kobo, bid_increment_kobo, reserve_price_kobo, status")
    .eq("auction_id", auctionId)
    .eq("status", "active")
    .order("auction_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[queries] getCurrentActiveLot error", error.message);
    return null;
  }
  return data;
}

export async function getLiveAuctionState(lotId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("live_auction_state")
    .select("*")
    .eq("lot_id", lotId)
    .maybeSingle();

  if (error) {
    console.error("[queries] getLiveAuctionState error", error.message);
    return null;
  }
  return data;
}

export async function listRecentBidsForLot(lotId: string, limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bids")
    .select("id, amount_kobo, source, result, server_created_at")
    .eq("lot_id", lotId)
    .eq("result", "accepted")
    .order("sequence_number", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[queries] listRecentBidsForLot error", error.message);
    return [];
  }
  return data ?? [];
}
