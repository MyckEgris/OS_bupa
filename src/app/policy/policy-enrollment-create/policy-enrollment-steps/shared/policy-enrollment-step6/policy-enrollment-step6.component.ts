/**
* PolicyEnrollmentStep7Component.ts
*
* @description: Policy Enrollment Step6
* @author Enrique Durango Rivera
* @version 1.0
* @date NOV-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { FormControl } from '@angular/forms';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { City } from 'src/app/shared/services/common/entities/city';
import { AreaCodes } from 'src/app/shared/services/common/entities/areacodes';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Colony } from 'src/app/shared/services/common/entities/colony.dto';
import { Locality } from 'src/app/shared/services/common/entities/locality';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { MunicipalityDto } from 'src/app/shared/services/common/entities/municipality.dto';
import { find, map, count } from 'rxjs/operators';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import * as moment from 'moment';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { TypesIdentificationData } from '../constants-data/identification-data';
@Component({
  selector: 'app-policy-enrollment-step6',
  templateUrl: './policy-enrollment-step6.component.html'
})
export class PolicyEnrollmentStep6Component implements OnInit, OnDestroy {
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  private configStep: ViewTemplateStep;
  private subscription: Subscription;
  private subscriptionColonies: Subscription;
  private user: UserInformationModel;
  private subscriptionCountries: Subscription;
  private ID_COUNTRY_MEXICO = 13;
   fieldsToEnableDisable: string[] = ['cityHomeAddress', 'colony', 'locality', 'insideNumber',
   'outsideNumber', 'mayoralMunicipality', 'state'];
  isMexicoCountry: boolean;
  wizard: PolicyEnrollmentWizard;
  citiesContactPhone$: Observable<City[]>;
  citiesHomeAddress$: Observable<City[]>;
  areaCodes$: Observable<AreaCodes[]>;
  colonies$: Observable<Colony[]>;
  localities$: Observable<Locality[]>;
  municipalities$: Observable<MunicipalityDto[]>;
  currentStep = 6;
  CONST_FORMCONTROL_QUESTION: 'question';
  wasValidateCss: boolean;
  addingBeneficiary: boolean;
  showMsgValidation: boolean;
  showMsgNoQuestionAnswer: boolean;
  private PHONE_TYPE_PORTABLE = 1004;
  private PHONE_TYPE_HOME = 1000;
  private isEdit: boolean;

  public currentSection: Section;
  public identificationsTypes = TypesIdentificationData;

  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService,
    private config: NgSelectConfig) {
    this.config.notFoundText = '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subscriptionCountries) {
      this.subscriptionCountries.unsubscribe();
    }

    if (this.subscriptionColonies) {
      this.subscriptionColonies.unsubscribe();
    }
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
        this.currentSection = this.configStep.sections.filter(s => s.id === 1)[0];
      }, this.user, null, this.currentStep, 1);
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm.addControl(this.configStep.type, this.policyEnrollmentWizardService.buildStep(this.currentStep));
    this.getControl(this.configStep.sections.find(s => s.id === 4).name, 'addressType').setValue(2);
    if (localStorage.getItem('mode') === 'Edit') {
      this.isEdit = true;
      if (!this.wizard.policyApplicationModel.beneficiary) {
        this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'question').setValue('false');
        this.addingBeneficiary = false;
      } else {
        this.setUpFormEdit();
      }
    } else {
      this.isEdit = false;
      if (this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'question').value === 'true') {
        this.addingBeneficiary = true;
        this.getCountries();
      } else {
        this.addingBeneficiary = false;
      }
    }
  }

  setUpFormEdit() {
    if (this.wizard.policyApplicationModel.beneficiary) {

      this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'question').setValue('true');
      this.getControl(this.configStep.sections
        .find(s => s.id === 1).name, 'firstName').setValue(this.wizard.policyApplicationModel.beneficiary.firstName);
      this.getControl(this.configStep.sections
        .find(s => s.id === 1).name, 'secondName').setValue(this.wizard.policyApplicationModel.beneficiary.middleName);
      this.getControl(this.configStep.sections
        .find(s => s.id === 1).name, 'surname').setValue(this.wizard.policyApplicationModel.beneficiary.paternalLastName);
      this.getControl(this.configStep.sections
        .find(s => s.id === 1).name, 'secondSurname').setValue(this.wizard.policyApplicationModel.beneficiary.maternalLastName);
      this.getControl(this.configStep.sections
        .find(s => s.id === 1).name, 'dob').setValue(moment(this.wizard.policyApplicationModel.beneficiary.dob).toDate());

      this.fillIdentifications();
      this.fillAddress();
      this.fillPhones();

      this.enableAllControls();
      // this.searchZipCodeValue(addresses.zip);
      this.getCountries();
    } else {
      if (this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'question').value === 'true') {
        this.enableAllControls();
        this.getCountries();
      }
      this.clearFields();
    }
  }

  private fillAddress() {
    const addresses: Address = this.wizard.policyApplicationModel.beneficiary.addresses
    .find(id => id.contactGuid === this.wizard.policyApplicationModel.beneficiary.applicationBeneficiaryGuid);
    if (addresses) {
      this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'countryHomeAddress')
        .setValue(addresses.countryId);

      this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'zipCode')
        .setValue(addresses.zip);

      this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'colony')
        .setValue(addresses.colonyId);

      this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'locality')
        .setValue(addresses.localityId);

      this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'streeAvenue')
        .setValue(addresses.street);

      this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'insideNumber')
        .setValue(addresses.interior);

      this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'outsideNumber')
        .setValue(addresses.exterior);

      this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'state')
        .setValue(addresses.state);

      this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'cityHomeAddress')
        .setValue(addresses.cityId);

    }
  }

  private fillPhones() {
    const phoneHome: Phone = this.wizard.policyApplicationModel.beneficiary.phones
      .find(id => id.contactGuid === this.wizard.policyApplicationModel.beneficiary.applicationBeneficiaryGuid &&
        id.phoneTypeId === this.PHONE_TYPE_HOME);
    if (phoneHome) {
      this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'countryContactPhone')
        .setValue(phoneHome.countryId);
      this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'cityContactPhone')
        .setValue(phoneHome.cityId);
      this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'areaCode')
        .setValue(phoneHome.areaCodeId);
      this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'phoneNumber')
        .setValue(phoneHome.phoneNumber);
    }

    const phonePortable: Phone = this.wizard.policyApplicationModel.beneficiary.phones
      .find(p => p.contactGuid === this.wizard.policyApplicationModel.beneficiary.applicationBeneficiaryGuid &&
        p.phoneTypeId === this.PHONE_TYPE_PORTABLE);
    if (phonePortable) {
      this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'cellPhoneNumber')
        .setValue(phonePortable.phoneNumber);
    }
  }

  private fillIdentifications() {
    const identification = this.wizard.policyApplicationModel.beneficiary.identifications
      .find(i => i.contactGuid === this.wizard.policyApplicationModel.beneficiary.applicationBeneficiaryGuid);
    if (identification) {
      this.getControl(this.configStep.sections
        .find(s => s.id === 1).name, 'typeOfDocument').setValue(identification.identificationTypeId);
      this.getControl(this.configStep.sections
        .find(s => s.id === 1).name, 'numberOfDocument').setValue(identification.identificationNumber);
    }
  }

  getCountries() {
    if (this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'countryContactPhone').value === ''
      && this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'countryHomeAddress').value === '') {
      this.subscriptionCountries = this.wizard.countries$.pipe(map(countries => countries.find(x => x.isoAlpha === this.user.cc)))
        .subscribe(country => {
          this.isMexicoCountry = (country.countryId === this.ID_COUNTRY_MEXICO) ? true : false;
          this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'countryContactPhone').setValue(country.countryId);
          this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'countryHomeAddress').setValue(country.countryId);
          this.getCitiesContactPhoneByCountryId(country.countryId);
          this.configHomeAddressByCountryId(country.countryId);
        });
    } else {
      this.getCitiesContactPhoneByCountryId(this.getControl(this.configStep.sections
        .find(s => s.id === 2).name, 'countryContactPhone').value);
      this.getAreaCodesContactPhoneByCityId(this.getControl(this.configStep.sections
        .find(s => s.id === 2).name, 'cityContactPhone').value);
      this.configHomeAddressByCountryId(this.getControl(this.configStep.sections
        .find(s => s.id === 3).name, 'countryHomeAddress').value);
    }
  }


  isFormValid() {
    return this.wizard.enrollmentForm.get(this.configStep.type).valid;
  }

  getControl(section: string, field: string) {
    return <FormControl>this.wizard.enrollmentForm.get(this.configStep.type).get(section).get(field);
  }

  getValidatorValue(sectionName: string, controlName: string, validator: string) {
    const section: Section = this.configStep.sections.find(s => s.name === sectionName);
    const value = this.policyEnrollmentWizardService.getValidatorValue(section, controlName, validator);
    return value;
  }

  getValidatorMessage(sectionName: string, controlName: string, validator: string) {
    const section: Section = this.configStep.sections.find(s => s.name === sectionName);
    const message = this.policyEnrollmentWizardService.getMessageValidator(section, controlName, validator);
    return message;
  }

  handleCountryChangeContactPhone(countrySelected: Country) {
    this.getCitiesContactPhoneByCountryId(countrySelected.countryId);
  }

  handleCityChangeContactPhone(citySelected: City) {
    this.getAreaCodesContactPhoneByCityId(citySelected.cityId);
  }

  getCitiesContactPhoneByCountryId(countryId: number) {
    if (countryId) {
      this.citiesContactPhone$ = this.commonService.getCitiesByCountry(countryId);
    }
  }

  getAreaCodesContactPhoneByCityId(cityId: number) {
    if (cityId) {
      this.areaCodes$ = this.commonService.getAreaCodesByCity(cityId);
    }
  }

  handleCountryChangeHomeAddress(countrySelected: Country) {
    this.clearFields();
    this.configHomeAddressByCountryId(countrySelected.countryId);

  }

  configHomeAddressByCountryId(countryId: number) {
    this.citiesHomeAddress$ = this.commonService.getCitiesByCountry(countryId);
    if (countryId !== this.ID_COUNTRY_MEXICO) {
      this.isMexicoCountry = false;
      this.fieldsToEnableDisable.forEach(field => {
        if (field !== 'cityHomeAddress') {
          this.getControl(this.configStep.sections.find(s => s.id === 3).name, field ).disable();
        }

        if (field === 'state') {
          this.getControl(this.configStep.sections.find(s => s.id === 3).name, field ).enable();
        }

        if (field === 'cityHomeAddress') {
          this.getControl(this.configStep.sections.find(s => s.id === 3).name, field ).enable();
        }
      });
    } else {
      this.isMexicoCountry = true;
      this.fieldsToEnableDisable.forEach(field => {
        if (field !== 'mayoralMunicipality' && field !== 'state' && field !== 'cityHomeAddress') {
          this.getControl(this.configStep.sections.find(s => s.id === 3).name, field ).enable();
        } else {
          this.getControl(this.configStep.sections.find(s => s.id === 3).name, field ).disable();
        }
      });
    }
  }

  next() {
    this.wasValidateCss = true;
    if (this.isFormValid() && this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'question').value === 'true') {
      this.createPolicyApplication();
    }  else if (!this.notQuestionAnswer()) {
      this.showMsgNoQuestionAnswer = !this.notQuestionAnswer();
    } else if (this.isFormValid() && this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'question').value === 'false') {
      this.createPolicyApplication();
    } else {
      this.showMsgValidation = true;
    }
  }

  notQuestionAnswer() {
    if (this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'question').value === '') {
      return false;
    } else {
      return true;
    }
  }

  createPolicyApplication() {
    this.saveCheckpoint();
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

  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  nextPage() {
    this.router.navigate([this.configStep.sections.find(s => s.id === 1).nextStep]);
  }

  checkIfHasError(error: { error: any; }) {
    return (error.error);
  }

  back() {
    this.router.navigate([this.configStep.sections.find(x => x.id === 1).previousStep]);
  }

  handleCheck(checked: string) {
    this.showMsgNoQuestionAnswer = false;
    this.wasValidateCss = false;
    if (!this.isEdit) { // If not Edition
      if (checked === 'true') {
        this.showMsgValidation = false;
        this.enableAllControls();
        this.getCountries();
      } else {
        this.disableAllControls();
      }
    } else { // If an Edition
      if (checked === 'true') {
        this.showMsgValidation = false;
        this.addingBeneficiary = true;
        this.setUpFormEdit();
      } else {
        this.disableAllControls();
      }
    }
}

  enableAllControls(): void {
    this.addingBeneficiary = true;
    this.configStep.sections.forEach(s => {
      s.controls.forEach(c => {
        if (c.key !== 'question') {
          this.getControl(s.name, c.key).enable();
        }
      });
    });
  }

  disableAllControls(): void {
    this.addingBeneficiary = false;
    this.configStep.sections.forEach(s => {
      s.controls.forEach(c => {
        if (c.key !== 'question') {
          this.getControl(s.name, c.key).disable();
        }
      });
    });
  }

  searchZipCodeValue(zipCodeValue: string) {
    this.getColoniesByZipCode(zipCodeValue);
  }

  searchZipCode(zipCodeControlName: string) {
    this.searchZipCodeValue(this.getControl(this.configStep.sections.find(s => s.id === 3).name, zipCodeControlName).value);
  }

  getColoniesByZipCode(zipCodeValue: string) {
    this.colonies$ = this.commonService.getColoniesByZipCode(zipCodeValue);
    this.subscriptionColonies = this.colonies$.subscribe(
      result => {
        this.getMunicipalitiesByZipCode(zipCodeValue);
      },
      error => {
        if (error.status === 404) {
          this.showMessageZipNotValid();
          this.clearFields();
        }
      }
    );
  }


  getMunicipalitiesByZipCode(zipCodeValue: string) {
    this.municipalities$ = this.commonService.getMunicipalitiesByZipCode(zipCodeValue);
    forkJoin(this.municipalities$).subscribe(async response => {
      const municipality = (response[0])[0];
      this.validMunicipality(municipality);
    });
  }

  private validMunicipality(municipality: MunicipalityDto) {
    if (municipality.cityId === undefined || municipality.cityId === 0 || municipality.cityId === null
      || municipality.stateId === undefined || municipality.stateId === 0 || municipality.stateId === null) {
      this.showMessageZipNotValid();
      this.clearFields();
    } else {
      if (municipality.countryId !== this.ID_COUNTRY_MEXICO) {
        this.showMessageZipNotMexico();
        this.clearFields();
      } else {
        this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'state').setValue(municipality.stateName);
        this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'mayoralMunicipality')
          .setValue(municipality.municipalityName);
        this.getLocalityByState(municipality.stateId);
      }
    }
  }
  getLocalityByState(stateId: number) {
    this.localities$ = this.commonService.getLocalitiesByStateId(stateId);
  }


  showMessageZipNotValid() {
    const messageS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE');
    const tittleS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_TITLE');

    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  showMessageZipNotMexico() {
    const messageS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_NOT_MEXICO');
    const tittleS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_TITLE');
    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  clearFields() {
    this.localities$ = null;
    this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'firstName').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'secondSurname').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'secondName').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'surname').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'dob').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'typeOfDocument').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 1).name, 'numberOfDocument').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'phoneNumber').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'cellPhoneNumber').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 2).name, 'cityContactPhone').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'zipCode').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'state').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'mayoralMunicipality').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'colony').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'state').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'locality').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'colony').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'locality').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'insideNumber').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'outsideNumber').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'streeAvenue').setValue('');
    this.getControl(this.configStep.sections.find(s => s.id === 3).name, 'cityHomeAddress').setValue('');
  }

  getField(fieldId) {
    return this.currentSection.controls.find(x => x.key === fieldId);
  }

      /**
   * Determines whether control visible is
   * @param controlName
   * @returns true if control visible
   */
  isControlVisible(controlName: string, sectionId: number): boolean {
    return this.policyEnrollmentWizardService.isControlVisible(this.currentStep, sectionId, controlName);
  }

}
