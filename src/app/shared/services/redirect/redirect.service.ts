/**
* RedirectService.ts
*
* @description: This services handles redirects components allowing to show it on the pages before making the redirection
* @author Andrés Tamayo
* @version 1.0
* @date 2-04-2019.
*
**/
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RedirectComponent } from './redirect.component';
@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  /**
   * Contruct Methos
   * @param modalService Modal Service Injection
   */
  constructor(
    private modalService: NgbModal,
  ) { }

  /**
   * Show to modal with the message before redirect
   * @param url url to redirect
   */
  showModal(url: string) {
    const result = this.modalService.open(RedirectComponent,
        { centered: true, backdrop: 'static', keyboard: false, size: 'lg', windowClass: 'modal-claimsubmission-step3' });

    const dialog = result.componentInstance as RedirectComponent;

    dialog.acceptText = 'APP.BUTTON.CONTINUE_BTN';
    dialog.declineText = 'APP.BUTTON.CANCEL_BTN';
    dialog.url = url;
  }


}
