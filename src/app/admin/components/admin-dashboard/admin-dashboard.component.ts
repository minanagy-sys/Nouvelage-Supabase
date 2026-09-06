import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { WysiwygEditorComponent } from '../wysiwyg-editor/wysiwyg-editor.component';
import { AdminAuthService, AdminUser } from '../../services/admin-auth.service';
import { AdminApiService } from '../../services/admin-api.service';
import { DemoModeService } from '../../services/demo-mode.service';
import { DoctorsService, Doctor } from '../../services/doctors.service';
import { MediaService } from '../../services/media.service';
import { ServicesService, Service, ServiceOffer, ServiceSection } from '../../services/services.service';
import { BlogService, BlogPost as BlogServicePost } from '../../services/blog.service';
import { MediaLibraryService, MediaFile } from '../../services/media-library.service';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import { SupabaseService } from '../../../shared/services/supabase.service';
import { BookingsService, Booking } from '../../services/bookings.service';

type TabType = 'overview' | 'landing' | 'forher' | 'forhim' | 'services-page' |
               'hero-slider' | 'services-management' | 'parent-services' | 'bundles-management' | 'parent-bundles' |
               'services' | 'doctors' | 'team-page' | 'blog-page' | 'contact-page' |
               'bookings' | 'media' | 'blog';

// Interfaces
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt?: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

interface ContactBranch {
  branch_name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours_weekday: string;
  hours_weekend: string;
  lat: string;
  lng: string;
  map_embed: string;
  image: string;
  services: string;
}

interface HeroSlide {
  title: string;
  subtitle: string;
  background_image: string;
  cta_text: string;
  cta_link: string;
  modal_service_id?: string;
}

interface ParentService {
  id: string;
  name: string;
  order: number;
}

interface ParentBundle {
  id: string;
  name: string;
  slug?: string;
  order: number;
}

interface Bundle {
  id: string;
  name: string;
  parentCategory: string; // Parent category name (e.g., "Hair Restoration")
  parentBundleId: string; // Link to parent bundle category ID

  // 1. Card Display (Grid Item)
  cardImage: string; // Card background image
  cardRibbon: string; // Ribbon text (e.g., "MOST POPULAR")
  cardNumber: string; // Display number (e.g., "H1", "B3", "L7")
  cardTitle: string; // Card heading
  cardPrice: string; // Price display (e.g., "18,000 EGP")

  // 2. Hero Slider Settings (Services Page Offers Slider)
  showInSlider: boolean; // Show in services page hero slider
  sliderBgImage: string; // Slider background image URL
  sliderBgColor: string; // Slider background color (bg-espresso, bg-caramel)
  sliderTag: string; // Slider tag text (e.g., "LIMITED TIME OFFER")
  sliderTitle: string; // Slider heading
  sliderSubtitle: string; // Slider description
  sliderCtaText: string; // Slider button text (default: "Learn More →")
  sliderOrder: number; // Slider display order

  // 3. Luxury Catalogue Modal
  useLuxuryModal: boolean; // Use luxury catalogue-style modal
  catalogueTheme: string; // Card theme: 'default' | 't2' | 't3' | 't4' | 'dark'
  catalogueBadge: string; // Badge text (e.g., "NEW", "★ Most Chosen", "★ Best Value")
  servicesLabel: string; // Services section label (default: "Includes")
  servicesList: { service: string; }[]; // List of included services
  duration: string; // Duration (e.g., "3 months", "6 months")
  visits: string; // Number of visits (e.g., "3 sessions")
  channel: string; // Marketing channel
  priceOld: string; // Original price for strikethrough
  priceNew: string; // Discounted price
  priceSave: string; // Savings percentage text (e.g., "SAVE 20%")
  priceUnit: string; // Price unit (default: "EGP")
  showInstallment: boolean; // Show installment option
  installmentText: string; // Installment info
  whyBoxText: string; // Why this package description
  modalTitle: string; // Modal title (uses cardTitle if empty)
  gallery: any[]; // Before/after images

