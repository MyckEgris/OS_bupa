import { CreditCardType } from './../entities/credit-card-type';
import { find } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { TypeCreditCard } from 'src/app/shared/classes/typeCreditCard.enum';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { Utilities } from 'src/app/shared/util/utilities';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { CREDIT_CARDS_TYPES } from '../entities/credit-card-type-list';

@Component({
  selector: 'app-policy-enrollment-step9-section2',
  templateUrl: './policy-enrollment-step9-section2.component.html'
})
export class PolicyEnrollmentStep9Section2Component implements OnInit {

  public paymentForm: FormGroup;

  // variable for save selection of selected Type credit card
  typeCreditCard: TypeCreditCard;

  // Save code Policy Insurance
  bupaInsurance: number;

  // url of image logo credit card
  urlImg = '';

  // Maximum character for CVC
  public maxCVC = 4;

  // Minimum character for CVC
  public minCVC = 3;

  // Arrays for options in components select on html
  typeCards: CreditCardType[] = [];

  maxCharCardNumber = 16;



  /***
   * Wizard Subscription
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollment Wizard Object
   */
  wizard: PolicyEnrollmentWizard;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  public currentSection: Section;

  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  private configStep: ViewTemplateStep;

  /**
   * Const to identify current step
   */
  CURRENT_STEP = 9;

  /**
   * Const to identify current section
   */
  CURRENT_SECTION = 2;

  /**
   * Authenticated User Object
   */
  public user: UserInformationModel;

  // Arrays for options in components select on html
  listMonths: string[] = [];
  listYears: number[] = [];

  /**
   * Const to identify the control monthExpiration
   */
  MONTH_EXPIRATION = 'monthExpiration';

  /**
   *Const to identify the control yearExpiration
   */
  YEAR_EXPIRATION = 'yearExpiration';

  /**
     *Const to identify the control cardNumber
     */
  CARD_NUMBER = 'cardNumber';

  /**
   *Const to identify the control securityCode
   */
  SECURITY_CODE = 'securityCode';

  /**
   *Const to identify the control fullName
   */
  FULL_NAME = 'fullName';

  /**
   *Const to identify the control creditCardType
   */
  CARD_TYPE = 'creditCardType';

  /**
   *Const to identify the control email
   */
  EMAIL = 'email';

  /**
   *Const to identify the control cardHolderDirection
   */
  DIRECTION = 'cardHolderDirection';

  /**
     *  Const to Identify the current step name
     */
  STEP_NAME = 'policyApplicationPayments';

  /**
    * Const to Identify the current section name
    */
  SECTION_NAME = 'policyAppPaymentsCreditCard1';

  private isEdit: boolean;




  /**
   *Creates an instance of PolicyEnrollmentStep9Section2Component.
   * @param {AuthService} authService
   * @param {PolicyEnrollmentWizardService} policyEnrollmentWizardService
   * @memberof PolicyEnrollmentStep9Section2Component
   */
  constructor(private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService) {
  }



  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.currentSection = this.configStep.sections.find(id => id.id === this.CURRENT_SECTION);
    this.obtainTypeCreditCards();
    this.user = this.authService.getUser();
    this.obtainDateForExperirations();
    this.wizard = this.policyEnrollmentWizardService.
                  getPolicyEnrollmentWithSetCurrentStep(null, this.CURRENT_STEP, this.CURRENT_SECTION);
    this.setUpForm();
    this.bupaInsurance = +this.user.bupa_insurance;
    this.valueChanges();

