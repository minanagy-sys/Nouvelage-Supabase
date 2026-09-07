-- ============================================================================
-- NOUVELAGE — complete MySQL database install (one-file import)
--
-- Convenience bundle of backend/db/schema.sql + admin-schema.sql + seed.sql
-- for importing directly via phpMyAdmin / MySQL Workbench / the mysql CLI:
--
--   mysql -u <user> -p <database_name> < nouvelage-database.sql
--
-- Select (or create) the target database BEFORE importing — this file
-- deliberately names no database so it can be pointed at nouvelage,
-- nouvelage_staging, or anything else. To create one first:
--
--   CREATE DATABASE nouvelage DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Everything is idempotent (CREATE TABLE IF NOT EXISTS / INSERT IGNORE).
-- After importing, create the admin account with:
--   ADMIN_EMAIL=... ADMIN_PASSWORD=... node backend/scripts/create-admin.js
-- ============================================================================

-- ============================================================================
-- NOUVELAGE — MySQL 8.4 schema (public content tables)
-- Translated from backend/db/supabase-schema-reference.sql (Postgres/Supabase).
--
-- Conventions
--   * No CREATE DATABASE / USE here: setup-db.js and migrate.js select the

-- ============================================================================
-- NOUVELAGE — MySQL 8.4 schema (public content tables)
-- Translated from backend/db/supabase-schema-reference.sql (Postgres/Supabase).
--
-- Conventions
--   * No CREATE DATABASE / USE here: setup-db.js and migrate.js select the
--     configured database before applying this file, so DB_NAME stays real.
--   * Tables that carried Postgres UUID keys keep CHAR(36) primary keys —
--     doctors, blog posts and bundles are addressed by id/slug in URLs and
--     stored cart items, so identifiers must survive the migration verbatim.
--   * Tables that carried custom VARCHAR ids (bundles, blog_posts,
--     media_library) keep them unchanged.
--   * Postgres text[] and jsonb both become native MySQL JSON.
--   * All image/media columns store PATHS ONLY — never bytes, never base64.
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ----------------------------------------------------------------------------
-- page_content — all editable page copy, one JSON document per page
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS page_content (
  id          CHAR(36)     NOT NULL,
  page_key    VARCHAR(50)  NOT NULL,
  content     JSON         NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_page_content_key (page_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- parent_bundles — bundle categories (Hair Restoration, Face, ...)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS parent_bundles (
  id           CHAR(36)     NOT NULL,
  name         VARCHAR(100) NOT NULL,
  slug         VARCHAR(100) NOT NULL,
  description  TEXT         NULL,
  icon         VARCHAR(50)  NULL,
  order_index  INT          NOT NULL DEFAULT 0,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_parent_bundles_slug (slug),
  KEY ix_parent_bundles_listing (is_active, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- bundles — treatment packages; custom string ids like "h1-biotin-starter"
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bundles (
  id                 VARCHAR(100) NOT NULL,
  parent_category_id CHAR(36)     NULL,
  parent_category    VARCHAR(100) NULL,

  card_number        VARCHAR(10)  NULL,
  card_title         VARCHAR(200) NOT NULL,
  card_image         VARCHAR(500) NULL,
  card_price         VARCHAR(50)  NULL,
  card_ribbon        VARCHAR(50)  NULL,

  is_active          TINYINT(1)   NOT NULL DEFAULT 1,
  show_in_grid       TINYINT(1)   NOT NULL DEFAULT 1,
  show_price         TINYINT(1)   NOT NULL DEFAULT 1,
  show_in_slider     TINYINT(1)   NOT NULL DEFAULT 0,

  use_luxury_modal   TINYINT(1)   NOT NULL DEFAULT 1,
  modal_title        VARCHAR(200) NULL,

  price_old          VARCHAR(50)  NULL,
  price_new          VARCHAR(50)  NOT NULL,
  price_save         VARCHAR(50)  NULL,
  price_unit         VARCHAR(10)  NOT NULL DEFAULT 'EGP',
  show_installment   TINYINT(1)   NOT NULL DEFAULT 0,
  installment_text   VARCHAR(100) NULL,

  services_list      JSON         NOT NULL,
  services_label     VARCHAR(50)  NOT NULL DEFAULT 'Includes',

  duration           VARCHAR(50)  NULL,
  visits             VARCHAR(50)  NULL,
  channel            VARCHAR(200) NULL,

  why_box_text       TEXT         NULL,
  gallery            JSON         NOT NULL,

  slider_tag         VARCHAR(50)  NULL,
  slider_title       VARCHAR(200) NULL,
  slider_bg_image    VARCHAR(500) NULL,
  slider_bg_color    VARCHAR(50)  NOT NULL DEFAULT 'bg-espresso',
  slider_cta_text    VARCHAR(50)  NOT NULL DEFAULT 'Learn More →',
  slider_order       INT          NOT NULL DEFAULT 999,

  order_index        INT          NOT NULL DEFAULT 0,

  catalogue_theme    VARCHAR(50)  NOT NULL DEFAULT 'default',
  catalogue_badge    VARCHAR(50)  NULL,

  created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_bundles_listing  (is_active, order_index),
  KEY ix_bundles_slider   (show_in_slider, slider_order),
  KEY ix_bundles_category (parent_category_id),
  CONSTRAINT fk_bundles_parent
    FOREIGN KEY (parent_category_id) REFERENCES parent_bundles (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- doctors — team profiles; array-ish fields are JSON, images are paths
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
  id                   CHAR(36)      NOT NULL,
  slug                 VARCHAR(200)  NULL,

  name                 VARCHAR(200)  NOT NULL,
  title                VARCHAR(50)   NULL,
  specialization       VARCHAR(200)  NULL,
  sub_specialties      JSON          NOT NULL,

  qualifications       JSON          NOT NULL,
  certificates         JSON          NOT NULL,
  experience           INT           NOT NULL DEFAULT 0,
  languages            JSON          NOT NULL,
  services             JSON          NOT NULL,
  rating               DECIMAL(3,2)  NOT NULL DEFAULT 0.00,

  branches             JSON          NOT NULL,
  available_days       JSON          NOT NULL,
  gender               VARCHAR(10)   NULL,

  profile_image        VARCHAR(500)  NULL,
  before_after_gallery JSON          NOT NULL,

  bio                  TEXT          NULL,
  long_bio             TEXT          NULL,
  philosophy           TEXT          NULL,

  featured             TINYINT(1)    NOT NULL DEFAULT 0,
  order_index          INT           NOT NULL DEFAULT 0,
  is_active            TINYINT(1)    NOT NULL DEFAULT 1,

  meta_title           VARCHAR(200)  NULL,
  meta_description     TEXT          NULL,
  meta_keywords        TEXT          NULL,

  instagram_url        VARCHAR(200)  NULL,
  facebook_url         VARCHAR(200)  NULL,
  linkedin_url         VARCHAR(200)  NULL,

  created_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_doctors_slug (slug),
  KEY ix_doctors_listing  (is_active, order_index),
  KEY ix_doctors_featured (featured, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- blog_posts — custom string ids like "post_1234567890_abc123"
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id               VARCHAR(100)  NOT NULL,
  slug             VARCHAR(200)  NOT NULL,

  title            VARCHAR(300)  NOT NULL,
  subtitle         VARCHAR(500)  NULL,
  excerpt          TEXT          NULL,
  content          MEDIUMTEXT    NOT NULL,
  featured_image   VARCHAR(500)  NULL,

  author           VARCHAR(200)  NULL,
  author_image     VARCHAR(500)  NULL,

  category         VARCHAR(100)  NULL,
  tags             JSON          NOT NULL,

  status           VARCHAR(20)   NOT NULL DEFAULT 'draft',
  publish_date     TIMESTAMP     NULL,

  read_time        VARCHAR(20)   NULL,
  related_posts    JSON          NOT NULL,

  meta_title       VARCHAR(200)  NULL,
  meta_description TEXT          NULL,
  meta_keywords    TEXT          NULL,

  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_blog_posts_slug (slug),
  KEY ix_blog_posts_listing  (status, publish_date),
  KEY ix_blog_posts_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- media_library — file metadata only; bytes live on disk under uploads/
-- (the Supabase data_url base64 column is intentionally gone)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_library (
  id          VARCHAR(100)  NOT NULL,
  filename    VARCHAR(300)  NOT NULL,
  path        VARCHAR(500)  NULL,
  full_path   VARCHAR(600)  NULL,
  size        BIGINT        NULL,
  type        VARCHAR(100)  NULL,
  alt_text    VARCHAR(500)  NULL,
  uploaded_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_media_path     (path),
  KEY ix_media_uploaded (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- services — individual treatments (separate from bundles)
-- parent_service exists in the live database (drifted from the repo schema)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id               CHAR(36)      NOT NULL,
  slug             VARCHAR(200)  NOT NULL,

  name             VARCHAR(200)  NOT NULL,
  subtitle         VARCHAR(500)  NULL,
  description      TEXT          NULL,

  featured_image   VARCHAR(500)  NULL,
  gallery          JSON          NOT NULL,

  duration         VARCHAR(50)   NULL,
  price            VARCHAR(50)   NULL,
  price_unit       VARCHAR(10)   NOT NULL DEFAULT 'EGP',

  benefits         JSON          NOT NULL,
  procedure_steps  JSON          NOT NULL,
  faq              JSON          NOT NULL,

  category         VARCHAR(100)  NULL,
  parent_service   VARCHAR(200)  NULL,
  tags             JSON          NOT NULL,

  -- Live-drifted fields the dashboard editor and public services page use
  card_title            VARCHAR(200) NULL,
  card_number           VARCHAR(10)  NULL,
  card_ribbon           VARCHAR(50)  NULL,
  card_description      TEXT         NULL,
  card_image            VARCHAR(500) NULL,
  card_price            VARCHAR(50)  NULL,
  card_button_text      VARCHAR(100) NULL,
  detail_title          VARCHAR(300) NULL,
  detail_subtitle       VARCHAR(500) NULL,
  detail_tagline        VARCHAR(500) NULL,
  hero_background_image VARCHAR(500) NULL,
  modal_title           VARCHAR(200) NULL,
  meta_duration         VARCHAR(100) NULL,
  meta_downtime         VARCHAR(100) NULL,
  meta_lasts            VARCHAR(100) NULL,
  meta_sessions         VARCHAR(100) NULL,
  how_it_works_steps    JSON         NULL,
  timeline              JSON         NULL,
  what_you_achieve      JSON         NULL,
  products_used         JSON         NULL,
  specialist_doctor_ids JSON         NULL,
  price_details         TEXT         NULL,
  show_price            TINYINT(1)   NOT NULL DEFAULT 1,
  show_in_grid          TINYINT(1)   NOT NULL DEFAULT 1,
  offer_title           VARCHAR(300) NULL,
  offer_subtitle        VARCHAR(500) NULL,
  offer_eyebrow         VARCHAR(200) NULL,
  offer_description     TEXT         NULL,
  offer_cover_image     VARCHAR(500) NULL,
  offer_cta_text        VARCHAR(100) NULL,
  offer_cta_link        VARCHAR(300) NULL,
  cta_button_text       VARCHAR(100) NULL,
  whatsapp_button_text  VARCHAR(100) NULL,
  whatsapp_number       VARCHAR(50)  NULL,

  featured         TINYINT(1)    NOT NULL DEFAULT 0,
  order_index      INT           NOT NULL DEFAULT 0,
  is_active        TINYINT(1)    NOT NULL DEFAULT 1,

  meta_title       VARCHAR(200)  NULL,
  meta_description TEXT          NULL,
  meta_keywords    TEXT          NULL,

  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_services_slug (slug),
  KEY ix_services_listing  (is_active, order_index),
  KEY ix_services_featured (featured, order_index),
  KEY ix_services_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- branches — clinic locations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS branches (
  id            CHAR(36)       NOT NULL,
  slug          VARCHAR(200)   NOT NULL,

  branch_name   VARCHAR(200)   NOT NULL,
  city          VARCHAR(100)   NOT NULL,
  address       TEXT           NOT NULL,

  phone         VARCHAR(50)    NULL,
  email         VARCHAR(200)   NULL,
  whatsapp      VARCHAR(50)    NULL,

  hours_weekday VARCHAR(100)   NULL,
  hours_weekend VARCHAR(100)   NULL,

  latitude      DECIMAL(10,8)  NULL,
  longitude     DECIMAL(11,8)  NULL,
  show_in_map   TINYINT(1)     NOT NULL DEFAULT 1,

  image         VARCHAR(500)   NULL,

  order_index   INT            NOT NULL DEFAULT 0,
  is_active     TINYINT(1)     NOT NULL DEFAULT 1,

  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_branches_slug (slug),
  KEY ix_branches_listing (is_active, order_index),
  KEY ix_branches_city    (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- contact_submissions — public contact form
-- ip_hash is a salted SHA-256 of the submitter IP; raw IPs are never stored
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id                CHAR(36)      NOT NULL,

  name              VARCHAR(200)  NOT NULL,
  email             VARCHAR(200)  NOT NULL,
  phone             VARCHAR(50)   NULL,

  subject           VARCHAR(300)  NULL,
  message           TEXT          NOT NULL,

  preferred_branch  VARCHAR(200)  NULL,
  preferred_service VARCHAR(200)  NULL,

  status            VARCHAR(20)   NOT NULL DEFAULT 'new',
  notes             TEXT          NULL,
  ip_hash           CHAR(64)      NULL,

  submitted_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_contact_status    (status),
  KEY ix_contact_submitted (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- settings — global key/value application settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id          CHAR(36)     NOT NULL,
  `key`       VARCHAR(100) NOT NULL,
  value       JSON         NOT NULL,
  description TEXT         NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_settings_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- bookings — appointment requests and checkout orders
-- items is a snapshot of the cart at purchase time, not a live join,
-- so historical bookings do not change when bundle prices do.
-- Present in the live database; absent from the old repo schema file.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id             CHAR(36)       NOT NULL,
  booking_number VARCHAR(30)    NOT NULL,

  name           VARCHAR(200)   NOT NULL,
  email          VARCHAR(200)   NOT NULL,
  phone          VARCHAR(50)    NOT NULL,
  birthday       VARCHAR(50)    NULL,
  branch         VARCHAR(200)   NULL,
  doctor         VARCHAR(200)   NULL,
  treatment      VARCHAR(300)   NULL,
  message        TEXT           NULL,

  source         VARCHAR(50)    NOT NULL DEFAULT 'checkout',
  items          JSON           NULL,
  total_amount   DECIMAL(12,2)  NULL,
  status         VARCHAR(20)    NOT NULL DEFAULT 'pending',
  ip_hash        CHAR(64)       NULL,

  created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_bookings_number (booking_number),
  KEY ix_bookings_status  (status, created_at),
  KEY ix_bookings_source  (source),
  KEY ix_bookings_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- NOUVELAGE — admin tables (replaces Supabase GoTrue auth.users)
-- Applied by setup-db.js after schema.sql.
-- ============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Admin accounts. Passwords are bcrypt hashes (cost 12), created only via
-- backend/scripts/create-admin.js which reads ADMIN_PASSWORD from the
-- environment — never from argv.
CREATE TABLE IF NOT EXISTS admin_users (
  id            CHAR(36)     NOT NULL,
  email         VARCHAR(200) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  name          VARCHAR(200) NOT NULL,
  role          VARCHAR(30)  NOT NULL DEFAULT 'admin',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  last_login_at TIMESTAMP    NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Append-only trail of admin actions (logins, CRUD writes, status changes).
CREATE TABLE IF NOT EXISTS activity_log (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_user_id CHAR(36)        NULL,
  action        VARCHAR(50)     NOT NULL,
  resource      VARCHAR(50)     NOT NULL,
  resource_id   VARCHAR(100)    NULL,
  details       JSON            NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_activity_user    (admin_user_id, created_at),
  KEY ix_activity_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
