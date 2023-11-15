import { TestBed } from '@angular/core/testing';

import { PosDataAccessService } from './pos-data-access.service';

describe('PosDataAccessService', () => {
  let service: PosDataAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosDataAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
