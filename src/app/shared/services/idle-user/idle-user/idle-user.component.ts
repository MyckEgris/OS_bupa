/**
* IdleUserComponent.ts
*
* @description: Class for managing time of inactivity
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Class for managing time of inactivity
 */
@Component({
  selector: 'app-idle-user',
  templateUrl: './idle-user.component.html',
  styleUrls: ['./idle-user.component.css']
})
export class IdleUserComponent implements OnInit {

  /**
   * title that appears in modal window
   */
  public title: string;

  /**
   * message with the content
   */
  public message: string;

  /**
   * Contructor Method
   * @param activeModal NgbActiveModal Injection
   */
  constructor(public activeModal: NgbActiveModal) { }

  /**
   * On Init event
   */
  ngOnInit() {
  }

}
