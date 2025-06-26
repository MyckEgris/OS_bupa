/**
* ViewPolicyCardsComponent
*
* @description: use to show and print the member's cards
* @author Andres Tamayo
* @version 1.0
* @date 13-02-2019.
*
**/
import { Component, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-view-policy-cards',
  templateUrl: './view-policy-cards.component.html'
})
export class ViewPolicyCardsComponent {

  /** element who is going to print */
  @ViewChild('modalBody') bodyToPrint;
  /** modal title */
  public title: string;
  public policyID: any;
  /** list of all the cards that is going to print */
  public cardsCollection: any [];

  /**
   * Contructor Method
   * @param activeModal NgbActiveModal Injection
   */
  constructor(public activeModal: NgbActiveModal) { }

  /**
   * close the modal
   */
  ok() {
    this.activeModal.close();
  }

  /**
   * print the members cards when the user clic print button
   */
  print() {

    const windows = window.open('', 'PRINT');

    windows.document.write(this.bodyToPrint.nativeElement.innerHTML);
    windows.document.close();
    windows.print();
    windows.close();
  }
}
