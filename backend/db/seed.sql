-- ============================================================================
-- NOUVELAGE — initial data
-- Same content the Supabase schema seeded, with fixed UUIDs so the seed is
-- idempotent (INSERT IGNORE + stable ids). Live data arrives separately via
-- backend/scripts/import-legacy.js.
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT IGNORE INTO page_content (id, page_key, content) VALUES
('a2f1c7e0-0001-4000-8000-000000000001', 'landing', JSON_OBJECT(
  'logo_url', '/assets/img/nouvelage-logo-white.svg',
  'logo_alt', 'Nouvelage® Aesthetic Clinics',
  'forher_bg_image', '/assets/img/home-for-her.jpg',
  'forher_eyebrow', 'LUXURY TREATMENTS',
  'forher_welcome', 'For Her',
  'forher_subtitle', 'Embrace Your Natural Beauty',
  'forher_cta_text', 'Explore Services',
  'forher_cta_link', '/forher',
  'forhim_bg_image', '/assets/img/home-for-him.jpg',
  'forhim_eyebrow', 'PREMIUM GROOMING',
  'forhim_welcome', 'For Him',
  'forhim_subtitle', 'Redefine Your Confidence',
  'forhim_cta_text', 'Discover Treatments',
  'forhim_cta_link', '/forhim',
  'locations', 'Zamalek, Cairo • New Cairo • 6th of October',
  'animation_duration', 1000,
  'overlay_opacity', 0.6,
  'meta_title', 'Nouvelage - Luxury Aesthetic Clinic in Egypt',
  'meta_description', 'Egypt''s premier aesthetic clinic offering world-class beauty treatments for both men and women. Experience excellence in skincare, wellness, and transformation.',
  'meta_keywords', 'aesthetic clinic egypt, luxury spa cairo, beauty treatments, cosmetic clinic, skincare egypt'
));

INSERT IGNORE INTO parent_bundles (id, name, slug, description, icon, order_index, is_active) VALUES
('b3d2e8f0-0001-4000-8000-000000000001', 'Hair Restoration', 'hair-restoration', 'Advanced hair restoration and growth treatments', 'hair', 1, 1),
('b3d2e8f0-0002-4000-8000-000000000002', 'Face', 'face', 'Facial treatments and rejuvenation procedures', 'face', 2, 1),
('b3d2e8f0-0003-4000-8000-000000000003', 'Lasers', 'lasers', 'Advanced laser treatments for skin and hair', 'laser', 3, 1),
('b3d2e8f0-0004-4000-8000-000000000004', 'Body', 'body', 'Body contouring and sculpting treatments', 'body', 4, 1),
('b3d2e8f0-0005-4000-8000-000000000005', 'Skin Care', 'skin-care', 'Professional skin care and wellness treatments', 'skin', 5, 1);
