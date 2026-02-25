import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { prizeModel } from '../../models/prizeModel';
import { prizeService } from '../../services/prize/prize';

@Component({
  selector: 'app-lottery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lottery.html',
  styleUrl: './lottery.scss',
})
export class Lottery {
  private prizeService = inject(prizeService);

  prizes: prizeModel[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadPrizes();
  }

  loadPrizes() {
    this.isLoading = true;
    this.prizeService.getAll().subscribe({
      next: (data) => {
        const winnersMap = this.getWinnersMap();
        this.prizes = (data || []).map((p: any) => ({
          ...p,
          _winnerFullName: winnersMap[p.id] || p?._winnerFullName,
        }));
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  buyTicket(prize: any) {
    if (prize?.isRaffleDone) return;
    alert(`רכישת כרטיס עבור "${prize.name}" (דמו בצד לקוח).`);
  }

  getWinnerLabel(prize: any): string {
    if (prize?._winnerFullName) return prize._winnerFullName;
    if (prize?.winnerUserId) return `משתמש #${prize.winnerUserId}`;
    return 'לא ידוע';
  }

  private getWinnersMap(): Record<number, string> {
    try {
      const raw = localStorage.getItem('prizeWinners');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
}
