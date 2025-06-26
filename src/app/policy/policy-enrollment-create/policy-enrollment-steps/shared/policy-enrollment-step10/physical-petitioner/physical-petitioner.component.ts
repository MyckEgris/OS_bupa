import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-physical-petitioner',
  templateUrl: './physical-petitioner.component.html'
})
export class PhysicalPetitionerComponent implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;
  /***
   * Subscription wizard service
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollmentWizard Object
   */
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 10;
  public configStep: ViewTemplateStep;
  public sectionActive: number;

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;

  /***
   * Id of the info physical petitioner section
   */
  private POLICYAPP_INFO_PHYSICAL_PETITIONER = 1;

  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
        this.setSectionStep(this.wizard.currentSection);
      },
      this.user, null, this.currentStep, 0);
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm.addControl(this.configStep.type, new FormGroup({}));
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup)
      .addControl(
        this.configStep.sections.find(s => s.id === this.POLICYAPP_INFO_PHYSICAL_PETITIONER).name,
        this.policyEnrollmentWizardService.buildSection(this.currentStep, this.POLICYAPP_INFO_PHYSICAL_PETITIONER)
      );
  }

  /**
   * Establish step to current step
   * @param step Step number
   */
  async setSectionStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.sectionActive = step;
  }

}
