/**
* policy-enrollment-step2-section2.component.component.ts
*
* @description: This class handle step 2 policy aplication wizard.
* @author Enrique Durango.
* @version 1.0
* @date 29-10-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { FormControl } from '@angular/forms';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { City } from 'src/app/shared/services/common/entities/city';
import { Router } from '@angular/router';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { NgSelectConfig } from '@ng-select/ng-select';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { IdentificationTypes } from 'src/app/shared/services/policy-application/constants/identification-type.enum';

@Component({
  selector: 'app-policy-enrollment-step2-section2',
  templateUrl: './policy-enrollment-step2-section2.component.html'
})
export class PolicyEnrollmentStep2Section2Component implements OnInit, OnDestroy {

  /**
  * User Authenticated Object
  */
  public user: UserInformationModel;

  /**
   * Subscription  of policy enrollment step2 section2 component
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollmentWizard Object
   */
  public wizard: PolicyEnrollmentWizard;
  /**
   * Current step of policy enrollment step2 section2 component
   */
  public currentStep = 2;
  /**
   * Current section of policy enrollment step2 section2 component
   */
  public currentSection: Section;
  /**
   * Config step of policy enrollment step2 section2 component
   */
  private configStep: ViewTemplateStep;
  /**
   * Show validations of policy enrollment step2 section2 component
   */
  public showValidations = false;

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
   * Creates an instance of policy enrollment step2 section2 component.
   * @param policyEnrollmentWizardService
   * @param authService
   * @param commonService
   * @param router
   * @param config
   * @param policyApplicationService
   * @param translate
   * @param notification
   */
  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private config: NgSelectConfig,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService) {
    this.config.notFoundText = '';
  }

  /**
   * on init
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      wizard => { this.wizard = wizard; }, this.user, null, this.currentStep, 2);
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 2);
  }


  /**
   * on destroy
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Gets validator value
   * @param controlName
   * @param validator
   * @returns return validator associated to a form control
   */
  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  /**
   * Gets validator message
   * @param controlName
   * @param validator
   * @returns the message associated to a form control
   */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  /***
   * Validated field valid
   */
  isFieldValid(field: string) {
    return !this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.configStep.sections.find(x => x.id === this.currentStep).name)
      .get(field).valid
      && this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.configStep.sections.find(x => x.id === this.currentStep).name)
        .get(field).touched;
  }

  /**
   * Get control
   */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.configStep.sections
        .find(x => x.id === this.currentStep).name)
      .get(field) as FormControl;
  }

  /**
   * Gets form
   * @returns a form group
   */
  getForm() {
    return this.wizard.enrollmentForm
      .get(this.configStep.type)
      .get(this.configStep.sections.find(x => x.id === this.currentStep).name);
  }

/**
 * Gets cities
 * @param countryId
 */
  getCities(countryId: number) {
    this.wizard.cities$ = this.commonService.getCitiesByCountry(countryId);
  }

  /**
   * Gets area codes by city
   * @param cityId
   */
  getAreaCodesByCity(cityId: number) {
    this.wizard.areaCodes$ = this.commonService.getAreaCodesByCity(cityId);
  }

  /**
   * Handles country change
   * @param value
   */
  handleCountryChange(value: Country) {
    this.getCities(value.countryId);
  }

  /**
   * Handles city change
   * @param value
   */
  handleCityChange(value: City) {
    this.getAreaCodesByCity(value.cityId);
  }

  /**
   * Next policy enrollment step2 section2 component
   */
  next() {
    if (this.getForm().valid) {
      this.showValidations = false;
      this.createPolicyApplication();
    } else {
      this.showValidations = true;
    }
  }

  /**
   * Backs policy enrollment step2 section2 component
   */
  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

  /**
   * Save the form information in the wizard service and show sucess message.
   */
  createPolicyApplication() {
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

}
