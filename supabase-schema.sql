-- ============================================================================
-- NOUVELAGE SUPABASE DATABASE SCHEMA
-- Complete database migration from localStorage to Supabase
-- Created: 2026-07-05
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: page_content
-- Stores all editable page content for landing, forher, forhim, team, blog, contact, bundles, services
-- ============================================================================
CREATE TABLE page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key VARCHAR(50) UNIQUE NOT NULL, -- 'landing', 'forher', 'forhim', 'team-page', 'blog-page', 'contact-page', 'bundles-page', 'services-page'
  content JSONB NOT NULL, -- All page fields stored as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster page lookups
CREATE INDEX idx_page_content_key ON page_content(page_key);

-- ============================================================================
-- TABLE: parent_bundles (Categories)
-- Stores bundle categories like "Hair Restoration", "Face", "Body", etc.
-- ============================================================================
CREATE TABLE parent_bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- Icon identifier (e.g., 'hair', 'face', 'laser', 'body')
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_parent_bundles_slug ON parent_bundles(slug);
CREATE INDEX idx_parent_bundles_active ON parent_bundles(is_active);

-- ============================================================================
-- TABLE: bundles
-- Stores all treatment bundles (109 bundles from load-bundles.js)
-- ============================================================================
CREATE TABLE bundles (
  id VARCHAR(100) PRIMARY KEY, -- Custom ID like "h1-biotin-starter"
  parent_category_id UUID REFERENCES parent_bundles(id) ON DELETE SET NULL,
  parent_category VARCHAR(100), -- Keep for backwards compatibility

  -- Card Display
  card_number VARCHAR(10), -- e.g., "H1", "F2", "B3"
  card_title VARCHAR(200) NOT NULL,
  card_image TEXT,
  card_price VARCHAR(50),
  card_ribbon VARCHAR(50), -- "NEW", "POPULAR", "LIMITED", etc.

  -- Status & Visibility
  is_active BOOLEAN DEFAULT true,
  show_in_grid BOOLEAN DEFAULT true,
  show_price BOOLEAN DEFAULT true,
  show_in_slider BOOLEAN DEFAULT false,

  -- Modal Settings
  use_luxury_modal BOOLEAN DEFAULT true,
  modal_title VARCHAR(200),

  -- Pricing
  price_old VARCHAR(50),
  price_new VARCHAR(50) NOT NULL,
  price_save VARCHAR(50),
  price_unit VARCHAR(10) DEFAULT 'EGP',
  show_installment BOOLEAN DEFAULT false,
  installment_text VARCHAR(100),

  -- Services List (array of service objects)
  services_list JSONB DEFAULT '[]'::jsonb, -- [{"service": "3 × Zoom Biotin sessions"}, ...]
  services_label VARCHAR(50) DEFAULT 'Includes',

  -- Treatment Details
  duration VARCHAR(50), -- "3 months"
  visits VARCHAR(50), -- "3 visits"
  channel VARCHAR(200), -- "Meta Ads · WhatsApp · Walk-in"

  -- Content
  why_box_text TEXT, -- Description for "Why this bundle?" section

  -- Gallery
  gallery JSONB DEFAULT '[]'::jsonb, -- Array of image URLs

  -- Slider Settings
  slider_tag VARCHAR(50),
  slider_title VARCHAR(200),
  slider_bg_image TEXT,
  slider_bg_color VARCHAR(50) DEFAULT 'bg-espresso',
  slider_cta_text VARCHAR(50) DEFAULT 'Learn More →',
  slider_order INTEGER DEFAULT 999,

  -- Ordering
  order_index INTEGER DEFAULT 0,

  -- Catalog
  catalogue_theme VARCHAR(50) DEFAULT 'default',
  catalogue_badge VARCHAR(50),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bundles_parent_category ON bundles(parent_category_id);
CREATE INDEX idx_bundles_active ON bundles(is_active);
CREATE INDEX idx_bundles_grid ON bundles(show_in_grid);
CREATE INDEX idx_bundles_slider ON bundles(show_in_slider);
CREATE INDEX idx_bundles_order ON bundles(order_index);

-- ============================================================================
-- TABLE: doctors
-- Stores doctor/team member profiles
-- ============================================================================
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(200) UNIQUE, -- URL-friendly name (e.g., "randa-el-aguizy")

  -- Personal Info
  name VARCHAR(200) NOT NULL,
  title VARCHAR(50), -- Dr., Prof., etc.
  specialization VARCHAR(200),
  sub_specialties TEXT[], -- Array of sub-specialties

  -- Professional Details
  qualifications TEXT[], -- Array of qualifications
  certificates TEXT[], -- Educational certificates, degrees, credentials
  experience INTEGER DEFAULT 0, -- years
  languages TEXT[], -- Array of languages
  services TEXT[], -- Services/treatments doctor performs
  rating DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 5.00

  -- Clinic Info
  branches TEXT[], -- Which branches they work at
  available_days TEXT[], -- Days available
  gender VARCHAR(10), -- 'male', 'female'

  -- Media
  profile_image TEXT,
  before_after_gallery JSONB DEFAULT '[]'::jsonb, -- Array of before/after image objects

  -- Content
  bio TEXT, -- Short bio
  long_bio TEXT, -- Detailed biography
  philosophy TEXT, -- Medical philosophy/approach

  -- Display Settings
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- SEO
  meta_title VARCHAR(200),
  meta_description TEXT,
  meta_keywords TEXT,

  -- Social Media
  instagram_url VARCHAR(200),
  facebook_url VARCHAR(200),
  linkedin_url VARCHAR(200),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_doctors_slug ON doctors(slug);
CREATE INDEX idx_doctors_active ON doctors(is_active);
CREATE INDEX idx_doctors_featured ON doctors(featured);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);

