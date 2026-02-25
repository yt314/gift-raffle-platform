import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    InputTextModule, 
    ButtonModule, 
    DividerModule, 
    MessageModule
  ],
  templateUrl: './login.html'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string | null = null;
  loading: boolean = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.form.value as any).subscribe({
      next: (res) => {
        this.authService.setLogin(res.token, res.user);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "אימייל או סיסמה שגויים.";
      }
    });
  }
}