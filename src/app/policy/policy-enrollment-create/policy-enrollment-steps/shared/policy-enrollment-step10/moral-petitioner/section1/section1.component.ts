import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentTransformMembersService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/mappers-services/policy-enrollment-transform-members.service';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';

@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html'
})
export class Section1Component implements OnInit, OnDestroy {

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

  public today = moment(new Date()).toDate();

  /**
   * Id of the contact information section of the petitioners in JSON
   */
  private ID_SECTION_INFO_CONTACT_PETITIONER = 3;

  /***
   * Id of the moral petitioner section in JSON
   */
  private POLICYAPP_INFO_MORAL_PETITIONER = 2;

  get formEnrollmentPetitioner() {
    return this.wizard.enrollmentForm.get('policyApplicationPetitioner') as FormGroup;
  }

  get formEnrollmentMoralPetitioner() {
    return this.formEnrollmentPetitioner.get('policyAppInfoMoralPetitioner') as FormGroup;
  }

  get formEnrollmentInfoContactPetitioner() {
    return this.formEnrollmentPetitioner.get('policyAppContactPetitioner') as FormGroup;
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.setTopWindows();
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
        this.currentSection = this.configStep.sections.find(s => s.id === this.POLICYAPP_INFO_MORAL_PETITIONER);
        this.setUpForm();
      }, this.user, null, this.currentStep, 1);
    this.assignGUID();
  }

  /**
   * Bring focus to the beginning of the screen
   */
  private setTopWindows() {
    window.scroll(0, 0);
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.formEnrollmentPetitioner.addControl(
      this.configStep.sections.find(s => s.id === this.ID_SECTION_INFO_CONTACT_PETITIONER).name,
      this.policyEnrollmentWizardService.buildSection(this.currentStep, this.ID_SECTION_INFO_CONTACT_PETITIONER));

    if (localStorage.getItem('mode') === 'Edit') {
      if (this.wizard.policyApplicationModel.petitioner.person) {
        this.getControl('firstName').setValue(this.wizard.policyApplicationModel.petitioner.person.firstName);
        this.getControl('middleName').setValue(this.wizard.policyApplicationModel.petitioner.person.middleName);
        this.getControl('fatherLastName').setValue(this.wizard.policyApplicationModel.petitioner.person.paternalLastName);
        this.getControl('motherLastName').setValue(this.wizard.policyApplicationModel.petitioner.person.maternalLastName);
        this.getControl('fatherLastName').setValue(this.wizard.policyApplicationModel.petitioner.person.paternalLastName);
      }
    }
  }

  private assignGUID() {
    if (localStorage.getItem('mode') === 'Edit') {

      this.formEnrollmentMoralPetitioner
        .addControl('GUID', new FormControl(this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid));

      if (this.wizard.policyApplicationModel.phones) {
        const guidPhone = this.wizard.policyApplicationModel.phones.find(p => p.contactGuid ===
          this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
        this.formEnrollmentInfoContactPetitioner.addControl('guidPhone', new FormControl(guidPhone));
      } else {
        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentInfoContactPetitioner.addControl('guidPhone', new FormControl(a))
        );
      }

      if (this.wizard.policyApplicationModel.emails) {
        const guidEmail = this.wizard.policyApplicationModel.emails.find (e => e.contactGuid ===
          this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);
        this.formEnrollmentInfoContactPetitioner.addControl('guidEmail', new FormControl(guidEmail));
      } else {
        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentInfoContactPetitioner.addControl('guidEmail', new FormControl(a))
        );
      }

      if (this.wizard.policyApplicationModel.petitioner.company) {
        this.formEnrollmentMoralPetitioner
          .addControl('guidCompany',
            new FormControl(this.wizard.policyApplicationModel.petitioner.company.applicationCompanyPetitionerGuid));

        const companyContact = this.wizard.policyApplicationModel.petitioner.company.companyContacts
          .find (g => g.applicationCompanyPetitionerGuid ===
          this.wizard.policyApplicationModel.petitioner.company.applicationCompanyPetitionerGuid);

        this.formEnrollmentMoralPetitioner
        .addControl('guidLegalRepresentative', new FormControl(companyContact.applicationCompanyPetitionerContactGuid));
      } else {
        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentMoralPetitioner.addControl('guidCompany', new FormControl(a))
        );

        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentMoralPetitioner.addControl('guidLegalRepresentative', new FormControl(a))
        );
      }

    } else {
      if (!this.formEnrollmentMoralPetitioner.get('GUID')) {
        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentMoralPetitioner.addControl('GUID', new FormControl(a))
        );

        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentMoralPetitioner.addControl('guidCompany', new FormControl(a))
        );

        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentMoralPetitioner.addControl('guidLegalRepresentative', new FormControl(a))
        );

        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentInfoContactPetitioner.addControl('guidPhone', new FormControl(a))
        );

        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentInfoContactPetitioner.addControl('guidEmail', new FormControl(a))
        );
      }
    }
  }

  /**
   * Get control
   */
  getControl(field: string) {
    return this.formEnrollmentMoralPetitioner.get(field) as FormControl;
  }

  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  next() {
    if (this.formEnrollmentMoralPetitioner.valid && this.formEnrollmentInfoContactPetitioner.valid) {
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
    this.wizard.policyApplicationModel.petitionerTypeId = PetitionerType.COMPANY;
    this.policyEnrollmentWizardService.buildPolicyApplication();
    // this.nextPage();
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
