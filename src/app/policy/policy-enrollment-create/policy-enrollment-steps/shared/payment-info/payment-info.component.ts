import { Component, OnInit, OnDestroy, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, Observable } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { QuoteService } from 'src/app/shared/services/quote/quote.service';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import * as moment from 'moment';
import { FactoryQuoteDtoService } from '../../../policy-enrollment-wizard/Helpers/factory-quote-dto.service';
import { monthtList } from '../../../policy-enrollment-wizard/Helpers/month-number-list';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { CreditCard } from 'src/app/shared/services/policy-application/entities/credit-card';
import { TypeCreditCard } from 'src/app/shared/classes/typeCreditCard.enum';
import { AgreementDefinition } from 'src/app/shared/services/common/entities/agreement-def-enrollment-response';
import { TransformConsentsService } from '../../../policy-enrollment-wizard/mappers-services-pan/transform-consents.service';
import { ValidateCreditCardNumber } from 'src/app/shared/validators/validate-credit-cards-number';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { PaymentMethodCreditCard } from 'src/app/shared/classes/paymentMethodCreditCard.enum';
import { CreditCardType } from '../policy-enrollment-step9/entities/credit-card-type';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html'
})
export class PaymentInfoComponent implements OnInit, OnDestroy, AfterContentChecked {
  public user: UserInformationModel;
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 12;
  public currentSectionNumber = 1;
  private subscription: Subscription;
  private configStep: ViewTemplateStep;
  private quotePremiums;
  private mastercardRegex = RegExp(/^5[1-5]/);
  private visaRegex = RegExp(/^4/);
  private amexRegex = RegExp(/^3[47]/);
  /**
   * Error saving title of policy enrollment step2 section3 component
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';
  /**
   * Error saving message of policy enrollment step2 section3 component
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';
  /**
   * Error saving ok of policy enrollment step2 section3 component
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  private AGREEMENT_CERTIFICATION_PAYMENT = 'agreementCertificationPayment';
  private AGREEMENT_UNCLEAN_PAYMENT = 'agreementUnCleanPayment';
  private STATUS_CLEAN = 'Clean';
  private agreementDefinition: Array<AgreementDefinition>;
  private CREDIT_CARD_CONTROL_NAME = 'creditCardNumber';
  private EXPIRATION_MONTH_CONTROL_NAME = 'expirationMonth';
  private EXPIRATION_YEAR_CONTROL_NAME =  'expirationYear';
  private SECURITY_CODE_DUMMY = '9999';
  years$: Observable<any[]>;
  monthtList = monthtList;

  form: FormGroup;
  showValidations: boolean;
  resultStatusPreValidation: string;
  public currentSection: Section;
  constructor(private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private commonService: CommonService,
    private quoteService: QuoteService,
    private factoryQuoteDtoService: FactoryQuoteDtoService,
    private router: Router,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService,
    private transformConsentsService: TransformConsentsService,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef) {
    }

  ngAfterContentChecked(): void {
      this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.buildForm();
        this.calculatePremiumFromQuote(wizard.policyApplicationModel.modeOfPaymentId);
        wizard.agreementDefintion$.subscribe(agreements => {
          this.agreementDefinition = agreements;
        });
      }, this.user, null, this.currentStep, this.currentSectionNumber);
      this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
      this.currentSection = this.configStep.sections.find(s => s.id === 1);
    this.years$ = this.commonService.getArrayOfYearsByRange(0, 9);
  }

  buildForm() {
    const owner = this.wizard.policyApplicationModel.members.find(m => m.relationTypeId === RelationType.OWNER);
    this.form = this.fb.group({
      creditCardNumber: ['', Validators.required],
      cardHolderName: [owner.firstName, Validators.required],
      cardHolderLastName: [owner.lastName, Validators.required],
      expirationMonth: ['', Validators.required],
      expirationYear: ['', Validators.required],
      agreementCertificationPayment: ['', Validators.required],
      agreementUnCleanPayment: ['']
    });
     this.listenToExpirationMonthChange();
     this.listenToExpirationYearChange();
     this.preValidatePolicyEnrollment();
  }

  async calculatePremiumFromQuote(modeOfPaymentId: number) {
    const quoteDto = await this.factoryQuoteDtoService.createQuoteDto(this.wizard, this.user);
    this.quoteService.calculateQuote(quoteDto).subscribe(quote => {
      this.quotePremiums = quote.quote.premiums[0].premiumByModeOfPayments
        .find(x => x.modeOfPayment === modeOfPaymentId);
    });
  }

  get f() {
    return this.form as FormGroup;
  }

  get applicationId(): number {
    return this.wizard.policyApplicationModel.applicationId;
  }

  get ownerFirstNameLastName(): string {
    const owner: Member = this.wizard.policyApplicationModel.members.find(x => x.relationTypeId === RelationType.OWNER);
    return `${owner.firstName} ${owner.middleName} ${owner.lastName}`;
  }

  get agentFullName(): string {
    return `${this.user.name} ${this.user.family_name}`;
  }

  get productName(): string {
    return this.wizard.policyApplicationModel.product;
  }

  get deductibleValue() {
    if (this.factoryQuoteDtoService.deductibleValue) {
      return this.factoryQuoteDtoService.deductibleValue.deductibleInCountry;
    } else {
      return '';
    }
  }

  get modeOfPayment() {
    return `POLICY.VIEW_POLICY_DETAILS.MODE_OF_PAYMENT.${this.wizard.policyApplicationModel.modeOfPayment.toUpperCase()}`;
  }

  get createdOn() {
    return moment(this.wizard.policyApplicationModel.createdOn).format('YYYY-MM-DD');
  }

  get issueDate() {
    return moment(this.wizard.policyApplicationModel.issueDate).format('YYYY-MM-DD');
  }

  get quotePremiumsTotal(): number {
    if (this.quotePremiums) {
      return this.quotePremiums.total;
    }
  }

  get quotePremiumsFirstPayment(): number {
    if (this.quotePremiums) {
      return this.quotePremiums.firstPayment;
    }
  }

  get getMin(): number {
    const creditCardType = this.getCreditCardType(this.f.get(this.CREDIT_CARD_CONTROL_NAME).value);
    if (creditCardType) {
      switch (creditCardType) {
        case TypeCreditCard.MASTERCARD:
        case TypeCreditCard.VISA:
          this.f.get(this.CREDIT_CARD_CONTROL_NAME).setValidators([Validators.minLength(19), Validators.maxLength(19)]);
          this.f.get(this.CREDIT_CARD_CONTROL_NAME).updateValueAndValidity();
          return 19;
        case TypeCreditCard.AMEX:
          this.f.get(this.CREDIT_CARD_CONTROL_NAME).setValidators([Validators.minLength(18), Validators.maxLength(18)]);
          this.f.get(this.CREDIT_CARD_CONTROL_NAME).updateValueAndValidity();
          return 18;
        default:
          console.log('Maybe another credit card number');
          break;
      }
    }
    if (this.f.get(this.CREDIT_CARD_CONTROL_NAME).value) {
      this.f.get(this.CREDIT_CARD_CONTROL_NAME).setErrors({'incorrect': true});
    } else {
      this.f.get(this.CREDIT_CARD_CONTROL_NAME).setValidators(Validators.required);
    }
  }

  get isAMEX(): boolean {
    return (this.getCreditCardType(this.f.get(this.CREDIT_CARD_CONTROL_NAME).value) === TypeCreditCard.AMEX) ? true : false;
  }

  get isVISA(): boolean {
    return (this.getCreditCardType(this.f.get(this.CREDIT_CARD_CONTROL_NAME).value) === TypeCreditCard.VISA) ? true : false;
  }

  get isMASTERCARD(): boolean {
    return (this.getCreditCardType(this.f.get(this.CREDIT_CARD_CONTROL_NAME).value) === TypeCreditCard.MASTERCARD) ? true : false;
  }

  get isMonthOrYearValid(): boolean {
    if (this.f.get(this.EXPIRATION_MONTH_CONTROL_NAME).value && this.f.get(this.EXPIRATION_YEAR_CONTROL_NAME).value) {
      const now = new Date();
      const month = now.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12.
      const  year = now.getFullYear();
      if (+this.f.get(this.EXPIRATION_MONTH_CONTROL_NAME).value < month && +this.f.get(this.EXPIRATION_YEAR_CONTROL_NAME).value === year) {
        this.form.controls.expirationMonth.setErrors({invalidMonthYear: true});
        this.form.controls.expirationYear.setErrors({invalidMonthYear: true});
        return true;
      } else {
        this.form.controls.expirationMonth.setErrors(null);
        this.form.controls.expirationYear.setErrors(null);
        return false;
      }
    }
    return false;
  }

  getCreditCardType(creditCardNumber): number {
    if (this.mastercardRegex.test(creditCardNumber)) {
      return TypeCreditCard.MASTERCARD;
    }

    if (this.visaRegex.test(creditCardNumber)) {
      return TypeCreditCard.VISA;
    }

    if (this.amexRegex.test(creditCardNumber)) {
      return TypeCreditCard.AMEX;
    }
  }

  onSubmit() {
    if (this.f.valid && this.f.controls.agreementCertificationPayment.value) {
      this.createPolicyApplication();
    } else {
      this.showValidations = true;
    }
  }

  back() {
    this.router.navigate([`/policies/create-policy-enrollment-${this.user.bupa_insurance}/sign-and-attach-docs`]);
  }

  /**
  * Creates policy application
  */
  async createPolicyApplication() {
    await this.mappingFormValueToModelPaymentInfo();
    await this.factoryAgreement();
    this.wizard.policyApplicationModel.paymentMethodId = PaymentMethodCreditCard.ONLINE_CREDIT_CARD;
    this.createPolicyEnrollment();
    // this.setPaymentMethod(this.getCreditCardType(this.f.controls.creditCardNumber.value));
  }

