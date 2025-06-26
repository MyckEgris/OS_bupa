import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';


@Component({
  selector: 'app-policy-enrollment-step1',
  templateUrl: './policy-enrollment-step1.component.html'
})
export class PolicyEnrollmentStep1Component implements OnInit, OnDestroy, AfterViewInit {


  public user: UserInformationModel;
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 1;
  private subscription: Subscription;
  private configStep: ViewTemplateStep;
  public petitionerType: any[];

  /***
   * Const to Identify the nested FormGroup policyApplicationIntroductionStep
   */
  public INTRODUCTION_STEP = 'policyApplicationIntroductionStep';

  /***
   * Const to Identify the nested FormGroup policyApplicationPetitioner
   */
  public PETITIONER_STEP = 'policyApplicationPetitioner';

  /***
   * Const to Identify the nested FormGroup policyApplicationPaperLess
   */
  public PAPERLESS_SECTION = 'policyApplicationPaperLess';

  /***
   * Const to Identify the nested FormGroup policyApplicationWeKnow
   */
  public WEKNOW_SECTION = 'policyApplicationWeKnow';

  /***
   * Const to Identify the nested FormControl policyApplicationPetitionerType
   */
  public PETITIONER_TYPE_CTRL = 'policyApplicationPetitionerType';

  /***
   * Const to Identify the nested FormControl policyApplicationResidentQuestion
   */
  public RESIDENT_QUESTION_CTRL = 'policyApplicationResidentQuestion';

  /***
   * Const to Identify the nested FormControl policyApplicationCurrentlyResideHasResided
   */
  public HAS_RESIDED_QUESTION_CTRL = 'policyApplicationCurrentlyResideHasResided';

  /***
   * Const to Identify the nested FormControl policyApplicationRPaperLessQuestion
   */
  public PAPERLESS_CTRL = 'policyApplicationRPaperLessQuestion';

  /**
   * Constant for has resided message title resource key.
   */
  public HAS_RESIDED_MESSAGE_TITLE = 'POLICY.POLICY_ENROLLMENT.STEP1.SECTION_01.RESIDENT_MSG_TITLE';

  /**
   * Constant for has resided affirmative message message resource key.
   */
  public HAS_RESIDED_MESSAGE_AFFIRMATIVE_MESSAGE = 'POLICY.POLICY_ENROLLMENT.STEP1.SECTION_01.RESIDENT_MSG_YES';

  /**
   * Flag for show form validations.
   */
  public formInvalid: Boolean = false;

  public currentSection: Section;

  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';

  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';

  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';



