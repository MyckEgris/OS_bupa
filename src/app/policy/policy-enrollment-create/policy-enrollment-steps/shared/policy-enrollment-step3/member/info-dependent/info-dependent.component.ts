import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Options } from 'ng5-slider';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { concat, distinctUntilChanged } from 'rxjs/operators';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import * as moment from 'moment';
import { TypesIdentificationData } from '../../../constants-data/identification-data';
import { InfoIdentifications } from 'src/app/shared/services/policy-application/entities/info-identifications';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { Identification } from 'src/app/shared/services/common/entities/Identification';
import { TranslateService } from '@ngx-translate/core';
// tslint:disable-next-line: max-line-length
import { ManageIdentificationTypesService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/manage-identification-types.service';
import { MeasurementConversionService } from 'src/app/shared/services/policy-application/helpers/measurement-conversion.service';
@Component({
  selector: 'app-info-dependent',
  templateUrl: './info-dependent.component.html'
})
export class InfoDependentComponent implements OnInit, OnDestroy {

  private STEP_NAME = 'policyApplicationDependents';
  private SECTION_NAME = 'policyAppInfoDependents';
  private CONST_MAN =  2;
  private CONST_WOMEN = 3;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  private subscription: Subscription;

  /**
   * PolicyEnrollmentWizard Object
   */
  public wizard: PolicyEnrollmentWizard;

  public showMessageMedical = false;
  public invalidAdultAge = false;
  public invalidAgeRangePolicy = false;
  public invalidAgeRangePolicyDependents = false;

  public dateValue: Date;

  /***
   *  Indicates the number of dependent added
   */
  @Input() numberIndexMember: number;

  @Input() currentStep: number;

  @Input() showValidations: boolean;

  @Output() showContactAddressInfo = new EventEmitter<boolean>();

  @Output() fullNameDependent = new EventEmitter<string>();

  get formEnrollmentDependents() {
    if (this.numberIndexMember >= 0) {
      return (this.wizard.enrollmentForm
        .get(this.STEP_NAME)
        .get('items') as FormArray)
        .at(this.numberIndexMember) as FormGroup;
    } else {
      return null;
    }
  }


  public currentSection: Section;

  private configStep: ViewTemplateStep;

  public today = moment(new Date()).toDate();

  public identificationsTypes: Array<Identification> = [];

  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private manageIdentificationTypesService: ManageIdentificationTypesService,
    private measurementConversionService: MeasurementConversionService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      wizard => {
        this.wizard = wizard;
        this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
        this.currentSection = this.configStep.sections.filter(s => s.id === 1)[0];
       }, this.user, null, this.currentStep, 1);
    this.listRelationType();
    this.subscribeName();
    this.returnFullName();
    this.getIdentifications();
    this.setDefaultValuesCountries();
    if (localStorage.getItem('mode') === 'Edit') {
      const guidMember: string = !!this.formEnrollmentDependents.get('GUID') ?  this.formEnrollmentDependents.get('GUID').value : null;
      // If member has an address so is different from owner
      if (guidMember) {
        const address: Address = this.wizard.policyApplicationModel.addresses.find(guid => guid.contactGuid === guidMember);
        if (address) {
          this.formEnrollmentDependents.get(this.SECTION_NAME).get('diffInfoContactAddress').setValue(true);
          this.handleInfoContactAddress(true);
        }
      }
    }
  }

  async getIdentifications() {
    this.identificationsTypes = await this.manageIdentificationTypesService
      .getAllIdentifications(+this.user.bupa_insurance);
  }

  /**
   * Sets country default
   */
  private setCountryDefault(countryId: number) {
    const value = this.formEnrollmentDependents.get(this.SECTION_NAME).get('countryResidence').value;
    if (!value) {
      this.formEnrollmentDependents
      .get(this.SECTION_NAME)
      .get('countryResidence')
      .setValue(countryId);
    }
  }

  /**
   * Sets default country dob
   */
  private setDefaultCountryDOB(countryId: number) {
    const value = this.formEnrollmentDependents.get(this.SECTION_NAME).get('countryDOB').value;
    if (!value) {
      this.formEnrollmentDependents
        .get(this.SECTION_NAME)
        .get('countryDOB')
        .setValue(countryId);
    }
  }

  /**
   * Sets defaut nationality
   */
  private setDefautNationality(countryId: number) {
    const value = this.formEnrollmentDependents.get(this.SECTION_NAME).get('nationality').value;
    if (!value) {
      this.formEnrollmentDependents
      .get(this.SECTION_NAME)
      .get('nationality')
      .setValue(countryId);
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeName() {
    this.getControl('firstName').valueChanges.subscribe( val => {  this.returnFullName(); });
    this.getControl('middleName').valueChanges.subscribe( val => {  this.returnFullName(); });
    this.getControl('fatherLastName').valueChanges.subscribe( val => {  this.returnFullName(); });
    this.getControl('motherLastName').valueChanges.subscribe( val => {  this.returnFullName(); });
    this.getControl('dob').valueChanges.pipe(distinctUntilChanged()).subscribe( val => {  this.setValidations(); });
    this.getControl('relationCustomer').valueChanges.subscribe( val => this.validateDOB() );
  }

  validateDOB() {
    this.getControl('dob').clearValidators();
    if (this.getControl('relationCustomer').value) {
      if (this.getControl('relationCustomer').value === RelationType.DEPENDENT) {
        this.getControl('dob').setValidators([Validators.required, CustomValidator.ageRangePolicyDependents]);
        this.getControl('dob').updateValueAndValidity();
      } else if (this.getControl('relationCustomer').value === RelationType.SPOUSE) {
        this.getControl('dob').setValidators([Validators.required, CustomValidator.isAnAdultAge,
                      CustomValidator.ageRangePolicy]);
        this.getControl('dob').updateValueAndValidity();
      }
    }
  }

  setValidations() {
    const message3 = CustomValidator.ageRangeMedicalPolicy(this.getControl('dob'));
    if (message3) {
      this.showMessageMedical = true;
    } else {
      this.showMessageMedical = false;
    }
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
      .get(this.SECTION_NAME)
      .get(field) as FormControl;
  }

  listRelationType() {
    this.wizard.relationCustomer =
      [
        {
          id: RelationType.SPOUSE,
          value: 'SPOUSE'
        },
        {
          id: RelationType.DEPENDENT,
          value: 'DEPENDENT'
        }
      ];
  }

  isFieldValueGreaterThanCero(field: string) {
    if (this.getControl(field).value > 0) {
      return true;
    } else {
      return false;
    }
  }

  eventCheckInfoContacAddress(e) {
    this.handleInfoContactAddress(e.target.checked);
  }

  handleInfoContactAddress(isChecked: boolean) {
    const sectionNameAddress = this.configStep.sections.find(s => s.id === 3).name;
    const sectionNameContact = this.configStep.sections.find(s => s.id === 2).name;
    if (isChecked) {
      this.formEnrollmentDependents
        .addControl(sectionNameAddress, this.policyEnrollmentWizardService.buildSection(this.currentStep, 3));
      this.formEnrollmentDependents
        .addControl(sectionNameContact, this.policyEnrollmentWizardService.buildSection(this.currentStep, 2));
    } else {
      this.formEnrollmentDependents.removeControl(sectionNameAddress);
      this.formEnrollmentDependents.removeControl(sectionNameContact);
    }
    this.showContactAddressInfo.emit(isChecked);
  }

  returnFullName() {
    const fullName = String().concat(this.getControl('firstName').value, ' ',
                        this.getControl('middleName').value, ' ',
                        this.getControl('fatherLastName').value, ' ',
                        this.getControl('motherLastName').value);
    this.fullNameDependent.emit(fullName);
  }

  getField(fieldId) {
    return this.currentSection.controls.find(x => x.key === fieldId);
  }

    /**
   * Converts from kg to pound (3 kilos-metros)
   * @param formControlName
   */
  convertFromKgToPound() {
    const weightInPound = this.measurementConversionService.convertKgToPound(this.getControl('weight').value);
    this.getControl('weight').setValue(weightInPound.toFixed(2));
  }
  /**
   * Converts from pount to kg (4 libras-metros)
   * @param formControlName
   */
  convertFromPoundToKg() {
    const weightInKg = this.measurementConversionService.convertPoundToKg(this.getControl('weight').value);
    this.getControl('weight').setValue(weightInKg.toFixed(2));
  }

    /**
   * Sets default values countries
   * @param formControlName
   */
  setDefaultValuesCountries() {
    this.wizard.countries$.subscribe(c => {
      if (c.find(i => i.isoAlpha === this.user.cc)) {
        this.setCountryDefault(c.find(i => i.isoAlpha === this.user.cc).countryId);
        this.setDefaultCountryDOB(c.find(i => i.isoAlpha === this.user.cc).countryId);
        this.setDefautNationality(c.find(i => i.isoAlpha === this.user.cc).countryId);
      }
    });
  }

}
