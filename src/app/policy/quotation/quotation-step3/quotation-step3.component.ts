/**
* QuotationStep3Component
*
* @description: This class shows step 3 of quotation wizard.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-11-2019.
*
**/
import { Component, OnInit } from '@angular/core';
import { QuotationWizard } from '../quotation-wizard/entities/quotation-wizard';
import { Subscription } from 'rxjs';
import { QuoteService } from 'src/app/shared/services/quote/quote.service';
import { QuotationWizardService } from '../quotation-wizard/quotation-wizard.service';
import { QuoteMode } from 'src/app/shared/services/quote/entities/quote-mode.enum';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { QuoteModeOfPaymentResponse } from 'src/app/shared/services/quote/entities/quotation-mode-of-payment-response';
import { QuoteMemberResponse } from 'src/app/shared/services/quote/entities/quotation-member-response';
import { QuoteRiderResponse } from 'src/app/shared/services/quote/entities/quotation-rider-response';
import { Utilities } from 'src/app/shared/util/utilities';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PremiumByModeOfPayment } from 'src/app/shared/services/quote/entities/quotation-policy-premium-payments';

/**
 * This class shows step 3 of quotation wizard.
 */
@Component({
  selector: 'app-quotation-step3',
  templateUrl: './quotation-step3.component.html',
  styleUrls: ['./quotation-step3.component.css']
})
export class QuotationStep3Component implements OnInit {

  /**
   * Quotation subscription
   */
  private subscription: Subscription;

  /**
   * File
   */
  private file: Blob;

  /**
   * Constant for type PDF
   */
  private PDF_APPLICATION_RESPONSE = 'application/pdf';

  /**
  * Constant for error code status # 404
  */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
  * Constant for error code status BE_1000
  */
  private ERROR_STATUS_FOR_EKIT_BUSINESS_ERROR = 'BE_1000';

  /**
  * Quotation wizard instance
  */
  public wizard: QuotationWizard;

  /**
   * Quote Result
   */
  public quoteResult: any;

  /**
   * Selected plan
   */
  public selectedPlan: any;

  /**
   * Language ID
   */
  public languageId: number;

  /**
   * Quote Header Object
   */
  public quoteHeader = {
    policy: '', owner: '', agent: '', country: '', dateRenewal: null,
    product: '', inCountry: 0, outCountry: 0, currency: ''
  };

  /**
   * Array members
   */
  public members: Array<any>;

  /**
   * Array mode of payments
   */
  public modeOfPayments: Array<any>;

  /**
   * Array riders
   */
  public riders: Array<any>;

  /**
   * Currency
  */
  public currency = 'USD';

  /**
   * Discount
   */
  public discountValue = 0;

  /**
   * selectedModeOyPayments
   */
  public selectedModeOyPayments = [];

  /**
   * 
   * @param quotation Quotation Injection
   * @param quoteService Quote Service Injection
   * @param router Router Injection
   * @param translation Translation Service Injection
   * @param translate Translate Service Injection
   * @param notificationService Notification Service Injection
   */
  constructor(
    private quotation: QuotationWizardService,
    private quoteService: QuoteService,
    private router: Router,
    private translation: TranslationService,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) { }

  /**
   * Init wizard subject, analice values for step and call quote api
   */
  ngOnInit() {

    this.subscription = this.quotation.beginQuotationWizard(wizard => this.wizard = wizard, 3);
    if (!this.wizard.policyDetail || !this.wizard.policyDetail.policyDates && this.wizard.policyDetail.policyDates.length > 0) {
      this.backToQuoteStep1();
    }
    this.languageId = this.translation.getLanguageId();
    this.wizard.quotationPolicy.quoteMode = QuoteMode.Full;
    this.wizard.quotationPolicy.policy.policyIssueDate = this.gePolicyIssueDate();
    this.callQuotation(true);

    this.translate.onLangChange.subscribe(l => {
      this.languageId = this.translation.getLanguageId();
      // this.getOperationInformation(this.selectedPlan);
      this.callQuotation(false);
    });
  }

