import { query } from '../db.js';

/** Append-only admin activity trail; failures are logged, never fatal. */
export async function logActivity(adminUserId, action, resource, resourceId, details) {
  try {
    await query(
      `INSERT INTO activity_log (admin_user_id, action, resource, resource_id, details)
       VALUES (:adminUserId, :action, :resource, :resourceId, :details)`,
      {
        adminUserId: adminUserId ?? null,
        action,
        resource,
        resourceId: resourceId != null ? String(resourceId) : null,
        details: details ? JSON.stringify(details) : null,
      },
    );
  } catch (error) {
    console.error(`[api] activity log write failed (${error.code ?? 'unknown'}): ${error.message}`);
  }
}
