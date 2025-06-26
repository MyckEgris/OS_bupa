/**
* RedirectComponent.ts
*
* @description: this component show the message to display before redirect to external page
* @author Andrés Tamayo
* @version 1.0
* @date 2-04-2019.
*
**/
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent {

  /**
   * Text in accept button
   */
  public acceptText: string;

  /**
   * Text in cancel button
   */
  public declineText: string;

  /**
   * Text in Url to redirect
   */
  public url: string;
  /**
   * Contruct Methos
   * @param activeModal NgbActiveModal Injection
   */
  constructor(public activeModal: NgbActiveModal) { }

    /**
   * Action to do if ok was pressed. Close modal
   */
  ok() {
    window.location.href = this.url;
    window.open(this.url, '_blank');
    this.activeModal.close();
  }

  /**
   * Action to do if cancel was pressed. Close modal
   */
  cancel() {
    this.activeModal.close();
  }

}
