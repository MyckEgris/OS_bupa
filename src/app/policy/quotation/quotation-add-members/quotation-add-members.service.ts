import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuotationAddMembersComponent } from './quotation-add-members.component';
import { QuotationEditMembersComponent } from '../quotation-edit-members/quotation-edit-members.component';

@Injectable({
  providedIn: 'root'
})
export class QuotationAddMembersService {

  constructor(private modalService: NgbModal, ) { }

  async showDialog(
    member, 
    addedMembers: Array<any>,
    closeWindow?: boolean) {

    const result = this.modalService.open(QuotationEditMembersComponent,
      { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-claimsubmission-step3' });
    const dialog = result.componentInstance as QuotationEditMembersComponent;

    dialog.member = member;
    dialog.closeWindow = closeWindow ? closeWindow : false;
    dialog.addedMembers = addedMembers;

    return await result.result;

  }
}