  async mappingFormValueToModelPaymentInfo() {
    const owner: Member = this.wizard.policyApplicationModel.members.find(m => m.relationTypeId === RelationType.OWNER);
    if (!this.wizard.policyApplicationModel.creditCard) {
      const applicationCreditCardGuid =  await this.commonService.newGuidNuevo().toPromise();
      this.wizard.policyApplicationModel.creditCard = await this.createObjectCreditCard(applicationCreditCardGuid, owner);
    } else {
      this.wizard.policyApplicationModel.creditCard =
        await this.createObjectCreditCard(this.wizard.policyApplicationModel.creditCard.applicationCreditCardGuid, owner);
    }
  }

  async createObjectCreditCard(applicationCreditCardGuid: string, owner: Member) {
    const creditCard: CreditCard = {
      applicationCreditCardGuid: applicationCreditCardGuid,
      applicationGuid: this.wizard.policyApplicationModel.applicationGuid,
      creditCardNumber: this.f.controls.creditCardNumber.value,
      creditCardTypeId: this.getCreditCardType(this.f.controls.creditCardNumber.value),
      expirationMonth: this.f.controls.expirationMonth.value,
      expirationYear: this.f.controls.expirationYear.value,
      securityCode: this.SECURITY_CODE_DUMMY,
      cardHolderName: `${this.f.controls.cardHolderName.value}-${this.f.controls.cardHolderLastName.value}`,
      cardHolderAddress: this.wizard.policyApplicationModel.addresses
        .find(a => a.contactGuid === owner.applicationMemberGuid).addressLine1,
      cardHolderEmail: this.wizard.policyApplicationModel.emails.find(a => a.contactGuid === owner.applicationMemberGuid).emailAddress,
      relationTypeId: RelationType.OWNER
    };
    return creditCard;
  }

