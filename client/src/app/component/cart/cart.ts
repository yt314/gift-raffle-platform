import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderListModule } from 'primeng/orderlist';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

import { CartService, CartItem } from '../../services/cart/cart';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderListModule, ButtonModule, InputNumberModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent implements OnInit {
  public cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  userId = 0;
  isPaying = false;

  @ViewChild('confettiCanvas') confettiCanvas?: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    const user: any = (typeof (this.authService as any).getUser === 'function')
      ? (this.authService as any).getUser()
      : (this.authService as any).getUser;

    if (user?.id) {
      this.userId = Number(user.id);
      this.cartService.loadCart(this.userId).subscribe();
    }
  }

  onQuantityChange(item: CartItem) {
    this.cartService.updateQty(item.id, item.quantity, this.userId).subscribe();
  }

  deleteItem(itemId: number) {
    this.cartService.removeItem(itemId, this.userId).subscribe();
  }

  get totalPrice(): number {
    return this.cartService.cartItems().reduce((acc: number, item: CartItem) => acc + (item.ticketPrice * item.quantity), 0);
  }

  payNow() {
    if (!this.userId) return;
    this.fireConfetti(1000);

    this.router.navigateByUrl('/checkout')
  }
  private fireConfetti(durationMs = 800) {
    const canvas = this.confettiCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.style.display = 'block';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pieces = Array.from({ length: 110 }).map(() => ({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.25,
      r: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4,
      vy: 2 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vrot: -0.2 + Math.random() * 0.4,
      color: `hsl(${Math.floor(Math.random() * 360)}, 90%, 55%)`
    }));

    const start = performance.now();

    const tick = (t: number) => {
      const elapsed = t - start;
      ctx.clearRect(0, 0, w, h);

      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.vy += 0.06;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      }

      if (elapsed < durationMs) requestAnimationFrame(tick);
      else {
        ctx.clearRect(0, 0, w, h);
        canvas.style.display = 'none';
      }
    };

    requestAnimationFrame(tick);
  }
}
