import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { FormControl, FormGroup } from '@angular/forms';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { City } from 'src/app/shared/services/common/entities/city';

@Component({
  selector: 'app-petitioner-contact-information',
  templateUrl: './petitioner-contact-information.component.html'
})
export class PetitionerContactInformationComponent implements OnInit, OnDestroy {

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

  /**
   * Id of the contact information section of the petitioners
   */
  private ID_SECTION_INFO_CONTACT_PETITIONER = 3;

  /***
   * Id of the moral petitioner section
   */
  private POLICYAPP_INFO_MORAL_PETITIONER = 2;

  public currentStep = 10;

  @Input() showValidations: boolean;

  public currentSection: Section;

  private configStep: ViewTemplateStep;

  get formEnrollmentInfoContactPetitioner() {
    return this.wizard.enrollmentForm.get('policyApplicationPetitioner').get('policyAppContactPetitioner') as FormGroup;
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
        this.currentSection = this.configStep.sections.find(s => s.id === this.ID_SECTION_INFO_CONTACT_PETITIONER);
      }, this.user, null, this.currentStep, null);

    if (localStorage.getItem('mode') === 'Edit') {
      if (this.wizard.policyApplicationModel.petitioner.addresses) {
        this.getControl('country').setValue(this.wizard.policyApplicationModel.petitioner.addresses[0].countryId);
        this.getControl('city').setValue(this.wizard.policyApplicationModel.petitioner.addresses[0].cityId);
      }

      if (this.wizard.policyApplicationModel.petitioner.phones) {
        this.getControl('areaCode').setValue(this.wizard.policyApplicationModel.petitioner.phones[0].areaCodeId);
      }
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
    return this.wizard.enrollmentForm
      .get(this.configStep.type)
      .get('policyAppContactPetitioner')
      .get(field) as FormControl;
  }

  handleCountryChange(value: Country) {
    this.getCities(value.countryId);
  }

  getCities(countryId: number) {
    this.wizard.cities$ = this.commonService.getCitiesByCountry(countryId);
  }

  getAreaCodesByCity(cityId: number) {
    this.wizard.areaCodes$ = this.commonService.getAreaCodesByCity(cityId);
  }

  handleCityChange(value: City) {
    this.getAreaCodesByCity(value.cityId);
  }

}
