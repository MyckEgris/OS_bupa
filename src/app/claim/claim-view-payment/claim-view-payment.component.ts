/**
* ClaimViewPaymentComponent.ts
*
* @description: This class shows payment´s details of a item in processed claims.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Component, OnInit, Input } from '@angular/core';

/**
 * This class shows payment´s details of a item in processed claims.
 */
@Component({
  selector: 'app-claim-view-payment',
  templateUrl: './claim-view-payment.component.html'
})
export class ClaimViewPaymentComponent implements OnInit {

  /**
   * Input for order
   */
  @Input() order: number;

  /**
   * Input for date
   */
  @Input() date: string;

  /**
   * Input for method
   */
  @Input() method: string;

  /**
   * Input for amount
   */
  @Input() amount: number;

  /**
   * Input for currency symbol
   */
  @Input() currencySymbol: string;

  /**
   * Input for number
   */
  @Input() number: any;

  @Input() exchangeRate: number;

  @Input() isLocalUsd: boolean;

  /**
   * Contructor Method
   */
  constructor() { }

  /**
   * On Init event
   */
  ngOnInit() {
  }

}
