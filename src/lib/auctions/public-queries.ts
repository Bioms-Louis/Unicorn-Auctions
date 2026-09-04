import { createClient } from "@/lib/supabase/server";

export interface PublicAuctionSummary {
  id: string;
  title: string;
  slug: string;
  venue: string | null;
  status: string;
  starts_at: string | null;
  registration_deadline: string | null;
}

/**
 * Auctions visible to the public — RLS on `auctions` already restricts
 * this to non-draft/pending_review rows for anonymous/non-staff callers,
 * so no separate status filter is needed here.
 */
export async function listPublicAuctions(): Promise<PublicAuctionSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("auctions")
    .select("id, title, slug, venue, status, starts_at, registration_deadline")
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("[queries] listPublicAuctions error", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAuctionBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("auctions")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("[queries] getAuctionBySlug error", error.message);
    return null;
  }
  return data;
}

export async function listLotsForAuction(auctionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lots")
    .select(
      "id, lot_number, title, category, starting_bid_kobo, current_bid_kobo, status, auction_order",
    )
    .eq("auction_id", auctionId)
    .order("auction_order", { ascending: true });

  if (error) {
    console.error("[queries] listLotsForAuction error", error.message);
    return [];
  }
  return data ?? [];
}

export async function getLot(auctionSlug: string, lotId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lots")
    .select("*, auctions!inner(slug, title, status)")
    .eq("id", lotId)
    .eq("auctions.slug", auctionSlug)
    .single();

  if (error) {
    console.error("[queries] getLot error", error.message);
    return null;
  }
  return data;
}
