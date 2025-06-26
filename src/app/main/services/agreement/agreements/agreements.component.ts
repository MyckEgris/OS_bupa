/**
* AgreementsComponent.ts
*
* @description: Handles and shows agreements modal
* @author Juan Camilo Moreno.
* @author Yefry Lopez.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgreementsModel } from '../models/agreements.model';
import { TranslateService } from '@ngx-translate/core';

/**
 * Handles and shows agreements modal
 */
@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.css']
})
export class AgreementsComponent implements AgreementsModel {

  /**
   * Modal title for agreements
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
   * Decline text for button
   */
  public declineText: string;

  /**
   * Id for div content
   */
  public idContent: string;

  /**
   * Property for lock user after decline agreement
   */
  public canUserBeLocked: boolean;

  /**
   * Flag for hide decline button after many retry counts
   */
  public hideButtonLastRetry: boolean;

  /**
   * Number of times for decline agreement
   */
  public retryCount: number;

  /**
   * Number of times thar user decline one agreement
   */
  public refuseNumber: number;

  /**
   * Flag that send true (accept) or false (decline) to agreement service
   */
  public result: boolean;

  /**
   * id agreement, use to know if its necesary to use check box on the contract
   */
  public agreementId: number;

  /** use to detect if the user clicked the check box */
  public acceptTerms: false;

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
    debugger
    this.result = true;
    this.activeModal.close(true);
  }

  /**
   * Text at decline agreement when this is neccesary
   */
  async showAtDeclineAgreementForUserCanBeLocked() {
    debugger
    if (this.canUserBeLocked) {
      this.refuseNumber += 1;
      let confirmMessage = '';
      if (this.hideButtonLastRetry) {
        confirmMessage = await this.translate.get('AGREEMENT.DECLINENOBLOCK').toPromise();
      } else {
        confirmMessage = await this.translate.get('AGREEMENT.DECLINEBLOCK').toPromise();
      }
      confirmMessage = confirmMessage
        .replace(/retryCount/g, (this.retryCount - (this.hideButtonLastRetry ? 1 : 0)).toString())
        .replace(/refuseNumber/g, this.refuseNumber.toString());
      alert(confirmMessage);
    }
    this.activeModal.close(false);
  }

  /**
   * Message at decline limit times an agreement
   */
  confirmDeclineAgreement() {
    if (this.canUserBeLocked) {
      const confirmMessage
        = ``
        + `-------------------------------------------------------------------------\n`
        + `¡Usted ha cancelado el acuerdo!\n`
        + `Después de cancelar 3 veces, usted debe de aceptar el acuerdo o no\n`
        + `podrá continuar. \n`
        + `Oportunidades que aún tiene disponibles: ${this.retryCount - this.refuseNumber}\n`
        + `-------------------------------------------------------------------------\n`;

      const confirmDecline = confirm(confirmMessage);
      if (confirmDecline) {
        this.activeModal.close(false);
      }
    }
  }
}
