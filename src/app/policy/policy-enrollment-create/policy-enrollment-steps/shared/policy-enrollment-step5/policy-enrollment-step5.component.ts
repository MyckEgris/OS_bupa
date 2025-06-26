import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Product } from 'src/app/shared/services/common/entities/product';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import * as moment from 'moment';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { ModePayment } from 'src/app/shared/services/common/entities/modePayment';

@Component({
  selector: 'app-policy-enrollment-step5',
  templateUrl: './policy-enrollment-step5.component.html'
})
export class PolicyEnrollmentStep5Component implements OnInit, OnDestroy {

  /**
   * Authenticated User Object
   */
  public user: any;

  /***
   * Wizard Subscription
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollment Wizard Object
   */
  public wizard: PolicyEnrollmentWizard;

  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  private configStep: ViewTemplateStep;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  public currentSection: Section;

  /**
   * Const to Identify the current step number
   */
  public currentStep = 5;

  /**
   * Const to Identify the current section number
   */
  public currentSectionNumber = 1;

  /***
   * Const to Identify the nested FormGroup policyApplicationProductsAndPlans
   */
  public PRODANDPLAN_STEP = 'policyApplicationProductsAndPlans';

  /***
   * Const to Identify the nested FormGroup policyAppProductsAndPlans
   */
  public PRODANDPLAN_SECTION = 'policyAppProductsAndPlans';

  /***
   * Const to Identify the nested FormControl planProduct
   */
  public PRODUCT_CTRL = 'planProduct';

  /***
   * Const to Identify the nested FormControl planDeductible
   */
  public DEDUCT_CTRL = 'planDeductible';

  /***
   * Const to Identify the nested FormControl planAdditionalCoverages
   */
  public ADDCOVER_CTRL = 'planAdditionalCoverages';

  /***
   * Const to Identify the Policy Type ID
   */
  public POLICY_TYPE_ID = 1;

  /**
   * Flag for show form validations.
   */
  public formInvalid: Boolean = false;

  /***
   * CountryID of the owner
   */
  public countryId: number;

  /***
   * CityID of the owner
   */
  public cityId: number;

  /***
   * businessID of the user
   */
  public businessId: number;

  /***
   * Products Subscription
   */
  private subProducts: Subscription;

  /***
   * Products array by businessId, countryId and cityId
   */
  public products: Product[];

  /***
   * Plans Subscription
   */
  private subPlans: Subscription;

  /**
   * Plans array by productID
   */
  public plans: any[];

  /***
   * Const to Identify the default Policy Type ID
   */
  public policyTypeId: number;

  /***
   * Const to Identify the default Plan Date stored on wizard
   */
  public planDate: string;

  /**
   * Additional Coverages array by productID
   */
  public coverages: any[];

  /**
   * Additional Coverages Selected array
   */
  public selectedCoverages: any[];

  /***
   * Const to Identify the saving error title message
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';

  /***
   * Const to Identify the saving error message
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';

  /***
   * Const to Identify the saving error button message
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';

  /**
   * Constant to Identify ProdandPlan message title resource key.
   */
  public PROD_PLAN_MSG_TITLE = 'POLICY.POLICY_ENROLLMENT.STEP5.MSG_TITLE';

  /**
   * Constant to Identify anyProducts message resource key.
   */
  public ANY_PROD_MSG = 'POLICY.POLICY_ENROLLMENT.STEP5.PROD_MSG';

  /**
   * Constant to Identify anyPlan message resource key.
   */
  public ANY_PLAN_MSG = 'POLICY.POLICY_ENROLLMENT.STEP5.PLAN_MSG';

