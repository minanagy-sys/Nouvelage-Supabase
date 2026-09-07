import { Injectable } from '@angular/core';

// Interfaces
export interface ServiceOffer {
  id: string;
  coverImage: string; // ofr-cover
  eyebrow: string; // ofr-tagline
  title: string; // ofr-meta line 1
  subtitle: string; // ofr-meta line 2
  description: string; // ofr-sec
  ctaText: string; // svc-cta button text
  ctaLink: string; // svc-cta button link
  serviceId?: string; // Link to main service for modal
  order: number;
}

export interface ServiceSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
}

export interface ServiceProduct {
  name: string;
  image?: string;
}

export interface ServiceGalleryImage {
  before: string;
  after: string;
  doctorId?: string; // Doctor who performed this
}

export interface ServiceTimeline {
  step: number;
  title: string;
  description: string;
  time?: string; // e.g., "15 min", "Day 1-3", "Week 1"
}

export interface ServiceBenefit {
  title: string;
  subtitle: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  parentService: string; // Parent service category (e.g., 'Skincare', 'Injectables')

  // Supabase fields (from actual database schema)
  subtitle?: string;
  description?: string;
  category?: string;
  price?: string;
  priceUnit?: string;

  // Card display fields (appears in services grid)
  cardImage: string; // si-media
  cardRibbon?: string; // si-ribbon (e.g., "Most Popular", "New")
  cardNumber: string; // si-num (e.g., "01", "02")
  cardTitle: string; // .svc-item h3
  cardDescription: string; // .svc-item p
  cardPrice: string; // si-price (e.g., "From 500 EGP")
  cardButtonText: string; // si-cart button text

  // Treatment details popup/modal
  modalTitle: string; // svcModalNav
  heroBackgroundImage: string; // svc-hero-track (same bg as cart)
  detailTitle: string; // svc-title
  detailSubtitle: string; // svc-subtitle
  detailTagline: string; // svc-tagline

  // Meta strip (duration, downtime, lasts, sessions)
  metaDuration: string; // e.g., "30-60 min"
  metaDowntime: string; // e.g., "None"
  metaLasts: string; // e.g., "6-12 months"
  metaSessions: string; // e.g., "1-3 sessions"

  // Sections
  howItWorksSteps: ServiceTimeline[]; // svc-section: How it works with steps
  timeline: ServiceTimeline[]; // svc-section: Timeline
  whatYouAchieve: ServiceBenefit[]; // svc-section: What you will achieve (list of benefits with title and subtitle)
  productsUsed: ServiceProduct[]; // svc-section: Products we use (can add/remove)

  // Before & After Gallery
  gallery: ServiceGalleryImage[]; // svc-section: Gallery for doctors that provide this service

  // Your Specialists section
  specialistDoctorIds: string[]; // Doctors who provide this service

  // Pricing section
  priceDetails: string; // svc-section: Price section details

  // CTA button
  ctaButtonText: string; // svc-cta button text
  whatsappNumber: string; // WhatsApp button beside add to cart
  whatsappButtonText?: string; // Optional custom WhatsApp button text

  // Doctor modal inside service modal
  // Uses doctor data from doctors service:
  // - doc-hero__avatar (doctor image)
  // - doc-hero__name (doctor name)
  // - doc-hero__role (specialization from doctor)
  // - doc-stats (services count, before/after cases, years of experience)
  // - doc-bio (from doctor single page)
  // - doc-services-grid (services every doctor provides)
  // - doc-cta__book (button text and link from doctor)

  // Visibility & Management
  isActive: boolean;
  showInGrid: boolean;
  showPrice: boolean; // Show price and add to cart button
  order: number;

  // Offer Modal Display (when service appears in slider)
  offerCoverImage?: string;
  offerEyebrow?: string;
  offerTitle?: string;
  offerSubtitle?: string;
  offerDescription?: string;
  offerCtaText?: string;
  offerCtaLink?: string;

  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private servicesKey = 'services_data';
  private offersKey = 'service_offers_data';

  constructor() {
    this.initializeDefaultData();
  }

