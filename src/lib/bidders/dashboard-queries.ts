import { createClient } from "@/lib/supabase/server";

export interface LotRef {
  id: string;
  title: string;
  lot_number: string;
  auction_slug: string;
}

export interface BidHistoryEntry {
  id: string;
  amount_kobo: number;
  result: string;
  source: string;
  server_created_at: string;
  lot: LotRef | null;
}

export interface WatchlistEntry {
  id: string;
  lot: LotRef | null;
}

export interface InvoiceEntry {
  id: string;
  total_kobo: number;
  amount_paid_kobo: number;
  status: string;
  payment_deadline: string | null;
}

export interface GatePassEntry {
  id: string;
  gate_pass_number: string;
  status: string;
  issue_date: string;
}

export interface WonLotEntry {
  id: string;
  title: string;
  lot_number: string;
  current_bid_kobo: number | null;
  auction_slug: string;
}

export interface OverviewStats {
  totalBidCount: number;
  wonLotCount: number;
  watchlistCount: number;
  unreadNotificationCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLotRef(row: any): LotRef | null {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    lot_number: row.lot_number,
    auction_slug: row.auctions?.slug ?? "",
  };
}

/**
 * A bidder's own bid history, most recent first. RLS-bound — only ever
 * returns the signed-in bidder's own bids (see the `bids_select` policy).
 */
export async function getBidderBidHistory(bidderId: string, limit = 50): Promise<BidHistoryEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bids")
    .select("id, amount_kobo, result, source, server_created_at, lots(id, title, lot_number, auctions(slug))")
    .eq("bidder_id", bidderId)
    .order("server_created_at", { ascending: false })
    .limit(limit);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((b: any) => ({
    id: b.id,
    amount_kobo: b.amount_kobo,
    result: b.result,
    source: b.source,
    server_created_at: b.server_created_at,
    lot: mapLotRef(b.lots),
  }));
}

export async function getBidderWatchlist(userId: string): Promise<WatchlistEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watchlists")
    .select("id, lots(id, title, lot_number, auctions(slug))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((w: any) => ({ id: w.id, lot: mapLotRef(w.lots) }));
}

export async function getBidderInvoices(bidderId: string): Promise<InvoiceEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select("id, total_kobo, amount_paid_kobo, status, payment_deadline")
    .eq("bidder_id", bidderId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getBidderGatePasses(bidderId: string): Promise<GatePassEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gate_passes")
    .select("id, gate_pass_number, status, issue_date")
    .eq("bidder_id", bidderId)
    .order("issue_date", { ascending: false });

  return data ?? [];
}

export async function getBidderWonLots(bidderId: string): Promise<WonLotEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lots")
    .select("id, title, lot_number, current_bid_kobo, auctions(slug)")
    .eq("highest_bidder_id", bidderId)
    .eq("status", "sold");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((lot: any) => ({
    id: lot.id,
    title: lot.title,
    lot_number: lot.lot_number,
    current_bid_kobo: lot.current_bid_kobo,
    auction_slug: lot.auctions?.slug ?? "",
  }));
}

/**
 * One aggregated fetch for the dashboard overview page — a bounded slice
 * of each section (recent bids, full watchlist/invoices/gate passes since
 * those are typically short lists, won lots) plus the unread notification
 * count. Full, unbounded per-section lists for the dedicated /dashboard/*
 * pages come from the individual functions above instead.
 */
export async function getBidderDashboardData(bidderId: string, userId: string) {
  const [recentBids, watchlist, invoices, gatePasses, wonLots, notificationsRes] = await Promise.all([
    getBidderBidHistory(bidderId, 10),
    getBidderWatchlist(userId),
    getBidderInvoices(bidderId),
    getBidderGatePasses(bidderId),
    getBidderWonLots(bidderId),
    (async () => {
      const supabase = await createClient();
      return supabase.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null);
    })(),
  ]);

  return {
    recentBids,
    watchlist,
    invoices,
    gatePasses,
    wonLots,
    unreadNotificationCount: notificationsRes.count ?? 0,
  };
}

/**
 * Accurate counts for the overview stat cards — separate from
 * getBidderDashboardData because "bids placed" needs a true total, not
 * the 10-row slice used for the "recent bids" list.
 */
export async function getBidderOverviewStats(bidderId: string, userId: string): Promise<OverviewStats> {
  const supabase = await createClient();

  const [bidsRes, wonLotsRes, watchlistRes, notificationsRes] = await Promise.all([
    supabase.from("bids").select("id", { count: "exact", head: true }).eq("bidder_id", bidderId),
    supabase
      .from("lots")
      .select("id", { count: "exact", head: true })
      .eq("highest_bidder_id", bidderId)
      .eq("status", "sold"),
    supabase.from("watchlists").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null),
  ]);

  return {
    totalBidCount: bidsRes.count ?? 0,
    wonLotCount: wonLotsRes.count ?? 0,
    watchlistCount: watchlistRes.count ?? 0,
    unreadNotificationCount: notificationsRes.count ?? 0,
  };
}