  async setPaymentMethod(creditCardType: number) {

    if (creditCardType === TypeCreditCard.MASTERCARD) {
      this.wizard.policyApplicationModel.paymentMethodId = PaymentMethodCreditCard.MANUAL_CREDIT_CARD_MASTERCARD;
    }

    if (creditCardType === TypeCreditCard.VISA) {
      this.wizard.policyApplicationModel.paymentMethodId = PaymentMethodCreditCard.MANUAL_CREDIT_CARD_VISA;
    }

    if (creditCardType === TypeCreditCard.AMEX) {
      this.wizard.policyApplicationModel.paymentMethodId = PaymentMethodCreditCard.MANUAL_CREDIT_CARD_AMERICAN_EXPRESS;
    }
  }

  async factoryAgreement() {
    const agreementCertificationPayment = this.agreementDefinition
      .find(a => a.agreementName.toLowerCase() === this.AGREEMENT_CERTIFICATION_PAYMENT.toLowerCase());
    const agreementUnCleanPayment = this.agreementDefinition
      .find(a => a.agreementName.toLowerCase() === this.AGREEMENT_UNCLEAN_PAYMENT.toLowerCase());
    await this.createOrUpdateAgreement(agreementCertificationPayment.agreementId,
      this.f.get(this.AGREEMENT_CERTIFICATION_PAYMENT).value);
    await this.createOrUpdateAgreement(agreementUnCleanPayment.agreementId,
      this.f.get(this.AGREEMENT_UNCLEAN_PAYMENT).value === '' ? false : this.f.get(this.AGREEMENT_UNCLEAN_PAYMENT).value);
  }

