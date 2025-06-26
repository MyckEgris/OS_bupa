import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { Subscription } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html'
})
export class IntroductionComponent implements OnInit, OnDestroy {
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 1;
  public user: UserInformationModel;
  private subscription: Subscription;
  public currentSection: Section;
  private configStep: ViewTemplateStep;
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private router: Router) { }
  /**
   * on destroy
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => { this.wizard = wizard; }, this.user, null, this.currentStep, null);
      this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
      this.currentSection = this.configStep.sections.find(s => s.id === 1);
  }

  next() {
    if (this.wizard.policyApplicationModel.currentStepCompleted) {
      const currentStepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
      const curreStepToGo = this.wizard.viewTemplate.steps
        .find(st => st.stepNumber === currentStepCompleted.stepNumber).sections
        .find(se => se.id === currentStepCompleted.sectionId).currentStep;
      this.router.navigate([curreStepToGo]);
    } else {
      this.router.navigate([this.currentSection.nextStep]);
    }
  }

  get getIconCompletedQuotedApplication(): Array<any> {
    if (this.wizard.policyApplicationModel && this.wizard.policyApplicationModel.quoteRequest) {
      return ['assets/images/correct.svg', true];
    } else {
      return ['assets/images/calculatorbl.svg', false];
    }
  }

  get getIconCompletedApplication(): Array<any> {
    if (this.wizard.policyApplicationModel && this.wizard.policyApplicationModel.currentStepCompleted) {
      const stepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
      if (stepCompleted) {
        if (stepCompleted.stepNumber >= 9) {
          return ['assets/images/correct.svg', true];
        }
      }
    }
    return ['assets/images/handsbl.svg', false];
  }

  get getIconCompletedSignApplication(): Array<any> {
    if (this.wizard.policyApplicationModel && this.wizard.policyApplicationModel.currentStepCompleted) {
      const stepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
      if (stepCompleted) {
        if (stepCompleted.stepNumber >= 10) {
          return ['assets/images/correct.svg', true];
        }
      }
    }
    return ['assets/images/hospitalbl.svg', false];
  }

  get getIconCompletedUploadDocsApplication(): Array<any> {
    if (this.wizard.policyApplicationModel && this.wizard.policyApplicationModel.currentStepCompleted) {
      const stepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
      if (stepCompleted) {
        if (stepCompleted.stepNumber >= 11) {
          return ['assets/images/correct.svg', true];
        }
      }
    }
    return ['assets/images/workbl.svg', false];
  }

  get getIconCompletedPaymentInfoApplication(): Array<any> {
    if (this.wizard.policyApplicationModel && this.wizard.policyApplicationModel.currentStepCompleted) {
      const stepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
      if (stepCompleted) {
        if (stepCompleted.stepNumber === 12) {
          return ['assets/images/correct.svg', true];
        }
      }
    }
    return ['assets/images/heartbl.svg', false];
  }

  get isCompletedApplicationNext(): boolean {
    if (this.wizard.policyApplicationModel && this.wizard.policyApplicationModel.currentStepCompleted) {
      const stepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
      if (stepCompleted) {
        if (stepCompleted.stepNumber < 9) {
          return true;
        }
      }
    }
    return false;
  }

  get isSignApplicationNext(): boolean {
    if (this.wizard.policyApplicationModel && this.wizard.policyApplicationModel.currentStepCompleted) {
      const stepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
      if (stepCompleted) {
        if (stepCompleted.stepNumber === 9) {
          return  true;
        }
      }
    }
    return false;
  }

  get isCompletedUploadDocsApplicationNext(): boolean {
    if (this.wizard.policyApplicationModel && this.wizard.policyApplicationModel.currentStepCompleted) {
      const stepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
      if (stepCompleted) {
        if (stepCompleted.stepNumber === 10) {
          return true;
        }
      }
    }
    return false;
  }

  get isPaymentInfoApplicationNext(): boolean {
    if (this.wizard.policyApplicationModel && this.wizard.policyApplicationModel.currentStepCompleted) {
      const stepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
      if (stepCompleted) {
        if (stepCompleted.stepNumber === 11) {
          return true;
        }
      }
    }
    return false;
  }

}
