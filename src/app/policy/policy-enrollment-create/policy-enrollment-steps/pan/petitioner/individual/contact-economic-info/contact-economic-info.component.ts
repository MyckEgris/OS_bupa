import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription, Observable } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Country } from 'src/app/shared/services/common/entities/country';
import { City } from 'src/app/shared/services/common/entities/city';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Person } from 'src/app/shared/services/policy-application/entities/person';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { PetitionerExtension } from 'src/app/shared/services/policy-application/entities/petitioner-extension';
@Component({
  selector: 'app-contact-economic-info',
  templateUrl: './contact-economic-info.component.html'
})
export class ContactEconomicInfoComponent implements OnInit, OnDestroy {

    /***
   * Wizard Subscription
   */
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
  STEP_NAME = 'policyAppInfoPetitioner';
  SECTION_NAME = 'policyApplicationPetitionerIndividualContactEconInfo';
    /**
   * Authenticated User Object
   */
  user: UserInformationModel;

  /**
   * Const to identify the current Step
   */
  CURRENT_STEP = 9;
  CURRENT_SECTION_ID = 3;

  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  configStep: ViewTemplateStep;

    /**
   * Number to identify the Section Active
   */
  _sectionActive: number;
  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  wizard: PolicyEnrollmentWizard;
  showValidations: boolean;
  cities$: Observable<City[]>;
    /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  currentSection: Section;
  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService) { }

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
      this.totalSectionByPetitionerType = 3;
      this.currentSection = this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID);
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.wizard.enrollmentForm.addControl(this.configStep.type, new FormGroup({}));
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup)
      .addControl(this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID).name,
        this.policyEnrollmentWizardService.buildSection(this.CURRENT_STEP, this.CURRENT_SECTION_ID));
    this.setValuesFormEdit();
    this.setDefaultPlaceWherePayTaxes();
  }

  setValuesFormEdit() {
    if (localStorage.getItem('mode') === 'Edit') {
      this.f.occupationProfession.setValue(this.wizard.policyApplicationModel.petitioner.industryId);
      this.setValuesAddressEdit();
      this.setValuesEconomicInfoEdit();
    } else {
      this.setDefaultValues();
    }
  }

  setValuesAddressEdit() {
    const person: Person = this.wizard.policyApplicationModel.petitioner.person;
    const address: Address = this.wizard.policyApplicationModel.petitioner.addresses
      .find(p => p.addressTypeId === AddressTypes.PHYSICAL && p.contactGuid === person.applicationPetitionerGuid);
    if (address) {
      this.f.country.setValue(address.countryId);
      this.f.province.setValue(address.state);
      this.f.city.setValue(address.cityId);
      this.f.zipCode.setValue(address.zip);
      this.f.howLongAtHome.setValue(address.yearsInAddress);
      this.f.address.setValue(address.addressLine1);
      this.getCities(address.countryId);
    } else {
      this.setDefaultValues();
    }
  }

  setValuesEconomicInfoEdit() {
    if (this.wizard.policyApplicationModel.petitioner.person.petitionerExtension) {
      const extension: PetitionerExtension = this.wizard.policyApplicationModel.petitioner.person.petitionerExtension;
      this.f.avgAnnualIncome.setValue(extension.averageAnnualIncome);
      this.f.placeTaxed.setValue(extension.placeWherePayTaxes);
      this.f.isPEP.setValue(extension.isPEP.toString());
      this.f.isRelatedToPEP.setValue(extension.relationshipPEP.toString());
      this.f.isCloseAssociatePEP.setValue(extension.associatedPEP.toString());
      this.f.isUSAResident.setValue(extension.isUsResident.toString());
    }

  }

  setDefaultValues() {
    this.wizard.countries$.toPromise().then(countries => {
      const country = countries.find(c => c.isoAlpha === this.user.cc);
      this.f.country.setValue(country.countryId);
      this.getCities(country.countryId);
    });
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
  await this.createContactEconomicInfo();
  this.wizard.policyApplicationModel.petitionerTypeId = PetitionerType.INDIVIDUAL;
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

  async createContactEconomicInfo() {
    this.wizard.policyApplicationModel.petitioner.industryId = this.f.occupationProfession.value;
    this.completePetitionerExtension();
    const addressIndex = this.wizard.policyApplicationModel.petitioner.addresses
      .findIndex(a => a.addressTypeId === AddressTypes.PHYSICAL
        && a.contactGuid === this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);

    if (addressIndex === -1) {
      const applicationAddressGuid: string = await this.commonService.newGuidNuevo().toPromise();
      this.wizard.policyApplicationModel.petitioner.addresses.push(this.createOrUpdateAddress(applicationAddressGuid,
          this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid));
    } else {
      this.wizard.policyApplicationModel.petitioner.addresses[addressIndex] = this.createOrUpdateAddress(
        this.wizard.policyApplicationModel.petitioner.addresses[addressIndex].applicationAddressGuid,
        this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
    }
  }

  createOrUpdateAddress(applicationAddressGuid: string, contactGuid: string): Address {
    const address: Address = {
      addressType:  'PHYSICAL',
      applicationAddressGuid: applicationAddressGuid,
      applicationGuid: this.wizard.policyApplicationModel.applicationGuid,
      contactType: 1,
      contactGuid: contactGuid,
      addressTypeId: AddressTypes.PHYSICAL,
      addressLine1: this.f.address.value,
      addressLine2: '',
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
      yearsInAddress: this.f.howLongAtHome.value
    };
    return address;
  }

  completePetitionerExtension() {
    this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.averageAnnualIncome = this.f.avgAnnualIncome.value;
    this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.placeWherePayTaxes = this.f.placeTaxed.value;
    this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.isUsResident = this.f.isUSAResident.value;
    this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.isPEP = this.f.isPEP.value;
    this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.relationshipPEP = this.f.isRelatedToPEP.value;
    this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.associatedPEP = this.f.isCloseAssociatePEP.value;
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

  /**
   * Sets default place where pay taxes
   * @param formControlName
   */
  private setDefaultPlaceWherePayTaxes() {
    if (!this.f.placeTaxed.value) {
      this.wizard.countries$.subscribe(c => {
        if (c.find(i => i.isoAlpha === this.user.cc)) {
          this.f.placeTaxed.setValue(c.find(i => i.isoAlpha === this.user.cc).countryName);
        }
      });
    }
  }
}
