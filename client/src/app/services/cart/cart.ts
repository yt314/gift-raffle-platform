import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { tap } from 'rxjs';

export interface CartItem {
  id: number;
  prizeId: number;
  prizeName: string;
  ticketPrice: number;
  imagePath?: string | null;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7063/api/Cart';

  cartItems = signal<CartItem[]>([]);
  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));

  loadCart(userId: number) {
    return this.http.get<CartItem[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((items) => this.cartItems.set(items))
    );
  }

  addItem(prizeId: number, userId: number) {
    const params = new HttpParams()
      .set('userId', String(userId))
      .set('prizeId', String(prizeId));

    return this.http.post(`${this.apiUrl}/addToCart`, null, { params }).pipe(
      tap(() => this.loadCart(userId).subscribe())
    );
  }

  updateQty(cartItemId: number, quantity: number, userId: number) {
    return this.http.put(`${this.apiUrl}/updateQuantity/${cartItemId}`, quantity).pipe(
      tap(() => this.loadCart(userId).subscribe())
    );
  }

  removeItem(cartItemId: number, userId: number) {
    return this.http.delete(`${this.apiUrl}/deleteItem/${cartItemId}`).pipe(
      tap(() => this.loadCart(userId).subscribe())
    );
  }

  pay(userId: number) {
    return this.http.post(`${this.apiUrl}/pay/${userId}`, null).pipe(
      tap(() => this.loadCart(userId).subscribe())
    );
  }
}
