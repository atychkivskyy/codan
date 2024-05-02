import { TestBed } from '@angular/core/testing';

import { AxiosServiceService } from './axios-service.service';

describe('AxiosServiceService', () => {
  let service: AxiosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxiosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
