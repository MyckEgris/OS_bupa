import { TestBed, inject } from '@angular/core/testing';

import { IdleUserService } from './idle-user.service';

describe('IdleUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdleUserService]
    });
  });

  it('should be created', inject([IdleUserService], (service: IdleUserService) => {
    expect(service).toBeTruthy();
  }));
});
