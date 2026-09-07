import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { DemoModeService } from '../../admin/services/demo-mode.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CartFlyoutComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  // Brand Header Logo
  logoUrl = '/assets/img/nouvelage-logo-white.svg';
  logoAlt = 'Nouvelage® Aesthetic Clinics';

  // For Her Panel
  forherBgImage = '/assets/img/home-for-her.jpg';
  forherEyebrow = 'LUXURY TREATMENTS';
  forherWelcome = 'For Her';
  forherSubtitle = 'Embrace Your Natural Beauty';
  forherCtaText = 'Explore Services';
  forherCtaLink = '/forher';

  // For Him Panel
  forhimBgImage = '/assets/img/home-for-him.jpg';
  forhimEyebrow = 'PREMIUM GROOMING';
  forhimWelcome = 'For Him';
  forhimSubtitle = 'Redefine Your Confidence';
  forhimCtaText = 'Discover Treatments';
  forhimCtaLink = '/forhim';

  // Locations
  locations = 'Zamalek, Cairo • New Cairo • 6th of October';

  // Display Settings
  animationDuration = 1000;
  overlayOpacity = 0.6;

  constructor(
    private router: Router,
    private http: HttpClient,
    private demoModeService: DemoModeService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    // Page title + Open Graph tags for the Home page
    this.title.setTitle('Nouvelage Clinics');
    const homeOgImage = 'https://www.nouvelage.clinic/og-home.png';
    const homeDesc = 'Luxury aesthetic, skin, and wellness treatments where beauty meets medical excellence.';
    this.meta.updateTag({ property: 'og:title', content: 'Nouvelage Clinics' });
    this.meta.updateTag({ property: 'og:description', content: homeDesc });
    this.meta.updateTag({ property: 'og:image', content: homeOgImage });
    this.meta.updateTag({ property: 'og:url', content: 'https://www.nouvelage.clinic/' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Nouvelage Clinics' });
    this.meta.updateTag({ name: 'twitter:image', content: homeOgImage });

    // Load content from API if available
    this.loadPageContent();
  }

  loadPageContent(): void {
    // Use demo mode service to get content (works with localStorage)
    if (this.demoModeService.isDemoModeEnabled()) {
      const content = this.demoModeService.getDemoPageContent('landing');

      // Brand Header Logo
      this.logoUrl = content.logo_url || this.logoUrl;
      this.logoAlt = content.logo_alt || this.logoAlt;

      // For Her Panel
      this.forherBgImage = content.forher_bg_image || this.forherBgImage;
      this.forherEyebrow = content.forher_eyebrow || this.forherEyebrow;
      this.forherWelcome = content.forher_welcome || this.forherWelcome;
      this.forherSubtitle = content.forher_subtitle || this.forherSubtitle;
      this.forherCtaText = content.forher_cta_text || this.forherCtaText;
      this.forherCtaLink = content.forher_cta_link || this.forherCtaLink;

      // For Him Panel
      this.forhimBgImage = content.forhim_bg_image || this.forhimBgImage;
      this.forhimEyebrow = content.forhim_eyebrow || this.forhimEyebrow;
      this.forhimWelcome = content.forhim_welcome || this.forhimWelcome;
      this.forhimSubtitle = content.forhim_subtitle || this.forhimSubtitle;
      this.forhimCtaText = content.forhim_cta_text || this.forhimCtaText;
      this.forhimCtaLink = content.forhim_cta_link || this.forhimCtaLink;

      // Locations
      this.locations = content.locations || this.locations;

      // Display Settings
      this.animationDuration = content.animation_duration || this.animationDuration;
      this.overlayOpacity = content.overlay_opacity || this.overlayOpacity;
    } else {
      // Try to load content from backend API
      this.http.get<any>('http://localhost:5000/api/pages/landing').subscribe({
        next: (response) => {
          if (response.page) {
            const content = response.page;

            // Brand Header Logo
            this.logoUrl = content.logo_url || this.logoUrl;
            this.logoAlt = content.logo_alt || this.logoAlt;

            // For Her Panel
            this.forherBgImage = content.forher_bg_image || this.forherBgImage;
            this.forherEyebrow = content.forher_eyebrow || this.forherEyebrow;
            this.forherWelcome = content.forher_welcome || this.forherWelcome;
            this.forherSubtitle = content.forher_subtitle || this.forherSubtitle;
            this.forherCtaText = content.forher_cta_text || this.forherCtaText;
            this.forherCtaLink = content.forher_cta_link || this.forherCtaLink;

            // For Him Panel
            this.forhimBgImage = content.forhim_bg_image || this.forhimBgImage;
            this.forhimEyebrow = content.forhim_eyebrow || this.forhimEyebrow;
            this.forhimWelcome = content.forhim_welcome || this.forhimWelcome;
            this.forhimSubtitle = content.forhim_subtitle || this.forhimSubtitle;
            this.forhimCtaText = content.forhim_cta_text || this.forhimCtaText;
            this.forhimCtaLink = content.forhim_cta_link || this.forhimCtaLink;

            // Locations
            this.locations = content.locations || this.locations;

            // Display Settings
            this.animationDuration = content.animation_duration || this.animationDuration;
            this.overlayOpacity = content.overlay_opacity || this.overlayOpacity;
          }
        },
        error: (error) => {
          // If API call fails, use default values (already set)
          console.log('Using default landing page content');
        }
      });
    }
  }

  navigateToHer(): void {
    this.router.navigate([this.forherCtaLink || '/forher']);
  }

  navigateToHim(): void {
    this.router.navigate([this.forhimCtaLink || '/forhim']);
  }
}
