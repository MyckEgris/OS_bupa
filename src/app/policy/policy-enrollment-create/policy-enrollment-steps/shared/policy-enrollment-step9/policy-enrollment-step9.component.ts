import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, forkJoin, of } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { MethodPayment } from './entities/method-payment';
import { ModePayment } from 'src/app/shared/services/common/entities/modePayment';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { METHOD_OF_PAYMENTS } from './entities/method-payment-list';
import { Router } from '@angular/router';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';

@Component({
  selector: 'app-policy-enrollment-step9',
  templateUrl: './policy-enrollment-step9.component.html',
  styles: []
})
export class PolicyEnrollmentStep9Component implements OnInit, OnDestroy {

  /**
   * Const to identify credit card by default
   */
  private CREDIT_CARD_ID = 1;

  /**
   * Const to identify annual index
   */
  private ANNUAL_ID = '4';

  /**
   * Const to identify semi-annual index
   */
  private SEMI_ANNUAL_ID = '5';

  /**
   * Const to identify default index
   */
  private INDEXOF_NEGATIVE_ID = -1;

  /**
   * Array of method of payments seted by observable
   */
  public methodPayment: Array<MethodPayment>;

  /**
   * Mode of payments
   */
  public modeOfPayments: ModePayment[];

  /**
   * Flag to show information
   */
  showInformation: boolean;
  // Ids of method of payments to show information different to method of payment credit card (Col3)
  private methodPaymetsIDs = [2, 3, 5, 6];
  private TIME_TO_DELAY = 10;

  /**
   * Const to identify the current Step
   */
  CURRENT_STEP = 9;

  /**
   * Authenticated User Object
   */
  user: UserInformationModel;

  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  configStep: ViewTemplateStep;

  /**
   * Number to identify the Section Active
   */
  sectionActive: number;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  wizard: PolicyEnrollmentWizard;

  /**
   *Const to Identify the section 2 - Credit Card
   */
  SECTION_CREDIT_CARD_ID = 2;

  /**
   *Const to Identify the section 1 - Other Payments
   */
  SECTION_OTHER_PAYMENTS = 1;

  /**
   *Const to Identify the current section number
   */
  SECTION_HOME = 0;

  /**
   *  Const to Identify the current step name
   */
  STEP_NAME = 'policyApplicationPayments';

  /**
   *Const to Identify the current section name
   */
  DEFAULT_SECTION_NAME = 'policyAppPaymentsHome';

  /**
   *Const to Identify the control paymentMode
   */
  PAYMENT_MODE = 'paymentMode';

  /**
   *Const to Identify the control paymentMethod
   */
  PAYMENT_METHOD = 'paymentMethod';

  /**
   * Flag for show form validations.
   */
  showMsgValidation: boolean;

  /***
   * Wizard Subscription
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  public currentSection: Section;

  /**
   * Flag to show router
   */
  isRouterVisible: boolean;
  paymentMethodLoaded: boolean;

  /**
   * Const to identify other payments route
   */
  OTHER_PAYMENTS_ROUTE = 'policies/create-policy-enrollment-PAN-56/step9/section1';

