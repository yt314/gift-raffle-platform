import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user';
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
import { UserModel } from '../../../models/user/userModel';

@Component({
  selector: 'app-admin-user',
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
  templateUrl: './admin-user.html',
  styleUrl: './admin-user.scss',
})
export class AdminUser {
  private userService = inject(UserService);
  users: UserModel[] = [];
  selectedUser: UserModel | null = null;

  newUser: Partial<UserModel> = {
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: '',
    role: 'user'
  };

  showCreateDialog = false;
  showEditDialog = false;

  isLoading = true;
  isManager = false;

  ngOnInit(): void {
    this.isManager = this.checkIsManager();
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Users loaded:', this.users);
        console.log('First user sample:', this.users[0]);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      },
    });
  }

  selectForEdit(user: UserModel) {
    this.openEditDialog(user);
  }

  openCreateDialog() {
    this.newUser = { firstName: '', lastName: '', address: '', email: '', phone: '', role: 'user' };
    this.showCreateDialog = true;
  }

  openEditDialog(user: UserModel) {
    this.selectedUser = { ...(user as any) };
    this.showEditDialog = true;
  }

  resetCreateForm() {
    this.newUser = { firstName: '', lastName: '', address: '', email: '', phone: '', role: 'user' };
    this.showCreateDialog = false;
  }

  resetEditForm() {
    this.selectedUser = null;
    this.showEditDialog = false;
  }

  saveUpdate() {
    if (!this.selectedUser) return;

    this.userService
      .updateUserById((this.selectedUser as any).id, this.selectedUser)
      .subscribe({
        next: () => {
          this.loadUsers();
          this.resetEditForm();
        },
      });
  }


  deleteUsers(id: number) {
    if (!confirm('למחוק את המשתמש?')) return;

    this.userService.deleteUserById(id).subscribe({
      next: () => {
        this.users = this.users.filter((u: any) => (u as any).Id !== id);
        this.loadUsers();
      },
    });
  }

  createUser() {
    this.userService.createUser(this.newUser as UserModel).subscribe({
      next: () => {
        this.loadUsers();
        this.resetCreateForm();
      },
    });
  }

  cancelEdit() {
    this.selectedUser = null;
  }

  exportToExcel() {
    const dataToExport = this.users.map((user) => ({
      'Id': user.id,
      'FirstName': user.firstName,
      'LastName': user.lastName,
      'Address': user.address,
      'Email': user.email,
      'Phone': user.phone,
      'Role': user.role
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    const colWidths = [
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'משתמשים');

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `users_${date}.xlsx`);
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
          const address = row['כתובת'] || row['Address'] || row['address'] || '';
          const email = row['אימייל'] || row['Email'] || row['email'] || '';
          const phone = row['טלפון'] || row['Phone'] || row['phone'] || '';
          const role = row['תפקיד'] || row['Role'] || row['role'] || 'user';

          if (firstName || lastName) {
            const newUser: UserModel = {
              id: 0,
              firstName: firstName,
              lastName: lastName,
              address: address,
              email: email,
              phone: phone,
              role: role,
              signAt: new Date(Date.now())
            };

            this.userService.createUser(newUser).subscribe({
              next: () => {
                importCount++;
              },
              error: (err) => {
                console.error('Error importing user:', err);
              },
            });
          }
        });

        if (importCount > 0) {
          setTimeout(() => this.loadUsers(), 1000);
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


