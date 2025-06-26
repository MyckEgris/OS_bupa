/**
* application-summary.component.ts
*
* @description: Policy Enrollment Step10
* @author Enrique Durango Rivera
* @version 1.0
* @date MAR-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Subscription } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { HttpErrorResponse } from '@angular/common/http';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
@Component({
  selector: 'app-application-summary',
  templateUrl: './application-summary.component.html'
})
export class ApplicationSummaryComponent implements OnInit, OnDestroy {
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  private configStep: ViewTemplateStep;
  private subscription: Subscription;
  private user: UserInformationModel;
  wizard: PolicyEnrollmentWizard;
  public currentSection: Section;
  currentStep = 10;
  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService) { }

  ngOnDestroy(): void {
    if (this.subscription) {this.subscription.unsubscribe(); }
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => { this.wizard = wizard; }, this.user, null, this.currentStep, 1);
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 1);
  }

  createPolicyApplication() {
    this.saveCheckpoint();
    if (this.wizard.policyApplicationModel.status === 'Pending Information'
    || this.wizard.policyApplicationModel.status === 'PendingInformation') {
      this.wizard.policyApplicationModel.status = 'ReadyToUploadDocs';
    }
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

  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  nextPage() {
    this.router.navigate([this.currentSection.nextStep]);
  }

  checkIfHasError(error: { error: any; }) {
    return (error.error);
  }

  back() {
    switch (this.wizard.policyApplicationModel.petitioner.petitionerTypeId) {
      case PetitionerType.INDIVIDUAL:
        this.router.navigate([`${this.currentSection.previousStep}/individual/address-info`]);
        break;
      case PetitionerType.COMPANY:
          this.router.navigate([`${this.currentSection.previousStep}/company/contact-address-info`]);
          break;
      default:
        this.router.navigate([`${this.currentSection.previousStep}/petitioner`]);
        break;
    }
  }

  /**
   * downloads the documents the user select on the screen
   * @param doc Document object.
   */
  downloadFile() {
    const peticion = this.policyApplicationService.generatePolicyApplicationPdf(this.wizard.policyApplicationModel.applicationGuid,
      this.wizard.policyApplicationModel.applicationId, this.wizard.policyApplicationModel.status,
      this.user.language, 'false');
    peticion.subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      saveAs(blob, String(this.wizard.policyApplicationModel.applicationId));
    }, error => {
      this.showNotFoundDocument(error);
    }
    );
  }
  /**
   * Shows the message when the Item was not found.
   * @param error Http Error message.
   */
  showNotFoundDocument(error: HttpErrorResponse) {
    if (error.error === '404') {
      let message = '';
      let messageTitle = '';
      this.translate.get(`POLICY.ERROR.ERROR_CODE.404`).subscribe(
        result => messageTitle = result
      );
      this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.404`).subscribe(
        result => message = result
      );
      this.notification.showDialog(messageTitle, message);
    }
  }

  get petitionerPolicyHolder(): number {
    return  PetitionerType.POLICY_HOLDER;
  }

  get petitionerIndividual(): number {
    return  PetitionerType.INDIVIDUAL;
  }

  get petitionerCompany(): number {
    return  PetitionerType.COMPANY;
  }

}
