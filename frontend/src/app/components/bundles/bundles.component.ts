import { Component, OnInit, ViewEncapsulation, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DemoModeService } from '../../admin/services/demo-mode.service';
import { ContentService } from '../../shared/services/content.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { CartService } from '../../shared/services/cart.service';
import { BookingsService } from '../../admin/services/bookings.service';
import { GoogleSheetsService } from '../../services/google-sheets.service';

@Component({
  selector: 'app-bundles',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CartFlyoutComponent],
  templateUrl: './bundles.component.html',
  styleUrl: './bundles.component.css',
  encapsulation: ViewEncapsulation.None
})
export class BundlesComponent implements OnInit {
  // SSR: hero slides come from localStorage, which doesn't exist on the server.
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  pageContent: any = {};
  bundles: any[] = [];
  allBundles: any[] = [];
  parentBundles: any[] = [];
  selectedParentBundleFilter: string = 'all';
  currentYear: number = new Date().getFullYear();
  selectedBundle: any = null;
  isOfferModalOpen: boolean = false;
  heroSlides: any[] = [];
  selectedQuantity: number = 1;

  constructor(
    private demoModeService: DemoModeService,
    private supabase: ContentService,
    private router: Router,
    private cartService: CartService,
    private bookingsService: BookingsService,
    private googleSheetsService: GoogleSheetsService
  ) {}

  ngOnInit(): void {
    this.loadPageContentFromSupabase();
    this.loadParentBundles();
    this.loadBundles();
    this.loadHeroSlides();
  }

  loadPageContentFromSupabase(): void {
    this.supabase.getPageContent('bundles-page').subscribe(content => {
      if (!content) {
        console.warn('⚠️ No page content found in the database, using default');
        this.pageContent = this.demoModeService.getDemoPageContent('bundles-page');
      } else {
        this.pageContent = content;
        console.log('✅ Loaded bundles-page content from the database');
      }
    });
  }

