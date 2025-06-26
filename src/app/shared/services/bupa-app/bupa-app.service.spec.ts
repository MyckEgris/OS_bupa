import { TestBed, inject } from '@angular/core/testing';

import { BupaAppService } from './bupa-app.service';

describe('BupaAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BupaAppService]
    });
  });

  it('should be created', inject([BupaAppService], (service: BupaAppService) => {
    expect(service).toBeTruthy();
  }));
});
