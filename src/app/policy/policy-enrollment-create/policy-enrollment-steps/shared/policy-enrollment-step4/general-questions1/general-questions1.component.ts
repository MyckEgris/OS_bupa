/**
* general-questions1.component.ts
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
import { MedicalQuestionType } from 'src/app/shared/services/medical-questionaries/entities/medical-question-type.model';
import { first, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { MedicalMember } from '../shared/models/medical-members.model';
import {ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
@Component({
  selector: 'app-general-questions1',
  templateUrl: './general-questions1.component.html'
})
export class GeneralQuestions1Component implements OnInit, OnDestroy, AfterContentChecked {

  /**
   * Error saving title of general questions1 component
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';
  /**
   * Error saving message of general questions1 component
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';
  /**
   * Error saving ok of general questions1 component
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  /**
   * Current section of general questions1 component
   */
  public CURRENT_SECTION = 2;
  /**
   * Current step of general questions1 component
   */
  public CURRENT_STEP = 4;
  /**
   * Medical questionary name of general questions1 component
   */
  public MEDICAL_QUESTIONARY_NAME = 'generalQuestions1';
  /**
   * User  of general questions1 component
   */
  private user: UserInformationModel;
  /**
   * Wizard  of general questions1 component
   */
  public wizard: PolicyEnrollmentWizard;
  private subscription: Subscription;
  /**
   * Questions$  of general questions1 component
   */
  public questions$: Observable<MedicalQuestions[]>;
  /**
   * Show validation of general questions1 component
   */
  public showValidation = false;
  /**
   * Members  of general questions1 component
   */
  public members: Array<MedicalMember> = [];
  /**
   * Creates an instance of general questions1 component.
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
    private policyApplicationService: PolicyApplicationService,
    private cdref: ChangeDetectorRef
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
      this.user, null, this.CURRENT_STEP, 2);
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
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
   * Backs general questions1 component
   */
  back() {
    const back = this.wizard.viewTemplate.steps.find(st => st.stepNumber === this.CURRENT_STEP).sections
    .find(s => s.id === this.CURRENT_SECTION).previousStep;
    this.router.navigate([back]);
  }

  /**
   * Next general questions1 component
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
   * Success general questions1 component
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
   * @returns errors
   */
  checkIfHasError(error) {
    return (error.error);
  }

}