  // Helper to convert snake_case to camelCase
  private snakeToCamel(obj: any): any {
    const newObj: any = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      newObj[camelKey] = obj[key];
    }
    return newObj;
  }

  loadParentBundles(): void {
    // Load parent bundles ONLY from Supabase (no localStorage fallback)
    this.supabase.getAllParentBundles().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          console.log('✅ Loaded parent bundles from Supabase:', data.length);

          // Convert snake_case to camelCase
          const convertedParents = data.map(p => this.snakeToCamel(p));

          this.parentBundles = convertedParents;
          this.parentBundles.sort((a: any, b: any) => (a.orderIndex || a.order || 0) - (b.orderIndex || b.order || 0));

          console.log('🏷️ Parent bundles:', this.parentBundles.map(pb => pb.name).join(', '));
        } else {
          console.warn('⚠️ No parent bundles found in Supabase');
          this.parentBundles = [];
        }
      },
      error: (err) => {
        console.error('❌ Failed to load parent bundles from Supabase:', err);
        this.parentBundles = [];
      }
    });
  }

  loadBundles(): void {
    // Load bundles ONLY from Supabase (no localStorage fallback)
    console.log('🔄 Loading bundles from Supabase...');

    this.supabase.getAllBundles().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          console.log('✅ Loaded bundles from Supabase:', data.length);

          // Convert snake_case to camelCase for component compatibility
          const convertedBundles = data.map(b => this.snakeToCamel(b));

          this.allBundles = convertedBundles.filter((b: any) => b.isActive && b.showInGrid);
          this.bundles = [...this.allBundles];
          this.bundles.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
        } else {
          console.warn('⚠️ No bundles found in Supabase');
          this.allBundles = [];
          this.bundles = [];
        }
      },
      error: (err) => {
        console.error('❌ Failed to load bundles from Supabase:', err);
        this.allBundles = [];
        this.bundles = [];
      }
    });
  }

  loadHeroSlides(): void {
    if (!this.isBrowser) return;
    // Load bundles for hero slider (offers slider) - bundles with showInSlider=true
    const bundlesData = localStorage.getItem('bundles');
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
        bundleId: b.id
      }));
  }

  filterByParentBundle(parentBundleFilter: string): void {
    this.selectedParentBundleFilter = parentBundleFilter;

    console.log('🔍 Filtering by:', parentBundleFilter);
    console.log('📦 Total bundles to filter:', this.allBundles.length);

    if (parentBundleFilter === 'all') {
      this.bundles = [...this.allBundles];
      console.log('✅ Showing all bundles:', this.bundles.length);
    } else {
      // Find the parent bundle by name to get its ID
      const parentBundle = this.parentBundles.find((pb: any) => pb.name === parentBundleFilter);
      const parentBundleId = parentBundle ? parentBundle.id : null;

      console.log('🔍 Looking for parent bundle:', {
        name: parentBundleFilter,
        foundId: parentBundleId
      });

      // Show what values we're checking against
      const sampleBundle = this.allBundles[0];
      if (sampleBundle) {
        console.log('📋 Sample bundle fields:', {
          parentCategory: sampleBundle.parentCategory,
          parentBundleId: sampleBundle.parentBundleId,
          parentCategoryId: sampleBundle.parentCategoryId
        });
      }

      // Filter by matching either name OR ID
      this.bundles = this.allBundles.filter((b: any) => {
        const matches =
          // Match by name
          b.parentCategory === parentBundleFilter ||
          b.parentBundleId === parentBundleFilter ||
          b.parent_category === parentBundleFilter ||
          // Match by ID (if we found the parent bundle)
          (parentBundleId && (
            b.parentCategory === parentBundleId ||
            b.parentBundleId === parentBundleId ||
            b.parentCategoryId === parentBundleId ||
            b.parent_category === parentBundleId ||
            b.parent_category_id === parentBundleId
          ));

        if (matches) {
          console.log('✅ Match found:', b.cardTitle || b.name);
        }

        return matches;
      });

      console.log('✅ Filtered to', this.bundles.length, 'bundles for category:', parentBundleFilter);

      if (this.bundles.length === 0) {
        console.warn('⚠️ No bundles found! Check if bundle parent_category values match:', parentBundleFilter);
        console.log('📋 Parent bundle ID we tried:', parentBundleId);
        console.log('📋 Available parent categories in bundles:',
          [...new Set(this.allBundles.map((b: any) => b.parentCategory || b.parentBundleId || 'EMPTY'))].slice(0, 10)
        );
      }
    }
  }

  openOffer(bundle: any): void {
    this.selectedBundle = bundle;

    // Check if luxury modal should be used
    if (bundle.useLuxuryModal) {
      this.renderLuxuryModal(bundle);
    } else {
      this.renderOfferModal(bundle);
    }

    const offerModalBg = document.getElementById('offerModalBg');
    const offerModal = document.getElementById('offerModal');
    const offerBody = document.getElementById('offerModalBody');

    if (offerModalBg) offerModalBg.classList.add('open');
    if (offerModal) offerModal.classList.add('open');

    document.body.classList.add('no-scroll');
    this.isOfferModalOpen = true;

    setTimeout(() => {
      if (offerBody) offerBody.scrollTop = 0;
    }, 50);
  }

  closeOffer(): void {
    const offerModalBg = document.getElementById('offerModalBg');
    const offerModal = document.getElementById('offerModal');

    if (offerModalBg) offerModalBg.classList.remove('open');
    if (offerModal) offerModal.classList.remove('open');

    document.body.classList.remove('no-scroll');
    this.isOfferModalOpen = false;
    this.selectedBundle = null;
  }

  renderOfferModal(bundle: any): void {
    const body = document.getElementById('offerModalBody');
    const ctaEl = document.getElementById('offerCta');
    const navEl = document.getElementById('offerModalNav');

    if (!body) {
      console.error('Offer modal body element not found!');
      return;
    }

    // Update modal nav title
    if (navEl) {
      navEl.textContent = bundle.modalCategory || bundle.cardTitle || bundle.name;
    }

    // Build modal content HTML - exact structure from provided HTML
    let html = '<div class="ofr">';

    // Cover section with background image
    html += '<div class="ofr-cover" id="offerCover"';
    if (bundle.modalCoverImage) {
      html += ' style="background-image:url(\'' + bundle.modalCoverImage + '\')"';
    }
    html += '>';
    html += '<div class="ofr-cover__veil"></div>';
    html += '<div class="ofr-cover__in">';
    if (bundle.modalCategory) {
      html += '<span class="ofr-cat">' + bundle.modalCategory + '</span>';
    }
    html += '<h2 class="ofr-title">' + (bundle.modalTitle || bundle.cardTitle || bundle.name) + '</h2>';
    if (bundle.modalSubtitle) {
      html += '<p class="ofr-sub">' + bundle.modalSubtitle + '</p>';
    }
    html += '</div></div>';

    // Body section
    html += '<div class="ofr-body">';

    // Tagline
    if (bundle.modalTagline) {
      html += '<p class="ofr-tagline">' + bundle.modalTagline + '</p>';
    }

    // Meta strip - Parse string format "Duration: 45 min • Cost: Complimentary"
    if (bundle.modalMeta && typeof bundle.modalMeta === 'string') {
      const metaParts = bundle.modalMeta.split('•').map((s: string) => s.trim()).filter((s: string) => s);
      if (metaParts.length > 0) {
        html += '<div class="ofr-meta">';
        metaParts.forEach((part: string) => {
          // Try to split by colon to get label: value
          const colonIndex = part.indexOf(':');
          let label = 'Info';
          let value = part;
          if (colonIndex > 0) {
            label = part.substring(0, colonIndex).trim();
            value = part.substring(colonIndex + 1).trim();
          }
          html += '<div class="ofr-meta__item">';
          html += '<span class="ofr-meta__label">' + label + '</span>';
          html += '<span class="ofr-meta__value">' + value + '</span>';
          html += '</div>';
        });
        html += '</div>';
      }
    }

    // Section 01 - Steps (The Plan)
    if (bundle.planItems && bundle.planItems.length > 0) {
      html += '<section class="ofr-sec">';
      html += '<span class="ofr-sec__num">' + (bundle.planNumber || '01 — In the room') + '</span>';
      html += '<h3 class="ofr-sec__title">' + (bundle.planTitle || 'What to <em>expect</em>') + '</h3>';
      html += '<ol class="ofr-steps">';
      bundle.planItems.forEach((item: any) => {
        html += '<li class="ofr-step">';
        html += '<div class="ofr-step__txt">';
        if (item.title) html += '<strong>' + item.title + '</strong>';
        if (item.description) html += '<span>' + item.description + '</span>';
        html += '</div>';
        if (item.time) html += '<span class="ofr-step__time">' + item.time + '</span>';
        html += '</li>';
      });
      html += '</ol>';
      html += '</section>';
    }

    // Section 02 - Results or Why (flexible)
    if (bundle.resultsItems && bundle.resultsItems.length > 0) {
      html += '<section class="ofr-sec">';
      html += '<span class="ofr-sec__num">' + (bundle.resultsNumber || '02 — Results') + '</span>';
      html += '<h3 class="ofr-sec__title">' + (bundle.resultsTitle || 'What you\'ll <em>achieve</em>') + '</h3>';
      if (bundle.resultsDescription) {
        html += '<p class="ofr-text">' + bundle.resultsDescription + '</p>';
      }
      html += '<div class="ofr-results">';
      bundle.resultsItems.forEach((r: any) => {
        html += '<div class="ofr-result">';
        html += '<svg class="ofr-result__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 13l4 4L19 7"/></svg>';
        html += '<div>';
        if (r.title) html += '<div class="ofr-result__t">' + r.title + '</div>';
        if (r.description) html += '<div class="ofr-result__d">' + r.description + '</div>';
        html += '</div>';
        html += '</div>';
      });
      html += '</div>';
      html += '</section>';
    }

    // Section 03 - Why (text or list)
    if (bundle.whyTitle || bundle.whyDescription) {
      html += '<section class="ofr-sec">';
      html += '<span class="ofr-sec__num">' + (bundle.whyNumber || '02 — Why') + '</span>';
      html += '<h3 class="ofr-sec__title">' + (bundle.whyTitle || 'Why it\'s <em>complimentary</em>') + '</h3>';
      if (bundle.whyDescription) {
        html += '<p class="ofr-text">' + bundle.whyDescription + '</p>';
      }
      if (bundle.whyItems && bundle.whyItems.length > 0) {
        html += '<ul class="ofr-list">';
        bundle.whyItems.forEach((item: any) => {
          html += '<li>';
          if (item.title) html += '<strong>' + item.title + '</strong> ';
          if (item.description) html += item.description;
          html += '</li>';
        });
        html += '</ul>';
      }
      html += '</section>';
    }

    // Price card
    if (bundle.modalPrice || bundle.cardPrice) {
      html += '<div class="ofr-price">';
      html += '<span class="ofr-price__mark">N</span>';
      html += '<div class="ofr-price__label">' + (bundle.priceLabel || 'Investment') + '</div>';
      html += '<div class="ofr-price__amount">' + (bundle.modalPrice || bundle.cardPrice) + '</div>';
      if (bundle.priceNote) {
        html += '<div class="ofr-price__note">' + bundle.priceNote + '</div>';
      }
      html += '</div>';
    }

    html += '</div></div>';

    body.innerHTML = html;

    // Build CTA section
    if (ctaEl) {
      const bundleName = bundle.modalTitle || bundle.cardTitle || bundle.name;
      const message = encodeURIComponent('Hello 🌸 I\'m coming from the Nouvelage services page about: *' + bundleName + '*');
      const whatsappUrl = 'https://api.whatsapp.com/send?phone=201000312528&text=' + message;

      ctaEl.innerHTML = '<a href="' + (bundle.ctaLink || whatsappUrl) + '" target="_blank" rel="noopener" class="offer-book">' + (bundle.modalCtaText || 'Book This Bundle') + '</a>'
        + '<a href="' + whatsappUrl + '" target="_blank" rel="noopener" class="btn-wa" aria-label="Send via WhatsApp" title="Send via WhatsApp">'
        + '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.886 2.909 4.371 2.909 7.026-.004 5.444-4.46 9.879-9.935 9.879M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"></path></svg>'
        + '</a>';
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  handleContactSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const name = (document.getElementById('fName') as HTMLInputElement)?.value;
    const phone = (document.getElementById('fPhone') as HTMLInputElement)?.value;
    const email = (document.getElementById('fEmail') as HTMLInputElement)?.value;
    const branch = (document.getElementById('fBranch') as HTMLSelectElement)?.value;
    const doctor = (document.getElementById('fDoctor') as HTMLSelectElement)?.value;
    const treatment = (document.getElementById('fTreatment') as HTMLSelectElement)?.value;
    const message = (document.getElementById('fMsg') as HTMLTextAreaElement)?.value;

    if (!name || !phone) {
      alert('Please fill in your name and phone number');
      return;
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Also send the lead to the Google Sheet (fire-and-forget; no-cors)
    this.googleSheetsService.sendToGoogleSheets(
      { name, phone, email: email || '', branch: branch || '', doctor: doctor || '', treatment: treatment || '', message: message || '' },
      'bundles'
    );

    // Save booking to Supabase
    this.bookingsService.createBooking({
      source: 'bundles_form',
      page_source: 'Bundles Page',
      first_name: firstName,
      last_name: lastName,
      email: email || '',
      phone: phone,
      preferred_branch: branch || undefined,
      preferred_doctor: doctor || undefined,
      treatment_interested: treatment || undefined,
      message: message || 'Inquiry about treatment bundles',
      booking_status: 'pending'
    }).subscribe({
      next: (booking) => {
        console.log('✅ Booking saved:', booking.booking_number);
      },
      error: (err) => {
        console.error('❌ Error saving booking:', err);
      }
    });

    const whatsappMessage = `Hello! I'm ${name}. I'd like to inquire about your treatment bundles. Please call me at ${phone}.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=201000312528&text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    const okMsg = document.getElementById('ctOk');
    if (okMsg) {
      okMsg.style.display = 'block';
      setTimeout(() => {
        okMsg.style.display = 'none';
      }, 5000);
    }
  }

  getBundleCountByParent(parentId: string): number {
    return this.allBundles.filter((b: any) => b.parentBundleId === parentId).length;
  }

  // Luxury Modal Methods
  renderLuxuryModal(bundle: any): void {
    const body = document.getElementById('offerModalBody');
    if (!body) return;

    // Reset quantity
    this.selectedQuantity = 1;

    // Build luxury catalogue modal HTML
    let html = '<div class="lux-modal">';

    // Package header
    html += '<div class="lux-header">';
    if (bundle.catalogueBadge) {
      html += '<div class="lux-badge">' + bundle.catalogueBadge + '</div>';
    }
    html += '<div class="lux-num">' + (bundle.cardNumber || '01') + '</div>';
    html += '<div class="lux-name">' + (bundle.modalTitle || bundle.cardTitle || bundle.name) + '</div>';
    if (bundle.catalogueTrigger || bundle.cardDescription) {
      html += '<div class="lux-trigger">' + (bundle.catalogueTrigger || bundle.cardDescription) + '</div>';
    }
    html += '</div>';

    // Services included
    if (bundle.servicesList && bundle.servicesList.length > 0) {
      html += '<div class="lux-services">';
      html += '<div class="lux-label">' + (bundle.servicesLabel || '— Includes') + '</div>';
      html += '<ul class="lux-list">';
      bundle.servicesList.forEach((item: any) => {
        html += '<li>' + item.service + '</li>';
      });
      html += '</ul>';
      html += '</div>';
    }

    // Meta row (Duration + Visits)
    if (bundle.duration || bundle.visits) {
      html += '<div class="lux-meta-row">';
      if (bundle.duration) {
        html += '<div class="lux-meta-item">';
        html += '<span class="lux-meta-lbl">DURATION</span>';
        html += '<span class="lux-meta-val">' + bundle.duration + '</span>';
        html += '</div>';
      }
      if (bundle.visits) {
        html += '<div class="lux-meta-item">';
        html += '<span class="lux-meta-lbl">VISITS</span>';
        html += '<span class="lux-meta-val">' + bundle.visits + '</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    // Pricing
    html += '<div class="lux-pricing">';
    if (bundle.priceOld) {
      html += '<span class="lux-price-old">' + bundle.priceOld + '</span>';
    }
    if (bundle.priceNew) {
      html += '<span class="lux-price-new">' + bundle.priceNew + '<span class="lux-price-unit">' + (bundle.priceUnit || 'EGP') + '</span></span>';
    }
    if (bundle.priceSave) {
      html += '<span class="lux-price-save">' + bundle.priceSave + '</span>';
    }
    html += '</div>';

    // Installment
    if (bundle.showInstallment && bundle.installmentText) {
      html += '<div class="lux-installment">' + bundle.installmentText + '</div>';
    }

    // Why box
    if (bundle.whyBoxText) {
      html += '<div class="lux-why-box">' + bundle.whyBoxText + '</div>';
    }

    // Channel
    if (bundle.channel) {
      html += '<div class="lux-divider"></div>';
      html += '<div class="lux-channel">' + bundle.channel + '</div>';
    }

    // Price note
    if (bundle.priceNote) {
      html += '<div class="lux-note">' + bundle.priceNote + '</div>';
    }

    // Quantity selector
    html += '<div class="lux-quantity">';
    html += '<label class="lux-qty-label">Quantity</label>';
    html += '<div class="lux-qty-controls">';
    html += '<button class="lux-qty-btn" onclick="window.bundlesComponent.decreaseQuantity()">−</button>';
    html += '<input type="number" id="luxQuantity" class="lux-qty-input" value="1" min="1" max="10" readonly />';
    html += '<button class="lux-qty-btn" onclick="window.bundlesComponent.increaseQuantity()">+</button>';
    html += '</div>';
    html += '</div>';

    // Action buttons
    html += '<div class="lux-actions">';
    html += '<button class="lux-btn lux-btn-cart" onclick="window.bundlesComponent.addToCartFromModal()">Add to Cart</button>';
    html += '<button class="lux-btn lux-btn-book" onclick="window.bundlesComponent.bookNowFromModal()">Book Now</button>';
    html += '</div>';

    html += '</div>';

    body.innerHTML = html;

    // Make component methods available globally for onclick handlers
    (window as any).bundlesComponent = this;
  }

  increaseQuantity(): void {
    if (this.selectedQuantity < 10) {
      this.selectedQuantity++;
      const input = document.getElementById('luxQuantity') as HTMLInputElement;
      if (input) input.value = this.selectedQuantity.toString();
    }
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
      const input = document.getElementById('luxQuantity') as HTMLInputElement;
      if (input) input.value = this.selectedQuantity.toString();
    }
  }

  addToCartFromModal(): void {
    if (!this.selectedBundle) return;

    const priceStr = this.selectedBundle.priceNew || this.selectedBundle.priceOld || this.selectedBundle.cardPrice || '0';
    const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;

    this.cartService.addToCart({
      id: this.selectedBundle.id,
      type: 'bundle',
      name: this.selectedBundle.modalTitle || this.selectedBundle.cardTitle || this.selectedBundle.name,
      price: priceNum,
      quantity: this.selectedQuantity,
      image: this.selectedBundle.cardImage || '',
      branch: 'Main Branch'
    });

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'cart-success-toast';
    successMsg.textContent = `✓ Added ${this.selectedQuantity}x ${this.selectedBundle.cardTitle} to cart`;
    document.body.appendChild(successMsg);

    setTimeout(() => {
      successMsg.classList.add('show');
    }, 10);

    setTimeout(() => {
      successMsg.classList.remove('show');
      setTimeout(() => successMsg.remove(), 300);
    }, 3000);
  }

  bookNowFromModal(): void {
    this.addToCartFromModal();
    this.closeOffer();
    this.router.navigate(['/checkout']);
  }
}
