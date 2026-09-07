// ============================================================================
// CONTENT DATABASE TYPES
// TypeScript interfaces matching the MySQL schema (backend/db/schema.sql)
// ============================================================================

// ============================================================================
// PAGE CONTENT
// ============================================================================
export interface PageContent {
  id: string;
  page_key: string; // 'landing', 'forher', 'forhim', etc.
  content: any; // JSONB - flexible page content
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PARENT BUNDLES (Categories)
// ============================================================================
export interface ParentBundle {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string; // 'hair', 'face', 'laser', 'body', 'skin'
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// BUNDLES (Treatment Packages)
// ============================================================================
export interface Bundle {
  id: string; // Custom ID like "h1-biotin-starter"
  parent_category_id?: string;
  parent_category?: string;

  // Card Display
  card_number?: string;
  card_title: string;
  card_image?: string;
  card_price?: string;
  card_ribbon?: string;

  // Status & Visibility
  is_active: boolean;
  show_in_grid: boolean;
  show_price: boolean;
  show_in_slider: boolean;

  // Modal Settings
  use_luxury_modal: boolean;
  modal_title?: string;

  // Pricing
  price_old?: string;
  price_new: string;
  price_save?: string;
  price_unit: string;
  show_installment: boolean;
  installment_text?: string;

  // Services List
  services_list: ServiceItem[];
  services_label: string;

  // Treatment Details
  duration?: string;
  visits?: string;
  channel?: string;

  // Content
  why_box_text?: string;

  // Gallery
  gallery: string[];

  // Slider Settings
  slider_tag?: string;
  slider_title?: string;
  slider_bg_image?: string;
  slider_bg_color: string;
  slider_cta_text: string;
  slider_order: number;

  // Ordering
  order_index: number;

  // Catalog
  catalogue_theme: string;
  catalogue_badge?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  service: string; // e.g., "<strong>3 ×</strong> Zoom Biotin sessions"
}

// ============================================================================
// DOCTORS
// ============================================================================
export interface Doctor {
  id: string;
  slug?: string;

  // Personal Info
  name: string;
  title?: string;
  specialization?: string;
  sub_specialties: string[];

  // Professional Details
  qualifications: string[];
  certificates: string[];
  experience: number;
  languages: string[];
  services: string[];
  rating: number;

  // Clinic Info
  branches: string[];
  available_days: string[];
  gender?: 'male' | 'female';

  // Media
  profile_image?: string;
  before_after_gallery: BeforeAfter[];

  // Content
  bio?: string;
  long_bio?: string;
  philosophy?: string;

  // Display Settings
  featured: boolean;
  order_index: number;
  is_active: boolean;

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;

  // Social Media
  instagram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface BeforeAfter {
  before: string;
  after: string;
  caption?: string;
}

// ============================================================================
// BLOG POSTS
// ============================================================================
export interface BlogPost {
  id: string;
  slug: string;

  // Content
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  featured_image?: string;

  // Author
  author?: string;
  author_image?: string;

  // Categorization
  category?: string;
  tags: string[];

  // Publishing
  status: 'draft' | 'published';
  publish_date?: string;

  // Meta
  read_time?: string;
  related_posts: string[];

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MEDIA LIBRARY
// ============================================================================
export interface MediaFile {
  id: string;
  filename: string;
  path?: string;
  full_path?: string;
  data_url?: string;

  // File Info
  size?: number;
  type?: string;
  alt_text?: string;

  // Timestamps
  uploaded_at: string;
}

// ============================================================================
// SERVICES
// ============================================================================
export interface Service {
  id: string;
  slug: string;

  // Basic Info
  name: string;
  subtitle?: string;
  description?: string;

  // Media
  featured_image?: string;
  gallery: string[];

  // Details
  duration?: string;
  price?: string;
  price_unit: string;

  // Content Sections
  benefits: string[];
  procedure_steps: string[];
  faq: FAQItem[];

  // Categorization
  category?: string;
  tags: string[];

  // Display
  featured: boolean;
  order_index: number;
  is_active: boolean;

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ============================================================================
// BRANCHES
// ============================================================================
export interface Branch {
  id: string;
  slug: string;

  // Basic Info
  branch_name: string;
  city: string;
  address: string;

  // Contact
  phone?: string;
  email?: string;
  whatsapp?: string;

  // Hours
  hours_weekday?: string;
  hours_weekend?: string;

  // Location
  latitude?: number;
  longitude?: number;
  show_in_map: boolean;

  // Media
  image?: string;

  // Display
  order_index: number;
  is_active: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CONTACT SUBMISSIONS
// ============================================================================
export interface ContactSubmission {
  id: string;

  // Contact Info
  name: string;
  email: string;
  phone?: string;

  // Message
  subject?: string;
  message: string;

  // Additional
  preferred_branch?: string;
  preferred_service?: string;

  // Status
  status: 'new' | 'contacted' | 'completed' | 'spam';
  notes?: string;

  // Timestamps
  submitted_at: string;
  updated_at: string;
}

// ============================================================================
// SETTINGS
// ============================================================================
export interface Setting {
  id: string;
  key: string;
  value: any; // JSONB
  description?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// BOOKINGS
// ============================================================================
export interface Booking {
  id: string;
  booking_number: string;
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  branch?: string;
  doctor?: string;
  treatment?: string;
  message?: string;
  source: string;
  items?: any; // JSONB - Cart items for checkout bookings
  total_amount?: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}
