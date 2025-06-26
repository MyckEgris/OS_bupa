/**
* QuotationStep2DeductiblesComponent
*
* @description: This class handle deductibles to modify
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuotationWizard } from '../quotation-wizard/entities/quotation-wizard';
import { QuotationWizardService } from '../quotation-wizard/quotation-wizard.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { QuoteService } from 'src/app/shared/services/quote/quote.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { QuoteMode } from 'src/app/shared/services/quote/entities/quote-mode.enum';
import { Utilities } from 'src/app/shared/util/utilities';
import { Plan } from 'src/app/shared/services/products/entities/plan';

/**
 * This class handle deductibles to modify
 */
@Component({
  selector: 'app-quotation-step2-deductibles',
  templateUrl: './quotation-step2-deductibles.component.html',
  styleUrls: ['./quotation-step2-deductibles.component.css']
})
export class QuotationStep2DeductiblesComponent implements OnInit, OnDestroy {

  /**
   * Quotation subscription
   */
  private subscription: Subscription;

  /**
   * Current step
   */
  public currentStep = 2;

  /**
   * Quotation wizard instance
   */
  public wizard: QuotationWizard;

  /**
   * Product
   */
  public product: any;

  /**
   * carouselItems
   */
  public carouselItems: Array<any>;

  /**
   * languageId
   */
  public languageId: number;

  /**
  * premiums
  */
  public premiums: any;

  public plans: Array<Plan>;

  /**
   * Contructor method
   * @param quotation Quotation Injection
   * @param router Router Injection
   * @param commonService Common Injection
   * @param translation Translation Injection
   * @param quoteService QuoteService v
   */
  constructor(
    private quotation: QuotationWizardService,
    private router: Router,
    private commonService: CommonService,
    private translation: TranslationService,
    private quoteService: QuoteService,
    private translate: TranslateService
  ) { }

  /**
   * Get lang, get plans and build carousel and send calculate quote
   */
  ngOnInit() {
    this.languageId = this.translation.getLanguageId();
    this.carouselItems = [];
    this.subscription = this.quotation.beginQuotationWizard(wizard => this.wizard = wizard, 2);
    if (!this.wizard.policyDetail || !this.wizard.policyDetail.policyDates && this.wizard.policyDetail.policyDates.length > 0) {
      this.backToQuoteStep1();
    } else {
      const addresses = this.wizard.policyDetail.addresses.find(x => x.addressTypeId === 2);
      let cityId = 0;
      if (addresses) {
        cityId = addresses.cityId;
      }
      this.getPlansAndRidersByProductAndCountry(this.wizard.policyDetail.productId, this.wizard.policyDetail.policyCountryId, cityId, 2);
    }

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.languageId = this.translation.getLanguageId();
      this.changePlanName();
    });
  }

  ngOnDestroy() {
    // this.translate.onLangChange.unsubscribe();
  }

  /**
   * Get price for policy planid
   * @param planId Plan ID
   */
  getPremiumValueFromQuotePremiums(planId) {
    return this.premiums.quote.premiums.find(x => x.planId === planId).price;
  }

  /**
   * Get plans adnd premiums
   * @param productId Product ID
   * @param countryId Country ID
   */
  getPlansAndRidersByProductAndCountry(productId, countryId, cityId, policyTypeId) {

    const renewalDate = Utilities.convertDateToString(new Date(this.wizard.policyDetail.lastEffectiveDate));

    this.commonService.getPlansAndRidersByProductAndCountryIdAndCityIdAndPolicyTypeId
      (productId, countryId, cityId, policyTypeId, renewalDate)
      .subscribe(product => {
        this.product = product;
        this.plans = this.product[0].plans as Array<Plan>;
        this.changePlanName();
        this.carouselItems = this.quotation.buildCarouselItemsAndCards(this.plans);
        this.wizard.quotationPolicy.quoteMode = QuoteMode.Basic;
        this.quoteService.calculateQuote(this.wizard.quotationPolicy).subscribe(quote => {
          this.premiums = quote;
        });
      });
  }

  /**
   * Changes Plan name by language.
   */
  changePlanName() {
    if (this.plans) {
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
  }

  /**
   * Select new current plan
   * @param plan plan id
   */
  selectDeductible(plan) {
    this.quotation.setCurrentPlan(plan);
    this.backToChangeOptions();
  }

  /**
   * Back
   */
  backToChangeOptions() {
    this.router.navigate([`/quote/quotation/${this.wizard.policyId}/step2`]);
    return false;
  }

  /**
   * Back to step 1
   */
  backToQuoteStep1() {
    this.router.navigate([`/quote/quotation/${this.wizard.policyId}/step1`]);
  }

  policyPlan(planId) {
    return (this.wizard.policyDetail.planId === planId);
  }

}
