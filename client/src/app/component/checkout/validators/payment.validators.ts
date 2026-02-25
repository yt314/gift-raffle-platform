import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function luhnCheck(cardNumberRaw: string): boolean {
  const digits = (cardNumberRaw || '').replace(/\D/g, '');
  if (!digits || digits.length < 12) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (Number.isNaN(d)) return false;

    if (shouldDouble) {
      d = d * 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function luhnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!value) return null;
    return luhnCheck(value) ? null : { luhn: true };
  };
}

export function expiryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) return null;

    const m = value.match(/^(\d{2})\s*\/\s*(\d{2}|\d{4})$/);
    if (!m) return { expiryFormat: true };

    const month = Number(m[1]);
    let year = Number(m[2]);

    if (month < 1 || month > 12) return { expiryMonth: true };
    if (Number.isNaN(year)) return { expiryYear: true };

    if (m[2].length === 2) year = 2000 + year;

    const now = new Date();
    const expEnd = new Date(year, month, 0, 23, 59, 59, 999);
    return expEnd >= now ? null : { expiryPast: true };
  };
}

export function cvvValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = String(control.value ?? '').replace(/\D/g, '');
    if (!v) return null;
    return /^[0-9]{3,4}$/.test(v) ? null : { cvv: true };
  };
}

export function fullNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = String(control.value ?? '').trim();
    if (!v) return null;
    const ok = /^[\p{L}][\p{L}'-]+(?:\s+[\p{L}][\p{L}'-]+)+$/u.test(v);
    return ok ? null : { fullName: true };
  };
}
