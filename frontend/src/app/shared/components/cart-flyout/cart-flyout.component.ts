import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-flyout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-flyout.component.html',
  styleUrl: './cart-flyout.component.css'
})
export class CartFlyoutComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartOpen$: Observable<boolean>;

  constructor(
    public cartService: CartService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartOpen$ = this.cartService.cartOpen$;
  }

  ngOnInit(): void {}

  closeCart(): void {
    this.cartService.closeCart();
  }

  removeItem(id: string, type: 'service' | 'bundle'): void {
    this.cartService.removeFromCart(id, type);
  }

  updateQuantity(id: string, type: 'service' | 'bundle', quantity: number): void {
    this.cartService.updateQuantity(id, type, quantity);
  }

  getTotal(): number {
    return this.cartService.getCartTotal();
  }

  proceedToCheckout(): void {
    this.cartService.closeCart();
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.cartService.closeCart();
    this.router.navigate(['/services']);
  }
}
