/**
 * Auction state machine.
 *
 * Auction states: draft -> pending_review -> scheduled -> registration_open
 *   -> inspection_open -> live <-> paused -> completed
 * Any non-terminal state may transition to `cancelled`.
 * `completed` and `cancelled` may transition to `archived`.
 *
 * This is the single source of truth for "is this transition allowed" at
 * the application layer. Server actions/services must call
 * assertValidAuctionTransition() before issuing an UPDATE — never let a
 * caller set auctions.status to an arbitrary value.
 */

export type AuctionStatus =
  | "draft"
  | "pending_review"
  | "scheduled"
  | "registration_open"
  | "inspection_open"
  | "live"
  | "paused"
  | "completed"
  | "cancelled"
  | "archived";

const FORWARD_PATH: AuctionStatus[] = [
  "draft",
  "pending_review",
  "scheduled",
  "registration_open",
  "inspection_open",
  "live",
  "completed",
];

const ALLOWED_TRANSITIONS: Record<AuctionStatus, AuctionStatus[]> = {
  draft: ["pending_review", "cancelled"],
  pending_review: ["scheduled", "draft", "cancelled"],
  scheduled: ["registration_open", "cancelled"],
  registration_open: ["inspection_open", "cancelled"],
  inspection_open: ["live", "cancelled"],
  live: ["paused", "completed", "cancelled"],
  paused: ["live", "cancelled"],
  completed: ["archived"],
  cancelled: ["archived"],
  archived: [],
};

export class InvalidAuctionTransitionError extends Error {
  constructor(from: AuctionStatus, to: AuctionStatus) {
    super(`Cannot transition auction from "${from}" to "${to}".`);
    this.name = "InvalidAuctionTransitionError";
  }
}

export function isValidAuctionTransition(from: AuctionStatus, to: AuctionStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertValidAuctionTransition(from: AuctionStatus, to: AuctionStatus): void {
  if (!isValidAuctionTransition(from, to)) {
    throw new InvalidAuctionTransitionError(from, to);
  }
}

/** True once an auction has left draft/pending_review and can be shown publicly. */
export function isPubliclyVisible(status: AuctionStatus): boolean {
  return !["draft", "pending_review"].includes(status);
}

export { FORWARD_PATH as AUCTION_HAPPY_PATH };
