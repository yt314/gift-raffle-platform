import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { prizeModel } from '../../../models/prizeModel';
import { prizeService } from '../../../services/prize/prize';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import * as XLSX from 'xlsx';

type LotteryResult = {
  prizeId: number;
  winnerUserId: number;
  emailSent: boolean;
  winner?: { id: number; fullName: string; email: string };
};

@Component({
  selector: 'app-admin-prize',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    ProgressSpinnerModule,
    TooltipModule,
    DialogModule,
  ],
  templateUrl: './admin-prize.html',
  styleUrl: './admin-prize.scss',
})
export class AdminPrize {
  private prizeService = inject(prizeService);
  private http = inject(HttpClient);

  private lotteryApiUrl = 'https://localhost:7063/api/lottery';

  prizes: prizeModel[] = [];
  selectedPrize: prizeModel | null = null;

  newPrize: Partial<prizeModel> = {
    name: '',
  };

  isLoading = true;
  isManager = false;

  rafflingPrizeId: number | null = null;
  raffleErrorByPrizeId: Record<number, string> = {};

  showCreateDialog = false;
  showEditDialog = false;

  ngOnInit(): void {
    this.isManager = this.checkIsManager();
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

  selectForEdit(prize: prizeModel) {
    this.selectedPrize = { ...(prize as any) };
  }

  openCreateDialog() {
    this.newPrize = { name: '' };
    this.showCreateDialog = true;
  }

  openEditDialog(prize: prizeModel) {
    this.selectedPrize = { ...(prize as any) };
    this.showEditDialog = true;
  }

  resetCreateForm() {
    this.newPrize = { name: '' };
    this.showCreateDialog = false;
  }

  resetEditForm() {
    this.selectedPrize = null;
    this.showEditDialog = false;
  }

  saveUpdate() {
    if (!this.selectedPrize) return;

    this.prizeService
      .updateById((this.selectedPrize as any).id, this.selectedPrize)
      .subscribe({
        next: () => {
          this.resetEditForm();
          this.loadPrizes();
        },
      });
  }

  createPrize() {
    this.prizeService.create(this.newPrize as prizeModel).subscribe({
      next: () => {
        this.resetCreateForm();
        this.loadPrizes();
      },
    });
  }

  deletePrize(id: number) {
    if (!confirm('למחוק את הפרס?')) return;

    this.prizeService.deleteById(id).subscribe({
      next: () => {
        this.prizes = this.prizes.filter((p: any) => (p as any).id !== id);
      },
    });
  }

  cancelEdit() {
    this.resetEditForm();
  }

  exportToExcel() {
    const dataToExport = this.prizes.map((prize: any) => ({
      'ID': prize.id,
      'שם': prize.name,
      'תיאור': prize.description,
      'קוד תורם': prize.donorId,
      'קוד קטגוריה': prize.categoryId,
      'מחיר כרטיס': prize.ticketPrice,
      'כתובת תמונה': prize.imagePath,
      'הוגרל': prize.isRaffleDone ? 'כן' : 'לא',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'פרסים');
    XLSX.writeFile(workbook, `prizes_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        data.forEach((row: any) => {
          const newPrize: Partial<prizeModel> = {
            name: row['שם'] || row['Name'] || '',
            description: row['תיאור'] || row['Description'] || '',
            donorId: parseInt(row['קוד תורם'] || row['Donor ID'] || 0),
            categoryId: parseInt(row['קוד קטגוריה'] || row['Category ID'] || 0),
            ticketPrice: parseFloat(row['מחיר כרטיס'] || row['Ticket Price'] || 0),
            imagePath: row['כתובת תמונה'] || row['Image Path'] || '',
          };

          this.prizeService.create(newPrize as prizeModel).subscribe({
            next: () => {
              console.log('Prize imported:', newPrize.name);
            },
            error: (err) => {
              console.error('Error importing prize:', err);
            },
          });
        });

        setTimeout(() => this.loadPrizes(), 1000);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert('שגיאה בקריאת קובץ Excel. אנא ודא שהקובץ בפורמט הנכון.');
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  }

  rafflePrize(prize: any) {
    if (!this.isManager) return;

    this.raffleErrorByPrizeId[prize.id] = '';
    if (prize.isRaffleDone) return;

    if (!confirm(`להגריל את "${prize.name}" עכשיו? אחרי ההגרלה לא יהיה ניתן לקנות את המוצר.`)) {
      return;
    }

    this.rafflingPrizeId = prize.id;

    const headers = this.buildAuthHeaders();
    this.http
      .post<LotteryResult>(`${this.lotteryApiUrl}/raffle/${prize.id}`, {}, { headers })
      .subscribe({
        next: (result) => {
          prize.isRaffleDone = true;
          prize.winnerUserId = result?.winnerUserId ?? null;

          const winnerName = result?.winner?.fullName || '';
          if (winnerName) {
            prize._winnerFullName = winnerName;
            this.setWinnerName(prize.id, winnerName);
          }

          this.rafflingPrizeId = null;
        },
        error: (err) => {
          const msg =
            err?.error?.message ||
            err?.message ||
            'שגיאה בהגרלה. בדקי שיש לך הרשאת מנהל ושיש משתתפים במוצר.';
          this.raffleErrorByPrizeId[prize.id] = msg;
          this.rafflingPrizeId = null;
        },
      });
  }

  getWinnerLabel(prize: any): string {
    if (prize?._winnerFullName) return prize._winnerFullName;

    if (prize?.winnerUserId) return `משתמש #${prize.winnerUserId}`;

    return 'לא ידוע';
  }

  private checkIsManager(): boolean {
    const role = (localStorage.getItem('role') || localStorage.getItem('userRole') || '').toLowerCase();
    if (role === 'manager' || role === 'admin') return true;

    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const payload = token ? this.tryDecodeJwt(token) : null;

    const roles = payload?.role || payload?.roles || payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (Array.isArray(roles)) return roles.map((r) => String(r).toLowerCase()).includes('manager');
    if (typeof roles === 'string') return roles.toLowerCase().includes('manager');

    return false;
  }

  private buildAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) return new HttpHeaders();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private tryDecodeJwt(token: string): any | null {
    try {
      const part = token.split('.')[1];
      if (!part) return null;
      const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(normalized)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private getWinnersMap(): Record<number, string> {
    try {
      const raw = localStorage.getItem('prizeWinners');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private setWinnerName(prizeId: number, winnerName: string) {
    const map = this.getWinnersMap();
    map[prizeId] = winnerName;
    localStorage.setItem('prizeWinners', JSON.stringify(map));
  }
}
