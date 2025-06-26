/**
* NotificationService.ts
*
* @description: Class subscribe messages an show in modal window
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../security/services/auth/auth.service';
import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from './notification-component/notification.component';


/**
 * Class subscribe messages an show in modal window
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {



  /**
   * Contruct Methos
   * @param _http HttpClient Injection
   * @param _config Configuration Service Injection
   * @param modalService Modal Service Injection
   * @param _authService Auth Service Injection
   */
  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService,
    private modalService: NgbModal,
    private _authService: AuthService
  ) { }


  /**
   * Open a modal dialog showing a message
   * @param title Title to show in modal
   * @param message Message to show in modal
   * @param showCancel Flag to indicates if show cancel button
   * @param acceptText Text in accept button
   * @param declineText Text in cancel button
   * @param showThirdButton Flag to indicates if show third button
   * @param thirdText Text in third button
   * @param showFourthbutton Flag to indicates if show fourth button
   * @param fourthText Text in fourth button
   * @param closeWindow Flag to indicates if ok button close window
   */
  async showDialog(
    title, message,
    showCancel?: boolean,
    acceptText?, declineText?,
    showThirdButton?: boolean, thirdText?: any,
    showFourthbutton?: boolean, fourthText?: any,
    closeWindow?: boolean) {

    const result = this.modalService.open(NotificationComponent,
      { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-claimsubmission-step3' });
    const dialog = result.componentInstance as NotificationComponent;

    dialog.title = title;
    dialog.message = message;
    dialog.showCancel = showCancel ? showCancel : false;
    dialog.acceptText = acceptText ? acceptText : 'APP.BUTTON.CONTINUE_BTN';
    dialog.declineText = declineText ? declineText : 'APP.BUTTON.CANCEL_BTN';
    dialog.showThirdButton = showThirdButton ? showThirdButton : false;
    dialog.thirdText = thirdText;
    dialog.showFourthButton = showFourthbutton ? showFourthbutton : false;
    dialog.fourthText = fourthText;
    dialog.closeWindow = closeWindow ? closeWindow : false;

    return await result.result;

  }

}
