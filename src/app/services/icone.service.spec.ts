import { TestBed } from '@angular/core/testing';

import { IconeService } from './icone.service';

describe('IconeService', () => {
  let service: IconeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
