import crypto from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import { query, queryOne } from '../../db.js';
import { processImage, removeImageSet, safeSegment } from '../../services/images.js';
import { logActivity } from '../../repositories/activity.js';

// Upload pipeline: multer keeps the file in memory, sharp writes the WebP
// canonical + variants to disk, and only the resulting PATH goes into
// media_library. Bytes never touch the database.
export const adminMediaRouter = Router();

const MAX_UPLOAD_MB = 15;
const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ACCEPTED.has(file.mimetype)) {
      const error = new Error('Only JPEG, PNG, WebP or AVIF images are accepted');
      error.status = 415;
      return cb(error);
    }
    return cb(null, true);
  },
});

adminMediaRouter.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Files are filed by department → entity → semantic name so a doctor's
    // photo lives beside that doctor rather than in one flat bucket.
    const department = safeSegment(req.body.department, 'general');
    const entity = safeSegment(req.body.entity, 'general');
    const original = req.file.originalname.replace(/\.[^/.]+$/, '');
    const name = safeSegment(req.body.name, safeSegment(original, `image-${Date.now()}`));

    const result = await processImage(req.file.buffer, { department, entity, name });

    const id = `media_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const dir = result.path.slice(0, result.path.lastIndexOf('/') + 1);
    await query(
      `INSERT INTO media_library (id, filename, path, full_path, size, type, alt_text)
       VALUES (:id, :filename, :path, :fullPath, :size, 'image/webp', :altText)
       ON DUPLICATE KEY UPDATE size = VALUES(size), uploaded_at = CURRENT_TIMESTAMP`,
      {
        id,
        filename: `${name}.webp`,
        path: dir,
        fullPath: result.path,
        size: result.size,
        altText: typeof req.body.alt_text === 'string' ? req.body.alt_text.slice(0, 500) : null,
      },
    );

    await logActivity(req.adminUser.id, 'upload', 'media_library', id, { path: result.path });

    res.status(201).json({
      success: true,
      media: {
        id,
        filename: `${name}.webp`,
        path: result.path,
        full_path: result.path,
        size: result.size,
        type: 'image/webp',
        width: result.width,
        height: result.height,
        variants: result.variants,
      },
    });
  } catch (error) { next(error); }
});

adminMediaRouter.delete('/:id', async (req, res, next) => {
  try {
    const row = await queryOne(
      'SELECT full_path AS fullPath FROM media_library WHERE id = :id',
      { id: req.params.id },
    );
    if (!row) return res.status(404).json({ error: 'Media not found' });

    await query('DELETE FROM media_library WHERE id = :id', { id: req.params.id });
    await removeImageSet(row.fullPath);
    await logActivity(req.adminUser.id, 'delete', 'media_library', req.params.id);

    res.json({ success: true });
  } catch (error) { next(error); }
});
