/**
* medical-history-questions.component.ts
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
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { MedicalQuestionByLanguages } from 'src/app/shared/services/medical-questionaries/entities/medical-question-by-languages.model';
import { MedicalQuestionary } from 'src/app/shared/services/medical-questionaries/entities/medical-questionary.model';
import { MedicalsService } from 'src/app/shared/services/medical-questionaries/medicals.service';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { MedicalQuestionType } from 'src/app/shared/services/medical-questionaries/entities/medical-question-type.model';
import { first, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { MedicalMember } from '../shared/models/medical-members.model';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
@Component({
  selector: 'app-medical-history-questions',
  templateUrl: './medical-history-questions.component.html'
})
export class MedicalHistoryQuestionsComponent implements OnInit, OnDestroy {

  /**
   * Error saving title of medical history questions component
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';
  /**
   * Error saving message of medical history questions component
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';
  /**
   * Error saving ok of medical history questions component
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  /**
   * Current section of medical history questions component
   */
  public CURRENT_SECTION = 5;
  /**
   * Current step of medical history questions component
   */
  public CURRENT_STEP = 4;
  /**
   * Medical questionary name of medical history questions component
   */
  public MEDICAL_QUESTIONARY_NAME = 'medicalHistoryQuestions';
  /**
   * Medical questionary name preselecion of medical history questions component
   */
  public MEDICAL_QUESTIONARY_NAME_PRESELECION = 'preselectionQuestions';
  /**
   * User  of medical history questions component
   */
  private user: UserInformationModel;
  /**
   * Wizard  of medical history questions component
   */
  public wizard: PolicyEnrollmentWizard;
  /**
   * Subscription  of medical history questions component
   */
  private subscription: Subscription;
  /**
   * Questions$  of medical history questions component
   */
  public questions$: Observable<MedicalQuestions[]>;
  /**
   * Members  of medical history questions component
   */
  public members: Array<MedicalMember> = [];
  /**
   * Show validation of medical history questions component
   */
  public showValidation = false;
  public PRE_QUESTION_SECTION_ID = 1;
  /**
   * Creates an instance of medical history questions component.
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
    private policyApplicationService: PolicyApplicationService ) { }

  /**
   * on destroy
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  /**
   * on init
   */
  async ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.getQuestions();
        this.getMembers();
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
   * Backs medical history questions component
   */
  back() {
    if (!this.anyQuestionAnsweredYesOnPreselectionQuestions()) {
      const back = this.wizard.viewTemplate.steps.find(st => st.stepNumber === this.CURRENT_STEP).sections
        .find(s => s.id === this.PRE_QUESTION_SECTION_ID).currentStep;
      this.router.navigate([back]);
    } else {
      const back = this.wizard.viewTemplate.steps.find(st => st.stepNumber === this.CURRENT_STEP).sections
        .find(s => s.id === this.CURRENT_SECTION).previousStep;
      this.router.navigate([back]);
    }
  }
  /**
   * Next medical history questions component
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
   * Anys question answered yes on preselection questions
   * @returns true or false if the user answered Yes or No
   */
  anyQuestionAnsweredYesOnPreselectionQuestions() {
    const enrollmentForm: FormGroup =  this.wizard.enrollmentForm.get(this.MEDICAL_QUESTIONARY_NAME_PRESELECION) as FormGroup;
    const controlsKeys = Object.keys((this.wizard.enrollmentForm.get(this.MEDICAL_QUESTIONARY_NAME_PRESELECION) as FormGroup).controls);
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
   * Creates policy application
   */
  async createPolicyApplication() {
    // this.saveCheckpoint();
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
   * Success medical history questions component
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
    const next = this.wizard.viewTemplate.steps.find(st => st.stepNumber === this.CURRENT_STEP).sections
      .find(s => s.id === this.CURRENT_SECTION).nextStep;
    this.router.navigate([next]);
  }
  /**
   * Checks if has error
   * @param error
   * @returns
   */
  checkIfHasError(error) {
    return (error.error);
  }
}
