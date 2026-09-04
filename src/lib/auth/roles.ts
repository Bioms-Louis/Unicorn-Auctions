/**
 * RBAC role model for Unicorn Auctions.
 *
 * IMPORTANT: These types exist for type-safety and UI convenience only.
 * They are NOT the security boundary. Authorization is enforced:
 *   1. In Postgres via Row Level Security (see supabase/migrations)
 *   2. In server-side service functions (src/lib/**) before any mutation
 * Never gate a privileged operation on a role check that runs only in
 * the browser/client component.
 */

export const ROLES = [
  "super_admin",
  "admin",
  "auction_manager",
  "auctioneer",
  "clerk",
  "finance",
  "kyc_officer",
  "partner",
  "broker",
  "bidder",
  "floor_bidder",
] as const;

export type Role = (typeof ROLES)[number];

/** Roles that count as internal Unicorn Auctions staff. */
export const STAFF_ROLES: Role[] = [
  "super_admin",
  "admin",
  "auction_manager",
  "auctioneer",
  "clerk",
  "finance",
  "kyc_officer",
];

/** Roles that operate the live-auction clerk console. */
export const AUCTION_OPERATOR_ROLES: Role[] = [
  "super_admin",
  "admin",
  "auction_manager",
  "auctioneer",
  "clerk",
];

export function isStaffRole(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

export function isAuctionOperatorRole(role: Role): boolean {
  return AUCTION_OPERATOR_ROLES.includes(role);
}

/**
 * Coarse-grained permission map. Extend as domains are implemented.
 * Server services should check against this (or an equivalent DB-backed
 * policy) rather than hardcoding role checks inline everywhere.
 */
export const PERMISSIONS = {
  "auction:create": ["super_admin", "admin", "auction_manager"],
  "auction:manage_state": ["super_admin", "admin", "auction_manager", "auctioneer"],
  "lot:approve": ["super_admin", "admin", "auction_manager"],
  "bid:place_floor": ["clerk", "auctioneer", "super_admin", "admin"],
  "bid:place_online": ["bidder"],
  "kyc:review": ["super_admin", "admin", "kyc_officer"],
  "deposit:verify": ["super_admin", "admin", "finance"],
  "payment:verify_manual": ["super_admin", "admin", "finance"],
  "settlement:approve": ["super_admin", "admin", "finance"],
  "gate_pass:issue": ["super_admin", "admin", "finance"],
  "audit:view": ["super_admin", "admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}