  async createOrUpdateAgreement(agreementId: number, answer: boolean) {
    if (this.wizard.policyApplicationModel.agreements.findIndex(a => a.agreementId === agreementId) === -1) {
      const agreement =  await this.transformConsentsService.createNewAgreement(answer, agreementId,
        this.wizard.policyApplicationModel.applicationGuid);
      this.wizard.policyApplicationModel.agreements.push(agreement);
    } else {
      this.wizard.policyApplicationModel.agreements
        .find(ai => ai.agreementId === agreementId)
        .answer = answer;
    }
  }

  private createPolicyEnrollment() {
    this.policyApplicationService.createPolicyApplication(this.wizard.policyApplicationModel)
      .subscribe(
        p => {
          this.success(p);
        }, async e => {
          if (this.checkIfHasError(e)) {
            const errorMessage = this.ERROR_SAVING_MESSAGE;
            const title = await this.translate.get(this.ERROR_SAVING_TITLE).toPromise();
            const message = await this.translate.get(errorMessage).toPromise();
            const ok = await this.translate.get(this.ERROR_SAVING_OK).toPromise();
            const failed = await this.notification.showDialog(title, message, false, ok);
            if (failed) {
              return;
            }
          }
        },
    );
  }

  /**
   * Success policy enrollment step2 section3 component
   * @param policyApplicationOutput
   */
  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.wizard.policyApplicationModel.policyId = policyApplicationOutput.policyId.toString();
    this.nextPage();
  }

  nextPage() {
    this.router.navigate([`/policies/create-policy-enrollment-${this.user.bupa_insurance}/summary-final`]);
  }

    /**
  * Checks if has error
  * @param error
  * @returns errors
  */
  checkIfHasError(error) {
    return (error.error);
  }

  private preValidatePolicyEnrollment() {
    this.policyApplicationService.preValidatePolicyEnrollment(this.wizard.policyApplicationModel.applicationId)
      .subscribe(response => {
        this.resultStatusPreValidation = response.status;
        this.wizard.policyApplicationModel.status = response.status;
        // this.setValidators(this.AGREEMENT_UNCLEAN_PAYMENT, response.status);
      });
  }

  private setValidators(formControlName: string, status: string) {
    if (status !== this.STATUS_CLEAN) {
      this.form.get(formControlName).setValidators(Validators.required);
      this.form.get(formControlName).updateValueAndValidity();
    } else {
      this.form.get(formControlName).clearValidators();
      this.form.get(formControlName).updateValueAndValidity();
    }
  }

  private saveCheckpoint() {
    const currentStepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
    if (currentStepCompleted.stepNumber < this.currentStep) {
      this.wizard.policyApplicationModel.currentStepCompleted =
        JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSection.id));
    }
  }

  private createCheckpoint(stepNumber: number, sectionId: number) {
    return {
      stepNumber: stepNumber,
      sectionId: sectionId
    };
  }

  get isPolicyStatusPreValidationClean() {
    return (this.resultStatusPreValidation === this.STATUS_CLEAN) ? true : false;
  }

  listenToExpirationMonthChange() {
    this.form.controls.expirationMonth.valueChanges.pipe(distinctUntilChanged()).subscribe(v => {
      if (!v) {
        this.form.controls.expirationMonth.setValue('');
      }
    });
  }

  listenToExpirationYearChange() {
    this.form.controls.expirationYear.valueChanges.pipe(distinctUntilChanged()).subscribe(v => {
      if (!v) {
        this.form.controls.expirationYear.setValue('');
      }
    });
  }

}
