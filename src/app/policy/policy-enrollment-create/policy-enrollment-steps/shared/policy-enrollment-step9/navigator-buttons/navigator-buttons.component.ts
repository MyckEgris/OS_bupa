import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';


@Component({
  selector: 'app-navigator-buttons',
  templateUrl: './navigator-buttons.component.html',
})
export class NavigatorButtonsComponent implements OnInit {

  wizard: PolicyEnrollmentWizard;

  user: UserInformationModel;

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

  /***
   * Const to Identify Next Step Variation Number
   */
  private STEP_VARIATION_NUMBER = '{stepVariationNumber}';

  /**
     *  Const to Identify the current step name
     */
  STEP_NAME = 'policyApplicationPayments';

  /**
  * PolicyEnrollment Wizard Step Configuration
  */
  private configStep: ViewTemplateStep;



  constructor(private router: Router,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService) { }
  private subscription: Subscription;




  ngOnInit() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(9);
    this.user = this.authService.getUser();
    this.wizard = this.policyEnrollmentWizardService.getPolicyEnrollment();
  }

  nextPageButton() {
    if (this.wizard.currentSection === 1) {
      this.createPolicyApplication();
    } else if (this.wizard.currentSection === 3 && this.getFormGroup().valid && this.getControlDisclaimerChek().value) {
      if (this.getControlDisclaimerChek().value) {
        this.createPolicyApplication();
      } else {

      }
    } else if (this.wizard.currentSection + 1 === 3 && this.getControlsCreditCard1().valid) {
      this.wizard.isHomeVisible = false;
      this.wizard.isCurrentSectionValid = true;
      this.router.navigate([this.wizard.viewTemplate.steps.find(s => s.stepNumber === this.wizard.currentStep).sections.
        find(s => s.id === this.wizard.currentSection).nextStep]);
    } else {
      this.wizard.isCurrentSectionValid = false;
    }
  }

  /**
  * Get nested form controls.
  */
  getControlDisclaimerChek() {
    return this.wizard.enrollmentForm.get(this.configStep.type).get('policyAppPaymentsCreditCard2').get('disclaimerCheck') as FormControl;
  }

  /**
  * Get nested form controls.
  */
  getControlsCreditCard1() {
    return this.wizard.enrollmentForm.get(this.configStep.type).get('policyAppPaymentsCreditCard1') as FormGroup;
  }

  backPageButton() {
    if (this.wizard.currentStep === 9 && this.wizard.currentSection === 4) {
      this.router.navigate([this.wizard.viewTemplate.steps.find(s => s.stepNumber === this.wizard.currentStep).sections.
        find(s => s.id === 0).previousStep]);
    }

    if (this.wizard.currentSection === 3) {
      this.router.navigate([this.wizard.viewTemplate.steps.find(s => s.stepNumber === this.wizard.currentStep).sections.
        find(s => s.id === 3).previousStep]);
      this.wizard.isHomeVisible = true;
      this.wizard.isCurrentSectionValid = true;
    } else if ((this.wizard.viewTemplate.steps.find(s => s.stepNumber === this.wizard.currentStep).sections.
      find(s => s.id === this.wizard.currentSection).previousStep) === null) {
      this.router.navigate([this.wizard.viewTemplate.steps.find(s => s.stepNumber === this.wizard.currentStep).sections.
        find(s => s.id === 0).previousStep]);

    } else {
      this.router.navigate([this.wizard.viewTemplate.steps.find(s => s.stepNumber === this.wizard.currentStep).sections.
        find(s => s.id === this.wizard.currentSection).previousStep]);
    }
  }

  nextPage() {
    let nextStep = this.wizard.viewTemplate.steps.find(s => s.stepNumber === this.wizard.currentStep).sections.
      find(s => s.id === 3).nextStep;
    if (nextStep.indexOf(this.STEP_VARIATION_NUMBER) > 0) {
      nextStep = nextStep.replace(this.STEP_VARIATION_NUMBER, this.wizard.policyApplicationModel.petitionerTypeId.toString());
    }
    this.router.navigate([nextStep]);
  }

  /**
   * Save the form information in the wizard service and show sucess message.
   */
  createPolicyApplication() {
    this.policyEnrollmentWizardService.buildPolicyApplication();
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
    this.wizard.isHomeVisible = true;
    this.wizard.isCurrentSectionValid = true;
  }

  /**
   * Store the succes request id in wizard and continue to next page.
   */
  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  /**
   * Check for request errors.
   */
  checkIfHasError(error) {
    return (error.error);
  }

  /**
  * Get nested form group.
  */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.STEP_NAME) as FormGroup;
  }


}
