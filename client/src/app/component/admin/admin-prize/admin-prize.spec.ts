import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPrize } from './admin-prize';

describe('AdminPrize', () => {
  let component: AdminPrize;
  let fixture: ComponentFixture<AdminPrize>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPrize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPrize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