  private gePolicyIssueDate(): Date {
    return new Date(this.wizard.policyDetail.policyDates.find(x => x.policyDateId === 100).policyDateValue);
  }

  /**
   * Call Quote Api with mapped information in last steps
   */
  callQuotation(initial) {
    this.selectedPlan = null;
    this.quoteService.calculateQuote(this.wizard.quotationPolicy).subscribe(quote => {
      this.currency = quote.quote.currencyCode;
      this.quoteResult = quote;
      this.getHeaderInformation();
      this.selectedPlan = quote.quote.premiums.find(x => x.planId === this.wizard.currentPlan);
      this.getOperationInformation(this.selectedPlan, initial);
    }, error => {
      this.backToChangeOptionsInformation();
    });
  }

  /**
   * Init object
   */
  initObjects() {
    this.members = [];
    this.riders = [];
    this.modeOfPayments = [];
  }

  /**
   * Get information for contruct objects, members, mode of payments and riders
   * @param selectedPlan Selected plan
   */
  getOperationInformation(selectedPlan, initial) {
    this.initObjects();
    this.buildMembers(selectedPlan);
    this.buildModeOfPayments(selectedPlan, initial);
    this.buildRiders(selectedPlan);
  }

  /**
   * Header information
   */
  getHeaderInformation() {
    this.quoteHeader.policy = this.wizard.policyDetail.policyReference;
    this.quoteHeader.owner = this.wizard.policyDetail.members.find(x => x.relationTypeId === 2 || x.relationTypeId === 5).fullName;
    this.quoteHeader.agent = this.wizard.policyDetail.agent.agentName;
    this.quoteHeader.country = this.wizard.policyDetail.policyCountry;
    this.quoteHeader.dateRenewal = this.wizard.policyDetail.policyDates.find(x => x.policyDateId === 101).policyDateValue;
    this.quoteHeader.product = this.wizard.quotationPolicy.products[0].productName;
    const selectedPlan = this.wizard.products[0].plans.find(x => x.currentPlan);
    this.quoteHeader.inCountry = selectedPlan && selectedPlan.deductibleInCountry ? selectedPlan.deductibleInCountry : null;
    this.quoteHeader.outCountry = selectedPlan && selectedPlan.deductibleOutCountry ? selectedPlan.deductibleOutCountry : null;
    this.quoteHeader.currency = selectedPlan.benefitCurrencyCode;
  }

  /**
   * Build members
   * @param selectedPlan Selected plan
   */
  buildMembers(selectedPlan) {
    let quoteMembers = this.quoteResult.quote.members;

    const premiums = selectedPlan.memberPremiums;
    const requestedMembers = this.wizard.quotationPolicy.members;
    quoteMembers.sort((a, b) => a.relationTypeId - b.relationTypeId);
    quoteMembers = this.checkIfMemberIsOwnerOrGuardianAndChangePosition(quoteMembers);
    quoteMembers.forEach(m => {
      const member = {} as QuoteMemberResponse;
      member.relation = (requestedMembers.find(x => x.memberNumber === m.memberNumber).relationType);
      member.relationId = m.relationTypeId;
      member.name = m.memberName;
      member.age = m.age;
      member.dob = m.dateOfBirth;
      member.statusId = m.statusId;
      const premiumDetail = premiums.find(x => x.memberNumber === m.memberNumber).premiumDetails;
      const premium = premiumDetail.length > 0 ? premiumDetail.find(x => x.type === 1008) : 0;
      if (premium) {
        member.premium = premiumDetail.length > 0 ? { description: premium.subTypeDescription, price: premium.price } :
          { description: 1008, price: 0 };
        member.xtra = premiumDetail.length > 0 ? premiumDetail.filter(x => x.type === 1009) : [];
      }
      this.members.push(member);
    });
  }

