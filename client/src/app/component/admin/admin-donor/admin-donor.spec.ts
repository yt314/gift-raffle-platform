import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDonor } from './admin-donor';

describe('AdminDonor', () => {
  let component: AdminDonor;
  let fixture: ComponentFixture<AdminDonor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDonor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDonor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
