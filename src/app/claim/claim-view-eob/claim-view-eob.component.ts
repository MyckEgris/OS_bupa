/**
* ClaimViewEobComponent.ts
*
* @description: This class manages eob document
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

/**
 * This class manages eob document
 */
@Component({
  selector: 'app-claim-view-eob',
  templateUrl: './claim-view-eob.component.html'
})
export class ClaimViewEobComponent implements OnInit {

  /**
   * Prop for frame access to native DOM for object
   */
  @ViewChild('frame') frame;

  /**
   * Title for modal window
   */
  public title: string;

  /**
   * Content
   */
  public idContent: string;

  /**
   * Source [src] for frame
   */
  public filePath: any;

  /**
   * Text for accept button
   */
  public acceptText: string;

  /**
   * Text for decline or cancel button
   */
  public declineText: string;

  /**
   * True for accept, false for cancel
   */
  public result: boolean;

  /**
   * Constructor Method
   * @param activeModal NgbModal Service Injection
   * @param translate Translate Service Injection
   */
  constructor(
    private activeModal: NgbActiveModal,
    private translate: TranslateService
  ) { }

  /**
   * On Init event
   */
  ngOnInit() { }

  /**
   * Setter for frame source element
   * @param path Path source
   */
  setFilePath(path) {
    this.frame.nativeElement.src = path;
  }

  /**
   * Ok, accept button
   */
  public ok() {
    this.activeModal.close(true);
  }

  /**
   * Decline, cancel button
   */
  public decline() {
    this.activeModal.close(false);
  }
}
