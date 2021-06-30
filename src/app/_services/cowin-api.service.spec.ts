import { TestBed } from '@angular/core/testing';

import { CowinApiService } from './cowin-api.service';

describe('CowinApiService', () => {
  let service: CowinApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CowinApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
