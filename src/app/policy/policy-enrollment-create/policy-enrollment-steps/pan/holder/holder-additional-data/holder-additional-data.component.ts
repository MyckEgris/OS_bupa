import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, Observable } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Country } from 'src/app/shared/services/common/entities/country';
import { FormControl } from '@angular/forms';
import { City } from 'src/app/shared/services/common/entities/city';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { Identification } from 'src/app/shared/services/common/entities/Identification';
// tslint:disable-next-line: max-line-length
import { ManageIdentificationTypesService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/manage-identification-types.service';
@Component({
  selector: 'app-holder-additional-data',
  templateUrl: './holder-additional-data.component.html'
})
export class HolderAdditionalDataComponent implements OnInit, OnDestroy {

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
 public currentSectionControls: Section;
 /**
  * Config step of policy enrollment step2 section2 component
  */
 private configStep: ViewTemplateStep;
 /**
  * Show validations of policy enrollment step2 section2 component
  */
 public showValidations = false;

 public identificationsTypes: Array<Identification> = [];
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

  private currentSectionNumber = 2;
  citiesHome$: Observable<City[]>;
  public SECTION_FORMGROUP_NAME = 'policyOwner';
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private config: NgSelectConfig,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService,
    private manageIdentificationTypesService: ManageIdentificationTypesService) {
      this.config.notFoundText = '';
     }

  ngOnDestroy(): void {
    if (this.subscription) {this.subscription.unsubscribe(); }
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
      }, this.user, null, this.currentStep, this.currentSectionNumber);
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSectionControls = this.configStep.sections.find(s => s.id === this.currentSectionNumber);
    const homePhoneCountry = this.getControl('homePhoneCountry').value;
    if (homePhoneCountry) {
      this.getCitiesHome(homePhoneCountry);
    } else {
      this.setDefaultHomePhoneCountryAndPayTaxes();
    }
    this.getIdentifications();
  }

  /**
   * Gets identifications
   */
  async getIdentifications() {
    this.identificationsTypes = await this.manageIdentificationTypesService
      .getIdentificationsByBusinessHolder(+this.user.bupa_insurance);
  }

  /**
   * Sets default home phone country and pay taxes
   */
  private setDefaultHomePhoneCountryAndPayTaxes() {
    this.wizard.countries$.subscribe(c => {
      if (c.find(i => i.isoAlpha === this.user.cc)) {
        this.getControl('homePhoneCountry').setValue(c.find(i => i.isoAlpha === this.user.cc).countryId);
        this.getControl('placeWherePayTaxes').setValue(c.find(i => i.isoAlpha === this.user.cc).countryName);
        this.getCitiesHome(c.find(i => i.isoAlpha === this.user.cc).countryId);
      }
    });
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
   * Save the form information in the wizard service and show sucess message.
   */
  createPolicyApplication() {
    // this.saveCheckpoint();
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
          JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSectionControls.id));
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
    this.router.navigate([this.currentSectionControls.nextStep]);
  }

    /**
   * Check for request errors.
   */
  checkIfHasError(error) {
    return (error.error);
  }

  /**
   * Backs policy enrollment step2 section2 component
   */
  back() {
    this.router.navigate([this.currentSectionControls.previousStep]);
  }

  /**
    * Handles country change
    * @param value
  */
  handleCountryChange(value: Country) {
    this.getCities(value.countryId);
  }

  /**
    * Handles country change
    * @param value
  */
  handleCountryChangeHome(value: Country) {
    this.getCitiesHome(value.countryId);
  }
  /**
    * Gets cities
    * @param countryId
  */
  getCities(countryId: number) {
    this.wizard.cities$ = this.commonService.getCitiesByCountry(countryId);
  }

    /**
    * Gets cities
    * @param countryId
  */
  getCitiesHome(countryId: number) {
    this.citiesHome$ = this.commonService.getCitiesByCountry(countryId);
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
   * Handles city change
   * @param value
   */
  handleCityChange(value: City) {
    this.getAreaCodesByCity(value.cityId);
  }

  /**
   * Gets area codes by city
   * @param cityId
   */
  getAreaCodesByCity(cityId: number) {
    this.wizard.areaCodes$ = this.commonService.getAreaCodesByCity(cityId);
  }

  /**
   * Gets validator value
   * @param controlName
   * @param validator
   * @returns return validator associated to a form control
   */
  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSectionControls, controlName, validator);
  }

    /**
   * Gets validator message
   * @param controlName
   * @param validator
   * @returns the message associated to a form control
   */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSectionControls, controlName, validator);
  }

    /**
   * Determines whether control visible is
   * @param controlName
   * @returns true if control visible
   */
  isControlVisible(controlName: string): boolean {
    return this.policyEnrollmentWizardService.isControlVisible(this.currentStep, this.currentSectionControls.id, controlName);
  }

}
