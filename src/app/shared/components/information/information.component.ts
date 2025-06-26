/**
* InformationComponent.ts
*
* @description: Handles and shows information modal
* @author cristian triana.
* @version 1.0
* @date 11-07-2021.
*
**/

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

/**
 * Handles and shows information modal
 */
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html'
})
export class InformationComponent {

  /**
   * Modal title for information
   */
  public title: string;

  /**
   * Render Html content
   */
  public content: string;

  /**
   * Url
   */
  public url: string;

  /**
   * Accept text for button
   */
  public acceptText: string;

  /**
   * Id for div content
   */
  public idContent: string;

  /**
   * Flag that send true (accept) or false (decline) to agreement service
   */
   public result: boolean;

  /**
   * Contructor Method
   * @param activeModal NgbModal Service Injection
   * @param translate Translate Service Injection
   */
  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) { }

  /**
  * Accept agreement
  */
  ok() {
    this.result = true;
    this.activeModal.close(true);
  }
}