  /**
   * Const to identify credit card route
   */
  CREDIT_CARD_ROUTE = 'policies/create-policy-enrollment-PAN-56/step9/section2';
  private isEdit: boolean;
  /**
   *Creates an instance of PolicyEnrollmentStep9Component.
   * @param {PolicyEnrollmentWizardService} policyEnrollmentWizardService
   * @param {AuthService} authService
   * @param {CommonService} commonService
   * @param {Router} router
   * @param {FormBuilder} fb
   * @memberof PolicyEnrollmentStep9Component
   */
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder) { }


  /**
     * Executed when the component is destroyed
     */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   *Executed when the component is initiallized
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.policyEnrollmentWizardService.scheduleNewGuid();
    this.user = this.authService.getUser();
    this.setComponentData();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
        this.setSectionStep(this.wizard.currentSection);
        if (localStorage.getItem('mode') === 'Edit') {
          this.isEdit = true;
          this.getModeOfPaymentEdit();
        } else {
          this.isEdit = false;
          this.getModeOfPayment();
        }
        this.currentSection = this.configStep.sections.find(s => s.id === this.SECTION_HOME);
        this.paymentMethodLoaded = true;
      },
      this.user, null, this.CURRENT_STEP, this.SECTION_HOME);
  }

  /**
   * GetMode Of Payments.
   */
  getModeOfPayment() {
    this.commonService.getModeOfPayment().subscribe(modeOfPaymentsIn => {
      this.modeOfPayments = modeOfPaymentsIn;
      const modeOfPayment: ModePayment = this.getControl(this.PAYMENT_MODE).value;
      if (modeOfPayment) {
        this.handleModePayment(modeOfPayment, 1);
      }
    });
  }

  getModeOfPaymentEdit() {
    this.commonService.getModeOfPayment().subscribe(modeOfPaymentsIn => {
      this.modeOfPayments = modeOfPaymentsIn;
      const modeOfPayment: ModePayment = this.modeOfPayments.find(id => +id.id === this.wizard.policyApplicationModel.modeOfPaymentId);
      this.getControl(this.PAYMENT_MODE).setValue(modeOfPayment);
      if (modeOfPayment) {
        this.handleModePayment(modeOfPayment, 1);
      }
    });
  }

  setComponentData() {
    this.modeOfPayments = [];
  }
  /**
   * Sets the Step FormGroup.
   */
  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.wizard.enrollmentForm.addControl(this.configStep.type, this.fb.group({}));
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup)
      .addControl(this.configStep.sections.find(id => id.id === this.SECTION_HOME).name,
        this.policyEnrollmentWizardService.buildSection(this.CURRENT_STEP, this.SECTION_HOME));
  }

  /**
   * Get payments
   */
  trackByModePayments(index: number, modePayments: ModePayment): string {
    return modePayments.id;
  }

  /**
   * Handle mode payment
   */
  handleModePayment(modePayment: ModePayment, origin?: number) {
    this.generateMethodPayment(modePayment, origin);
  }


  /*
  * Generate method payment by mode payment
  */
  generateMethodPayment(modePayment: ModePayment, origin?: number) {
    this.methodPayment = METHOD_OF_PAYMENTS;
    if (modePayment.id === this.ANNUAL_ID || modePayment.id === this.SEMI_ANNUAL_ID) {
      this.setVisibleMethodPayment(false, origin);
    } else {
      this.setVisibleMethodPayment(true, origin);
    }
  }

  /**
   * change flags by mode of payment
   */
  setVisibleMethodPayment(isVisible: boolean, origin?: number) {
    if (+this.user.bupa_insurance === InsuranceBusiness.BUPA_PANAMA) {
      this.router.navigate(['policies/create-policy-enrollment-PAN-56/step9/']);
    } else {
      this.router.navigate(['policies/create-policy-enrollment-MEX-41/step9/']);
    }
    this.isRouterVisible = false;
    this.showInformation = false;
    this.methodPayment.forEach(i => {
      if (isVisible || i.id !== this.CREDIT_CARD_ID) {
        i.isVisible = isVisible;
      } else {
        i.isVisible = !isVisible;
      }
    });
    if (origin) {
      let paymentMethod: MethodPayment = null;
      if (this.isEdit) {
        paymentMethod = this.methodPayment.find(a => a.id === this.wizard.policyApplicationModel.paymentMethodId);
        this.getControl(this.PAYMENT_METHOD).setValue(paymentMethod);
      } else {
        paymentMethod = this.getControl(this.PAYMENT_METHOD).value;
      }
      this.handleMethodPayment(paymentMethod);
    } else {
      this.getControl(this.PAYMENT_METHOD).setValue('');
    }
  }
  /**
   * Handles method payment
   * @param methodPayment
   */
  handleMethodPayment(methodPayment: MethodPayment) {
    this.isRouterVisible = true;
    if (this.methodPaymetsIDs.indexOf(methodPayment.id) !== this.INDEXOF_NEGATIVE_ID) {
      this.showInformation = true;
      this.sectionOtherMethoPayments();
    } else {
      this.showInformation = false;
      this.sectionCreditCard(methodPayment);
    }
  }

  /**
   * Navigate to section 1, (OtherMethodPayments)
   */
  sectionOtherMethoPayments() {
    this.sectionActive = this.SECTION_OTHER_PAYMENTS;
    this.router.navigate([this.OTHER_PAYMENTS_ROUTE]);
  }

  /**
   * Navigate to section 2, (CreditCard)
   */
  sectionCreditCard(methodPayment) {
    if (methodPayment) {
      this.sectionActive = this.SECTION_CREDIT_CARD_ID;
      this.router.navigate([this.CREDIT_CARD_ROUTE]);
    }
  }



  /**
   * Get nested form group.
   */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup;
  }



  /**
    * Get nested form controls.
    */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.configStep.sections.find(id => id.id === this.SECTION_HOME).name).get(field) as FormControl;
  }

  /**
 * Establish step to current step
 * @param step Step number
 */
  async setSectionStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.sectionActive = step;
  }

}
