/**
* ViewCommissionDetailComponent.ts
*
* @description: This component show commissions details.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 12-02-2019.
*
**/

import { Component,  Input } from '@angular/core';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';

/**
 * This component show commissions details.
 */
@Component({
  selector: 'app-view-commission-detail',
  templateUrl: './view-commission-detail.component.html'
})
export class ViewCommissionDetailComponent {

  public mexicoBusinessInsurance: string;

  /**
   * commissionDetails
   */
  @Input() commissionDetails: Array<any>;

  /**
   * Constructor methos
   */
  constructor() { 
    this.mexicoBusinessInsurance = InsuranceBusiness.BUPA_MEXICO.toString();
  }


}
