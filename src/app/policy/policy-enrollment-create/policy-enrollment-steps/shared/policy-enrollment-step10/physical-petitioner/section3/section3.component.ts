import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentTransformMembersService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/mappers-services/policy-enrollment-transform-members.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';

@Component({
  selector: 'app-section3',
  templateUrl: './section3.component.html'
})
export class Section3Component implements OnInit, OnDestroy {

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

  private configStep: ViewTemplateStep;

  public currentStep = 10;

  private currentSection: Section;

  public showValidations: boolean;

  /***
   * Id of the economic information physical petitioner section in JSON
   */
  private POLICYAPP_ECONOMIC_INFO_PETITIONER = 5;

  get formEnrollmentPetitioner() {
    return this.wizard.enrollmentForm.get('policyApplicationPetitioner') as FormGroup;
  }

  get formEnrollmentEconomicPetitioner() {
    return this.formEnrollmentPetitioner.get('policyAppInfoEconomicPhysicalPetitioner') as FormGroup;
  }

  constructor(
    private translate: TranslateService,
    private router: Router,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private policyEnrollmentTransform: PolicyEnrollmentTransformMembersService,
    private policyApplicationService: PolicyApplicationService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.setTopWindows();
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
        this.currentSection = this.configStep.sections.find(s => s.id === this.POLICYAPP_ECONOMIC_INFO_PETITIONER);
        this.setUpForm();
      }, this.user, null, this.currentStep, 3);
    this.assignGUID();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private assignGUID() {
    if (!this.formEnrollmentEconomicPetitioner.get('GUID')) {
      this.commonService.newGuidNuevo().subscribe(
        a => (this.formEnrollmentEconomicPetitioner).addControl('guidCURP', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => (this.formEnrollmentEconomicPetitioner).addControl('guidRFC', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => (this.formEnrollmentEconomicPetitioner).addControl('guidNroSerie', new FormControl(a))
      );
    }
  }

  /**
   * Bring focus to the beginning of the screen
   */
  private setTopWindows() {
    window.scroll(0, 0);
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.formEnrollmentPetitioner.addControl(this.currentSection.name,
      this.policyEnrollmentWizardService.buildSection(this.currentStep, this.POLICYAPP_ECONOMIC_INFO_PETITIONER));
  }

  /**
   * Get control
   */
  getControl(field: string) {
    return this.formEnrollmentEconomicPetitioner.get(field) as FormControl;
  }

  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  next() {
    if (this.formEnrollmentEconomicPetitioner.valid) {
      this.showValidations = false;
      this.savePetitioner();
    } else {
      this.showValidations = true;
    }
  }

  back() {
    this.showValidations = false;
    this.router.navigate([this.currentSection.previousStep]);
  }

  private savePetitioner() {
    this.wizard.policyApplicationModel.petitionerTypeId = PetitionerType.INDIVIDUAL;
    this.policyEnrollmentWizardService.buildPolicyApplication();
    this.policyApplicationService.createPolicyEnrollment(this.wizard.policyApplicationModel)
      .subscribe(
        p => {
          this.policyEnrollmentTransform.deletedMembersGUID = [];
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