  /**
   * Order members according relation type
   * @param members Members
   */
  checkIfMemberIsOwnerOrGuardianAndChangePosition(members) {
    if (members.find(x => x.relationTypeId === 5)) {
      members.unshift(
        members.splice(
          members.map(function (e) { return e.relationTypeId; }).indexOf(5), 1)[0]
      );
    }

    return members;
  }

  /**
   * Build mode of payments
   * @param selectedPlan Selected plan
   */
  buildModeOfPayments(selectedPlan, initial) {
    /*if (this.modeOfPayments && this.modeOfPayments.length > 0) {
      return;
    }*/
    const quoteModeOfPayments = selectedPlan.premiumByModeOfPayments;
    quoteModeOfPayments.forEach(p => {
      const payment = {} as QuoteModeOfPaymentResponse;
      payment.id = p.modeOfPayment;
      payment.name = this.getModeOfPaymentName(p.modeOfPayment);
      payment.selected = false;
      payment.firstPaymentLabel = p.modeOfPayment === 2 ?
        (this.languageId === 1 ? 'Single installment' : 'Pago único') :
        (this.languageId === 1 ? 'First installment' : 'Primer pago');
      payment.firstPaymentPrice = p.firstPayment;
      payment.adicionalPaymentsLabel = p.modeOfPayment === 2 ? '' : (p.modeOfPayment === 3 ?
        (this.languageId === 1 ? 'additional installment' : 'pago adicional') :
        (this.languageId === 1 ? 'additional installments' : 'pagos adicionales'));
      payment.adicionalPaymentsPrice = p.secondPayment;
      payment.countPayments = p.adicionalPayments;
      payment.totalPrice = p.total;

      this.modeOfPayments.push(payment);
    });

    if (initial) {
      this.setModeOfPayment(2);
    }

    this.getSelectedModeOfPayments();
  }

  /**
   * Build riders
   * @param selectedPlan Selected plan
   */
  buildRiders(selectedPlan) {
    const currentPlan = this.wizard.products[0].plans.find(x => x.planId === selectedPlan.planId);
    const currentPlanRiders = currentPlan.riders;

    const quoteRiders = selectedPlan.premiumDetails.filter(x => x.type === 1003);

    currentPlanRiders.forEach(r => {
      const rider = {} as QuoteRiderResponse;
      const planRider = quoteRiders.find(x => x.subType === r.riderId);
      rider.checked = (planRider !== null && planRider !== undefined);
      rider.id = r.riderId;
      rider.name = this.languageId === 1 ? r.englishDescription : r.spanishDescription;
      rider.price = r.cost; // planRider ? planRider.Price : r.cost;
      rider.currency = 'USD';
      rider.initialRider = (this.wizard.policyDetail.riders.find(x => x.riderId === r.riderId) !== undefined
        && this.wizard.policyDetail.planId === this.wizard.currentPlan);

      this.riders.push(rider);
    });
  }

  /**
   * Set mode of payment
   * @param modeId mode id
   */
  setModeOfPayment(modeId) {
    this.modeOfPayments.forEach(m => {
      if (m.id === modeId) {
        m.selected = !m.selected;
        this.setSelectedModeOfPayments(modeId, m.selected);
      }
    });
  }

  /**
   * Get selected mode of payments
   */
  getSelectedModeOfPayments() {
    this.selectedModeOyPayments.forEach(e => {
      const mode = this.modeOfPayments.find(x => x.id === e.modeId);
      if (mode) {
        mode.selected = e.selected;
      }
    });
  }

  /**
   * Persists selected mode of payments
   * @param modeId ModeID
   * @param selected Selected
   */
  setSelectedModeOfPayments(modeId, selected) {
    const existsMode = this.selectedModeOyPayments.find(x => x.modeId === modeId);
    if (existsMode) {
      existsMode.selected = selected;
    } else {
      this.selectedModeOyPayments.push({ modeId: modeId, selected: selected });
    }
  }

  /**
   * Calculate total value,a according premium and xtras
   * @param member Member
   */
  calculateTotal(member) {
    let total = member.premium.price;
    member.xtra.forEach(x => {
      total += x.price;
    });

    return total;
  }

