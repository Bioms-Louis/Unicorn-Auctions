import "server-only";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { roleHasPermission } from "@/lib/auth/roles";

export interface CloseLotResult {
  success: boolean;
  status?: "sold" | "unsold";
  error?: { code: string; message: string };
}

/**
 * The gavel. Requires auction-management permission, re-checked here
 * server-side (never trust a client-only role check) before calling the
 * atomic close_lot() DB function.
 */
export async function closeLot(lotId: string): Promise<CloseLotResult> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { code: "UNAUTHENTICATED", message: "Sign in required." } };
  }

  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  const hasPermission = (roles ?? []).some((r) => roleHasPermission(r.role, "auction:manage_state"));
  if (!hasPermission) {
    return { success: false, error: { code: "FORBIDDEN", message: "Not authorized to close lots." } };
  }

  const service = createServiceRoleClient();
  const { data, error } = await service.rpc("close_lot", { p_lot_id: lotId, p_closed_by: user.id });

  if (error) {
    return { success: false, error: { code: "UNKNOWN_ERROR", message: error.message } };
  }

  const lot = data as { status: "sold" | "unsold" };
  return { success: true, status: lot.status };
}
