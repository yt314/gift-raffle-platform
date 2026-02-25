import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [MenubarModule,TieredMenuModule,ButtonModule,RouterLink,RouterLinkActive,RouterOutlet,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
  authService = inject(AuthService);
  router = inject(Router);
  categories: any[] = [];

  username = computed(() => {
    const user = this.authService.getUserSignal();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });
  adminItems: MenuItem[] = [
  {
    label: 'פעולות מנהל',
    icon: 'pi pi-cog',
    items: [
      { label: 'ניהול מתנות', icon: 'pi pi-gift', routerLink: '/admin/prizes' },
      { label: 'ניהול קטגוריות', icon: 'pi pi-tags', routerLink: '/admin/categories' },
      { label: 'ניהול תורמים', icon: 'pi pi-users', routerLink: '/admin/donors' },
      { label: 'ניהול משתמשים', icon: 'pi pi-user-edit', routerLink: '/admin/users' },
    ]
  }
];
  goToCategory(categoryId: number) {
    this.router.navigate(['/prizes/category', categoryId]);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
