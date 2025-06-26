/**
* preselection-questions.component.ts
*
* @description: This class handle step  policy aplication wizard.
* @author Enrique Durango.
* @version 1.0
* @date 06-12-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { MedicalsService } from 'src/app/shared/services/medical-questionaries/medicals.service';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { map } from 'rxjs/operators';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { MedicalMember } from '../shared/models/medical-members.model';
@Component({
  selector: 'app-preselection-questions',
  templateUrl: './preselection-questions.component.html'
})
export class PreselectionQuestionsComponent implements OnInit, OnDestroy {
  /**
   * Medical questionnaires names of preselection questions component
   */
  private MEDICAL_QUESTIONNAIRES_NAMES = ['generalQuestions1', 'generalQuestions2', 'womenQuestions', 'menQuestions'];
  /**
   * Error saving title of preselection questions component
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';
  /**
   * Error saving message of preselection questions component
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';
  /**
   * Error saving ok of preselection questions component
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  /**
   * Current section of preselection questions component
   */
  public CURRENT_SECTION = 1;
  /**
   * Current step of preselection questions component
   */
  public CURRENT_STEP = 4;
  public MEDICAL_QUESTIONARY_NAME = 'preselectionQuestions';
  /**
   * User  of preselection questions component
   */
  private user: UserInformationModel;
  /**
   * Wizard  of preselection questions component
   */
  public wizard: PolicyEnrollmentWizard;
  /**
   * Subscription  of preselection questions component
   */
  private subscription: Subscription;
  /**
   * Questions$  of preselection questions component
   */
  public questions$: Observable<MedicalQuestions[]>;
  /**
   * Show validation of preselection questions component
   */
  public showValidation = false;
  /**
   * Members  of general questions1 component
   */
  public members: Array<MedicalMember> = [];
  /**
   * Creates an instance of preselection questions component.
   * @param policyEnrollmentWizardService
   * @param authService
   * @param medicalService
   * @param router
   * @param translate
   * @param notification
   * @param policyApplicationService
   */
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private medicalService: MedicalsService,
    private router: Router,
    private translate: TranslateService,
    private notification: NotificationService,
    private policyApplicationService: PolicyApplicationService
  ) { }

  /**
   * on destroy
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  /**
   * on init
   */
  async ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.getMembers();
        this.getQuestions();
      },
      this.user, null, this.CURRENT_STEP, this.CURRENT_SECTION);
  }
  /**
   * Gets questions
   */
  getQuestions() {
    this.questions$ = this.medicalService.getQuestions(this.MEDICAL_QUESTIONARY_NAME,
      this.user.bupa_insurance).pipe(map(x => x[0].medicalQuestions));
   }
    /**
   * Gets members
   */
  getMembers() {
    try {
      this.wizard.policyApplicationModel.members.forEach(member => {
        this.members.push(new MedicalMember(member.applicationMemberGuid, member.firstName,
          member.middleName, member.lastName, member.genderId));
      });
    } catch (e) {
      console.error(e);
    }
  }
  /**
   * Next preselection questions component
   */
  next() {
    if (this.wizard.enrollmentForm.get(this.MEDICAL_QUESTIONARY_NAME).valid) {
      this.showValidation = false;
      this.createPolicyApplication();
    } else {
      this.showValidation = true;
    }
  }
  /**
   * Anys question answered yes
   * @returns true or false if selected yes or no
   */
  anyQuestionAnsweredYes() {
    const enrollmentForm: FormGroup =  this.wizard.enrollmentForm.get(this.MEDICAL_QUESTIONARY_NAME) as FormGroup;
    const controlsKeys = Object.keys((this.wizard.enrollmentForm.get(this.MEDICAL_QUESTIONARY_NAME) as FormGroup).controls);
    for (let index = 0; index < controlsKeys.length; index++) {
      if (enrollmentForm.get(controlsKeys[index]).get('answer').value === 'true') {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }
  /**
   * Backs preselection questions component
   */
  back() {
    const back = this.wizard.viewTemplate.steps.find(st => st.stepNumber === this.CURRENT_STEP).sections
    .find(s => s.id === this.CURRENT_SECTION).previousStep;
    this.router.navigate([back]);
  }
  /**
   * Creates policy application
   */
  async createPolicyApplication() {
    this.saveCheckpoint();
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

  private saveCheckpoint() {
    const currentStepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
    if (currentStepCompleted.stepNumber === this.CURRENT_STEP) {
      const totalSections = this.wizard.viewTemplate.steps.find(st => st.stepNumber === currentStepCompleted.stepNumber).sections.length;
      if (totalSections > 1 && currentStepCompleted.sectionId < this.CURRENT_SECTION) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.CURRENT_STEP, this.CURRENT_SECTION));
      }
    } else {
      if (currentStepCompleted.stepNumber < this.CURRENT_STEP) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.CURRENT_STEP, this.CURRENT_SECTION));
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
   * Success preselection questions component
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

    if (this.anyQuestionAnsweredYes()) {
      const next = this.wizard.viewTemplate.steps.find(st => st.stepNumber === this.CURRENT_STEP).sections
        .find(s => s.id === this.CURRENT_SECTION).nextStep.replace('{{sectionName}}', 'general-questions1');
      this.router.navigate([next]);
    } else {
      for (let index = 0; index < this.MEDICAL_QUESTIONNAIRES_NAMES.length; index++) {
        const name = this.MEDICAL_QUESTIONNAIRES_NAMES[index];
        if (this.wizard.enrollmentForm.get(name)) {
          this.wizard.enrollmentForm.removeControl(name);
        }
      }
      const next = this.wizard.viewTemplate.steps.find(st => st.stepNumber === this.CURRENT_STEP).sections
      .find(s => s.id === this.CURRENT_SECTION).nextStep.replace('{{sectionName}}', 'medical-history-questions');
      this.router.navigate([next]);
    }
  }
  /**
   * Checks if has error
   * @param error
   * @returns error
   */
  checkIfHasError(error) {
    return (error.error);
  }

}
