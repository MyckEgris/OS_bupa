/**
* NotificationComponent.ts
*
* @description: Component rendered in modal window for show notifications
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


/**
 * Component rendered in modal window for show notifications
 */
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {


  /**
   * Show text in title
   */
  public title: string;

  /**
   * Message to show
   */
  public message: string;

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
   * Third text button
   */
  public thirdText: string;

  /**
   * Fourth text button
   */
  public fourthText: string;

  /**
   * Indicates if show cancel button
   */
  public showCancel: boolean;

  /**
   * Indicates if show third button
   */
  public showThirdButton: boolean;

  /**
   * Indicates if show fourth button
   */
  public showFourthButton: boolean;

  /**
   * Indicates if show print button
   */
  public showPrint: boolean;

  /**
   * Indicates if close window
   */
  public closeWindow: boolean;


  /**
   * Contructor Method
   * @param activeModal NgbActiveModal Injection
   */
  constructor(
    public activeModal: NgbActiveModal ) { }


  /**
   * Action to do if ok was pressed. Close modal or Redirect to Url.
   */
  ok() {

    const buttonResult = this.showThirdButton ? 0 : true;
    this.result = true;
    this.activeModal.close(buttonResult);

    if (this.closeWindow === true) {
      window.close();
    }

  }

  /**
   * Action to do if cancel was pressed. Close modal.
   */
  cancel() {
    const buttonResult = this.showThirdButton ? 1 : false;
    this.result = false;
    this.activeModal.close(buttonResult);
  }

  /**
   * Action to do if third was pressed. Close modal.
   */
  thirdButton() {
    this.result = true;
    this.activeModal.close(2);
  }

  /**
   * Action to do if fourth was pressed. Close modal.
   */
  fourthButton() {
    this.result = true;
    this.activeModal.close(3);
  }


}