  order: number;
  isActive: boolean;
  showInGrid: boolean;
  createdAt?: string;
  updatedAt?: string;
}


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, WysiwygEditorComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  currentUser: AdminUser | null = null;
  activeTab: TabType = 'overview';
  isSidebarCollapsed: boolean = false;
  isLoading: boolean = false;
  saveMessage: string = '';

  // Page content
  pageContent: any = {};

  // Services data
  services: any[] = [];
  selectedService: any = null;

  // Doctors data
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  editingDoctorId: string | null = null;
  doctorServiceFilter: string = ''; // For filtering services when assigning to doctor

  // Bookings data
  bookings: Booking[] = [];
  bookingStats: any = {};
  selectedBooking: Booking | null = null;
  // Bookings date filter
  bookingDateFrom: string = '';
  bookingDateTo: string = '';
  showBookingModal: boolean = false;

  // Team page data
  teamDoctorFilter: string = '';
  filteredTeamDoctors: Doctor[] = [];

  // Contact page data
  selectedBranchIndex: number = 0;

  // Blog data
  blogs: BlogPost[] = [];
  selectedBlog: BlogPost | null = null;
  editingBlogId: string | null = null;
  blogFilterStatus: string = '';
  blogFilterCategory: string = '';
  blogSearchQuery: string = '';

  // ==================== MEDIA LIBRARY ====================
  mediaFiles: any[] = [];
  selectedMediaFile: any = null;
  mediaSearchQuery: string = '';
  mediaFilterPath: string = '';
  showMediaPicker: boolean = false;
  mediaPickerCallback: ((url: string) => void) | null = null;
  mediaPickerContext: 'doctor' | 'blog' | 'service' | 'general' = 'general';
  mediaPickerCaseIndex: number | null = null;
  mediaPickerCaseType: 'before' | 'after' | null = null;

  // ==================== OFFERS SLIDER ====================
  offers: ServiceOffer[] = [];
  selectedOffer: ServiceOffer | null = null;
  editingOfferId: string | null = null;

  // ==================== SERVICES MANAGEMENT ====================
  servicesData: Service[] = [];
  selectedServiceData: Service | null = null;
  editingServiceId: string | null = null;
  serviceCategories: string[] = [];
  serviceFilterCategory: string = '';
  serviceSearchQuery: string = '';

  // Service sections editing
  editingSection: ServiceSection | null = null;
  editingSectionIndex: number = -1;

  // Doctor selection for service
  selectedServiceForDoctorSelection: Service | null = null;
  showDoctorSelectionModal: boolean = false;

  // ==================== PARENT SERVICES ====================
  parentServices: ParentService[] = [];
  selectedParentService: ParentService | null = null;
  editingParentServiceId: string | null = null;

  // ==================== PARENT BUNDLES ====================
  parentBundles: ParentBundle[] = [];
  selectedParentBundle: ParentBundle | null = null;
  editingParentBundleId: string | null = null;

  // ==================== BUNDLES ====================
  bundles: Bundle[] = [];
  selectedBundle: Bundle | null = null;
  editingBundleId: string | null = null;
  bundleFilterParent: string = '';
  bundleSearchQuery: string = '';

  // Services Management submenu
  servicesManagementExpanded: boolean = false;

  // Bundles submenu
  bundlesExpanded: boolean = false;

  // Blog submenu
  blogExpanded: boolean = false;

  // Doctor modal inside service modal
  showDoctorModalInService: boolean = false;
  selectedDoctorInServiceModal: Doctor | null = null;

  constructor(
    public adminAuthService: AdminAuthService,
    private apiService: AdminApiService,
    private demoModeService: DemoModeService,
    public doctorsService: DoctorsService,
    private mediaService: MediaService,
    private servicesService: ServicesService,
    private blogService: BlogService,
    private mediaLibraryService: MediaLibraryService,
    private adminSupabaseService: AdminSupabaseService,
    private supabaseService: SupabaseService,
    private bookingsService: BookingsService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.adminAuthService.getCurrentUser();

    // Clear and reinitialize parent services and bundles with fresh data
    localStorage.removeItem('parentServices');
    localStorage.removeItem('parentBundles');

    this.initializeDefaultParentServices();
    this.initializeDefaultParentBundles();
    this.loadOverviewData();
    this.loadMediaLibrary(); // Load media library on init
  }

  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
    this.saveMessage = '';

    switch(tab) {
      case 'overview':
        this.loadOverviewData();
        break;
      case 'landing':
        this.loadPageContent(tab);
        break;
      case 'forher':
      case 'forhim':
      case 'team-page':
        this.loadDoctors(); // Load doctors for doctor selection panels
        this.loadPageContent(tab);
        break;
      case 'services-page':
      case 'blog-page':
      case 'contact-page':
        this.loadPageContent(tab);
        break;
      case 'services':
        this.loadServices();
        break;
      case 'doctors':
        this.loadDoctors();
        this.loadServicesData(); // Load services for doctor service selection
        break;
      case 'blog':
        this.loadBlogs();
        break;
      case 'bookings':
        this.loadBookings();
        break;
      case 'media':
        this.loadMediaLibrary();
        break;
      case 'services-management':
        this.loadServicesData();
        this.loadServiceCategories();
        this.loadParentServices();
        break;
      case 'parent-services':
        this.loadParentServices();
        break;
      case 'bundles-management':
        this.loadBundles();
        this.loadParentBundles();
        break;
      case 'parent-bundles':
        this.loadParentBundles();
        break;
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleServicesManagementMenu(): void {
    this.servicesManagementExpanded = !this.servicesManagementExpanded;
    if (this.servicesManagementExpanded) {
      this.setActiveTab('services-management');
    }
  }

  toggleBundlesMenu(): void {
    this.bundlesExpanded = !this.bundlesExpanded;
    if (this.bundlesExpanded) {
      this.setActiveTab('bundles-management');
    }
  }

  toggleBlogMenu(): void {
    this.blogExpanded = !this.blogExpanded;
    if (this.blogExpanded) {
      this.setActiveTab('blog-page');
    }
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.adminAuthService.logout();
    }
  }

  cleanBase64Images(): void {
    if (confirm('🧹 This will remove all base64 images from doctor data. Continue?')) {
      this.doctorsService.cleanAllBase64Images();
      this.saveMessage = '✓ Base64 images cleaned!';
      setTimeout(() => {
        this.saveMessage = '';
        window.location.reload();
      }, 1500);
    }
  }

  clearDoctorsCache(): void {
    if (confirm('⚠️ This will clear all cached doctor data and reload from initial data. Continue?')) {
      localStorage.removeItem('doctors_data');
      this.saveMessage = '✓ Cache cleared! Reloading...';
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  loadOverviewData(): void {
    this.isLoading = true;
    this.bookingsService.getBookingStats().subscribe({
      next: (stats) => {
        this.bookingStats = stats;
        console.log('✅ Loaded booking statistics from Supabase');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading booking statistics:', error);
        this.isLoading = false;
      }
    });
  }

  loadPageContent(page: string): void {
    this.isLoading = true;

    // Load from Supabase first, fallback to DemoModeService
    this.supabaseService.getPageContent(page).subscribe({
      next: (content) => {
        if (content) {
          console.log(`✅ Loaded page content from Supabase for: ${page}`);
          this.pageContent = content;
        } else {
          console.log(`⚠️ No content in Supabase, using localStorage for: ${page}`);
          this.pageContent = this.demoModeService.getDemoPageContent(page);
        }
        this.initializePageDefaults(page);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`❌ Error loading from Supabase, using localStorage for: ${page}`, err);
        this.pageContent = this.demoModeService.getDemoPageContent(page);
        this.initializePageDefaults(page);
        this.isLoading = false;
      }
    });
  }

  private initializePageDefaults(page: string): void {

    // Ensure arrays are initialized for forher page
    if (page === 'forher') {
      if (!this.pageContent.doctors_featured) {
        this.pageContent.doctors_featured = [];
      }
      // Clean up any invalid demo doctor IDs (doc_001, doc_002, etc.)
      if (this.pageContent.doctors_featured && this.doctors.length > 0) {
        const validDoctorIds = this.doctors.map(d => d.id);
        const originalCount = this.pageContent.doctors_featured.length;
        this.pageContent.doctors_featured = this.pageContent.doctors_featured.filter((id: string) =>
          validDoctorIds.includes(id)
        );
        if (originalCount !== this.pageContent.doctors_featured.length) {
          console.log(`🧹 Cleaned ${originalCount - this.pageContent.doctors_featured.length} invalid doctor IDs from For Her featured list`);
        }
      }
      if (!this.pageContent.approach_grid) {
        this.pageContent.approach_grid = [];
      }
      if (!this.pageContent.expertise_grid) {
        this.pageContent.expertise_grid = [];
      }
      // Migrate old string format to new object format
      if (typeof this.pageContent.expertise_more === 'string') {
        // Old format was just a string with the button text
        const oldText = this.pageContent.expertise_more;
        this.pageContent.expertise_more = {
          link_text: oldText || 'See All Services',
          link: '/services'
        };
        console.log('🔄 For Her - Migrated expertise_more from string to object format');
      } else if (!this.pageContent.expertise_more) {
        this.pageContent.expertise_more = {
          link_text: 'See All Services',
          link: '/services'
        };
      }
      if (!this.pageContent.branches) {
        this.pageContent.branches = [];
      }
      if (!this.pageContent.instagram_gallery) {
        this.pageContent.instagram_gallery = [];
      }
      if (!this.pageContent.faq_items) {
        this.pageContent.faq_items = [];
      }
      if (!this.pageContent.map_branches) {
        this.pageContent.map_branches = [];
      }
    }
    // Ensure arrays are initialized for forhim page
    if (page === 'forhim') {
      if (!this.pageContent.forhim_doctors_featured) {
        this.pageContent.forhim_doctors_featured = [];
      }
      // ONLY clean up demo IDs (doc_001, doc_002, etc.) - don't filter out real UUIDs
      if (this.pageContent.forhim_doctors_featured && this.pageContent.forhim_doctors_featured.length > 0) {
        const originalCount = this.pageContent.forhim_doctors_featured.length;
        // Only remove IDs that match the demo pattern (doc_NNN)
        this.pageContent.forhim_doctors_featured = this.pageContent.forhim_doctors_featured.filter((id: string) =>
          !id.match(/^doc_\d+$/)
        );
        if (originalCount !== this.pageContent.forhim_doctors_featured.length) {
          console.log(`🧹 Cleaned ${originalCount - this.pageContent.forhim_doctors_featured.length} invalid doctor IDs from For Him featured list`);
        }
      }
      if (!this.pageContent.hero_actions) {
        this.pageContent.hero_actions = [];
      }
      if (!this.pageContent.hero_stats) {
        this.pageContent.hero_stats = [];
      }
      if (!this.pageContent.approach_grid) {
        this.pageContent.approach_grid = [];
      }
      if (!this.pageContent.expertise_grid) {
        this.pageContent.expertise_grid = [];
      }
      // Migrate old string format to new object format
      if (typeof this.pageContent.expertise_more === 'string') {
        // Old format was just a string with the button text
        const oldText = this.pageContent.expertise_more;
        this.pageContent.expertise_more = {
          link_text: oldText || 'See All Services',
          link: '/services'
        };
        console.log('🔄 For Him - Migrated expertise_more from string to object format');
      } else if (!this.pageContent.expertise_more) {
        this.pageContent.expertise_more = {
          link_text: 'See All Services',
          link: '/services'
        };
      }
      if (!this.pageContent.why_pillars) {
        this.pageContent.why_pillars = [];
      }
      if (!this.pageContent.branches) {
        this.pageContent.branches = [];
      }
      if (!this.pageContent.instagram_gallery) {
        this.pageContent.instagram_gallery = [];
      }
      if (!this.pageContent.faq_items) {
        this.pageContent.faq_items = [];
      }
      if (!this.pageContent.map_branches) {
        this.pageContent.map_branches = [];
      }
    }
    // Ensure arrays are initialized for team page
    if (page === 'team-page') {
      if (!this.pageContent.team_doctors_featured) {
        this.pageContent.team_doctors_featured = [];
      }
      // Clean up any invalid demo doctor IDs (doc_001, doc_002, etc.)
      if (this.pageContent.team_doctors_featured && this.doctors.length > 0) {
        const validDoctorIds = this.doctors.map(d => d.id);
        const originalCount = this.pageContent.team_doctors_featured.length;
        this.pageContent.team_doctors_featured = this.pageContent.team_doctors_featured.filter((id: string) =>
          validDoctorIds.includes(id)
        );
        if (originalCount !== this.pageContent.team_doctors_featured.length) {
          console.log(`🧹 Cleaned ${originalCount - this.pageContent.team_doctors_featured.length} invalid doctor IDs from Team featured list`);
        }
      }
    }
    // Ensure arrays are initialized for contact page
    if (page === 'contact-page') {
      if (!this.pageContent.branches || this.pageContent.branches.length === 0) {
        this.pageContent.branches = [
          { branch_name: 'Citystars — Phase 2', city: 'Cairo', address: '3rd Floor, Unit 3280', phone: '+20 2 24800800', email: 'citystars@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0726', lng: '31.3478', showInMap: true },
          { branch_name: 'Cairo Festival City', city: 'Cairo', address: 'CFC · 2nd Floor, Unit 1-08', phone: '+20 2 27586800', email: 'cfc@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0290', lng: '31.4080', showInMap: true },
          { branch_name: 'Madinaty', city: 'Cairo', address: 'The Strip · Building 10, PL02', phone: '+20 2 25909900', email: 'madinaty@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0997', lng: '31.6469', showInMap: true },
          { branch_name: 'Mohandessin', city: 'Giza', address: '2 Dr. Mahrouky St. · 3rd Floor', phone: '+20 2 33360360', email: 'mohandessin@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0590', lng: '31.2020', showInMap: true },
          { branch_name: 'Sheikh Zayed', city: 'Giza', address: 'Twin Towers Mall, Bldg D · 5th Fl, Clinic H', phone: '+20 2 38548548', email: 'sheikhzayed@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0420', lng: '30.9770', showInMap: true },
          { branch_name: 'Mall of Arabia', city: 'Giza', address: 'Gate 17, Unit H052', phone: '+20 2 38504040', email: 'mallofarabia@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '29.9890', lng: '30.9760', showInMap: true },
          { branch_name: 'Camp Shizar', city: 'Alexandria', address: '18 El Geish Road · opp. Casino El Shatby', phone: '+20 3 5912020', email: 'campshizar@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '31.2150', lng: '29.9270', showInMap: true },
          { branch_name: 'Roushdy', city: 'Alexandria', address: '17 Syria Street', phone: '+20 3 5450450', email: 'roushdy@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '31.2340', lng: '29.9560', showInMap: true },
          { branch_name: 'Loran', city: 'Alexandria', address: 'El Murjan Tower · El Horreya Road', phone: '+20 3 5970970', email: 'loran@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '31.2640', lng: '29.9930', showInMap: true }
        ];
      }
      if (!this.pageContent.social_links || this.pageContent.social_links.length === 0) {
        this.pageContent.social_links = [];
      }
      // Initialize hero section with default content
      if (!this.pageContent.hero_eyebrow) {
        this.pageContent.hero_eyebrow = 'Get in Touch';
      }
      if (!this.pageContent.hero_title) {
        this.pageContent.hero_title = 'Visit Us or';
      }
      if (!this.pageContent.hero_title_em) {
        this.pageContent.hero_title_em = 'Reach Out';
      }
      if (!this.pageContent.hero_subtitle) {
        this.pageContent.hero_subtitle = "Book a consultation, ask a question, or visit one of our 11 branches across Cairo, Giza & Alexandria. We are here to help you begin your aesthetic journey.";
      }
      if (!this.pageContent.hero_image) {
        this.pageContent.hero_image = '/assets/img/scene-06-hair.jpg';
      }
      // Initialize branches section with default content
      if (!this.pageContent.branches_eyebrow) {
        this.pageContent.branches_eyebrow = 'Find Us';
      }
      if (!this.pageContent.branches_title) {
        this.pageContent.branches_title = 'Our Branches across';
      }
      if (!this.pageContent.branches_title_em) {
        this.pageContent.branches_title_em = 'Cairo, Giza & Alexandria';
      }
      if (!this.pageContent.branches_lead) {
        this.pageContent.branches_lead = '6 clinics, one standard of care. Choose a branch to see its location, hours and direct line.';
      }
      // Initialize contact/reach section with default content
      if (!this.pageContent.contact_eyebrow) {
        this.pageContent.contact_eyebrow = 'Contact Details';
      }
      if (!this.pageContent.contact_title) {
        this.pageContent.contact_title = 'Ready to Begin Your';
      }
      if (!this.pageContent.contact_title_em) {
        this.pageContent.contact_title_em = 'Transformation?';
      }
      if (!this.pageContent.contact_description) {
        this.pageContent.contact_description = 'Reach out via phone, WhatsApp, email, or visit any of our branches. Our team is ready to answer your questions and schedule your consultation.';
      }
      // Initialize contact cards with default values
      if (!this.pageContent.contact_hotline) {
        this.pageContent.contact_hotline = '16823';
      }
      if (!this.pageContent.contact_hotline_label) {
        this.pageContent.contact_hotline_label = 'Phone';
      }
      if (!this.pageContent.contact_email) {
        this.pageContent.contact_email = 'info@nouvelageclinic.com';
      }
      if (!this.pageContent.contact_email_label) {
        this.pageContent.contact_email_label = 'Email';
      }
      if (!this.pageContent.contact_whatsapp) {
        this.pageContent.contact_whatsapp = '+20 100 031 2528';
      }
      if (!this.pageContent.contact_whatsapp_label) {
        this.pageContent.contact_whatsapp_label = 'WhatsApp';
      }
      this.selectedBranchIndex = 0;
    }
    // Ensure arrays are initialized for blog page
    if (page === 'blog-page') {
      if (!this.pageContent.blog_categories) {
        this.pageContent.blog_categories = [];
      }
    }
    // Ensure arrays are initialized for services page
    if (page === 'services-page') {
      if (!this.pageContent.hero_slides) {
        this.pageContent.hero_slides = [];
      }
      if (!this.pageContent.featured_services) {
        this.pageContent.featured_services = [];
      }
    }
  }

  savePageContent(): void {
    console.log(`💾 SAVE CLICKED for activeTab: '${this.activeTab}'`);
    console.log(`💾 pageContent has ${Object.keys(this.pageContent).length} fields`);
    console.log(`💾 pageContent:`, this.pageContent);

    this.isLoading = true;
    this.saveMessage = '';

    // Save to Supabase
    this.supabaseService.updatePageContent(this.activeTab, this.pageContent).subscribe({
      next: (success) => {
        if (success) {
          console.log(`✅ Saved to Supabase successfully for page: ${this.activeTab}`);
          this.saveMessage = 'Saved successfully to Supabase!';
          // Also save to localStorage as backup
          this.demoModeService.updateDemoPageContent(this.activeTab, this.pageContent);
        } else {
          console.error(`❌ Failed to save to Supabase for page: ${this.activeTab}`);
          this.saveMessage = 'Error saving to Supabase';
        }
        this.isLoading = false;
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: (err) => {
        console.error(`❌ Error saving to Supabase:`, err);
        this.saveMessage = 'Error: ' + err.message;
        this.isLoading = false;
        setTimeout(() => this.saveMessage = '', 3000);
      }
    });
  }

  savePage(): void {
    // Alias for savePageContent - called from template
    this.savePageContent();
  }

  loadServices(): void {
    this.isLoading = true;
    this.apiService.getServices().subscribe({
      next: (response) => {
        this.services = response.services || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading = false;
      }
    });
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.adminSupabaseService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        console.log('✅ Admin - Loaded', doctors.length, 'doctors from Supabase');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading doctors from Supabase:', err);
        this.doctors = [];
        this.isLoading = false;
      }
    });
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingsService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings || [];
        console.log('✅ Loaded', this.bookings.length, 'bookings from Supabase');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading bookings:', error);
        this.isLoading = false;
      }
    });
  }

  // Bookings filtered by the selected date range (by created_at)
  get filteredBookings(): Booking[] {
    return this.bookings.filter(b => {
      if (!b.created_at) return true;
      const d = new Date(b.created_at);
      if (this.bookingDateFrom && d < new Date(this.bookingDateFrom + 'T00:00:00')) return false;
      if (this.bookingDateTo && d > new Date(this.bookingDateTo + 'T23:59:59')) return false;
      return true;
    });
  }

  clearBookingDateFilter(): void {
    this.bookingDateFrom = '';
    this.bookingDateTo = '';
  }

  deleteBooking(booking: Booking, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Delete booking ${booking.booking_number || ''} from "${booking.name}"? This cannot be undone.`)) {
      return;
    }
    this.bookingsService.deleteBooking(booking.id).subscribe({
      next: (ok) => {
        if (ok) {
          this.bookings = this.bookings.filter(b => b.id !== booking.id);
          this.bookingsService.getBookingStats().subscribe(stats => this.bookingStats = stats);
        } else {
          alert('Failed to delete booking. Please try again.');
        }
      },
      error: (err) => {
        console.error('❌ Error deleting booking:', err);
        alert('Failed to delete booking. Please try again.');
      }
    });
  }

  loadMedia(): void {
    this.isLoading = true;
    this.supabaseService.getAllMedia().subscribe({
      next: (media) => {
        this.mediaFiles = media;
        console.log('✅ Loaded', media.length, 'media files from Supabase');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading media from Supabase:', error);
        this.mediaFiles = [];
        this.isLoading = false;
      }
    });
  }

  createNewService(): void {
    this.selectedService = {
      cat: 'forher',
      title: '',
      subtitle: '',
      tagline: '',
      description: '',
      price: 0,
      price_from: '',
      duration: '',
      downtime: '',
      sessions: '',
      lasts: '',
      status: 'active'
    };
  }

  createNewDoctor(): void {
    this.editingDoctorId = null;
    this.selectedDoctor = {
      id: this.doctorsService.generateId(),
      name: '',
      title: 'Dr.',
      specialization: 'Derma Specialist',
      subSpecialties: [],
      qualifications: [],
      certificates: [],
      experience: 3,
      languages: ['English', 'Arabic'],
      services: [],
      rating: 4.5,
      branches: [],
      availableDays: [],
      gender: 'female',
      profileImage: '/assets/img/doctors/placeholder.jpg',
      beforeAfterGallery: [],
      bio: '',
      about: '',
      expertise: [],
      treatments: [],
      bookingLink: '/book',
      featured: false,
      order: this.doctors.length + 1,
      active: true
    };
  }

  editDoctor(doctor: Doctor): void {
    this.editingDoctorId = doctor.id;
    this.selectedDoctor = { ...doctor };
  }

  saveDoctor(): void {
    console.log('💾 saveDoctor called', this.selectedDoctor);
    if (!this.selectedDoctor) {
      console.log('❌ No selected doctor');
      return;
    }

    // Auto-generate slug if missing
    if (!this.selectedDoctor.slug && this.selectedDoctor.name) {
      this.selectedDoctor.slug = this.mediaService.generateDoctorSlug(this.selectedDoctor.name);
      console.log('🔗 Auto-generated slug:', this.selectedDoctor.slug);
    }

    this.isLoading = true;
    const selectedServiceIds = this.selectedDoctor.services || [];

    // STEP 1: Save doctor to Supabase
    if (this.editingDoctorId) {
      // UPDATE existing doctor
      console.log('📝 Updating doctor in Supabase:', this.editingDoctorId);
      this.adminSupabaseService.updateDoctor(this.editingDoctorId, this.selectedDoctor).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Doctor updated in Supabase');
            this.saveMessage = 'Doctor updated successfully in Supabase!';
            this.finalizeDocSave();
          } else {
            console.error('❌ Failed to update doctor in Supabase');
            this.saveMessage = 'Error updating doctor in Supabase';
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('❌ Error updating doctor:', err);
          this.saveMessage = 'Error: ' + err.message;
          this.isLoading = false;
        }
      });
    } else {
      // CREATE new doctor
      console.log('➕ Creating new doctor in Supabase');

      // Ensure is_active is set to true for new doctors
      const newDoctor = {
        ...this.selectedDoctor,
        is_active: true,
        order_index: this.doctors.length + 1
      };

      this.adminSupabaseService.createDoctor(newDoctor).subscribe({
        next: (createdDoc) => {
          if (createdDoc) {
            console.log('✅ Doctor created in Supabase:', createdDoc);
            this.saveMessage = 'Doctor created successfully in Supabase!';
            this.editingDoctorId = createdDoc.id; // Set ID for service sync
            this.finalizeDocSave();
          } else {
            console.error('❌ Failed to create doctor in Supabase');
            this.saveMessage = 'Error creating doctor in Supabase';
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('❌ Error creating doctor:', err);
          this.saveMessage = 'Error: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  finalizeDocSave(): void {
    // Reload doctors from Supabase
    this.loadDoctors();
    this.selectedDoctor = null;
    this.editingDoctorId = null;
    this.isLoading = false;

    setTimeout(() => {
      this.saveMessage = '';
    }, 3000);
  }

  /**
   * Save doctor to Supabase without closing the editor
   * Used for auto-save after image upload
   */
  saveDoctorSilently(): void {
    if (!this.selectedDoctor || !this.editingDoctorId) {
      return;
    }

    // Auto-generate slug if missing
    if (!this.selectedDoctor.slug && this.selectedDoctor.name) {
      this.selectedDoctor.slug = this.mediaService.generateDoctorSlug(this.selectedDoctor.name);
      console.log('🔗 Auto-generated slug (silent save):', this.selectedDoctor.slug);
    }

    console.log('💾 Silently updating doctor in Supabase:', this.editingDoctorId);
    this.adminSupabaseService.updateDoctor(this.editingDoctorId, this.selectedDoctor).subscribe({
      next: (success) => {
        if (success) {
          console.log('✅ Doctor updated in Supabase (silent save)');
          // Reload doctors list but keep editor open
          this.loadDoctors();
        } else {
          console.error('❌ Failed to update doctor in Supabase (silent save)');
        }
      },
      error: (err) => {
        console.error('❌ Error updating doctor (silent save):', err);
      }
    });
  }

  cancelDoctorEdit(): void {
    this.selectedDoctor = null;
    this.editingDoctorId = null;
    this.doctorServiceFilter = '';
  }

  // ============ DOCTOR SERVICE SELECTION METHODS ============

  getFilteredServicesForDoctor(): Service[] {
    // Filter services (show all if isActive field doesn't exist)
    let filtered = this.servicesData.filter(s => s.isActive !== false);

    if (this.doctorServiceFilter) {
      filtered = filtered.filter(s => s.parentService === this.doctorServiceFilter);
    }

    return filtered;
  }

  isDoctorServiceSelected(serviceId: string): boolean {
    if (!this.selectedDoctor || !this.selectedDoctor.services) return false;
    return this.selectedDoctor.services.includes(serviceId);
  }

  toggleDoctorService(serviceId: string): void {
    if (!this.selectedDoctor) return;

    if (!this.selectedDoctor.services) {
      this.selectedDoctor.services = [];
    }

    const index = this.selectedDoctor.services.indexOf(serviceId);
    if (index > -1) {
      this.selectedDoctor.services.splice(index, 1);
    } else {
      this.selectedDoctor.services.push(serviceId);
    }
  }

  getSelectedDoctorServices(): string[] {
    if (!this.selectedDoctor || !this.selectedDoctor.services) return [];
    return this.selectedDoctor.services;
  }

  getServiceNameById(serviceId: string): string {
    const service = this.servicesData.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  }

  // ============ END DOCTOR SERVICE SELECTION ============

  addDoctorItem(field: 'subSpecialties' | 'qualifications' | 'certificates' | 'languages' | 'services' | 'branches' | 'availableDays' | 'expertise', value: string = ''): void {
    if (!this.selectedDoctor) return;
    if (!this.selectedDoctor[field]) {
      this.selectedDoctor[field] = [];
    }
    this.selectedDoctor[field].push(value || 'New Item');
  }

  removeDoctorItem(field: 'subSpecialties' | 'qualifications' | 'certificates' | 'languages' | 'services' | 'branches' | 'availableDays' | 'expertise', index: number): void {
    if (!this.selectedDoctor || !this.selectedDoctor[field]) return;
    this.selectedDoctor[field].splice(index, 1);
  }

  addBeforeAfter(): void {
    if (!this.selectedDoctor) return;
    if (!this.selectedDoctor.beforeAfterGallery) {
      this.selectedDoctor.beforeAfterGallery = [];
    }
    this.selectedDoctor.beforeAfterGallery.push({
      before: '/assets/img/before-after/before-placeholder.jpg',
      after: '/assets/img/before-after/after-placeholder.jpg',
      description: '',
      procedure: ''
    });
  }

  removeBeforeAfter(index: number): void {
    if (!this.selectedDoctor || !this.selectedDoctor.beforeAfterGallery) return;
    this.selectedDoctor.beforeAfterGallery.splice(index, 1);
  }

  // Treatment methods
  addTreatment(): void {
    if (!this.selectedDoctor) return;
    if (!this.selectedDoctor.treatments) {
      this.selectedDoctor.treatments = [];
    }
    this.selectedDoctor.treatments.push({
      name: '',
      description: ''
    });
  }

  removeTreatment(index: number): void {
    if (!this.selectedDoctor || !this.selectedDoctor.treatments) return;
    this.selectedDoctor.treatments.splice(index, 1);
  }

  // Image upload handlers
  onProfileImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file && this.selectedDoctor) {
      // Get doctor slug
      const doctorSlug = this.selectedDoctor.slug || this.mediaService.generateDoctorSlug(this.selectedDoctor.name);

      // Save and get file path (NO base64 conversion!)
      this.mediaService.saveDoctorProfile(file, doctorSlug).then(filePath => {
        if (this.selectedDoctor) {
          this.selectedDoctor.profileImage = filePath;
        }
      });
    }
  }

  onBeforeImageUpload(event: any, index: number): void {
    const file = event.target.files[0];
    if (file && this.selectedDoctor && this.selectedDoctor.beforeAfterGallery) {
      // Check if category is selected
      if (!this.selectedDoctor.beforeAfterGallery[index].category) {
        alert('⚠️ Please select a category first before uploading the image!');
        event.target.value = ''; // Reset file input
        return;
      }

      // Get doctor slug, case number, and category from dropdown
      const doctorSlug = this.selectedDoctor.slug || this.mediaService.generateDoctorSlug(this.selectedDoctor.name);
      const caseNumber = index + 1;
      const category = this.selectedDoctor.beforeAfterGallery[index].category;

      console.log(`📤 Uploading BEFORE image: case-${caseNumber}-${category}`);

      // Save and get file path (NO base64 conversion!)
      this.mediaService.saveCaseImage(file, doctorSlug, caseNumber, 'before', category).then(filePath => {
        if (this.selectedDoctor && this.selectedDoctor.beforeAfterGallery) {
          this.selectedDoctor.beforeAfterGallery[index].before = filePath;
          console.log(`✅ BEFORE image saved: ${filePath}`);
        }
      }).catch(error => {
        console.error('❌ BEFORE image upload failed:', error);
        alert('Upload failed! Make sure the upload server is running on port 3001');
      });
    }
  }

  onAfterImageUpload(event: any, index: number): void {
    const file = event.target.files[0];
    if (file && this.selectedDoctor && this.selectedDoctor.beforeAfterGallery) {
      // Check if category is selected
      if (!this.selectedDoctor.beforeAfterGallery[index].category) {
        alert('⚠️ Please select a category first before uploading the image!');
        event.target.value = ''; // Reset file input
        return;
      }

      // Get doctor slug, case number, and category from dropdown
      const doctorSlug = this.selectedDoctor.slug || this.mediaService.generateDoctorSlug(this.selectedDoctor.name);
      const caseNumber = index + 1;
      const category = this.selectedDoctor.beforeAfterGallery[index].category;

      console.log(`📤 Uploading AFTER image: case-${caseNumber}-${category}`);

      // Save and get file path (NO base64 conversion!)
      this.mediaService.saveCaseImage(file, doctorSlug, caseNumber, 'after', category).then(filePath => {
        if (this.selectedDoctor && this.selectedDoctor.beforeAfterGallery) {
          this.selectedDoctor.beforeAfterGallery[index].after = filePath;
          console.log(`✅ AFTER image saved: ${filePath}`);
        }
      }).catch(error => {
        console.error('❌ AFTER image upload failed:', error);
        alert('Upload failed! Make sure the upload server is running on port 3001');
      });
    }
  }

  deleteService(id: string): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.apiService.deleteService(id).subscribe({
        next: () => {
          this.loadServices();
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          alert('Error deleting service');
        }
      });
    }
  }

  deleteDoctor(id: string): void {
    if (confirm('Are you sure you want to delete this doctor? This will remove it from Supabase.')) {
      this.isLoading = true;
      this.adminSupabaseService.deleteDoctor(id).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Doctor deleted from Supabase');
            this.saveMessage = 'Doctor deleted successfully from Supabase!';
            this.loadDoctors();
          } else {
            console.error('❌ Failed to delete doctor');
            this.saveMessage = 'Error deleting doctor';
          }
          this.isLoading = false;
          setTimeout(() => {
            this.saveMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('❌ Error deleting doctor:', err);
          this.saveMessage = 'Error: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  // Hero Actions methods
  addHeroAction(): void {
    if (!this.pageContent.hero_actions) {
      this.pageContent.hero_actions = [];
    }
    this.pageContent.hero_actions.push({
      text: 'New Button',
      link: '#',
      style: 'gold'
    });
  }

  // Hero Stats methods
  addHeroStat(): void {
    if (!this.pageContent.hero_stats) {
      this.pageContent.hero_stats = [];
    }
    this.pageContent.hero_stats.push({
      value: '0',
      suffix: '',
      label: 'New Stat'
    });
  }

  // Approach Cards methods
  addApproachCard(): void {
    if (!this.pageContent.approach_grid) {
      this.pageContent.approach_grid = [];
    }
    this.pageContent.approach_grid.push({
      icon: 'new-icon',
      title: 'New Card',
      description: 'Card description',
      image: '/assets/img/approach/new-card.jpg'
    });
  }

  // Expertise Cards methods
  addExpertiseCard(): void {
    if (!this.pageContent.expertise_grid) {
      this.pageContent.expertise_grid = [];
    }
    this.pageContent.expertise_grid.push({
      title: 'New Treatment',
      description: 'Feature 1 · Feature 2 · Feature 3',
      image: '/assets/img/exp-new-treatment.jpg',
      link: '/services',
      buttonLabel: 'Explore Treatment'
    });
  }

  // Why Pillars methods
  addWhyPillar(): void {
    if (!this.pageContent.why_pillars) {
      this.pageContent.why_pillars = [];
    }
    this.pageContent.why_pillars.push({
      value: '0',
      title: 'New Stat',
      description: 'Description of the statistic'
    });
  }

  // Branches methods
  addBranch(): void {
    if (!this.pageContent.branches) {
      this.pageContent.branches = [];
    }
    this.pageContent.branches.push({
      city: 'New City',
      location: 'New Location',
      address: 'Address details',
      image: '/assets/img/branch-new.jpg'
    });
  }

  // Generic array item removal
  removeArrayItem(array: any[], index: number): void {
    if (confirm('Are you sure you want to remove this item?')) {
      array.splice(index, 1);
    }
  }

  // Reset localStorage cache to show fresh data from service
  resetCache(): void {
    if (confirm('This will clear cached data and reload fresh data from the service. Continue?')) {
      this.demoModeService.clearAllCache();
      this.saveMessage = 'Cache cleared! Reloading...';
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  // ForHer page doctors grid management
  isDoctorFeatured(doctorId: string): boolean {
    if (!this.pageContent?.doctors_featured) {
      return false;
    }
    return this.pageContent.doctors_featured.includes(doctorId);
  }

  toggleDoctorFeatured(doctorId: string): void {
    console.log('🔄 toggleDoctorFeatured called with doctorId:', doctorId);
    if (!this.pageContent.doctors_featured) {
      this.pageContent.doctors_featured = [];
    }

    const index = this.pageContent.doctors_featured.indexOf(doctorId);
    if (index > -1) {
      // Remove doctor from featured list
      this.pageContent.doctors_featured.splice(index, 1);
      console.log('➖ Removed doctor from featured list. New array:', this.pageContent.doctors_featured);
    } else {
      // Add doctor to featured list
      this.pageContent.doctors_featured.push(doctorId);
      console.log('➕ Added doctor to featured list. New array:', this.pageContent.doctors_featured);
    }
  }

  selectAllDoctors(): void {
    if (!this.pageContent.doctors_featured) {
      this.pageContent.doctors_featured = [];
    }
    // Get all active doctor IDs from Supabase
    const allDoctorIds = this.getForHerDoctors().map(d => d.id);
    this.pageContent.doctors_featured = [...allDoctorIds];
  }

  deselectAllDoctors(): void {
    this.pageContent.doctors_featured = [];
  }

  getFeaturedDoctorsCount(): number {
    return this.pageContent?.doctors_featured?.length || 0;
  }

  // For Him specific methods
  isForHimDoctorFeatured(doctorId: string): boolean {
    if (!this.pageContent?.forhim_doctors_featured) {
      return false;
    }
    return this.pageContent.forhim_doctors_featured.includes(doctorId);
  }

  toggleForHimDoctorFeatured(doctorId: string): void {
    console.log('🔄 toggleForHimDoctorFeatured called with doctorId:', doctorId);
    if (!this.pageContent.forhim_doctors_featured) {
      this.pageContent.forhim_doctors_featured = [];
    }

    const index = this.pageContent.forhim_doctors_featured.indexOf(doctorId);
    if (index > -1) {
      this.pageContent.forhim_doctors_featured.splice(index, 1);
      console.log('➖ Removed doctor from For Him featured list. New array:', this.pageContent.forhim_doctors_featured);
    } else {
      this.pageContent.forhim_doctors_featured.push(doctorId);
      console.log('➕ Added doctor to For Him featured list. New array:', this.pageContent.forhim_doctors_featured);
    }
  }

  selectAllForHerDoctors(): void {
    if (!this.pageContent.doctors_featured) {
      this.pageContent.doctors_featured = [];
    }
    // Use this.doctors (same source as the checkboxes)
    this.doctors.forEach(doctor => {
      if (!this.pageContent.doctors_featured.includes(doctor.id)) {
        this.pageContent.doctors_featured.push(doctor.id);
      }
    });
    console.log('✅ Selected all For Her doctors:', this.pageContent.doctors_featured.length, 'doctors');
  }

  deselectAllForHerDoctors(): void {
    this.pageContent.doctors_featured = [];
    console.log('✅ Deselected all For Her doctors');
  }

  selectAllForHimDoctors(): void {
    if (!this.pageContent.forhim_doctors_featured) {
      this.pageContent.forhim_doctors_featured = [];
    }
    // Use this.doctors (same source as the checkboxes - matches Team page pattern)
    this.doctors.forEach(doctor => {
      if (!this.pageContent.forhim_doctors_featured.includes(doctor.id)) {
        this.pageContent.forhim_doctors_featured.push(doctor.id);
      }
    });
    console.log('✅ Selected all For Him doctors:', this.pageContent.forhim_doctors_featured.length, 'doctors');
  }

  deselectAllForHimDoctors(): void {
    this.pageContent.forhim_doctors_featured = [];
  }

  getForHimFeaturedDoctorsCount(): number {
    return this.pageContent?.forhim_doctors_featured?.length || 0;
  }

  // Instagram gallery management
  addInstagramGalleryImage(): void {
    if (!this.pageContent.instagram_gallery) {
      this.pageContent.instagram_gallery = [];
    }
    this.pageContent.instagram_gallery.push({
      imageUrl: '',
      postLink: ''
    });
  }

  // FAQ management
  addFaqItem(): void {
    if (!this.pageContent.faq_items) {
      this.pageContent.faq_items = [];
    }
    this.pageContent.faq_items.push({
      question: '',
      answer: ''
    });
  }

  // Map branches management
  addMapBranch(): void {
    if (!this.pageContent.map_branches) {
      this.pageContent.map_branches = [];
    }
    this.pageContent.map_branches.push({
      city: '',
      name: '',
      addr: '',
      lat: '',
      lng: ''
    });
  }

  // ============ TEAM PAGE METHODS ============

  // Team page doctors grid management
  isDoctorInTeam(doctorId: string): boolean {
    if (!this.pageContent?.team_doctors_featured) {
      return false;
    }
    return this.pageContent.team_doctors_featured.includes(doctorId);
  }

  toggleDoctorInTeam(doctorId: string): void {
    console.log('🔄 toggleDoctorInTeam called with doctorId:', doctorId);
    if (!this.pageContent.team_doctors_featured) {
      this.pageContent.team_doctors_featured = [];
    }

    const index = this.pageContent.team_doctors_featured.indexOf(doctorId);
    if (index > -1) {
      this.pageContent.team_doctors_featured.splice(index, 1);
      console.log('➖ Removed doctor from Team featured list. New array:', this.pageContent.team_doctors_featured);
    } else {
      this.pageContent.team_doctors_featured.push(doctorId);
      console.log('➕ Added doctor to Team featured list. New array:', this.pageContent.team_doctors_featured);
    }
  }

  selectAllTeamDoctors(): void {
    if (!this.pageContent.team_doctors_featured) {
      this.pageContent.team_doctors_featured = [];
    }
    const filteredDoctors = this.getFilteredTeamDoctors();
    filteredDoctors.forEach(doctor => {
      if (!this.pageContent.team_doctors_featured.includes(doctor.id)) {
        this.pageContent.team_doctors_featured.push(doctor.id);
      }
    });
  }

  deselectAllTeamDoctors(): void {
    this.pageContent.team_doctors_featured = [];
    console.log('🧹 Cleared all Team featured doctors');
  }

  applyTeamDoctorFilter(): void {
    // Filter is applied in getFilteredTeamDoctors()
  }

  getFilteredTeamDoctors(): Doctor[] {
    // Only use doctors loaded from Supabase - no fallback
    if (!this.teamDoctorFilter) {
      return this.doctors;
    }
    return this.doctors.filter(doctor => doctor.specialization === this.teamDoctorFilter);
  }

  getForHerDoctors(): Doctor[] {
    // Only use doctors loaded from Supabase - no fallback
    return this.doctors;
  }

  getForHimDoctors(): Doctor[] {
    // Only use doctors loaded from Supabase - no fallback
    return this.doctors;
  }

  onTeamHeroImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.mediaService.savePageImage(file, 'team', 'hero').then(filePath => {
        this.pageContent.hero_image = filePath;
        console.log('✅ Team hero image uploaded:', filePath);
      }).catch(error => {
        console.error('❌ Team hero image upload failed:', error);
      });
    }
  }

  // ============ CONTACT PAGE METHODS ============

  addContactBranch(): void {
    if (!this.pageContent.branches) {
      this.pageContent.branches = [];
    }
    this.pageContent.branches.push({
      branch_name: 'New Branch',
      city: '',
      address: '',
      phone: '',
      email: '',
      whatsapp: '',
      hours_weekday: '9:00 AM - 9:00 PM',
      hours_weekend: '10:00 AM - 8:00 PM',
      lat: '',
      lng: '',
      map_embed: '',
      image: '',
      services: ''
    });
    this.selectedBranchIndex = this.pageContent.branches.length - 1;
  }

  removeContactBranch(index: number): void {
    if (confirm('Are you sure you want to remove this branch?')) {
      this.pageContent.branches.splice(index, 1);
      if (this.selectedBranchIndex >= this.pageContent.branches.length) {
        this.selectedBranchIndex = Math.max(0, this.pageContent.branches.length - 1);
      }
    }
  }

  moveBranchUp(index: number): void {
    if (index > 0) {
      const temp = this.pageContent.branches[index];
      this.pageContent.branches[index] = this.pageContent.branches[index - 1];
      this.pageContent.branches[index - 1] = temp;
      this.selectedBranchIndex = index - 1;
    }
  }

  moveBranchDown(index: number): void {
    if (index < this.pageContent.branches.length - 1) {
      const temp = this.pageContent.branches[index];
      this.pageContent.branches[index] = this.pageContent.branches[index + 1];
      this.pageContent.branches[index + 1] = temp;
      this.selectedBranchIndex = index + 1;
    }
  }

  selectBranchTab(index: number): void {
    this.selectedBranchIndex = index;
  }

  addSocialLink(): void {
    if (!this.pageContent.social_links) {
      this.pageContent.social_links = [];
    }
    this.pageContent.social_links.push({
      platform: 'Instagram',
      url: ''
    });
  }

  removeSocialLink(index: number): void {
    if (this.pageContent.social_links) {
      this.pageContent.social_links.splice(index, 1);
    }
  }

  // ============ BLOG PAGE METHODS ============

  addBlogCategory(): void {
    if (!this.pageContent.blog_categories) {
      this.pageContent.blog_categories = [];
    }
    this.pageContent.blog_categories.push('New Category');
  }

  // ============ BLOG MANAGEMENT METHODS ============

  loadBlogs(): void {
    this.isLoading = true;
    // Load from BlogService which uses Supabase
    this.blogService.getAllPosts().subscribe({
      next: (posts) => {
        // Convert BlogServicePost to BlogPost (admin interface)
        this.blogs = posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.featuredImage || post.featured_image,
          category: post.category,
          tags: post.tags,
          author: post.author,
          status: post.status,
          publishDate: post.publishDate || post.publish_date,
          createdAt: post.createdAt || post.created_at,
          updatedAt: post.updatedAt || post.updated_at,
          // SEO fields are now flattened (no nested seo object)
          metaTitle: post.metaTitle || post.meta_title,
          metaDescription: post.metaDescription || post.meta_description,
          metaKeywords: post.metaKeywords || post.meta_keywords
        }));

        console.log(`📦 Loaded ${this.blogs.length} blog posts from BlogService`);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load blogs:', err);
        this.blogs = [];
        this.isLoading = false;
      }
    });
  }

  createNewBlog(): void {
    this.editingBlogId = null;
    this.selectedBlog = {
      id: this.generateBlogId(),
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      featuredImageAlt: '',
      category: '',
      tags: [],
      author: this.currentUser?.name || 'Admin',
      status: 'draft',
      publishDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  editBlog(id: string): void {
    const blog = this.blogs.find(b => b.id === id);
    if (blog) {
      this.editingBlogId = id;
      this.selectedBlog = { ...blog };
    }
  }

  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deletePost(id);
      this.loadBlogs(); // Reload the list
      this.saveMessage = 'Blog post deleted successfully!';
      setTimeout(() => this.saveMessage = '', 3000);
    }
  }

  duplicateBlog(id: string): void {
    this.blogService.getPostById(id).subscribe({
      next: (originalPost) => {
        if (originalPost) {
          const duplicate: any = {
            ...originalPost,
            id: this.generateBlogId(),
            title: originalPost.title + ' (Copy)',
            slug: originalPost.slug + '-copy',
            status: 'draft' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          this.blogService.addPost(duplicate).subscribe({
            next: () => {
              this.loadBlogs(); // Reload the list
              this.saveMessage = 'Blog post duplicated successfully!';
              setTimeout(() => this.saveMessage = '', 3000);
            },
            error: (err) => console.error('Failed to duplicate blog:', err)
          });
        }
      },
      error: (err) => console.error('Failed to get blog:', err)
    });
  }

  saveBlog(): void {
    console.log('💾 Save clicked', this.selectedBlog);
    if (!this.selectedBlog) {
      console.error('❌ No selected blog to save');
      return;
    }

    // Use whatever status is selected in the dropdown - do NOT override it
    // The status dropdown is bound to selectedBlog.status via [(ngModel)]

    // Auto-generate slug if empty
    if (!this.selectedBlog.slug && this.selectedBlog.title) {
      this.selectedBlog.slug = this.generateSlug(this.selectedBlog.title);
    }

    // Set default values for required fields if missing
    if (!this.selectedBlog.id) {
      this.selectedBlog.id = 'blog_' + Date.now();
    }
    if (!this.selectedBlog.createdAt) {
      this.selectedBlog.createdAt = new Date().toISOString();
    }
    if (!this.selectedBlog.publishDate) {
      this.selectedBlog.publishDate = new Date().toISOString();
    }

    // Convert admin BlogPost to BlogServicePost
    const blogServicePost: BlogServicePost = {
      id: this.selectedBlog.id,
      slug: this.selectedBlog.slug,
      title: this.selectedBlog.title,
      subtitle: this.selectedBlog.excerpt, // Use excerpt as subtitle
      author: this.selectedBlog.author,
      authorImage: '', // Default empty, can be added later
      publishDate: this.selectedBlog.publishDate,
      category: this.selectedBlog.category,
      featuredImage: this.selectedBlog.featuredImage,
      excerpt: this.selectedBlog.excerpt,
      content: this.selectedBlog.content,
      tags: this.selectedBlog.tags,
      status: this.selectedBlog.status,
      readTime: this.calculateReadTime(this.selectedBlog.content),
      relatedPosts: [],
      // Flatten SEO fields for Supabase (no nested seo object)
      metaTitle: this.selectedBlog.metaTitle || this.selectedBlog.title,
      metaDescription: this.selectedBlog.metaDescription || this.selectedBlog.excerpt,
      metaKeywords: this.selectedBlog.metaKeywords || '',
      createdAt: this.selectedBlog.createdAt,
      updatedAt: new Date().toISOString()
    };

    console.log('📝 Saving blog post:', blogServicePost);

    // Save using BlogService
    if (this.editingBlogId) {
      console.log('✏️ Updating existing post:', this.editingBlogId);
      this.blogService.updatePost(this.editingBlogId, blogServicePost).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Blog post updated in Supabase');
            this.loadBlogs(); // Reload the list
            const statusMessage = this.selectedBlog!.status === 'published' ? 'Published' : 'Draft saved';
            this.saveMessage = `${statusMessage} successfully! Continue editing when ready.`;
            setTimeout(() => this.saveMessage = '', 3000);
          } else {
            this.saveMessage = '✗ Error updating blog post';
            setTimeout(() => this.saveMessage = '', 3000);
          }
        },
        error: (err) => {
          console.error('❌ Error updating blog post:', err);
          this.saveMessage = '✗ Error: ' + err.message;
          setTimeout(() => this.saveMessage = '', 3000);
        }
      });
    } else {
      console.log('➕ Adding new post');
      this.blogService.addPost(blogServicePost).subscribe({
        next: (created) => {
          console.log('✅ Blog post created in Supabase:', created);
          this.editingBlogId = blogServicePost.id; // Set editing ID for new posts
          this.loadBlogs(); // Reload the list
          const statusMessage = this.selectedBlog!.status === 'published' ? 'Published' : 'Draft saved';
          this.saveMessage = `${statusMessage} successfully! Continue editing when ready.`;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Error creating blog post:', err);
          this.saveMessage = '✗ Error: ' + err.message;
          setTimeout(() => this.saveMessage = '', 3000);
        }
      });
    }
  }

  publishBlog(): void {
    if (!this.selectedBlog) return;

    // Auto-generate slug if empty
    if (!this.selectedBlog.slug && this.selectedBlog.title) {
      this.selectedBlog.slug = this.generateSlug(this.selectedBlog.title);
    }

    this.selectedBlog.status = 'published';
    this.selectedBlog.publishDate = new Date().toISOString();
    this.selectedBlog.updatedAt = new Date().toISOString();

    // Convert admin BlogPost to BlogServicePost
    const blogServicePost: BlogServicePost = {
      id: this.selectedBlog.id,
      slug: this.selectedBlog.slug,
      title: this.selectedBlog.title,
      subtitle: this.selectedBlog.excerpt, // Use excerpt as subtitle
      author: this.selectedBlog.author,
      authorImage: '', // Default empty, can be added later
      publishDate: this.selectedBlog.publishDate,
      category: this.selectedBlog.category,
      featuredImage: this.selectedBlog.featuredImage,
      excerpt: this.selectedBlog.excerpt,
      content: this.selectedBlog.content,
      tags: this.selectedBlog.tags,
      status: 'published',
      readTime: this.calculateReadTime(this.selectedBlog.content),
      relatedPosts: [],
      // Flatten SEO fields for Supabase (no nested seo object)
      metaTitle: this.selectedBlog.metaTitle || this.selectedBlog.title,
      metaDescription: this.selectedBlog.metaDescription || this.selectedBlog.excerpt,
      metaKeywords: this.selectedBlog.metaKeywords || '',
      createdAt: this.selectedBlog.createdAt,
      updatedAt: new Date().toISOString()
    };

    // Save using BlogService
    if (this.editingBlogId) {
      this.blogService.updatePost(this.editingBlogId, blogServicePost).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Blog post published in Supabase');
            this.loadBlogs(); // Reload the list
            this.saveMessage = 'Blog post published successfully!';
            this.selectedBlog = null;
            this.editingBlogId = null;
            setTimeout(() => this.saveMessage = '', 3000);
          } else {
            this.saveMessage = '✗ Error publishing blog post';
            setTimeout(() => this.saveMessage = '', 3000);
          }
        },
        error: (err) => {
          console.error('❌ Error publishing blog post:', err);
          this.saveMessage = '✗ Error: ' + err.message;
          setTimeout(() => this.saveMessage = '', 3000);
        }
      });
    } else {
      this.blogService.addPost(blogServicePost).subscribe({
        next: (created) => {
          console.log('✅ Blog post published in Supabase:', created);
          this.editingBlogId = blogServicePost.id;
          this.loadBlogs(); // Reload the list
          this.saveMessage = 'Blog post published successfully!';
          this.selectedBlog = null;
          this.editingBlogId = null;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Error publishing blog post:', err);
          this.saveMessage = '✗ Error: ' + err.message;
          setTimeout(() => this.saveMessage = '', 3000);
        }
      });
    }
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  generateBlogId(): string {
    return 'blog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  calculateReadTime(content: string): string {
    if (!content) return '5 min read';
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  }

  uploadBlogImage(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/') && this.selectedBlog) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.selectedBlog && e.target?.result) {
          this.selectedBlog.featuredImage = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  filterBlogs(status?: string, category?: string): void {
    this.blogFilterStatus = status || '';
    this.blogFilterCategory = category || '';
  }

  getFilteredBlogs(): BlogPost[] {
    let filtered = [...this.blogs];

    if (this.blogFilterStatus) {
      filtered = filtered.filter(b => b.status === this.blogFilterStatus);
    }

    if (this.blogFilterCategory) {
      filtered = filtered.filter(b => b.category === this.blogFilterCategory);
    }

    if (this.blogSearchQuery) {
      const query = this.blogSearchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  cancelBlogEdit(): void {
    this.selectedBlog = null;
    this.editingBlogId = null;
  }

  updateBlogTags(event: any): void {
    if (this.selectedBlog) {
      const value = event.target.value;
      this.selectedBlog.tags = value.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
    }
  }

  updateBlogPublishDate(event: any): void {
    if (this.selectedBlog) {
      this.selectedBlog.publishDate = new Date(event.target.value).toISOString();
    }
  }

  getBlogTagsString(): string {
    return this.selectedBlog?.tags?.join(', ') || '';
  }

  getBlogPublishDateForInput(): string {
    if (!this.selectedBlog?.publishDate) return '';
    const date = new Date(this.selectedBlog.publishDate);
    return date.toISOString().slice(0, 16);
  }

  // ============ SERVICES PAGE METHODS ============

  addHeroSlide(): void {
    if (!this.pageContent.hero_slides) {
      this.pageContent.hero_slides = [];
    }
    this.pageContent.hero_slides.push({
      title: 'New Slide',
      subtitle: '',
      background_image: '',
      cta_text: 'Learn More',
      cta_link: '#',
      modal_service_id: ''
    });
  }

  moveSlideUp(index: number): void {
    if (index > 0 && this.pageContent.hero_slides) {
      const temp = this.pageContent.hero_slides[index];
      this.pageContent.hero_slides[index] = this.pageContent.hero_slides[index - 1];
      this.pageContent.hero_slides[index - 1] = temp;
    }
  }

  moveSlideDown(index: number): void {
    if (this.pageContent.hero_slides && index < this.pageContent.hero_slides.length - 1) {
      const temp = this.pageContent.hero_slides[index];
      this.pageContent.hero_slides[index] = this.pageContent.hero_slides[index + 1];
      this.pageContent.hero_slides[index + 1] = temp;
    }
  }

  isServiceFeatured(serviceId: string): boolean {
    if (!this.pageContent?.featured_services) {
      return false;
    }
    return this.pageContent.featured_services.includes(serviceId);
  }

  toggleServiceFeatured(serviceId: string): void {
    if (!this.pageContent.featured_services) {
      this.pageContent.featured_services = [];
    }

    const index = this.pageContent.featured_services.indexOf(serviceId);
    if (index > -1) {
      this.pageContent.featured_services.splice(index, 1);
    } else {
      this.pageContent.featured_services.push(serviceId);
    }
  }

  // ==================== OFFERS SLIDER METHODS ====================

  loadOffers(): void {
    this.offers = this.servicesService.getAllOffers();
  }

  createNewOffer(): void {
    this.editingOfferId = null;
    this.selectedOffer = {
      id: '',
      coverImage: '',
      eyebrow: '',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Learn More',
      ctaLink: '/contact',
      serviceId: '',
      order: this.offers.length
    };
  }

  editOffer(offerId: string): void {
    const offer = this.servicesService.getOfferById(offerId);
    if (offer) {
      this.editingOfferId = offerId;
      this.selectedOffer = { ...offer };
    }
  }

  saveOffer(): void {
    if (!this.selectedOffer) return;

    if (this.editingOfferId) {
      // Update existing
      this.servicesService.updateOffer(this.editingOfferId, this.selectedOffer);
      this.saveMessage = 'Offer updated successfully!';
    } else {
      // Create new
      this.servicesService.addOffer(this.selectedOffer);
      this.saveMessage = 'Offer created successfully!';
    }

    this.loadOffers();
    this.cancelOfferEdit();
    setTimeout(() => this.saveMessage = '', 3000);
  }

  deleteOffer(offerId: string): void {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.servicesService.deleteOffer(offerId);
      this.loadOffers();
      this.saveMessage = 'Offer deleted successfully!';
      setTimeout(() => this.saveMessage = '', 3000);
    }
  }

  cancelOfferEdit(): void {
    this.selectedOffer = null;
    this.editingOfferId = null;
  }

  moveOfferUp(index: number): void {
    if (index > 0) {
      const temp = this.offers[index];
      this.offers[index] = this.offers[index - 1];
      this.offers[index - 1] = temp;
      this.saveOfferOrder();
    }
  }

  moveOfferDown(index: number): void {
    if (index < this.offers.length - 1) {
      const temp = this.offers[index];
      this.offers[index] = this.offers[index + 1];
      this.offers[index + 1] = temp;
      this.saveOfferOrder();
    }
  }

  saveOfferOrder(): void {
    const orderIds = this.offers.map(o => o.id);
    this.servicesService.reorderOffers(orderIds);
    this.loadOffers();
  }

  // ==================== SERVICES MANAGEMENT METHODS ====================

  loadServicesData(): void {
    // Load services from Supabase
    this.adminSupabaseService.getAllServices().subscribe({
      next: (services: any[]) => {
        this.servicesData = services;
        console.log('✅ Loaded', services.length, 'services from Supabase for doctor selection');

        // Log first service to see all available fields
        if (services.length > 0) {
          console.log('📋 First service fields:', Object.keys(services[0]));
          console.log('🔍 First service sample data:', {
            name: services[0].name,
            subtitle: services[0].subtitle,
            description: services[0].description,
            price: services[0].price,
            priceUnit: services[0].priceUnit
          });
        }
      },
      error: (err: any) => {
        console.error('❌ Error loading services from Supabase:', err);
        // Fallback to hardcoded services
        this.servicesData = this.servicesService.getAllServices();
        console.log('⚠️ Using fallback hardcoded services:', this.servicesData.length);
      }
    });
  }

  loadServiceCategories(): void {
    this.serviceCategories = this.servicesService.getCategories();
  }

  getFilteredServices(): Service[] {
    let filtered = this.servicesData;
    console.log('Filtering services. Total:', filtered.length, 'Filter:', this.serviceFilterCategory);

    // Filter by parent service category
    if (this.serviceFilterCategory) {
      filtered = filtered.filter(s => s.parentService === this.serviceFilterCategory);
      console.log('After parent filter:', filtered.length, 'services');
    }

    // Filter by search query
    if (this.serviceSearchQuery) {
      const query = this.serviceSearchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.cardTitle.toLowerCase().includes(query) ||
        s.cardDescription.toLowerCase().includes(query) ||
        s.parentService.toLowerCase().includes(query)
      );
      console.log('After search filter:', filtered.length, 'services');
    }

    return filtered;
  }

  applyServiceFilters(): void {
    // Triggers change detection for filters
  }

  createNewServiceData(): void {
    this.editingServiceId = null;
    this.selectedServiceData = {
      id: '',
      name: '',
      slug: '',
      parentService: '',

      // Card display
      cardImage: '',
      cardRibbon: '',
      cardNumber: '01',
      cardTitle: '',
      cardDescription: '',
      cardPrice: '',
      cardButtonText: 'Book Now',

      // Modal
      modalTitle: '',
      heroBackgroundImage: '',
      detailTitle: '',
      detailSubtitle: '',
      detailTagline: '',

      // Meta strip
      metaDuration: '',
      metaDowntime: '',
      metaLasts: '',
      metaSessions: '',

      // Sections
      howItWorksSteps: [],
      timeline: [],
      whatYouAchieve: [],
      productsUsed: [],

      // Gallery & Specialists
      gallery: [],
      specialistDoctorIds: [],

      // Pricing
      priceDetails: '',

      // CTA
      ctaButtonText: 'Book Consultation',
      whatsappNumber: '201000312528',
      whatsappButtonText: 'Chat on WhatsApp',

      // Visibility
      isActive: true,
      showInGrid: true,
      showPrice: true,
      order: this.servicesData.length,
      createdAt: '',
      updatedAt: ''
    };
  }

  resetServicesToDefaults(): void {
    if (confirm('Are you sure you want to reset all services to the 16 default services from the live website? This will delete all custom services you have created.')) {
      this.servicesService.resetServicesToDefaults();
      this.loadServicesData();
      this.selectedServiceData = null;
      alert('Services reset successfully! You now have 16 default services from nouvelage.clinic');
    }
  }

  editServiceData(serviceId: string): void {
    // Find service from loaded Supabase data (not local storage)
    const service = this.servicesData.find(s => s.id === serviceId);
    if (service) {
      this.editingServiceId = serviceId;
      this.selectedServiceData = JSON.parse(JSON.stringify(service)); // Deep copy
      console.log('✏️ Editing service from Supabase:', this.selectedServiceData);
      console.log('📋 Service fields available:', Object.keys(this.selectedServiceData));
      console.log('🔍 Field values:', {
        name: this.selectedServiceData.name,
        subtitle: this.selectedServiceData.subtitle,
        description: this.selectedServiceData.description,
        price: this.selectedServiceData.price,
        priceUnit: this.selectedServiceData.priceUnit,
        category: this.selectedServiceData.category
      });
    } else {
      console.error('❌ Service not found in loaded data:', serviceId);
    }
  }

  saveServiceData(): void {
    if (!this.selectedServiceData) return;

    // Auto-generate slug if empty
    if (!this.selectedServiceData.slug && this.selectedServiceData.name) {
      this.selectedServiceData.slug = this.servicesService.generateSlug(this.selectedServiceData.name);
    }

    this.isLoading = true;
    const serviceId = this.editingServiceId || this.selectedServiceData.id;
    const selectedDoctorIds = this.selectedServiceData.specialistDoctorIds || [];

    // STEP 1: Save service to Supabase
    if (this.editingServiceId) {
      // Update existing service
      console.log('📝 Updating service in Supabase:', this.editingServiceId);
      this.adminSupabaseService.updateService(this.editingServiceId, this.selectedServiceData).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Service updated in Supabase');
            this.saveMessage = 'Service updated successfully in Supabase!';
            this.finalizeServiceSave();
          } else {
            console.error('❌ Failed to update service in Supabase');
            this.saveMessage = 'Error updating service in Supabase';
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('❌ Error updating service:', err);
          this.saveMessage = 'Error: ' + err.message;
          this.isLoading = false;
        }
      });
    } else {
      // Create new service
      console.log('➕ Creating new service in Supabase');

      // Ensure required fields are set
      const newService = {
        ...this.selectedServiceData,
        id: this.selectedServiceData.id || 'service_' + Date.now(),
        isActive: true,
        orderIndex: this.servicesData.length + 1
      };

      this.adminSupabaseService.createService(newService).subscribe({
        next: (createdService) => {
          if (createdService) {
            console.log('✅ Service created in Supabase:', createdService);
            this.saveMessage = 'Service created successfully in Supabase!';
            this.editingServiceId = createdService.id; // Set ID for future edits
            this.finalizeServiceSave();
          } else {
            console.error('❌ Failed to create service in Supabase');
            this.saveMessage = 'Error creating service in Supabase';
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('❌ Error creating service:', err);
          this.saveMessage = 'Error: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  finalizeServiceSave(): void {
    this.loadServicesData();
    this.loadServiceCategories();
    this.loadDoctors(); // Reload doctors to show updated service assignments
    this.cancelServiceEdit();
    this.isLoading = false;
    setTimeout(() => this.saveMessage = '', 3000);
  }

  deleteServiceData(serviceId: string): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.isLoading = true;
      this.adminSupabaseService.deleteService(serviceId).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Service deleted from Supabase');
            this.saveMessage = 'Service deleted successfully from Supabase!';
            this.loadServicesData();
            this.loadServiceCategories();
          } else {
            console.error('❌ Failed to delete service');
            this.saveMessage = 'Error deleting service';
          }
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Error deleting service:', err);
          this.saveMessage = 'Error: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  duplicateServiceData(serviceId: string): void {
    // Find service from loaded Supabase data (not local storage)
    const service = this.servicesData.find(s => s.id === serviceId);
    if (service) {
      const duplicate = JSON.parse(JSON.stringify(service));
      duplicate.name = service.name + ' (Copy)';
      duplicate.slug = '';
      duplicate.id = 'service_' + Date.now(); // Generate new ID

      // Create duplicate in Supabase
      this.isLoading = true;
      this.adminSupabaseService.createService(duplicate).subscribe({
        next: (createdService) => {
          if (createdService) {
            console.log('✅ Service duplicated in Supabase:', createdService);
            this.saveMessage = 'Service duplicated successfully!';
            this.loadServicesData();
          } else {
            console.error('❌ Failed to duplicate service');
            this.saveMessage = 'Error duplicating service';
          }
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Error duplicating service:', err);
          this.saveMessage = 'Error: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  cancelServiceEdit(): void {
    this.selectedServiceData = null;
    this.editingServiceId = null;
  }

  /**
   * Save service to Supabase without closing the editor
   * Used for auto-save after image upload
   */
  saveServiceDataSilently(): void {
    if (!this.selectedServiceData || !this.editingServiceId) {
      return;
    }

    console.log('💾 Silently updating service in Supabase:', this.editingServiceId);
    this.adminSupabaseService.updateService(this.editingServiceId, this.selectedServiceData).subscribe({
      next: (success) => {
        if (success) {
          console.log('✅ Service updated in Supabase (silent save)');
          // Reload services list but keep editor open
          this.loadServicesData();
        } else {
          console.error('❌ Failed to update service in Supabase (silent save)');
        }
      },
      error: (err) => {
        console.error('❌ Error updating service (silent save):', err);
      }
    });
  }

  // ============ NEW SERVICE ARRAY MANIPULATION METHODS ============

  // How It Works Steps
  addHowItWorksStep(): void {
    if (!this.selectedServiceData) return;
    this.selectedServiceData.howItWorksSteps.push({
      step: this.selectedServiceData.howItWorksSteps.length + 1,
      title: '',
      description: ''
    });
  }

  removeHowItWorksStep(index: number): void {
    if (!this.selectedServiceData) return;
    this.selectedServiceData.howItWorksSteps.splice(index, 1);
    // Renumber steps
    this.selectedServiceData.howItWorksSteps.forEach((step, idx) => step.step = idx + 1);
  }

  // Timeline Items
  addTimelineItem(): void {
    if (!this.selectedServiceData) return;
    this.selectedServiceData.timeline.push({
      step: this.selectedServiceData.timeline.length + 1,
      title: '',
      description: ''
    });
  }

  removeTimelineItem(index: number): void {
    if (!this.selectedServiceData) return;
    this.selectedServiceData.timeline.splice(index, 1);
    // Renumber steps
    this.selectedServiceData.timeline.forEach((item, idx) => item.step = idx + 1);
  }

  // Benefits (What You Achieve)
  addBenefit(): void {
    if (!this.selectedServiceData) return;
    this.selectedServiceData.whatYouAchieve.push({ title: '', subtitle: '' });
  }

  removeBenefit(index: number): void {
    if (!this.selectedServiceData) return;
    this.selectedServiceData.whatYouAchieve.splice(index, 1);
  }

  // Products Used
  addProduct(): void {
    if (!this.selectedServiceData) return;
    this.selectedServiceData.productsUsed.push({
      name: '',
      image: ''
    });
  }

  removeProduct(index: number): void {
    if (!this.selectedServiceData) return;
    this.selectedServiceData.productsUsed.splice(index, 1);
  }

  // ============ IMAGE UPLOAD METHODS ============

  async onServiceCardImageUpload(event: any): Promise<void> {
    if (!this.selectedServiceData) return;
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const serviceName = this.selectedServiceData.name || 'new-service';
      const serviceSlug = this.servicesService.generateSlug(serviceName);
      const imagePath = await this.mediaService.savePageImage(file, `services/${serviceSlug}`, 'card-image');
      this.selectedServiceData.cardImage = imagePath;
      console.log('✅ Card image uploaded:', imagePath);
    } catch (error) {
      console.error('❌ Card image upload failed:', error);
      alert('Failed to upload card image. Please try again.');
    }
  }

  async onServiceHeroImageUpload(event: any): Promise<void> {
    if (!this.selectedServiceData) return;
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const serviceName = this.selectedServiceData.name || 'new-service';
      const serviceSlug = this.servicesService.generateSlug(serviceName);
      const imagePath = await this.mediaService.savePageImage(file, `services/${serviceSlug}`, 'hero-background');
      this.selectedServiceData.heroBackgroundImage = imagePath;
      console.log('✅ Hero image uploaded:', imagePath);
    } catch (error) {
      console.error('❌ Hero image upload failed:', error);
      alert('Failed to upload hero image. Please try again.');
    }
  }

  async onProductImageUpload(event: any, index: number): Promise<void> {
    if (!this.selectedServiceData) return;
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const serviceName = this.selectedServiceData.name || 'new-service';
      const serviceSlug = this.servicesService.generateSlug(serviceName);
      const imagePath = await this.mediaService.savePageImage(file, `services/${serviceSlug}/products`, `product-${index}`);
      this.selectedServiceData.productsUsed[index].image = imagePath;
      console.log('✅ Product image uploaded:', imagePath);
    } catch (error) {
      console.error('❌ Product image upload failed:', error);
      alert('Failed to upload product image. Please try again.');
    }
  }

  // ============ DOCTOR SELECTION METHODS ============

  isServiceDoctorSelected(doctorId: string): boolean {
    if (!this.selectedServiceData) return false;
    return this.selectedServiceData.specialistDoctorIds.includes(doctorId);
  }

  toggleServiceDoctor(doctorId: string): void {
    if (!this.selectedServiceData) return;

    const index = this.selectedServiceData.specialistDoctorIds.indexOf(doctorId);
    if (index > -1) {
      this.selectedServiceData.specialistDoctorIds.splice(index, 1);
    } else {
      this.selectedServiceData.specialistDoctorIds.push(doctorId);
    }
  }

  // Doctor Modal in Service Modal
  openDoctorModalInService(doctorId: string): void {
    const doctor = this.doctorsService.getActiveDoctors().find(d => d.id === doctorId);
    if (doctor) {
      this.selectedDoctorInServiceModal = doctor;
      this.showDoctorModalInService = true;
    }
  }

  closeDoctorModalInService(): void {
    this.showDoctorModalInService = false;
    this.selectedDoctorInServiceModal = null;
  }

  getDoctorBeforeAfterCases(doctorId: string): any[] {
    const doctor = this.doctorsService.getActiveDoctors().find(d => d.id === doctorId);
    if (!doctor) return [];

    // Assuming doctor has beforeAfterCases property
    return (doctor as any).beforeAfterCases || [];
  }

  getServicesForDoctor(doctorId: string): Service[] {
    return this.servicesData.filter(s => s.specialistDoctorIds.includes(doctorId));
  }

  getDoctorName(doctorId: string): string {
    const doctor = this.doctorsService.getActiveDoctors().find((d: any) => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  }

  removeDoctorFromService(doctorId: string): void {
    if (!this.selectedServiceData) return;
    const index = this.selectedServiceData.specialistDoctorIds.indexOf(doctorId);
    if (index > -1) {
      this.selectedServiceData.specialistDoctorIds.splice(index, 1);
    }
  }

  // ==================== PARENT SERVICES METHODS ====================
  initializeDefaultParentServices(): void {
    // Force reinitialize parent services with real data
    const defaultParentServices: ParentService[] = [
      { id: 'ps_skincare', name: 'Skincare', order: 0 },
      { id: 'ps_injectables', name: 'Injectables', order: 1 },
      { id: 'ps_hair', name: 'Hair', order: 2 },
      { id: 'ps_laser', name: 'Laser', order: 3 }
    ];

    localStorage.setItem('parentServices', JSON.stringify(defaultParentServices));
    this.parentServices = defaultParentServices;
    console.log('Initialized parent services with real data:', this.parentServices);
  }

  // ==================== PARENT BUNDLES METHODS ====================
  initializeDefaultParentBundles(): void {
    const saved = localStorage.getItem('parentBundles');
    if (!saved) {
      const defaultParentBundles: ParentBundle[] = [
        { id: 'pb_hair', name: 'Hair Restoration', order: 0 },
        { id: 'pb_boosters', name: 'Skin Boosters', order: 1 },
        { id: 'pb_laser', name: 'Laser Hair Removal', order: 2 },
        { id: 'pb_bridal', name: 'Bridal', order: 3 },
        { id: 'pb_nutrition', name: 'Nutrition & Body', order: 4 }
      ];
      localStorage.setItem('parentBundles', JSON.stringify(defaultParentBundles));
      this.parentBundles = defaultParentBundles;
    } else {
      this.parentBundles = JSON.parse(saved);
    }
  }

  loadParentBundles(): void {
    this.isLoading = true;
    this.adminSupabaseService.getAllParentBundles().subscribe({
      next: (parentBundles) => {
        this.parentBundles = parentBundles;
        console.log('✅ Loaded', parentBundles.length, 'parent bundles from Supabase:', parentBundles.map(pb => pb.name).join(', '));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading parent bundles from Supabase:', err);
        // Fallback to localStorage
        const saved = localStorage.getItem('parentBundles');
        this.parentBundles = saved ? JSON.parse(saved) : [];
        console.log('⚠️ Using fallback localStorage for parent bundles');
        this.isLoading = false;
      }
    });
  }

  addParentBundle(): void {
    const newParentBundle: ParentBundle = {
      id: 'pb_' + Date.now(),
      name: 'New Bundle Category',
      order: this.parentBundles.length
    };
    this.selectedParentBundle = { ...newParentBundle };
    this.editingParentBundleId = null; // null means creating new
    console.log('➕ Creating new parent bundle');
  }

  selectParentBundle(pb: ParentBundle): void {
    this.selectedParentBundle = { ...pb };
    this.editingParentBundleId = pb.id;
    console.log('📝 Editing parent bundle:', pb.name);
  }

  saveParentBundle(): void {
    if (!this.selectedParentBundle) return;

    // Auto-generate slug from name
    if (!this.selectedParentBundle.slug) {
      this.selectedParentBundle.slug = this.selectedParentBundle.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    this.isLoading = true;

    // Determine if creating new or updating existing
    if (this.editingParentBundleId) {
      // Update existing parent bundle
      console.log('💾 Updating parent bundle in Supabase:', this.selectedParentBundle.name);
      this.adminSupabaseService.updateParentBundle(this.editingParentBundleId, this.selectedParentBundle).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Parent bundle updated in Supabase');
            const index = this.parentBundles.findIndex(pb => pb.id === this.editingParentBundleId);
            if (index !== -1) {
              this.parentBundles[index] = { ...this.selectedParentBundle };
            }
            this.saveMessage = '✓ Parent bundle updated successfully!';
            this.selectedParentBundle = null;
            this.editingParentBundleId = null;
            this.loadParentBundles(); // Reload to ensure sync
          } else {
            this.saveMessage = '✗ Error updating parent bundle';
          }
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Error updating parent bundle:', err);
          this.saveMessage = '✗ Error: ' + err.message;
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        }
      });
    } else {
      // Create new parent bundle
      console.log('➕ Creating new parent bundle in Supabase:', this.selectedParentBundle.name);
      this.adminSupabaseService.createParentBundle(this.selectedParentBundle).subscribe({
        next: (createdParentBundle) => {
          console.log('✅ Parent bundle created in Supabase:', createdParentBundle);
          this.parentBundles.push(createdParentBundle);
          this.saveMessage = '✓ Parent bundle created successfully!';
          this.selectedParentBundle = null;
          this.loadParentBundles(); // Reload to ensure sync
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Error creating parent bundle:', err);
          this.saveMessage = '✗ Error: ' + err.message;
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        }
      });
    }
  }

  cancelParentBundleEdit(): void {
    this.selectedParentBundle = null;
    this.editingParentBundleId = null;
  }

  deleteParentBundle(id: string): void {
    if (confirm('Delete this parent bundle? This may affect bundles using it.')) {
      this.isLoading = true;
      console.log('🗑️ Deleting parent bundle from Supabase:', id);

      this.adminSupabaseService.deleteParentBundle(id).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Parent bundle deleted from Supabase');
            this.parentBundles = this.parentBundles.filter(pb => pb.id !== id);
            if (this.selectedParentBundle?.id === id) {
              this.selectedParentBundle = null;
              this.editingParentBundleId = null;
            }
            this.saveMessage = '✓ Parent bundle deleted successfully!';
          } else {
            this.saveMessage = '✗ Error deleting parent bundle';
          }
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Error deleting parent bundle:', err);
          this.saveMessage = '✗ Error: ' + err.message;
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        }
      });
    }
  }

  moveParentBundleUp(index: number): void {
    if (index > 0) {
      [this.parentBundles[index - 1], this.parentBundles[index]] =
      [this.parentBundles[index], this.parentBundles[index - 1]];
      this.parentBundles.forEach((pb, i) => pb.order = i);
      this.updateParentBundleOrders();
    }
  }

  moveParentBundleDown(index: number): void {
    if (index < this.parentBundles.length - 1) {
      [this.parentBundles[index], this.parentBundles[index + 1]] =
      [this.parentBundles[index + 1], this.parentBundles[index]];
      this.parentBundles.forEach((pb, i) => pb.order = i);
      this.updateParentBundleOrders();
    }
  }

  updateParentBundleOrders(): void {
    // Update order for all parent bundles in Supabase
    this.parentBundles.forEach(pb => {
      this.adminSupabaseService.updateParentBundle(pb.id, { order: pb.order }).subscribe({
        next: () => console.log('✅ Updated order for:', pb.name),
        error: (err) => console.error('❌ Error updating order:', err)
      });
    });
    this.saveMessage = '✓ Parent bundle order updated!';
    setTimeout(() => this.saveMessage = '', 2000);
  }

  getParentBundleName(id: string): string {
    const pb = this.parentBundles.find(p => p.id === id);
    return pb ? pb.name : 'No Category';
  }

  loadParentServices(): void {
    const saved = localStorage.getItem('parentServices');
    this.parentServices = saved ? JSON.parse(saved) : [];
    console.log('loadParentServices called, result:', this.parentServices);
  }

  addParentService(): void {
    const newParentService: ParentService = {
      id: 'ps_' + Date.now(),
      name: 'New Parent Service',
      order: this.parentServices.length
    };
    this.parentServices.push(newParentService);
    this.saveParentServices();
  }

  selectParentService(ps: ParentService): void {
    this.selectedParentService = ps;
    this.editingParentServiceId = ps.id;
  }

  saveParentServices(): void {
    localStorage.setItem('parentServices', JSON.stringify(this.parentServices));
    this.saveMessage = '✓ Parent services saved!';
    setTimeout(() => this.saveMessage = '', 2000);
  }

  deleteParentService(id: string): void {
    if (confirm('Delete this parent service? This may affect services and bundles using it.')) {
      this.parentServices = this.parentServices.filter(ps => ps.id !== id);
      this.saveParentServices();
      if (this.selectedParentService?.id === id) {
        this.selectedParentService = null;
        this.editingParentServiceId = null;
      }
    }
  }

  moveParentServiceUp(index: number): void {
    if (index > 0) {
      [this.parentServices[index - 1], this.parentServices[index]] =
      [this.parentServices[index], this.parentServices[index - 1]];
      this.parentServices.forEach((ps, i) => ps.order = i);
      this.saveParentServices();
    }
  }

  moveParentServiceDown(index: number): void {
    if (index < this.parentServices.length - 1) {
      [this.parentServices[index], this.parentServices[index + 1]] =
      [this.parentServices[index + 1], this.parentServices[index]];
      this.parentServices.forEach((ps, i) => ps.order = i);
      this.saveParentServices();
    }
  }

  getServicesCountByParent(parentName: string): number {
    return this.servicesData.filter(s => s.parentService === parentName).length;
  }

  // ==================== BUNDLES METHODS ====================
  loadBundles(): void {
    this.isLoading = true;
    this.adminSupabaseService.getAllBundlesForAdmin().subscribe({
      next: (bundles) => {
        this.bundles = bundles;
        console.log('✅ Loaded', bundles.length, 'bundles from Supabase (including inactive)');
        this.isLoading = false;
        this.loadParentBundles(); // Load parent bundles for dropdown
      },
      error: (err) => {
        console.error('❌ Error loading bundles from Supabase:', err);
        // Fallback to localStorage
        const saved = localStorage.getItem('bundles');
        this.bundles = saved ? JSON.parse(saved) : [];
        console.log('⚠️ Using fallback localStorage for bundles');
        this.isLoading = false;
        this.loadParentBundles(); // Load parent bundles for dropdown
      }
    });
  }

  addBundle(): void {
    const newBundle: Bundle = {
      id: 'bundle_' + Date.now(),
      name: 'New Bundle',
      parentCategory: '',
      parentBundleId: '',

      // Card display
      cardImage: '',
      cardRibbon: '',
      cardNumber: '01',
      cardTitle: 'New Bundle',
      cardPrice: '0 EGP',

      // Hero Slider Settings
      showInSlider: false,
      sliderBgImage: '',
      sliderBgColor: 'bg-espresso',
      sliderTag: '',
      sliderTitle: '',
      sliderSubtitle: '',
      sliderCtaText: 'Learn More →',
      sliderOrder: 0,

      // Luxury Catalogue Modal
      useLuxuryModal: true,
      catalogueTheme: 'default',
      catalogueBadge: '',
      servicesLabel: 'Includes',
      servicesList: [],
      duration: '',
      visits: '',
      channel: '',
      priceOld: '',
      priceNew: '0',
      priceSave: '',
      priceUnit: 'EGP',
      showInstallment: false,
      installmentText: '',
      whyBoxText: '',
      modalTitle: 'New Bundle',
      gallery: [],

      order: this.bundles.length,
      isActive: true,
      showInGrid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.bundles.push(newBundle);
    this.selectBundle(newBundle);
  }

  selectBundle(bundle: Bundle): void {
    this.selectedBundle = JSON.parse(JSON.stringify(bundle)); // Deep copy
    this.editingBundleId = bundle.id;
  }

  saveBundles(): void {
    localStorage.setItem('bundles', JSON.stringify(this.bundles));
    this.saveMessage = '✓ Bundles saved!';
    setTimeout(() => this.saveMessage = '', 2000);
  }

  saveBundle(): void {
    if (!this.selectedBundle) return;

    this.isLoading = true;
    console.log('💾 Saving bundle to Supabase:', this.selectedBundle.id);
    console.log('📋 Hero Slider Settings:', {
      showInSlider: this.selectedBundle.showInSlider,
      sliderBgImage: this.selectedBundle.sliderBgImage?.substring(0, 50),
      sliderTitle: this.selectedBundle.sliderTitle
    });

    // Save to Supabase
    this.adminSupabaseService.updateBundle(this.selectedBundle.id, this.selectedBundle).subscribe({
      next: (success) => {
        if (success) {
          console.log('✅ Bundle saved to Supabase successfully');

          // Update local bundles array
          const index = this.bundles.findIndex(b => b.id === this.selectedBundle!.id);
          if (index > -1) {
            this.bundles[index] = JSON.parse(JSON.stringify(this.selectedBundle));
          }

          this.saveMessage = '✓ Bundle saved to Supabase successfully!';
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        } else {
          console.error('❌ Failed to save bundle to Supabase');
          this.saveMessage = '✗ Error saving bundle';
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        }
      },
      error: (err) => {
        console.error('❌ Error saving bundle to Supabase:', err);
        this.saveMessage = '✗ Error saving bundle: ' + err.message;
        this.isLoading = false;
        setTimeout(() => this.saveMessage = '', 3000);
      }
    });
  }

  openBundleSliderBgPicker(): void {
    this.openMediaPicker((url: string) => {
      if (this.selectedBundle) {
        this.selectedBundle.sliderBgImage = url;
      }
    }, 'general');
  }

  openBundleCardImagePicker(): void {
    this.openMediaPicker((url: string) => {
      if (this.selectedBundle) {
        this.selectedBundle.cardImage = url;
      }
    }, 'general');
  }

  cancelBundleEdit(): void {
    this.selectedBundle = null;
    this.editingBundleId = null;
  }

  deleteBundle(id: string): void {
    if (confirm('Are you sure you want to delete this bundle from Supabase?')) {
      this.isLoading = true;
      console.log('🗑️ Deleting bundle from Supabase:', id);

      this.adminSupabaseService.deleteBundle(id).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Bundle deleted from Supabase successfully');
            this.bundles = this.bundles.filter(b => b.id !== id);
            if (this.selectedBundle?.id === id) {
              this.selectedBundle = null;
              this.editingBundleId = null;
            }
            this.saveMessage = '✓ Bundle deleted from Supabase successfully!';
          } else {
            console.error('❌ Failed to delete bundle from Supabase');
            this.saveMessage = '✗ Error deleting bundle';
          }
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Error deleting bundle from Supabase:', err);
          this.saveMessage = '✗ Error deleting bundle: ' + err.message;
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        }
      });
    }
  }


  get filteredBundles(): Bundle[] {
    let filtered = [...this.bundles];

    if (this.bundleFilterParent) {
      filtered = filtered.filter(b => b.parentBundleId === this.bundleFilterParent);
    }

    if (this.bundleSearchQuery) {
      const query = this.bundleSearchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.cardTitle.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  onBundleFilterChange(): void {
    console.log('🔍 Bundle filter changed:', {
      selectedParentId: this.bundleFilterParent,
      totalBundles: this.bundles.length,
      filteredCount: this.filteredBundles.length,
      bundles: this.bundles.map(b => ({ name: b.name, parentBundleId: b.parentBundleId }))
    });
  }

  getParentServiceName(id: string): string {
    const ps = this.parentServices.find(p => p.id === id);
    return ps ? ps.name : 'No Category';
  }

  // ==================== MEDIA LIBRARY METHODS ====================

  loadMediaLibrary(): void {
    this.mediaLibraryService.getAllMedia().subscribe({
      next: (files) => {
        this.mediaFiles = files;
        console.log(`📦 Loaded ${this.mediaFiles.length} media files`);
      },
      error: (err) => {
        console.error('Failed to load media library:', err);
        this.mediaFiles = [];
      }
    });
  }

  uploadMediaFile(event: any, category: string = 'general'): void {
    // Prevent duplicate uploads
    if (this.isLoading) {
      console.warn('⚠️ Upload already in progress, ignoring duplicate request');
      return;
    }

    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      console.log('📤 Uploading file to media library:', file.name);
      console.log('📤 File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        category: category
      });
      this.isLoading = true;

      // Clear the input so the same file can be selected again
      event.target.value = '';

      // Use MediaService to determine correct path based on category
      let uploadPromise: Promise<string>;

      // Determine context and use appropriate MediaService method
      if (category === 'blog' && this.selectedBlog) {
        const postSlug = this.mediaService.generateBlogSlug(this.selectedBlog.title || 'untitled-' + Date.now());
        uploadPromise = this.mediaService.saveBlogImage(file, postSlug, 'content');
        console.log('📤 Uploading to blog category:', postSlug);
      } else if (category === 'service' && this.selectedService) {
        const serviceSlug = this.mediaService.generateServiceSlug(this.selectedService.name);
        uploadPromise = this.mediaService.saveServiceImage(file, serviceSlug, 'image');
        console.log('📤 Uploading to service category:', serviceSlug);
      } else if (category === 'doctor' && this.selectedDoctor) {
        const doctorSlug = this.mediaService.generateDoctorSlug(this.selectedDoctor.name);

        // Check if this is a case image (before/after) or profile image
        if (this.mediaPickerCaseIndex !== null && this.mediaPickerCaseType !== null) {
          // Upload case before/after image
          const caseData = this.selectedDoctor.beforeAfterGallery[this.mediaPickerCaseIndex];
          const caseNumber = this.mediaPickerCaseIndex + 1;
          const category = caseData?.category || 'treatment';

          uploadPromise = this.mediaService.saveCaseImage(
            file,
            doctorSlug,
            caseNumber,
            this.mediaPickerCaseType,
            category
          );
          console.log('📤 Uploading case image:', {
            doctorSlug,
            caseNumber,
            type: this.mediaPickerCaseType,
            category
          });
        } else {
          // Upload profile image
          uploadPromise = this.mediaService.saveDoctorProfile(file, doctorSlug);
          console.log('📤 Uploading doctor profile:', doctorSlug);
        }
      } else {
        // General/uncategorized upload - always use 'general' folder if no entity is selected
        uploadPromise = this.mediaService.saveGeneralImage(file, 'general');
        console.log('📤 Uploading to general media library');
      }

      // Upload file using MediaService and save metadata to Supabase
      uploadPromise
        .then(filePath => {
          console.log('✅ File uploaded successfully:', filePath);
          console.log('📤 Saving metadata to Supabase...');

          // Save metadata to Supabase with the uploaded path
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // Extract just the filename from the full path
            const pathParts = filePath.split('/');
            const filename = pathParts[pathParts.length - 1];
            // Get the directory path (everything except filename)
            const directoryPath = '/' + pathParts.slice(0, pathParts.length - 1).join('/').replace(/^\/+/, '');

            const mediaFile = {
              // Generate string ID for media_library (uses VARCHAR, not UUID)
              id: 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
              filename: filename,
              path: directoryPath + '/',
              full_path: filePath,
              type: file.type,
              size: file.size,
              data_url: e.target?.result as string,
              alt_text: ''
            };

            console.log('📤 Saving media file to Supabase:', {
              id: mediaFile.id,
              filename: mediaFile.filename,
              path: mediaFile.path,
              full_path: mediaFile.full_path,
              type: mediaFile.type,
              size: mediaFile.size
            });

            // Save to Supabase
            this.supabaseService.uploadMedia(mediaFile as any).subscribe({
              next: (created) => {
                if (created) {
                  console.log('✅ Metadata saved to Supabase');
                  console.log('🎉 Upload complete! File path:', filePath);
                  this.saveMessage = 'Media file uploaded successfully!';
                  this.loadMediaLibrary(); // Reload media library from Supabase

                  // If this upload was from the media picker modal, call the callback to update the entity
                  if (this.mediaPickerCallback) {
                    console.log('📞 Calling media picker callback with path:', filePath);
                    this.mediaPickerCallback(filePath);

                    // Auto-save the entity after updating the image path (keep editor open)
                    if (category === 'doctor' && this.selectedDoctor && this.editingDoctorId) {
                      console.log('💾 Auto-saving doctor with new profile image...');
                      this.saveDoctorSilently();
                    } else if (category === 'blog' && this.selectedBlog) {
                      console.log('💾 Auto-saving blog post with new featured image...');
                      this.saveBlog();
                    } else if (category === 'service' && this.selectedServiceData) {
                      console.log('💾 Auto-saving service with new image...');
                      this.saveServiceDataSilently();
                    }
                  }
                } else {
                  console.error('❌ Failed to save metadata to Supabase');
                  this.saveMessage = 'Error saving metadata to Supabase';
                }
                this.isLoading = false;
                setTimeout(() => this.saveMessage = '', 3000);
              },
              error: (err) => {
                console.error('❌ Error saving to Supabase:', err);
                this.saveMessage = 'Error: ' + (err.message || JSON.stringify(err));
                this.isLoading = false;
              }
            });
          };
          reader.readAsDataURL(file);
        })
        .catch(err => {
          console.error('❌ Error uploading file:', err);
          this.saveMessage = 'Error: ' + (err.message || 'Upload failed');
          this.isLoading = false;
        });
    }
  }

  deleteMediaFile(id: string): void {
    if (confirm('Are you sure you want to delete this media file from Supabase?')) {
      this.isLoading = true;
      this.supabaseService.deleteMedia(id).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ Media deleted from Supabase');
            this.saveMessage = 'Media file deleted successfully from Supabase!';
            this.loadMedia(); // Reload media from Supabase
          } else {
            console.error('❌ Failed to delete media');
            this.saveMessage = 'Error deleting media';
          }
          this.isLoading = false;
          setTimeout(() => this.saveMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Error deleting media:', err);
          this.saveMessage = 'Error: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  openMediaPicker(callback: (url: string) => void, context: 'doctor' | 'blog' | 'service' | 'general' = 'general'): void {
    this.showMediaPicker = true;
    this.mediaPickerCallback = callback;
    this.mediaPickerContext = context;
    this.loadMediaLibrary();
  }

  selectMediaFromPicker(media: MediaFile): void {
    if (this.mediaPickerCallback) {
      // Use fullPath (file path) instead of dataUrl (base64) for page content
      const imagePath = media.fullPath || media.path + media.filename;
      console.log('📷 Selected media from picker:', imagePath);
      this.mediaPickerCallback(imagePath);
    }
    this.closeMediaPicker();
  }

  closeMediaPicker(): void {
    this.showMediaPicker = false;
    this.mediaPickerCallback = null;
    this.mediaPickerContext = 'general';
    this.mediaPickerCaseIndex = null;
    this.mediaPickerCaseType = null;
  }

  openBlogImagePicker(): void {
    this.openMediaPicker((url: string) => {
      if (this.selectedBlog) {
        this.selectedBlog.featuredImage = url;
      }
    }, 'blog');
  }

  openProfileImagePicker(): void {
    // Clear case context for profile upload
    this.mediaPickerCaseIndex = null;
    this.mediaPickerCaseType = null;

    this.openMediaPicker((url: string) => {
      if (this.selectedDoctor) {
        this.selectedDoctor.profileImage = url;
      }
    }, 'doctor');
  }

  openBeforeImagePicker(index: number): void {
    // Store case context for upload
    this.mediaPickerCaseIndex = index;
    this.mediaPickerCaseType = 'before';

    this.openMediaPicker((url: string) => {
      if (this.selectedDoctor && this.selectedDoctor.beforeAfterGallery[index]) {
        this.selectedDoctor.beforeAfterGallery[index].before = url;
      }
    }, 'doctor');
  }

  openAfterImagePicker(index: number): void {
    // Store case context for upload
    this.mediaPickerCaseIndex = index;
    this.mediaPickerCaseType = 'after';

    this.openMediaPicker((url: string) => {
      if (this.selectedDoctor && this.selectedDoctor.beforeAfterGallery[index]) {
        this.selectedDoctor.beforeAfterGallery[index].after = url;
      }
    }, 'doctor');
  }

  openServiceCardImagePicker(): void {
    this.openMediaPicker((url: string) => {
      if (this.selectedServiceData) {
        this.selectedServiceData.cardImage = url;
      }
    }, 'service');
  }

  openServiceHeroImagePicker(): void {
    this.openMediaPicker((url: string) => {
      if (this.selectedServiceData) {
        this.selectedServiceData.heroBackgroundImage = url;
      }
    }, 'service');
  }

  openTeamHeroImagePicker(): void {
    this.openMediaPicker((url: string) => {
      this.pageContent.hero_image = url;
    });
  }

  openContactHeroImagePicker(): void {
    this.openMediaPicker((url: string) => {
      this.pageContent.hero_image = url;
    });
  }

  // For Him hero images picker - assigns to first available hero_image slot
  openForHimHeroImagesPicker(): void {
    this.openMediaPicker((url: string) => {
      // Find first empty slot and assign
      if (!this.pageContent.hero_image_1) {
        this.pageContent.hero_image_1 = url;
      } else if (!this.pageContent.hero_image_2) {
        this.pageContent.hero_image_2 = url;
      } else if (!this.pageContent.hero_image_3) {
        this.pageContent.hero_image_3 = url;
      } else if (!this.pageContent.hero_image_4) {
        this.pageContent.hero_image_4 = url;
      } else {
        // All slots full - overwrite slot 1
        this.pageContent.hero_image_1 = url;
      }
    });
  }

  // For Him Services CTA background image picker
  openForHimServicesCTABgPicker(): void {
    this.openMediaPicker((url: string) => {
      this.pageContent.services_cta_bg_image = url;
    });
  }

  // Universal image picker - works for any pageContent field
  openImagePicker(fieldName: string): void {
    this.openMediaPicker((url: string) => {
      this.pageContent[fieldName] = url;
    });
  }

  // Array image picker - for approach_grid, expertise_grid, branches, etc.
  openArrayImagePicker(arrayName: string, index: number, fieldName: string = 'image'): void {
    this.openMediaPicker((url: string) => {
      if (this.pageContent[arrayName] && this.pageContent[arrayName][index]) {
        this.pageContent[arrayName][index][fieldName] = url;
      }
    });
  }

  // Remove specific For Him hero image
  removeForHimHeroImage(slot: number): void {
    const fieldName = `hero_image_${slot}`;
    this.pageContent[fieldName] = null;
  }

  // Landing Page Media Pickers
  openLandingLogoImagePicker(): void {
    this.openMediaPicker((url: string) => {
      this.pageContent.logo_url = url;
    }, 'general');
  }

  openLandingForHerBgImagePicker(): void {
    this.openMediaPicker((url: string) => {
      this.pageContent.forher_bg_image = url;
    }, 'general');
  }

  openLandingForHimBgImagePicker(): void {
    this.openMediaPicker((url: string) => {
      this.pageContent.forhim_bg_image = url;
    }, 'general');
  }

  getFilteredMedia(): MediaFile[] {
    let filtered = [...this.mediaFiles];

    if (this.mediaFilterPath) {
      // Filter by category name (doctors, blog, services, pages, general)
      const categoryPath = `/assets/img/media-library/${this.mediaFilterPath}/`;
      filtered = filtered.filter(m => m.path.includes(categoryPath));
    }

    if (this.mediaSearchQuery) {
      const query = this.mediaSearchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.filename.toLowerCase().includes(query) ||
        (m.altText && m.altText.toLowerCase().includes(query))
      );
    }

    return filtered;
  }

  /**
   * Get the correct image URL for display
   * Media-library images are served from upload server (port 3001)
   * Other images are served from Angular dev server (port 4200)
   */
  getMediaImageUrl(media: MediaFile): string {
    if (media.fullPath && media.fullPath.includes('/media-library/')) {
      return `${environment.mediaBaseUrl}${media.fullPath}`;
    }
    return media.fullPath;
  }

  /**
   * Get the correct image URL for any image path
   * Media-library images are served from upload server (port 3001)
   * Other images are served from Angular dev server (port 4200)
   */
  getImageUrl(imagePath: string): string {
    if (imagePath && imagePath.includes('/media-library/')) {
      return `${environment.mediaBaseUrl}${imagePath}`;
    }
    return imagePath;
  }

  getAvailablePaths(): Observable<string[]> {
    return this.mediaLibraryService.getAvailablePaths();
  }

  // Helper methods to avoid ICU message errors in templates
  getBranchLabel(branch: any, index: number): string {
    return branch?.branch_name || `Branch ${index + 1}`;
  }

  getLabel(value: string, index: number, prefix: string): string {
    return value || `${prefix} ${index + 1}`;
  }

  // Bookings methods
  viewBookingDetails(booking: Booking): void {
    this.selectedBooking = booking;
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedBooking = null;
  }

  updateBookingStatus(booking: Booking): void {
    this.bookingsService.updateBookingStatus(booking.id, booking.status).subscribe({
      next: (updatedBooking) => {
        console.log('✅ Booking status updated:', updatedBooking);
        // Update the booking in the list
        const index = this.bookings.findIndex(b => b.id === booking.id);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
        }
        this.saveMessage = 'Booking status updated successfully!';
        setTimeout(() => this.saveMessage = null, 3000);
      },
      error: (err) => {
        console.error('❌ Error updating booking status:', err);
        alert('Failed to update booking status. Please try again.');
        // Reload bookings to revert the UI change
        this.loadBookings();
      }
    });
  }

  exportBookingsToCSV(): void {
    if (this.bookings.length === 0) {
      alert('No bookings to export');
      return;
    }

    // CSV headers
    const headers = [
      'Booking Number',
      'Name',
      'Email',
      'Phone',
      'Birthday',
      'Branch',
      'Doctor',
      'Treatment',
      'Message',
      'Source',
      'Status',
      'Total Amount',
      'Created At'
    ];

    // CSV rows
    const rows = this.bookings.map(booking => [
      booking.booking_number || '',
      booking.name || '',
      booking.email || '',
      booking.phone || '',
      booking.birthday || '',
      booking.branch || '',
      booking.doctor || '',
      booking.treatment || '',
      booking.message || '',
      booking.source || '',
      booking.status || '',
      booking.total_amount?.toString() || '',
      booking.created_at || ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}

