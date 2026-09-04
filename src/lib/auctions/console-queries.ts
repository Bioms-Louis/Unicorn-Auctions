import { createClient } from "@/lib/supabase/server";
import { isAuctionOperatorRole, type Role } from "@/lib/auth/roles";

export async function getCurrentUserOperatorRoles(): Promise<{ userId: string | null; roles: Role[] }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { userId: null, roles: [] };

  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  return { userId: user.id, roles: (data ?? []).map((r) => r.role as Role) };
}

export function canOperateConsole(roles: Role[]): boolean {
  return roles.some(isAuctionOperatorRole);
}

export async function listLiveAuctionsForConsole() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("auctions")
    .select("id, title, slug, status")
    .in("status", ["live", "paused"]);

  if (error) {
    console.error("[console] listLiveAuctionsForConsole error", error.message);
    return [];
  }
  return data ?? [];
}

export async function findPaddleForAuction(auctionId: string, paddleNumber: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("paddles")
    .select("id, bidder_id, is_active")
    .eq("auction_id", auctionId)
    .eq("paddle_number", paddleNumber)
    .maybeSingle();

  if (error) {
    console.error("[console] findPaddleForAuction error", error.message);
    return null;
  }
  return data;
}
