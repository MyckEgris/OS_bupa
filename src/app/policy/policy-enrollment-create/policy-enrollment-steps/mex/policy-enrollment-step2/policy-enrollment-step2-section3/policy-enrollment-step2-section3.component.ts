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
import { Subscription, forkJoin } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { MunicipalityDto } from 'src/app/shared/services/common/entities/municipality.dto';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { Utilities } from 'src/app/shared/util/utilities';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-policy-enrollment-step2-section3',
  templateUrl: './policy-enrollment-step2-section3.component.html'
})
export class PolicyEnrollmentStep2Section3Component implements OnInit, OnDestroy {

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
   * Close  of policy enrollment step2 section3 component
   */
  private CLOSE = 'POLICY.APPLICATION.STEP3.CLOSE';
  /**
   * Success title of policy enrollment step2 section3 component
   */
  private SUCCESS_TITLE = 'POLICY.APPLICATION.STEP3.SUCCESS_TITLE';
  /**
   * Success message of policy enrollment step2 section3 component
   */
  private SUCCESS_MESSAGE = 'POLICY.APPLICATION.STEP3.SUCCESS_MESSAGE';
  /**
   * New policy of policy enrollment step2 section3 component
   */
  private NEW_POLICY = 'POLICY.APPLICATION.STEP3.NEW_POLICY';


  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;
  /**
   * Subscription  of policy enrollment step2 section3 component
   */
  private subscription: Subscription;
  /**
   * Subscription colonies home of policy enrollment step2 section3 component
   */
  private subscriptionColoniesHome: Subscription;
  /**
   * Subscription colonies mail of policy enrollment step2 section3 component
   */
  private subscriptionColoniesMail: Subscription;

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
  /**
   * Id country mexico of policy enrollment step2 section3 component
   */
  private ID_COUNTRY_MEXICO = 13;
  /**
   * Determines whether mexico country is
   */
  public isMexicoCountry = true;
  /**
   * Creates an instance of policy enrollment step2 section3 component.
   * @param policyEnrollmentWizardService
   * @param authService
   * @param commonService
   * @param router
   * @param translate
   * @param notification
   * @param policyApplicationService
   * @param configurationService
   * @param config
   */
  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private translate: TranslateService,
    private notification: NotificationService,
    private policyApplicationService: PolicyApplicationService,
    private configurationService: ConfigurationService,
    private config: NgSelectConfig) {
    this.config.notFoundText = '';
  }

  /**
   * on init
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      wizard => { this.wizard = wizard; }, this.user, null, this.currentStep, 3);
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.filter(s => s.id === 3)[0];
    this.getCountry();
  }
  /**
   * on destroy
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subscriptionColoniesHome) { this.subscriptionColoniesHome.unsubscribe(); }
    if (this.subscriptionColoniesMail) { this.subscriptionColoniesMail.unsubscribe(); }
  }

  /***
   * Validated field valid
   */
  isFieldValid(field: string) {
    return !this.wizard.enrollmentForm.get('policyApplicationOwnerStep').get('policyOwnerAddresses').get(field).valid
      && this.wizard.enrollmentForm.get('policyApplicationOwnerStep').get('policyOwnerAddresses').get(field).touched;
  }

  /**
   * Get control
   */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get('policyApplicationOwnerStep').get('policyOwnerAddresses').get(field) as FormControl;
  }
  /**
   * Gets form group
   * @returns form group
   */
  getFormGroup() {
    return this.wizard.enrollmentForm.get('policyApplicationOwnerStep').get('policyOwnerAddresses') as FormGroup;
  }

  /**
   * Gets country
   */
  getCountry() {
    forkJoin(this.wizard.countries$).subscribe(
      async response => {
        const country = (response[0]).filter(c => c.isoAlpha === this.user.cc)[0];
        this.getControl('countryHome').setValue(country);

        if (this.wizard.diffAddressHomeMail) {
          if (this.getControl('countryMail') && this.getControl('countryMail').value) {
            const countryMail = (response[0]).find(c => c.countryId === Number(this.getControl('countryMail').value));
            this.handleCountryChange(countryMail);
          } else {
            this.getControl('countryMail').setValue(country.countryId);
            this.handleCountryChange(country);
          }
        } else {
          Object.keys(this.getFormGroup().controls).forEach(key => {
            if ((key.substr(key.length - 4)) === 'Mail') {
              this.getFormGroup().controls[key].clearValidators();
              this.getFormGroup().controls[key].markAsPristine();
              this.getFormGroup().controls[key].updateValueAndValidity();
            }
          });
        }
      }
    );
  }
  /**
   * Gets cities
   * @param countryId
   */
  getCities(countryId: number) {
    this.wizard.cities$ = this.commonService.getCitiesByCountry(countryId);
  }
  /**
   * Searchs zip code
   * @param type
   */
  searchZipCode(type: string) {
    this.getColoniesByZipCode(type, this.getControl(type).value);
  }
  /**
   * Gets colonies by zip code
   * @param type
   * @param zipCode
   */
  getColoniesByZipCode(type: string, zipCode: string) {
    if (type === 'zipCodeHome') {
      this.wizard.coloniesHome$ = this.commonService.getColoniesByZipCode(zipCode);
      this.subscriptionColoniesHome = this.wizard.coloniesHome$.subscribe(
        result => this.getMunicipalityByZipCode(type, this.getControl(type).value),
        error => {
          if (error.status === 404) {
            this.showMessageZipNotValid();
            this.clearFields(type);
          }
        }
      );
    } else {
      this.wizard.coloniesPostal$ = this.commonService.getColoniesByZipCode(zipCode);
      this.subscriptionColoniesMail = this.wizard.coloniesPostal$.subscribe(
        result => this.getMunicipalityByZipCode(type, this.getControl(type).value),
        error => {
          if (error.status === 404) {
            this.showMessageZipNotValid();
            this.clearFields(type);
          }
        }
      );
    }
  }

  /**
   * Clears fields
   * @param type
   */
  clearFields(type: string) {
    this.getControl(type).setValue('');
    if (type === 'zipCodeHome') {
      this.getControl('stateHome').setValue('');
      this.getControl('mayoraltyMunicipalityHome').setValue('');
      if (this.getControl('colonyHome')) { this.getControl('colonyHome').setValue(''); }
      this.getControl('localityHome').setValue('');
      this.wizard.localityHome$ = null;
    } else {
      this.getControl('stateMail').setValue('');
      this.getControl('mayoraltyMunicipalityMail').setValue('');
      if (this.getControl('colonyMail')) { this.getControl('colonyMail').setValue(''); }
      this.getControl('localityMail').setValue('');
      this.wizard.localityPostal$ = null;
    }
  }

  /**
   * Gets locality by state
   * @param type
   * @param stateId
   */
  getLocalityByState(type: string, stateId: number) {
    if (type === 'zipCodeHome') {
      this.wizard.localityHome$ = this.commonService.getLocalitiesByStateId(stateId);
    } else {
      this.wizard.localityPostal$ = this.commonService.getLocalitiesByStateId(stateId);
    }
  }
  /**
   * Gets municipality by zip code
   * @param type
   * @param zipCode
   */
  getMunicipalityByZipCode(type: string, zipCode: string) {
    this.wizard.municipality$ = this.commonService.getMunicipalitiesByZipCode(zipCode);
    forkJoin(this.wizard.municipality$).subscribe(async response => {
      const municipality = (response[0])[0];
      this.validMunicipality(type, municipality);
    });
  }

  /**
   * Valids municipality
   * @param type
   * @param municipality
   */
  private validMunicipality(type: string, municipality: MunicipalityDto) {
    if (municipality.cityId === undefined || municipality.cityId === 0 || municipality.cityId === null
      || municipality.stateId === undefined || municipality.stateId === 0 || municipality.stateId === null) {
      this.clearFields(type);
      this.showMessageZipNotValid();
    } else {
      if (municipality.countryId !== this.ID_COUNTRY_MEXICO) {
        this.clearFields(type);
        this.showMessageZipNotMexico();
      } else {
        if (type === 'zipCodeHome') {
          this.getControl('stateHome').setValue(municipality.stateName);
          this.getControl('mayoraltyMunicipalityHome').setValue(municipality);
        } else {
          this.getControl('stateMail').setValue(municipality.stateName);
          this.getControl('mayoraltyMunicipalityMail').setValue(municipality);
        }
        this.getLocalityByState(type, municipality.stateId);
      }
    }
  }

  /**
   * Handles country change
   * @param value
   */
  handleCountryChange(value: Country) {
    if (value.countryId === this.ID_COUNTRY_MEXICO) {
      this.isMexicoCountry = true;
      this.getFormGroup().get('cityMail').clearValidators();
      if (this.getControl('colonyMail') === null) {
        this.getFormGroup().addControl('colonyMail', new FormControl());
      }
      this.getFormGroup().get('cityMail').clearValidators();
      this.getFormGroup().get('cityMail').markAsPristine();
      this.getControl('colonyMail').setValidators(Validators.required);
      this.getControl('colonyMail').setErrors({ required: true });
      this.getControl('colonyMail').markAsDirty();
      this.getControl('colonyMail').updateValueAndValidity();
    } else {
      this.isMexicoCountry = false;
      this.getCities(value.countryId);
      this.getControl('cityMail').setValidators(Validators.required);
      this.getControl('cityMail').setErrors({ required: true });
      this.getControl('cityMail').markAsDirty();
      this.getFormGroup().get('colonyMail').clearValidators();
      this.getFormGroup().get('colonyMail').markAsPristine();
      this.getFormGroup().get('colonyMail').updateValueAndValidity();
    }
  }

  /**
   * Hadles same address home mail
   * @param event
   */
  hadleSameAddressHomeMail(event) {
    this.wizard.diffAddressHomeMail = !(event.target.value === 'true') ? true : false;
    if (!this.wizard.diffAddressHomeMail) {
      Object.keys(this.getFormGroup().controls).forEach(key => {
        if ((key.substr(key.length - 4)) === 'Mail') {
          this.getFormGroup().controls[key].clearValidators();
          this.getFormGroup().controls[key].markAsPristine();
          this.getFormGroup().controls[key].updateValueAndValidity();
        }
      });
    } else {
      Object.keys(this.getFormGroup().controls).forEach(key => {
        if ((key.substr(key.length - 4)) === 'Mail'
          && (key !== 'insideNumberMail' && key !== 'outsideNumberMail'
            && key !== 'localityMail')) {
          this.getFormGroup().controls[key].setValidators(Validators.required);
          this.getFormGroup().controls[key].setErrors({ required: true });
          this.getFormGroup().controls[key].markAsDirty();
          this.getFormGroup().controls[key].updateValueAndValidity();
          if (key === 'cityMail' && this.isMexicoCountry) {
            this.getFormGroup().controls[key].clearValidators();
            this.getFormGroup().controls[key].markAsPristine();
            this.getFormGroup().controls[key].updateValueAndValidity();
          }
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
   * Go to home page
   */
  goToHomePage() {
    location.href = this.configurationService.returnUrl;
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
   * Shows message zip not valid
   */
  showMessageZipNotValid() {
    const messageS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE');
    const tittleS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_TITLE');

    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  /**
   * Shows message zip not mexico
   */
  showMessageZipNotMexico() {
    const messageS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_NOT_MEXICO');
    const tittleS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_TITLE');
    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
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

}
