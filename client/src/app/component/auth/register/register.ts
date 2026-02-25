import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    InputTextModule, 
    PasswordModule, 
    ButtonModule, 
    ToastModule,
    KeyFilterModule
  ],
  providers: [MessageService],
  templateUrl: './register.html'
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  form = new FormGroup({
    firstName: new FormControl('', { 
      validators: [Validators.required, Validators.minLength(2)], 
      nonNullable: true 
    }),
    lastName: new FormControl('', { 
      validators: [Validators.required], 
      nonNullable: true 
    }),
    email: new FormControl('', { 
      validators: [Validators.required, Validators.email], 
      nonNullable: true 
    }),
    password: new FormControl('', { 
      validators: [Validators.required, Validators.minLength(6)], 
      nonNullable: true 
    }),
    phone: new FormControl('', { 
      validators: [
        Validators.required, 
        Validators.pattern('^[0-9]*$'), 
        Validators.minLength(9)
      ], 
      nonNullable: true 
    }),
    address: new FormControl('', { nonNullable: true })
  });

  submit() {
    if (this.form.invalid) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'טופס לא תקין', 
        detail: 'נא לתקן את השגיאות לפני השליחה' 
      });
      return;
    }

    this.authService.register(this.form.value as any).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'נרשמת בהצלחה!', 
          detail: 'מעבירה אותך לדף ההתחברות...' 
        });
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        let errorMsg = 'שגיאה ברישום המשתמש';
        
        if (err.error?.errors?.Password) {
          errorMsg = err.error.errors.Password.join('\n');
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        }

        this.messageService.add({ 
          severity: 'error', 
          summary: 'שגיאה', 
          detail: errorMsg 
        });
      }
    });
  }
}