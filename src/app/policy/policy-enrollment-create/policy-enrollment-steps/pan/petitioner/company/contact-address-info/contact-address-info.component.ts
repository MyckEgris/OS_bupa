import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Country } from 'src/app/shared/services/common/entities/country';
import { City } from 'src/app/shared/services/common/entities/city';
import { AreaCodes } from 'src/app/shared/services/common/entities/areacodes';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { Email } from 'src/app/shared/services/policy-application/entities/email';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { PhoneTypes } from 'src/app/shared/services/policy-application/constants/phone-types.enum';

@Component({
  selector: 'app-contact-address-info',
  templateUrl: './contact-address-info.component.html'
})
export class ContactAddressInfoComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private _totalSectionByPetitionerType: number;
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
   * PolicyEnrollment Wizard Filtered Current Section
   */
  wizard: PolicyEnrollmentWizard;
  STEP_NAME = 'policyAppInfoPetitioner';
  SECTION_NAME = 'policyApplicationCompanyContactAddressInfo';
  /**
  * Authenticated User Object
  */
  user: UserInformationModel;
  /**
  * Const to identify the current Step
  */
  CURRENT_STEP = 9;
  CURRENT_SECTION_ID = 6;

  /**
  * PolicyEnrollment Wizard Step Configuration
  */
  configStep: ViewTemplateStep;

  /**
  * Number to identify the Section Active
  */
  _sectionActive: number;
  showValidations: boolean;
  /**
  * PolicyEnrollment Wizard Filtered Current Section
  */
  currentSection: Section;
  cities$: Observable<City[]>;
  areaCodes$: Observable<AreaCodes[]>;

  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService,
    private router: Router) { }

    /**
    * Executed when the component is destroyed
    */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();

      }, this.user, null, this.CURRENT_STEP, this.CURRENT_SECTION_ID);
      this.sectionActive = 2;
      this.totalSectionByPetitionerType = 2;
      this.currentSection = this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID);
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.wizard.enrollmentForm.addControl(this.configStep.type, new FormGroup({}));
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup)
      .addControl(this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID).name,
        this.policyEnrollmentWizardService.buildSection(this.CURRENT_STEP, this.CURRENT_SECTION_ID));
    this.setValuesFormEdit();
    this.setDefaultCountry();
  }

  setValuesFormEdit() {
    if (localStorage.getItem('mode') === 'Edit') {
      this.setValuesAddresEdit();
      this.setValuesEmailEdit();
      this.setValuesPhoneEdit();
      this.setWorkplace();
    } else {
      if (this.f.country.value !== '') {
        this.getCities(this.f.country.value);
      }

      if (this.f.city.value !== '') {
        this.getAreaCodesByCity(this.f.city.value);
      }
    }
  }

  setValuesAddresEdit() {
    const address: Address = this.wizard.policyApplicationModel.petitioner.addresses
      .find(a => a.addressTypeId === AddressTypes.OFFICE_CONTACT &&
        a.contactGuid === this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    if (address) {
      this.f.address.setValue(address.addressLine1);
      this.f.city.setValue(address.cityId);
      this.f.country.setValue(address.countryId);
      this.f.province.setValue(address.state);
      this.f.zipCode.setValue(address.zip);
      this.getCities(address.countryId);
    }
  }

  setValuesEmailEdit() {
    const email: Email = this.wizard.policyApplicationModel.petitioner.emails
      .find(e => e.emailTypeId === EmailEnum.OTHER_EMAIL &&
        e.contactGuid === this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    if (email) {
      this.f.email.setValue(email.emailAddress);
    }
  }

  setValuesPhoneEdit() {
    const phone: Phone = this.wizard.policyApplicationModel.petitioner.phones.find(p => p.phoneTypeId === PhoneTypes.OFFICE
      && p.contactGuid === this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    if (phone) {
      this.f.phoneNumber.setValue(phone.phoneNumber);
      this.f.extension.setValue(phone.ext);
      this.f.country.setValue(phone.countryId);
      this.f.city.setValue(phone.cityId);
      this.f.areaCode.setValue(phone.areaCodeId);
      this.getAreaCodesByCity(phone.cityId);
    }
  }

  setWorkplace() {
    this.f.workplace.setValue(this.wizard.policyApplicationModel.petitioner.company.petitionerExtension.workPlace);
  }

  /**
  * Handles country change
  * @param value
  */
  handleCountryChanged(value: Country) {
    this.getCities(value.countryId);
  }

  /**
  * Gets cities
  * @param countryId
  */
  getCities(countryId: number) {
    this.cities$ = this.commonService.getCitiesByCountry(countryId);
  }

  /**
   * Handles city change
   * @param value
   */
  handleCityChanged(value: City) {
    this.getAreaCodesByCity(value.cityId);
  }

    /**
   * Gets area codes by city
   * @param cityId
   */
  getAreaCodesByCity(cityId: number) {
    this.areaCodes$ = this.commonService.getAreaCodesByCity(cityId);
  }
  /**
   * Gets validator value
   * @param controlName
   * @param validator
   * @returns validators associated to form control from view template
   */
  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }
  /**
   * Gets validator message
   * @param controlName
   * @param validator
   * @returns the message associated to validator of a form control from view template
   */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  next() {
    const isFormValid = (this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID).name) as FormControl);
    if (isFormValid.valid) {
      this.showValidations = false;
      this.createPolicyApplication();
    } else {
      this.showValidations = true;
    }
  }

  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

      /**
   * Creates policy application
   */
  async createPolicyApplication() {
    await this.createAddressPhoneEmail();
    this.wizard.policyApplicationModel.petitionerTypeId = PetitionerType.COMPANY;
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

  async createAddressPhoneEmail() {
    await this.createAddressInfo();
    await this.createEmailInfo();
    await this.createPhoneInfo();
    this.completePetitionerExtension();
  }

  async createAddressInfo() {
    const index = this.wizard.policyApplicationModel.petitioner.addresses.findIndex(a => a.addressTypeId === AddressTypes.OFFICE_CONTACT
      && a.contactGuid === this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    if (index !== -1) {
      this.wizard.policyApplicationModel.petitioner.addresses[index] =
      this.createOrUpdateAdress(this.wizard.policyApplicationModel.petitioner.addresses[index].applicationAddressGuid,
        this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    } else {
      const applicationAddressGuid: string = await this.commonService.newGuidNuevo().toPromise();
      this.wizard.policyApplicationModel.petitioner.addresses.push(
        this.createOrUpdateAdress(applicationAddressGuid,
        this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid)
      );
    }
  }

  createOrUpdateAdress(applicationAddressGuid: string, contactGuid: string) {
    const address: Address = {
      addressType: 'OFFICE',
      applicationAddressGuid: applicationAddressGuid,
      applicationGuid: this.wizard.policyApplicationModel.applicationGuid,
      contactType: 1,
      contactGuid: contactGuid,
      addressTypeId: AddressTypes.OFFICE_CONTACT,
      addressLine1: this.f.address.value,
      addressLine2: null,
      cityId: this.f.city.value,
      city: null,
      countryId: this.f.country.value,
      country: null,
      colonyId: null,
      colony: null,
      state: this.f.province.value,
      municipality: null,
      zip: this.f.zipCode.value,
      exterior: null,
      interior: null,
      localityId: null,
      street: this.f.address.value,
      yearsInAddress: null
    };
    return address;
  }

  async createEmailInfo() {
    const index = this.wizard.policyApplicationModel.petitioner.emails.findIndex(e => e.emailTypeId === EmailEnum.OTHER_EMAIL
      && e.contactGuid === this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    if (index !== -1) {
      this.wizard.policyApplicationModel.petitioner.emails[index] = this.createOrUpdateEmail(
        this.wizard.policyApplicationModel.petitioner.emails[index].applicationEmailGuid,
        this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    } else {
      const applicationEmailGuid: string = await this.commonService.newGuidNuevo().toPromise();
      this.wizard.policyApplicationModel.petitioner.emails.push(
        this.createOrUpdateEmail(applicationEmailGuid,
        this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid)
      );
    }
  }

  createOrUpdateEmail(applicationEmailGuid: string, contactGuid: string): Email {
    const email: Email = {
      applicationEmailGuid: applicationEmailGuid,
      applicationGuid: this.wizard.policyApplicationModel.applicationGuid,
      contactType: 1,
      emailTypeId: EmailEnum.OTHER_EMAIL,
      emailAddress: this.f.email.value,
      contactGuid: contactGuid,
      emailType: null
    };
    return email;
  }

  async createPhoneInfo() {
    const index = this.wizard.policyApplicationModel.petitioner.phones.findIndex(p => p.phoneTypeId === PhoneTypes.OFFICE
      && p.contactGuid === this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    if (index !== -1) {
      this.wizard.policyApplicationModel.petitioner.phones[index] = this.createOrUpdatePhone(
        this.wizard.policyApplicationModel.petitioner.phones[index].applicationPhoneGuid,
        this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    } else {
      const applicationPhoneGuid: string = await this.commonService.newGuidNuevo().toPromise();
      this.wizard.policyApplicationModel.petitioner.phones.push(
        this.createOrUpdatePhone(applicationPhoneGuid,
        this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid)
      );
    }
  }

  createOrUpdatePhone(applicationPhoneGuid: string, contactGuid: string): Phone {
    const phone: Phone = {
      phoneType: null,
      applicationPhoneGuid: applicationPhoneGuid,
      applicationGuid: this.wizard.policyApplicationModel.applicationGuid,
      contactType: 1,
      contactGuid: contactGuid,
      phoneTypeId: PhoneTypes.OFFICE,
      phoneNumber: this.f.phoneNumber.value,
      ext: this.f.extension.value,
      countryId: this.f.country.value,
      cityId: this.f.city.value,
      areaCodeId: this.f.areaCode.value,
      areaCode: null,
      fullPhone: null
    };
    return phone;
  }

  completePetitionerExtension() {
    this.wizard.policyApplicationModel.petitioner.company.petitionerExtension.workPlace = this.f.workplace.value;
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
   * Gets form
   * @returns a form group
   */
  get currentFormGroup() {
    return  this.wizard.enrollmentForm
      .get(this.configStep.type)
      .get(this.configStep.sections
      .find(s => s.id === this.CURRENT_SECTION_ID).name) as FormGroup;
  }

  /**
  * Gets form controls
  */
  get f() {
    return (this.wizard.enrollmentForm.get(this.configStep.type).get(this.configStep.sections
      .find(s => s.id === this.CURRENT_SECTION_ID).name) as FormGroup).controls;
  }

  get totalSectionByPetitionerType(): number {
    return this._totalSectionByPetitionerType;
  }

  set totalSectionByPetitionerType(value: number) {
    this._totalSectionByPetitionerType = value;
  }

  get sectionActive(): number {
    return this._sectionActive;
  }

  set sectionActive(value: number) {
    this._sectionActive = value;
  }

  private setDefaultCountry() {
    this.wizard.countries$.subscribe(c => {
      if (c.find(i => i.isoAlpha === this.user.cc)) {
        this.f.country.setValue(c.find(i => i.isoAlpha === this.user.cc).countryId);
        this.getCities(c.find(i => i.isoAlpha === this.user.cc).countryId);
      }
    });
  }

}
