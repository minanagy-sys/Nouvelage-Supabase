import { Component, ViewEncapsulation, AfterViewInit, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { CartService } from '../../shared/services/cart.service';
import { SERVICES_DATA, OFFERS, DOCS, SVC_DOCTORS, Service, Offer, Doctor } from './services.data';
import { CasesService, BeforeAfterCase } from './cases.service';
import { DoctorsService } from '../../admin/services/doctors.service';
import { DemoModeService } from '../../admin/services/demo-mode.service';
import { ServicesService, Service as BackendService } from '../../admin/services/services.service';
import { ContentService } from '../../shared/services/content.service';
import { BookingsService } from '../../admin/services/bookings.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CartFlyoutComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  // SSR: lifecycle hooks also run on the server, where DOM/storage/timers don't exist.
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Data
  services = SERVICES_DATA;
  allServices: any[] = []; // Store all services for filtering
  offers = OFFERS;
  doctors = DOCS;
  serviceDoctors = SVC_DOCTORS;
  pageContent: any = null;
  parentServices: any[] = []; // Parent service categories for filtering
  heroSlides: any[] = [];

  // Current state
  currentOfferIndex = 0;
  currentSlideIndex = 0;
  selectedCategory = 'all';
  serviceModalOpen = false;
  doctorModalOpen = false;
  offerModalOpen = false;
  currentService: Service | null = null;
  currentDoctor: Doctor | null = null;
  currentOffer: Offer | null = null;
  currentServiceCases: BeforeAfterCase[] = [];
  currentServiceDoctors: any[] = []; // Doctors for the current service
  allDoctorsCache: any[] = []; // Cache all doctors from Supabase on init

  // Timers
  private offerInterval: any;
  private heroSliderInterval: any;

  constructor(
    private router: Router,
    private casesService: CasesService,
    private cartService: CartService,
    private doctorsService: DoctorsService,
    private demoModeService: DemoModeService,
    private servicesService: ServicesService,
    private supabaseService: ContentService,
    private bookingsService: BookingsService
  ) {}

  // Note: Router is already injected above, no need to re-inject

  ngOnInit() {
    // Load services-page content directly from Supabase
    this.loadPageContentFromSupabase();

    // Load parent services from Supabase
    this.loadParentServices();

    // Load all doctors once on init (cache for fast modal opening)
    this.loadAllDoctorsCache();

    // Load services from backend (ServicesService) instead of hardcoded data
    this.loadServicesFromBackend();

    // Load hero slides from backend
    this.loadHeroSlides();
  }

  loadPageContentFromSupabase() {
    this.supabaseService.getPageContent('services-page').subscribe(content => {
      if (!content) {
        console.warn('⚠️ No page content found in the database, using default');
        this.pageContent = this.demoModeService.getDemoPageContent('services-page');
      } else {
        this.pageContent = content;
        console.log('✅ Loaded services-page content from the database');
      }
    });
  }

  loadParentServices() {
    // Load parent service categories from the API
    this.supabaseService.getServiceCategories().subscribe({
      next: (rows) => {
        // Extract unique categories from services
        const categories = new Set<string>();
        rows.forEach((service: any) => {
          const cat = service.parent_service || service.category;
          if (cat) categories.add(cat);
        });

        // Create parent services array
        this.parentServices = Array.from(categories).map((name, index) => ({
          id: `cat_${index}`,
          name: name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          order: index
        }));

        console.log('✅ Loaded', this.parentServices.length, 'parent service categories from the database');
        // Sort by order
        this.parentServices.sort((a, b) => a.order - b.order);
      },
      error: (error) => {
        console.error('❌ Error loading parent services:', error);
        // Fallback to localStorage
        const saved = this.isBrowser ? localStorage.getItem('parentServices') : null;
        this.parentServices = saved ? JSON.parse(saved) : [];
        this.parentServices.sort((a, b) => a.order - b.order);
      }
    });
  }

  loadAllDoctorsCache() {
    // Load all doctors once on component init for fast access
    this.supabaseService.getAllDoctors().subscribe({
      next: (doctors: any[]) => {
        this.allDoctorsCache = doctors;
        console.log('✅ Cached', doctors.length, 'doctors for fast modal opening');
      },
      error: (err) => {
        console.error('❌ Error loading doctors cache:', err);
      }
    });
  }

  loadServicesFromBackend() {
    // Load services from Supabase
    this.supabaseService.getAllServices().subscribe({
      next: (data: any[]) => {
        console.log('✅ Loaded', data.length, 'services from Supabase');
        console.log('📋 Sample service:', data[0]);

        // Map Supabase services to frontend format
        const mappedServices = data.map(s => this.mapSupabaseServiceToFrontend(s));

        // Filter to only show services that are active AND show_in_grid is true
        this.allServices = mappedServices.filter(s => s.isActive && s.showInGrid);

        // Set initial services to all filtered services
        this.services = [...this.allServices];
        console.log('✅ Showing', this.services.length, 'active services in grid (filtered from', mappedServices.length, 'total)');
      },
      error: (err) => {
        console.error('❌ Error loading services from Supabase:', err);
        // Fallback to old hardcoded services
        this.allServices = SERVICES_DATA;
        this.services = [...this.allServices];
      }
    });
  }

  mapSupabaseServiceToFrontend(s: any): Service {
    // Map complete Supabase fields to frontend Service format
    // After migration, all fields including card_*, detail_*, meta_*, and arrays are available
    return {
      id: s.id,
      name: s.name,
      cat: s.parent_service || s.category || 'General',
      title: s.card_title || s.name,
      group: s.parent_service || s.category || 'General',
      cardRibbon: s.card_ribbon || (s.featured ? 'Featured' : ''),
      subtitle: s.detail_subtitle || s.subtitle || '',
      tagline: s.detail_tagline || s.subtitle || '',
      desc: s.card_description || s.description || '',
      duration: s.meta_duration || s.duration || '',
      downtime: s.meta_downtime || '',
      lasts: s.meta_lasts || '',
      sessions: s.meta_sessions || '',
      steps: (s.how_it_works_steps || s.procedure_steps || []).map((step: any) => ({
        title: step.title || step.name || '',
        sub: step.description || '',
        time: step.time || step.duration || ''
      })),
      timeline: (s.timeline || []).map((t: any) => ({
        time: `Step ${t.step || ''}`,
        label: t.title || '',
        desc: t.description || ''
      })),
      results: (s.what_you_achieve || s.benefits || []).map((benefit: any) => ({
        title: benefit.title || benefit.name || '',
        sub: benefit.subtitle || benefit.description || ''
      })),
      products: (s.products_used || []).map((p: any) => ({
        logo: p.image || '',
        name: p.name || '',
        sub: p.description || ''
      })),
      priceFrom: s.show_price === false
        ? 'Contact for Price'
        : (s.card_price || (s.price ? `${s.price} ${s.price_unit || 'EGP'}` : 'Contact for pricing')),
      price: parseFloat((s.card_price || s.price || '0').toString().replace(/[^0-9.]/g, '')) || 0,
      images: (s.card_image || s.featured_image) ? [{ src: s.card_image || s.featured_image, type: 'image' }] : [],
      beforeAfter: (s.gallery || []).map((g: any) => ({
        before: g.before || g.before_image || '',
        after: g.after || g.after_image || ''
      })),
      specialist_doctor_ids: s.specialist_doctor_ids || [], // Preserve for fast doctor loading
      isActive: s.is_active !== false, // Default to true if not specified
      showInGrid: s.show_in_grid !== false, // Default to true if not specified
      showPrice: s.show_price !== false // Default to true if not specified
    } as Service;
  }

  mapBackendServiceToFrontend(bs: BackendService): Service {
    // Map the new backend Service structure to the existing frontend Service structure
    return {
      id: bs.id,
      name: bs.name,
      cat: bs.parentService, // Category
      title: bs.cardTitle || bs.name,
      group: bs.parentService, // Map parentService to group (category)
      cardRibbon: bs.cardRibbon, // Ribbon text like "Non-Surgical", "Most Popular", etc.
      subtitle: bs.detailSubtitle || '',
      tagline: bs.detailTagline || '',
      desc: bs.cardDescription || '',
      duration: bs.metaDuration || '',
      downtime: bs.metaDowntime || '',
      lasts: bs.metaLasts || '',
      sessions: bs.metaSessions || '',
      steps: bs.howItWorksSteps.map(step => ({
        title: step.title,
        sub: step.description,
        time: step.time || ''
      })),
      timeline: bs.timeline.map(t => ({
        time: `Step ${t.step}`,
        label: t.title,
        desc: t.description
      })),
      results: bs.whatYouAchieve.map(benefit => ({
        title: benefit.title,
        sub: benefit.subtitle
      })),
      products: bs.productsUsed.map(p => ({
        logo: p.image || '',
        name: p.name,
        sub: ''
      })),
      priceFrom: bs.cardPrice || bs.priceDetails || 'Contact for pricing',
      price: parseFloat(bs.cardPrice.replace(/[^0-9.]/g, '')) || 0,
      images: bs.cardImage ? [{ src: bs.cardImage, type: 'image' }] : [],
      beforeAfter: bs.gallery.map(g => ({
        before: g.before,
        after: g.after
      }))
    } as Service;
  }

  loadHeroSlides(): void {
    // Load bundles from Supabase for hero slider banner display
    this.supabaseService.getAllBundles().subscribe({
      next: (bundles: any[]) => {
        console.log('✅ Loaded', bundles.length, 'bundles from Supabase for hero slider');

        this.heroSlides = bundles
          .filter((b: any) => b.show_in_slider && b.is_active !== false)
          .sort((a: any, b: any) => (a.slider_order || 0) - (b.slider_order || 0))
          .map((b: any) => ({
            id: b.id,
            backgroundImage: b.slider_bg_image || b.cover_image,
            backgroundColor: b.slider_bg_color || 'bg-espresso',
            tag: b.slider_tag,
            title: b.slider_title || b.title,
            subtitle: b.slider_subtitle || b.subtitle,
            ctaText: b.slider_cta_text || 'Learn More →',
            order: b.slider_order || 0,
            bundleId: b.id,
            parentBundleId: b.parent_bundle_id
          }));

        console.log('🎨 Hero slides loaded:', this.heroSlides.length);
      },
      error: (err) => {
        console.error('❌ Error loading bundles for hero slider:', err);
        // Fallback to localStorage
        const bundlesData = this.isBrowser ? localStorage.getItem('bundles') : null;
        const bundles = bundlesData ? JSON.parse(bundlesData) : [];
        this.heroSlides = bundles
          .filter((b: any) => b.showInSlider && b.isActive)
          .sort((a: any, b: any) => (a.sliderOrder || 0) - (b.sliderOrder || 0))
          .map((b: any) => ({
            id: b.id,
            backgroundImage: b.sliderBgImage,
            backgroundColor: b.sliderBgColor || 'bg-espresso',
            tag: b.sliderTag,
            title: b.sliderTitle,
            subtitle: b.sliderSubtitle,
            ctaText: b.sliderCtaText || 'Learn More →',
            order: b.sliderOrder || 0,
            bundleId: b.id,
            parentBundleId: b.parentBundleId
          }));
      }
    });
  }

  onSlideClick(slide: any): void {
    // Navigate to bundles page when clicking a hero slider banner
    if (slide && slide.bundleId) {
      this.router.navigate(['/bundles'], {
        queryParams: { bundle: slide.bundleId },
        fragment: 'bundle-' + slide.bundleId
      });
    } else {
      // Fallback - just go to bundles page
      this.router.navigate(['/bundles']);
    }
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    this.initHeroSlider();
    this.initOfferSlider();
    this.initModals();
    this.initContactForm();
  }

  ngOnDestroy() {
    if (!this.isBrowser) return;
    if (this.offerInterval) {
      clearInterval(this.offerInterval);
    }
    if (this.heroSliderInterval) {
      clearInterval(this.heroSliderInterval);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  // Hero Slider
  initHeroSlider() {
    // Initialize dots
    this.updateHeroDots();

    // Start auto-rotation
    this.heroSliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    if (!this.pageContent?.hero_slides) return;
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    slides[this.currentSlideIndex].classList.remove('on');
    this.currentSlideIndex = (this.currentSlideIndex + 1) % slides.length;
    slides[this.currentSlideIndex].classList.add('on');

    this.updateHeroDots();
  }

  prevSlide() {
    if (!this.pageContent?.hero_slides) return;
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    slides[this.currentSlideIndex].classList.remove('on');
    this.currentSlideIndex = (this.currentSlideIndex - 1 + slides.length) % slides.length;
    slides[this.currentSlideIndex].classList.add('on');

    this.updateHeroDots();
  }

  goToSlide(index: number) {
    if (!this.pageContent?.hero_slides) return;
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    slides[this.currentSlideIndex].classList.remove('on');
    this.currentSlideIndex = index;
    slides[this.currentSlideIndex].classList.add('on');

    this.updateHeroDots();
  }

  updateHeroDots() {
    const dots = document.querySelectorAll('.hero-dots button');
    dots.forEach((dot, i) => {
      if (i === this.currentSlideIndex) {
        dot.classList.add('on');
      } else {
        dot.classList.remove('on');
      }
    });
  }

  // Offer Slider
  initOfferSlider() {
    // Initialize dots
    this.updateOfferDots();

    // Start auto-rotation
    this.offerInterval = setInterval(() => {
      this.nextOffer();
    }, 5000);
  }

  nextOffer() {
    const slides = document.querySelectorAll('.offer-slide');
    if (slides.length === 0) return;

    slides[this.currentOfferIndex].classList.remove('on');
    this.currentOfferIndex = (this.currentOfferIndex + 1) % slides.length;
    slides[this.currentOfferIndex].classList.add('on');

    this.updateOfferDots();
  }

  prevOffer() {
    const slides = document.querySelectorAll('.offer-slide');
    if (slides.length === 0) return;

    slides[this.currentOfferIndex].classList.remove('on');
    this.currentOfferIndex = (this.currentOfferIndex - 1 + slides.length) % slides.length;
    slides[this.currentOfferIndex].classList.add('on');

    this.updateOfferDots();
  }

  goToOffer(index: number) {
    const slides = document.querySelectorAll('.offer-slide');
    if (slides.length === 0) return;

    slides[this.currentOfferIndex].classList.remove('on');
    this.currentOfferIndex = index;
    slides[this.currentOfferIndex].classList.add('on');

    this.updateOfferDots();
  }

  /**
   * Get the correct image URL for display
   * Media-library images are served from upload server (port 3001)
   * Other images are served from Angular dev server (port 4200)
   */
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.includes('/media-library/')) {
      return `${environment.mediaBaseUrl}${imagePath}`;
    }
    return imagePath;
  }

  updateOfferDots() {
    const dots = document.querySelectorAll('.offers-dots button');
    dots.forEach((dot, i) => {
      if (i === this.currentOfferIndex) {
        dot.classList.add('on');
      } else {
        dot.classList.remove('on');
      }
    });
  }

  // Filter
  filterServices(category: string) {
    this.selectedCategory = category;

    // Filter services using Angular data binding
    if (category === 'all') {
      this.services = [...this.allServices];
    } else {
      this.services = this.allServices.filter(s => s.group === category);
    }
  }

  // Modals
  initModals() {
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.doctorModalOpen) {
          this.closeDoctor();
        } else if (this.serviceModalOpen) {
          this.closeService();
        } else if (this.offerModalOpen) {
          this.closeOffer();
        }
      }
    });
  }

  openService(serviceId: string) {
    const service = this.services.find(s => s.id === serviceId);
    if (!service) return;

    this.currentService = service;

    // Load doctors for this service from cached data (FAST - no Supabase call)
    console.log('⚡ Opening service:', service.id, service.title);

    // Get the full service data from allServices (which has specialist_doctor_ids)
    const fullService = this.allServices.find(s => s.id === service.id);

    if (fullService && (fullService as any).specialist_doctor_ids && (fullService as any).specialist_doctor_ids.length > 0) {
      // Use cached doctors (instant - no network call!)
      this.currentServiceDoctors = this.allDoctorsCache.filter(doctor =>
        (fullService as any).specialist_doctor_ids.includes(doctor.id)
      );
      console.log('⚡ Loaded', this.currentServiceDoctors.length, 'doctors from cache (instant)');
    } else {
      // Fallback to old SVC_DOCTORS mapping
      const serviceDocs = this.serviceDoctors[service.id] || [];
      this.currentServiceDoctors = serviceDocs
        .map(docId => this.doctors[docId])
        .filter(doc => doc);
      console.log('⚠️ Using fallback doctors:', this.currentServiceDoctors.length);
    }

    // Load doctor cases and open modal immediately (no async wait!)
    this.loadDoctorCases();
  }

  // Load before/after cases from specialist doctors
  loadDoctorCases() {
    if (!this.currentService) return;

    // Load real before/after cases from the selected doctors
    this.currentServiceCases = [];
    if (this.currentServiceDoctors && this.currentServiceDoctors.length > 0) {
      // Combine all before/after cases from all specialist doctors
      this.currentServiceDoctors.forEach(doctor => {
        console.log('🔍 Checking doctor for before/after:', doctor.name, 'Gallery:', doctor.before_after_gallery);
        if (doctor.before_after_gallery && doctor.before_after_gallery.length > 0) {
          // Map doctor's gallery to BeforeAfterCase format
          const doctorCases = doctor.before_after_gallery
            .filter((ba: any) => ba.before && ba.after) // Only include valid cases
            .map((ba: any) => ({
              before: ba.before,
              after: ba.after,
              caption: ba.description || ba.procedure || 'Treatment result',
              category: ba.category || 'general',
              desc: ba.description
            }));
          console.log('✅ Added', doctorCases.length, 'cases from', doctor.name);
          this.currentServiceCases.push(...doctorCases);
        } else {
          console.log('⚠️ No before_after_gallery for', doctor.name);
        }
      });
    }
    console.log('📸 Total before/after cases:', this.currentServiceCases.length);

    // Fallback: Load from old method if no cases from doctors
    if (this.currentServiceCases.length === 0) {
      const serviceDocs = this.serviceDoctors[this.currentService.id] || [];
      if (serviceDocs.length > 0) {
        this.casesService.getCasesForService(serviceDocs).subscribe(cases => {
          this.currentServiceCases = cases;
          this.renderServiceModal(this.currentService!);
        });
        return; // Exit early, will render in subscribe
      }
    }

    // Render modal immediately if we have cases or no async loading needed
    this.renderServiceModal(this.currentService);

    const svcNav = document.getElementById('svcNav');
    const svcModalBg = document.getElementById('svcModalBg');
    const svcModal = document.getElementById('svcModal');
    const svcBody = document.getElementById('svcModalBody');

    if (svcNav && this.currentService) svcNav.textContent = this.currentService.title;
    if (svcModalBg) svcModalBg.classList.add('open');
    if (svcModal) svcModal.classList.add('open');

    document.body.classList.add('no-scroll');
    this.serviceModalOpen = true;

    setTimeout(() => {
      if (svcBody) svcBody.scrollTop = 0;
    }, 50);
  }

  renderServiceModal(service: Service) {
    const svcBody = document.getElementById('svcModalBody');
    if (!svcBody) return;

    // Build hero slides
    let heroSlides = '';
    let heroDots = '';
    if (service.images && service.images.length) {
      heroSlides = service.images.map(img => {
        if (img.type === 'video') {
          return '<div class="svc-hero-video"><div class="svc-hero-video__icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div></div>';
        }
        return '<div class="svc-hero-slide" style="background-image:url(\'' + img.src + '\')"></div>';
      }).join('');
      heroDots = service.images.map((_, i) => '<span' + (i === 0 ? ' class="active"' : '') + '></span>').join('');
    }

    // Get doctors for this service - use currentServiceDoctors loaded in openService
    let docPairs: any[] = [];
    if (this.currentServiceDoctors && this.currentServiceDoctors.length > 0) {
      // Use the loaded doctors from backend
      docPairs = this.currentServiceDoctors.map(doc => ({
        k: doc.id || doc.slug,
        d: {
          img: doc.profile_image || doc.profileImage || doc.image || doc.img || '',
          name: doc.name,
          role: doc.specialization || doc.role,
          exp: doc.experience ? `${doc.experience}+ years experience` : (doc.exp || '')
        }
      }));
      console.log('🖼️ Doctor images for service modal:', docPairs.map(p => ({ name: p.d.name, img: p.d.img?.substring(0, 50) })));
    } else {
      // Fallback to old method
      const serviceDocs = this.serviceDoctors[service.id] || [];
      docPairs = serviceDocs.map(k => ({ k, d: this.doctors[k] })).filter(p => p.d);
    }

    // Build complete HTML string - matching original exactly
    let html = ''
      + '<div class="svc-hero">'
      +   '<span class="svc-hero__cat">' + service.group + '</span>'
      +   '<div class="svc-hero-track">' + heroSlides + '</div>'
      +   '<div class="svc-hero-dots">' + heroDots + '</div>'
      + '</div>'
      + '<div class="svc-title-section">'
      +   '<h2 class="svc-title">' + service.title + '</h2>'
      +   '<p class="svc-subtitle">' + service.subtitle + '</p>'
      +   '<p class="svc-tagline">' + service.tagline + '</p>'
      + '</div>'
      + '<div class="svc-meta-strip">'
      +   '<div class="svc-meta-item"><div class="svc-meta-item__icon">i</div><div class="svc-meta-item__label">Duration</div><div class="svc-meta-item__value">' + service.duration + '</div></div>'
      +   '<div class="svc-meta-item"><div class="svc-meta-item__icon">ii</div><div class="svc-meta-item__label">Downtime</div><div class="svc-meta-item__value">' + service.downtime + '</div></div>'
      +   '<div class="svc-meta-item"><div class="svc-meta-item__icon">iii</div><div class="svc-meta-item__label">Lasts</div><div class="svc-meta-item__value">' + service.lasts + '</div></div>'
      +   '<div class="svc-meta-item"><div class="svc-meta-item__icon">iv</div><div class="svc-meta-item__label">Sessions</div><div class="svc-meta-item__value">' + service.sessions + '</div></div>'
      + '</div>'
      + '<section class="svc-section">'
      +   '<div class="svc-section__num">01 — How</div>'
      +   '<h3 class="svc-section__title">How it <em>works</em></h3>'
      +   '<p class="about-text">' + service.desc + '</p>'
      +   '<div class="steps">'
      +     service.steps.map((st, i) => {
            const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v'];
            return '<div class="step">'
              + '<div class="step__num">' + (romanNumerals[i] || (i + 1)) + '</div>'
              + '<div class="step__text">'
              +   '<strong>' + st.title + '</strong>'
              +   '<span>' + st.sub + '</span>'
              + '</div>'
              + '<div class="step__time">' + st.time + '</div>'
              + '</div>';
          }).join('')
      +   '</div>'
      + '</section>'
      + '<section class="svc-section">'
      +   '<div class="svc-section__num">02 — Timeline</div>'
      +   '<h3 class="svc-section__title">When you will <em>see results</em></h3>'
      +   '<div class="timeline">'
      +     service.timeline.map(t =>
            '<div class="timeline-item">'
              + '<div class="timeline-item__time">' + t.time + '</div>'
              + '<div class="timeline-item__label">' + t.label + '</div>'
              + '<div class="timeline-item__desc">' + t.desc + '</div>'
            + '</div>'
          ).join('')
      +   '</div>'
      + '</section>'
      + '<section class="svc-section">'
      +   '<div class="svc-section__num">03 — Results</div>'
      +   '<h3 class="svc-section__title">What you will <em>achieve</em></h3>'
      +   '<div class="results-grid">'
      +     service.results.map(r =>
            '<div class="result-card">'
              + '<div class="result-card__icon">'
              +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">'
              +     '<path d="M5 13l4 4L19 7"/>'
              +   '</svg>'
              + '</div>'
              + '<div class="result-card__title">' + r.title + '</div>'
              + '<div class="result-card__desc">' + r.sub + '</div>'
            + '</div>'
          ).join('')
      +   '</div>'
      + '</section>'
      + '<section class="svc-section">'
      +   '<div class="svc-section__num">04 — Products</div>'
      +   '<h3 class="svc-section__title">Products <em>we use</em></h3>'
      +   '<div class="products-list">'
      +     service.products.map(p =>
            '<div class="product-tag">'
              + '<div class="product-tag__logo">' + p.logo + '</div>'
              + '<div class="product-tag__name">' + p.name + '<small>' + p.sub + '</small></div>'
            + '</div>'
          ).join('')
      +   '</div>'
      + '</section>'
      + (this.currentServiceCases && this.currentServiceCases.length ? (
          '<section class="svc-section">'
          +   '<div class="svc-section__num">05 — Gallery</div>'
          +   '<h3 class="svc-section__title">Before, <em>after</em></h3>'
          +   '<div class="ba-row">'
          +     this.currentServiceCases.map((ba: any, i: number) =>
                '<div class="ba-card" data-i="' + i + '">'
                  + '<div class="ba-card__before" style="background-image:url(\'' + ba.before + '\')"></div>'
                  + '<div class="ba-card__after" style="background-image:url(\'' + ba.after + '\')"></div>'
                  + '<div class="ba-card__labels"><span>Before</span><span>After</span></div>'
                  + '<div class="ba-card__divider"><div class="ba-card__handle">↔</div></div>'
                  + '<div class="ba-card__caption">' + (ba.caption || '') + '</div>'
                + '</div>'
              ).join('')
          +   '</div>'
          + '</section>'
        ) : '')
      + '<section class="svc-section">'
      +   '<div class="svc-section__num">06 — Specialist</div>'
      +   '<h3 class="svc-section__title">Your <em>specialist</em></h3>'
      +   docPairs.map((p, di) => {
            const d = p.d;
            const isClickable = p.k && d;
            return (di > 0 ? '<div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ash);margin:16px 0 8px">Also performed by</div>' : '')
              + '<div class="svc-doctor' + (isClickable ? ' is-clickable' : '') + '"' + (isClickable ? ' data-doc="' + p.k + '"' : '') + (di > 0 ? ' style="margin-top:10px"' : '') + '>'
              +   '<div class="svc-doctor__avatar" style="background-image:url(\'' + d.img + '\')"></div>'
              +   '<div class="svc-doctor__info">'
              +     '<div class="svc-doctor__name">' + d.name + '</div>'
              +     '<div class="svc-doctor__role">' + d.role + '</div>'
              +     '<div class="svc-doctor__exp">' + d.exp + '</div>'
              +   '</div>'
              +   (isClickable ? '<div class="svc-doctor__arrow">›</div>' : '')
              + '</div>';
          }).join('')
      + '</section>'
      + '<section class="svc-section">'
      +   '<div class="svc-price">'
      +     '<span class="svc-price__mark">N</span>'
      +     '<div class="svc-price__label">Investment</div>'
      +     '<div class="svc-price__amount"><span class="svc-price__num">' + service.priceFrom + '</span></div>'
      +     '<div class="svc-price__note">Final price confirmed after your consultation</div>'
      +   '</div>'
      + '</section>';

    svcBody.innerHTML = html;

    // Render CTA buttons
    this.renderServiceCTA(service);

    // Bind doctor click events
    const doctorCards = svcBody.querySelectorAll('.svc-doctor[data-doc]');
    console.log('🔗 Binding click events to', doctorCards.length, 'doctor cards');
    doctorCards.forEach(card => {
      card.addEventListener('click', () => {
        const docId = card.getAttribute('data-doc');
        console.log('👆 Doctor card clicked, ID:', docId);
        if (docId) this.openDoctor(docId);
      });
    });

    // Bind interactive elements after rendering with setTimeout
    setTimeout(() => {
      this.bindHeroSwiper();
      this.bindBeforeAfterSliders();
    }, 50);
  }

  renderServiceCTA(service: Service) {
    const svcCta = document.getElementById('svcCta');
    if (!svcCta) return;

    // Build WhatsApp message
    const waMsg = encodeURIComponent('Hello 🌸 I\'m coming from the Nouvelage services page about: *' + service.title + '*');
    const waUrl = 'https://wa.me/201000312528?text=' + waMsg;

    let ctaHtml = '';

    // Check if showPrice is false - show only "Book via WhatsApp" button
    if (service.showPrice === false) {
      // Show only WhatsApp booking button (no Add to Cart, no circle)
      ctaHtml = ''
        + '<a href="' + waUrl + '" target="_blank" rel="noopener" class="btn-cart" style="background: #25D366; width: 100%; justify-content: center;" aria-label="Book via WhatsApp" title="Book via WhatsApp">'
        +   '<svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; margin-right: 8px;">'
        +     '<path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.886 2.909 4.371 2.909 7.026-.004 5.444-4.46 9.879-9.935 9.879M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/>'
        +   '</svg>'
        +   'Book via WhatsApp'
        + '</a>';
    } else {
      // Show normal Add to Cart + WhatsApp circle
      ctaHtml = ''
        + '<button type="button" class="btn-cart">'
        +   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        +     '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>'
        +     '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'
        +   '</svg>'
        +   'Add to Cart'
        + '</button>'
        + '<a href="' + waUrl + '" target="_blank" rel="noopener" class="btn-wa" aria-label="Send via WhatsApp" title="Send via WhatsApp">'
        +   '<svg viewBox="0 0 24 24" fill="currentColor">'
        +     '<path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.886 2.909 4.371 2.909 7.026-.004 5.444-4.46 9.879-9.935 9.879M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/>'
        +   '</svg>'
        + '</a>';
    }

    svcCta.innerHTML = ctaHtml;

    // Bind Add-to-Cart ONLY when the price is shown. When showPrice is false the
    // CTA is a plain WhatsApp link (which happens to share the .btn-cart class),
    // so it must just open WhatsApp — no add-to-cart, no cart flyout.
    if (service.showPrice !== false) {
      const cartBtn = svcCta.querySelector('.btn-cart');
      if (cartBtn) {
        cartBtn.addEventListener('click', () => {
          this.addToCart(service);
          cartBtn.classList.add('added');
          cartBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Added to Cart';
        });
      }
    }
  }

  // Cart management
  private addToCart(service: Service) {
    // Extract price from priceFrom string (e.g., "From EGP 4,500" -> 4500)
    const priceMatch = service.priceFrom.match(/[\d,]+/);
    const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0;

    // Use the service's CARD image (same one shown on the card); fall back to
    // a before/after image, then a generic placeholder.
    const cardImg = service.images && service.images.length > 0 ? service.images[0].src : '';
    const image = cardImg
      ? this.getImageUrl(cardImg)
      : (service.beforeAfter && service.beforeAfter.length > 0
          ? service.beforeAfter[0].after
          : 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=200&h=200&fit=crop&q=80');

    this.cartService.addToCart({
      id: service.id,
      name: service.name || service.title,
      price: service.price || price,
      type: 'service',
      quantity: 1,
      branch: 'forher',
      image: image
    });
  }

  bindHeroSwiper() {
    const track = document.querySelector('.svc-hero-track') as HTMLElement;
    if (!track) return;

    const dots = document.querySelectorAll('.svc-hero-dots span');
    let idx = 0;
    const total = track.children.length;

    const setIdx = (i: number) => {
      idx = Math.max(0, Math.min(total - 1, i));
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle('active', j === idx));
    };

    const stage = track.parentElement;
    if (!stage) return;

    let startX = 0, currentX = 0, dragging = false;

    stage.addEventListener('touchstart', (e: any) => {
      startX = e.touches[0].clientX;
      currentX = startX;
      dragging = true;
    }, { passive: true });

    stage.addEventListener('touchmove', (e: any) => {
      if (dragging) currentX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      const diff = currentX - startX;
      if (Math.abs(diff) > 40) {
        const dir = diff > 0 ? -1 : 1;
        setIdx(idx + dir);
      }
      currentX = startX;
    });

    stage.addEventListener('click', () => {
      setIdx((idx + 1) % total);
    });
  }

  bindBeforeAfterSliders() {
    const baCards = document.querySelectorAll('.ba-card');
    baCards.forEach(ba => {
      const after = ba.querySelector('.ba-card__after') as HTMLElement;
      const divider = ba.querySelector('.ba-card__divider') as HTMLElement;
      if (!after || !divider) return;

      let dragging = false;

      const moveTo = (x: number) => {
        const rect = ba.getBoundingClientRect();
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        after.style.clipPath = `inset(0 0 0 ${pct}%)`;
        divider.style.left = `${pct}%`;
      };

      ba.addEventListener('mousedown', (e: any) => {
        dragging = true;
        moveTo(e.clientX);
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e: any) => {
        if (dragging) moveTo(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        dragging = false;
      });

      ba.addEventListener('touchstart', (e: any) => {
        dragging = true;
        moveTo(e.touches[0].clientX);
      }, { passive: true });

      ba.addEventListener('touchmove', (e: any) => {
        if (dragging) {
          moveTo(e.touches[0].clientX);
          e.preventDefault();
        }
      }, { passive: false });

      ba.addEventListener('touchend', () => {
        dragging = false;
      });
    });
  }

  closeService() {
    const svcModal = document.getElementById('svcModal');
    const svcModalBg = document.getElementById('svcModalBg');

    if (svcModal) svcModal.classList.remove('open');
    if (svcModalBg) svcModalBg.classList.remove('open');

    document.body.classList.remove('no-scroll');
    this.serviceModalOpen = false;
    this.currentService = null;
  }

  openDoctor(doctorId: string) {
    console.log('🚀 openDoctor called with ID:', doctorId);

    // First try to get doctor from currentServiceDoctors (already loaded from Supabase)
    let supabaseDoctor = this.currentServiceDoctors?.find((d: any) => d.id === doctorId);
    console.log('🔍 Doctor from currentServiceDoctors:', supabaseDoctor);

    // If not found, try to get from DoctorsService
    if (!supabaseDoctor) {
      supabaseDoctor = this.doctorsService.getDoctorById(doctorId);
      console.log('🔍 Doctor from service:', supabaseDoctor);
    }

    // Map Supabase doctor to modal format
    const doctor = supabaseDoctor ? {
      img: supabaseDoctor.profileImage || supabaseDoctor.profile_image || supabaseDoctor.image || '',
      name: supabaseDoctor.name,
      role: supabaseDoctor.specialization,
      exp: supabaseDoctor.experience ? `${supabaseDoctor.experience}+ years experience` : '',
      bio: supabaseDoctor.bio,
      sections: supabaseDoctor.qualifications ? [{
        t: 'Qualifications',
        items: supabaseDoctor.qualifications
      }] : [],
      languages: supabaseDoctor.languages || [],
      instagram: supabaseDoctor.instagram || ''
    } : this.doctors[doctorId];

    console.log('👤 Doctor image for modal:', doctor?.img);
    console.log('👤 Supabase doctor fields:', supabaseDoctor ? Object.keys(supabaseDoctor) : 'none');

    if (!doctor) {
      console.error('❌ Doctor not found:', doctorId);
      return;
    }

    console.log('✅ Opening doctor modal for:', doctor.name);

    this.currentDoctor = doctor;
    this.renderDoctorModal(doctor, doctorId);

    const docModalBg = document.getElementById('docModalBg');
    const docModal = document.getElementById('docModal');
    const docBody = document.getElementById('docModalBody');

    if (docModalBg) docModalBg.classList.add('open');
    if (docModal) docModal.classList.add('open');

    document.body.classList.add('no-scroll');
    this.doctorModalOpen = true;

    setTimeout(() => {
      if (docBody) docBody.scrollTop = 0;
    }, 50);
  }

  renderDoctorModal(doctor: Doctor, doctorId: string) {
    const docBody = document.getElementById('docModalBody');
    if (!docBody) return;

    // Get services for this doctor - try backend first, fallback to old data
    const backendDoctor = this.doctorsService.getDoctorById(doctorId);
    let svcList: Service[] = [];

    if (backendDoctor && backendDoctor.services && backendDoctor.services.length > 0) {
      // Use backend services data - doctor has services assigned
      svcList = this.services.filter(s => backendDoctor.services!.includes(s.id));
    } else {
      // Fallback to old serviceDoctors mapping
      svcList = this.services.filter(s =>
        (this.serviceDoctors[s.id] || []).includes(doctorId)
      );
    }

    // Extract case count from exp string (e.g., "500+ successful cases")
    const caseCountMatch = doctor.exp ? doctor.exp.match(/(\d+)/) : null;
    const caseCount = caseCountMatch ? caseCountMatch[1] : '—';

    // Extract years from yrs or exp field
    const docWithExtras = doctor as any;
    const yrsStr = docWithExtras.yrs || doctor.exp || '';
    const yrsMatch = yrsStr.match(/(\d+)/);
    const years = yrsMatch ? yrsMatch[1] : '';

    // Get doctor slug from backend doctor data
    const doctorSlug = backendDoctor?.slug || doctorId;

    // Build HTML - matching original renderDoctorDetail exactly
    let html = ''
      + '<div class="doc-hero">'
      +   '<div class="doc-hero__avatar" style="background-image:url(\'' + doctor.img + '\')"></div>'
      +   '<h2 class="doc-hero__name">' + doctor.name + '</h2>'
      +   '<p class="doc-hero__role">' + (doctor.role || '') + '</p>'
      +   (docWithExtras.instagram ? '<a class="doc-hero__ig" href="https://instagram.com/' + docWithExtras.instagram.replace(/^@/, '') + '" target="_blank" rel="noopener">' + docWithExtras.instagram + '</a>' : '')
      +   (docWithExtras.instagram && doctorSlug ? '<br>' : '')
      +   (doctorSlug ? '<a class="doc-hero__profile-btn" href="/doctor/' + doctorSlug + '">View Full Profile →</a>' : '')
      + '</div>'
      + '<div class="doc-stats">'
      +   '<div class="doc-stat">'
      +     '<div class="doc-stat__num">' + (years || '—') + (years ? '<em>+</em>' : '') + '</div>'
      +     '<div class="doc-stat__label">Years exp</div>'
      +   '</div>'
      +   '<div class="doc-stat">'
      +     '<div class="doc-stat__num">' + (caseCount || '—') + (caseCount && caseCount !== '—' ? '<em>+</em>' : '') + '</div>'
      +     '<div class="doc-stat__label">Cases</div>'
      +   '</div>'
      +   '<div class="doc-stat">'
      +     '<div class="doc-stat__num">' + svcList.length + '</div>'
      +     '<div class="doc-stat__label">Services</div>'
      +   '</div>'
      + '</div>';

    // Add bio section if doctor has bio
    if (docWithExtras.bio) {
      html += '<div class="doc-bio">'
        + '<div class="doc-bio__title">About</div>'
        + '<p class="doc-bio__text">' + docWithExtras.bio + '</p>'
        + '</div>';
    }

    // Add credentials sections if available
    if (docWithExtras.sections && docWithExtras.sections.length) {
      docWithExtras.sections.forEach((sec: any) => {
        if (sec.items && sec.items.length) {
          html += '<div class="doc-credentials">'
            + '<div class="doc-bio__title">' + sec.t + '</div>'
            + '<div class="cred-list">';

          sec.items.forEach((it: string, i: number) => {
            const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
            const parts = it.split(/\s+[—–·•]\s+|:\s+/);
            const credText = parts.length > 1
              ? '<strong>' + parts[0] + '</strong>' + parts.slice(1).join(' · ')
              : '<strong>' + it + '</strong>';

            html += '<div class="cred-item">'
              + '<div class="cred-item__icon">' + (romanNumerals[i] || String(i + 1)) + '</div>'
              + '<div class="cred-item__text">' + credText + '</div>'
              + '</div>';
          });

          html += '</div></div>';
        }
      });
    }

    // Add languages section if available
    if (docWithExtras.languages && docWithExtras.languages.length) {
      html += '<div class="doc-bio" style="padding-top:0">'
        + '<div class="doc-bio__title">Languages</div>'
        + '<p class="doc-bio__text">' + docWithExtras.languages.join(' · ') + '</p>'
        + '</div>';
    }

    // Add services section if doctor has services
    if (svcList.length) {
      html += '<div class="doc-services">'
        + '<div class="doc-bio__title">Services</div>'
        + '<p class="doc-services__sub">Performed by ' + doctor.name + '</p>'
        + '<div class="doc-services-grid">';

      svcList.forEach(s => {
        const svcImg = (s.images && s.images.length && s.images[0].src) ? s.images[0].src : '';
        html += '<div class="doc-svc-mini" data-svc="' + s.id + '">'
          + '<div class="doc-svc-mini__img" style="background-image:url(\'' + svcImg + '\')"></div>'
          + '<div class="doc-svc-mini__body">'
          +   '<div class="doc-svc-mini__title">' + s.title + '</div>'
          +   '<div class="doc-svc-mini__price">' + s.priceFrom + '</div>'
          + '</div>'
          + '</div>';
      });

      html += '</div></div>';
    }

    // Add WhatsApp CTA button
    const phoneNumber = '201000312528';
    const waMessage = encodeURIComponent('Booking with ' + doctor.name);
    html += '<div class="doc-cta-wrap">'
      + '<a class="doc-cta__book" href="https://wa.me/' + phoneNumber + '?text=' + waMessage + '" target="_blank" rel="noopener">'
      +   '<svg viewBox="0 0 24 24"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345M12.05 21.785h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.886 2.909 4.371 2.909 7.026-.004 5.444-4.46 9.879-9.935 9.879M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/></svg>'
      +   'Book with ' + doctor.name
      + '</a>'
      + '</div>';

    docBody.innerHTML = html;

    // Bind service mini card clicks
    const svcMiniCards = docBody.querySelectorAll('.doc-svc-mini[data-svc]');
    svcMiniCards.forEach(card => {
      card.addEventListener('click', () => {
        const svcId = card.getAttribute('data-svc');
        if (svcId) {
          this.closeDoctor();
          setTimeout(() => {
            this.openService(svcId);
          }, 300);
        }
      });
    });
  }

  closeDoctor() {
    const docModal = document.getElementById('docModal');
    const docModalBg = document.getElementById('docModalBg');

    if (docModal) docModal.classList.remove('open');
    if (docModalBg) docModalBg.classList.remove('open');

    document.body.classList.remove('no-scroll');
    this.doctorModalOpen = false;
    this.currentDoctor = null;
  }

  openOffer(offerIndex: number) {
    const offer = this.offers[offerIndex];
    if (!offer) return;

    this.currentOffer = offer;
    this.renderOfferModal(offer);

    const offerModalBg = document.getElementById('offerModalBg');
    const offerModal = document.getElementById('offerModal');
    const offerBody = document.getElementById('offerModalBody');

    if (offerModalBg) offerModalBg.classList.add('open');
    if (offerModal) offerModal.classList.add('open');

    document.body.classList.add('no-scroll');
    this.offerModalOpen = true;

    setTimeout(() => {
      if (offerBody) offerBody.scrollTop = 0;
    }, 50);
  }

  renderOfferModal(offer: Offer) {
    const body = document.getElementById('offerModalBody');
    if (!body) {
      console.error('Offer modal body element not found!');
      return;
    }
    console.log('Rendering offer modal for:', offer.title);

    // Helper: render meta strip
    const metaStrip = (meta: any) => {
      if (!meta || !meta.length) return '';
      let out = '<div class="ofr-meta">';
      meta.forEach((m: any) => {
        out += '<div class="ofr-meta__item">';
        out += '<span class="ofr-meta__label">' + m.label + '</span>';
        out += '<span class="ofr-meta__value">' + m.value + '</span>';
        out += '</div>';
      });
      out += '</div>';
      return out;
    };

    // Helper: render section
    const renderSection = (section: any) => {
      let inner = '';
      if (section.kind === 'steps') {
        inner = '<ol class="ofr-steps">';
        section.data.forEach((st: any) => {
          inner += '<li class="ofr-step">';
          inner += '<div class="ofr-step__txt">';
          inner += '<strong>' + st.title + '</strong>';
          inner += '<span>' + st.sub + '</span>';
          inner += '</div>';
          if (st.time) inner += '<span class="ofr-step__time">' + st.time + '</span>';
          inner += '</li>';
        });
        inner += '</ol>';
      } else if (section.kind === 'results') {
        inner = '<div class="ofr-results">';
        section.data.forEach((r: any) => {
          inner += '<div class="ofr-result">';
          inner += '<svg class="ofr-result__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">';
          inner += '<path d="M5 13l4 4L19 7"/>';
          inner += '</svg>';
          inner += '<div>';
          inner += '<div class="ofr-result__t">' + r.title + '</div>';
          inner += '<div class="ofr-result__d">' + r.sub + '</div>';
          inner += '</div>';
          inner += '</div>';
        });
        inner += '</div>';
      } else if (section.kind === 'list') {
        inner = '<ul class="ofr-list">';
        section.data.forEach((li: any) => {
          inner += '<li><strong>' + li.strong + '</strong> ' + (li.text || '') + '</li>';
        });
        inner += '</ul>';
      } else if (section.kind === 'text') {
        inner = '<p class="ofr-text">' + section.data + '</p>';
      }

      return '<section class="ofr-sec">'
        + '<span class="ofr-sec__num">' + section.num + '</span>'
        + '<h3 class="ofr-sec__title">' + section.title + '</h3>'
        + inner
        + '</section>';
    };

    // Build complete HTML - matching original structure exactly
    const offerWithBg = offer as any;
    const heroBg = offerWithBg.heroBg || '';
    let html = '<div class="ofr">'
      + '<div class="ofr-cover" id="offerCover"' + (heroBg ? ' style="background-image:url(\'' + heroBg + '\')"' : '') + '>'
      +   '<div class="ofr-cover__veil"></div>'
      +   '<div class="ofr-cover__in">'
      +     '<span class="ofr-cat">' + offer.cat + '</span>'
      +     '<h2 class="ofr-title">' + offer.title + '</h2>'
      +     '<p class="ofr-sub">' + offer.subtitle + '</p>'
      +   '</div>'
      + '</div>'
      + '<div class="ofr-body">'
      +   '<p class="ofr-tagline">' + offer.tagline + '</p>'
      +   metaStrip(offer.meta)
      +   offer.sections.map(renderSection).join('')
      +   '<div class="ofr-price">'
      +     '<span class="ofr-price__mark">N</span>'
      +     '<div class="ofr-price__label">' + offer.price.label + '</div>'
      +     '<div class="ofr-price__amount">' + offer.price.amount + '</div>'
      +     '<div class="ofr-price__note">' + offer.price.note + '</div>'
      +   '</div>'
      + '</div>'
      + '</div>';

    console.log('Generated HTML length:', html.length);
    console.log('HTML preview:', html.substring(0, 200));
    body.innerHTML = html;
    console.log('Body innerHTML set successfully');

    // Apply background image if provided
    const cv = document.getElementById('offerCover');
    if (cv && heroBg) {
      cv.style.backgroundImage = 'url(\'' + heroBg + '\')';
    }

    // Render CTA buttons
    const ctaEl = document.getElementById('offerCta');
    if (ctaEl) {
      const waMsg = encodeURIComponent('Hello 🌸 I\'m coming from the Nouvelage services page about: *' + offer.title + '*');
      const waUrl = 'https://wa.me/201000312528?text=' + waMsg;

      let ctaHtml = '';
      if (offer.book.wa) {
        ctaHtml = '<a href="' + waUrl + '" target="_blank" rel="noopener" class="btn-cart">' + offer.book.label + '</a>'
          + '<a href="' + waUrl + '" target="_blank" rel="noopener" class="btn-wa" aria-label="Send via WhatsApp" title="Send via WhatsApp">'
          + '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.886 2.909 4.371 2.909 7.026-.004 5.444-4.46 9.879-9.935 9.879M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/></svg>'
          + '</a>';
      } else {
        ctaHtml = '<a href="' + offer.book.href + '" target="_blank" rel="noopener" class="offer-book">' + offer.book.label + '</a>'
          + '<a href="' + waUrl + '" target="_blank" rel="noopener" class="btn-wa" aria-label="Send via WhatsApp" title="Send via WhatsApp">'
          + '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.886 2.909 4.371 2.909 7.026-.004 5.444-4.46 9.879-9.935 9.879M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/></svg>'
          + '</a>';
      }
      ctaEl.innerHTML = ctaHtml;
    }

    // Update nav title
    const nav = document.getElementById('offerModalNav');
    if (nav) nav.textContent = offer.cat;
  }

  closeOffer() {
    const offerModal = document.getElementById('offerModal');
    const offerModalBg = document.getElementById('offerModalBg');

    if (offerModal) offerModal.classList.remove('open');
    if (offerModalBg) offerModalBg.classList.remove('open');

    document.body.classList.remove('no-scroll');
    this.offerModalOpen = false;
    this.currentOffer = null;
  }

  // Contact Form Validation and Google Sheets Integration
  initContactForm() {
    const form = document.getElementById('ctForm') as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form fields
      const nameInput = document.getElementById('fName') as HTMLInputElement;
      const phoneInput = document.getElementById('fPhone') as HTMLInputElement;
      const emailInput = document.getElementById('fEmail') as HTMLInputElement;
      const birthdayInput = document.getElementById('fBirthday') as HTMLInputElement;
      const branchInput = document.getElementById('fBranch') as HTMLSelectElement;
      const topicInput = document.getElementById('fTopic') as HTMLSelectElement;
      const doctorInput = document.getElementById('fDoctor') as HTMLSelectElement;
      const treatmentInput = document.getElementById('fTreatment') as HTMLSelectElement;
      const messageInput = document.getElementById('fMsg') as HTMLTextAreaElement;

      // Validation
      const errors: string[] = [];

      if (!nameInput.value.trim()) {
        errors.push('Name is required');
        nameInput.style.borderColor = '#c0392b';
      }

      const phone = phoneInput.value.trim();
      const egyptianPhoneRegex = /^(\+20|0020)?0?1[0-2|5]{1}[0-9]{8}$/;
      if (!phone) {
        errors.push('Phone number is required');
        phoneInput.style.borderColor = '#c0392b';
      } else if (!egyptianPhoneRegex.test(phone.replace(/[\s-]/g, ''))) {
        errors.push('Please enter a valid Egyptian phone number (e.g., +20 1234567890 or 01234567890)');
        phoneInput.style.borderColor = '#c0392b';
      }

      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        errors.push('Email is required');
        emailInput.style.borderColor = '#c0392b';
      } else if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
        emailInput.style.borderColor = '#c0392b';
      }

      if (!birthdayInput.value) {
        errors.push('Birthday is required');
        birthdayInput.style.borderColor = '#c0392b';
      } else {
        const birthday = new Date(birthdayInput.value);
        const maxDate = new Date('2008-12-31');
        if (birthday > maxDate) {
          errors.push('You must be at least 16 years old (born in 2008 or earlier)');
          birthdayInput.style.borderColor = '#c0392b';
        }
      }

      if (!branchInput.value) {
        errors.push('Please select a branch');
        branchInput.style.borderColor = '#c0392b';
      }

      if (!topicInput.value) {
        errors.push('Please select a topic');
        topicInput.style.borderColor = '#c0392b';
      }

      if (!doctorInput.value) {
        errors.push('Please select a doctor');
        doctorInput.style.borderColor = '#c0392b';
      }

      if (!treatmentInput.value) {
        errors.push('Please select a treatment');
        treatmentInput.style.borderColor = '#c0392b';
      }

      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      // Reset border colors
      [nameInput, phoneInput, emailInput, birthdayInput, branchInput, topicInput, doctorInput, treatmentInput].forEach(input => {
        input.style.borderColor = '';
      });

      // Prepare data for Google Sheets
      const formData = {
        formType: 'services',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        birthday: birthdayInput.value,
        branch: branchInput.value,
        topic: topicInput.value,
        doctor: doctorInput.value,
        treatment: treatmentInput.value,
        message: messageInput.value.trim()
      };

      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Get submit button
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalButtonText = submitButton.innerHTML;

      try {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';

        // Save booking to Supabase first
        await new Promise<void>((resolve, reject) => {
          this.bookingsService.createBooking({
            source: 'services_form',
            page_source: 'Services Page',
            first_name: firstName,
            last_name: lastName,
            email: formData.email,
            phone: formData.phone,
            birthdate: formData.birthday,
            preferred_branch: formData.branch,
            preferred_doctor: formData.doctor,
            treatment_interested: formData.treatment,
            topic: formData.topic,
            message: formData.message,
            booking_status: 'pending'
          }).subscribe({
            next: (booking) => {
              console.log('✅ Booking saved:', booking.booking_number);
              resolve();
            },
            error: (err) => {
              console.error('❌ Error saving booking:', err);
              reject(err);
            }
          });
        });

        // Send to Google Sheets
        await fetch('https://script.google.com/macros/s/AKfycbx2beL5br2VzfCoXryODQ-_UqnsGd4M0bhVYRGM6-nfpg1LRV9Bi65Cy3hQlFmoz0_e7A/exec', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        // Small delay to ensure data is sent
        await new Promise(resolve => setTimeout(resolve, 500));

        // Restore button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;

        // Build WhatsApp message
        let whatsappMessage = `New inquiry — Nouvel Age\nName: ${formData.name}\nPhone: ${formData.phone}`;
        if (formData.email) whatsappMessage += `\nEmail: ${formData.email}`;
        if (formData.birthday) whatsappMessage += `\nBirthday: ${formData.birthday}`;
        if (formData.branch) whatsappMessage += `\nPreferred Branch: ${formData.branch}`;
        if (formData.topic) whatsappMessage += `\nTopic: ${formData.topic}`;
        if (formData.doctor) whatsappMessage += `\nPreferred Doctor: ${formData.doctor}`;
        if (formData.treatment) whatsappMessage += `\nInterested Treatment: ${formData.treatment}`;
        if (formData.message) whatsappMessage += `\nMessage: ${formData.message}`;

        // Redirect to WhatsApp
        const whatsappUrl = `https://wa.me/201000312528?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank', 'noopener');

        // Show success message
        const okMessage = document.getElementById('ctOk');
        if (okMessage) {
          okMessage.style.display = 'block';
        }

        // Reset form
        form.reset();
      } catch (error) {
        console.error('Error:', error);
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        alert('An error occurred. Please try again.');
      }
    });

    // Reset field styling on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        (input as HTMLElement).style.borderColor = '';
      });
    });
  }
}
