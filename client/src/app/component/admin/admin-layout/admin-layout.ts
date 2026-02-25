import { R } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
@Component({
  selector: 'app-admin-layout',
    standalone: true,
  imports: [PanelMenuModule, RouterOutlet ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
items: MenuItem[] = [
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
}
