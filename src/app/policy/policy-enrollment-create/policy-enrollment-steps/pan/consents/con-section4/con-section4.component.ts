import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { FormGroup, FormControl } from '@angular/forms';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { Agreement } from 'src/app/shared/services/policy-application/entities/agreement';
import * as moment from 'moment';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { AgreementDefinition } from 'src/app/shared/services/common/entities/agreement-def-enrollment-response';
// tslint:disable-next-line: max-line-length
import { TransformConsentsService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/mappers-services-pan/transform-consents.service';
@Component({
  selector: 'app-con-section4',
  templateUrl: './con-section4.component.html'
})
export class ConSection4Component implements OnInit, OnDestroy {

  INTERVIEW_TYPE = [
    {
      id: 1,
      description: 'Asegurado titular'
    },
    {
      id: 2,
      description: 'Contratante'
    },
    {
      id: 3,
      description: 'Asegurado titular y Contratante'
    }
  ];
  /**
   *  Const to Identify the current step name
   */
  STEP_NAME = 'policyApplicationConsents';

  /**
     * Const to Identify the current section name
     */
  SECTION_NAME = 'policyAppConsentsQuestions4';

  /**
   * Const to Identify the Control  disclaimerCheckLawfulOfResources
   */
  RECOGNITION_AND_AUTHORIZATION_FOR_AGENT = 'recognitionAndAuthorizationForAgent';

  /**
   * Const to Identify the Control  promoterKey
   */
  PROMOTER_KEY = 'promoterKey';

  /**
   * Const to Identify the Control  emailConsents
   */
  EMAIL_CONSENTS = 'emailConsents';

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

  /***
   * Const to Identify the saving error title message
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';

  /***
   * Const to Identify the saving error message
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';

  /***
   * Const to Identify the saving error button message
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  private agreementDefinition: Array<AgreementDefinition>;
  minDateCurrentVisitDate: Date = new Date();
  constructor(private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService,
    private transformConsentsService: TransformConsentsService) { }

      /**
   * Executed when the component is destroyed
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setupForm();
      }, this.user, null, this.currentStep, 4);
  }

  /**
   * Sets the Step FormGroup.
   */
  private setupForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 4);
    this.setValuesPromoterValues();
    this.wizard.agreementDefintion$.subscribe(agreements => {
      this.agreementDefinition = agreements;
      if (localStorage.getItem('mode') === 'Edit') {
        const agreement = agreements
          .find(i => i.agreementName.toLowerCase() === this.RECOGNITION_AND_AUTHORIZATION_FOR_AGENT.toLowerCase());
        if (this.wizard.policyApplicationModel.agreements.find(ag => ag.agreementId === agreement.agreementId)) {
          this.getControl(this.RECOGNITION_AND_AUTHORIZATION_FOR_AGENT).setValue(this.wizard.policyApplicationModel.agreements
            .find(a => a.agreementId === agreement.agreementId).answer);
        }
      }
    });

    this.displayPersonalInterview();
    this.previousVisitDateValueChanges();
  }

  private setValuesPromoterValues() {
    if (this.wizard.policyApplicationModel.promoterKey) {
      this.getControl('promoterKey').setValue(this.wizard.policyApplicationModel.promoterKey);
    } else {
      this.getControl('promoterKey').setValue(this.user.user_key);
    }
    if (this.wizard.policyApplicationModel.promoterEmail) {
      this.getControl('emailConsents').setValue(this.wizard.policyApplicationModel.promoterEmail);
    } else {
      this.getControl('emailConsents').setValue(this.user.sub);
    }
  }

  previousVisitDateValueChanges(): void {
    this.getControl('previousVisitDate').valueChanges.subscribe(val => {
      this.minDateCurrentVisitDate = val;
    });
  }

  private displayPersonalInterview(): void {
    if (this.wizard.policyApplicationModel.personalInterview) {
      this.getControl('interviewTypeId').setValue(this.wizard.policyApplicationModel.personalInterview.interviewTypeId);
      this.getControl('previousVisitDate').setValue(
        moment(this.wizard.policyApplicationModel.personalInterview.previousVisitDate).toDate());
      this.getControl('currentVisitDate').setValue(moment(this.wizard.policyApplicationModel.personalInterview.currentVisitDate).toDate());
      this.getControl('firstName').setValue(this.wizard.policyApplicationModel.personalInterview.firstName);
      this.getControl('middleName').setValue(this.wizard.policyApplicationModel.personalInterview.middleName);
      this.getControl('paternalLastName').setValue(this.wizard.policyApplicationModel.personalInterview.paternalLastName);
      this.getControl('maternalLastName').setValue(this.wizard.policyApplicationModel.personalInterview.maternalLastName);
    } else {
      if (this.user.given_name) {
        this.getControl('firstName').setValue(this.user.given_name);
      }
      if (this.user.family_name) {
        const lastName = this.user.family_name.split(' ');
        this.getControl('paternalLastName').setValue((lastName[0]));
        if (lastName.length > 1) {
          this.getControl('maternalLastName').setValue(lastName[1]);
        }
      }

    }
  }

    /**
  * Get nested form group.
  */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.STEP_NAME).get(this.SECTION_NAME) as FormGroup;
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
   * @param controlName
   * @param validator
   */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  /**
   * Get Nested correct Values from disclaimers
   */
  isDisclaimerValid(): boolean {
    return this.getControl(this.RECOGNITION_AND_AUTHORIZATION_FOR_AGENT).value;
  }

    /**
   * Route to next page.
   */
  next() {
    if (this.getFormGroup().valid && this.isDisclaimerValid()) {
      this.showErrorMsg = false;
      this.createPolicyApplication();
    } else {
      this.showErrorMsg = true;
    }
  }

    /**
   * Save the form information in the wizard service and show sucess message.
   */
  async createPolicyApplication() {
    this.saveCheckpoint();
    await this.createOrUpdateAgreement();
    await this.policyEnrollmentWizardService.buildPolicyApplication();
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

  async createOrUpdateAgreement() {
    const agreementDef = this.agreementDefinition
      .find(a => a.agreementName.toLowerCase() === this.RECOGNITION_AND_AUTHORIZATION_FOR_AGENT.toLowerCase());
    if (this.wizard.policyApplicationModel.agreements.find(a => a.agreementId === agreementDef.agreementId)) {
      this.wizard.policyApplicationModel.agreements
        .find(ai => ai.agreementId === agreementDef.agreementId).answer = this.getFormGroup()
        .get(this.RECOGNITION_AND_AUTHORIZATION_FOR_AGENT).value;
    } else {
      const agreement =  await this.transformConsentsService.createNewAgreement(
        this.getFormGroup().get(this.RECOGNITION_AND_AUTHORIZATION_FOR_AGENT).value,
        this.agreementDefinition
        .find(a => a.agreementName.toLowerCase() === this.RECOGNITION_AND_AUTHORIZATION_FOR_AGENT.toLowerCase()).agreementId,
        this.wizard.policyApplicationModel.applicationGuid);
      this.wizard.policyApplicationModel.agreements.push(agreement);
    }
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

  /**
   * Check for request errors.
   */
  checkIfHasError(error) {
    return (error.error);
  }

  /**
   * Store the succes request id in wizard and continue to next page.
   */
  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

    /**
   * Route to next page.
   */
  nextPage() {
    if (this.wizard.policyApplicationModel.petitioner) {
      if (this.wizard.policyApplicationModel.petitioner.petitionerTypeId === PetitionerType.INDIVIDUAL
        || this.wizard.policyApplicationModel.petitioner.petitionerTypeId === PetitionerType.COMPANY) {
        this.router.navigate([`${this.currentSection.nextStep}/${this.wizard.policyApplicationModel.petitioner.petitionerTypeId}`]);
      } else {
        this.router.navigate([this.currentSection.nextStep]);
      }
    } else {
      this.router.navigate([this.currentSection.nextStep]);
    }
  }

  /**
     * Allow to return.
     */
  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

}
