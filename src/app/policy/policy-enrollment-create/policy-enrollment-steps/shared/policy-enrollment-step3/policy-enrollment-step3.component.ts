import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription, forkJoin } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentTransformMembersService } from '../../../policy-enrollment-wizard/mappers-services/policy-enrollment-transform-members.service';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import * as moment from 'moment';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Identification } from 'src/app/shared/services/policy-application/entities/identification';
import { IdentificationTypes } from 'src/app/shared/services/policy-application/constants/identification-type.enum';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { MeasurementConversionService } from 'src/app/shared/services/policy-application/helpers/measurement-conversion.service';
@Component({
  selector: 'app-policy-enrollment-step3',
  templateUrl: './policy-enrollment-step3.component.html'
})
export class PolicyEnrollmentStep3Component implements OnInit, OnDestroy {

  public currentStep = 3;
  public user: UserInformationModel;
  wizard: PolicyEnrollmentWizard;
  private subscription: Subscription;
  configStep: ViewTemplateStep;
  public currentSection: Section;

  public showValidationsAdd = false;
  public showValidationsNext = false;

  public showMsgOnlySpouse = false;
  /***
   * List formControl of form members
   */
  public items: FormArray;

  public showValidations = false;
  /**** 3-kilos-metros, 4-libras-metros */
  MEASURE_SYSTEM_KG_MTS = 3;
  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private formBuilder: FormBuilder,
    private config: NgSelectConfig,
    private translate: TranslateService,
    private notification: NotificationService,
    private policyApplicationService: PolicyApplicationService,
    private policyEnrollmentTransform: PolicyEnrollmentTransformMembersService,
    private commonService: CommonService,
    private measurementConversionService: MeasurementConversionService) {
    this.config.notFoundText = '';
  }

  ngOnInit() {
    this.setTopWindows();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
        this.currentSection = this.configStep.sections.find(s => s.id === 1);
      }, this.user, null, this.currentStep, null);
    this.items = this.wizard.enrollmentForm.get(this.configStep.type).get('items') as FormArray;
    this.setUpFormEdit();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm.addControl(this.configStep.type, new FormGroup({
      items: new FormArray([
      ])
    }));
  }

  setUpFormEdit() {
    if (localStorage.getItem('mode') === 'Edit' && this.items.length === 0) {
      const members: Member[] = this.wizard.policyApplicationModel.members.filter(id => id.relationTypeId !== RelationType.OWNER);
      this.displayValuesOnEdit(members);
    }
  }

  displayValuesOnEdit(members: Member[]) {
    if (members && members.length > 0) {
      for (let index = 0; index < members.length; index++) {
        const member: Member = members[index];
        this.addMemberEdit(member);
      }
    }
  }

  /***
 * Add item in the formArray
 */
  addMemberEdit(member: Member) {
    this.items = this.wizard.enrollmentForm.get(this.configStep.type).get('items') as FormArray;
    const formStep = this.formBuilder.group({});
    formStep.addControl(this.configStep.sections.find(s => s.id === 1).name,
      this.policyEnrollmentWizardService.buildSection(this.currentStep, 1));

    formStep.get('policyAppInfoDependents').get('firstName').setValue(member.firstName);
    formStep.get('policyAppInfoDependents').get('middleName').setValue(member.middleName);
    formStep.get('policyAppInfoDependents').get('fatherLastName').setValue(member.paternalLastName);
    formStep.get('policyAppInfoDependents').get('motherLastName').setValue(member.maternalLastName);
    formStep.get('policyAppInfoDependents').get('relationCustomer').setValue(member.relationTypeId);
    formStep.get('policyAppInfoDependents').get('maritalStatus').setValue(member.maritalStatusId);
    formStep.get('policyAppInfoDependents').get('gender').setValue(member.genderId);
    formStep.get('policyAppInfoDependents').get('weight').setValue(member.weight);
    formStep.get('policyAppInfoDependents').get('height').setValue(member.height);
    formStep.get('policyAppInfoDependents').get('systemMeasureId').setValue(member.systemMeasureId);
    formStep.get('policyAppInfoDependents').get('dob').setValue(moment(member.dob).toDate());
    formStep.get('policyAppInfoDependents').get('countryDOB').setValue(member.countryOfBirthId);
    formStep.get('policyAppInfoDependents').get('nationality').setValue(member.nationalityId);
    formStep.get('policyAppInfoDependents').get('employmentProfessionBusiness').setValue(member.ocupation);
    if (member.sourceOfFundingId) {
      formStep.get('policyAppInfoDependents').get('resourcesOrigin').setValue(member.sourceOfFundingId);
    }
    if (formStep.get('policyAppInfoDependents').get('countryResidence')) {
      formStep.get('policyAppInfoDependents').get('countryResidence').setValue(member.countryOfResidenceId);
    }
    if (formStep.get('policyAppInfoDependents').get('email')) {
      const email = this.wizard.policyApplicationModel.emails.find(x => x.contactGuid === member.applicationMemberGuid
        && x.emailTypeId === EmailEnum.PREFERRED_EMAIL);
      if (email) {
        formStep.get('policyAppInfoDependents').get('email').setValue(email.emailAddress);
      }
    }

    formStep.addControl('GUID', new FormControl(member.applicationMemberGuid));

    //// Identifications by member
    const identificationByMember: Array<Identification> = this.wizard.policyApplicationModel.identifications
      .filter(id => id.contactGuid === member.applicationMemberGuid);

    if (identificationByMember && identificationByMember.length > 0) {
      identificationByMember.forEach(element => {
        if (element.identificationTypeId === IdentificationTypes.CURP) {
          (formStep.get('policyAppInfoDependents') as FormGroup)
            .addControl('guidCURP', new FormControl(element.applicationIdentificationGuid));
        }

        if (element.identificationTypeId === IdentificationTypes.RFC) {
          (formStep.get('policyAppInfoDependents') as FormGroup)
            .addControl('guidRFC', new FormControl(element.applicationIdentificationGuid));
        }

        if (element.identificationTypeId === IdentificationTypes.SERIAL_NUMBER) {
          (formStep.get('policyAppInfoDependents') as FormGroup)
            .addControl('guidNroSerie', new FormControl(element.applicationIdentificationGuid));
        }

        (formStep.get('policyAppInfoDependents') as FormGroup)
          .addControl('guidDep', new FormControl(element.applicationIdentificationGuid));
        formStep.get('policyAppInfoDependents').get('typeOfDocument').setValue(element.identificationTypeId);
        formStep.get('policyAppInfoDependents').get('numberAndExtension').setValue(element.identificationNumber);
      });
    } else {
      this.commonService.newGuidNuevo().subscribe(
        a => (formStep.get('policyAppInfoDependents') as FormGroup).addControl('guidCURP', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => (formStep.get('policyAppInfoDependents') as FormGroup).addControl('guidRFC', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => (formStep.get('policyAppInfoDependents') as FormGroup).addControl('guidNroSerie', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => (formStep.get('policyAppInfoDependents') as FormGroup).addControl('guidDep', new FormControl(a))
      );
    }
    ///////////////


    /// Emails by member
    const emailByMember = this.wizard.policyApplicationModel.emails.filter(id => id.contactGuid === member.applicationMemberGuid);

    if (emailByMember && emailByMember.length > 0) {
      // For members only save preferred email
      emailByMember.forEach(element => {
        // if (element.emailTypeId === EmailEnum.ONLINE_SERVICES_EMAIL) {
        //   (formStep.get('policyAppInfoDependents') as FormGroup)
        //     .addControl('guidEmailOnline', new FormControl(element.applicationEmailGuid));
        // }

        if (element.emailTypeId === EmailEnum.PREFERRED_EMAIL) {
          (formStep.get('policyAppInfoDependents') as FormGroup)
            .addControl('guidEmailPrefered', new FormControl(element.applicationEmailGuid));
        } else {
          this.commonService.newGuidNuevo().subscribe(
            a => (formStep.get('policyAppInfoDependents') as FormGroup).addControl('guidEmailPrefered', new FormControl(a))
          );
        }
      });
    } else {

      // this.commonService.newGuidNuevo().subscribe(
      //   a => (formStep.get('policyAppInfoDependents') as FormGroup).addControl('guidEmailOnline', new FormControl(a))
      // );

      this.commonService.newGuidNuevo().subscribe(
        a => (formStep.get('policyAppInfoDependents') as FormGroup).addControl('guidEmailPrefered', new FormControl(a))
      );
    }

    /// phone by member
    const phoneByMember = this.wizard.policyApplicationModel.phones
      .filter(id => id.contactGuid === member.applicationMemberGuid);

    if (phoneByMember && phoneByMember.length > 0) {
      phoneByMember.forEach(element => {
        (formStep.get('policyAppInfoDependents') as FormGroup)
          .addControl('guidPhone', new FormControl(element.applicationPhoneGuid));
      });

    } else {
      this.commonService.newGuidNuevo().subscribe(
        a => (formStep.get('policyAppInfoDependents') as FormGroup).addControl('guidPhone', new FormControl(a))
      );

    }

    /// address by member
    const addressByMember: Address[] = this.wizard.policyApplicationModel.addresses
      .filter(id => id.contactGuid === member.applicationMemberGuid);

    if (addressByMember && addressByMember.length > 0) {
      const address: Address = addressByMember.find(id => id.addressTypeId === 2);
      if (address) {
        (formStep.get('policyAppInfoDependents') as FormGroup)
          .addControl('guidAddress', new FormControl(address.applicationAddressGuid));
      }
    } else {
      this.commonService.newGuidNuevo().subscribe(
        a => (formStep.get('policyAppInfoDependents') as FormGroup).addControl('guidAddress', new FormControl(a))
      );
    }

    if (member.memberExtension) {
      formStep.get('policyAppInfoDependents').get('averageAnnualIncome').setValue(member.memberExtension.averageAnnualIncome);
    }

    this.items.push(formStep);
  }

  /***
   * Add item in the formArray
   */
  addMember(): void {
    this.showValidationsNext = false;
    this.items = this.wizard.enrollmentForm.get(this.configStep.type).get('items') as FormArray;
    if (this.validateOnlyOneSpouse()) {
      this.showMsgOnlySpouse = true;
    } else {
      this.showMsgOnlySpouse = false;
    }
    if (!this.showMsgOnlySpouse && this.wizard.enrollmentForm.get(this.configStep.type).valid) {
      this.showValidations = false;
      this.showValidationsAdd = false;
      const formStep = this.formBuilder.group({});
      formStep.addControl(this.configStep.sections.find(s => s.id === 1).name,
        this.policyEnrollmentWizardService.buildSection(this.currentStep, 1));
      formStep.get(this.configStep.sections.find(s => s.id === 1).name).get('systemMeasureId').setValue(this.MEASURE_SYSTEM_KG_MTS);
      this.items.push(formStep);

    } else {
      this.showValidations = true;
      this.showValidationsAdd = true;
    }
  }

  prevalidateAddMember() {
    if (this.wizard.policyApplicationModel.quoteRequest &&
        (this.wizard.policyApplicationModel.quoteRequest.numberAdultsQuoted > 0 ||
        this.wizard.policyApplicationModel.quoteRequest.numberChildrenQuoted > 0)) {
        this.messageWarningAddingMember();
    } else {
      this.addMember();
    }
  }

  messageWarningAddingMember() {
    const messageS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.MSG_WARNING_QUOTE`);
    const tittleS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.MSG_TITLE_WARNING_QUOTE`);
    const yes = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.OK`);
    const no = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.NOT`);

    forkJoin([tittleS, messageS, yes, no]).subscribe(async response => {
      const getIt = await this.notification.showDialog(response[0], response[1], true, response[2], response[3]);
      if (getIt) {
        this.addMember();
      }
    });
  }

  validateOnlyOneSpouse(): boolean {
    const spouse = this.items.controls.filter(m => m.get('policyAppInfoDependents').get('relationCustomer').value === RelationType.SPOUSE);
    if (spouse.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  getItems(): FormArray {
    return this.wizard.enrollmentForm.get(this.configStep.type).get('items') as FormArray;
  }

  getForm() {
    return this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup;
  }

  back() {
    this.showValidations = false;
    this.router.navigate([this.currentSection.previousStep]);
  }

  next() {
    this.showValidationsAdd = false;
    this.showValidations = true;
    // if (this.items.length === 0) {
    //   this.nextPage();
    // } else {
      if (this.validateOnlyOneSpouse()) {
        this.showMsgOnlySpouse = true;
      } else {
        this.showMsgOnlySpouse = false;
      }
      if (!this.showMsgOnlySpouse && this.getForm().valid) {
        this.showValidations = false;
        this.showValidationsNext = false;
        this.createPolicyApplication();
      } else {
        this.showValidations = true;
        this.showValidationsNext = true;
      }
    // }
  }

  createPolicyApplication() {
    this.saveCheckpoint();
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

  private nextPage() {
    this.router.navigate([this.currentSection.nextStep]);
  }

  private checkIfHasError(error) {
    return (error.error);
  }


}
