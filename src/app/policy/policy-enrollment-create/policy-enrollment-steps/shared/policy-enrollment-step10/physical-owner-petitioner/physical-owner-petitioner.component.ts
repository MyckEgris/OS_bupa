import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentTransformMembersService } from '../../../../policy-enrollment-wizard/mappers-services/policy-enrollment-transform-members.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';

@Component({
  selector: 'app-physical-owner-petitioner',
  templateUrl: './physical-owner-petitioner.component.html'
})
export class PhysicalOwnerPetitionerComponent implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  private user: UserInformationModel;

  /***
   * Subscription wizard service
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollmentWizard Object
   */
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 10;
  private configStep: ViewTemplateStep;
  private currentSection: Section;

  private POLICYAPP_PHYSICAL_OWNER_PETITIONER = 9;


  constructor(
    private router: Router,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private notification: NotificationService,
    private translate: TranslateService,
    private policyEnrollmentTransform: PolicyEnrollmentTransformMembersService,
    private policyApplicationService: PolicyApplicationService) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
        this.currentSection = this.configStep.sections.find(s => s.id === this.POLICYAPP_PHYSICAL_OWNER_PETITIONER);
        this.setUpForm();
      },
      this.user, null, this.currentStep, 0);
  }

  private setUpForm() {
    this.wizard.enrollmentForm.addControl(this.configStep.type, new FormGroup({}));
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup)
    .addControl(this.currentSection.name,
      this.policyEnrollmentWizardService.buildSection(this.currentStep, this.POLICYAPP_PHYSICAL_OWNER_PETITIONER));

      this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name).get('name').setValue(this.getName());
      this.assignGUID();
  }

  private assignGUID() {
    if (!this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name).get('guidPetitioner')) {
      this.commonService.newGuidNuevo().subscribe(
        a => (this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.currentSection.name) as FormGroup).addControl('guidPetitioner', new FormControl(a))
      );
      this.commonService.newGuidNuevo().subscribe(
        a => (this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.currentSection.name) as FormGroup).addControl('guidPerson', new FormControl(a))
      );
      this.commonService.newGuidNuevo().subscribe(
        a => (this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.currentSection.name) as FormGroup).addControl('guidAddress', new FormControl(a))
      );
      this.commonService.newGuidNuevo().subscribe(
        a => (this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.currentSection.name) as FormGroup).addControl('guidPhone', new FormControl(a))
      );
      this.commonService.newGuidNuevo().subscribe(
        a => (this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.currentSection.name) as FormGroup).addControl('guidRFC', new FormControl(a))
      );
      this.commonService.newGuidNuevo().subscribe(
        a => (this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.currentSection.name) as FormGroup).addControl('guidCURP', new FormControl(a))
      );
      this.commonService.newGuidNuevo().subscribe(
        a => (this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.currentSection.name) as FormGroup).addControl('guidNroSerie', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => (this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.currentSection.name) as FormGroup).addControl('guidEmail', new FormControl(a))
      );
    }
  }

  next() {
    this.savePetitioner();
  }

  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

  private getName(): string {
    const owner = this.wizard.policyApplicationModel.members.find(o => o.relationTypeId === RelationType.OWNER);
    return `${owner.firstName} ${owner.middleName} ${owner.paternalLastName} ${owner.maternalLastName}`;
  }

  private savePetitioner() {
    this.wizard.policyApplicationModel.petitionerTypeId = PetitionerType.POLICY_HOLDER;
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
    // this.router.navigate(['policies/create-policy-enrollment/underconstruction']);
    this.router.navigate([this.currentSection.nextStep]);
  }

  private checkIfHasError(error) {
    return (error.error);
  }

}

