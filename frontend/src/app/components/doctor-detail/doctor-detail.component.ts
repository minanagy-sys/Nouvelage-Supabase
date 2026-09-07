import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DOCS, SVC_DOCTORS, SERVICES_DATA, Service, Doctor as OldDoctor } from '../services/services.data';
import { CasesService, BeforeAfterCase } from '../services/cases.service';
import { DoctorsService, Doctor } from '../../admin/services/doctors.service';
import { ServicesService, Service as BackendService } from '../../admin/services/services.service';
import { ContentService } from '../../shared/services/content.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { BookingsService } from '../../admin/services/bookings.service';

// Treatment descriptions from the HTML original
const TREAT: { [key: string]: string } = {
  "Laser": "Medical-grade laser for hair reduction, resurfacing and pigment correction.",
  "Injectables": "Botulinum and filler artistry for balanced, natural movement.",
  "Anti-Ageing": "Preventative and corrective protocols designed to age gracefully.",
  "Fillers": "Hyaluronic volume restoration with a meticulous eye for proportion.",
  "Botox": "Softens expression lines while keeping the face expressive.",
  "Skin Rejuv": "Boosters, peels and energy devices for luminous, healthy skin.",
  "Skin Treatments": "Evidence-led medical care for skin barrier, tone and texture.",
  "Acne": "Active acne and breakout management with long-term clarity in mind.",
  "Peels": "Chemical resurfacing tuned to your skin type and goals.",
  "Lip Design": "Soft, proportionate lip enhancement that suits your features.",
  "Body Sculpt": "Non-surgical contouring and fat-reduction protocols.",
  "Tightening": "Energy-based skin tightening for firmer contours.",
  "Pigmentation": "Targeted correction of melasma, sun damage and uneven tone.",
  "Surgical": "Precision surgical refinement, planned around natural anatomy.",
  "Rhinoplasty": "Functional and aesthetic nasal refinement.",
  "Lifts": "Surgical and thread-based lifting for a rested, natural result.",
  "PRP": "Platelet-rich plasma to stimulate skin and hair renewal.",
  "Transplant": "Natural-design hair restoration and grafting.",
  "Mesotherapy": "Micro-infusions of nutrients for skin and scalp vitality.",
  "IV Therapy": "Wellness infusions that support skin health from within.",
  "Collagen": "Collagen-stimulating treatments for resilient, youthful skin.",
  "Wellness": "Inside-out programmes that pair beauty with wellbeing.",
  "Scarring": "Resurfacing and remodelling for smoother scar texture.",
  "Rosacea": "Calming protocols for redness and sensitive skin.",
  "Exosomes": "Next-generation regenerative skin and hair therapy.",
  "Skin Boosters": "Deep-hydration micro-injections for a dewy finish.",
  "Nutrition": "Nutritional guidance that supports lasting skin health.",
  "Skin Health": "Holistic skin-health planning beyond the treatment room.",
  "Hormonal": "Hormone-aware care for skin and long-term balance."
};

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CartFlyoutComponent],
  templateUrl: './doctor-detail.component.html',
  styleUrl: './doctor-detail.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DoctorDetailComponent implements OnInit {
  // Doctor detail page - exact recreation of doctor.html
  doctor: Doctor | null = null;
  doctorId: string = '';
  firstName: string = '';
  services: Service[] = [];
  doctorServices: BackendService[] = []; // Real services from ServicesService
  otherDoctors: any[] = [];
  caseCount: string = '—';
  yearsExp: string = '—';
  beforeAfterCases: BeforeAfterCase[] = [];
  selectedCategory: string = 'all';
  showAllCases: boolean = false;
  availableCategories: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private casesService: CasesService,
    private doctorsService: DoctorsService,
    private servicesService: ServicesService,
    private supabaseService: ContentService,
    private bookingsService: BookingsService
  ) {}

  ngOnInit() {
    // Add scroll listener for sticky nav
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        const nav = document.querySelector('.nav');
        if (nav) {
          if (window.scrollY > 50) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
        }
      });
    }

    // Get doctor slug from route parameter
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        // Try to get doctor from Supabase first
        this.supabaseService.getDoctorBySlug(slug).subscribe({
          next: (doctorFromSupabase) => {
            if (doctorFromSupabase) {
              // Use Supabase data and map to component format
              this.doctorId = doctorFromSupabase.id;
              this.doctor = {
                ...doctorFromSupabase,
                profileImage: doctorFromSupabase.profile_image,
                img: doctorFromSupabase.profile_image
              } as any;
              this.firstName = doctorFromSupabase.name.replace('Dr. ', '').split(' ')[0];
              this.caseCount = doctorFromSupabase.before_after_gallery?.length.toString() || '0';
              this.yearsExp = doctorFromSupabase.experience.toString();
              this.services = []; // Will be loaded by loadDoctorServices
              this.loadDoctorServices(doctorFromSupabase.id);
              this.loadOtherDoctorsFromSupabase(doctorFromSupabase.id);

              // Use before_after_gallery from doctor data
              this.beforeAfterCases = (doctorFromSupabase.before_after_gallery || [])
                .filter(ba => ba.before && ba.after)
                .map(ba => ({
                  before: ba.before,
                  after: ba.after,
                  caption: ba.caption || 'Treatment result',
                  category: 'all', // Default category
                  desc: ba.caption || ''
                }));

              const categories = new Set<string>();
              this.beforeAfterCases.forEach(c => {
                if (c.category) categories.add(c.category);
              });
              this.availableCategories = Array.from(categories).sort();
            } else {
              // Fallback to hardcoded service
              this.loadFromHardcodedService(slug);
            }
          },
          error: (err) => {
            console.error('Error loading doctor from Supabase, falling back:', err);
            this.loadFromHardcodedService(slug);
          }
        });
      } else {
        // No slug provided, redirect to home
        this.router.navigate(['/']);
      }
    });
  }

  private loadFromHardcodedService(slug: string): void {
    // Try to get doctor from DoctorsService first
    const doctorFromService = this.doctorsService.getDoctorBySlug(slug);

    if (doctorFromService) {
      this.doctorId = doctorFromService.id;
      this.doctor = doctorFromService as any; // Cast to old Doctor type for compatibility
      this.firstName = doctorFromService.name.replace('Dr. ', '').split(' ')[0];
      this.caseCount = doctorFromService.beforeAfterGallery?.length.toString() || '0';
      this.yearsExp = doctorFromService.experience.toString();
      this.services = []; // Will be loaded below
      this.loadDoctorServices(doctorFromService.id);
      this.loadOtherDoctorsFromSupabase(doctorFromService.id);

      // Use beforeAfterGallery from doctor data, filter out entries with empty before/after
      this.beforeAfterCases = (doctorFromService.beforeAfterGallery || [])
        .filter(ba => ba.before && ba.after) // Only include entries with both images
        .map(ba => ({
          before: ba.before,
          after: ba.after,
          caption: (ba as any).caption || 'Treatment result',
          category: 'all', // Default category
          desc: (ba as any).caption || ''
        }));

      // Extract unique categories
      const categories = new Set<string>();
      this.beforeAfterCases.forEach(c => {
        if (c.category) categories.add(c.category);
      });
      this.availableCategories = Array.from(categories).sort();
    } else if (DOCS[slug]) {
      // Fallback to old DOCS data
      this.doctorId = slug;
      const oldDoc = DOCS[slug];
      this.doctor = oldDoc as any;
      this.firstName = oldDoc.name.replace('Dr. ', '').split(' ')[0];
      // Extract case count from exp string
      const caseMatch = oldDoc.exp ? oldDoc.exp.match(/(\d+)/) : null;
      this.caseCount = caseMatch ? caseMatch[1] : '—';
      // Extract years exp
      const expString = oldDoc.yrs || oldDoc.exp;
      const yearsMatch = expString ? expString.match(/(\d+)/) : null;
      this.yearsExp = yearsMatch ? yearsMatch[1] : '—';
      this.services = []; // Will be loaded below
      this.loadDoctorServices(slug);
      this.loadOtherDoctorsFromSupabase(slug);

      // Load real before/after cases from CasesService
      this.casesService.getCasesForDoctor(slug).subscribe(cases => {
        this.beforeAfterCases = cases;

        // Extract unique categories
        const categories = new Set<string>();
        cases.forEach(c => {
          if (c.category) categories.add(c.category);
        });
        this.availableCategories = Array.from(categories).sort();
      });
    } else {
      // Doctor not found, redirect to home
      this.router.navigate(['/']);
    }
  }

  loadDoctorServices(doctorId: string): void {
    // Load services from the doctor's services field (admin panel selection)
    console.log('Loading services for doctor:', doctorId);

    // First, get the doctor's service IDs from their record
    this.supabaseService.getDoctorById(doctorId).subscribe({
      next: (doctor: any) => {
        if (doctor && doctor.services && doctor.services.length > 0) {
          console.log('Doctor service IDs from doctor record:', doctor.services);

          // Now load all services to map IDs to full service objects
          this.supabaseService.getAllServices().subscribe({
            next: (allServices: any[]) => {
              console.log('All services from Supabase:', allServices.length);

              // Map service IDs/names to full service objects
              this.doctorServices = doctor.services
                .map((serviceIdOrName: string) => {
                  // Check if it's a UUID or plain name
                  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceIdOrName);

                  if (isUUID) {
                    // Find service by ID
                    return allServices.find((s: any) => s.id === serviceIdOrName);
                  } else {
                    // Find service by name or title
                    return allServices.find((s: any) =>
                      s.name === serviceIdOrName || s.title === serviceIdOrName
                    ) || {
                      id: serviceIdOrName,
                      name: serviceIdOrName,
                      title: serviceIdOrName,
                      slug: serviceIdOrName.toLowerCase().replace(/\s+/g, '-')
                    };
                  }
                })
                .filter((s: any) => s) as any[];

              console.log('Mapped doctor services:', this.doctorServices.length);
              console.log('Doctor services:', this.doctorServices.map((s: any) => s.name || s.title));
            },
            error: (err) => {
              console.error('Error loading all services:', err);
              // Create mock services from names
              this.doctorServices = doctor.services.map((name: string) => ({
                id: name,
                name: name,
                title: name,
                slug: name.toLowerCase().replace(/\s+/g, '-')
              }));
            }
          });
        } else {
          console.log('No services found in doctor record, using fallback');
          // Fallback: load services where doctor is listed as specialist
          this.loadServicesFromSpecialistIds(doctorId);
        }
      },
      error: (err) => {
        console.error('Error loading doctor:', err);
        // Fallback: load services where doctor is listed as specialist
        this.loadServicesFromSpecialistIds(doctorId);
      }
    });
  }

  private loadServicesFromSpecialistIds(doctorId: string): void {
    // Fallback method: Load services where this doctor is listed as a specialist
    this.supabaseService.getAllServices().subscribe({
      next: (services: any[]) => {
        this.doctorServices = services.filter((service: any) =>
          service.specialist_doctor_ids && service.specialist_doctor_ids.includes(doctorId)
        ) as any[];

        console.log('Fallback: Doctor services from specialist_ids:', this.doctorServices.length);

        // If still no services, try old method
        if (this.doctorServices.length === 0) {
          const allServices = this.servicesService.getActiveServices();
          this.doctorServices = allServices.filter(service =>
            service.specialistDoctorIds && service.specialistDoctorIds.includes(doctorId)
          );
        }
      },
      error: (err) => {
        console.error('Error in fallback service load:', err);
        // Final fallback to old method
        const allServices = this.servicesService.getActiveServices();
        this.doctorServices = allServices.filter(service =>
          service.specialistDoctorIds && service.specialistDoctorIds.includes(doctorId)
        );
      }
    });
  }

  loadOtherDoctorsFromSupabase(currentId: string): void {
    // Load other doctors from Supabase
    this.supabaseService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.otherDoctors = doctors
          .filter(d => d.id !== currentId)
          .slice(0, 4)
          .map(d => ({ ...d, id: d.id }));

        if (this.otherDoctors.length === 0) {
          // Fallback to hardcoded service
          this.otherDoctors = this.getOtherDoctors(currentId);
        }
      },
      error: (err) => {
        console.error('Error loading other doctors from Supabase:', err);
        // Fallback to hardcoded service
        this.otherDoctors = this.getOtherDoctors(currentId);
      }
    });
  }

  getOtherDoctors(currentId: string): any[] {
    // Get other doctors from DoctorsService first
    const serviceDoctors = this.doctorsService.getActiveDoctors()
      .filter(d => d.id !== currentId)
      .slice(0, 4)
      .map(d => ({ ...d, id: d.id }));

    if (serviceDoctors.length > 0) {
      return serviceDoctors;
    }

    // Fallback to old DOCS
    return Object.entries(DOCS)
      .filter(([id]) => id !== currentId && id !== 'team')
      .slice(0, 4)
      .map(([id, doc]) => ({ ...doc, id }));
  }


  getTreatmentDesc(tag: string): string {
    return TREAT[tag] || 'Specialist treatment with proven protocols.';
  }

  isLocsArray(): boolean {
    return Array.isArray(this.doctor?.locs);
  }

  getLocsArray(): string[] {
    if (Array.isArray(this.doctor?.locs)) {
      return this.doctor.locs;
    }
    return [];
  }

  scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Filter cases by category
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.showAllCases = false; // Reset "See More" when filtering
  }

  // Get visible cases based on selected category
  getVisibleCases(): BeforeAfterCase[] {
    if (this.selectedCategory === 'all') {
      return this.beforeAfterCases;
    }
    return this.beforeAfterCases.filter(c => c.category === this.selectedCategory);
  }

  // Get readable category label
  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'face': 'Face',
      'skin': 'Skin',
      'hair': 'Hair',
      'body': 'Body',
      'laser': 'Laser',
      'machines': 'Machines'
    };
    return labels[category] || category;
  }

  openBeforeAfter() {
    // Placeholder for Before & After functionality
    alert('Before & After gallery coming soon!');
  }

  goToDoctor(doctorSlug: string) {
    this.router.navigate(['/doctor', doctorSlug]);
  }

  goToService(serviceId: string) {
    this.router.navigate(['/services'], { fragment: serviceId });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getImageUrl(imagePath: string): string {
    if (imagePath && imagePath.includes('/media-library/')) {
      return `${environment.mediaBaseUrl}${imagePath}`;
    }
    return imagePath;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const branch = formData.get('branch') as string;
    const treatment = formData.get('treatment') as string;

    // Validate required fields
    if (!name || !phone) {
      alert('Please fill in all required fields');
      return;
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Save booking to Supabase
    try {
      const booking = await new Promise((resolve, reject) => {
        this.bookingsService.createBooking({
          source: 'doctor_form',
          page_source: `Doctor Detail Page - ${this.doctor?.name || 'Unknown'}`,
          first_name: firstName,
          last_name: lastName,
          email: email || '',
          phone: phone,
          preferred_branch: branch || undefined,
          preferred_doctor: this.doctor?.name,
          treatment_interested: treatment || undefined,
          message: message || undefined,
          booking_status: 'pending'
        }).subscribe({
          next: (booking) => {
            console.log('✅ Booking saved:', booking.booking_number);
            resolve(booking);
          },
          error: (err) => {
            console.error('❌ Error saving booking:', err);
            reject(err);
          }
        });
      });

      // Build WhatsApp message
      let whatsappMessage = `New inquiry for Dr. ${this.doctor?.name || 'Unknown'}\nName: ${name}\nPhone: ${phone}`;
      if (email) whatsappMessage += `\nEmail: ${email}`;
      if (message) whatsappMessage += `\nMessage: ${message}`;

      // Open WhatsApp AFTER booking is saved
      const whatsappUrl = `https://api.whatsapp.com/send?phone=201000312528&text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      alert('Thank you! Opening WhatsApp - we will reply within 2 hours.');
      form.reset();
    } catch (error) {
      console.error('Failed to save booking:', error);
      alert('There was an error saving your booking. Please try again.');
    }
  }
}