  /**
   * Change discount and refresh
   * @param operation + or - operation
   */
  changeDiscount(operation) {
    if ((operation === '-' && this.discountValue === 0) || (operation === '+' && this.discountValue === 5)) { return; }
    switch (operation) {
      case '-':
        this.discountValue = (this.discountValue > 0 ? this.discountValue - 1 : 0);
        break;
      case '+':
        this.discountValue = (this.discountValue < 5 ? this.discountValue + 1 : 5);
        break;
    }

    const quoteDiscounts = this.wizard.quotationPolicy.discounts;

    if (this.discountValue === 0 && quoteDiscounts.length > 0) {
      quoteDiscounts.splice(0, quoteDiscounts.length);
    }

    if (this.discountValue > 0) {
      if (quoteDiscounts.length === 0) {
        quoteDiscounts.push({ discountType: '%', value: this.discountValue });
      } else {
        quoteDiscounts[0].value = this.discountValue;
      }
    }

    this.callQuotation(false);

    return false;
  }

  /**
   * Get mode of payment description
   * @param modeId mode id
   */
  getModeOfPaymentName(modeId) {
    switch (modeId) {
      case 2:
        return this.languageId === 1 ? 'Annual' : 'Anual';
      case 3:
        return this.languageId === 1 ? 'Semi Annual' : 'Semianual';
      case 4:
        return this.languageId === 1 ? 'Quarterly' : 'Trimestral';
      case 5:
        return this.languageId === 1 ? 'Monthly' : 'Mensual';
    }
  }

  /**
   * Add or Remove Rider to quote
   * @param rider Rider
   */
  addOrRemoveRiderToQuote(rider) {
    const quotePlan = this.wizard.quotationPolicy.products[0].plans.find(x => x.planId === this.selectedPlan.planId);
    const riderExists = quotePlan.riders.find(x => x.riderId === rider.id);

    const riders = this.wizard.products[0].plans.find(x => x.planId === this.selectedPlan.planId).riders;
    if (!riderExists) {
      const findRider = riders.find(x => x.riderId === rider.id);
      if (findRider) {
        const newQuoteRider = {
          riderId: rider.id, name: rider.name, fixedAmtOrPct: findRider.fixedAmtOrPct,
          cost: rider.price, applyRiderId: findRider.applyRiderId
        };
        quotePlan.riders.push(newQuoteRider);
      }
    } else {
      const riderIndex = quotePlan.riders.findIndex(x => x.riderId === rider.id);
      quotePlan.riders.splice(riderIndex, 1);
    }

    this.callQuotation(false);
  }

  /**
   * Get extra premium percentage
   * @param member Member
   * @param xtra Extra premium
   */
  getXtraPrecentaje(member, xtra) {
    if (member.xtra && member.xtra.length > 0) {
      return (member.premium.price !== 0 ? parseFloat(Math.round(xtra.price * 100 / member.premium.price).toFixed(1)) : 0);
    }

    return '';
  }

  /**
   * Back to step 1
   */
  backToQuoteStep1() {
    this.router.navigate([`/quote/quotation/${this.wizard.policyId}/step1`]);
  }

  /**
   * Back to step 2
   */
  backToChangeOptionsInformation() {
    this.router.navigate([`/quote/quotation/${this.wizard.policyId}/step2`]);
  }

  /**
   * Validate at least one mode of payment is selected
   */
  validateSelectedModeOfPayments() {
    return (this.modeOfPayments.filter(x => x.selected).length > 0);
  }

