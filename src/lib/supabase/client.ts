"use client";

/**
 * Browser Supabase client. Uses the ANON key only — never the service role
 * key. Row Level Security is what actually protects data; this client is
 * subject to RLS on every request.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
