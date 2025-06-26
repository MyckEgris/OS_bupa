import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { AuthService } from 'src/app/security/services/auth/auth.service';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Agreement } from 'src/app/shared/services/policy-application/entities/agreement';
import { AgreementDefinition } from 'src/app/shared/services/common/entities/agreement-def-enrollment-response';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
// tslint:disable-next-line: max-line-length
import { TransformConsentsService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/mappers-services-pan/transform-consents.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
@Component({
  selector: 'app-con-section2',
  templateUrl: './con-section2.component.html'
})
export class ConSection2Component implements OnInit, OnDestroy {
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
   *Const to Identify the current step name
   */
  SECTION_FORMGROUP_NAME = 'agreements';

  /**
     *  Const to Identify the current step name
     */
  STEP_NAME = 'policyApplicationConsents';

  /**
    * Const to Identify the current section name
    */
  SECTION_NAME = 'policyAppConsentsQuestions2';

  /**
   * Const to Identify the Control  disclaimerCheck
   */
  SHARE_MEDICAL_INFORMATION_1 = 'shareMedicalInformation1';

  /**
   * Const to Identify the Control  disclaimerCheck
   */
  SHARE_MEDICAL_INFORMATION_2 = 'shareMedicalInformation2';

  /**
   * Flag for show form validations.
   */
  showErrorMsg = false;

  /**
   * PolicyEnrollment Wizard Object
   */
  wizard: PolicyEnrollmentWizard;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  public currentSection: Section;

  /**
   * User  of policy enrollment step2 component
   */
  public user: UserInformationModel;

  /**
   *Const to Identify the current step number
   */
  public currentStep = 8;

  /***
   * Wizard Subscription
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  private configStep: ViewTemplateStep;
  private agreementDefinition: Array<AgreementDefinition>;
  constructor(private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private translate: TranslateService,
    private notification: NotificationService,
    private policyApplicationService: PolicyApplicationService,
    private transformConsentsService: TransformConsentsService) { }

    /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setupForm();
      }, this.user, null, this.currentStep, 2);

  }

    /**
   * Sets the Step FormGroup.
   */
  private setupForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 2);
    this.wizard.agreementDefintion$.subscribe(agreements => {
      this.agreementDefinition = agreements;
      if (localStorage.getItem('mode') === 'Edit') {
        this.setValuesFormEdit(agreements);
      }
    });
  }

  setValuesFormEdit(agreements: Array<AgreementDefinition>) {
    const shareMedicalInfo1 = agreements
      .find(i => i.agreementName.toLowerCase() === this.SHARE_MEDICAL_INFORMATION_1.toLowerCase());
    const shareMedicalInfo2 = agreements
      .find(i => i.agreementName.toLowerCase() === this.SHARE_MEDICAL_INFORMATION_2.toLowerCase());
    if (this.wizard.policyApplicationModel.agreements.findIndex(a1 => a1.agreementId === shareMedicalInfo1.agreementId) !== -1
      && this.wizard.policyApplicationModel.agreements.findIndex(a1 => a1.agreementId === shareMedicalInfo2.agreementId) !== -1) {
      this.getControl(this.SHARE_MEDICAL_INFORMATION_1).setValue(
        this.wizard.policyApplicationModel.agreements
        .find(a => a.agreementId === shareMedicalInfo1.agreementId)
        .answer);

      this.getControl(this.SHARE_MEDICAL_INFORMATION_2).setValue(
        this.wizard.policyApplicationModel.agreements
        .find(a => a.agreementId === shareMedicalInfo2.agreementId)
        .answer);
    }
  }

    /**
   * Get nested form group.
   */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name) as FormGroup;
  }

  /**
    * Get nested form controls.
    */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name).get(field) as FormControl;
  }

  /**
   * Get nested validator
   */
  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  /**
  * Get Nested Message
  */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

    /**
   * Allow to return.
   */
  back(): void {
    this.router.navigate([this.currentSection.previousStep]);
  }

    /**
   * Creates policy application (Only if the user selected No)
   */
  async createPolicyApplication() {
    this.saveCheckpoint();
    await this.factoryAgreement();
      this.policyApplicationService.createPolicyEnrollment(this.wizard.policyApplicationModel).subscribe(p => {
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

  async factoryAgreement() {
    const shareMedicalInfo1Id = this.agreementDefinition
      .find(a => a.agreementName.toLowerCase() === this.SHARE_MEDICAL_INFORMATION_1.toLowerCase())
      .agreementId;
    const shareMedicalInfo2Id = this.agreementDefinition
      .find(a => a.agreementName.toLowerCase() === this.SHARE_MEDICAL_INFORMATION_2.toLowerCase())
      .agreementId;
    await this.createOrUpdateAgreement(shareMedicalInfo1Id, this.getFormGroup().get(this.SHARE_MEDICAL_INFORMATION_1).value);
    await this.createOrUpdateAgreement(shareMedicalInfo2Id, this.getFormGroup().get(this.SHARE_MEDICAL_INFORMATION_2).value);
  }

  async createOrUpdateAgreement(shareMedicalInfoId: number, answer: boolean) {
    if (this.wizard.policyApplicationModel.agreements.findIndex(a => a.agreementId === shareMedicalInfoId) === -1) {
      const agreement =  await this.transformConsentsService.createNewAgreement(
        answer,
        shareMedicalInfoId,
        this.wizard.policyApplicationModel.applicationGuid);
      this.wizard.policyApplicationModel.agreements.push(agreement);
    } else {
      this.wizard.policyApplicationModel.agreements
        .find(ai => ai.agreementId === shareMedicalInfoId)
        .answer = answer;
    }
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
   * Route to next page.
   */
  next(): void {
    if (!this.isAnswerValid()) {
      this.showErrorMsg = true;
    } else {
      this.showErrorMsg = false;
      this.createPolicyApplication();
    }
  }

    /**
   * Verify correct Responses that are necesaries
   * @private
   * @returns {boolean}
   */
  private isAnswerValid(): boolean {
    return (this.getControl(this.SHARE_MEDICAL_INFORMATION_1).value
      && this.getControl(this.SHARE_MEDICAL_INFORMATION_2).value);
  }

}