-- ============================================================================
-- TABLE: blog_posts
-- Stores all blog posts and articles
-- ============================================================================
CREATE TABLE blog_posts (
  id VARCHAR(100) PRIMARY KEY, -- Custom ID like "post_1234567890_abc123"
  slug VARCHAR(200) UNIQUE NOT NULL,

  -- Content
  title VARCHAR(300) NOT NULL,
  subtitle VARCHAR(500),
  excerpt TEXT,
  content TEXT NOT NULL, -- HTML content
  featured_image TEXT,

  -- Author
  author VARCHAR(200),
  author_image TEXT,

  -- Categorization
  category VARCHAR(100),
  tags TEXT[], -- Array of tags

  -- Publishing
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
  publish_date TIMESTAMP WITH TIME ZONE,

  -- Meta
  read_time VARCHAR(20), -- "5 min read"
  related_posts TEXT[], -- Array of post IDs

  -- SEO
  meta_title VARCHAR(200),
  meta_description TEXT,
  meta_keywords TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_publish_date ON blog_posts(publish_date);

-- ============================================================================
-- TABLE: media_library
-- Stores all uploaded media files (images, videos, documents)
-- ============================================================================
CREATE TABLE media_library (
  id VARCHAR(100) PRIMARY KEY, -- Custom ID like "media_1234567890_abc123"
  filename VARCHAR(300) NOT NULL,
  path VARCHAR(500), -- e.g., '/assets/img/blog/', '/assets/img/services/'
  full_path TEXT, -- complete path with filename
  data_url TEXT, -- base64 data or cloud storage URL

  -- File Info
  size BIGINT, -- File size in bytes
  type VARCHAR(100), -- MIME type (image/jpeg, image/png, etc.)
  alt_text VARCHAR(500), -- Accessibility alt text

  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_media_library_path ON media_library(path);
CREATE INDEX idx_media_library_type ON media_library(type);
CREATE INDEX idx_media_library_uploaded ON media_library(uploaded_at);

-- ============================================================================
-- TABLE: services
-- Stores individual services/treatments (separate from bundles)
-- ============================================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(200) UNIQUE NOT NULL,

  -- Basic Info
  name VARCHAR(200) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,

  -- Media
  featured_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,

  -- Details
  duration VARCHAR(50), -- "45 minutes"
  price VARCHAR(50),
  price_unit VARCHAR(10) DEFAULT 'EGP',

  -- Content Sections
  benefits TEXT[], -- Array of benefit points
  procedure_steps TEXT[], -- Array of procedure steps
  faq JSONB DEFAULT '[]'::jsonb, -- FAQ items

  -- Categorization
  category VARCHAR(100),
  tags TEXT[],

  -- Display
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- SEO
  meta_title VARCHAR(200),
  meta_description TEXT,
  meta_keywords TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_services_featured ON services(featured);
CREATE INDEX idx_services_category ON services(category);

-- ============================================================================
-- TABLE: branches
-- Stores clinic branch locations
-- ============================================================================
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(200) UNIQUE NOT NULL,

  -- Basic Info
  branch_name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,

  -- Contact
  phone VARCHAR(50),
  email VARCHAR(200),
  whatsapp VARCHAR(50),

  -- Hours
  hours_weekday VARCHAR(100), -- "10:00 AM - 10:00 PM"
  hours_weekend VARCHAR(100),

  -- Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  show_in_map BOOLEAN DEFAULT true,

  -- Media
  image TEXT,

  -- Display
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_branches_slug ON branches(slug);
CREATE INDEX idx_branches_city ON branches(city);
CREATE INDEX idx_branches_active ON branches(is_active);

-- ============================================================================
-- TABLE: contact_submissions
-- Stores contact form submissions
-- ============================================================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact Info
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),

  -- Message
  subject VARCHAR(300),
  message TEXT NOT NULL,

  -- Additional
  preferred_branch VARCHAR(200),
  preferred_service VARCHAR(200),

  -- Status
  status VARCHAR(20) DEFAULT 'new', -- 'new', 'contacted', 'completed', 'spam'
  notes TEXT, -- Admin notes

  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_submitted ON contact_submissions(submitted_at);

-- ============================================================================
-- TABLE: settings
-- Stores global application settings
-- ============================================================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);

