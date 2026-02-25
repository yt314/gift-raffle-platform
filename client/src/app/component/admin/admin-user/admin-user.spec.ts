import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUser } from './admin-user';

describe('AdminUser', () => {
  let component: AdminUser;
  let fixture: ComponentFixture<AdminUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