  private isEdit: boolean;
  /**
   * Mode of payments
   */
  public modeOfPayments: ModePayment[];
    /**
   *Const to Identify the control paymentMode
   */
  PAYMENT_MODE = 'modeOfPaymentId';
  /**
   * constructor method
   * @param authService auth service Injection
   * @param policyEnrollmentWizardService Policy Enrollment Wizard Service Injection
   * @param router Router Injection
   * @param translate Translate Service Injection
   * @param notification Notification Service Injection
   * @param commonService Common Service Service Injection
   * @param policyApplicationService Policy Application Service Injection
   */
  constructor(
    private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private translate: TranslateService,
    private notification: NotificationService,
    private commonService: CommonService,
    private policyApplicationService: PolicyApplicationService
  ) { }

  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subProducts) { this.subProducts.unsubscribe(); }
    if (this.subPlans) { this.subPlans.unsubscribe(); }
  }

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.setComponentData();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      wizard => {
        this.wizard = wizard;
        this.setUpForm();
        this.getModeOfPayment(this.wizard.policyApplicationModel.modeOfPaymentId);
        this.setFormData();
      }, this.user, null, this.currentStep, this.currentSectionNumber);
}

  setValueIsEdit(): void {
    if (localStorage.getItem('mode') === 'Edit') {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  }

  /**
   * Sets the component information.
   */
  setComponentData() {
    this.products = [];
    this.plans = [];
    this.coverages = [];
    this.selectedCoverages = [];
  }
  /**
   * GetMode Of Payments.
   */
  getModeOfPayment(modeOfPaymentId: number) {
    this.commonService.getModeOfPayment().subscribe(modeOfPayments => {
      this.modeOfPayments = modeOfPayments;
      const modePay: ModePayment = modeOfPayments.find(m => +m.id === modeOfPaymentId);
      this.getControl(this.PAYMENT_MODE).setValue(modePay);
    });
  }
  /**
   * Sets the component information.
   */
  setFormData() {
    this.businessId = +this.user.bupa_insurance;
    this.countryId = this.policyEnrollmentWizardService.getCountryIdFromOwner();
    this.cityId = this.policyEnrollmentWizardService.getCityIdFromOwner();
    this.setValueIsEdit();
    this.getProductsList();
  }

  /**
   * Sets the Step FormGroup.
   */
  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm.addControl(
      this.configStep.type,
      this.policyEnrollmentWizardService.buildStep(this.currentStep)
    );
    this.currentSection = this.configStep.sections.filter(s => s.id === this.currentSectionNumber)[0];
  }

  /**
   * Get nested form controls.
   */
  public getControl(field: string): FormControl {
    return this.wizard.enrollmentForm.get(this.PRODANDPLAN_STEP).get(this.PRODANDPLAN_SECTION).get(field) as FormControl;
  }

    /**
   * Gets form controls
   */
  get f() {
    return (this.wizard.enrollmentForm.get(this.configStep.type).get(this.configStep.sections
      .find(s => s.id === 1).name) as FormGroup).controls;
  }

  /**
   * Get nested form group.
   */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.PRODANDPLAN_STEP).get(this.PRODANDPLAN_SECTION) as FormGroup;
  }

  /**
   * Get nested Step form group.
   */
  public getStepFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.PRODANDPLAN_STEP) as FormGroup;
  }

  /**
   * Validate the form and allow to continue.
   */
  next() {
    this.validateForm();
  }

  /**
   * Allow to return.
   */
  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

  /**
   * Validate form validations.
   */
  validateForm() {
    const isInvalid = this.getStepFormGroup().invalid;
    if (isInvalid) {
      this.formInvalid = true;
    } else {
      this.formInvalid = false;
      this.createPolicyApplication();
    }
  }

  /***
   * Get list of products filtering by businessId, countryId and cityId.
   */
  getProductsList() {
    this.products = [];
    // this.subProducts = this.commonService.getProductByCityAndCountry(this.businessId, this.countryId, this.cityId).subscribe(
    this.subProducts = this.commonService.getProductByCityAndCountry(this.businessId, this.countryId, this.cityId, true).subscribe(
      products => {
        let selectedProd: Product;
        this.products = products;
        if (this.isEdit) {
          selectedProd = products.find(id => +id.id === +this.wizard.policyApplicationModel.productId);
          this.getControl(this.PRODUCT_CTRL).setValue(selectedProd);
        } else {
          selectedProd = this.getControl(this.PRODUCT_CTRL).value;
        }
        this.handleProductChange(selectedProd, 1);
      },
      error => {
        this.showMessage(1);
      }
    );
  }

  /**
   * Validate whether the user is changing the values before set from quote
   * @param product
   * @param origin
   */
  prevalidateProductChanged(product: Product, origin?: number) {
    if (this.wizard.policyApplicationModel.quoteRequest && this.wizard.policyApplicationModel.productId !== product.id) {
      this.messageWarningProducts(product, origin);
    } else {
      this.handleProductChange(product, origin);
    }
  }

  messageWarningProducts(product: Product, origin?: number) {
    const messageS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP5.MSG_WARNING_PROUDCTS`);
    const tittleS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP5.WARNING_PRODUCTS_TITLE`);
    const yes = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.OK`);
    const no = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.NOT`);

    forkJoin([tittleS, messageS, yes, no]).subscribe(async response => {
      const getIt = await this.notification.showDialog(response[0], response[1], true, response[2], response[3]);
      if (getIt) {
        this.handleProductChange(product, origin);
      } else {
        const selectedProd: Product = this.products.find(id => +id.id === +this.wizard.policyApplicationModel.productId);
        this.getControl(this.PRODUCT_CTRL).setValue(selectedProd);
      }
    });
  }

  /***
   * Handle products list change and gets list of plans and raiders filtering by productID.
   * @param product Selected Product
   * @param origin Origin of the function
   */
  handleProductChange(product: Product, origin?: number) {
    if (product) {
      this.planDate = this.convertDateToFormat(this.wizard.policyApplicationModel.issueDate);
      this.getPlans(product.id, this.countryId, this.cityId, this.POLICY_TYPE_ID, this.planDate, origin);
    }
  }

  /**
 * Validate whether the user is changing the values before set from quote
 * @param plan
 * @param origin
 */
  prevalidatePlanChanged(plan: any, origin?: number) {
    if (this.wizard.policyApplicationModel.quoteRequest &&
      this.wizard.policyApplicationModel.quoteRequest.planId &&
      this.wizard.policyApplicationModel.quoteRequest.planId !== 0 &&
      this.wizard.policyApplicationModel.quoteRequest.deductibleRegionPlanXRefId &&
      this.wizard.policyApplicationModel.quoteRequest.deductibleRegionPlanXRefId !== 0 &&
      (this.wizard.policyApplicationModel.quoteRequest.planId !== plan.planId ||
      this.wizard.policyApplicationModel.quoteRequest.deductibleRegionPlanXRefId !== plan.deductibleId)) {
      this.messageWarningPlansDeductibles(plan, origin);
    } else {
      this.handlePlanChange(plan, origin);
    }
  }

  messageWarningPlansDeductibles(plan: any, origin?: number) {
    const messageS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP5.MSG_WARNING_PLAN_DEDUCTIBLE`);
    const tittleS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP5.WARNING_PLAN_DEDUCTIBLE_TITLE`);
    const yes = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.OK`);
    const no = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.NOT`);

    forkJoin([tittleS, messageS, yes, no]).subscribe(async response => {
      const getIt = await this.notification.showDialog(response[0], response[1], true, response[2], response[3]);
      if (getIt) {
        this.handlePlanChange(plan, origin);
      } else {
        const selectedPlan = this.plans.find(id => +id.planId === +this.wizard.policyApplicationModel.planId);
        this.getControl(this.DEDUCT_CTRL).setValue(selectedPlan);
      }
    });
  }

    /***
   * Handle plan list change and set coverages array.
   * @param plan Selected Plan
   * @param origin Origin of the function
   */
  handlePlanChange(plan: any, origin?: number) {
    if (plan && this.businessId !== InsuranceBusiness.BUPA_PANAMA) {
      this.coverages = plan.riders;
      this.selectedCoverages = [];
      if (origin && plan) {
        if (this.isEdit) {
          for (let index = 0; index < this.coverages.length; index++) {
            const rider = this.coverages[index];
            const findIndexResult = this.wizard.policyApplicationModel.riders.findIndex(id => +id.riderId === +rider.riderId);
            if (findIndexResult !== -1) {
              this.selectedCoverages.push(rider);
            }
          }
          this.getControl(this.ADDCOVER_CTRL).setValue(this.coverages);
        } else {
          this.selectedCoverages = this.getControl(this.ADDCOVER_CTRL).value;
        }
      }
      for (let index = 0; index < this.coverages.length; index++) {
        this.policyEnrollmentWizardService.scheduleNewGuid();
      }
    } else { this.coverages = []; this.selectedCoverages = []; }
  }


  /***
   * Gets list of plans and raiders filtering by productID.
   * @param productId Product ID
   * @param countryId Country ID
   * @param cityId City ID
   * @param policyTypeId Policy Type ID
   * @param origin Origin of the function
   */
  getPlans(productId: number, countryId: number, cityId: number, policyTypeId: number, planDate: string, origin?: number) {
    this.plans = [];
    this.coverages = [];
    this.selectedCoverages = [];
    this.subPlans = this.commonService.getPlansAndRidersByProductAndCountryIdAndCityIdAndPolicyTypeId
      (productId, countryId, cityId, policyTypeId, planDate).subscribe(
        plans => {
          this.plans = plans[0].plans;
          let selectedPlan: any;
          if (origin) {
            if (this.isEdit) {
              selectedPlan = this.plans.find(id => +id.planId === +this.wizard.policyApplicationModel.planId);
              this.getControl(this.DEDUCT_CTRL).setValue(selectedPlan);
            } else {
              selectedPlan = this.getControl(this.DEDUCT_CTRL).value;
            }
            this.handlePlanChange(selectedPlan, origin);
          } else { this.getControl(this.DEDUCT_CTRL).setValue(''); }
        },
        error => {
          this.showMessage(0);
        }
      );
  }

  /***
   * Handle plan list change and set coverages array.
   * @param event Change Event
   * @param cover Selected Coverage
   */
  handleCoverChange(event, cover: any) {
    if (cover) {
      if (event.target.checked) {
        this.selectedCoverages.push(cover);
      } else {
        if (this.selectedCoverages.indexOf(cover) > -1) {
          this.selectedCoverages.splice(this.selectedCoverages.indexOf(cover), 1);
        }
      }
      this.getControl(this.ADDCOVER_CTRL).setValue(this.selectedCoverages);
    }
  }

  /***
  * Sets the Selected Coverages Checked.
  * @param cover Selected Coverage
  */
  setChecked(cover: any) {
    if (this.selectedCoverages.indexOf(cover) > -1) {
      return true;
    } else { return false; }
  }

  /**
   * Save the form information in the wizard service and show sucess message.
   */
  createPolicyApplication() {
    this.saveCheckpoint();
    this.policyEnrollmentWizardService.buildPolicyApplication();
    this.policyApplicationService.createPolicyEnrollment(this.wizard.policyApplicationModel)
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

  private saveCheckpoint() {
    const currentStepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
    if (currentStepCompleted.stepNumber === this.currentStep) {
      const totalSections = this.wizard.viewTemplate.steps.find(st => st.stepNumber === currentStepCompleted.stepNumber).sections.length;
      if (totalSections > 1 && currentStepCompleted.sectionId < this.currentSectionNumber) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSectionNumber));
      }
    } else {
      if (currentStepCompleted.stepNumber < this.currentStep) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSectionNumber));
      }
    }
  }

  private createCheckpoint(stepNumber: number, sectionId: number) {
    return {
      stepNumber: stepNumber,
      sectionId: sectionId
    };
  }

  /**
   * Check for request errors.
   */
  checkIfHasError(error) {
    return (error.error);
  }

  /**
   * Store the succes request id in wizard and continue to next page.
   */
  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  /**
   * Route to next page.
   */
  nextPage() {
    this.router.navigate([this.currentSection.nextStep]);
  }

  /**
    * Convert date value to format YYYY-MM-DD.
    * @param value Value
    */
  convertDateToFormat(value: any) {
    if (value) {
      return moment(value).format('YYYY-MM-DD');
    } else { return null; }
  }

  /**
    * Show notification message if request return any products or plans.
    * @param msgType Message Type (0. any plans, 1.any products)
    */
  showMessage(msgType: number) {
    let message = '';
    let title = '';
    this.translate.get(this.PROD_PLAN_MSG_TITLE).subscribe(
      result => title = result);
    if (msgType === 1) {
      this.translate.get(this.ANY_PROD_MSG).subscribe(
        result => message = result);
    } else {
      this.translate.get(this.ANY_PLAN_MSG).subscribe(
        result => message = result);
    }
    this.notification.showDialog(title, message);
  }

  messageWarningPlans(product: Product) {
    const messageS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.MSG_WARNING_QUOTE`);
    const tittleS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.MSG_TITLE_WARNING_QUOTE`);
    const yes = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.OK`);
    const no = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.NOT`);

    forkJoin([tittleS, messageS, yes, no]).subscribe(async response => {
      const getIt = await this.notification.showDialog(response[0], response[1], true, response[2], response[3]);
      if (getIt) {
      }
    });
  }

}




