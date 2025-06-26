import { find } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { City } from 'src/app/shared/services/common/entities/city';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
@Component({
  selector: 'app-holder-addresses',
  templateUrl: './holder-addresses.component.html'
})
export class HolderAddressesComponent implements OnInit, OnDestroy {

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

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;
  /**
   * Subscription  of policy enrollment step2 section3 component
   */
  private subscription: Subscription;
    /**
   * PolicyEnrollmentWizard Object
   */
  public wizard: PolicyEnrollmentWizard;
  /**
   * Current step of policy enrollment step2 section3 component
   */
  public currentStep = 2;
  /**
   * Current section of policy enrollment step2 section3 component
   */
  public currentSection: Section;
  /**
   * Config step of policy enrollment step2 section3 component
   */
  private configStep: ViewTemplateStep;
  /**
   * Show validations of policy enrollment step2 section3 component
   */
  public showValidations = false;

  citiesHome$: Observable<City[]>;
  citiesMail$: Observable<City[]>;
  isRequiredCityMail: boolean;
  /***
   * Const to Identify the nested FormGroup policyApplicationIntroductionStep
   */
  public OWNER_STEP = 'policyApplicationOwnerStep';
  public SECTION_ADDRESSES = 'policyOwnerAddresses';
  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private translate: TranslateService,
    private notification: NotificationService,
    private policyApplicationService: PolicyApplicationService,
    private config: NgSelectConfig) {
    this.config.notFoundText = '';
  }

  /**
   * on init
   */
  async ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => { this.wizard = wizard; }, this.user, null, this.currentStep, 3);
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 3);
    await this.getCountryAsync();
    if (localStorage.getItem('mode') === 'Edit') {
      await this.displayValuesOnEdit();
    }

    if (this.wizard.diffAddressHomeMail) {
      await this.getCitiesMailAsync(this.getControl('countryMail').value);
    }
  }
  async getCountryAsync() {
    this.wizard.countries$.subscribe(
      async response => {
        const country =  response.find(c => c.isoAlpha === this.user.cc);
        this.getControl('countryHome').setValue(country);
        await this.getCitiesHomeAsync(country.countryId);
      }
    );
  }

  /**
   * Handles country change
   * @param country
   */
  async handleCountryMailChange(country: Country) {
    this.getControl('cityMail').setValue(null);
    await this.getCitiesMailAsync(country.countryId);
    await this.setConfigurationCityMail();
  }

  async setConfigurationCityMail() {
    this.getControl('cityMail').setValidators(Validators.required);
    this.getControl('cityMail').setErrors({ required: true });
    this.getControl('cityMail').markAsDirty();
    this.isRequiredCityMail = true;
  }

   /**
   * Gets cities
   * @param countryId
   */
  async getCitiesMailAsync(countryId: number) {
    this.citiesMail$ = this.commonService.getCitiesByCountry(countryId);
  }

    /**
   * Gets cities
   * @param countryId
   */
  async getCitiesHomeAsync(countryId: number) {
    this.citiesHome$ = this.commonService.getCitiesByCountry(countryId);
  }

    /**
   * on destroy
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

    /**
   * Get control
   */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get(this.OWNER_STEP).get(this.SECTION_ADDRESSES).get(field) as FormControl;
  }

    /**
   * Gets form group
   * @returns form group
   */
  getFormGroup() {
    return this.wizard.enrollmentForm.get(this.OWNER_STEP).get(this.SECTION_ADDRESSES) as FormGroup;
  }

    /**
   * Next policy enrollment step2 section3 component
   */
  next() {
    if (this.getFormGroup().valid) {
      this.showValidations = false;
      this.createPolicyApplication();
    } else {
      this.showValidations = true;
    }
  }

    /**
   * Creates policy application
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
      if (totalSections > 1 && currentStepCompleted.sectionId < this.currentSection.id) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSection.id));
      }
    } else {
      if (currentStepCompleted.stepNumber < this.currentStep) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSection.id));
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
   * Success policy enrollment step2 section3 component
   * @param policyApplicationOutput
   */
  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  /**
   * Next page
   */
  nextPage() {
    this.router.navigate([this.currentSection.nextStep]);
  }

    /**
   * Checks if has error
   * @param error
   * @returns errors
   */
  checkIfHasError(error) {
    return (error.error);
  }

    /**
   * Gets validator value
   * @param controlName
   * @param validator
   * @returns the validator of a form control
   */
  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

    /**
   * Gets validator message
   * @param controlName
   * @param validator
   * @returns the message associated to validator form control
   */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

    /**
   * Hadles same address home mail
   * @param event
   */
  async hadleSameAddressHomeMail(event) {
    this.wizard.diffAddressHomeMail = !(event.target.value === 'true') ? true : false;
    if (!this.wizard.diffAddressHomeMail) {
      Object.keys(this.getFormGroup().controls).forEach(key => {
        if ((key.substr(key.length - 4)) === 'Mail') {
          this.getFormGroup().controls[key].clearValidators();
          this.getFormGroup().controls[key].markAsPristine();
          this.getFormGroup().controls[key].updateValueAndValidity();
          this.isRequiredCityMail = false;
        }
      });
    } else {
      const countryPhysical: Country = this.getControl('countryHome').value;
      await this.getCitiesMailAsync(countryPhysical.countryId);
      Object.keys(this.getFormGroup().controls).forEach(key => {
        if ((key.substr(key.length - 4)) === 'Mail'
            && (key !== 'insideNumberMail' && key !== 'outsideNumberMail'
            && key !== 'localityMail' && key !== 'colonyMail'
            && key !== 'zipCodeMail')) {
          this.getFormGroup().controls[key].setValidators(Validators.required);
          this.getFormGroup().controls[key].setErrors({ required: true });
          this.getFormGroup().controls[key].markAsDirty();
          this.getFormGroup().controls[key].updateValueAndValidity();
          if (key === 'countryMail') {
            this.getFormGroup().controls[key].patchValue(countryPhysical.countryId);
          } else {
            this.getFormGroup().controls[key].patchValue(null);
          }
          this.isRequiredCityMail = true;
        }
      });
    }
  }

   /**
   * Backs policy enrollment step2 section3 component
   */
  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

  async displayValuesOnEdit() {
    const owner: Member = this.wizard.policyApplicationModel.members.find(id => id.relationTypeId === 2);
    const physicalAddress: Address = this.wizard.policyApplicationModel.addresses
      .find(id => id.contactGuid === owner.applicationMemberGuid && id.addressTypeId === AddressTypes.PHYSICAL);
    if (physicalAddress) {
      this.getControl('zipCodeHome').setValue(physicalAddress.zip);
      this.getControl('mayoraltyMunicipalityHome').setValue(physicalAddress.municipality);
      this.getControl('stateHome').setValue(physicalAddress.state);
      this.getControl('streetAvenueHome').setValue(physicalAddress.addressLine1);
      this.getControl('cityHome').setValue(physicalAddress.cityId);
      this.getControl('yearsInAddress').setValue(physicalAddress.yearsInAddress);

    }
    const mailingAddress: Address = this.wizard.policyApplicationModel.addresses
      .find(id => id.contactGuid === owner.applicationMemberGuid && id.addressTypeId === AddressTypes.MAILING);
    if (mailingAddress) {
      this.getControl('zipCodeMail').setValue(mailingAddress.zip);
      this.getControl('countryMail').setValue(mailingAddress.countryId);
      this.getControl('streetAvenueMail').setValue(mailingAddress.addressLine1);
      this.getControl('mayoraltyMunicipalityMail').setValue(mailingAddress.municipality);
      this.getControl('stateMail').setValue(mailingAddress.state);
      this.getControl('cityMail').setValue(mailingAddress.cityId);
      this.wizard.diffAddressHomeMail = true;
    }
  }

  /**
   * Determines whether control visible is
   * @param controlName
   * @returns true if control visible
   */
  isControlVisible(controlName: string): boolean {
    return this.policyEnrollmentWizardService.isControlVisible(this.currentStep, this.currentSection.id, controlName);
  }
}
