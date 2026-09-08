import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { DemoModeService } from '../../admin/services/demo-mode.service';
import { ContentService } from '../../shared/services/content.service';
import { loadLeaflet } from '../../shared/services/leaflet-loader';
import { BookingsService } from '../../admin/services/bookings.service';
import { GoogleSheetsService } from '../../services/google-sheets.service';

interface Branch {
  name: string;
  city: string;
  address: string;
  query: string;
  coordinates: [number, number];
}

interface FormData {
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
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent, CartFlyoutComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, AfterViewInit {
  currentYear = new Date().getFullYear();
  showSuccess = false;
  pageContent: any = {};
  selectedBranchIndex = 0;

  branches: Branch[] = [
    { name: 'Citystars — Phase 2', city: 'Cairo', address: '3rd Floor, Unit 3280', query: 'Nouvel Age Citystars', coordinates: [30.0726, 31.3478] },
    { name: 'Cairo Festival City', city: 'Cairo', address: 'CFC · 2nd Floor, Unit 1-08', query: 'Nouvel Age Cairo Festival City', coordinates: [30.0290, 31.4080] },
    { name: 'Madinaty', city: 'Cairo', address: 'The Strip · Building 10, PL02', query: 'Nouvel Age Madinaty', coordinates: [30.0997, 31.6469] },
    { name: 'Mohandessin', city: 'Giza', address: '2 Dr. Mahrouky St. · 3rd Floor', query: 'Nouvel Age Mohandessin', coordinates: [30.0590, 31.2020] },
    { name: 'Sheikh Zayed', city: 'Giza', address: 'Twin Towers Mall, Bldg D · 5th Fl, Clinic H', query: 'Nouvel Age Sheikh Zayed', coordinates: [30.0420, 30.9770] },
    { name: 'Mall of Arabia', city: 'Giza', address: 'Gate 17, Unit H052', query: 'Nouvel Age Mall of Arabia', coordinates: [29.9890, 30.9760] },
    { name: 'Camp Shizar', city: 'Alexandria', address: '18 El Geish Road · opp. Casino El Shatby', query: 'Nouvel Age Camp Shizar Alexandria', coordinates: [31.2150, 29.9270] },
    { name: 'Roushdy', city: 'Alexandria', address: '17 Syria Street', query: 'Nouvel Age Roushdy Alexandria', coordinates: [31.2340, 29.9560] },
    { name: 'Loran', city: 'Alexandria', address: 'El Murjan Tower · El Horreya Road', query: 'Nouvel Age Loran Alexandria', coordinates: [31.2640, 29.9930] }
  ];

  selectedBranch: Branch = this.branches[0];

  formData: FormData = {
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

  private mapInitialized = false;

  constructor(
    private router: Router,
    private demoModeService: DemoModeService,
    private supabaseService: ContentService,
    private bookingsService: BookingsService,
    private googleSheetsService: GoogleSheetsService
  ) {}

  ngOnInit(): void {
    // Local defaults render immediately; the database row replaces them as
    // soon as the API answers, so dashboard edits reach the public page.
    this.pageContent = this.demoModeService.getDemoPageContent('contact-page');
    this.supabaseService.getPageContent('contact-page').subscribe(content => {
      if (content) {
        if (!Array.isArray(content.branches) || content.branches.length === 0) {
          content.branches = this.pageContent.branches;
        }
        this.pageContent = content;
      }
      this.scheduleMapInit();
    });

    // Initialize reveal animations
    if (typeof window !== 'undefined') {
      setTimeout(() => this.initRevealAnimations(), 100);
    }
  }

  ngAfterViewInit(): void {
    // The map normally initializes once the page content has resolved (see
    // ngOnInit); this timer is a fallback in case the request never settles.
    if (typeof window !== 'undefined') {
      setTimeout(() => this.scheduleMapInit(), 2500);
    }
  }

  private scheduleMapInit(): void {
    if (this.mapInitialized || typeof window === 'undefined') return;
    this.mapInitialized = true;
    setTimeout(() => this.initMap(), 500);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  selectBranch(index: number): void {
    this.selectedBranchIndex = index;

    // Update active tab
    const tabs = document.querySelectorAll('.br-tab');
    tabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('is-active');
      } else {
        tab.classList.remove('is-active');
      }
    });

    // Focus map on selected branch (if map is initialized)
    if (typeof window !== 'undefined' && (window as any).nvFocus) {
      (window as any).nvFocus(index);
    }
  }

