import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart/cart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { cvvValidator, expiryValidator, fullNameValidator, luhnValidator } from './validators/payment.validators';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DividerModule,
    CheckboxModule,
    ToastModule, 
    StepsModule,
    InputTextModule,
    InputMaskModule,
    FloatLabelModule,
],
  providers: [MessageService],
  templateUrl: './payment-page.component.html'
})
export class PaymentPageComponent {
  private fb = inject(FormBuilder);
  private messages = inject(MessageService);
  private cartService=inject(CartService);
  private router = inject(Router);
  private authService = inject(AuthService)
  readonly cart=this.cartService.cartItems;
  readonly shipping = signal<number>(19.9);
  readonly discount = signal<number>(20);

 ngOnInit(){  
  const user = this.authService.getUser;
  console.log('user from auth=',user)

  const userId = Number((user as any)?.id);
  console.log('userId=',userId)

  if(!userId){
    console.warn('no user found');
    return;
  }
  this.cartService.loadCart(userId).subscribe({
    next: (items) => console.log('Cart loaded:', items),
    error: (err) => console.error('loadCart failed:', err)
  });
 }
  readonly subtotal = computed(() =>
    this.cart().reduce((sum, i) => sum + i.quantity * i.ticketPrice, 0)
  );

  readonly total = computed(() => this.subtotal() );
  readonly processing = signal(false);
  readonly steps = [
    { label: 'פרטים' },
    { label: 'תשלום' },
    { label: 'אישור' }
  ];

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    cardHolderName: ['', [Validators.required, Validators.minLength(5), fullNameValidator()]],
    cardNumber: ['', [Validators.required, luhnValidator()]],
    expiry: ['', [Validators.required, expiryValidator()]],
    cvv: ['', [Validators.required, cvvValidator()]],
    saveCard: [false],
    billing: this.fb.group({
      country: ['Israel', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      address1: ['', [Validators.required, Validators.minLength(3)]],
      zip: ['', [Validators.required, Validators.pattern(/^[0-9]{5,7}$/)]]
    }),

    acceptTerms: [false, [Validators.requiredTrue]]
  });

  async submit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: false });

    if (this.form.invalid) {
      this.messages.add({
        severity: 'error',
        summary: 'יש שגיאות בטופס',
        detail: 'בדוק/י את השדות המסומנים ונסה/י שוב.' 
      });
      return;
    }
          this.processing.set(true);
          const userId = Number(this.authService.getUser?.id);
      if (!userId) return;

      this.processing.set(true);

      this.cartService.pay(userId).subscribe({
        next: () => {
          this.messages.add({ severity: 'success', summary: 'התשלום נקלט', detail: 'תודה! ההזמנה בוצעה.' });
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error(err);
          this.messages.add({ severity: 'error', summary: 'שגיאה בתשלום', detail: 'נסה שוב.' });
          this.processing.set(false);
        }
      });
    try {
      await new Promise((r) => setTimeout(r, 650));
      this.messages.add({
        severity: 'success',
        summary: 'התשלום נקלט',
        detail: `הזמנה בסך ${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(this.total())} נשלחה לעיבוד.` 
      });
    this.router.navigate(["/"])
    } 

    finally {
      this.processing.set(false);
    }
  }

  fieldError(path: string): string | null {
    const c = this.form.get(path);
    if (!c || !(c.touched || c.dirty) || !c.errors) return null;

    if (c.errors['required']) return 'שדה חובה';
    if (c.errors['email']) return 'אימייל לא תקין';
    if (c.errors['minlength']) return `מינימום ${c.errors['minlength'].requiredLength} תווים`;
    if (c.errors['pattern']) return 'פורמט לא תקין';
    if (c.errors['requiredTrue']) return 'חובה לאשר תנאים';
    if (c.errors['fullName']) return 'נא להזין שם פרטי + שם משפחה';
    if (c.errors['luhn']) return 'מספר כרטיס לא תקין';
    if (c.errors['expiryFormat']) return 'פורמט תוקף צריך להיות MM/YY';
    if (c.errors['expiryMonth']) return 'חודש תוקף חייב להיות 01–12';
    if (c.errors['expiryPast']) return 'תוקף הכרטיס פג';
    if (c.errors['cvv']) return 'CVV חייב להיות 3–4 ספרות';

    return 'שדה לא תקין';
  }
}
