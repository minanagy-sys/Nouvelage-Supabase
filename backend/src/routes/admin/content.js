import crypto from 'node:crypto';
import { Router } from 'express';
import { getResource } from '../../admin/resources.js';
import { listRows, getRow, createRow, updateRow, deleteRow, reorderRows } from '../../admin/crud.js';
import { query } from '../../db.js';
import { invalidate } from '../../cache.js';
import { logActivity } from '../../repositories/activity.js';

// Generic admin CRUD over the resource registry, plus the page_content
// upsert. Everything here sits behind requireAdmin (mounted in app.js).
export const adminContentRouter = Router();

// --- page content -----------------------------------------------------------

adminContentRouter.get('/pages/:key', async (req, res, next) => {
  try {
    const rows = await query(
      'SELECT content FROM page_content WHERE page_key = :key',
      { key: req.params.key },
    );
    if (!rows.length) return res.json({ content: {} });
    const content = typeof rows[0].content === 'string' ? JSON.parse(rows[0].content) : rows[0].content;
    res.json({ content });
  } catch (error) { next(error); }
});

adminContentRouter.put('/pages/:key', async (req, res, next) => {
  try {
    const key = req.params.key;
    if (!/^[a-z0-9-]{1,50}$/.test(key)) {
      return res.status(400).json({ error: 'Invalid page key' });
    }
    const content = JSON.stringify(req.body?.content ?? req.body ?? {});
    await query(
      `INSERT INTO page_content (id, page_key, content)
       VALUES (:id, :key, :content)
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      { id: crypto.randomUUID(), key, content },
    );
    invalidate('page_content');
    await logActivity(req.adminUser.id, 'update', 'page_content', key);
    res.json({ success: true });
  } catch (error) { next(error); }
});

// --- generic resources ------------------------------------------------------

adminContentRouter.param('resource', (req, res, next, name) => {
  const resource = getResource(name);
  if (!resource) return res.status(404).json({ error: `Unknown resource '${name}'` });
  req.resource = resource;
  return next();
});

adminContentRouter.get('/:resource', async (req, res, next) => {
  try { res.json({ rows: await listRows(req.resource) }); } catch (error) { next(error); }
});

adminContentRouter.post('/:resource/reorder', async (req, res, next) => {
  try {
    const ids = req.body?.ids;
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) {
      return res.status(400).json({ error: 'Body must be { ids: string[] }' });
    }
    await reorderRows(req.resource, ids);
    await logActivity(req.adminUser.id, 'reorder', req.resource.table, null, { count: ids.length });
    res.json({ success: true });
  } catch (error) { next(error); }
});

adminContentRouter.get('/:resource/:id', async (req, res, next) => {
  try {
    const row = await getRow(req.resource, req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({ row });
  } catch (error) { next(error); }
});

adminContentRouter.post('/:resource', async (req, res, next) => {
  try {
    const row = await createRow(req.resource, req.body ?? {});
    await logActivity(req.adminUser.id, 'create', req.resource.table, row.id);
    res.status(201).json({ row });
  } catch (error) { next(error); }
});

async function handleUpdate(req, res, next) {
  try {
    const row = await updateRow(req.resource, req.params.id, req.body ?? {});
    if (!row) return res.status(404).json({ error: 'Not found' });
    await logActivity(req.adminUser.id, 'update', req.resource.table, req.params.id);
    res.json({ row });
  } catch (error) { next(error); }
}

adminContentRouter.put('/:resource/:id', handleUpdate);
adminContentRouter.patch('/:resource/:id', handleUpdate);

adminContentRouter.delete('/:resource/:id', async (req, res, next) => {
  try {
    const deleted = await deleteRow(req.resource, req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    await logActivity(req.adminUser.id, 'delete', req.resource.table, req.params.id);
    res.json({ success: true });
  } catch (error) { next(error); }
});
