import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/donor/donor';
import { HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { donorModel } from '../../../models/donorModel';

@Component({
  selector: 'app-admin-donor',
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
  templateUrl: './admin-donor.html',
  styleUrl: './admin-donor.scss',
})
export class AdminDonor {
  private donorService = inject(UserService);
  donors: donorModel[] = [];
  selectedDonor: donorModel | null = null;

  newDonor: Partial<donorModel> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  showCreateDialog = false;
  showEditDialog = false;

  isLoading = true;
  isManager = false;

  ngOnInit(): void {
    this.isManager = this.checkIsManager();
    this.loadDonors();
  }

  loadDonors() {
    this.isLoading = true;
    this.donorService.getAll().subscribe({
      next: (data) => {
        this.donors = data;
        console.log('Donors loaded:', this.donors);
        console.log('First donor sample:', this.donors[0]);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading donors:', err);
        this.isLoading = false;
      },
    });
  }

  selectForEdit(donor: donorModel) {
    this.openEditDialog(donor);
  }

  openCreateDialog() {
    this.newDonor = { firstName: '', lastName: '', email: '', phone: '' };
    this.showCreateDialog = true;
  }

  openEditDialog(donor: donorModel) {
    this.selectedDonor = { ...donor };
    this.showEditDialog = true;
  }

  resetCreateForm() {
    this.newDonor = { firstName: '', lastName: '', email: '', phone: '' };
    this.showCreateDialog = false;
  }

  resetEditForm() {
    this.selectedDonor = null;
    this.showEditDialog = false;
  }

  saveUpdate() {
    if (!this.selectedDonor) return;

    this.donorService
      .updateDonorById(this.selectedDonor.id, this.selectedDonor)
      .subscribe({
        next: () => {
          this.loadDonors();
          this.resetEditForm();
        },
      });
  }

  deleteDonor(id: number) {
    if (!confirm('למחוק את התורם?')) return;

    this.donorService.deleteDonorById(id).subscribe({
      next: () => {
        this.donors = this.donors.filter((d) => d.id !== id);
      },
    });
  }

  createDonor() {
    this.donorService.createDonor(this.newDonor as donorModel).subscribe({
      next: () => {
        this.loadDonors();
        this.resetCreateForm();
      },
    });
  }

  cancelEdit() {
    this.selectedDonor = null;
  }

  exportToExcel() {
    const dataToExport = this.donors.map((donor) => ({
      'Id': donor.id,
      'FirstName': donor.firstName,
      'LastName': donor.lastName,
      'Email': donor.email,
      'Phone': donor.phone,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Set column widths
    const colWidths = [
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'תורמים');

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `donors_${date}.xlsx`);
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

        let importCount = 0;
        data.forEach((row: any) => {
          const firstName = row['שם פרטי'] || row['FirstName'] || row['firstName'] || '';
          const lastName = row['שם משפחה'] || row['LastName'] || row['lastName'] || '';
          const email = row['אימייל'] || row['Email'] || row['email'] || '';
          const phone = row['טלפון'] || row['Phone'] || row['phone'] || '';

          if (firstName || lastName) {
            const newDonor: donorModel = {
              id: 0,
              firstName: firstName,
              lastName: lastName,
              email: email,
              phone: phone,
            };

            this.donorService.createDonor(newDonor).subscribe({
              next: () => {
                importCount++;
              },
              error: (err) => {
                console.error('Error importing donor:', err);
              },
            });
          }
        });

        // Reload donors after import
        if (importCount > 0) {
          setTimeout(() => this.loadDonors(), 1000);
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = '';
  }

  // ------------------------
  // ניהול הרשאות מנהל
  // ------------------------
  private checkIsManager(): boolean {
    // א) אם שמרתם role ב-localStorage
    const role = (localStorage.getItem('role') || localStorage.getItem('userRole') || '').toLowerCase();
    if (role === 'manager' || role === 'admin') return true;

    // ב) בדיקת JWT (roles / role)
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
}
