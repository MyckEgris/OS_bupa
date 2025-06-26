import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentTransformPetitionerService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/mappers-services/policy-enrollment-transform-petitioner.service';

@Component({
  selector: 'app-main-officers-advisors',
  templateUrl: './main-officers-advisors.component.html'
})
export class MainOfficersAdvisorsComponent implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /***
   * Subscription wizard service
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollmentWizard Object
   */
  public wizard: PolicyEnrollmentWizard;

  private configStep: ViewTemplateStep;

  public currentStep = 10;

  private currentSection: Section;

  @Input() showValidations: boolean;

  /***
   * Id of the Main Officers Advisors petitioner section in JSON
   */
  private POLICYAPP_OFFICER_ADVISORS_INFO_PETITIONER = 7;

  get formEnrollmentPetitioner() {
    return this.wizard.enrollmentForm.get('policyApplicationPetitioner') as FormGroup;
  }

  getItems(): FormArray {
    return this.formEnrollmentPetitioner.get('itemsOfficerAdvisors') as FormArray;
  }

  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private transformPetitioner: PolicyEnrollmentTransformPetitionerService
  ) { }

  ngOnInit() {
    this.setTopWindows();
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
        this.currentSection = this.configStep.sections.find(s => s.id === this.POLICYAPP_OFFICER_ADVISORS_INFO_PETITIONER);
      }, this.user, null, this.currentStep, null);
      if (this.getItems().length === 0) {
        this.addItem();
      }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private assignGUID(indexNumber: number) {
    if (!(this.getItems().at(indexNumber) as FormGroup).get('GUID')) {
      this.commonService.newGuidNuevo().subscribe(
        a => (this.getItems().at(indexNumber) as FormGroup).addControl('GUID', new FormControl(a))
      );
    }
  }

  /**
   * Bring focus to the beginning of the screen
   */
  private setTopWindows() {
    window.scroll(0, 0);
  }

  addItem() {
    this.getItems().push(
      this.policyEnrollmentWizardService.buildSection(this.currentStep, this.POLICYAPP_OFFICER_ADVISORS_INFO_PETITIONER)) ;
    this.assignGUID(this.getItems().length - 1);
  }

  /**
   * Get control
   */
  getControl(field: string, index: number) {
    return this.getItems().at(index).get(field) as FormControl;
  }

  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  delete(indexNumber: number) {
    this.transformPetitioner.deletedOfficerSharedholderGUID.push((this.getItems().at(indexNumber) as FormGroup).get('GUID').value);
    (this.getItems() as FormArray).removeAt(indexNumber);
  }

  addOfficerAdvisor() {
    if (this.getItems().length <= 3) {
      this.addItem();
    }
  }

  /**
   * Handle toggle section icon.
   */
  handleToggleIcon() {
    const clas = document.getElementById(`collapseExample`).className;
    const isShow = clas.indexOf('show');
    if (isShow !== -1) {
      return true;
    } else {
      return false;
    }
  }

}
