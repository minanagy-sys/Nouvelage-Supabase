import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { DoctorsService, Doctor } from '../../admin/services/doctors.service';
import { DemoModeService } from '../../admin/services/demo-mode.service';
import { ContentService } from '../../shared/services/content.service';
import { BookingsService } from '../../admin/services/bookings.service';
import { GoogleSheetsService } from '../../services/google-sheets.service';

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  birthday: string;
  branch: string;
  topic: string;
  doctor: string;
  treatment: string;
  message: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent, CartFlyoutComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit, AfterViewInit {
  doctors: (Doctor & { id: string })[] = [];
  displayedDoctors: any[] = [];
  doctorsPerPage = 8;
  showAllDoctors = false;
  showSuccess = false;
  pageContent: any = {};
  allServices: any[] = [];
  private servicesMap: Map<string, string> = new Map();

  formData: ContactFormData = {
    name: '',
    phone: '',
    email: '',
    birthday: '',
    branch: '',
    topic: '',
    doctor: '',
    treatment: '',
    message: ''
  };

  constructor(
    private router: Router,
    private el: ElementRef,
    private doctorsService: DoctorsService,
    private demoModeService: DemoModeService,
    private supabaseService: ContentService,
    private bookingsService: BookingsService,
    private title: Title,
    private meta: Meta,
    private googleSheetsService: GoogleSheetsService
  ) {}

  ngOnInit() {
    // Page title + Open Graph tags for the Team page
    this.title.setTitle('Our Team | Nouvelage Clinics');
    const teamOgImage = 'https://www.nouvelage.clinic/Team.jpg';
    const teamDesc = 'Meet the expert doctors and specialists behind Nouvelage Aesthetic Clinics.';
    this.meta.updateTag({ property: 'og:title', content: 'Our Team | Nouvelage Clinics' });
    this.meta.updateTag({ property: 'og:description', content: teamDesc });
    this.meta.updateTag({ property: 'og:image', content: teamOgImage });
    this.meta.updateTag({ property: 'og:url', content: 'https://www.nouvelage.clinic/team' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Our Team | Nouvelage Clinics' });
    this.meta.updateTag({ name: 'twitter:image', content: teamOgImage });

    // Load page content from Supabase (using 'team-page' as the key)
    this.supabaseService.getPageContent('team-page').subscribe({
      next: (content) => {
        if (content) {
          this.pageContent = content;
          console.log('✅ Loaded team page content from Supabase');
        } else {
          console.warn('⚠️ No team page content in Supabase');
          this.pageContent = { team_doctors_featured: [] };
        }
      },
      error: (err) => {
        console.error('❌ Error loading team page content:', err);
        this.pageContent = { team_doctors_featured: [] };
      }
    });

    // Load services first, then doctors
    this.supabaseService.getAllServices().subscribe({
      next: (services: any[]) => {
        this.allServices = services || [];
        console.log('✅ Team - Loaded', this.allServices.length, 'services from Supabase');

        // Build services map for ID to name mapping
        services.forEach((service: any) => {
          this.servicesMap.set(service.id, service.name || service.title);
        });
        console.log('✅ Team - Built services map with', this.servicesMap.size, 'services');

        // Now load doctors
        this.loadDoctors();
      },
      error: (err) => {
        console.error('❌ Error loading services from Supabase:', err);
        this.allServices = [];
        // Still load doctors even if services fail
        this.loadDoctors();
      }
    });
  }

  private loadDoctors(): void {
    // Load doctors from Supabase
    this.supabaseService.getAllDoctors().subscribe({
      next: (doctors: any[]) => {
        if (doctors && doctors.length > 0) {
          // Filter active doctors only
          const activeDoctors = doctors.filter(d => d.is_active !== false);

          // Map Supabase doctor fields to component format
          const allDoctors = activeDoctors.map((d: any) => ({
            id: d.id,
            slug: d.slug,
            name: d.name,
            title: d.title || 'Dr.',
            specialization: d.specialization,
            spec: d.specialization,  // Alias for template
            role: d.role || d.specialization,  // Alias for template
            subSpecialties: d.sub_specialties || [],
            qualifications: d.qualifications || [],
            certificates: d.certificates || [],
            experience: d.years_experience || d.experience_years || d.experience || 0,
            yrs: d.years_experience || d.experience_years || d.experience || 0,  // Alias for template
            languages: d.languages || [],
            services: this.mapServiceIdsToNames(d.services || []),
            branches: d.branches || [],
            availableDays: d.available_days || [],
            gender: d.gender,
            profileImage: d.profile_image,
            img: d.profile_image,  // Alias for template
            beforeAfterGallery: d.before_after_gallery || [],
            bio: d.bio || d.description || '',
            about: d.about || '',
            deg: d.degree || d.degrees || d.specialization,  // Alias for template
            expertise: d.expertise || [],
            treatments: d.treatments || [],
            tags: d.tags || [],  // Alias for template
            bookingLink: d.booking_link || '',
            featured: d.featured || false,
            order: d.order_index || 0,
            active: d.is_active !== false,
            rating: d.rating || 4.9
          }));

          // Check if page content has team_doctors_featured array
          console.log('🔍 Team - team_doctors_featured from page content:', this.pageContent.team_doctors_featured);
          console.log('🔍 Team - All active doctors count:', allDoctors.length);

          if (this.pageContent?.team_doctors_featured && Array.isArray(this.pageContent.team_doctors_featured) && this.pageContent.team_doctors_featured.length > 0) {
            // Clean demo IDs
            const hasDemoIds = this.pageContent.team_doctors_featured.some((id: string) => id.match(/^doc_\d+$/));
            if (hasDemoIds) {
              console.log(`🧹 Team - Clearing demo IDs. Admin needs to select doctors.`);
              this.doctors = [];
            } else {
              // Filter to only selected doctors
              this.doctors = allDoctors.filter(d => this.pageContent.team_doctors_featured.includes(d.id));
              console.log('✅ Team - Filtered to', this.doctors.length, 'featured doctors');
              console.log('👥 Team - Doctor names showing:', this.doctors.map(d => d.name));
              if (this.doctors.length === 0) {
                console.error('⚠️ Team - No doctors match the featured IDs! The IDs in team_doctors_featured dont exist in Supabase.');
                console.error('   Featured IDs:', this.pageContent.team_doctors_featured);
                console.error('   Available IDs:', allDoctors.slice(0, 5).map(d => d.id));
              }
              this.updateDisplayedDoctors();
            }
          } else {
            // No selection - show empty
            this.doctors = [];
            this.displayedDoctors = [];
            console.log('⚠️ Team - No doctors selected in admin. Please go to Admin Dashboard → Team and select doctors.');
          }
        } else {
          console.error('❌ Team - No doctors returned from Supabase');
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

    console.log('🔍 Team - Mapping service IDs:', serviceIds);
    console.log('🗺️ Team - Services map size:', this.servicesMap.size);

    const mapped = serviceIds
      .map(id => {
        // First check if it's already a name (not a UUID)
        // UUIDs have format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (36 chars with dashes)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (!isUUID) {
          // It's already a name, return as is
          console.log(`  Team - "${id}" → Already a name (not UUID)`);
          return id;
        }

        // It's a UUID, try to map it to a name
        const name = this.servicesMap.get(id);
        if (name) {
          console.log(`  Team - ID: ${id} → Name: ${name}`);
          return name;
        }

        // If not found in map, return null and we'll filter it out
        console.log(`  Team - ID: ${id} → NOT FOUND in services map, filtering out`);
        return null;
      })
      .filter(name => name && name.length > 0) as string[];

    console.log('✅ Team - Mapped services:', mapped);
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

  ngAfterViewInit() {
    // Initialize reveal animations using IntersectionObserver
    const revealElements = this.el.nativeElement.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((el: Element) => observer.observe(el));

    // Setup field validation - reset styling on input
    this.setupFormValidation();
  }

  private setupFormValidation(): void {
    const form = this.el.nativeElement.querySelector('form');
    if (!form) return;

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
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
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

  /**
   * Get the correct image URL for display
   * Media-library images are served from upload server (port 3001)
   * Other images are served from Angular dev server (port 4200)
   */
  getImageUrl(imagePath: string): string {
    if (imagePath && imagePath.includes('/media-library/')) {
      return `${environment.mediaBaseUrl}${imagePath}`;
    }
    return imagePath;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    // Validate form
    if (!this.validateForm(form)) {
      return;
    }

    // Split name into first and last name
    const nameParts = this.formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Also send the lead to the Google Sheet (fire-and-forget; no-cors)
    this.googleSheetsService.sendToGoogleSheets(this.formData, 'team');

    // Save booking to Supabase
    try {
      await new Promise<void>((resolve, reject) => {
        this.bookingsService.createBooking({
          source: 'team_form',
          page_source: 'Team/Doctors Page',
          first_name: firstName,
          last_name: lastName,
          email: this.formData.email,
          phone: this.formData.phone,
          birthdate: this.formData.birthday,
          preferred_branch: this.formData.branch,
          preferred_doctor: this.formData.doctor,
          treatment_interested: this.formData.treatment,
          topic: this.formData.topic,
          message: this.formData.message,
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
      console.log('✅ Booking completed, proceeding to WhatsApp...');
    } catch (error) {
      console.error('❌ Booking failed, but continuing:', error);
    }

    // Build WhatsApp message
    const msg = `Hi Nouvelage 👋\n\n` +
      `Name: ${this.formData.name}\n` +
      `Phone: ${this.formData.phone}\n` +
      `Email: ${this.formData.email}\n` +
      `Birthday: ${this.formData.birthday}\n` +
      `Branch: ${this.formData.branch}\n` +
      `Topic: ${this.formData.topic}\n` +
      `Doctor: ${this.formData.doctor}\n` +
      `Treatment: ${this.formData.treatment}\n` +
      `Message: ${this.formData.message || 'N/A'}`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=201000312528&text=${encoded}`;

    // Show success message
    this.showSuccess = true;

    // Open WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);

    // Hide success message and reset form after 5 seconds
    setTimeout(() => {
      this.showSuccess = false;
      this.resetForm();
    }, 5000);
  }

  private validateForm(form: HTMLFormElement): boolean {
    const errors: Array<{ field: HTMLElement | null; message: string }> = [];

    // Get all required fields
    const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement;
    const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    const birthdayInput = form.querySelector('input[name="birthday"]') as HTMLInputElement;
    const branchInput = form.querySelector('select[name="branch"]') as HTMLSelectElement;
    const topicInput = form.querySelector('select[name="topic"]') as HTMLSelectElement;
    const doctorInput = form.querySelector('select[name="doctor"]') as HTMLSelectElement;
    const treatmentInput = form.querySelector('select[name="treatment"]') as HTMLSelectElement;

    // Validate Name (required)
    if (!nameInput || !nameInput.value.trim()) {
      errors.push({ field: nameInput, message: 'Name is required' });
    }

    // Validate Egyptian Phone Number (required)
    if (!phoneInput || !phoneInput.value.trim()) {
      errors.push({ field: phoneInput, message: 'Phone number is required' });
    } else if (!this.validateEgyptianPhone(phoneInput.value.trim())) {
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
    } else if (!this.validateAge(birthdayInput.value)) {
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

  private validateEgyptianPhone(phone: string): boolean {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Check if it starts with +20 or 20 or 01/02/03/04/05
    // Valid Egyptian phone numbers:
    // - Start with +20 followed by 10 digits (mobile) or 9 digits (landline)
    // - Start with 20 followed by 10 digits (mobile) or 9 digits (landline)
    // - Start with 01/02/03/04/05 followed by 9 more digits (mobile only)

    if (cleaned.startsWith('20')) {
      // Format: 20XXXXXXXXXX (12 digits for mobile) or 20XXXXXXXXX (11 digits for landline)
      return cleaned.length === 12 || cleaned.length === 11;
    } else if (cleaned.startsWith('01') || cleaned.startsWith('02') ||
               cleaned.startsWith('03') || cleaned.startsWith('04') ||
               cleaned.startsWith('05')) {
      // Format: 01XXXXXXXXX (11 digits)
      return cleaned.length === 11;
    }

    return false;
  }

  private validateAge(birthday: string): boolean {
    const birthDate = new Date(birthday);
    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Must be at least 16 years old
    return age >= 16;
  }

  resetForm(): void {
    this.formData = {
      name: '',
      phone: '',
      email: '',
      birthday: '',
      branch: '',
      topic: '',
      doctor: '',
      treatment: '',
      message: ''
    };
  }
}
