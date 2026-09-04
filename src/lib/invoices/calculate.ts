import { kobo, addKobo, applyBasisPoints, type Kobo } from "@/lib/money";

export interface CalculateBuyerInvoiceInput {
  hammerPriceKobo: Kobo;
  buyerPremiumBp: number; // e.g. 750 = 7.5%
  assetVatApplicable: boolean;
  assetVatBp: number; // typically the platform VAT default unless overridden
  premiumVatBp: number; // VAT charged on the buyer premium itself
}

export interface InvoiceLineItem {
  description: string;
  amountKobo: Kobo;
  lineType: "hammer_price" | "buyer_premium" | "asset_vat" | "premium_vat";
}

export interface CalculatedBuyerInvoice {
  lineItems: InvoiceLineItem[];
  hammerPriceKobo: Kobo;
  buyerPremiumKobo: Kobo;
  assetVatKobo: Kobo;
  premiumVatKobo: Kobo;
  totalKobo: Kobo;
}

/**
 * Pure, deterministic calculation — no I/O. Every invoice should be
 * reproducible from its stored line items and the rates that were in
 * effect at sale time (per "Financial Precision", section 64). Rates are
 * passed in already-resolved (see src/lib/taxes/resolve.ts) rather than
 * looked up here, so this function stays trivially unit-testable.
 */
export function calculateBuyerInvoice(input: CalculateBuyerInvoiceInput): CalculatedBuyerInvoice {
  const buyerPremiumKobo = applyBasisPoints(input.hammerPriceKobo, input.buyerPremiumBp);
  const assetVatKobo = input.assetVatApplicable
    ? applyBasisPoints(input.hammerPriceKobo, input.assetVatBp)
    : kobo(0);
  const premiumVatKobo = applyBasisPoints(buyerPremiumKobo, input.premiumVatBp);

  const totalKobo = addKobo(input.hammerPriceKobo, buyerPremiumKobo, assetVatKobo, premiumVatKobo);

  return {
    lineItems: [
      { description: "Hammer price", amountKobo: input.hammerPriceKobo, lineType: "hammer_price" },
      { description: "Buyer premium", amountKobo: buyerPremiumKobo, lineType: "buyer_premium" },
      ...(input.assetVatApplicable
        ? [{ description: "VAT on hammer price", amountKobo: assetVatKobo, lineType: "asset_vat" as const }]
        : []),
      { description: "VAT on buyer premium", amountKobo: premiumVatKobo, lineType: "premium_vat" },
    ],
    hammerPriceKobo: input.hammerPriceKobo,
    buyerPremiumKobo,
    assetVatKobo,
    premiumVatKobo,
    totalKobo,
  };
}

export interface CalculatePartnerSettlementInput {
  hammerPriceKobo: Kobo;
  sellerCommissionBp: number;
  sellerCommissionVatBp: number;
}

export interface CalculatedPartnerSettlement {
  lineItems: { description: string; amountKobo: Kobo; lineType: string }[];
  hammerPriceKobo: Kobo;
  sellerCommissionKobo: Kobo;
  sellerCommissionVatKobo: Kobo;
  netSettlementKobo: Kobo;
}

/** Gross hammer price − seller commission − VAT on that commission = net settlement. */
export function calculatePartnerSettlement(
  input: CalculatePartnerSettlementInput,
): CalculatedPartnerSettlement {
  const sellerCommissionKobo = applyBasisPoints(input.hammerPriceKobo, input.sellerCommissionBp);
  const sellerCommissionVatKobo = applyBasisPoints(sellerCommissionKobo, input.sellerCommissionVatBp);
  const netSettlementKobo = kobo(
    input.hammerPriceKobo - sellerCommissionKobo - sellerCommissionVatKobo,
  );

  return {
    lineItems: [
      { description: "Hammer price", amountKobo: input.hammerPriceKobo, lineType: "hammer_price" },
      { description: "Seller commission", amountKobo: kobo(-sellerCommissionKobo), lineType: "seller_commission" },
      { description: "VAT on seller commission", amountKobo: kobo(-sellerCommissionVatKobo), lineType: "seller_commission_vat" },
    ],
    hammerPriceKobo: input.hammerPriceKobo,
    sellerCommissionKobo,
    sellerCommissionVatKobo,
    netSettlementKobo,
  };
}

export interface CalculateBrokerPayoutInput {
  grossCommissionKobo: Kobo;
  whtBp: number;
}

export interface CalculatedBrokerPayout {
  grossCommissionKobo: Kobo;
  whtKobo: Kobo;
  netPayoutKobo: Kobo;
}

/** Gross broker commission − WHT = net payout. */
export function calculateBrokerPayout(input: CalculateBrokerPayoutInput): CalculatedBrokerPayout {
  const whtKobo = applyBasisPoints(input.grossCommissionKobo, input.whtBp);
  const netPayoutKobo = kobo(input.grossCommissionKobo - whtKobo);
  return { grossCommissionKobo: input.grossCommissionKobo, whtKobo, netPayoutKobo };
}
