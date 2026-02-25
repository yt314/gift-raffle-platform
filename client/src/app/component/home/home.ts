import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [ButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private authService = inject(AuthService);
  private router = inject(Router);
  user = JSON.parse(localStorage.getItem('user')!);
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
