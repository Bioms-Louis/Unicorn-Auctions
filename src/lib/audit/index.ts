import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

export interface AuditEventInput {
  actorId: string | null;
  action: string; // e.g. "lot.approve", "bidder.suspend", "kyc.approve"
  entityType: string; // e.g. "lot", "bidder", "auction"
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Writes an append-only audit event. Call this from every domain service
 * function that performs a financially or operationally significant
 * mutation — see docs/ARCHITECTURE.md "AUDIT_FIRST principle": for any such
 * action, ask "can we prove exactly what happened later?" If not, log it.
 *
 * audit_logs is trigger-protected against UPDATE/DELETE at the DB level,
 * so this function only ever inserts.
 */
export async function writeAuditEvent(event: AuditEventInput): Promise<void> {
  const service = createServiceRoleClient();

  const { error } = await service.from("audit_logs").insert({
    actor_id: event.actorId,
    action: event.action,
    entity_type: event.entityType,
    entity_id: event.entityId ?? null,
    metadata: event.metadata ?? {},
    ip_address: event.ipAddress ?? null,
    user_agent: event.userAgent ?? null,
  });

  if (error) {
    // Deliberately non-throwing: a failure to log an audit event should be
    // surfaced (e.g. to error monitoring) but should not block the
    // underlying business operation that already succeeded. Wire this up
    // to real error monitoring (Sentry, etc.) once available.
    console.error("[audit] failed to write audit event", event.action, error.message);
  }
}
