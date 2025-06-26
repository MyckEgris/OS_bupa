import { TestBed, inject } from '@angular/core/testing';

import { QuotationAddMembersService } from './quotation-add-members.service';

describe('QuotationAddMembersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuotationAddMembersService]
    });
  });

  it('should be created', inject([QuotationAddMembersService], (service: QuotationAddMembersService) => {
    expect(service).toBeTruthy();
  }));
});
