import { FormControl } from '@angular/forms';
import { cvvValidator, expiryValidator, luhnCheck, luhnValidator, fullNameValidator } from './payment.validators';

describe('payment.validators', () => {
  it('luhnCheck should validate known good card number', () => {
    expect(luhnCheck('4242 4242 4242 4242')).toBeTrue();
  });

  it('luhnValidator should fail invalid number', () => {
    const c = new FormControl('1111 1111 1111 1111', [luhnValidator()]);
    expect(c.valid).toBeFalse();
    expect(c.errors?.['luhn']).toBeTrue();
  });

  it('expiryValidator should accept a future date', () => {
    const now = new Date();
    const future = new Date(now.getFullYear(), now.getMonth() + 2, 1);
    const mm = String(future.getMonth() + 1).padStart(2, '0');
    const yy = String(future.getFullYear() % 100).padStart(2, '0');

    const c = new FormControl(`${mm}/${yy}`, [expiryValidator()]);
    expect(c.valid).toBeTrue();
  });

  it('expiryValidator should reject past date', () => {
    const c = new FormControl('01/20', [expiryValidator()]);
    expect(c.valid).toBeFalse();
    expect(
      c.errors?.['expiryPast'] || c.errors?.['expiryFormat'] || c.errors?.['expiryYear']
    ).toBeTruthy();
  });

  it('cvvValidator should accept 3 or 4 digits', () => {
    expect(new FormControl('123', [cvvValidator()]).valid).toBeTrue();
    expect(new FormControl('1234', [cvvValidator()]).valid).toBeTrue();
  });

  it('cvvValidator should reject non-digit', () => {
    const c = new FormControl('12a', [cvvValidator()]);
    expect(c.valid).toBeFalse();
    expect(c.errors?.['cvv']).toBeTrue();
  });

  it('fullNameValidator should require at least two words', () => {
    expect(new FormControl('Dana', [fullNameValidator()]).valid).toBeFalse();
    expect(new FormControl('Dana Levi', [fullNameValidator()]).valid).toBeTrue();
  });
});
