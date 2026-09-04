/**
 * Creates the Storage buckets this app expects, via the Storage API
 * (using the service role key) rather than raw SQL — `storage.buckets` is
 * owned by Supabase's internal `supabase_storage_admin` role, so a direct
 * `INSERT` from the SQL Editor fails with "must be owner of table
 * buckets". Going through supabase-js's storage.createBucket() avoids
 * that entirely, because it calls the Storage service's own API rather
 * than writing to the table directly.
 *
 * Usage:
 *   npx tsx scripts/setup-storage.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be
 * set (e.g. in .env.local — this script loads that file automatically).
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local first.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BUCKETS: { id: string; public: boolean }[] = [
  { id: "kyc-documents", public: false },
  { id: "payment-receipts", public: false },
  { id: "lot-media", public: true },
  { id: "lot-documents", public: false },
];

async function main() {
  for (const bucket of BUCKETS) {
    const { data: existing } = await supabase.storage.getBucket(bucket.id);

    if (existing) {
      console.log(`✓ Bucket "${bucket.id}" already exists — skipping.`);
      continue;
    }

    const { error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
    });

    if (error) {
      console.error(`✗ Failed to create bucket "${bucket.id}": ${error.message}`);
      process.exitCode = 1;
      continue;
    }

    console.log(`✓ Created bucket "${bucket.id}" (public: ${bucket.public})`);
  }

  console.log(
    "\nNext: run supabase/migrations/0005_storage_buckets.sql in the SQL Editor to add the storage.objects RLS policies.",
  );
}

main();