-- ============================================================================
-- FUNCTIONS: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parent_bundles_updated_at BEFORE UPDATE ON parent_bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS and create policies for each table
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access to active content (for frontend)
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (true);
CREATE POLICY "Public read active parent_bundles" ON parent_bundles FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active bundles" ON bundles FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active doctors" ON doctors FOR SELECT USING (is_active = true);
CREATE POLICY "Public read published blog_posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read media_library" ON media_library FOR SELECT USING (true);
CREATE POLICY "Public read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active branches" ON branches FOR SELECT USING (is_active = true);
CREATE POLICY "Public insert contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Admin full access policies (authenticated users)
-- Note: You'll need to configure authentication in Supabase and adjust these policies
CREATE POLICY "Admin full access page_content" ON page_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access parent_bundles" ON parent_bundles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access bundles" ON bundles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access doctors" ON doctors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access media_library" ON media_library FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access branches" ON branches FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact_submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- INITIAL DATA: Page Content
-- Insert default page content from demo-mode.service.ts
-- ============================================================================
INSERT INTO page_content (page_key, content) VALUES
('landing', '{
  "logo_url": "/assets/img/nouvelage-logo-white.svg",
  "logo_alt": "Nouvelage® Aesthetic Clinics",
  "forher_bg_image": "/assets/img/home-for-her.jpg",
  "forher_eyebrow": "LUXURY TREATMENTS",
  "forher_welcome": "For Her",
  "forher_subtitle": "Embrace Your Natural Beauty",
  "forher_cta_text": "Explore Services",
  "forher_cta_link": "/forher",
  "forhim_bg_image": "/assets/img/home-for-him.jpg",
  "forhim_eyebrow": "PREMIUM GROOMING",
  "forhim_welcome": "For Him",
  "forhim_subtitle": "Redefine Your Confidence",
  "forhim_cta_text": "Discover Treatments",
  "forhim_cta_link": "/forhim",
  "locations": "Zamalek, Cairo • New Cairo • 6th of October",
  "animation_duration": 1000,
  "overlay_opacity": 0.6,
  "meta_title": "Nouvelage - Luxury Aesthetic Clinic in Egypt",
  "meta_description": "Egypt''s premier aesthetic clinic offering world-class beauty treatments for both men and women. Experience excellence in skincare, wellness, and transformation.",
  "meta_keywords": "aesthetic clinic egypt, luxury spa cairo, beauty treatments, cosmetic clinic, skincare egypt"
}'::jsonb);

-- ============================================================================
-- INITIAL DATA: Parent Bundles (Categories)
-- ============================================================================
INSERT INTO parent_bundles (id, name, slug, description, icon, order_index, is_active) VALUES
(uuid_generate_v4(), 'Hair Restoration', 'hair-restoration', 'Advanced hair restoration and growth treatments', 'hair', 1, true),
(uuid_generate_v4(), 'Face', 'face', 'Facial treatments and rejuvenation procedures', 'face', 2, true),
(uuid_generate_v4(), 'Lasers', 'lasers', 'Advanced laser treatments for skin and hair', 'laser', 3, true),
(uuid_generate_v4(), 'Body', 'body', 'Body contouring and sculpting treatments', 'body', 4, true),
(uuid_generate_v4(), 'Skin Care', 'skin-care', 'Professional skin care and wellness treatments', 'skin', 5, true);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE page_content IS 'Stores all editable page content as JSONB for flexibility';
COMMENT ON TABLE parent_bundles IS 'Treatment bundle categories (Hair, Face, Laser, Body, etc.)';
COMMENT ON TABLE bundles IS 'Individual treatment bundles/packages (109 total)';
COMMENT ON TABLE doctors IS 'Doctor and team member profiles';
COMMENT ON TABLE blog_posts IS 'Blog posts and articles';
COMMENT ON TABLE media_library IS 'Media file uploads and management';
COMMENT ON TABLE services IS 'Individual services/treatments (separate from bundles)';
COMMENT ON TABLE branches IS 'Clinic branch locations';
COMMENT ON TABLE contact_submissions IS 'Contact form submissions from website';
COMMENT ON TABLE settings IS 'Global application settings';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
