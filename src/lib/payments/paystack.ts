import "server-only";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function requireSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set. Add it to .env.local (see .env.example).",
    );
  }
  return key;
}

interface InitializeTransactionParams {
  email: string;
  amountKobo: number; // Paystack also expects the smallest currency unit for NGN
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

/** Starts a Paystack transaction and returns the checkout URL to redirect the bidder to. */
export async function initializePaystackTransaction(
  params: InitializeTransactionParams,
): Promise<PaystackInitializeResponse> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo, // NGN kobo — matches our internal unit exactly
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  return res.json();
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
  };
}

/** Server-side verification — never trust a payment-success state from the browser alone. */
export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResponse> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${requireSecretKey()}` },
  });

  return res.json();
}

/**
 * Verifies the `x-paystack-signature` header against an HMAC-SHA512 of the
 * raw request body using the secret key, per Paystack's webhook spec.
 * Call this BEFORE processing any webhook payload.
 */
export async function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): Promise<boolean> {
  if (!signatureHeader) return false;

  const key = requireSecretKey();
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(rawBody));
  const computedHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computedHex === signatureHeader;
}
