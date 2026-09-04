import { describe, expect, it } from "vitest";
import {
  assertValidBidderTransition,
  isEligibleToBid,
  isValidBidderTransition,
} from "@/lib/bidders/state-machine";

describe("bidder state machine", () => {
  it("allows the full onboarding happy path", () => {
    expect(isValidBidderTransition("pending", "kyc_pending")).toBe(true);
    expect(isValidBidderTransition("kyc_pending", "kyc_approved")).toBe(true);
    expect(isValidBidderTransition("kyc_approved", "deposit_pending")).toBe(true);
    expect(isValidBidderTransition("deposit_pending", "deposit_verified")).toBe(true);
    expect(isValidBidderTransition("deposit_verified", "bidding_enabled")).toBe(true);
  });

  it("rejects skipping KYC or deposit steps", () => {
    expect(isValidBidderTransition("pending", "bidding_enabled")).toBe(false);
    expect(isValidBidderTransition("kyc_approved", "bidding_enabled")).toBe(false);
    expect(() => assertValidBidderTransition("pending", "deposit_verified")).toThrow();
  });

  it("allows suspension from bidding_enabled and reinstatement", () => {
    expect(isValidBidderTransition("bidding_enabled", "suspended")).toBe(true);
    expect(isValidBidderTransition("suspended", "bidding_enabled")).toBe(true);
    expect(isValidBidderTransition("suspended", "rejected")).toBe(true);
  });

  it("treats rejected as terminal", () => {
    expect(isValidBidderTransition("rejected", "pending")).toBe(false);
    expect(isValidBidderTransition("rejected", "kyc_pending")).toBe(false);
  });

  it("isEligibleToBid is true only for bidding_enabled", () => {
    expect(isEligibleToBid("bidding_enabled")).toBe(true);
    expect(isEligibleToBid("deposit_verified")).toBe(false);
    expect(isEligibleToBid("suspended")).toBe(false);
  });
});
