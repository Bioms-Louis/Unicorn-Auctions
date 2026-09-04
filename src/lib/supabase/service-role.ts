import "server-only";

/**
 * SERVICE-ROLE Supabase client. Bypasses Row Level Security entirely.
 *
 * Rules for using this file:
 *   - Import ONLY from trusted server-side domain services
 *     (src/lib/bidding, src/lib/payments, etc.) that themselves perform
 *     explicit authorization checks before calling out to this client.
 *   - NEVER import this from a Client Component, a public Route Handler
 *     without prior auth+authz checks, or anywhere reachable by
 *     unauthenticated/untrusted input.
 *   - NEVER expose SUPABASE_SERVICE_ROLE_KEY via NEXT_PUBLIC_*.
 *
 * The `server-only` import above makes any accidental client-bundle
 * inclusion fail the build.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let cachedClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createServiceRoleClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase service role client requested but NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.",
    );
  }

  cachedClient = createSupabaseClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}
