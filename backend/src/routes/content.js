import { Router } from 'express';
import * as content from '../repositories/content.js';

// Public, read-only content API. Mirrors the Supabase RLS "public read"
// policies: only active/published rows ever leave this router.
export const contentRouter = Router();

contentRouter.get('/pages/:key', async (req, res, next) => {
  try {
    const pageContent = await content.getPageContent(req.params.key);
    if (pageContent === null) return res.status(404).json({ error: 'Page not found' });
    res.json({ content: pageContent });
  } catch (error) { next(error); }
});

contentRouter.get('/bundles', async (req, res, next) => {
  try { res.json({ bundles: await content.listBundles() }); } catch (error) { next(error); }
});

contentRouter.get('/bundles/:id', async (req, res, next) => {
  try {
    const bundle = await content.getBundle(req.params.id);
    if (!bundle || !bundle.is_active) return res.status(404).json({ error: 'Bundle not found' });
    res.json({ bundle });
  } catch (error) { next(error); }
});

contentRouter.get('/parent-bundles', async (req, res, next) => {
  try { res.json({ parentBundles: await content.listParentBundles() }); } catch (error) { next(error); }
});

contentRouter.get('/doctors', async (req, res, next) => {
  try { res.json({ doctors: await content.listDoctors() }); } catch (error) { next(error); }
});

contentRouter.get('/doctors/:idOrSlug', async (req, res, next) => {
  try {
    const doctor = await content.getDoctor(req.params.idOrSlug);
    if (!doctor || !doctor.is_active) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ doctor });
  } catch (error) { next(error); }
});

contentRouter.get('/services', async (req, res, next) => {
  try { res.json({ services: await content.listServices() }); } catch (error) { next(error); }
});

contentRouter.get('/services/categories', async (req, res, next) => {
  try { res.json({ categories: await content.listServiceCategories() }); } catch (error) { next(error); }
});

contentRouter.get('/blog', async (req, res, next) => {
  try { res.json({ posts: await content.listBlogPosts() }); } catch (error) { next(error); }
});

contentRouter.get('/blog/:slug', async (req, res, next) => {
  try {
    const post = await content.getBlogPost(req.params.slug);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (error) { next(error); }
});

contentRouter.get('/branches', async (req, res, next) => {
  try { res.json({ branches: await content.listBranches() }); } catch (error) { next(error); }
});
