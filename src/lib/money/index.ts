/**
 * Money utility for Unicorn Auctions.
 *
 * All monetary amounts are stored and computed as INTEGER MINOR UNITS
 * (kobo) — never as JavaScript floats. 1 NGN = 100 kobo.
 *
 * DB columns backing money values should be BIGINT (kobo), not NUMERIC/float.
 * This keeps every calculation deterministic and reproducible, per the
 * "Financial Precision" requirement in the operational brief.
 */

export const CURRENCY = "NGN" as const;
export const CURRENCY_SYMBOL = "\u20A6"; // ₦
export const MINOR_UNITS_PER_MAJOR = 100; // 100 kobo = 1 naira

/** A monetary amount in kobo (integer minor units). Always use this type for money. */
export type Kobo = number & { readonly __brand: "Kobo" };

export function kobo(amountInKobo: number): Kobo {
  if (!Number.isInteger(amountInKobo)) {
    throw new Error(
      `Kobo amounts must be integers. Received: ${amountInKobo}`,
    );
  }
  return amountInKobo as Kobo;
}

/** Convert a naira amount (string or number, e.g. "5500000.50") to Kobo safely. */
export function nairaToKobo(naira: number | string): Kobo {
  const [wholePart, fractionPart = ""] = String(naira).split(".");
  const paddedFraction = (fractionPart + "00").slice(0, 2);
  const sign = wholePart.startsWith("-") ? -1n : 1n;
  const whole = BigInt(wholePart.replace("-", "") || "0");
  const fraction = BigInt(paddedFraction || "0");
  const totalKobo = sign * (whole * 100n + fraction);
  return kobo(Number(totalKobo));
}

export function koboToNaira(amount: Kobo): number {
  return amount / MINOR_UNITS_PER_MAJOR;
}

/** Format kobo as a display string, e.g. ₦5,500,000.00 */
export function formatNaira(
  amount: Kobo,
  options: { withDecimals?: boolean } = {},
): string {
  const naira = koboToNaira(amount);
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: options.withDecimals === false ? 0 : 2,
    maximumFractionDigits: options.withDecimals === false ? 0 : 2,
  }).format(naira);
  return formatted;
}

// ---- Deterministic integer-safe arithmetic -------------------------------

export function addKobo(...amounts: Kobo[]): Kobo {
  return kobo(amounts.reduce((sum, a) => sum + a, 0));
}

export function subtractKobo(a: Kobo, b: Kobo): Kobo {
  return kobo(a - b);
}

/**
 * Apply a basis-point rate to a kobo amount using integer math with
 * round-half-up semantics, so results are reproducible and testable.
 * e.g. applyBasisPoints(kobo(1_000_00), 750) => 7.5% of ₦1,000.00
 */
export function applyBasisPoints(amount: Kobo, basisPoints: number): Kobo {
  if (!Number.isInteger(basisPoints) || basisPoints < 0) {
    throw new Error("basisPoints must be a non-negative integer");
  }
  const numerator = BigInt(amount) * BigInt(basisPoints);
  const denominator = 10_000n;
  const result = (numerator + denominator / 2n) / denominator; // round-half-up
  return kobo(Number(result));
}

/** Convert a human percentage (e.g. 7.5 for 7.5%) to integer basis points (750). */
export function percentToBasisPoints(percent: number): number {
  return Math.round(percent * 100);
}

// ---- Nigerian tax/fee defaults from the operational brief -----------------
// These are DEFAULTS ONLY. Actual rates must come from the configurable
// tax_rules / fee configuration tables (see supabase/migrations), resolved
// with platform -> auction -> lot -> partner -> category precedence.

export const DEFAULT_VAT_BASIS_POINTS = percentToBasisPoints(7.5); // 750
export const DEFAULT_WHT_BASIS_POINTS = percentToBasisPoints(5); // 500
export const DEFAULT_SELLER_COMMISSION_RANGE_BP = {
  min: percentToBasisPoints(5),
  max: percentToBasisPoints(15),
};
export const DEFAULT_BUYER_PREMIUM_RANGE_BP = {
  min: percentToBasisPoints(5),
  max: percentToBasisPoints(10),
};
export const DEFAULT_BROKER_SPLIT_RANGE_BP = {
  min: percentToBasisPoints(10),
  max: percentToBasisPoints(25),
};
