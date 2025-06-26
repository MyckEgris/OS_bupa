import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, forkJoin } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { FormControl, FormGroup } from '@angular/forms';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { MunicipalityDto } from 'src/app/shared/services/common/entities/municipality.dto';
import { Router } from '@angular/router';
import { State } from 'src/app/shared/services/common/entities/state';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentTransformMembersService } from '../../../../policy-enrollment-wizard/mappers-services/policy-enrollment-transform-members.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';

@Component({
  selector: 'app-petitioner-address-information',
  templateUrl: './petitioner-address-information.component.html'
})
export class PetitionerAddressInformationComponent implements OnInit, OnDestroy {

  /**
  * User Authenticated Object
  */
  public user: UserInformationModel;

  private subscription: Subscription;

  private subscriptionColonies: Subscription;

  private subscriptionContries: Subscription;

  /**
   * PolicyEnrollmentWizard Object
   */
  public wizard: PolicyEnrollmentWizard;

  /***
   * Id of the moral petitioner section in JSON
   */
  private POLICYAPP_INFO_ADDRESS_PETITIONER = 4;

  private ID_COUNTRY_MEXICO = 13;

  public isBupaMexico = false;

  public currentSection: Section;

  private configStep: ViewTemplateStep;

  public currentStep = 10;

  public showValidations: boolean;

  get formEnrollmentPetitioner() {
    return this.wizard.enrollmentForm.get('policyApplicationPetitioner') as FormGroup;
  }

  get formEnrollmentAddressPetitioner() {
    return this.formEnrollmentPetitioner.get('policyAppAddressPetitioner') as FormGroup;
  }

  constructor(
    private translate: TranslateService,
    private router: Router,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private policyEnrollmentTransform: PolicyEnrollmentTransformMembersService,
    private policyApplicationService: PolicyApplicationService,
    private notification: NotificationService,
    private config: NgSelectConfig,
  ) { this.config.notFoundText = ''; }

  ngOnInit() {
    this.setTopWindows();
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
        this.currentSection = this.configStep.sections.find(s => s.id === this.POLICYAPP_INFO_ADDRESS_PETITIONER);
        this.setUpForm();
        this.assignGUID();
      }, this.user, null, this.currentStep, 2);
    this.setBupaMexico();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subscriptionColonies) { this.subscriptionColonies.unsubscribe(); }
    if (this.subscriptionContries) { this.subscriptionContries.unsubscribe(); }
  }

  /**
   * Bring focus to the beginning of the screen
   */
  private setTopWindows() {
    window.scroll(0, 0);
  }

  private setUpForm() {
    this.formEnrollmentPetitioner.addControl(this.currentSection.name,
      this.policyEnrollmentWizardService.buildSection(this.currentStep, this.POLICYAPP_INFO_ADDRESS_PETITIONER));
  }

  private assignGUID() {
    if (!this.formEnrollmentAddressPetitioner.get('guidAddress')) {
      this.commonService.newGuidNuevo().subscribe(
        a => this.formEnrollmentAddressPetitioner.addControl('guidAddress', new FormControl(a))
      );
    }
  }

  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  getControl(field: string) {
    return this.formEnrollmentAddressPetitioner.get(field) as FormControl;
  }

  setBupaMexico() {
    if (Number(this.user.bupa_insurance) === InsuranceBusiness.BUPA_MEXICO) {
      this.getCountries();
      this.isBupaMexico = true;
    } else {
      this.isBupaMexico = false;
    }
  }

  searchZipCode() {
    this.getColoniesByZipCode();
  }

  private getCountries() {
    this.wizard.countries$ = this.commonService.getCountries();
    forkJoin(this.wizard.countries$).subscribe(async response => {
      this.getControl('country').setValue((response[0]).find(x => x.isoAlpha === this.user.cc).countryId);
    });
  }

  private getColoniesByZipCode() {
    this.wizard.coloniesHome$ = this.commonService.getColoniesByZipCode(this.getControl('zipCode').value);
    this.subscriptionColonies = this.wizard.coloniesHome$.subscribe(
      result => this.getMunicipalityByZipCode(this.getControl('zipCode').value),
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
        this.getControl('state').setValue(municipality.stateName);
        this.getControl('mayoraltyMunicipality').setValue(municipality.municipalityName);
        this.getControl('city').setValue(municipality.cityId);
        this.getLocalityByState(municipality.stateId);
      }
    }
  }

  private getLocalityByState(stateId: number) {
    this.wizard.localityHome$ = this.commonService.getLocalitiesByStateId(stateId);
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
    this.getControl('zipCode').setValue('');
    this.getControl('state').setValue('');
    this.getControl('mayoraltyMunicipality').setValue('');
    if (this.getControl('colony')) { this.getControl('colony').setValue(''); }
    this.getControl('locality').setValue('');
    this.wizard.localityHome$ = null;
  }

  next() {
    this.showValidations = true;
    if (this.formEnrollmentAddressPetitioner.valid) {
      this.showValidations = false;
      this.savePetitioner();
    } else {
      this.showValidations = true;
    }
  }

  private savePetitioner() {
    this.policyEnrollmentWizardService.buildPolicyApplication();
    this.policyApplicationService.createPolicyEnrollment(this.wizard.policyApplicationModel)
      .subscribe(
        p => {
          this.policyEnrollmentTransform.deletedMembersGUID = [];
          this.success(p);
        }, async e => {
          if (e.status === 500) {
            console.error(e);
          } else {
            if (this.checkIfHasError(e)) {
              const title = await this.translate.get('POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE').toPromise();
              const message = await this.translate.get('POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE').toPromise();
              const ok = await this.translate.get('POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK').toPromise();
              const failed = await this.notification.showDialog(title, message, false, ok);
              if (failed) {
                return;
              }
            }
          }
        },
      );
  }

  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  private nextPage() {
    this.router.navigate([
      this.currentSection.nextStep.replace('{stepVariationNumber}',
      this.wizard.policyApplicationModel.petitionerTypeId.toString())]);
  }

  private checkIfHasError(error) {
    return (error.error);
  }

  back() {
    this.showValidations = false;
    this.router.navigate([
      this.currentSection.previousStep.replace('{stepVariationNumber}',
        this.wizard.policyApplicationModel.petitionerTypeId.toString())]);
  }

}
