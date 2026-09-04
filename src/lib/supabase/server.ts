/**
 * Server Supabase client for use inside Server Components, Server Actions,
 * and Route Handlers. Uses the ANON key + the user's session cookies, so
 * RLS still applies — this is the client you use for anything done "as
 * the logged-in user".
 */
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component with no request context —
            // safe to ignore if you have middleware refreshing sessions.
          }
        },
      },
    },
  );
}
