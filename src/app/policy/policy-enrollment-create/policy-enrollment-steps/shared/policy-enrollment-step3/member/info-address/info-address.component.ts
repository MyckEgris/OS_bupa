import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { MunicipalityDto } from 'src/app/shared/services/common/entities/municipality.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { City } from 'src/app/shared/services/common/entities/city';
@Component({
  selector: 'app-info-address',
  templateUrl: './info-address.component.html'
})
export class InfoAddressComponent implements OnInit, OnDestroy {
  countries$: Observable<Country[]>;
  cities$: Observable<City[]>;
  /**
  * User Authenticated Object
  */
  public user: UserInformationModel;

  private subscription: Subscription;

  private subscriptionColoniesHome: Subscription;

  private subscriptionContriesHome: Subscription;

  /**
   * PolicyEnrollmentWizard Object
   */
  public wizard: PolicyEnrollmentWizard;

  private ID_COUNTRY_MEXICO = 13;

  public isBupaMexico = false;

  /***
   *  Indicates the number of dependent added
   */
  @Input() numberIndexMember: number;

  @Input() currentStep: number;

  @Input() showValidations: boolean;

  get formEnrollmentDependents() {
    if (this.numberIndexMember >= 0) {
      return (this.wizard.enrollmentForm
        .get('policyApplicationDependents')
        .get('items') as FormArray)
        .at(this.numberIndexMember) as FormGroup;
    } else {
      return null;
    }
  }

  public currentSection: Section;

  private configStep: ViewTemplateStep;

  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private translate: TranslateService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      wizard => { this.wizard = wizard; }, this.user, null, this.currentStep, 1);
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.filter(s => s.id === 3)[0];
    this.setBupaMexico();
    if (localStorage.getItem('mode') === 'Edit') {
      const diffInfoContactAddress: boolean = this.formEnrollmentDependents.get('policyAppInfoDependents')
        .get('diffInfoContactAddress').value;
      if (diffInfoContactAddress) {
        const address: Address = this.wizard.policyApplicationModel.addresses.find(guid => guid.contactGuid ===
          this.formEnrollmentDependents.get('GUID').value);
        if (address) {
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('cityHome').setValue(address.cityId);
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('streetAvenueHome').setValue(address.street);
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('insideNumberHome').setValue(address.interior);
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('outsideNumberHome').setValue(address.exterior);
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('zipCodeHome').setValue(address.zip);
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('colonyHome').setValue(address.colonyId);
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('stateHome').setValue(address.state);
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('localityHome').setValue(address.localityId);
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('mayoraltyMunicipalityHome').setValue(address.municipality);
          this.formEnrollmentDependents.get('policyAppAddressDependents').get('yearsInHome').setValue(address.yearsInAddress);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subscriptionColoniesHome) { this.subscriptionColoniesHome.unsubscribe(); }
    if (this.subscriptionContriesHome) { this.subscriptionContriesHome.unsubscribe(); }
  }

  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  getControl(field: string) {
    return (this.wizard.enrollmentForm
      .get(this.configStep.type)
      .get('items') as FormArray)
      .at(this.numberIndexMember)
      .get('policyAppAddressDependents')
      .get(field) as FormControl;
  }

  setBupaMexico() {
    this.getCountries();
    if (Number(this.user.bupa_insurance) === InsuranceBusiness.BUPA_MEXICO) {
      this.isBupaMexico = true;
    } else {
      this.isBupaMexico = false;
    }
  }

  searchZipCode() {
    this.getColoniesByZipCode();
  }

  private getCountries() {
    this.countries$ = this.commonService.getCountries();
    forkJoin(this.countries$).subscribe(async response => {
      const country = (response[0]).find(x => x.isoAlpha === this.user.cc);
      this.getControl('countryHome').setValue(country.countryId);
      this.getControl('countryHome').setValidators([]);
      this.getControl('countryHome').updateValueAndValidity();
      this.handleCountryChange(country);
    });
  }

  handleCountryChange(value: Country) {
    this.getCities(value.countryId);
  }

  private getColoniesByZipCode() {
    this.wizard.coloniesHome$ = this.commonService.getColoniesByZipCode(this.getControl('zipCodeHome').value);
    this.subscriptionColoniesHome = this.wizard.coloniesHome$.subscribe(
      result => this.getMunicipalityByZipCode(this.getControl('zipCodeHome').value),
      error => {
        if (error.status === 404) {
          this.showMessageZipNotValid();
          this.clearFields();
        }
      }
    );
  }

  private getMunicipalityByZipCode(zipCode: string) {
    this.wizard.municipality$ = this.commonService.getMunicipalitiesByZipCode(zipCode);
    forkJoin(this.wizard.municipality$).subscribe(async response => {
      const municipality = (response[0])[0];
      this.validMunicipality(municipality);
    });
  }

  private validMunicipality(municipality: MunicipalityDto) {
    if (municipality.cityId === undefined || municipality.cityId === 0 || municipality.cityId === null
      || municipality.stateId === undefined || municipality.stateId === 0 || municipality.stateId === null) {
      this.clearFields();
      this.showMessageZipNotValid();
    } else {
      if (municipality.countryId !== this.ID_COUNTRY_MEXICO) {
        this.clearFields();
        this.showMessageZipNotMexico();
      } else {
        this.getControl('stateHome').setValue(municipality.stateName);
        this.getControl('mayoraltyMunicipalityHome').setValue(municipality.municipalityName);
        this.getControl('cityHome').setValue(municipality.cityId);
        this.getLocalityByState(municipality.stateId);
      }
    }
  }

  private getLocalityByState(stateId: number) {
    this.wizard.localityHome$ = this.commonService.getLocalitiesByStateId(stateId);
  }

  getCities(countryId: number) {
    this.cities$ = this.commonService.getCitiesByCountry(countryId);
  }

  private showMessageZipNotValid() {
    const messageS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE');
    const tittleS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_TITLE');

    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  private showMessageZipNotMexico() {
    const messageS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_NOT_MEXICO');
    const tittleS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_TITLE');
    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  private clearFields() {
    this.getControl('zipCodeHome').setValue('');
    this.getControl('stateHome').setValue('');
    this.getControl('mayoraltyMunicipalityHome').setValue('');
    if (this.getControl('colonyHome')) { this.getControl('colonyHome').setValue(''); }
    this.getControl('localityHome').setValue('');
    this.wizard.localityHome$ = null;
  }

  getField(fieldId) {
    return this.currentSection.controls.find(x => x.key === fieldId);
  }

}