  // localStorage is absent during server-side rendering; these helpers make
  // every persistence call a safe no-op there.
  private storageGet(key: string): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  }

  private storageSet(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  }

  private storageRemove(key: string): void {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  }

  // ============ SERVICES ============

  getAllServices(): Service[] {
    const data = this.storageGet(this.servicesKey);
    return data ? JSON.parse(data) : [];
  }

  getActiveServices(): Service[] {
    return this.getAllServices().filter(s => s.isActive);
  }

  getServicesByCategory(category: string): Service[] {
    return this.getAllServices().filter(s => s.parentService === category && s.isActive);
  }

  getServiceById(id: string): Service | null {
    const services = this.getAllServices();
    return services.find(s => s.id === id) || null;
  }

  getServiceBySlug(slug: string): Service | null {
    const services = this.getAllServices();
    return services.find(s => s.slug === slug) || null;
  }

  getServicesForGrid(): Service[] {
    return this.getAllServices()
      .filter(s => s.isActive && s.showInGrid)
      .sort((a, b) => a.order - b.order);
  }

  getCategories(): string[] {
    const services = this.getAllServices();
    const categories = services.map(s => s.parentService);
    return Array.from(new Set(categories)).sort();
  }

  getParentServices(): string[] {
    return ['Skincare', 'Injectables', 'Hair', 'Laser'];
  }

  getServicesByParent(parentService: string): Service[] {
    return this.getAllServices().filter(s => s.parentService === parentService && s.isActive);
  }

  addService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const services = this.getAllServices();
    const newService: Service = {
      ...service,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    services.push(newService);
    this.saveServices(services);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const services = this.getAllServices();
    const index = services.findIndex(s => s.id === id);
    if (index === -1) return null;

    services[index] = {
      ...services[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveServices(services);
    return services[index];
  }

  deleteService(id: string): boolean {
    const services = this.getAllServices();
    const filtered = services.filter(s => s.id !== id);
    if (filtered.length === services.length) return false;
    this.saveServices(filtered);
    return true;
  }

  reorderServices(serviceIds: string[]): void {
    const services = this.getAllServices();
    serviceIds.forEach((id, index) => {
      const service = services.find(s => s.id === id);
      if (service) service.order = index;
    });
    this.saveServices(services);
  }

  // ============ OFFERS SLIDER ============

  getAllOffers(): ServiceOffer[] {
    const data = this.storageGet(this.offersKey);
    return data ? JSON.parse(data) : [];
  }

  getActiveOffers(): ServiceOffer[] {
    return this.getAllOffers().sort((a, b) => a.order - b.order);
  }

  getOfferById(id: string): ServiceOffer | null {
    const offers = this.getAllOffers();
    return offers.find(o => o.id === id) || null;
  }

  addOffer(offer: Omit<ServiceOffer, 'id'>): ServiceOffer {
    const offers = this.getAllOffers();
    const newOffer: ServiceOffer = {
      ...offer,
      id: this.generateId()
    };
    offers.push(newOffer);
    this.saveOffers(offers);
    return newOffer;
  }

  updateOffer(id: string, updates: Partial<ServiceOffer>): ServiceOffer | null {
    const offers = this.getAllOffers();
    const index = offers.findIndex(o => o.id === id);
    if (index === -1) return null;

    offers[index] = { ...offers[index], ...updates };
    this.saveOffers(offers);
    return offers[index];
  }

  deleteOffer(id: string): boolean {
    const offers = this.getAllOffers();
    const filtered = offers.filter(o => o.id !== id);
    if (filtered.length === offers.length) return false;
    this.saveOffers(filtered);
    return true;
  }

  reorderOffers(offerIds: string[]): void {
    const offers = this.getAllOffers();
    offerIds.forEach((id, index) => {
      const offer = offers.find(o => o.id === id);
      if (offer) offer.order = index;
    });
    this.saveOffers(offers);
  }

  // ============ HELPERS ============

  private saveServices(services: Service[]): void {
    this.storageSet(this.servicesKey, JSON.stringify(services));
  }

  private saveOffers(offers: ServiceOffer[]): void {
    this.storageSet(this.offersKey, JSON.stringify(offers));
  }

  private generateId(): string {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ============ INITIALIZE DEFAULT DATA ============

  // Reset services to default data from live website
  resetServicesToDefaults(): void {
    this.storageRemove(this.servicesKey);
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    // Only initialize if no data exists
    if (!this.storageGet(this.servicesKey)) {
      const defaultServices: Service[] = [
        {
          id: 'svc_slim_age',
          name: 'Slim Age Injection',
          slug: 'slim-age',
          parentService: 'Injectables',
          cardImage: '/assets/img/services/slim-age.jpg',
          cardRibbon: 'Non-Surgical',
          cardNumber: '01',
          cardTitle: 'Slim Age Injection',
          cardDescription: 'Targeted fat-dissolving and contour refinement, without surgery or downtime.',
          cardPrice: 'From EGP 4,500',
          cardButtonText: 'Book Now',
          modalTitle: 'Slim Age Injection',
          heroBackgroundImage: '/assets/img/services/hero-slim-age.jpg',
          detailTitle: 'Slim Age Injection',
          detailSubtitle: 'Non-Surgical Body Contouring',
          detailTagline: 'Targeted fat-dissolving treatment for natural contour refinement',
          metaDuration: '30-45 min',
          metaDowntime: 'Minimal',
          metaLasts: '6-12 months',
          metaSessions: '2-4 sessions',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 4,500 EGP per treatment area. Package discounts available.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_hydrafacial',
          name: 'HydraFacial',
          slug: 'hydrafacial',
          parentService: 'Skincare',
          cardImage: '/assets/img/services/hydrafacial.jpg',
          cardRibbon: 'Skin Care',
          cardNumber: '02',
          cardTitle: 'HydraFacial',
          cardDescription: 'Deep-cleanse, exfoliate and hydrate for an instant, lasting glow.',
          cardPrice: 'From EGP 2,200',
          cardButtonText: 'Book Now',
          modalTitle: 'HydraFacial',
          heroBackgroundImage: '/assets/img/services/hero-hydrafacial.jpg',
          detailTitle: 'HydraFacial',
          detailSubtitle: 'Medical-Grade Facial Treatment',
          detailTagline: 'Deep cleansing, exfoliation, and hydration in one treatment',
          metaDuration: '30-45 min',
          metaDowntime: 'None',
          metaLasts: '4-6 weeks',
          metaSessions: 'Monthly recommended',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 2,200 EGP per session.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_botox',
          name: 'Botox',
          slug: 'botox',
          parentService: 'Injectables',
          cardImage: '/assets/img/services/botox.jpg',
          cardRibbon: 'Injectables',
          cardNumber: '03',
          cardTitle: 'Botox',
          cardDescription: 'Soften expression lines while keeping movement natural and expressive.',
          cardPrice: 'From EGP 3,000',
          cardButtonText: 'Book Now',
          modalTitle: 'Botox',
          heroBackgroundImage: '/assets/img/services/hero-botox.jpg',
          detailTitle: 'Botox',
          detailSubtitle: 'Premium Anti-Aging Injectable',
          detailTagline: 'Natural wrinkle reduction with precision results',
          metaDuration: '15-30 min',
          metaDowntime: 'None',
          metaLasts: '3-6 months',
          metaSessions: '1 session',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 3,000 EGP per area.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_dermal_fillers',
          name: 'Dermal Fillers',
          slug: 'dermal-fillers',
          parentService: 'Injectables',
          cardImage: '/assets/img/services/dermal-fillers.jpg',
          cardRibbon: 'Injectables',
          cardNumber: '04',
          cardTitle: 'Dermal Fillers',
          cardDescription: 'Restore volume and refine contours with premium hyaluronic fillers.',
          cardPrice: 'From EGP 6,500',
          cardButtonText: 'Book Now',
          modalTitle: 'Dermal Fillers',
          heroBackgroundImage: '/assets/img/services/hero-fillers.jpg',
          detailTitle: 'Dermal Fillers',
          detailSubtitle: 'Volume Restoration',
          detailTagline: 'Natural volume enhancement with hyaluronic acid',
          metaDuration: '30-60 min',
          metaDowntime: 'Minimal',
          metaLasts: '9-18 months',
          metaSessions: '1 session',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 6,500 EGP per syringe.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 4,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_skin_booster',
          name: 'Skin Booster',
          slug: 'skin-booster',
          parentService: 'Injectables',
          cardImage: '/assets/img/services/skin-booster.jpg',
          cardRibbon: 'Injectables',
          cardNumber: '05',
          cardTitle: 'Skin Booster',
          cardDescription: 'Micro-infusions of hydration for luminous, dewy skin.',
          cardPrice: 'From EGP 5,000',
          cardButtonText: 'Book Now',
          modalTitle: 'Skin Booster',
          heroBackgroundImage: '/assets/img/services/hero-skin-booster.jpg',
          detailTitle: 'Skin Booster',
          detailSubtitle: 'Deep Hydration Treatment',
          detailTagline: 'Micro-injections for natural radiance and hydration',
          metaDuration: '30 min',
          metaDowntime: 'None',
          metaLasts: '6-9 months',
          metaSessions: '2-3 sessions',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 5,000 EGP per session.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_face_plasma',
          name: 'Face Plasma',
          slug: 'face-plasma',
          parentService: 'Injectables',
          cardImage: '/assets/img/services/face-plasma.jpg',
          cardRibbon: 'Injectables',
          cardNumber: '06',
          cardTitle: 'Face Plasma',
          cardDescription: 'PRP plasma to renew tone, texture and natural radiance.',
          cardPrice: 'From EGP 4,000',
          cardButtonText: 'Book Now',
          modalTitle: 'Face Plasma',
          heroBackgroundImage: '/assets/img/services/hero-face-plasma.jpg',
          detailTitle: 'Face Plasma (PRP)',
          detailSubtitle: 'Regenerative Skin Treatment',
          detailTagline: 'Natural platelet-rich plasma for skin rejuvenation',
          metaDuration: '45-60 min',
          metaDowntime: 'Minimal',
          metaLasts: '6-12 months',
          metaSessions: '3-4 sessions',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 4,000 EGP per session.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 6,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_gcell_hair',
          name: 'G-Cell Hair Treatment',
          slug: 'g-cell-hair',
          parentService: 'Hair',
          cardImage: '/assets/img/services/gcell-hair.jpg',
          cardRibbon: 'Hair',
          cardNumber: '07',
          cardTitle: 'G-Cell Hair Treatment',
          cardDescription: 'Advanced cellular therapy to strengthen and densify hair.',
          cardPrice: 'From EGP 5,500',
          cardButtonText: 'Book Now',
          modalTitle: 'G-Cell Hair Treatment',
          heroBackgroundImage: '/assets/img/services/hero-gcell.jpg',
          detailTitle: 'G-Cell Hair Treatment',
          detailSubtitle: 'Advanced Cellular Hair Therapy',
          detailTagline: 'Innovative stem cell technology for hair restoration',
          metaDuration: '60-90 min',
          metaDowntime: 'Minimal',
          metaLasts: '12-18 months',
          metaSessions: '3-6 sessions',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 5,500 EGP per session.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 7,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_hair_plasma',
          name: 'Hair Plasma (PRP)',
          slug: 'hair-plasma',
          parentService: 'Hair',
          cardImage: '/assets/img/services/hair-plasma.jpg',
          cardRibbon: 'Hair',
          cardNumber: '08',
          cardTitle: 'Hair Plasma (PRP)',
          cardDescription: 'Regenerative plasma to reduce shedding and support growth.',
          cardPrice: 'From EGP 4,000',
          cardButtonText: 'Book Now',
          modalTitle: 'Hair Plasma (PRP)',
          heroBackgroundImage: '/assets/img/services/hero-hair-plasma.jpg',
          detailTitle: 'Hair Plasma (PRP)',
          detailSubtitle: 'Regenerative Hair Treatment',
          detailTagline: 'Natural growth factors for hair restoration',
          metaDuration: '45-60 min',
          metaDowntime: 'None',
          metaLasts: '6-12 months',
          metaSessions: '4-6 sessions',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 4,000 EGP per session.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_regenera',
          name: 'Regenera Activa',
          slug: 'regenera-activa',
          parentService: 'Hair',
          cardImage: '/assets/img/services/regenera.jpg',
          cardRibbon: 'Hair',
          cardNumber: '09',
          cardTitle: 'Regenera Activa',
          cardDescription: 'One-session regenerative micro-graft for natural restoration.',
          cardPrice: 'From EGP 18,000',
          cardButtonText: 'Book Now',
          modalTitle: 'Regenera Activa',
          heroBackgroundImage: '/assets/img/services/hero-regenera.jpg',
          detailTitle: 'Regenera Activa',
          detailSubtitle: 'Advanced Hair Restoration',
          detailTagline: 'Single-session regenerative micro-graft technology',
          metaDuration: '90-120 min',
          metaDowntime: 'Minimal',
          metaLasts: '12+ months',
          metaSessions: '1 session',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 18,000 EGP per treatment.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 9,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_laser_hair',
          name: 'Laser Hair Removal',
          slug: 'laser-hair-removal',
          parentService: 'Laser',
          cardImage: '/assets/img/services/laser-hair.jpg',
          cardRibbon: 'Laser',
          cardNumber: '10',
          cardTitle: 'Laser Hair Removal',
          cardDescription: 'DEKA-certified laser, safe for every skin tone — lasting reduction.',
          cardPrice: 'From EGP 1,500',
          cardButtonText: 'Book Now',
          modalTitle: 'Laser Hair Removal',
          heroBackgroundImage: '/assets/img/services/hero-laser-hair.jpg',
          detailTitle: 'Laser Hair Removal',
          detailSubtitle: 'DEKA™ Italian Technology',
          detailTagline: 'Safe, effective, permanent hair reduction for all skin types',
          metaDuration: '15-60 min',
          metaDowntime: 'None',
          metaLasts: 'Permanent',
          metaSessions: '6-8 sessions',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 1,500 EGP per area. Package discounts available.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_chemical_peel',
          name: 'Chemical Peel',
          slug: 'chemical-peel',
          parentService: 'Skincare',
          cardImage: '/assets/img/services/chemical-peel.jpg',
          cardRibbon: 'Skin Care',
          cardNumber: '11',
          cardTitle: 'Chemical Peel',
          cardDescription: 'Medical-grade peels for tone, texture and clarity.',
          cardPrice: 'From EGP 2,000',
          cardButtonText: 'Book Now',
          modalTitle: 'Chemical Peel',
          heroBackgroundImage: '/assets/img/services/hero-chemical-peel.jpg',
          detailTitle: 'Chemical Peel',
          detailSubtitle: 'Medical-Grade Skin Resurfacing',
          detailTagline: 'Professional peels for improved tone and texture',
          metaDuration: '30-45 min',
          metaDowntime: '3-7 days',
          metaLasts: '3-6 months',
          metaSessions: '3-6 sessions',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 2,000 EGP per session.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 11,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_laser_resurfacing',
          name: 'Laser Skin Resurfacing',
          slug: 'laser-resurfacing',
          parentService: 'Laser',
          cardImage: '/assets/img/services/laser-resurfacing.jpg',
          cardRibbon: 'Laser',
          cardNumber: '12',
          cardTitle: 'Laser Skin Resurfacing',
          cardDescription: 'Refine pores, scars and texture with precision fractional laser.',
          cardPrice: 'From EGP 3,800',
          cardButtonText: 'Book Now',
          modalTitle: 'Laser Skin Resurfacing',
          heroBackgroundImage: '/assets/img/services/hero-laser-resurfacing.jpg',
          detailTitle: 'Laser Skin Resurfacing',
          detailSubtitle: 'Fractional Laser Technology',
          detailTagline: 'Advanced laser treatment for skin texture and tone',
          metaDuration: '30-60 min',
          metaDowntime: '5-7 days',
          metaLasts: '12+ months',
          metaSessions: '3-5 sessions',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 3,800 EGP per session.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 12,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_mesotherapy',
          name: 'Mesotherapy',
          slug: 'mesotherapy',
          parentService: 'Skincare',
          cardImage: '/assets/img/services/mesotherapy.jpg',
          cardRibbon: 'Skin Care',
          cardNumber: '13',
          cardTitle: 'Mesotherapy',
          cardDescription: 'Vitamin-rich micro-infusions tailored to your skin goals.',
          cardPrice: 'From EGP 2,800',
          cardButtonText: 'Book Now',
          modalTitle: 'Mesotherapy',
          heroBackgroundImage: '/assets/img/services/hero-mesotherapy.jpg',
          detailTitle: 'Mesotherapy',
          detailSubtitle: 'Targeted Nutrient Delivery',
          detailTagline: 'Customized vitamin and mineral micro-injections',
          metaDuration: '30 min',
          metaDowntime: 'None',
          metaLasts: '4-6 months',
          metaSessions: '4-6 sessions',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 2,800 EGP per session.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 13,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_carbon_laser',
          name: 'Carbon Laser Facial',
          slug: 'carbon-laser',
          parentService: 'Laser',
          cardImage: '/assets/img/services/carbon-laser.jpg',
          cardRibbon: 'Laser',
          cardNumber: '14',
          cardTitle: 'Carbon Laser Facial',
          cardDescription: 'The "red carpet" facial for instant glow and refined pores.',
          cardPrice: 'From EGP 2,500',
          cardButtonText: 'Book Now',
          modalTitle: 'Carbon Laser Facial',
          heroBackgroundImage: '/assets/img/services/hero-carbon-laser.jpg',
          detailTitle: 'Carbon Laser Facial',
          detailSubtitle: 'Hollywood Peel Treatment',
          detailTagline: 'Instant radiance and pore refinement',
          metaDuration: '30-45 min',
          metaDowntime: 'None',
          metaLasts: '4-8 weeks',
          metaSessions: 'Monthly',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 2,500 EGP per session.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 14,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_thread_lift',
          name: 'Thread Lift',
          slug: 'thread-lift',
          parentService: 'Injectables',
          cardImage: '/assets/img/services/thread-lift.jpg',
          cardRibbon: 'Non-Surgical',
          cardNumber: '15',
          cardTitle: 'Thread Lift',
          cardDescription: 'Subtle lifting and support with dissolvable PDO threads.',
          cardPrice: 'From EGP 12,000',
          cardButtonText: 'Book Now',
          modalTitle: 'Thread Lift',
          heroBackgroundImage: '/assets/img/services/hero-thread-lift.jpg',
          detailTitle: 'Thread Lift',
          detailSubtitle: 'Non-Surgical Facelift',
          detailTagline: 'Natural lifting with absorbable PDO threads',
          metaDuration: '45-90 min',
          metaDowntime: '3-7 days',
          metaLasts: '12-18 months',
          metaSessions: '1 session',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Starting from 12,000 EGP per treatment area.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'svc_consultation',
          name: 'Consultation',
          slug: 'consultation',
          parentService: 'Skincare',
          cardImage: '/assets/img/services/consultation.jpg',
          cardRibbon: 'Visit',
          cardNumber: '16',
          cardTitle: 'Consultation',
          cardDescription: 'A complimentary, no-pressure plan built entirely around you.',
          cardPrice: 'Complimentary',
          cardButtonText: 'Book Now',
          modalTitle: 'Consultation',
          heroBackgroundImage: '/assets/img/services/hero-consultation.jpg',
          detailTitle: 'Complimentary Consultation',
          detailSubtitle: 'Personalized Treatment Planning',
          detailTagline: 'Expert assessment and customized treatment recommendations',
          metaDuration: '30-45 min',
          metaDowntime: 'None',
          metaLasts: 'N/A',
          metaSessions: '1 session',
          howItWorksSteps: [],
          timeline: [],
          whatYouAchieve: [],
          productsUsed: [],
          gallery: [],
          specialistDoctorIds: [],
          priceDetails: 'Complimentary consultation with our specialists.',
          ctaButtonText: 'Book Consultation',
          whatsappNumber: '201000312528',
          whatsappButtonText: 'Chat on WhatsApp',
          isActive: true,
          showInGrid: true,
          showPrice: true,
          order: 16,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.saveServices(defaultServices);
    }

    if (!this.storageGet(this.offersKey)) {
      const defaultOffers: ServiceOffer[] = [
        {
          id: 'offer_1',
          coverImage: '/assets/img/offer-laser.jpg',
          eyebrow: 'LIMITED TIME OFFER',
          title: 'Laser Hair Removal',
          subtitle: '50% Off First Session',
          description: 'Experience our DEKA™ Italian laser technology at half price for your first treatment',
          ctaText: 'Book Now',
          ctaLink: '/contact',
          serviceId: 'svc_laser_hair',
          order: 0
        }
      ];
      this.saveOffers(defaultOffers);
    }
  }
}
