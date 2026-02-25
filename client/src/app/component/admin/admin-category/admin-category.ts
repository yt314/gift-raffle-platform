import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { categoryService } from '../../../services/category/category';
import { categoryModel } from '../../../models/categoryModel';
import { HttpHeaders } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-category',
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
  templateUrl: './admin-category.html',
  styleUrl: './admin-category.scss',
})
export class AdminCategory {
  private categoryService = inject(categoryService);
  categories: categoryModel[] = [];
  selectedCategory: categoryModel | null = null;

  newCategory: Partial<categoryModel> = {
    name: '',
  };

  showCreateDialog = false;
  showEditDialog = false;

  isLoading = true;
  isManager = false;

  ngOnInit(): void {
    this.isManager = this.checkIsManager();
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        console.log(this.categories);
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  selectForEdit(category: categoryModel) {
    this.openEditDialog(category);
  }

  openCreateDialog() {
    this.newCategory = { name: '' };
    this.showCreateDialog = true;
  }

  openEditDialog(category: categoryModel) {
    this.selectedCategory = { ...(category as any) };
    this.showEditDialog = true;
  }

  resetCreateForm() {
    this.newCategory = { name: '' };
    this.showCreateDialog = false;
  }

  resetEditForm() {
    this.selectedCategory = null;
    this.showEditDialog = false;
  }

  saveUpdate() {
    if (!this.selectedCategory) return;

    this.categoryService
      .updateCategoryById((this.selectedCategory as any).id, this.selectedCategory)
      .subscribe({
        next: () => {
          this.loadCategories();
          this.resetEditForm();
        },
      });
  }

  createCategory() {
    this.categoryService.createCategory(this.newCategory as categoryModel).subscribe({
      next: () => {
        this.loadCategories();
        this.resetCreateForm();
      },
    });
  }


  cancelEdit() {
    this.selectedCategory = null;
  }

  exportToExcel() {
    const dataToExport = this.categories.map((category) => ({
      'ID': category.id,
      'שם': category.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    const colWidths = [
      { wch: 10 },
      { wch: 30 },
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'קטגוריות');

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `categories_${date}.xlsx`);
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
          const categoryName = row['שם'] || row['Name'] || row['name'] || '';
          
          if (categoryName) {
            const newCategory: categoryModel = {
              id: 0,
              name: categoryName,
            };

            this.categoryService.createCategory(newCategory).subscribe({
              next: () => {
                importCount++;
              },
              error: (err) => {
                console.error('Error importing category:', err);
              },
            });
          }
        });

        if (importCount > 0) {
          setTimeout(() => this.loadCategories(), 1000);
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = '';
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

}

