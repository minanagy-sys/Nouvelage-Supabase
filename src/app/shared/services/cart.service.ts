import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartOpen = new BehaviorSubject<boolean>(false);

  public cartItems$ = this.cartItems.asObservable();
  public cartOpen$ = this.cartOpen.asObservable();

  constructor() {
    // Load cart from localStorage on init
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('nouvelage_cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          this.cartItems.next(items);
        } catch (e) {
          console.error('Error loading cart from storage', e);
        }
      }
    }
  }

  private saveCartToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nouvelage_cart', JSON.stringify(this.cartItems.value));
    }
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(
      i => i.id === item.id && i.type === item.type && i.branch === item.branch
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      currentItems[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      currentItems.push(item);
    }

    this.cartItems.next([...currentItems]);
    this.saveCartToStorage();
    this.openCart();
  }

  removeFromCart(itemId: string, type: 'service' | 'bundle'): void {
    const currentItems = this.cartItems.value;
    const filteredItems = currentItems.filter(
      item => !(item.id === itemId && item.type === type)
    );
    this.cartItems.next(filteredItems);
    this.saveCartToStorage();
  }

  updateQuantity(itemId: string, type: 'service' | 'bundle', quantity: number): void {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(
      item => item.id === itemId && item.type === type
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(itemId, type);
      } else {
        currentItems[itemIndex].quantity = quantity;
        this.cartItems.next([...currentItems]);
        this.saveCartToStorage();
      }
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }

  getCartCount(): Observable<number> {
    return new BehaviorSubject(
      this.cartItems.value.reduce((count, item) => count + item.quantity, 0)
    ).asObservable();
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  openCart(): void {
    this.cartOpen.next(true);
  }

  closeCart(): void {
    this.cartOpen.next(false);
  }

  toggleCart(): void {
    this.cartOpen.next(!this.cartOpen.value);
  }
}
