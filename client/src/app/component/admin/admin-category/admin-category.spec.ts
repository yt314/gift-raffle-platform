import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategory } from './admin-category';

describe('AdminCategory', () => {
  let component: AdminCategory;
  let fixture: ComponentFixture<AdminCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
