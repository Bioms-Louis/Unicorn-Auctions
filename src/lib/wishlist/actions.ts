"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Adds or removes a lot from the current user's watchlist, returning the
 * resulting state. Uses the RLS-bound server client directly — no
 * service-role client needed, since `watchlists_owner_all` already lets a
 * signed-in user manage their own rows.
 */
export async function toggleWatchlist(lotId: string): Promise<{ watchlisted: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: existing } = await supabase
    .from("watchlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("lot_id", lotId)
    .maybeSingle();

  if (existing) {
    await supabase.from("watchlists").delete().eq("id", existing.id);
    revalidatePath("/dashboard/watchlist");
    return { watchlisted: false };
  }

  await supabase.from("watchlists").insert({ user_id: user.id, lot_id: lotId });
  revalidatePath("/dashboard/watchlist");
  return { watchlisted: true };
}

export async function removeFromWatchlist(watchlistId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  await supabase.from("watchlists").delete().eq("id", watchlistId).eq("user_id", user.id);
  revalidatePath("/dashboard/watchlist");
}