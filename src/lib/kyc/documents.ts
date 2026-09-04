import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const KYC_DOCUMENTS_BUCKET = "kyc-documents";

/**
 * Uploads a KYC document to the private Storage bucket and records it
 * against a kyc_submissions row. The bucket must be created as PRIVATE in
 * the Supabase dashboard (or via a storage migration) — never public.
 * Access for review happens exclusively through getSignedKycDocumentUrl().
 */
export async function uploadKycDocument(params: {
  kycSubmissionId: string;
  bidderId: string;
  documentType: string; // e.g. "government_id", "proof_of_address"
  file: File;
}) {
  const service = createServiceRoleClient();
  const path = `${params.bidderId}/${params.kycSubmissionId}/${params.documentType}-${Date.now()}-${params.file.name}`;

  const { error: uploadError } = await service.storage
    .from(KYC_DOCUMENTS_BUCKET)
    .upload(path, params.file, { upsert: false });

  if (uploadError) {
    return { success: false as const, error: uploadError.message };
  }

  const { error: insertError } = await service.from("kyc_documents").insert({
    kyc_submission_id: params.kycSubmissionId,
    document_type: params.documentType,
    storage_path: path,
  });

  if (insertError) {
    return { success: false as const, error: insertError.message };
  }

  return { success: true as const, path };
}

/**
 * Generates a short-lived signed URL for staff review. Never expose
 * storage_path values or unsigned URLs to the client directly.
 */
export async function getSignedKycDocumentUrl(storagePath: string, expiresInSeconds = 300) {
  const service = createServiceRoleClient();
  const { data, error } = await service.storage
    .from(KYC_DOCUMENTS_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data) {
    return null;
  }
  return data.signedUrl;
}
