import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import * as moment from 'moment';
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

  public minDate = moment(new Date()).add(-18, 'years').toDate();
  GENRE_MALE_CLASS_CSS = 'bp-generoh';
  GENRE_MALE_SELECTED_CLASS_CSS = 'bp-generohselected';
  GENRE_FEMENINE_CLASS_CSS = 'bp-generom';
  GENRE_FEMENINE_SELECTED_CLASS_CSS = 'bp-generomselected';
  isFemenineCss = 'bp-generom';
  isMaleCss = 'bp-generoh';

  private CONST_MAN =  2;
  private CONST_WOMEN = 3;

  /**
   * Id of the contact information section of the petitioners in JSON
   */
  private ID_SECTION_INFO_CONTACT_PETITIONER = 3;

  /***
   * Id of the physical petitioner section in JSON
   */
  private POLICYAPP_INFO_PHYSICAL_PETITIONER = 1;


  get formEnrollmentPetitioner() {
    return this.wizard.enrollmentForm.get('policyApplicationPetitioner') as FormGroup;
  }

  get formEnrollmentPhysicalPetitioner() {
    return this.formEnrollmentPetitioner.get('policyAppInfoPhysicalPetitioner') as FormGroup;
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

  ngOnInit() {
    this.setTopWindows();
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
        this.currentSection = this.configStep.sections.find(s => s.id === this.POLICYAPP_INFO_PHYSICAL_PETITIONER);
        this.setUpForm();
      }, this.user, null, this.currentStep, 1);
    this.showGenre();
    this.assignGUID();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private assignGUID() {
    if (localStorage.getItem('mode') === 'Edit') {
      this.formEnrollmentPhysicalPetitioner
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

    } else {
      if (!this.formEnrollmentPhysicalPetitioner.get('GUID')) {
        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentPhysicalPetitioner.addControl('GUID', new FormControl(a))
        );

        this.commonService.newGuidNuevo().subscribe(
          a => this.formEnrollmentPhysicalPetitioner.addControl('guidPerson', new FormControl(a))
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
        this.getControl('dob').setValue(moment(this.wizard.policyApplicationModel.petitioner.person.dob).toDate());
        this.getControl('countryDOB').setValue(this.wizard.policyApplicationModel.petitioner.person.countryOfBirthId);
        this.getControl('nationality').setValue(this.wizard.policyApplicationModel.petitioner.person.nationalityId);
        this.getControl('gender').setValue(this.wizard.policyApplicationModel.petitioner.person.genderId);
      }
    }
  }

  /**
   * Get control
   */
  getControl(field: string) {
    return this.formEnrollmentPhysicalPetitioner.get(field) as FormControl;
  }

  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  /***
   * Mark gender button
   */
  onEventGenre(event) {
    event.stopPropagation();
    if (event) {
      if (event.target.className === this.GENRE_MALE_CLASS_CSS && this.isMaleCss !== this.GENRE_MALE_SELECTED_CLASS_CSS) {
        this.isMaleCss = this.GENRE_MALE_SELECTED_CLASS_CSS;
        this.isFemenineCss = this.GENRE_FEMENINE_CLASS_CSS;
        this.getControl('gender').setValue(this.CONST_MAN);
      }

      if (event.target.className === this.GENRE_FEMENINE_CLASS_CSS && this.isFemenineCss !== this.GENRE_FEMENINE_SELECTED_CLASS_CSS) {
        this.isFemenineCss = this.GENRE_FEMENINE_SELECTED_CLASS_CSS;
        this.isMaleCss = this.GENRE_MALE_CLASS_CSS;
        this.getControl('gender').setValue(this.CONST_WOMEN);
      }
    }
  }

  private showGenre() {
    if (this.getControl('gender').value === this.CONST_MAN) {
      this.isMaleCss = this.GENRE_MALE_SELECTED_CLASS_CSS;
      this.isFemenineCss = this.GENRE_FEMENINE_CLASS_CSS;
    } else if (this.getControl('gender').value === this.CONST_WOMEN) {
      this.isFemenineCss = this.GENRE_FEMENINE_SELECTED_CLASS_CSS;
      this.isMaleCss = this.GENRE_MALE_CLASS_CSS;
    }
  }

  next() {
    if (this.formEnrollmentPhysicalPetitioner.valid && this.formEnrollmentInfoContactPetitioner.valid) {
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
