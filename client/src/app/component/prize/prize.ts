import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService } from '../../services/cart/cart';
import { AuthService } from '../../services/auth/auth';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ImageModule } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BadgeModule } from 'primeng/badge';

import { prizeModel } from '../../models/prizeModel';
import { prizeService } from '../../services/prize/prize';

type SortOption = { label: string; value:
   { field: keyof prizeModel; order: 1 | -1 } };

@Component({
  selector: 'app-prize',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    DataViewModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToolbarModule,
    InputTextModule,
    SelectModule,
    ImageModule,
    DividerModule,
    TooltipModule,
    InputGroupModule,
    SelectButtonModule,
    BadgeModule,
    ToastModule,
    CommonModule   
  ],
  templateUrl: './prize.html',
  styleUrls: ['./prize.scss'],
  providers: [MessageService]
})
export class PrizeComponent implements OnInit {
  prizes: prizeModel[] = [];
  filteredPrizes: prizeModel[] = [];
  isRaffling: boolean = false;
  wishlist: Set<number> = new Set();
  loading: boolean = false;

  layout: 'grid' | 'list' = 'grid';
  layoutOptions: ('grid' | 'list')[] = ['grid', 'list'];
  searchText = '';
  sortOptions: SortOption[] = [
    { label: 'שם (א-ת)', value: { field: 'name', order: 1 } },
    { label: 'שם (ת-א)', value: { field: 'name', order: -1 } },
    { label: 'מחיר (זול-יקר)', value: { field: 'ticketPrice', order: 1 } },
    { label: 'מחיר (יקר-זול)', value: { field: 'ticketPrice', order: -1 } }
  ];
  selectedSort: SortOption | null = this.sortOptions[0];

  isManager = false;

  private winnersKey = 'raffle_winner_userid_by_prize';
  winnersByPrize: Record<number, number> = {};

  private lotteryApiBase = 'https://localhost:7063/api/lottery';

constructor(
  private prizeService: prizeService,
  private http: HttpClient,
  private cartService: CartService,
  private authService: AuthService,
  private messageService: MessageService 
) {}

  ngOnInit(): void {
    this.isManager = this.checkIsManager();
    this.loadWinnersFromStorage();
    this.loadPrizes();
  }

  onSearch(event: any): void {
    this.filteredAndSortedPrizes;
  }

  addToCart(p: prizeModel): void {
    if (!this.canBuy(p)) return;

    const user: any =
      typeof (this.authService as any).getUser === 'function'
        ? (this.authService as any).getUser()
        : (this.authService as any).getUser;

    if (!user?.id) {
      alert('יש להתחבר כדי להוסיף לסל');
      return;
    }

    this.cartService.addItem(p.id, Number(user.id)).subscribe({
      next: () => {
        this.messageService.add({
        severity: 'success',
        summary: 'נוסף לסל',
        detail: `${p.name} נוסף בהצלחה 🛒`,
        life: 3000
  });

      },
      error: (err) => {
       this.messageService.add({
        severity: 'error',
        summary: 'שגיאה',
        detail: 'לא ניתן להוסיף את המוצר לסל',
        life: 4000
      });
      }
    });
  }

  toggleWishlist(p: prizeModel): void {
    if (this.wishlist.has(p.id)) {
      this.wishlist.delete(p.id);
    } else {
      this.wishlist.add(p.id);
    }
  }

  loadPrizes(): void {
    this.prizeService.getAll().subscribe({
      next: (data) => {
        this.prizes = data ?? [];
        console.log('Prizes loaded from server:', this.prizes);
        for (const p of this.prizes) {
          const localWinner = this.winnersByPrize[p.id];
          if (!p.winnerUserId && localWinner) {
            p.winnerUserId = localWinner;
          }
          if (p.winnerUserId && p.isRaffleDone !== true) {
            p.isRaffleDone = true;
          }
        }
      },
       error: (err) => {
        console.error('Error loading prizes:', err);
      }
    });
  }
  loadByCategory(categoryId: number) {
    this.loading = true;

    this.prizeService.getPrizesByCategory(categoryId).subscribe({
      next: (data) => {
        this.prizes = data;
        this.loading = false;
      }
    });
  }

