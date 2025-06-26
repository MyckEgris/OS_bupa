import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-benefits-modal',
  templateUrl: './search-benefits-modal.component.html'
})
export class SearchBenefitsModalComponent {

  /**
   * Show text in title
   */
  public title: string;

  /**
   * Indicates if was pressed ok or cancel option
   */
  public result: boolean | number;

  /**
   * Text in accept button
   */
  public acceptText: string;

  /**
   * Text in cancel button
   */
  public declineText: string;

  /**
  * Indicates if show Print
  */
  public showPrint: boolean;

  /**
  * Indicates if close Window
  */
  public closeWindow: boolean;

  /**
  * input policyId
  */
  public policyId: number;

  /**
   * Input memberId
   */
  public memberId: number;


  /**
   * Contructor Method
   * @param activeModal NgbActiveModal Injection
   * @param router Router Injection
   */
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
    ) { }

  /**
   * Action to do if ok was pressed. Close modal
   */
  ok() {
    const buttonResult = true;
    this.result = true;
    this.activeModal.close(buttonResult);
    if (this.closeWindow === true) {
      window.close();
    }
  }

  /**
   * Action to do if redirect link was pressed. Close modal and redirect.
   */
  closeModal(event) {
    this.activeModal.close(event);
    this.router.navigate(['policies/rates-forms-questionaries']);
  }

}
