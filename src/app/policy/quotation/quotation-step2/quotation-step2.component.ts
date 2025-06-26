/**
* QuotationStep2Component
*
* @description: This class shows step 2 of quotation wizard.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2019.
*
**/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuotationWizard } from '../quotation-wizard/entities/quotation-wizard';
import { QuotationWizardService } from '../quotation-wizard/quotation-wizard.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TranslateService } from '@ngx-translate/core';
import { Utilities } from 'src/app/shared/util/utilities';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { QuotationAddMembersComponent } from '../quotation-add-members/quotation-add-members.component';

/**
 * This class shows step 2 of quotation wizard.
 */
@Component({
  selector: 'app-quotation-step2',
  templateUrl: './quotation-step2.component.html',
  styleUrls: ['./quotation-step2.component.css']
})
export class QuotationStep2Component implements OnInit, OnDestroy {

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
   * Member quote object
   */
  public membersQuote: any;

  public membersQuoteForRemove: any;

  public membersQuoteForAdd: any;

  /**
   * Public renewal date
   */
  public renewalDate: any;

  /**
   * Product
   */
  public product: any;

  /**
   * Check removed members
   */
  public checkRemovedMembers: any;

  /**
   * Check change in deductibles
   */
  public checkChangedDeductibles: any;

  /**
   * can go to quote
   */
  public canGoToQuote = true;

  /**
   * Constant for alertDisappearAlert
   */
  public alertDisappearAlert = 10000;

  public blockSpouseRemoveOption: boolean;

  public blockSpouseAddOption: boolean;

  private MODAL_TITTLE = 'APP.DEACTIVATE_ROUTE_TITTLE';

  private MODAL_BODY = 'APP.DEACTIVATE_ROUTE_BODDY';

  private STAY = 'APP.DEACTIVATE_ROUTE_STAY';

  private LEAVE = 'APP.DEACTIVATE_ROUTE_LEAVE';

  @ViewChild(QuotationAddMembersComponent) addMembersComponent: QuotationAddMembersComponent;

  /**
   * Constructor method
   * @param quotation Quotation wizard service injection
   * @param router Router injection
   * @param commonService Common injection
   * @param translate Translate injection
   */
  constructor(
    private quotation: QuotationWizardService,
    private router: Router,
    private commonService: CommonService,
    private translate: TranslateService,
    private notification: NotificationService
  ) { }

  /**
   * Handle subscription wizard, validate wizard policy detail information
   */
  ngOnInit() {
    this.checkRemovedMembers = { hasRemoved: false, message: '', show: false };
    this.checkChangedDeductibles = { modified: false, translated: '', currentPlan: '', show: false };

    this.subscription = this.quotation.beginQuotationWizard(wizard => this.wizard = wizard, 2);
    if (this.wizard.policyDetail && this.wizard.policyDetail.policyDates && this.wizard.policyDetail.policyDates.length > 0) {

      this.renewalDate = Utilities.convertDateToString(new Date(this.wizard.policyDetail.lastEffectiveDate));
      this.getMembersFromWizard();
      const addresses = this.wizard.policyDetail.addresses.find(x => x.addressTypeId === 2);
      let cityId = 0;
      if (addresses) {
        cityId = addresses.cityId;
      }
      this.getPlansAndRidersByProductAndCountry(this.wizard.policyDetail.productId, this.wizard.policyDetail.policyCountryId, cityId, 2);
      this.getMembersToRemoveAndUpdateQuotation(null);
    } else {
      this.backToCurrentInformation();
    }

    this.translate.onLangChange.subscribe(() => {
      this.getMembersToRemoveAndUpdateQuotation(null);
    });
  }

  /**
   * Get plans and riders for product and set to quote request
   * @param productId Product ID
   * @param countryId Country ID
   */
  getPlansAndRidersByProductAndCountry(productId, countryId, cityId, policyTypeId) {
    this.commonService.getPlansAndRidersByProductAndCountryIdAndCityIdAndPolicyTypeId(productId, countryId, cityId,
      policyTypeId, this.renewalDate)
      .subscribe(product => {
        this.quotation.setProductAndPlansToQuotationRequest(product[0].plans, product[0].modeOfPaymentsByProduct);
        this.product = product;
        this.wizard.products = product;
      }, error => {
        this.handleErrorInPlans();
      });
  }

