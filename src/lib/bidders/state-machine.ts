/**
 * Bidder eligibility state machine (section 7 of the operational brief).
 *
 * pending -> kyc_pending -> kyc_approved -> deposit_pending
 *   -> deposit_verified -> bidding_enabled
 * Any state may move to `suspended` or `rejected`.
 *
 * IMPORTANT: this governs the *state label* transition only. Whether a
 * bidder is actually allowed to bid is re-verified server-side inside
 * place_bid() (bidders.state = 'bidding_enabled'), never inferred from the
 * frontend alone.
 */

export type BidderState =
  | "pending"
  | "kyc_pending"
  | "kyc_approved"
  | "deposit_pending"
  | "deposit_verified"
  | "bidding_enabled"
  | "suspended"
  | "rejected";

const ALLOWED_TRANSITIONS: Record<BidderState, BidderState[]> = {
  pending: ["kyc_pending", "rejected"],
  kyc_pending: ["kyc_approved", "rejected"],
  kyc_approved: ["deposit_pending"],
  deposit_pending: ["deposit_verified"],
  deposit_verified: ["bidding_enabled"],
  bidding_enabled: ["suspended"],
  suspended: ["bidding_enabled", "rejected"], // reinstate or permanently reject
  rejected: [],
};

export class InvalidBidderTransitionError extends Error {
  constructor(from: BidderState, to: BidderState) {
    super(`Cannot transition bidder from "${from}" to "${to}".`);
    this.name = "InvalidBidderTransitionError";
  }
}

export function isValidBidderTransition(from: BidderState, to: BidderState): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertValidBidderTransition(from: BidderState, to: BidderState): void {
  if (!isValidBidderTransition(from, to)) {
    throw new InvalidBidderTransitionError(from, to);
  }
}

export function isEligibleToBid(state: BidderState): boolean {
  return state === "bidding_enabled";
}
