/**
* QuotationModifyDeductibleComponent
*
* @description: This class modify deductible.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2019.
*
**/
import { Component, OnInit, Input, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Plan } from 'src/app/shared/services/products/entities/plan';

/**
 * This class modify deductuble.
 */
@Component({
  selector: 'app-quotation-modify-deductible',
  templateUrl: './quotation-modify-deductible.component.html',
  styleUrls: ['./quotation-modify-deductible.component.css']
})
export class QuotationModifyDeductibleComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Input policy
   */
  @Input() policy: any;

  /**
   * Input products
   */
  @Input() products: any;

  /**
   * Input currency
   */
  @Input() currency: string;

  /**
   * Input wizard
   */
  @Input() wizard: any;

  /**
   * Emit change of deductible
   */
  @Output()
  sendUpdatedDeductible: EventEmitter<any> = new EventEmitter();

  public plans: Array<Plan>;

  /**
   * language ID
   */
  languageId: number;

  /**
   * Contructor method
   * @param router Router Injection
   */
  constructor(
    private router: Router,
    private translation: TranslationService,
    private translate: TranslateService
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    this.plans = this.products[0].plans as Array<Plan>;
    this.languageId = this.translation.getLanguageId();
    this.languageId = this.translation.getLanguageId();
  
    this.changePlanName();

    this.currency = this.products[0].currencyCode;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.languageId = this.translation.getLanguageId();
      if(this.products[0].plans) {
        this.changePlanName();
      }
    });
    this.checkIfPlanWasChanged();
  }


  /**
   * Changes Plan name by language.
   */
  changePlanName()
  {
    this.plans.forEach(plan => {        
      if (this.languageId == 1) {
        if (plan.englishPlanName) {
          plan.planNameToShow = plan.englishPlanName;
        } else {
          plan.planNameToShow = plan.planName;
        }
      } else {
        if (plan.spanishPlanName) {
          plan.planNameToShow = plan.spanishPlanName;
        } else {
          plan.planNameToShow = plan.planName;
        }
      }
    });
  }

  /**
   * Afterview init, toggle slides
   */
  ngAfterViewInit() {
    // const firstCard = this.wizard.currentPlan;
    // this.toggleSlideDetail(firstCard);
    this.toggleAllSlides();
  }

  ngOnDestroy() {
    // this.translate.onLangChange.unsubscribe();
  }

  /**
   * Toggle specific div
   * @param id Div id
   */
  toggleSlideDetail(id) {
    const iddiv = '#ig-detallereclamo' + id;
    if ($(iddiv).css('display') === 'none') {
      this.toggleAllSlides();
    }

    $(iddiv).slideToggle();
  }

  /**
   * Togle all divs
   */
  toggleAllSlides() {
    $(`div[id^='ig-detallereclamo']`).slideUp();
  }

  /**
   * Go to modify deductibles
   */
  goToSelectDeductiblesInformation() {
    this.router.navigate([`/quote/quotation/${this.policy}/step2-deductibles`]);
  }

  /**
   * checkIfPlanWasChanged
   */
  checkIfPlanWasChanged() {
    const modified = (this.wizard.currentPlan !== this.wizard.policyDetail.planId);
    const returnUpdates = { modified: false, currentPlan: null, translated: '', show: true };
    if (modified) {
      returnUpdates.modified = true;
      returnUpdates.currentPlan =
        this.wizard.quotationPolicy.products[0].plans.find(x => x.planId === this.wizard.currentPlan).planDescription;
      returnUpdates.translated = 'EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.MODIFY_DEDUCTIBLE.HAS_CHANGED';
    }

    if (returnUpdates.modified) {
      this.sendUpdatedDeductible.emit(returnUpdates);
    }

    return returnUpdates;
  }

  /**
   * Current plan description
   * @param planId Plan id
   */
  policyPlan(planId) {
    return (this.wizard.policyDetail.planId === planId);
  }

}
