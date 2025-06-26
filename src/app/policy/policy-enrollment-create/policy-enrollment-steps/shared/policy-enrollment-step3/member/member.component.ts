import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, forkJoin } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentTransformMembersService } from '../../../../policy-enrollment-wizard/mappers-services/policy-enrollment-transform-members.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html'
})
export class MemberComponent implements OnInit, OnDestroy {

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

  public showContactAddressInfo: boolean;

  public fullNamesDependent: string;

  /**
   * contais the notifications id to slideToggle
   */
  private ID_SECTION_TOGGLE = 'collapseExample';

  /***
   *  Indicates the number of dependent added
   */
  @Input() numberIndexMember: number;

  @Input() currentStep: number;

  @Input() showValidations: boolean;

  @Input() isLastDependent: boolean;

  get formEnrollmentDependents() {
    return this.wizard.enrollmentForm.get('policyApplicationDependents') as FormGroup;
  }

  get formEnrollmentMember() {
    if (this.numberIndexMember >= 0) {
      return (this.wizard.enrollmentForm
        .get('policyApplicationDependents')
        .get('items') as FormArray)
        .at(this.numberIndexMember) as FormGroup;
    } else {
      return null;
    }
  }

  get formInfoMember() {
    return this.formEnrollmentMember.get('policyAppInfoDependents') as FormGroup;
  }

  constructor(
    private translate: TranslateService,
    private notification: NotificationService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private policyEnrollmentTransform: PolicyEnrollmentTransformMembersService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
      }, this.user, null, this.currentStep, null);
    this.showContactAddressInfo = this.formInfoMember.get('diffInfoContactAddress').value;
    this.assignGUID();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /***
   * For each added member create IDs
   */
  assignGUID() {
    if (!this.formEnrollmentMember.get('GUID')) {
      this.commonService.newGuidNuevo().subscribe(
        a => this.formEnrollmentMember.addControl('GUID', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => (this.formInfoMember).addControl('guidCURP', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => (this.formInfoMember).addControl('guidRFC', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => (this.formInfoMember).addControl('guidNroSerie', new FormControl(a))
      );

      // this.commonService.newGuidNuevo().subscribe(
      //   a => this.formInfoMember.addControl('guidEmailOnline', new FormControl(a))
      // );

      this.commonService.newGuidNuevo().subscribe(
        a => this.formInfoMember.addControl('guidEmailPrefered', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => this.formInfoMember.addControl('guidPhone', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => this.formInfoMember.addControl('guidAddress', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => this.formInfoMember.addControl('guidDep', new FormControl(a))
      );

      this.commonService.newGuidNuevo().subscribe(
        a => this.formInfoMember.addControl('guidEmailDependant', new FormControl(a))
      );
    }
  }

  processShowData(showData: boolean) {
    this.showContactAddressInfo = showData;
  }

  showNameDependent(fullName: string) {
    this.fullNamesDependent = fullName;
  }

  /***
   * Delete member
   */
  delete() {
    const messageS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.MSG_DELETE_MEMBER`);
    const tittleS = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.MSG_TITLE_MEMBER`);
    const yes = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.OK`);
    const no = this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP3.MESSAGES.NOT`);

    forkJoin([tittleS, messageS, yes, no]).subscribe(async response => {
      const getIt = await this.notification.showDialog(response[0], response[1], true, response[2], response[3]);
      if (getIt) {

        this.policyEnrollmentTransform.deletedMembersGUID.push(this.formEnrollmentMember.get('GUID').value);
        (this.formEnrollmentDependents.get('items') as FormArray).removeAt(this.numberIndexMember);
      }
    });
  }

  /**
   * Handle toggle section icon.
   */
  handleToggleIcon() {
    const clas = document.getElementById(`${this.ID_SECTION_TOGGLE}${this.numberIndexMember}`).className;
    const isShow = clas.indexOf('show');
    if (isShow !== -1) {
      return true;
    } else {
      return false;
    }
  }

}
