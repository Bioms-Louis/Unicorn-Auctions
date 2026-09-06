import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface HeaderUser {
  firstName: string;
  lastName: string;
}

/**
 * Minimal signed-in-user info for chrome like the site header. Returns
 * null when signed out, so callers can branch on presence alone rather
 * than checking multiple fields.
 */
export async function getHeaderUser(): Promise<HeaderUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { firstName: profile.first_name, lastName: profile.last_name };
}