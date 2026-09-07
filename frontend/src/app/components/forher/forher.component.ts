import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GoogleSheetsService } from '../../services/google-sheets.service';
import { DemoModeService } from '../../admin/services/demo-mode.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { DoctorsService, Doctor } from '../../admin/services/doctors.service';
import { ContentService } from '../../shared/services/content.service';
import { BookingsService } from '../../admin/services/bookings.service';

@Component({
  selector: 'app-forher',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CartFlyoutComponent],
  templateUrl: './forher.component.html',
  styleUrl: './forher.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ForherComponent implements OnInit, AfterViewInit {
  // Page content from CMS
  pageContent: any = {};

  // Doctors filtered for female patients
  doctors: any[] = [];
  displayedDoctors: any[] = [];
  doctorsPerPage = 4;
  showAllDoctors = false;
  private servicesMap: Map<string, string> = new Map();

  constructor(
    private router: Router,
    private http: HttpClient,
    private googleSheetsService: GoogleSheetsService,
    private demoModeService: DemoModeService,
    private doctorsService: DoctorsService,
    private supabaseService: ContentService,
    private bookingsService: BookingsService
  ) {}

  ngOnInit(): void {
    // Load services first, then page content
    this.loadServices();
    this.loadPageContent();
    // loadDoctors() is now called from within loadPageContent() after page content loads
  }

  private loadServices(): void {
    // Load ALL services to map IDs to names (including inactive ones)
    // This ensures we can map service IDs that doctors have, even if services are inactive
    this.supabaseService.getAllServices().subscribe({
      next: (services: any[]) => {
        console.log('📥 For Her - Raw services from Supabase:', services.length);
        console.log('📥 For Her - First 3 services:', services.slice(0, 3).map((s: any) => ({
          id: s.id,
          name: s.name,
          title: s.title
        })));

        services.forEach((service: any) => {
          this.servicesMap.set(service.id, service.name || service.title);
        });

        console.log('✅ For Her - Loaded services map:', this.servicesMap.size, 'services');
        console.log('🗺️ For Her - Sample entries from map:');
        let count = 0;
        for (const [id, name] of this.servicesMap.entries()) {
          if (count++ < 3) {
            console.log(`   ${id} → ${name}`);
          }
        }
      },
      error: (error) => {
        console.error('❌ For Her - Error loading services:', error);
      }
    });
  }

  private loadDoctors(): void {
    // Load doctors from Supabase
    this.supabaseService.getAllDoctors().subscribe({
      next: (doctors: any[]) => {
        console.log('📦 For Her - Raw doctors from Supabase:', doctors?.length || 0);

        // Log first doctor's services to see format
        if (doctors && doctors.length > 0 && doctors[0].services) {
          console.log('🔍 For Her - First doctor services (raw):', doctors[0].name, '→', doctors[0].services);
        }

        if (doctors && doctors.length > 0) {
          // Map Supabase doctor fields to component format
          const allDoctors: any[] = doctors.map((d: any) => ({
            id: d.id,
            slug: d.slug,
            name: d.name,
            title: d.title || 'Dr.',
            specialization: d.specialization,
            spec: d.specialization,
            role: d.role || d.specialization,
            img: d.profile_image,
            profileImage: d.profile_image,
            gender: d.gender,
            deg: d.degree || d.degrees || d.specialization,
            bio: d.bio || d.description || '',
            tags: d.tags || [],
            services: this.mapServiceIdsToNames(d.services || []),
            experience: d.years_experience || d.experience_years || 0,
            yrs: d.years_experience || d.experience_years || 0,
            rating: d.rating || 4.9,
            active: d.is_active !== false  // Use is_active from Supabase
          })).filter(d => d.active);

          // If doctors_featured array exists and has items, filter by it
          console.log('🔍 For Her - doctors_featured from page content:', this.pageContent.doctors_featured);
          console.log('🔍 For Her - Featured array length:', this.pageContent.doctors_featured?.length || 0);
          console.log('🔍 For Her - All active doctors count:', allDoctors.length);

          if (this.pageContent.doctors_featured && this.pageContent.doctors_featured.length > 0) {
            this.doctors = allDoctors.filter(d =>
              this.pageContent.doctors_featured.includes(d.id)
            ) as any[];
            console.log('✅ For Her - Filtered to featured doctors:', this.doctors.length);
            console.log('👥 For Her - Doctor names showing:', this.doctors.map(d => d.name));
            if (this.doctors.length === 0) {
              console.error('⚠️ For Her - No doctors match the featured IDs! The IDs in doctors_featured dont exist in Supabase.');
              console.error('   Featured IDs:', this.pageContent.doctors_featured);
              console.error('   Available IDs:', allDoctors.slice(0, 5).map(d => d.id));
            }
            this.updateDisplayedDoctors();
          } else {
            // No doctors selected in admin - show empty
            this.doctors = [];
            this.displayedDoctors = [];
            console.log('⚠️ For Her - No doctors selected in admin. Array is empty or null.');
          }
        } else {
          console.error('❌ For Her - No doctors returned from Supabase');
          this.doctors = [];
        }
      },
      error: (err) => {
        console.error('❌ Error loading doctors from Supabase:', err);
        this.doctors = [];
      }
    });
  }

  private mapServiceIdsToNames(serviceIds: string[]): string[] {
    if (!serviceIds || serviceIds.length === 0) return [];

    console.log('🔍 For Her - Mapping service IDs:', serviceIds);
    console.log('🗺️ For Her - Services map size:', this.servicesMap.size);

    const mapped = serviceIds
      .map(id => {
        // First check if it's already a name (not a UUID)
        // UUIDs have format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (36 chars with dashes)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (!isUUID) {
          // It's already a name, return as is
          console.log(`  For Her - "${id}" → Already a name (not UUID)`);
          return id;
        }

        // It's a UUID, try to map it to a name
        const name = this.servicesMap.get(id);
        if (name) {
          console.log(`  For Her - ID: ${id} → Name: ${name}`);
          return name;
        }

        // If not found in map, return null and we'll filter it out
        console.log(`  For Her - ID: ${id} → NOT FOUND in services map, filtering out`);
        return null;
      })
      .filter(name => name && name.length > 0) as string[];

    console.log('✅ For Her - Mapped services:', mapped);
    return mapped;
  }

  private updateDisplayedDoctors(): void {
    if (this.showAllDoctors) {
      this.displayedDoctors = this.doctors;
    } else {
      this.displayedDoctors = this.doctors.slice(0, this.doctorsPerPage);
    }
  }

  showMoreDoctors(): void {
    this.showAllDoctors = !this.showAllDoctors;
    this.updateDisplayedDoctors();
  }

  get hasMoreDoctors(): boolean {
    return this.doctors.length > this.doctorsPerPage;
  }

  loadPageContent(): void {
    // Load page content from the API
    console.log('🔄 For Her - Loading page content from the database...');
    this.supabaseService.getPageContent('forher')
      .subscribe((content: any) => {
        if (!content) {
          console.warn('⚠️ For Her - No page content found in the database, using default');
          this.pageContent = this.demoModeService.getDemoPageContent('forher');
        } else {
          this.pageContent = content;
          console.log('✅ For Her - Loaded page content from the database');
          console.log('📋 For Her - Full page content:', this.pageContent);
          console.log('👥 For Her - doctors_featured field:', this.pageContent.doctors_featured);
          console.log('👥 For Her - doctors_featured type:', typeof this.pageContent.doctors_featured);
          console.log('👥 For Her - doctors_featured length:', this.pageContent.doctors_featured?.length);

          // Clean up invalid demo IDs (doc_001, doc_002, etc.) before loading doctors
          this.cleanupDemoIds();

          console.log('👥 For Her - doctors_featured (after cleanup):', this.pageContent.doctors_featured);
        }
        // Re-run the stat counters now that hero_stats have rendered — the
        // ngAfterViewInit pass can run before this async Supabase data arrives,
        // which left the numbers stuck at 0 until a refresh.
        setTimeout(() => this.initCounters(), 300);
        // Reload widget and doctors after content is loaded
        this.loadDoctors();
        setTimeout(() => this.reloadJotFormWidget(), 3000);
      });
  }

  private cleanupDemoIds(): void {
    // Clear the entire array if it contains demo IDs - admin needs to re-select doctors
    if (this.pageContent.doctors_featured && Array.isArray(this.pageContent.doctors_featured)) {
      const hasDemoIds = this.pageContent.doctors_featured.some((id: string) => id.match(/^doc_\d+$/));

      if (hasDemoIds) {
        console.log(`🧹 For Her Frontend - Clearing ${this.pageContent.doctors_featured.length} demo IDs. Admin needs to select doctors.`);
        this.pageContent.doctors_featured = [];
      }
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  getImageUrl(imagePath: string): string {
    if (imagePath && imagePath.includes('/media-library/')) {
      return `${environment.mediaBaseUrl}${imagePath}`;
    }
    return imagePath;
  }

  viewDoctor(doctorId: string): void {
    const doctor = this.doctors.find(d => d.id === doctorId);
    if (doctor) {
      const slug = doctor.slug || this.generateSlug(doctor.name);
      this.router.navigate(['/doctor', slug]);
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/dr\.|dr\s/gi, '')
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }

  getFirstName(fullName: string): string {
    if (!fullName) return '';
    const nameParts = fullName.replace('Dr.', '').trim().split(' ');
    return nameParts[0].toUpperCase();
  }

  isHighRating(rating: number | undefined): boolean {
    if (!rating) return false;
    return rating >= 4.9;
  }

  getWhatsAppLink(): string {
    const phone = this.pageContent?.contact_whatsapp || '+20 100 031 2528';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    return `https://api.whatsapp.com/send?phone=${cleanPhone}`;
  }

  ngAfterViewInit(): void {
    // Wait for DOM and external scripts to be ready
    setTimeout(() => {
      this.initHeroSlideshow();
      this.initDoctorsSection();
      this.initBranchSlider();
      this.initLeafletMap();
      this.initReveals();
      this.initCounters();
      this.initFAQ();
      this.initTreatmentFilters();
      this.initContactForm();
      this.initBookingLinks();
      this.initPlayIcons();
      this.initColorSwap();
      this.initJotFormWidget();
    }, 1000);
  }


  private initHeroSlideshow(): void {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = document.querySelector('.hero') as HTMLElement;
    const slides = hero ? Array.from(hero.querySelectorAll('.hero-slide')) as HTMLElement[] : [];

    if (hero && slides.length > 1) {
      const dots = hero.querySelector('.hero-dots') as HTMLElement;
      let i = 0;
      let timer: any = null;

      slides.forEach((s, n) => {
        const b = document.createElement('button');
        b.addEventListener('click', () => go(n, true));
        dots.appendChild(b);
      });

      const dotEls = Array.from(dots.children) as HTMLElement[];

      const go = (n: number, manual?: boolean) => {
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle('on', k === i));
        dotEls.forEach((d, k) => d.classList.toggle('on', k === i));
        const img = slides[i].querySelector('img') as HTMLImageElement;
        if (img) {
          img.style.animation = 'none';
          void img.offsetWidth;
          img.style.animation = '';
        }
        if (manual) restart();
      };

      const restart = () => {
        if (timer) clearInterval(timer);
        if (!reduce) timer = setInterval(() => go(i + 1), 5000);
      };

      const nx = hero.querySelector('.hero-next') as HTMLElement;
      const pv = hero.querySelector('.hero-prev') as HTMLElement;
      if (nx) nx.addEventListener('click', () => go(i + 1, true));
      if (pv) pv.addEventListener('click', () => go(i - 1, true));

      hero.addEventListener('mouseenter', () => {
        if (timer) clearInterval(timer);
      });
      hero.addEventListener('mouseleave', restart);

      go(0);
      restart();
    }
  }

  private initDoctorsSection(): void {
    const grid = document.querySelector('.doctors .doc-grid') as HTMLElement;
    const more = document.getElementById('docSeeMore') as HTMLElement;
    const seeAll = document.getElementById('docSeeAll') as HTMLElement;

    if (!grid || !more) return;

    const cards = Array.from(grid.querySelectorAll('.doc-card')) as HTMLElement[];
    const STEP = 4;
    let shown = Math.min(STEP, cards.length);

    cards.forEach((c, i) => {
      if (i >= shown) {
        c.classList.add('dh');
      }
    });

    const sync = () => {
      if (shown >= cards.length) {
        more.style.display = 'none';
        if (seeAll) seeAll.style.display = '';
      }
    };

    sync();

    more.addEventListener('click', () => {
      const next = Math.min(shown + STEP, cards.length);
      for (let i = shown; i < next; i++) {
        cards[i].classList.remove('dh');
        cards[i].classList.add('in');
      }
      shown = next;
      sync();
    });
  }

  private initBranchSlider(): void {
    const slides = Array.from(document.querySelectorAll('#branchSlides .branch-slide')) as HTMLElement[];
    const prevBtn = document.getElementById('branchPrevBtn') as HTMLButtonElement;
    const nextBtn = document.getElementById('branchNextBtn') as HTMLButtonElement;

    if (!slides.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    const showSlide = (n: number) => {
      // Wrap around
      if (n >= slides.length) currentIndex = 0;
      else if (n < 0) currentIndex = slides.length - 1;
      else currentIndex = n;

      slides.forEach((slide, index) => {
        slide.classList.toggle('on', index === currentIndex);
      });
    };

    prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

    // Auto-advance every 5 seconds
    setInterval(() => showSlide(currentIndex + 1), 5000);

    showSlide(0);
  }

  private initLeafletMap(): void {
    const el = document.getElementById('nvMap');
    if (!el || typeof (window as any).L === 'undefined') return;

    const L = (window as any).L;

    // Use branches from pageContent or fallback to default (same structure as ForHim)
    const BR = this.pageContent?.map_branches || [
      { city: 'Cairo', name: 'Citystars — Phase 2', addr: '3rd Floor, Unit 3280', ll: [30.0726, 31.3478] },
      { city: 'Cairo', name: 'Cairo Festival City', addr: 'CFC · 2nd Floor, Unit 1-08', ll: [30.0290, 31.4080] },
      { city: 'Cairo', name: 'Madinaty', addr: 'The Strip · Building 10, PL02', ll: [30.0997, 31.6469] },
      { city: 'Giza', name: 'Mohandessin', addr: '2 Dr. Mahrouky St. · 3rd Floor', ll: [30.0590, 31.2020] },
      { city: 'Giza', name: 'Sheikh Zayed', addr: 'Twin Towers Mall, Bldg D · 5th Fl, Clinic H', ll: [30.0420, 30.9770] },
      { city: 'Giza', name: 'Mall of Arabia', addr: 'Gate 17, Unit H052', ll: [29.9890, 30.9760] },
      { city: 'Alexandria', name: 'Camp Shizar', addr: '18 El Geish Road · opp. Casino El Shatby', ll: [31.2150, 29.9270] },
      { city: 'Alexandria', name: 'Roushdy', addr: '17 Syria Street', ll: [31.2340, 29.9560] },
      { city: 'Alexandria', name: 'Loran', addr: 'El Murjan Tower · El Horreya Road', ll: [31.2640, 29.9930] }
    ];

    const map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([30.6, 31.0], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const pin = '<span class="nv-pin"><svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">' +
      '<path class="pin-body pin-stroke" d="M12 .6C5.7.6.7 5.6.7 11.9c0 8.4 11.3 19.2 11.3 19.2s11.3-10.8 11.3-19.2C23.3 5.6 18.3.6 12 .6z"/>' +
      '<circle class="pin-dot" cx="12" cy="11.9" r="4.4"/></svg></span>';
    const icon = L.divIcon({ className: 'nv-pin-wrap', html: pin, iconSize: [30, 38], iconAnchor: [15, 38], popupAnchor: [0, -34] });
    const pts: any[] = [];

    BR.forEach((b: any) => {
      // Support both formats: {ll: [lat,lng]} or {lat: 'x', lng: 'y'}
      const ll = b.ll || [parseFloat(b.lat), parseFloat(b.lng)];
      const searchQuery = encodeURIComponent('Nouvel Age ' + b.name);
      const dir = 'https://www.google.com/maps/search/' + searchQuery;

      L.marker(ll, { icon: icon, title: b.name }).addTo(map)
        .bindPopup('<div class="nv-pop__city">' + (b.city || '') + '</div>' +
          '<div class="nv-pop__name">' + b.name + '</div>' +
          '<div class="nv-pop__addr">' + (b.addr || b.address || '') + '</div>' +
          '<a class="nv-pop__dir" href="' + dir + '" target="_blank" rel="noopener">Get directions &#8599;</a>');
      pts.push(ll);
    });

    if (pts.length) map.fitBounds(pts, { padding: [45, 45] });
  }

  private initReveals(): void {
    const ro = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
  }

  private initCounters(): void {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const co = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const target = +(el.dataset['count'] || '0');
        const suf = el.dataset['suffix'] || '';
        const dur = 1900;
        const t0 = performance.now();
        const fmt = (n: number) => n.toLocaleString('en-US');

        const step = (t: number) => {
          const x = Math.min(1, (t - t0) / dur);
          const k = 1 - Math.pow(1 - x, 3);
          el.textContent = fmt(Math.round(target * k)) + suf;
          if (x < 1) requestAnimationFrame(step);
          else el.textContent = fmt(target) + suf;
        };

        if (reduce) {
          el.textContent = fmt(target) + suf;
        } else {
          requestAnimationFrame(step);
        }
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => co.observe(el));
  }

  private initFAQ(): void {
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q') as HTMLElement;
      const a = item.querySelector('.faq-a') as HTMLElement;
      if (!q || !a) return;

      q.addEventListener('click', () => {
        const open = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(o => {
          o.classList.remove('open');
          const oA = o.querySelector('.faq-a') as HTMLElement;
          if (oA) oA.style.maxHeight = '0';
        });
        if (!open) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  private initTreatmentFilters(): void {
    const filters = document.querySelectorAll('.menu-filters button') as NodeListOf<HTMLElement>;
    const items = document.querySelectorAll('.menu-item') as NodeListOf<HTMLElement>;

    filters.forEach(b => b.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const f = b.dataset['filter'];
      items.forEach(it => {
        it.hidden = !(f === 'all' || it.dataset['cat'] === f);
      });
    }));
  }

  private initContactForm(): void {
    const form = document.querySelector('#ctForm') as HTMLFormElement;
    if (!form) return;

    // Setup field validation - reset styling on input
    form.querySelectorAll('input, select, textarea').forEach((input: any) => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      });

      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.style.borderColor = '#c0392b';
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate form
      if (!this.validateForm(form)) {
        return;
      }

      // Extract form data
      const formData = this.extractFormData(form);

      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalButtonText = submitButton ? submitButton.innerHTML : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
      }

      try {
        // Save booking to Supabase FIRST (await Promise pattern)
        await new Promise<void>((resolve, reject) => {
          this.bookingsService.createBooking({
            source: 'forher_form',
            page_source: 'For Her Page',
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
        await this.googleSheetsService.sendToGoogleSheets(formData, 'forher');

        // Small delay to ensure data is sent
        await new Promise(resolve => setTimeout(resolve, 500));

        // Restore button
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }

        // Show success message
        form.classList.add('sent');
        const ok = form.querySelector('.ok');
        if (ok) ok.scrollIntoView?.();

        // Redirect to WhatsApp
        this.googleSheetsService.redirectToWhatsApp(formData);

        // Reset form
        form.reset();
      } catch (error) {
        console.error('Error:', error);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
        alert('An error occurred. Please try again.');
      }
    });
  }

  private validateForm(form: HTMLFormElement): boolean {
    const errors: Array<{ field: HTMLElement | null; message: string }> = [];

    // Get all required fields
    const nameInput = form.querySelector('#fName') as HTMLInputElement;
    const phoneInput = form.querySelector('#fPhone') as HTMLInputElement;
    const emailInput = form.querySelector('#fEmail') as HTMLInputElement;
    const birthdayInput = form.querySelector('#fBirthday') as HTMLInputElement;
    const branchInput = form.querySelector('#fBranch') as HTMLSelectElement;
    const topicInput = form.querySelector('#fTopic') as HTMLSelectElement;
    const doctorInput = form.querySelector('#fDoctor') as HTMLSelectElement;
    const treatmentInput = form.querySelector('#fTreatment') as HTMLSelectElement;

    // Validate Name (required)
    if (!nameInput || !nameInput.value.trim()) {
      errors.push({ field: nameInput, message: 'Name is required' });
    }

    // Validate Egyptian Phone Number (required)
    if (!phoneInput || !phoneInput.value.trim()) {
      errors.push({ field: phoneInput, message: 'Phone number is required' });
    } else if (!this.googleSheetsService.validateEgyptianPhone(phoneInput.value.trim())) {
      errors.push({ field: phoneInput, message: 'Please enter a valid Egyptian phone number (e.g., +20 1234567890 or 01234567890)' });
    }

    // Validate Email (required)
    if (!emailInput || !emailInput.value.trim()) {
      errors.push({ field: emailInput, message: 'Email is required' });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        errors.push({ field: emailInput, message: 'Please enter a valid email address' });
      }
    }

    // Validate Birthday (required, must be 16+ years old)
    if (!birthdayInput || !birthdayInput.value.trim()) {
      errors.push({ field: birthdayInput, message: 'Birthday is required' });
    } else if (!this.googleSheetsService.validateAge(birthdayInput.value)) {
      errors.push({ field: birthdayInput, message: 'You must be at least 16 years old (born in 2008 or earlier)' });
    }

    // Validate Branch (required)
    if (!branchInput || !branchInput.value) {
      errors.push({ field: branchInput, message: 'Please select a branch' });
    }

    // Validate Topic (required)
    if (!topicInput || !topicInput.value) {
      errors.push({ field: topicInput, message: 'Please select a topic' });
    }

    // Validate Doctor (required)
    if (doctorInput && (!doctorInput.value || doctorInput.value === '')) {
      errors.push({ field: doctorInput, message: 'Please select a doctor' });
    }

    // Validate Treatment (required)
    if (treatmentInput && (!treatmentInput.value || treatmentInput.value === '')) {
      errors.push({ field: treatmentInput, message: 'Please select a treatment' });
    }

    // Show errors if any
    if (errors.length > 0) {
      // Highlight all invalid fields
      errors.forEach(error => {
        if (error.field) {
          (error.field as HTMLElement).style.borderColor = '#c0392b';
          (error.field as HTMLElement).style.boxShadow = '0 0 0 3px rgba(192, 57, 43, 0.2)';
        }
      });

      // Focus first invalid field
      if (errors[0].field) {
        (errors[0].field as HTMLElement).focus();
      }

      // Show alert with all errors
      alert(errors.map(e => e.message).join('\n'));
      return false;
    }

    return true;
  }

  private extractFormData(form: HTMLFormElement): any {
    const nameInput = form.querySelector('#fName') as HTMLInputElement;
    const phoneInput = form.querySelector('#fPhone') as HTMLInputElement;
    const emailInput = form.querySelector('#fEmail') as HTMLInputElement;
    const birthdayInput = form.querySelector('#fBirthday') as HTMLInputElement;
    const branchInput = form.querySelector('#fBranch') as HTMLSelectElement;
    const topicInput = form.querySelector('#fTopic') as HTMLSelectElement;
    const doctorInput = form.querySelector('#fDoctor') as HTMLSelectElement;
    const treatmentInput = form.querySelector('#fTreatment') as HTMLSelectElement;
    const messageInput = form.querySelector('#fMsg') as HTMLTextAreaElement;

    return {
      name: nameInput?.value.trim() || '',
      phone: phoneInput?.value.trim() || '',
      email: emailInput?.value.trim() || '',
      birthday: birthdayInput?.value.trim() || '',
      branch: branchInput?.value || '',
      topic: topicInput?.value || '',
      doctor: doctorInput?.value || '',
      treatment: treatmentInput?.value || '',
      message: messageInput?.value.trim() || ''
    };
  }

  private initBookingLinks(): void {
    const BK = 'https://forms.nouvelage.fr/welcome-gift';
    const sel = '.nav-book, .float .bk, .bbtn.book, .offer-cta, .svc-cta2 .btn, .hero-actions .gold, .dp-actions .btn:not(.ghost), .cp-cta .btn:not(.ghost)';
    document.querySelectorAll(sel).forEach((a: any) => {
      if (a.tagName === 'A') {
        a.setAttribute('href', BK);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      }
    });
  }

  private initPlayIcons(): void {
    const reelLinks = document.querySelectorAll('.gal-row .g[href*="/reel/"]');
    const playSvg = '<svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.5" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/><path d="M10 8v8l6-4-6-4z" fill="rgba(0,0,0,0.75)"/></svg>';
    reelLinks.forEach((link: any) => {
      link.classList.add('has-play');
      link.insertAdjacentHTML('beforeend', playSvg);
    });
  }

  private initColorSwap(): void {
    const T: any = { swapBrownOrange: false };
    const html = document.documentElement;
    const sw = document.getElementById('fh-swap-sw');
    const panel = document.getElementById('fh-tweaks');
    const swatch = document.getElementById('fh-swatches');

    if (!sw || !panel || !swatch) return;

    const renderSwatches = () => {
      const on = !!T.swapBrownOrange;
      const brown = on ? '#C56B33' : '#3A3028';
      const orange = on ? '#3A3028' : '#C56B33';
      swatch.innerHTML =
        '<i style="background:' + brown + '"></i>' +
        '<span class="ar">structure</span>' +
        '<i style="background:' + orange + '"></i>' +
        '<span class="ar">accent</span>';
    };

    const apply = () => {
      html.classList.toggle('fh-swap', !!T.swapBrownOrange);
      sw.classList.toggle('on', !!T.swapBrownOrange);
      sw.setAttribute('aria-checked', String(!!T.swapBrownOrange));
      renderSwatches();
    };

    apply();

    window.addEventListener('message', (e: any) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') {
        panel.classList.add('on');
        panel.setAttribute('aria-hidden', 'false');
      } else if (d.type === '__deactivate_edit_mode') {
        panel.classList.remove('on');
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    window.parent.postMessage({ type: '__edit_mode_available' }, '*');

    const closeBtn = document.getElementById('fh-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.classList.remove('on');
        panel.setAttribute('aria-hidden', 'true');
        window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
      });
    }

    sw.addEventListener('click', () => {
      T.swapBrownOrange = !T.swapBrownOrange;
      apply();
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { swapBrownOrange: T.swapBrownOrange } }, '*');
    });
  }


  private initJotFormWidget(): void {
    // This will be called after DOM is ready
    // Actual loading happens in reloadJotFormWidget()
  }

  private reloadJotFormWidget(): void {
    console.log('🔄 reloadJotFormWidget() called');
    console.log('📄 pageContent:', this.pageContent);
    console.log('📝 reviews_embed_code:', this.pageContent.reviews_embed_code);

    // Get the reviews embed container - try multiple selectors
    let reviewsContainer = document.querySelector('.reviews div[style*="margin-top:2.6rem"]') as HTMLElement;

    if (!reviewsContainer) {
      console.log('⚠️ First selector failed, trying alternative...');
      reviewsContainer = document.querySelector('#reviews .container > div:last-child') as HTMLElement;
    }

    if (!reviewsContainer) {
      console.log('⚠️ Second selector failed, trying to find section.reviews...');
      const reviewsSection = document.querySelector('section.reviews');
      console.log('Reviews section:', reviewsSection);
      if (reviewsSection) {
        const allDivs = reviewsSection.querySelectorAll('div');
        console.log('All divs in reviews section:', allDivs);
        reviewsContainer = Array.from(allDivs).find(div =>
          div.getAttribute('style')?.includes('margin-top:2.6rem')
        ) as HTMLElement;
      }
    }

    if (!reviewsContainer) {
      console.error('❌ Reviews container not found after trying all selectors');
      return;
    }

    console.log('✅ Reviews container found:', reviewsContainer);

    // Extract widget ID and script URL from pageContent.reviews_embed_code
    const embedCode = this.pageContent.reviews_embed_code || '';
    console.log('🔍 Embed code to parse:', embedCode);

    // Extract div id (e.g., JFWebsiteWidget-019ed510cb48795c88101cbaa3e65fda5ee4)
    const divMatch = embedCode.match(/id=["']([^"']+)["']/);
    const widgetId = divMatch ? divMatch[1] : null;

    // Extract script src
    const scriptMatch = embedCode.match(/src=["']([^"']+)["']/);
    const scriptSrc = scriptMatch ? scriptMatch[1] : null;

    console.log('🎯 Extracted widgetId:', widgetId);
    console.log('🎯 Extracted scriptSrc:', scriptSrc);

    if (!widgetId || !scriptSrc) {
      console.error('❌ No valid widget code found in reviews_embed_code');
      console.error('   widgetId:', widgetId);
      console.error('   scriptSrc:', scriptSrc);
      return;
    }

    console.log('🚀 Loading JotForm widget:', widgetId);

    // Clear container and remove old scripts
    reviewsContainer.innerHTML = '';
    document.querySelectorAll('script[src*="jotform.com/website-widgets"]').forEach(s => {
      console.log('🗑️ Removing old script:', s);
      s.remove();
    });

    // Create the widget div
    const widgetDiv = document.createElement('div');
    widgetDiv.id = widgetId;
    reviewsContainer.appendChild(widgetDiv);
    console.log('✅ Widget div created with id:', widgetId);

    // Create and append script
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    reviewsContainer.appendChild(script);
    console.log('✅ Script appended with src:', scriptSrc);

    console.log('✅✅✅ JotForm widget loaded successfully!');
  }
}
