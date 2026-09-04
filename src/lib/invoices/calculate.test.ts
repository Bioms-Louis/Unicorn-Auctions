import { describe, expect, it } from "vitest";
import { kobo } from "@/lib/money";
import {
  calculateBrokerPayout,
  calculateBuyerInvoice,
  calculatePartnerSettlement,
} from "@/lib/invoices/calculate";

describe("calculateBuyerInvoice", () => {
  it("matches the acceptance-criteria scenario (₦5,300,000 hammer, VAT-applicable lot)", () => {
    // Section 71 acceptance scenario ends with a ₦5,300,000 winning bid.
    const hammerPriceKobo = kobo(530_000_000); // ₦5,300,000.00
    const result = calculateBuyerInvoice({
      hammerPriceKobo,
      buyerPremiumBp: 750, // 7.5%
      assetVatApplicable: true,
      assetVatBp: 750,
      premiumVatBp: 750,
    });

    expect(result.buyerPremiumKobo).toBe(39_750_000); // 7.5% of 530,000,000
    expect(result.assetVatKobo).toBe(39_750_000); // 7.5% of hammer price
    expect(result.premiumVatKobo).toBe(2_981_250); // 7.5% of buyer premium
    expect(result.totalKobo).toBe(
      hammerPriceKobo + 39_750_000 + 39_750_000 + 2_981_250,
    );
    // Every line item sums exactly to the total — no drift.
    const lineItemSum = result.lineItems.reduce((sum, li) => sum + li.amountKobo, 0);
    expect(lineItemSum).toBe(result.totalKobo);
  });

  it("omits asset VAT for VAT-exempt lots (e.g. real estate)", () => {
    const result = calculateBuyerInvoice({
      hammerPriceKobo: kobo(100_000_000),
      buyerPremiumBp: 1000,
      assetVatApplicable: false,
      assetVatBp: 750,
      premiumVatBp: 750,
    });
    expect(result.assetVatKobo).toBe(0);
    expect(result.lineItems.some((li) => li.lineType === "asset_vat")).toBe(false);
  });
});

describe("calculatePartnerSettlement", () => {
  it("deducts seller commission and VAT on that commission", () => {
    const result = calculatePartnerSettlement({
      hammerPriceKobo: kobo(530_000_000),
      sellerCommissionBp: 1000, // 10%
      sellerCommissionVatBp: 750,
    });

    expect(result.sellerCommissionKobo).toBe(53_000_000);
    expect(result.sellerCommissionVatKobo).toBe(3_975_000);
    expect(result.netSettlementKobo).toBe(
      530_000_000 - 53_000_000 - 3_975_000,
    );
  });
});

describe("calculateBrokerPayout", () => {
  it("deducts 5% WHT from the gross broker commission", () => {
    const result = calculateBrokerPayout({
      grossCommissionKobo: kobo(10_000_000), // ₦100,000
      whtBp: 500,
    });
    expect(result.whtKobo).toBe(500_000); // ₦5,000
    expect(result.netPayoutKobo).toBe(9_500_000); // ₦95,000
  });
});