  /**
   * Generate quote PDF
   */
  async downloadQuote() {
    if (!this.validateSelectedModeOfPayments()) {
      let warn = '';
      this.translate.get('EMPLOYEE.QUOTE.QUOTATION.SUMMARY_QUOTE.NOT_SELECTED_MODE_OF_PAYMENTS').subscribe(er => {
        warn = er;
      });
      this.notificationService.showDialog('', warn);
      return;
    }
    const quoteToExport = this.BuildQuoteToExport();
    this.quoteService.exportQuotation(quoteToExport).subscribe(
      data => {
        this.file = new Blob([new Uint8Array(data)], { type: this.PDF_APPLICATION_RESPONSE });
        const fileName = `Quote_${quoteToExport.members[0].memberName.replace(/\s/g, "")}_${Utilities.generateRandomId()}`;
        const isSaved = this.saveAsFile(this.file, fileName);
      }, error => {
        let downloadError = '';
        if (this.checksIfHadNotFoundError(error)) {
          this.translate.get('EMPLOYEE.QUOTE.QUOTATION.SUMMARY_QUOTE.ERROR_PDF').subscribe(er => {
            downloadError = er;
          });
        } else if (this.checksIfHadEkitBusinessError(error)) {
          this.translate.get('EMPLOYEE.QUOTE.QUOTATION.SUMMARY_QUOTE.ERROR_PDF').subscribe(er => {
            downloadError = er;
          });
        }
        this.notificationService.showDialog('', downloadError);
      });
    return false;
  }

  /**
   * Makes a Quote instance that will be exported.
   */
  private BuildQuoteToExport() {
    const quoteToExport = this.wizard.quotationPolicy;
    quoteToExport.policy.policyReferenceId = this.wizard.policyDetail.policyReference;

    if (this.quoteHeader.inCountry) {
      quoteToExport.products[0].plans[0].deductibleInCountry = this.quoteHeader.inCountry;
    } else {
      quoteToExport.products[0].plans[0].deductibleInCountry = 0;
    }
    if (this.quoteHeader.outCountry) {
      quoteToExport.products[0].plans[0].deductibleOutCountry = this.quoteHeader.outCountry;
    } else {
      quoteToExport.products[0].plans[0].deductibleOutCountry = 0;
    }

    quoteToExport.products[0].plans[0].limitValue = this.wizard.benefits[0].benefitScopes[0].limitValue;
    quoteToExport.discounts = this.wizard.quotationPolicy.discounts;

    quoteToExport.members = this.quoteResult.quote.members;
    const modeOfPaymentsSelected = this.BuildPremiumAndModeOfPayments();
    this.quoteResult.quote.premiums[0].premiumByModeOfPayments = modeOfPaymentsSelected;
    quoteToExport.premiums = this.quoteResult.quote.premiums;
    quoteToExport.languageId = this.languageId;
    return quoteToExport;
  }

  /**
   * Builds an array of ModeOfPayment objects.
   */
  private BuildPremiumAndModeOfPayments() {
    const modeOfPaymentsSelected = Array<PremiumByModeOfPayment>();
    const modeOfPayments = Object.assign([], this.modeOfPayments);
    modeOfPayments.forEach(x => {
      if (x.selected === true) {
        const modeOfPaymentSelected = {} as PremiumByModeOfPayment;
        modeOfPaymentSelected.modeOfPayment = x.id;
        modeOfPaymentSelected.firstPayment = x.firstPaymentPrice;
        modeOfPaymentSelected.adicionalPayments = x.countPayments;
        modeOfPaymentSelected.secondPayment = x.adicionalPaymentsPrice;
        modeOfPaymentSelected.total = x.totalPrice;
        modeOfPaymentsSelected.push(modeOfPaymentSelected);
      }
    });
    return modeOfPaymentsSelected;
  }

  /**
   * Return value when saveAs operation finish
   * @param file File Blob
   * @param fileName FileName
   */
  async saveAsFile(file, fileName) {
    await saveAs(file, fileName + '.' + 'pdf');
    return true;
  }

  /**
  * Check if status is 404 and show message for data not found
  * @param error Http Error
  */
  checksIfHadNotFoundError(error) {
    return (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND);
  }

  /**
  * Check if status is BE_1000 and show message for data not found
  * @param error Http Error
  */
  checksIfHadEkitBusinessError(error) {
    return (error.status === this.ERROR_STATUS_FOR_EKIT_BUSINESS_ERROR);
  }

}