  /**
   * constructor method
   * @param authService auth service injection
   * @param policyEnrollmentWizardService Policy Enrollment Wizard Service Injection
   * @param router Router Injection
   * @param notification Notification Service Injection
   * @param translate Translate Service Injection
   */
  constructor(
    private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private notification: NotificationService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private policyApplicationService: PolicyApplicationService
  ) { }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      wizard => { this.wizard = wizard; }, this.user, null, this.currentStep, 1);
    this.setUpForm();
    this.setPetitionerType();
    this.valueChanges();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  valueChanges() {
    this.getControl(this.INTRODUCTION_STEP, this.WEKNOW_SECTION, this.RESIDENT_QUESTION_CTRL).valueChanges.subscribe(val => {
      this.validateResidentQuestion(val);
    }
    );
  }

  /**
   * Sets the Step FormGroup.
   */
  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm
      .addControl(this.configStep.type,
        this.policyEnrollmentWizardService.buildStep(this.currentStep)
      );
    this.currentSection = this.configStep.sections.filter(s => s.id === 1)[0];
    this.getFormGroup(this.INTRODUCTION_STEP, this.WEKNOW_SECTION).addControl(this.HAS_RESIDED_QUESTION_CTRL, new FormControl('x', []));
    if (localStorage.getItem('mode') === 'Edit') {
      const member = this.wizard.policyApplicationModel.members.find(id => id.relationTypeId === 2);
      this.getControl(this.INTRODUCTION_STEP, this.WEKNOW_SECTION, this.RESIDENT_QUESTION_CTRL)
      .setValue(member.usCitizenResident.toString());

      this.getControl(this.INTRODUCTION_STEP, this.WEKNOW_SECTION, this.PETITIONER_TYPE_CTRL)
      .setValue(this.wizard.policyApplicationModel.petitionerTypeId.toString());

      this.getControl(this.INTRODUCTION_STEP, this.PAPERLESS_SECTION, this.PAPERLESS_CTRL)
      .setValue(this.wizard.policyApplicationModel.paperless.toString());
    }
  }

  next() {
    this.validateForm();
  }

  setPetitionerType() {

    this.petitionerType = [
      {
        description: 'PolicyHolder',
        value: 1
      },
      {
        description: 'Company',
        value: 2
      },
      {
        description: 'Individual',
        value: 3
      }
    ];

  }

  /**
   * Get nested form controls.
   */
  public getControl(step: string, section: string, field: string): FormControl {
    return this.wizard.enrollmentForm.get(step).get(section).get(field) as FormControl;
  }

  /**
   * Get nested form group.
   */
  public getFormGroup(step: string, section: string): FormGroup {
    return this.wizard.enrollmentForm.get(step).get(section) as FormGroup;
  }

  /**
   * Get nested Step form group.
   */
  public getStepFormGroup(step: string): FormGroup {
    return this.wizard.enrollmentForm.get(step) as FormGroup;
  }

  /**
   * Validate value of resident question.
   */
  validateResidentQuestion(val: any) {
    const value = (val === 'true' ? true : false);
    if (value) {
      localStorage.setItem('enrollmentMaxStep', '0');
    } else {
      const group = this.getFormGroup(this.INTRODUCTION_STEP, this.WEKNOW_SECTION);
      group.removeControl(this.HAS_RESIDED_QUESTION_CTRL);
    }

  }

  public handleResidentYes(event) {
    if (event) {
      const value = (event.target.value === 'true' ? true : false);
      if (value) {
        this.showHasResidedModalMessage(value);
      }
    }
  }

  /**
   * Show resident modal message.
   */
  async showHasResidedModalMessage(hasResided: any) {
    let response;
    let message = '';
    let title = '';
    if (hasResided) {
      this.translate.get(this.HAS_RESIDED_MESSAGE_TITLE).subscribe(
        result => title = result);
      this.translate.get(this.HAS_RESIDED_MESSAGE_AFFIRMATIVE_MESSAGE).subscribe(
        result => message = result);
      response = await this.notification.showDialog(title, message);
      if (response) {
        this.router.navigate(['/']);
      }
    }


  }

  /**
   * Validate form validations.
   */
  validateForm() {
    const isInvalid = this.getStepFormGroup(this.INTRODUCTION_STEP).invalid;
    if (isInvalid) {
      this.formInvalid = true;
    } else {
      const answer = this.getControl(this.INTRODUCTION_STEP, this.WEKNOW_SECTION, this.RESIDENT_QUESTION_CTRL).value;
      const isNo = (answer === 'false') ? true : false;
      if (isNo) {
        this.formInvalid = false;
        localStorage.setItem('enrollmentMaxStep', '1');
        this.handlePetitionerTypeChange();
      }
    }
  }

  handlePetitionerMsgView() {
    if (this.wizard.policyApplicationModel) {
      const applicationId = this.wizard.policyApplicationModel.applicationId;
      if (+applicationId > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  handlePetitionerTypeChange() {
    if (this.wizard.policyApplicationModel) {
      const applicationId = this.wizard.policyApplicationModel.applicationId;
      const wizardPetitionerType = this.getControl(this.INTRODUCTION_STEP, this.WEKNOW_SECTION, this.PETITIONER_TYPE_CTRL).value;
      const modelPetitionerType = this.wizard.policyApplicationModel.petitionerTypeId;
      if (+applicationId > 0 && (+wizardPetitionerType !== +modelPetitionerType)) {
        this.wizard.policyApplicationModel.petitioner = null;
        this.wizard.policyApplicationModel.petitionerTypeId = wizardPetitionerType;
        this.wizard.enrollmentForm.removeControl(this.PETITIONER_STEP);
        this.createPolicyApplication();
      } else {
        this.router.navigate([this.currentSection.nextStep]);
      }
    }
  }

  createPolicyApplication() {
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

  checkIfHasError(error) {
    return (error.error);
  }

  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.router.navigate([this.currentSection.nextStep]);
  }
}
