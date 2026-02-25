import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lottery } from './lottery';

describe('Lottery', () => {
  let component: Lottery;
  let fixture: ComponentFixture<Lottery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lottery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lottery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