  async handleErrorInPlans() {
    const title = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.NO_PLANS_ASSOCIATED.TITLE').toPromise();
    const message = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.NO_PLANS_ASSOCIATED.MESSAGE').toPromise();
    const ok = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.NO_PLANS_ASSOCIATED.OK').toPromise();
    const errorPlans = await this.notification.showDialog(title, message, false, ok);
    if (errorPlans) {
      this.backToCurrentInformation();
    }
  }

  /**
   * get quote members information and puts in local variable
   */
  getMembersFromWizard() {
    this.membersQuote = this.wizard.quotationPolicy.members;
    this.membersQuoteForRemove = this.wizard.quotationPolicy.members.filter(x => !x.added);
    this.membersQuoteForAdd = this.wizard.quotationPolicy.members.filter(x => x.added);
  }

  /**
   * Detroy component
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Navigate to step 1
   */
  async backToCurrentInformation() {

    const title = await this.translate.get(this.MODAL_TITTLE).toPromise();
    const message = await this.translate.get(this.MODAL_BODY).toPromise();
    const leave = await this.translate.get(this.LEAVE).toPromise();
    const close = await this.translate.get(this.STAY).toPromise();

    const optionSelected = await this.notification.showDialog(title, message, true, close, leave);

    if (optionSelected)
      this.router.navigate([`/quote/quotation/${this.wizard.policyId}/step1`]);
  }

  /**
   * Emitter result from nested remove component and update policy wizard
   * @param members Members
   */
  getMembersToRemoveAndUpdateQuotation(members) {
    const gettingMembers = members ? true : false;
    if ((!members || members.length === 0) && this.wizard) {
      members = this.wizard.quotationPolicy.members.filter(x => !x.added);
    }
    Utilities.delay(1000);
    members.forEach(member => {
      const updateMember = this.wizard.quotationPolicy.members.find(x => x.memberId === member.memberId);
      updateMember.removedFromQuote = member.checked;
    });

    const getRemovedMembers = members.filter(x => x.removedFromQuote);
    let translatedMessage = '';
    this.translate.stream('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.DELETE_MEMBERS.DELETED').subscribe(message => {
      translatedMessage = message;
    });

    this.checkRemovedMembers = {
      hasRemoved: (getRemovedMembers.length > 0),
      message: translatedMessage.replace('{0}', getRemovedMembers.length),
      show: false
    };

    const spouse = members.find(x => x.relationTypeId === 3);
    if (spouse) {
      this.addMembersComponent.loadRelationType();
    }

    if (gettingMembers) {
      this.checkRemovedMembers.show = true;
      window.setTimeout(() => {
        this.checkRemovedMembers.show = false;
      }, this.alertDisappearAlert);
    }

  }

  getMembersToAddQuotation(members) {
    this.wizard.addedMembers = members;

    for (let i = this.wizard.quotationPolicy.members.length - 1; i >= 0; i--) {
      if (this.wizard.quotationPolicy.members[i].added) {
        this.wizard.quotationPolicy.members.splice(i, 1);
      }
    }

    /*this.wizard.quotationPolicy.members.forEach(m => {
      if (m.added) {
        this.wizard.quotationPolicy.members.splice(this.wizard.quotationPolicy.members.indexOf(m), 1);
      }
    });*/

    members.forEach(m => {
      this.wizard.quotationPolicy.members.push(m);
    });
  }

  /**
   * Get changed deductibles
   * @param changes Changes
   */
  getDeductibleChangedQuotation(changes) {
    this.checkChangedDeductibles = changes;
    window.setTimeout(() => {
      this.checkChangedDeductibles.show = false;
    }, this.alertDisappearAlert);
    // this.canGoToQuoteSummary();
  }

  /**
     * Get date according date id
     * @param dates Policy dates array
     * @param dateId Dateid
     */
  getPolicyDate(dates: Array<any>, dateId: number) {
    const date = dates.find(x => x.policyDateId === dateId);
    return date.policyDateValue || '';
  }

  /**
   * Dicides if can go to quote
   */
  canGoToQuoteSummary() {
    const quoteproducts = (this.quotation.getProductAndPlansFromQuotation());
    if (quoteproducts.length > 0) {
      const selectedPlan = quoteproducts[0].plans.find(x => x.currentPlan);
      if (selectedPlan) {
        this.canGoToQuote = false;
      }
    }
  }

  /**
   * Got to quote summary
   */
  goToSummary() {
    // this.router.navigate(['support/on-construction-information']);
    this.router.navigate([`/quote/quotation/${this.wizard.policyId}/step3`]);
  }

}
