import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { CartService } from '../../shared/services/cart.service';
import { CartItem } from '../../shared/models/cart.models';
import { Observable } from 'rxjs';
import { BookingsService } from '../../admin/services/bookings.service';
import { GoogleSheetsService } from '../../services/google-sheets.service';

interface BookingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: string;
  preferredBranch: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

interface PaymentInfo {
  method: 'online' | 'in-person' | null;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent, CartFlyoutComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;

  bookingInfo: BookingInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    preferredBranch: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  };

  branches = [
    'Citystars - Heliopolis',
    'New Cairo',
    'CFC Mall - New Cairo',
    'Madinaty',
    'Sheikh Zayed',
    'Mall of Arabia - 6th October',
    'Alexandria - San Stefano'
  ];

  timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  agreedToTerms: boolean = false;
  newsletterSignup: boolean = false;

  paymentInfo: PaymentInfo = {
    method: null
  };

  currentStep: 'info' | 'payment' | 'confirm' = 'info';
  isProcessingPayment: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private bookingsService: BookingsService,
    private googleSheetsService: GoogleSheetsService
  ) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      if (items.length === 0) {
        this.router.navigate(['/services']);
      }
    });
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  canProceedToPayment(): boolean {
    return !!(
      this.bookingInfo.firstName &&
      this.bookingInfo.lastName &&
      this.bookingInfo.email &&
      this.bookingInfo.phone &&
      this.bookingInfo.preferredBranch &&
      this.bookingInfo.preferredDate &&
      this.bookingInfo.preferredTime &&
      this.agreedToTerms
    );
  }

  async proceedToPayment(): Promise<void> {
    if (!this.canProceedToPayment()) {
      return;
    }
    // Skip payment step - directly save booking and go to thank you page
    await this.completeBooking();
  }

  selectPaymentMethod(method: 'online' | 'in-person'): void {
    this.paymentInfo.method = method;
    if (method === 'in-person') {
      // Skip card details for in-person payment
      this.paymentInfo.cardNumber = undefined;
      this.paymentInfo.cardName = undefined;
      this.paymentInfo.expiryDate = undefined;
      this.paymentInfo.cvv = undefined;
    }
  }

  canCompletePayment(): boolean {
    if (!this.paymentInfo.method) return false;

    if (this.paymentInfo.method === 'online') {
      return !!(
        this.paymentInfo.cardNumber &&
        this.paymentInfo.cardName &&
        this.paymentInfo.expiryDate &&
        this.paymentInfo.cvv
      );
    }

    return true; // In-person payment doesn't need card details
  }

  async completeBooking(): Promise<void> {
    this.isProcessingPayment = true;

    try {
      // Save booking to Supabase
      const cartItems = this.cartService.getCartItems();

      // Also send the checkout submission to the Google Sheet (fire-and-forget)
      this.googleSheetsService.sendToGoogleSheets({
        name: `${this.bookingInfo.firstName} ${this.bookingInfo.lastName}`.trim(),
        phone: this.bookingInfo.phone,
        email: this.bookingInfo.email,
        birthday: this.bookingInfo.birthday || '',
        branch: this.bookingInfo.preferredBranch || '',
        treatment: cartItems.map(item => item.name).join(', '),
        message: this.bookingInfo.notes || ''
      }, 'checkout');

      // Convert Observable to Promise to wait for completion
      const booking = await new Promise((resolve, reject) => {
        this.bookingsService.createBooking({
          source: 'checkout',
          first_name: this.bookingInfo.firstName,
          last_name: this.bookingInfo.lastName,
          email: this.bookingInfo.email,
          phone: this.bookingInfo.phone,
          birthdate: this.bookingInfo.birthday,
          preferred_branch: this.bookingInfo.preferredBranch,
          service_requested: cartItems.map(item => item.name).join(', '),
          message: this.bookingInfo.notes,
          items: cartItems,
          total_amount: this.getCartTotal(),
          status: 'pending' // Will be confirmed after payment integration
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

      // Clear cart and navigate to thank you page
      this.cartService.clearCart();
      this.router.navigate(['/thank-you'], {
        queryParams: {
          booking: 'confirmed',
          bookingNumber: (booking as any).booking_number,
          email: this.bookingInfo.email
        }
      });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again or contact us via WhatsApp.');
    } finally {
      this.isProcessingPayment = false;
    }
  }

  async processPayment(): Promise<void> {
    // This method is kept for backwards compatibility but now just calls completeBooking
    await this.completeBooking();
  }

  removeItemFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.type);
  }

  private async processPaymobPayment(bookingData: any): Promise<void> {
    // TODO: Integrate with Paymob API
    // 1. Get authentication token
    // 2. Register order
    // 3. Get payment key
    // 4. Redirect to Paymob iframe or process card

    // For now, simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Paymob payment processed:', bookingData);

    // In production, you would:
    // const response = await fetch('YOUR_BACKEND_API/paymob/process', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     amount: this.getCartTotal(),
    //     billing: this.bookingInfo,
    //     items: this.cartService.getCartItems()
    //   })
    // });
    // const result = await response.json();
    // window.location.href = result.iframeUrl;
  }

  backToInfo(): void {
    this.currentStep = 'info';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelBooking(): void {
    const cartItems = this.cartService.getCartItems();
    const itemNames = cartItems.map(item => item.name).join(', ');
    const message = `I'd like to cancel/modify my booking:\n\nName: ${this.bookingInfo.firstName} ${this.bookingInfo.lastName}\nPhone: ${this.bookingInfo.phone}\nEmail: ${this.bookingInfo.email}\nServices: ${itemNames}\n\nPlease contact me to discuss.`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=201000312528&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}
