/**
* QuotationStep3CalculatorComponent
*
* @description: This class shows calculated premium quote
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-11-2019.
*
**/
import { Component, OnInit, Input } from '@angular/core';
import { QuoteSummaryPremium } from '../quotation-wizard/entities/quote-summary-premium';

/**
 * This class shows calculated premium quote
 */
@Component({
  selector: 'app-quotation-step3-calculator',
  templateUrl: './quotation-step3-calculator.component.html',
  styleUrls: ['./quotation-step3-calculator.component.css']
})
export class QuotationStep3CalculatorComponent implements OnInit {

  /**
   * premiumValues
   */
  @Input() premiumValues: any;

  /**
   * discount
   */
  @Input() discount: number;

  /**
   * currency
   */
  @Input() currency: string;

  /**
   * Constant for premium id
   */
  private PREMIUM = 1008;

  /**
   * Constant for extra premium id
   */
  private XTRA_PREMIUM = 1009;

  /**
   * Constant for discount id
   */
  private DISCOUNTS = 1010;

  /**
   * Constant for rider id
   */
  private RIDER = 1003;

  /**
   * Constant for fee id
   */
  private FEE = 1006;

  /**
   * Constant for tax id
   */
  private TAX = 1007;

  /**
   * Summary premium object
   */
  public summaryPremium = {} as QuoteSummaryPremium;

  /**
   * Flag for view detailed premium
   */
  public viewPremiumDetails = false;

  /**
   * Flag for view detailed riders
   */
  public viewRidersDetails = false;

  /**
   * Flag for view detailed fees
   */
  public viewFeesDetails = false;

  /**
   * Flag for view detailed taxes
   */
  public viewTaxesDetails = false;

  /**
   * Contructor method
   */
  constructor() { }

  /**
   * Get summary premiums values
   */
  ngOnInit() {
    this.summaryPremium.cost = this.calculateTotalByType(this.PREMIUM);
    this.summaryPremium.costs = this.getCost();
    this.summaryPremium.discount = this.calculateTotalByType(this.DISCOUNTS);
    this.summaryPremium.discountPerc = this.discount;
    this.summaryPremium.subtotal = this.summaryPremium.cost + this.summaryPremium.discount;
    this.summaryPremium.riderTotal = this.calculateTotalByType(this.RIDER);
    this.summaryPremium.riders = this.getRiders();
    // this.summaryPremium.feeTotal = this.calculateTotalByType(this.FEE);
    // this.summaryPremium.fees = this.getFees();
    this.summaryPremium.taxTotal = this.calculateTotalByType(this.TAX);
    this.summaryPremium.taxes = this.getTaxes();
    this.summaryPremium.total = this.premiumValues.price;
    this.summaryPremium.currency = this.currency;
  }

  /**
   * Calculate total values according type
   * @param type Type
   */
  calculateTotalByType(type) {
    let value = 0;
    let values = [];
    switch (type) {
      case this.PREMIUM:
        values = this.getCost();
        break;
      case this.RIDER:
        values = this.getRiders();
        break;
      case this.FEE:
        values = this.getFees();
        break;
      case this.TAX:
        values = this.getTaxes();
        break;
      case this.DISCOUNTS:
        values = this.getDiscounts();
        break;
    }

    values.forEach(val => {
      value += val.price;
    });

    return value;
  }

  /**
   * Get cost value
   */
  getCost() {
    return this.premiumValues.premiumDetails.filter(x => x.type === this.PREMIUM || x.type === this.XTRA_PREMIUM);
  }

  /**
   * Get discount values
   */
  getDiscounts() {
    return this.premiumValues.premiumDetails.filter(x => x.type === this.DISCOUNTS);
  }

  /**
   * Get riders values
   */
  getRiders() {
    return this.premiumValues.premiumDetails.filter(x => x.type === this.RIDER);
  }

  /**
   * get fees values
   */
  getFees() {
    return this.premiumValues.premiumDetails.filter(x => x.type === this.FEE);
  }

  /**
   * get taxes values
   */
  getTaxes() {
    return this.premiumValues.premiumDetails.filter(x => x.type === this.TAX);
  }

  /**
   * Click premium details
   */
  onViewPremiumDetails() {
    this.viewPremiumDetails = !this.viewPremiumDetails;
    return false;
  }

  /**
   * Click riders details
   */
  onViewRidersDetails() {
    this.viewRidersDetails = !this.viewRidersDetails;
    return false;
  }

  /**
   * Click fees details
   */
  onViewFeesDetails() {
    this.viewFeesDetails = !this.viewFeesDetails;
    return false;
  }

  /**
   * Click taxes details
   */
  onViewTaxesDetails() {
    this.viewTaxesDetails = !this.viewTaxesDetails;
    return false;
  }

}
