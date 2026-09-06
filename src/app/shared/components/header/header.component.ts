import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cartCount$: Observable<number>;
  mobileMenuOpen = false;
  isScrolled = false;
  openSubmenu: string | null = null;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {
    this.cartCount$ = this.cartService.cartItems$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );

    // Set scrolled state immediately for non-landing pages
    const currentUrl = this.router.url;
    const isLandingPage = currentUrl === '/' || currentUrl === '/forher' || currentUrl === '/forhim';
    if (!isLandingPage) {
      this.isScrolled = true;
    }
  }

  ngOnInit(): void {
    // Close mobile menu on route change
    this.router.events.subscribe(() => {
      this.mobileMenuOpen = false;
      this.openSubmenu = null;
      this.checkScroll();
    });

    // Check scroll position on init
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    // Always show scrolled state on non-landing pages
    const currentUrl = this.router.url;
    const isLandingPage = currentUrl === '/' || currentUrl === '/forher' || currentUrl === '/forhim';

    console.log('checkScroll - currentUrl:', currentUrl, 'isLandingPage:', isLandingPage);

    if (isLandingPage) {
      this.isScrolled = window.pageYOffset > 50;
    } else {
      // Services, team, blog, contact, checkout, doctor detail pages always have background
      this.isScrolled = true;
    }

    console.log('isScrolled set to:', this.isScrolled);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.mobileMenuOpen = false;
  }

  // Hard navigation for standalone (non-Angular) pages like /our-story
  goToPage(path: string, event: Event): void {
    event.preventDefault();
    this.mobileMenuOpen = false;
    this.openSubmenu = null;
    window.location.href = path;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) {
      this.openSubmenu = null;
    }
  }

  // Mobile: tap a parent item to expand/collapse its submenu instead of navigating
  toggleSubmenu(name: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.openSubmenu = this.openSubmenu === name ? null : name;
  }

  openCart(): void {
    this.cartService.openCart();
  }
}
