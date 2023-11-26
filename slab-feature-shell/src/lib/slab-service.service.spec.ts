import { TestBed } from '@angular/core/testing';

import { SlabServiceService } from './slab-service.service';

describe('SlabServiceService', () => {
  let service: SlabServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlabServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
