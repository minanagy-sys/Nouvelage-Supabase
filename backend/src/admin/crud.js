import crypto from 'node:crypto';
import { pool, query, queryOne, hydrateJson } from '../db.js';
import { tableRules } from './table-meta.js';
import { invalidate } from '../cache.js';

/** Type-appropriate blank used when MySQL needs a value and the client sent none. */
function blankFor(field) {
  switch (field.type) {
    case 'int':
    case 'decimal':
    case 'bool':
      return 0;
    case 'json':
      return '[]';
    case 'timestamp':
      return toMysqlDatetime(new Date().toISOString());
    default:
      return '';
  }
}

function toMysqlDatetime(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

/** Coerce one declared field's incoming value to what mysql2 should bind. */
function coerce(field, value) {
  if (value === null || value === undefined) return null;
  switch (field.type) {
    case 'bool':
      return value === true || value === 1 || value === '1' || value === 'true' ? 1 : 0;
    case 'int': {
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }
    case 'decimal': {
      const parsed = Number.parseFloat(value);
      return Number.isNaN(parsed) ? null : parsed;
    }
    case 'json':
      return typeof value === 'string' ? value : JSON.stringify(value);
    case 'timestamp':
      return toMysqlDatetime(value);
    default:
      return typeof value === 'string' ? value : String(value);
  }
}

/**
 * Pick and coerce only DECLARED fields from the request body — an unknown
 * body key is dropped, not trusted. NOT NULL rules are then satisfied per
 * table-meta.js so a blank never turns into a 500.
 */
async function buildValues(resource, body, { partial }) {
  const rules = await tableRules(resource.table);
  const values = {};

  for (const field of resource.fields) {
    const raw = body[field.column];
    const value = raw === undefined ? undefined : coerce(field, raw);

    if (value === undefined) {
      if (!partial && rules.needsValue.has(field.column)) {
        values[field.column] = blankFor(field); // omitted, no default to fall back on
      }
      continue;
    }
    if (value === null && rules.notNull.has(field.column)) {
      values[field.column] = blankFor(field); // explicit NULL into NOT NULL
      continue;
    }
    values[field.column] = value;
  }

  for (const field of resource.fields) {
    if (!partial && field.required && (values[field.column] === undefined || values[field.column] === '')) {
      const error = new Error(`'${field.column}' is required`);
      error.status = 400;
      throw error;
    }
  }

  return values;
}

function selectAll(resource) {
  return `SELECT * FROM \`${resource.table}\``;
}

export async function listRows(resource, { includeInactive = true } = {}) {
  let sql = selectAll(resource);
  if (!includeInactive) sql += ' WHERE is_active = 1';
  if (resource.defaultOrder) sql += ` ORDER BY ${resource.defaultOrder}`;
  const rows = await query(sql);
  return hydrateJson(rows, resource.jsonFields);
}

export async function getRow(resource, id) {
  const row = await queryOne(`${selectAll(resource)} WHERE id = :id`, { id });
  if (!row) return null;
  hydrateJson([row], resource.jsonFields);
  return row;
}

export async function createRow(resource, body) {
  const values = await buildValues(resource, body, { partial: false });

  if (resource.idType === 'uuid') {
    values.id = crypto.randomUUID();
  } else {
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    if (!id) {
      const error = new Error("'id' is required");
      error.status = 400;
      throw error;
    }
    values.id = id;
  }

  // New rows append at the end; position changes only via reorder.
  if (resource.orderColumn && values[resource.orderColumn] === undefined) {
    const row = await queryOne(
      `SELECT COALESCE(MAX(\`${resource.orderColumn}\`), -1) + 1 AS next FROM \`${resource.table}\``,
    );
    values[resource.orderColumn] = row.next;
  }

  const columns = Object.keys(values);
  const sql = `INSERT INTO \`${resource.table}\` (${columns.map((c) => `\`${c}\``).join(', ')})
               VALUES (${columns.map((c) => `:${c}`).join(', ')})`;
  await query(sql, values);
  invalidate(resource.table);
  return getRow(resource, values.id);
}

export async function updateRow(resource, id, body) {
  const values = await buildValues(resource, body, { partial: true });
  const columns = Object.keys(values);
  if (!columns.length) return getRow(resource, id);

  const sql = `UPDATE \`${resource.table}\`
                  SET ${columns.map((c) => `\`${c}\` = :${c}`).join(', ')}
                WHERE id = :__id`;
  const result = await query(sql, { ...values, __id: id });
  invalidate(resource.table);
  if (!result.affectedRows) return null;
  return getRow(resource, id);
}

export async function deleteRow(resource, id) {
  const result = await query(`DELETE FROM \`${resource.table}\` WHERE id = :id`, { id });
  invalidate(resource.table);
  return result.affectedRows > 0;
}

/** Persist a full ordering in one transaction: [{id}, {id}, ...] by position. */
export async function reorderRows(resource, ids) {
  if (!resource.orderColumn) {
    const error = new Error('Resource is not orderable');
    error.status = 400;
    throw error;
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (let index = 0; index < ids.length; index += 1) {
      await connection.query(
        `UPDATE \`${resource.table}\` SET \`${resource.orderColumn}\` = ? WHERE id = ?`,
        [index, ids[index]],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  invalidate(resource.table);
}
