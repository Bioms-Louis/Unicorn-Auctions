import { describe, expect, it } from "vitest";
import {
  addKobo,
  applyBasisPoints,
  formatNaira,
  kobo,
  nairaToKobo,
  percentToBasisPoints,
  subtractKobo,
} from "@/lib/money";

describe("nairaToKobo", () => {
  it("converts whole naira amounts", () => {
    expect(nairaToKobo(5_500_000)).toBe(550_000_000);
  });

  it("converts fractional naira amounts", () => {
    expect(nairaToKobo("100.50")).toBe(10_050);
  });

  it("converts negative amounts", () => {
    expect(nairaToKobo("-250.25")).toBe(-25_025);
  });
});

describe("percentToBasisPoints", () => {
  it("converts 7.5% to 750bp", () => {
    expect(percentToBasisPoints(7.5)).toBe(750);
  });
  it("converts 5% to 500bp", () => {
    expect(percentToBasisPoints(5)).toBe(500);
  });
});

describe("applyBasisPoints", () => {
  it("computes 7.5% VAT on a hammer price", () => {
    // ₦5,000,000 = 500,000,000 kobo; 7.5% = 37,500,000 kobo (₦375,000)
    const amount = kobo(500_000_000);
    expect(applyBasisPoints(amount, 750)).toBe(37_500_000);
  });

  it("computes 5% WHT on a broker commission", () => {
    const commission = kobo(1_000_00); // ₦1,000.00
    expect(applyBasisPoints(commission, 500)).toBe(5_000); // ₦50.00
  });

  it("rounds half-up deterministically", () => {
    // 1 kobo * 5% = 0.05 -> rounds to 0 (banker's-adjacent, half rounds up from .5)
    expect(applyBasisPoints(kobo(1), 500)).toBe(0);
    // 10 kobo * 5% = 0.5 -> rounds up to 1
    expect(applyBasisPoints(kobo(10), 500)).toBe(1);
  });

  it("rejects negative or non-integer basis points", () => {
    expect(() => applyBasisPoints(kobo(100), -1)).toThrow();
    expect(() => applyBasisPoints(kobo(100), 1.5)).toThrow();
  });
});

describe("addKobo / subtractKobo", () => {
  it("sums multiple amounts without float drift", () => {
    const total = addKobo(kobo(100), kobo(200), kobo(300));
    expect(total).toBe(600);
  });

  it("subtracts correctly", () => {
    expect(subtractKobo(kobo(500), kobo(200))).toBe(300);
  });
});

describe("formatNaira", () => {
  it("formats a kobo amount as NGN currency", () => {
    expect(formatNaira(kobo(550_000_000))).toContain("5,500,000.00");
  });
});
