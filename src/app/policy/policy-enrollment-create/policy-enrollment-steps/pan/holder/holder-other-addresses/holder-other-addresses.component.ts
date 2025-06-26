import { Component, OnInit } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, Observable } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { FormControl, FormGroup } from '@angular/forms';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { City } from 'src/app/shared/services/common/entities/city';
import { AreaCodes } from 'src/app/shared/services/common/entities/areacodes';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { Email } from 'src/app/shared/services/policy-application/entities/email';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
import { PhoneTypes } from 'src/app/shared/services/policy-application/constants/phone-types.enum';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { MemberExtension } from 'src/app/shared/services/policy-application/entities/member-extension';

@Component({
  selector: 'app-holder-other-addresses',
  templateUrl: './holder-other-addresses.component.html'
})
export class HolderOtherAddressesComponent implements OnInit {
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

  countriesOffice$: Observable<Country[]>;
  countriesOfficeContact$: Observable<Country[]>;
  citiesOffice$: Observable<City[]>;
  citiesOfficeContact$: Observable<City[]>;
  areaCodes$: Observable<AreaCodes[]>;
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

  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
      }, this.user, null, this.currentStep, 4);
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 4);

    this.getCountryOffice();
    this.getCountryOfficeContact();

    if (localStorage.getItem('mode') === 'Edit') {
      this.displayValuesOnEditSection4PAN();
    }
  }

  private getCountryOffice(): void {
    this.countriesOffice$ = this.commonService.getCountries();
    this.setDefaultCountryOffice();
  }

  private setDefaultCountryOffice() {
    this.countriesOffice$.subscribe(c => {
      if (c.find(i => i.isoAlpha === this.user.cc)) {
        this.getControl('countryOffice').setValue(c.find(i => i.isoAlpha === this.user.cc).countryId);
        this.getCitiesByCountryOffice(c.find(i => i.isoAlpha === this.user.cc).countryId);
      }
    });
  }

  private getCountryOfficeContact(): void {
    this.countriesOfficeContact$ = this.commonService.getCountries();
    this.setDefaultCountryOfficeContact();
  }

  private setDefaultCountryOfficeContact() {
    this.countriesOfficeContact$.subscribe(c => {
      if (c.find(i => i.isoAlpha === this.user.cc)) {
        this.getControl('countryContactInfoOffice').setValue(c.find(i => i.isoAlpha === this.user.cc).countryId);
        this.getCitiesByCountryOfficeContact(c.find(i => i.isoAlpha === this.user.cc).countryId);
      }
    });
  }

  private displayValuesOnEditSection4PAN(): void {
    this.setValuesPhysicalAddress();
    this.setValuesPhone();
    this.setValuesEmail();
  }

  private setValuesPhysicalAddress() {
    const physicalAddress: Address = this.wizard.policyApplicationModel.addresses
      .find(id => id.addressTypeId === AddressTypes.OFFICE_CONTACT);
    if (physicalAddress) {
      this.getControl('countryOffice').setValue(physicalAddress.countryId);
      this.getControl('postalCodeOffice').setValue(physicalAddress.zip);
      this.getControl('provinceOffice').setValue(physicalAddress.state);
      this.getControl('addressOffice').setValue(physicalAddress.addressLine1);
      this.getControl('cityOffice').setValue(physicalAddress.cityId);
      if (physicalAddress.countryId) {
        this.getCitiesByCountryOffice(physicalAddress.countryId);
      }
    }

  }

  private setValuesPhone() {
    const phone: Phone = this.wizard.policyApplicationModel.phones.find(id => id.phoneTypeId === PhoneTypes.OFFICE);
    if (phone) {
      this.getControl('countryContactInfoOffice').setValue(phone.countryId);
      this.getControl('cityContactInfoOffice').setValue(phone.cityId);
      this.getControl('areaCodeContactInfoOffice').setValue(phone.areaCodeId);
      this.getControl('phoneNumberContactInfoOffice').setValue(phone.phoneNumber);
      this.getControl('extensionContactInfoOffice').setValue(phone.ext);
      if (phone.countryId) {
        this.getCitiesByCountryOfficeContact(phone.countryId);
      }
    }
  }

  private setValuesEmail() {
    const email: Email = this.wizard.policyApplicationModel.emails.find(e => e.emailTypeId === EmailEnum.ALTERNATE_EMAIL);
    if (email) {
      this.getControl('emailContactInfoOffice').setValue(email.emailAddress);
    }
  }

    /**
   * Handles city change
   * @param value
   */
  handleCityOfficeContactChange(value: City) {
    this.getAreaCodesByCityOfficeContact(value.cityId);
  }

    /**
   * Gets area codes by city
   * @param cityId
   */
  getAreaCodesByCityOfficeContact(cityId: number) {
    this.areaCodes$ = this.commonService.getAreaCodesByCity(cityId);
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
  * Get control
  */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get('policyApplicationOwnerStep').get('policyOwnerAdditionalAddresses').get(field) as FormControl;
  }

  /**
   * Gets form group
   * @returns form group
   */
  getFormGroup() {
    return this.wizard.enrollmentForm.get('policyApplicationOwnerStep').get('policyOwnerAdditionalAddresses') as FormGroup;
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
   * Handles country change
   * @param value
   */
  handleCountryChangeOffice(country: Country) {
    this.getCitiesByCountryOffice(country.countryId);
  }

  handleCountryChangeOfficeContact(country: Country) {
    this.getCitiesByCountryOfficeContact(country.countryId);
  }

  private getCitiesByCountryOffice(countryId: number) {
    this.citiesOffice$ = this.commonService.getCitiesByCountry(countryId);
  }

  private getCitiesByCountryOfficeContact(countryId: number) {
    this.citiesOfficeContact$ = this.commonService.getCitiesByCountry(countryId);
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
   * Backs policy enrollment step2 section3 component
   */
  back() {
    this.router.navigate([this.currentSection.previousStep]);
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
