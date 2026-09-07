import { query } from '../db.js';
import { config } from '../config.js';

/**
 * Column rules introspected from information_schema, kept as TWO sets per
 * table — the distinction matters:
 *
 *   notNull    — every NOT NULL column: an explicit `null` in the body must
 *                be replaced with a type-appropriate blank or MySQL rejects
 *                the row even when the column has a DEFAULT.
 *   needsValue — NOT NULL columns with no default and no auto/generated
 *                value: when the client omits them on a full insert, a blank
 *                must be supplied or the insert fails.
 *
 * Handling only the second case leaves `NOT NULL DEFAULT ''` columns
 * rejecting an explicit null — the classic "add a new record → Internal
 * server error".
 */
const cache = new Map();

export async function tableRules(table) {
  const hit = cache.get(table);
  if (hit) return hit;

  const rows = await query(
    `SELECT COLUMN_NAME AS columnName, IS_NULLABLE AS isNullable,
            COLUMN_DEFAULT AS columnDefault, EXTRA AS extra
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = :schema AND TABLE_NAME = :table`,
    { schema: config.db.database, table },
  );

  const entry = { notNull: new Set(), needsValue: new Set() };
  for (const row of rows) {
    if (row.isNullable !== 'NO') continue;
    entry.notNull.add(row.columnName);
    const selfFilling = /auto_increment|DEFAULT_GENERATED|VIRTUAL|STORED/i.test(row.extra ?? '');
    if (row.columnDefault === null && !selfFilling) entry.needsValue.add(row.columnName);
  }

  cache.set(table, entry);
  return entry;
}
