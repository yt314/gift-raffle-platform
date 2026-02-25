import { TestBed } from '@angular/core/testing';
import { prizeService } from '../../services/prize/prize';


describe('Prize', () => {
  let service: prizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(prizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
