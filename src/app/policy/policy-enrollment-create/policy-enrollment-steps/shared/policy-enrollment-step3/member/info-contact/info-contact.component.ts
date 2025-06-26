import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, Observable } from 'rxjs';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { City } from 'src/app/shared/services/common/entities/city';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { AreaCodes } from 'src/app/shared/services/common/entities/areacodes';
@Component({
  selector: 'app-info-contact',
  templateUrl: './info-contact.component.html'
})
export class InfoContactComponent implements OnInit, OnDestroy {
  cities$: Observable<City[]>;
  areaCodes$: Observable<AreaCodes[]>;

  /**
  * User Authenticated Object
  */
  public user: UserInformationModel;

  /***
   * Subscription wizardService
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollmentWizard Object
   */
  public wizard: PolicyEnrollmentWizard;

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

  get formInfoContact() {
    return (this.wizard.enrollmentForm
      .get(this.configStep.type)
      .get('items') as FormArray)
      .at(this.numberIndexMember)
      .get('policyAppContactDependents') as FormGroup;
  }

  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private config: NgSelectConfig
  ) { this.config.notFoundText = ''; }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
       this.currentSection = this.configStep.sections.filter(s => s.id === 2)[0];
      }, this.user, null, this.currentStep, 1);
      if (localStorage.getItem('mode') === 'Edit') {
        const diffInfoContactAddress: boolean = this.formEnrollmentDependents.get('policyAppInfoDependents')
          .get('diffInfoContactAddress').value;
        if (diffInfoContactAddress) {
          const phone: Phone = this.wizard.policyApplicationModel.phones.find(guid => guid.contactGuid ===
            this.formEnrollmentDependents.get('GUID').value);
          if (phone) {
            this.formEnrollmentDependents.get('policyAppContactDependents').get('country').setValue(phone.countryId);
            this.formEnrollmentDependents.get('policyAppContactDependents').get('city').setValue(phone.cityId);
            this.formEnrollmentDependents.get('policyAppContactDependents').get('areaCode').setValue(phone.areaCodeId);
            this.formEnrollmentDependents.get('policyAppContactDependents').get('nroPhone').setValue(phone.phoneNumber);
            this.getCities(phone.countryId);
            this.getAreaCodesByCity(phone.cityId);
          }
        }
      } else {
        if (this.formEnrollmentDependents.get('policyAppContactDependents').get('country').value) {
          this.getCities(this.formEnrollmentDependents.get('policyAppContactDependents').get('country').value);
          if (this.formEnrollmentDependents.get('policyAppContactDependents').get('city').value) {
            this.getAreaCodesByCity(this.formEnrollmentDependents.get('policyAppContactDependents').get('city').value);
          }
        }
      }
      this.setCountryDefault();
  }

  private setCountryDefault() {
    if (!this.formEnrollmentDependents.get('policyAppContactDependents').get('country').value) {
      this.wizard.countries$.subscribe(c => {
        if (c.find(i => i.isoAlpha === this.user.cc)) {
          this.formEnrollmentDependents
            .get('policyAppContactDependents')
            .get('country')
            .setValue(c.find(i => i.isoAlpha === this.user.cc).countryId);
          this.getCities(c.find(i => i.isoAlpha === this.user.cc).countryId);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  /**
   * Get control
   */
  getControl(field: string) {
    return (this.wizard.enrollmentForm
      .get(this.configStep.type)
      .get('items') as FormArray)
      .at(this.numberIndexMember)
      .get('policyAppContactDependents')
      .get(field) as FormControl;
  }

  handleCountryChange(value: Country) {
    this.getCities(value.countryId);
  }

  getCities(countryId: number) {
    this.cities$ = this.commonService.getCitiesByCountry(countryId);
  }

  getAreaCodesByCity(cityId: number) {
    this.areaCodes$ = this.commonService.getAreaCodesByCity(cityId);
  }

  handleCityChange(value: City) {
    this.getAreaCodesByCity(value.cityId);
  }
}
