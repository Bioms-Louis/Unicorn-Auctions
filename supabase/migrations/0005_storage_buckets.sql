-- Unicorn Auctions — Storage buckets
-- KYC documents and payment receipts are PRIVATE — accessed only via
-- signed URLs generated server-side (see src/lib/kyc/documents.ts).
-- Lot media (public marketing photos/video) is public-read.

insert into storage.buckets (id, name, public)
values
  ('kyc-documents', 'kyc-documents', false),
  ('payment-receipts', 'payment-receipts', false),
  ('lot-media', 'lot-media', true),
  ('lot-documents', 'lot-documents', false)
on conflict (id) do nothing;

-- kyc-documents: only staff (kyc_officer/admin/super_admin) or the owning
-- bidder/partner/broker (matched by the first path segment = their bidder/
-- partner/broker id) may read; only the service role writes (uploads go
-- through the server-side uploadKycDocument() helper, never client-direct).
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

comment on table storage.buckets is 'kyc-documents and payment-receipts are private; all writes go through service-role server code, never direct client upload.';
