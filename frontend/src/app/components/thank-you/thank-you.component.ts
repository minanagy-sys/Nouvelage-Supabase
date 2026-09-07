import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.css'
})
export class ThankYouComponent implements OnInit {
  bookingConfirmed: boolean = false;
  customerEmail: string = '';
  paymentMethod: string = '';
  totalAmount: number = 0;
  confirmationNumber: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingConfirmed = params['booking'] === 'confirmed';
      this.customerEmail = params['email'] || '';

      // Use booking number from checkout or generate fallback
      this.confirmationNumber = params['bookingNumber'] || 'NAC-' + Date.now().toString().slice(-8);

      // If no valid booking confirmation, redirect to services
      if (!this.bookingConfirmed) {
        this.router.navigate(['/services']);
      }
    });
  }

  navigateToServices(): void {
    this.router.navigate(['/services']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