    if (localStorage.getItem('mode') === 'Edit') {
      this.isEdit = true;
      this.setUpFormEdit();
    } else {
      this.isEdit = false;
    }
  }

  valueChanges() {
    this.getControl(this.CARD_TYPE).valueChanges.subscribe(val => {
      this.buildFormByCardType(val);
    }
    );
  }

  /**
   *Set the step form Group
   */
  setUpForm() {
    const formBasic: FormGroup = this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup;
    (formBasic).addControl(this.configStep.sections.find(i => i.id === this.CURRENT_SECTION).name,
      this.policyEnrollmentWizardService.buildSection(this.CURRENT_STEP, this.CURRENT_SECTION));
    (formBasic.get(this.configStep.sections.find(i => i.id === this.CURRENT_SECTION).name) as FormGroup)
      .setValidators(this.validateExpirationsDate);
  }

  setUpFormEdit() {
    if (this.wizard.policyApplicationModel.creditCard) {
      this.getControl(this.FULL_NAME).setValue(this.wizard.policyApplicationModel.creditCard.cardHolderName);
      const creditCardType: CreditCardType = CREDIT_CARDS_TYPES
        .find(id => id.id === this.wizard.policyApplicationModel.creditCard.creditCardTypeId);
      const yearIndex = this.listYears.indexOf(this.wizard.policyApplicationModel.creditCard.expirationYear);
      const monthIndex = this.listMonths.indexOf((this.wizard.policyApplicationModel.creditCard.expirationMonth + '').padStart(2, '0'));
      this.getControl(this.CARD_TYPE).setValue(creditCardType);
      this.getControl(this.YEAR_EXPIRATION).setValue(this.listYears[yearIndex]);
      this.getControl(this.MONTH_EXPIRATION).setValue(this.listMonths[monthIndex]);
      this.getControl(this.SECURITY_CODE).setValue(this.wizard.policyApplicationModel.creditCard.securityCode);
      this.getControl(this.EMAIL).setValue(this.wizard.policyApplicationModel.creditCard.cardHolderEmail);
      this.getControl(this.DIRECTION).setValue(this.wizard.policyApplicationModel.creditCard.cardHolderAddress);
    }
  }


  /**
   * Get nested form group.
   */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name) as FormGroup;
  }

  /**
    * Get nested form controls.
    */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name).get(field) as FormControl;
  }

  /**
  * Get nested validator
  */
  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  /**
  * Get Nested Message
  */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }



  // Validate letter start of credit card depending of insurance + type credit card
  validateCcNumber(control: AbstractControl): { [key: string]: boolean } | null {

    let invalidCard = false;
    switch (this.typeCreditCard) {
      case TypeCreditCard.VISA:
        if (!control.value.startsWith('4')) { invalidCard = true; }
        break;
      case TypeCreditCard.AMEX:
        if (this.isInsuranceMexico()) {
          if (!control.value.startsWith('34') && !control.value.startsWith('37')) { invalidCard = true; }
        } else {
          if (!control.value.startsWith('3')) { invalidCard = true; }
        }
        break;
      case TypeCreditCard.MASTERCARD:
        if (!control.value.startsWith('5')) { invalidCard = true; }
        break;
      default:
        break;
    }
    if (invalidCard) {
      return { invalidCardFormat: true };
    }
    return null;
  }

  // Validate date expirations, Validated only if the month is less when current year is selected
  validateExpirationsDate(group: FormGroup) {
    const month = group.controls['monthExpiration'];
    const year = group.controls['yearExpiration'];
    if (!month.value || !year.value) { return null; }
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = (date.getUTCMonth() + 1);

    // If it is the current year
    if (currentYear === year.value) {
      if (Number(month.value) < currentMonth) {
        group.controls['monthExpiration'].setErrors({'incorrect': true});
        group.controls['yearExpiration'].setErrors({'incorrect': true});
        return { invalidDate: true };
      }
    }
    group.controls['monthExpiration'].setErrors(null);
    group.controls['yearExpiration'].setErrors(null);
    return null;
  }

  // Validate if Insurance is Mexico
  isInsuranceMexico(): boolean {
    return this.bupaInsurance === InsuranceBusiness.BUPA_MEXICO;
  }

  // Depend of selection one chooses show image SVG and start construct form
  buildFormByCardType(cardType: CreditCardType) {
    if (cardType) {
      this.getCcValidationLength(cardType.description);
      this.urlImg = cardType.url;
    }
  }

  /**
   *Clear validators on change credit card
   */
  clearValidatorsCardNumberAndCode() {
    this.SetValuesByDefault();
    this.getControl(this.CARD_NUMBER).setValidators([]);
    this.getControl(this.SECURITY_CODE).setValidators([]);
  }

  /**
   *Set default validators on change credit card
   */
  SetValuesByDefault() {
    this.getControl(this.CARD_NUMBER).setValue('');
    this.getControl(this.SECURITY_CODE).setValue('');
    this.getControl(this.MONTH_EXPIRATION).setValue('');
    this.getControl(this.YEAR_EXPIRATION).setValue('');
    this.getControl(this.EMAIL).setValue('');
    this.getControl(this.DIRECTION).setValue('');
  }

  /**
  * Sets the max lenght of the card depending on the card type selected.
  * @param cardType Card type selected by the user
  */
  getCcValidationLength(cardType: string) {
    this.clearValidatorsCardNumberAndCode();
    switch (cardType) {
      case TypeCreditCard.getDescription(TypeCreditCard.AMEX):
        this.typeCreditCard = TypeCreditCard.AMEX;
        this.maxCharCardNumber = 15;
        this.getControl(this.CARD_NUMBER).setValidators([Validators.minLength(15), Validators.maxLength(15),
        Validators.pattern('^[0-9]*$'), Validators.required,
        this.validateCcNumber.bind(this)]);
        this.getControl(this.SECURITY_CODE).setValidators([Validators.minLength(4), Validators.maxLength(4),
        Validators.pattern('^[0-9]*$'), Validators.required]);
        break;
      default:
       this.maxCharCardNumber = 16;
        if (cardType === TypeCreditCard.getDescription(TypeCreditCard.VISA)) {
          this.typeCreditCard = TypeCreditCard.VISA;
        } else {
          this.typeCreditCard = TypeCreditCard.MASTERCARD;
        }
        this.getControl(this.CARD_NUMBER).setValidators([Validators.minLength(16), Validators.maxLength(16),
        Validators.pattern('^[0-9]*$'), Validators.required,
        this.validateCcNumber.bind(this)]);
        this.getControl(this.SECURITY_CODE).setValidators([Validators.minLength(3), Validators.maxLength(4),
        Validators.pattern('^[0-9]*$'), Validators.required]);
        break;
    }
  }

  // fill array select mounths and year.
  obtainDateForExperirations() {
    for (let i = 1; i <= 12; i++) {
      if (i < 10) {
        this.listMonths.push('0' + i);
      } else {
        this.listMonths.push('' + i);
      }
    }

    for (let i = new Date().getFullYear(); i < (new Date().getFullYear() + 10); i++) {
      this.listYears.push(i);
    }
  }


  // fill select to type credit card.
  obtainTypeCreditCards() {
    this.typeCards = CREDIT_CARDS_TYPES;
  }

  /**
   * Set required validator
   * @param {string} field
   * @returns
   * @memberof PolicyEnrollmentStep9Section2Component
   */
  isFieldRequired(field: string) {
    if (this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.SECTION_NAME)
      .get(field).hasError('required')) {
      return true;
    } else {
      return false;
    }
  }

}
