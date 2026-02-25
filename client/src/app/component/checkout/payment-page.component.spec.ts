import { TestBed } from '@angular/core/testing';
import { PaymentPageComponent } from './payment-page.component';

describe('PaymentPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPageComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PaymentPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('form should be invalid when acceptTerms is false', () => {
    const fixture = TestBed.createComponent(PaymentPageComponent);
    const c = fixture.componentInstance;

    c.form.patchValue({
      email: 'test@example.com',
      cardHolderName: 'Dana Levi',
      cardNumber: '4242 4242 4242 4242',
      expiry: '12/99',
      cvv: '123',
      billing: { country: 'Israel', city: 'Tel Aviv', address1: 'Dizengoff 1', zip: '61000' },
      acceptTerms: false
    });

    expect(c.form.valid).toBeFalse();
    expect(c.form.get('acceptTerms')?.errors?.['requiredTrue']).toBeTrue();
  });

  it('form should be valid with good data', () => {
    const fixture = TestBed.createComponent(PaymentPageComponent);
    const c = fixture.componentInstance;

    c.form.patchValue({
      email: 'test@example.com',
      cardHolderName: 'Dana Levi',
      cardNumber: '4242 4242 4242 4242',
      expiry: '12/99',
      cvv: '123',
      billing: { country: 'Israel', city: 'Tel Aviv', address1: 'Dizengoff 1', zip: '61000' },
      acceptTerms: true
    });

    expect(c.form.valid).toBeTrue();
  });
});