  showBranch(index: number): void {
    if (index >= 0 && index < this.branches.length) {
      this.selectedBranch = this.branches[index];

      // Update active tab
      const tabs = document.querySelectorAll('.br-tab');
      tabs.forEach((tab, i) => {
        if (i === index) {
          tab.classList.add('is-active');
        } else {
          tab.classList.remove('is-active');
        }
      });

      // Focus map on selected branch (if map is initialized)
      if (typeof window !== 'undefined' && (window as any).nvFocus) {
        (window as any).nvFocus(index);
      }
    }
  }

  getMapsUrl(): string {
    return `https://www.google.com/maps/search/${encodeURIComponent(this.selectedBranch.query)}`;
  }

  isOpen(): boolean {
    const hour = new Date().getHours();
    return hour >= 10 && hour < 22;
  }

  getWhatsAppPhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  get whatsappUrl(): string {
    if (this.pageContent?.branches && this.pageContent.branches[this.selectedBranchIndex]) {
      const phone = this.getWhatsAppPhone(this.pageContent.branches[this.selectedBranchIndex].whatsapp || '');
      return `https://api.whatsapp.com/send?phone=${phone}`;
    }
    return 'https://api.whatsapp.com/send?phone=201000312528';
  }

  get contactWhatsappUrl(): string {
    const phone = this.pageContent.contact_whatsapp
      ? this.getWhatsAppPhone(this.pageContent.contact_whatsapp)
      : '201000312528';
    return `https://api.whatsapp.com/send?phone=${phone}`;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async onSubmit(): Promise<void> {
    // Validate required fields
    if (!this.formData.name.trim() || !this.formData.phone.trim()) {
      // Highlight missing fields
      const nameInput = document.getElementById('fName') as HTMLInputElement;
      const phoneInput = document.getElementById('fPhone') as HTMLInputElement;

      if (!this.formData.name.trim() && nameInput) {
        nameInput.style.borderColor = '#c0392b';
      }
      if (!this.formData.phone.trim() && phoneInput) {
        phoneInput.style.borderColor = '#c0392b';
      }
      return;
    }

    // Validate email format if provided
    if (this.formData.email && !this.validateEmail(this.formData.email)) {
      const emailInput = document.getElementById('fEmail') as HTMLInputElement;
      if (emailInput) {
        emailInput.style.borderColor = '#c0392b';
      }
      return;
    }

    // Validate phone format (basic Egyptian phone validation)
    if (!this.validatePhone(this.formData.phone)) {
      const phoneInput = document.getElementById('fPhone') as HTMLInputElement;
      if (phoneInput) {
        phoneInput.style.borderColor = '#c0392b';
      }
      return;
    }

    // Split name into first and last name
    const nameParts = this.formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Also send the lead to the Google Sheet (fire-and-forget; no-cors)
    this.googleSheetsService.sendToGoogleSheets(this.formData, 'contact');

    // Save booking to Supabase - WAIT for completion
    try {
      console.log('📤 Attempting to save booking...');
      await new Promise<void>((resolve, reject) => {
        this.bookingsService.createBooking({
          source: 'contact_form',
          page_source: 'Contact Page',
          first_name: firstName,
          last_name: lastName,
          email: this.formData.email || '',
          phone: this.formData.phone,
          birthdate: this.formData.birthday || undefined,
          preferred_branch: this.formData.branch || undefined,
          preferred_doctor: this.formData.doctor || undefined,
          treatment_interested: this.formData.treatment || undefined,
          topic: this.formData.topic || undefined,
          message: this.formData.message || undefined,
          booking_status: 'pending'
        }).subscribe({
          next: (booking) => {
            console.log('✅ Booking saved successfully:', booking.booking_number);
            resolve();
          },
          error: (err) => {
            console.error('❌ Detailed booking error:', JSON.stringify(err, null, 2));
            reject(err);
          }
        });
      });
      console.log('✅ Booking save completed, proceeding to WhatsApp...');
    } catch (error: any) {
      console.error('❌ Booking save failed:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      // Don't show alert - just log and continue
      console.warn('⚠️ Continuing to WhatsApp despite booking error');
    }

    // Build WhatsApp message
    let message = `New inquiry — Nouvel Age\nName: ${this.formData.name}\nPhone: ${this.formData.phone}`;

    if (this.formData.email) message += `\nEmail: ${this.formData.email}`;
    if (this.formData.birthday) message += `\nBirthday: ${this.formData.birthday}`;
    if (this.formData.branch) message += `\nPreferred Branch: ${this.formData.branch}`;
    if (this.formData.topic) message += `\nTopic: ${this.formData.topic}`;
    if (this.formData.doctor) message += `\nPreferred Doctor: ${this.formData.doctor}`;
    if (this.formData.treatment) message += `\nInterested Treatment: ${this.formData.treatment}`;
    if (this.formData.message) message += `\nMessage: ${this.formData.message}`;

    // Open WhatsApp with the message
    const whatsappLink = `https://api.whatsapp.com/send?phone=201000312528&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');

    // Show success message
    this.showSuccess = true;

    // Reset form
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

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    // Egyptian phone format: 01xxxxxxxxx or +201xxxxxxxxx or 00201xxxxxxxxx
    const phoneRegex = /^(01|(\+201)|(00201))[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  }

  private initRevealAnimations(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });
  }

  getSocialIconSvg(platform: string): string {
    const icons: { [key: string]: string } = {
      'Instagram': 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM1ODM4MkMiLz48ZyBmaWxsPSIjRkNGNUYwIiB0cmFuc2Zvcm09InNjYWxlKDAuNjcpIHRyYW5zbGF0ZSg1Ljk3LDUuOTcpIj48cGF0aCBkPSJNMTIgMi4xNjNjMy4yMDQgMCAzLjU4NC4wMTIgNC44NS4wNyAzLjI1Mi4xNDggNC43NzEgMS42OTEgNC45MTkgNC45MTkuMDU4IDEuMjY1LjA2OSAxLjY0NS4wNjkgNC44NDkgMCAzLjIwNS0uMDEyIDMuNTg0LS4wNjkgNC44NDktLjE0OSAzLjIyNS0xLjY2NCA0Ljc3MS00LjkxOSA0LjkxOS0xLjI2Ni4wNTgtMS42NDQuMDctNC44NS4wNy0zLjIwNCAwLTMuNTg0LS4wMTItNC44NDktLjA3LTMuMjYtLjE0OS00Ljc3MS0xLjY5OS00LjkxOS00LjkyLS4wNTgtMS4yNjUtLjA3LTEuNjQ0LS4wNy00Ljg0OSAwLTMuMjA0LjAxMy0zLjU4My4wNy00Ljg0OS4xNDktMy4yMjcgMS42NjQtNC43NzEgNC45MTktNC45MTkgMS4yNjYtLjA1NyAxLjY0NS0uMDY5IDQuODQ5LS4wNjl6TTEyIDBDOC43NDEgMCA4LjMzMy4wMTQgNy4wNTMuMDcyIDIuNjk1LjI3Mi4yNzMgMi42OS4wNzMgNy4wNTIuMDE0IDguMzMzIDAgOC43NDEgMCAxMmMwIDMuMjU5LjAxNCAzLjY2OC4wNzIgNC45NDguMiA0LjM1OCAyLjYxOCA2Ljc4IDYuOTggNi45OEM4LjMzMyAyMy45ODYgOC43NDEgMjQgMTIgMjRjMy4yNTkgMCAzLjY2OC0uMDE0IDQuOTQ4LS4wNzIgNC4zNTQtLjIgNi43ODItMi42MTggNi45NzktNi45OC4wNTktMS4yOC4wNzMtMS42ODkuMDczLTQuOTQ4IDAtMy4yNTktLjAxNC0zLjY2Ny0uMDcyLTQuOTQ3LS4xOTYtNC4zNTQtMi42MTctNi43OC02Ljk3OS02Ljk4QzE1LjY2OC4wMTQgMTUuMjU5IDAgMTIgMHptMCA1LjgzOGE2LjE2MiA2LjE2MiAwIDEgMCAwIDEyLjMyNCA2LjE2MiA2LjE2MiAwIDAgMCAwLTEyLjMyNHpNMTIgMTZhNCA0IDAgMSAxIDAtOCA0IDQgMCAwIDEgMCA4em02LjQwNi0xMS44NDVhMS40NCAxLjQ0IDAgMSAwIDAgMi44ODEgMS40NCAxLjQ0IDAgMCAwIDAtMi44ODF6Ii8+PC9nPjwvc3ZnPg==',
      'Facebook': 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM1ODM4MkMiLz48ZyBmaWxsPSIjRkNGNUYwIiB0cmFuc2Zvcm09InNjYWxlKDAuNjcpIHRyYW5zbGF0ZSg1Ljk3LDUuOTcpIj48cGF0aCBkPSJNMjQgMTIuMDczYzAtNi42MjctNS4zNzMtMTItMTItMTJzLTEyIDUuMzczLTEyIDEyYzAgNS45OSA0LjM4OCAxMC45NTQgMTAuMTI1IDExLjg1NHYtOC4zODVINy4wNzh2LTMuNDdoMy4wNDdWOS40M2MwLTMuMDA3IDEuNzkyLTQuNjY5IDQuNTMzLTQuNjY5IDEuMzEyIDAgMi42ODYuMjM1IDIuNjg2LjIzNXYyLjk1M0gxNS44M2MtMS40OTEgMC0xLjk1Ni45MjUtMS45NTYgMS44NzR2Mi4yNWgzLjMyOGwtLjUzMiAzLjQ3aC0yLjc5NnY4LjM4NUMxOS42MTIgMjMuMDI3IDI0IDE4LjA2MiAyNCAxMi4wNzN6Ii8+PC9nPjwvc3ZnPg==',
      'Twitter': 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM1ODM4MkMiLz48cGF0aCBmaWxsPSIjRkNGNUYwIiBkPSJNMTguMzA2IDguMjAyYy4wMS4xNzUuMDE1LjM1Mi4wMTUuNTMgMCA1LjQwOC00LjExNiAxMS42NDUtMTEuNjQ1IDExLjY0NS0yLjMxMyAwLTQuNDY1LS42NzgtNi4yNzYtMS44NDEuMzIxLjAzOC42NDcuMDU3Ljk3OC4wNTcgMS45MTkgMCAzLjY4NC0uNjU0IDUuMDg1LTEuNzUzLTEuNzkzLS4wMzMtMy4zMDUtMS4yMTYtMy44MjUtMi44NC4yNS4wNDguNTA3LjA3My43NzEuMDczLjM3NCAwIC43MzYtLjA1IDEuMDgtLjE0NC0xLjg3NC0uMzc2LTMuMjg3LTIuMDMyLTMuMjg3LTQuMDIgMC0uMDE3IDAtLjAzNC4wMDEtLjA1LjU1Mi4zMDcgMS4xODQuNDkxIDEuODU1LjUxMi0xLjA5OC0uNzMzLTEuODIxLTEuOTg2LTEuODIxLTMuNDA1IDAtLjc1LjIwMS0xLjQ1My41NTMtMi4wNTggMi4wMiAyLjQ3NyA1LjAzOSA0LjEwNyA4LjQ0MSA0LjI3OS0uMDctLjMwMS0uMTA2LS42MTQtLjEwNi0uOTM3IDAtMi4yNjYgMS44MzctNC4xMDMgNC4xMDMtNC4xMDMgMS4xOCAwIDIuMjQ2LjQ5OCAyLjk5NSAxLjI5NS45MzQtLjE4NCAxLjgxMi0uNTI1IDIuNjA0LS45OTUtLjMwNi45NTgtLjk1NyAxLjc2Mi0xLjgwNCAyLjI3MS44My0uMDk5IDEuNjIxLS4zMiAyLjM1Ny0uNjQ2LS41NS44MjMtMS4yNDcgMS41NDQtMi4wNDggMi4xMjJ6Ii8+PC9zdmc+',
      'LinkedIn': 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM1ODM4MkMiLz48cGF0aCBmaWxsPSIjRkNGNUYwIiBkPSJNOC4yOTEgOS40MjJoMi45MDR2OS4zNThIOC4yOTF6TTkuNzQzIDUuNzVjLjkyOCAwIDEuNjgyLjc1NCAxLjY4MiAxLjY4MnMtLjc1NCAxLjY4Mi0xLjY4MiAxLjY4Mi0xLjY4Mi0uNzU0LTEuNjgyLTEuNjgyLjc1NC0xLjY4MiAxLjY4Mi0xLjY4MnptMy41NjggMy42NzJoMi43ODN2MS4yODRoLjAzOWMuMzg3LS43MzQgMS4zMzQtMS41MDggMi43NDUtMS41MDggMi45MzcgMCAzLjQ3OCAxLjkzMyAzLjQ3OCA0LjQ0N3Y1LjEyNWgtMi45MDR2LTQuNTQxYzAtMS4wODQtLjAyLTIuNDgtMS41MTgtMi40OC0xLjUyIDAtMS43NTMgMS4xODctMS43NTMgMi4zOTl2NC42MjJoLTIuOTAzeiIvPjwvc3ZnPg==',
      'YouTube': 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM1ODM4MkMiLz48cGF0aCBmaWxsPSIjRkNGNUYwIiBkPSJNMTkuNjE1IDguNTM1Yy0uMTktLjcxNC0uNzUtMS4yNzQtMS40NjQtMS40NjRDMTYuODU4IDYuNzUgMTIgNi43NSAxMiA2Ljc1cy00Ljg1OCAwLTYuMTUxLjMyMWMtLjcxNC4xOS0xLjI3NC43NS0xLjQ2NCAxLjQ2NEM0LjA2NCA5LjgyOCA0LjA2NCAxMi41IDQuMDY0IDEyLjVzMCAyLjY3Mi4zMjEgMy45NjVjLjE5LjcxNC43NSAxLjI3NCAxLjQ2NCAxLjQ2NEM3LjE0MiAxOC4yNSAxMiAxOC4yNSAxMiAxOC4yNXM0Ljg1OCAwIDYuMTUxLS4zMjFjLjcxNC0uMTkgMS4yNzQtLjc1IDEuNDY0LTEuNDY0LjMyMS0xLjI5My4zMjEtMy45NjUuMzIxLTMuOTY1cy0uMDAxLTIuNjcyLS4zMjItMy45NjV6TTEwLjIgMTQuNzV2LTQuNWwzLjk3NSAyLjI1LTMuOTc1IDIuMjV6Ii8+PC9zdmc+',
      'TikTok': 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM1ODM4MkMiLz48ZyBmaWxsPSIjRkNGNUYwIiB0cmFuc2Zvcm09InNjYWxlKDAuNjcpIHRyYW5zbGF0ZSg1Ljk3LDUuOTcpIj48cGF0aCBkPSJNMTIuNTI1LjAyYzEuMzEtLjAyIDIuNjEtLjAxIDMuOTEtLjAyLjA4IDEuNTMuNjMgMy4wOSAxLjc1IDQuMTcgMS4xMiAxLjExIDIuNyAxLjYyIDQuMjQgMS43OXY0LjAzYy0xLjQ0LS4wNS0yLjg5LS4zNS00LjItLjk3LS41Ny0uMjYtMS4xLS41OS0xLjYyLS45My0uMDEgMi45Mi4wMSA1Ljg0LS4wMiA4Ljc1LS4wOCAxLjQtLjU0IDIuNzktMS4zNSAzLjk0LTEuMzEgMS45Mi0zLjU4IDMuMTctNS45MSAzLjIxLTEuNDMuMDgtMi44Ni0uMzEtNC4wOC0xLjAzLTIuMDItMS4xOS0zLjQ0LTMuMzctMy42NS01LjcxLS4wMi0uNS0uMDMtMS0uMDEtMS40OS4xOC0xLjkgMS4xMi0zLjcyIDIuNTgtNC45NiAxLjY2LTEuNDQgMy45OC0yLjEzIDYuMTUtMS43Mi4wMiAxLjQ4LS4wNCAyLjk2LS4wNCA0LjQ0LS45OS0uMzItMi4xNS0uMjMtMy4wMi4zNy0uNjMuNDEtMS4xMSAxLjA0LTEuMzYgMS43NS0uMjEuNTEtLjE1IDEuMDctLjE0IDEuNjEuMjQgMS42NCAxLjgyIDMuMDIgMy41IDIuODcgMS4xMi0uMDEgMi4xOS0uNjYgMi43Ny0xLjYxLjE5LS4zMy40LS42Ny40MS0xLjA2LjEtMS43OS4wNi0zLjU3LjA3LTUuMzYuMDEtNC4wMy0uMDEtOC4wNS4wMi0xMi4wN3oiLz48L2c+PC9zdmc+'
    };
    return icons[platform] || icons['Instagram'];
  }

  private async initMap(): Promise<void> {
    const mapEl = document.getElementById('nvMap');
    if (!mapEl) return;

    // Leaflet is fetched on demand — it is no longer a render-blocking
    // script in index.html, so it costs nothing on pages without a map.
    let L: any = null;
    try { L = await loadLeaflet(); } catch { L = null; }

    if (!L) {
      // Leaflet unavailable, show a simple placeholder
      mapEl.style.backgroundColor = '#EBE5DB';
      mapEl.style.display = 'flex';
      mapEl.style.alignItems = 'center';
      mapEl.style.justifyContent = 'center';
      mapEl.innerHTML = '<p style="color: #8A7C6C; font-family: var(--sans);">Interactive map loading...</p>';
      return;
    }

    // Use backend branches if available, otherwise fall back to hardcoded
    const branchesData = this.pageContent.branches || this.branches;

    // Initialize Leaflet map
    const map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: true }).setView([30.6, 31.0], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Add markers for each branch
    const markers: any[] = [];
    const pinIcon = L.divIcon({
      className: 'nv-pin-wrap',
      html: '<span class="nv-pin"><svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"><path class="pin-body pin-stroke" d="M12 .6C5.7.6.7 5.6.7 11.9c0 8.4 11.3 19.2 11.3 19.2s11.3-10.8 11.3-19.2C23.3 5.6 18.3.6 12 .6z"/><circle class="pin-dot" cx="12" cy="11.9" r="4.4"/></svg></span>',
      iconSize: [30, 38],
      iconAnchor: [15, 38],
      popupAnchor: [0, -34]
    });

    if (this.pageContent.branches) {
      // Use backend branch data
      this.pageContent.branches.forEach((branch: any, index: number) => {
        const coords = [parseFloat(branch.lat), parseFloat(branch.lng)];
        const marker = L.marker(coords, { icon: pinIcon, title: branch.branch_name }).addTo(map);
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(branch.address)}`;
        marker.bindPopup(`
          <div class="nv-pop__city">${branch.city}</div>
          <div class="nv-pop__name">${branch.branch_name}</div>
          <div class="nv-pop__address">${branch.address}</div>
          <a class="nv-pop__dir" href="${mapsUrl}" target="_blank" rel="noopener">Get directions ↗</a>
        `);
        markers.push({ marker, coords });
      });

      // Fit map to show all markers
      const points = this.pageContent.branches.map((b: any) => [parseFloat(b.lat), parseFloat(b.lng)]);
      if (points.length > 0) {
        map.fitBounds(points, { padding: [45, 45] });
      }

      // Add focus function to window for external access
      (window as any).nvFocus = (index: number) => {
        const markerData = markers[index];
        if (markerData) {
          map.flyTo(markerData.coords, 14, { duration: 0.8 });
          setTimeout(() => markerData.marker.openPopup(), 320);
        }
      };
    } else {
      // Fallback to hardcoded branches
      this.branches.forEach((branch, index) => {
        const marker = L.marker(branch.coordinates, { icon: pinIcon, title: branch.name }).addTo(map);
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(branch.query)}`;
        marker.bindPopup(`
          <div class="nv-pop__city">${branch.city}</div>
          <div class="nv-pop__name">${branch.name}</div>
          <div class="nv-pop__address">${branch.address}</div>
          <a class="nv-pop__dir" href="${mapsUrl}" target="_blank" rel="noopener">Get directions ↗</a>
        `);
        markers.push({ marker, coords: branch.coordinates });
      });

      // Fit map to show all markers
      const points = this.branches.map(b => b.coordinates);
      if (points.length > 0) {
        map.fitBounds(points, { padding: [45, 45] });
      }

      // Add focus function to window for external access
      (window as any).nvFocus = (index: number) => {
        const markerData = markers[index];
        const branch = this.branches[index];
        if (markerData && branch) {
          map.flyTo(branch.coordinates, 14, { duration: 0.8 });
          setTimeout(() => markerData.marker.openPopup(), 320);
        }
      };
    }

    setTimeout(() => map.invalidateSize(), 250);
  }
}
