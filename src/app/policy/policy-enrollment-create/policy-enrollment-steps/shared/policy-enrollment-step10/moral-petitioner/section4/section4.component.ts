import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentTransformPetitionerService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/mappers-services/policy-enrollment-transform-petitioner.service';

@Component({
  selector: 'app-section4',
  templateUrl: './section4.component.html'
})
export class Section4Component implements OnInit, OnDestroy {

  public currentStep = 10;
  public user: UserInformationModel;
  public wizard: PolicyEnrollmentWizard;
  private subscription: Subscription;
  private configStep: ViewTemplateStep;
  private currentSection: Section;

  /***
   * List formControl of form Moralpetitioner
   */
  public items: FormArray;

  /***
   * Id of the Main Officials Counselors information petitioner section in JSON
   */
  private POLICYAPP_MAIN_OFFICIALS_COUNSELORS = 7;

  public showValidations = false;

  get formEnrollmentPetitioner() {
    return this.wizard.enrollmentForm.get('policyApplicationPetitioner') as FormGroup;
  }

  constructor(
    private translate: TranslateService,
    private notification: NotificationService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private config: NgSelectConfig,
    private policyEnrollmentPetitionerTransform: PolicyEnrollmentTransformPetitionerService,
    private policyApplicationService: PolicyApplicationService) {
    this.config.notFoundText = '';
  }

  ngOnInit() {
    this.setTopWindows();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
        this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
        this.currentSection = this.configStep.sections.find(s => s.id === this.POLICYAPP_MAIN_OFFICIALS_COUNSELORS);
      }, this.user, null, this.currentStep, 4);
    this.items = this.wizard.enrollmentForm.get(this.configStep.type).get('items') as FormArray;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Bring focus to the beginning of the screen
   */
  setTopWindows() {
    window.scroll(0, 0);
  }

  /***
   * Create formArray
   */
  setUpForm() {
    this.formEnrollmentPetitioner.addControl('itemsOfficerAdvisors', new FormArray([]));
    this.formEnrollmentPetitioner.addControl('itemsSharedholders', new FormArray([]));
  }

  back() {
    this.showValidations = false;
    this.router.navigate([this.currentSection.previousStep]);
  }

  next() {
    this.showValidations = true;
    if (this.formEnrollmentPetitioner.get('itemsOfficerAdvisors').valid
          && this.formEnrollmentPetitioner.get('itemsSharedholders').valid ) {
      this.showValidations = false;
      this.savePetitioner();
    } else {
      this.showValidations = true;
    }
  }

  private savePetitioner() {
    this.wizard.policyApplicationModel.petitionerTypeId = PetitionerType.COMPANY;
    this.policyEnrollmentWizardService.buildPolicyApplication();
    this.policyApplicationService.createPolicyEnrollment(this.wizard.policyApplicationModel)
      .subscribe(
        p => {
          this.policyEnrollmentPetitionerTransform.deletedOfficerSharedholderGUID = [];
          this.success(p);
        }, async e => {
          if (e.status === 500) {
            console.error(e);
          } else {
            if (this.checkIfHasError(e)) {
              const title = await this.translate.get('POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE').toPromise();
              const message = await this.translate.get('POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE').toPromise();
              const ok = await this.translate.get('POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK').toPromise();
              const failed = await this.notification.showDialog(title, message, false, ok);
              if (failed) {
                return;
              }
            }
          }
        },
      );
  }

  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  private nextPage() {
    this.router.navigate([this.currentSection.nextStep]);
  }

  private checkIfHasError(error) {
    return (error.error);
  }

}