  get filteredAndSortedPrizes(): prizeModel[] {
    const q = this.searchText.trim().toLowerCase();

    let items = this.prizes;

    if (q) {
      items = items.filter((p) => {
        const name = (p.name ?? '').toLowerCase();
        const desc = (p.description ?? '').toLowerCase();
        const cat = this.categoryLabel(p).toLowerCase();
        return name.includes(q) || desc.includes(q) || cat.includes(q);
      });
    }

    const opt = this.selectedSort?.value;
    if (opt) {
      const { field, order } = opt;
      items = [...items].sort((a: any, b: any) => {
        const av = a?.[field];
        const bv = b?.[field];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;

        if (typeof av === 'string' && typeof bv === 'string') return av.localeCompare(bv) * order;
        return (Number(av) - Number(bv)) * order;
      });
    }

    return items;
  }

  categoryLabel(p: prizeModel): string {
    return `קטגוריה #${p.categoryId}`;
  }

  imageUrl(p: prizeModel): string {
    return `http://localhost:4200/img/${p.imagePath}`;
  }

  priceText(p: prizeModel): string {
    return `₪${p.ticketPrice}`;
  }

  statusSeverity(p: prizeModel): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    return p.isRaffleDone ? 'secondary' : 'success';
  }

  statusLabel(p: prizeModel): string {
    return p.isRaffleDone ? 'הוגרל' : 'זמין';
  }

  getProductRating(p: prizeModel): string {
    return '5.0';
  }


  canBuy(p: prizeModel): boolean {
    return !p.isRaffleDone;
  }

  getWinnerText(p: prizeModel): string | null {
    const id = p.id;
    const fromLocal = this.winnersByPrize[id];
    const winnerId = p.winnerUserId ?? fromLocal ?? null;
    return winnerId ? `משתמש #${winnerId}` : null;
  }

  isRaffled(p: prizeModel): boolean {
    return p.isRaffleDone === true;
  }

  rafflePrize(p: prizeModel): void {
    const prizeId = p.id;
  if (!p.id || p.isRaffleDone || this.isRaffling) return;

    this.isRaffling = true;
    const token = this.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.post<any>(`${this.lotteryApiBase}/raffle/${prizeId}`, {}, { headers }).subscribe({
      next: (res) => {
        this.isRaffling = false;
        p.isRaffleDone = true;

        const winnerUserId =
          res?.winnerUserId ??
          res?.WinnerUserId ??
          res?.winner?.userId ??
          res?.winner?.id ??
          null;

        if (winnerUserId) {
          p.winnerUserId = Number(winnerUserId);
          this.winnersByPrize[prizeId] = Number(winnerUserId);
          this.saveWinnersToStorage();
        }
         this.messageService.add({
            severity: 'success',
            summary: 'הגרלה בוצעה!',
            detail: `המוצר "${p.name}" הוגרל למשתמש #${winnerUserId} 🎉`,
            life: 5000
          });
      },
      error: (err) => {
        this.isRaffling = false;
        console.error('raffle failed', err);
        this.messageService.add({
          severity: 'error',
          summary: 'שגיאה',
          detail: 'ההגרלה נכשלה. בדקי הרשאות/טוקן/שרת.',
          life: 4000
        });
      }
    });
  }


  private loadWinnersFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.winnersKey);
      this.winnersByPrize = raw ? JSON.parse(raw) : {};
    } catch {
      this.winnersByPrize = {};
    }
  }

  private saveWinnersToStorage(): void {
    localStorage.setItem(this.winnersKey, JSON.stringify(this.winnersByPrize));
  }

  private getToken(): string | null {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('jwt') ||
      null
    );
  }

  private checkIsManager(): boolean {
    const role = (localStorage.getItem('role') || localStorage.getItem('userRole') || '').toLowerCase();
    if (role === 'manager' || role === 'admin') return true;

    const token = this.getToken();
    if (!token || token.split('.').length !== 3) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const r = (
        payload?.role ||
        payload?.Role ||
        payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        ''
      )
        .toString()
        .toLowerCase();
      return r === 'manager' || r === 'admin';
    } catch {
      return false;
    }
  }

  getImageUrl(p: prizeModel): string {
    const path = (p.imagePath ?? '').toString();
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('assets/') || path.startsWith('img/')) return path;
    return `http://localhost:4200/img/${path}`;
  }

}

