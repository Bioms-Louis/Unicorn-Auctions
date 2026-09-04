-- Unicorn Auctions — Storage bucket RLS policies
--
-- IMPORTANT: the four buckets this migration assumes (kyc-documents,
-- payment-receipts, lot-media, lot-documents) must already exist before
-- running this file. `storage.buckets` is owned by Supabase's internal
-- `supabase_storage_admin` role — the SQL Editor's `postgres` role cannot
-- INSERT into it directly (you'll get "must be owner of table buckets").
--
-- Create the buckets first, either:
--   (a) Dashboard → Storage → New bucket (kyc-documents/payment-receipts/
--       lot-documents = private, lot-media = public), or
--   (b) `npx tsx scripts/setup-storage.ts` (see that file), which creates
--       them via the Storage API using the service role key — this works
--       from a script because it goes through Supabase's Storage service,
--       not a raw SQL insert against a table your SQL Editor role doesn't own.
--
-- RLS policies on storage.objects (below) are a separate permission and
-- DO work from the SQL Editor.

-- kyc-documents: only staff (kyc_officer/admin/super_admin) may read.
-- Uploads go through the server-side uploadKycDocument() helper using the
-- service role client, which bypasses RLS entirely — so no INSERT policy
-- is needed here for the app to function; this policy only governs SELECT
-- (e.g. staff viewing documents via signed URLs is still gated by this,
-- though getSignedKycDocumentUrl() also uses the service role and so
-- bypasses this too — this policy is a defense-in-depth backstop for any
-- future direct client read).
create policy "kyc_documents_bucket_staff_read" on storage.objects for select
  using (
    bucket_id = 'kyc-documents' and (is_staff())
  );

-- payment-receipts: staff (finance/admin) read; uploads via server-side service.
create policy "payment_receipts_bucket_finance_read" on storage.objects for select
  using (
    bucket_id = 'payment-receipts' and (has_role('finance') or has_role('admin') or has_role('super_admin'))
  );

-- lot-media: public bucket, world-readable by design (marketing photos).
create policy "lot_media_bucket_public_read" on storage.objects for select
  using (bucket_id = 'lot-media');

-- lot-documents (condition reports etc.): staff + the consigning partner.
create policy "lot_documents_bucket_staff_read" on storage.objects for select
  using (bucket_id = 'lot-documents' and is_staff());
