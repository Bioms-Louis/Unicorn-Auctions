/**
 * Lot state machine.
 *
 * draft -> pending_review -> approved -> scheduled -> active
 *   -> sold | unsold | passed
 * Any pre-active state may go to `withdrawn` (partner pulls it) or
 * `cancelled` (staff pulls it). `active` transitions to sold/unsold/passed
 * exclusively via close_lot() in the database (see BIDDING_ENGINE.md) —
 * never via a direct status UPDATE, so this state machine's `active` entry
 * only allows the pre-bidding transitions administrators are permitted to
 * make (e.g. cancelling a lot before it goes active).
 */

export type LotStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "scheduled"
  | "active"
  | "sold"
  | "unsold"
  | "passed"
  | "withdrawn"
  | "cancelled";

const ALLOWED_TRANSITIONS: Record<LotStatus, LotStatus[]> = {
  draft: ["pending_review", "withdrawn"],
  pending_review: ["approved", "draft", "cancelled"],
  approved: ["scheduled", "withdrawn", "cancelled"],
  scheduled: ["active", "withdrawn", "cancelled"],
  // sold/unsold/passed are set exclusively by close_lot() in the DB.
  active: ["cancelled"],
  sold: [],
  unsold: ["scheduled"], // re-offer in a future auction
  passed: ["scheduled"],
  withdrawn: [],
  cancelled: [],
};

export class InvalidLotTransitionError extends Error {
  constructor(from: LotStatus, to: LotStatus) {
    super(`Cannot transition lot from "${from}" to "${to}".`);
    this.name = "InvalidLotTransitionError";
  }
}

export function isValidLotTransition(from: LotStatus, to: LotStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertValidLotTransition(from: LotStatus, to: LotStatus): void {
  if (!isValidLotTransition(from, to)) {
    throw new InvalidLotTransitionError(from, to);
  }
}

export function isPubliclyVisibleLot(status: LotStatus): boolean {
  return ["scheduled", "active", "sold", "unsold", "passed"].includes(status);
}
