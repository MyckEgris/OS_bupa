import { TestBed, inject } from '@angular/core/testing';

import { CoveragesService } from './coverages.service';

describe('CoveragesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoveragesService]
    });
  });

  it('should be created', inject([CoveragesService], (service: CoveragesService) => {
    expect(service).toBeTruthy();
  }));
});
