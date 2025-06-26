/**
* men-women-questions.component.ts
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
import { MedicalQuestionary } from 'src/app/shared/services/medical-questionaries/entities/medical-questionary.model';
import { MedicalQuestionByLanguages } from 'src/app/shared/services/medical-questionaries/entities/medical-question-by-languages.model';
import { MedicalsService } from 'src/app/shared/services/medical-questionaries/medicals.service';
import { MedicalQuestionType } from 'src/app/shared/services/medical-questionaries/entities/medical-question-type.model';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { first, map } from 'rxjs/operators';
import { MedicalMember } from '../shared/models/medical-members.model';
import { Router } from '@angular/router';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
@Component({
  selector: 'app-men-women-questions',
  templateUrl: './men-women-questions.component.html'
})
export class MenWomenQuestionsComponent implements OnInit, OnDestroy {

  /**
   * Error saving title of men women questions component
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';
  /**
   * Error saving message of men women questions component
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';
  /**
   * Error saving ok of men women questions component
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  /**
   * Current section of men women questions component
   */
  public CURRENT_SECTION = 4;
  /**
   * Genre id female of men women questions component
   */
  public GENRE_ID_FEMALE = 3;
  /**
   * Genre id male of men women questions component
   */
  public GENRE_ID_MALE =  2;
  /**
   * Current step of men women questions component
   */
  public CURRENT_STEP = 4;
  /**
   * Medical questionary name women of men women questions component
   */
  public MEDICAL_QUESTIONARY_NAME_WOMEN = 'womenQuestions';
  /**
   * Medical questionary name men of men women questions component
   */
  public MEDICAL_QUESTIONARY_NAME_MEN = 'menQuestions';
  /**
   * Are women questions of men women questions component
   */
  public areWomenQuestions: boolean;
  /**
   * Are men questions of men women questions component
   */
  public areMenQuestions: boolean;
  /**
   * User  of men women questions component
   */
  private user: UserInformationModel;
  /**
   * Wizard  of men women questions component
   */
  public wizard: PolicyEnrollmentWizard;
  /**
   * Subscription  of men women questions component
   */
  private subscription: Subscription;
  /**
   * Men questions$ of men women questions component
   */
  public menQuestions$: Observable<MedicalQuestions[]>;
  /**
   * Women questions$ of men women questions component
   */
  public womenQuestions$: Observable<MedicalQuestions[]>;
  /**
   * Members  of men women questions component
   */
  public members: Array<MedicalMember> = [];
  /**
   * Show validation of men women questions component
   */
  public showValidation = false;
  /**
   * Creates an instance of men women questions component.
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
    private policyApplicationService: PolicyApplicationService) { }

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
        this.getMembers();
        this.areWomenQuestions = this.anyFemale();
        this.areMenQuestions =  this.anyMale();
        if (this.areWomenQuestions) {
          this.getQuestionsWomen();
        }
        if (this.areMenQuestions) {
          this.getQuestionsMen();
        }
      },
      this.user, null, this.CURRENT_STEP, 4);
  }
  /**
   * Gets questions women
   */
  getQuestionsWomen() {
    this.womenQuestions$ = this.medicalService.getQuestions(this.MEDICAL_QUESTIONARY_NAME_WOMEN,
      this.user.bupa_insurance).pipe(map(x => x[0].medicalQuestions));
  }
  /**
   * Gets questions men
   */
  getQuestionsMen() {
    this.menQuestions$ = this.medicalService.getQuestions(this.MEDICAL_QUESTIONARY_NAME_MEN,
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
   * Anys female
   * @returns true if female
   */
  anyFemale(): boolean {
    for (let index = 0; index < this.members.length; index++) {
      const element = this.members[index];
      if (element.genreId === this.GENRE_ID_FEMALE) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }
  /**
   * Anys male
   * @returns true of false if male or not
   */
  anyMale() {
    for (let index = 0; index < this.members.length; index++) {
      const element = this.members[index];
      if (element.genreId === this.GENRE_ID_MALE) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }
  /**
   * Backs men women questions component
   */
  back() {
    const back = this.wizard.viewTemplate.steps.find(st => st.stepNumber === this.CURRENT_STEP).sections
      .find(s => s.id === this.CURRENT_SECTION).previousStep;
    this.router.navigate([back]);
  }
  /**
   * Next men women questions component
   */
  next() {
    if (this.areWomenQuestions && this.areMenQuestions) {
      if (this.wizard.enrollmentForm.get(this.MEDICAL_QUESTIONARY_NAME_WOMEN).valid &&
         this.wizard.enrollmentForm.get(this.MEDICAL_QUESTIONARY_NAME_MEN).valid) {
        this.showValidation = false;
        this.createPolicyApplication();
      } else {
        this.showValidation = true;
      }
    } else if (this.areWomenQuestions) {
      if (this.wizard.enrollmentForm.get(this.MEDICAL_QUESTIONARY_NAME_WOMEN).valid) {
        this.showValidation = false;
        this.createPolicyApplication();
      } else {
        this.showValidation = true;
      }
    } else {
      if (this.wizard.enrollmentForm.get(this.MEDICAL_QUESTIONARY_NAME_MEN).valid) {
        this.showValidation = false;
        this.createPolicyApplication();
      } else {
        this.showValidation = true;
      }
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
   * Success men women questions component
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
   * @returns error
   */
  checkIfHasError(error) {
    return (error.error);
  }

}
