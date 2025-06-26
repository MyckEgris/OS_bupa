/**
* ClaimFormStep1MemberComponent.ts
*
* @description: This class shows step 1 Member of claim submission wizard.
* @author Jaime Trujillo
* @version 1.0
* @date 08-09-2020.
*
*/


import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Store } from '@ngrx/store';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { ClaimFormWizard } from '../../claim-form-wizard/entities/ClaimFormWizard';
import { ClaimFormWizardService } from '../../claim-form-wizard/claim-form-wizard.service';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { FormControl } from '@angular/forms';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { PolicyHelperService } from 'src/app/shared/services/policy-helper/policy-helper.service';
import { PolicyNatureId } from 'src/app/shared/classes/policy-nature.enum';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';


/**
 * This class shows step 1 Member of claim submission wizard.
 */
@Component({
  selector: 'app-claim-form-step1-member',
  templateUrl: './claim-form-step1-member.component.html'
})
export class ClaimFormStep1MemberComponent implements OnInit, OnDestroy {

  /**
   * Constant to identify the ClaimSubmissionWizard current step 1
   */
  public currentStep = 1;

  /**
  * for validate required fields
  */
  public showValidations: boolean;

  /**
   * ClaimSubmissionWizard Object
   */
  public wizard: ClaimFormWizard;

  /**
  * Wizard Subscription.
  */
  public subWizard: Subscription;

  /**
  * User object.
  */
  public user: UserInformationModel;

  /**
   * Const to Identify current step.
   */
  public STEP1 = 'step1';

  /**
   * Const to Identify next step.
   */
  public STEP2 = 'step2';

  /**
   *  Claim type search Type form control.
   */
  public CLAIM_PAY_SEARCH_TYPE_CTRL = 'claimPayType';

  /**
   *  Claim form payment type transfert id.
   */
  public CLAIM_FORM_PAYMENT_TYPE_TRANSFERT = 1;

  /**
   *  Claim form payment type refund id.
   */
  public CLAIM_FORM_PAYMENT_TYPE_REFUND = 2;

  /**
   * Claim pay search type value for transfer.
   */
  public CLAIM_SEARCH_PAY_TYPE_TRANSFER = 'by_transfer';

  /**
   * Claim pay search type value for refund.
   */
  public CLAIM_SEARCH_PAY_TYPE_REFUND = 'by_refund';

  /**
   * Claim pay search type value for refund.
   */
  public CLAIM_FORM_BRAZIL = 24;

  /**
   * Array for policy search types
   */
  public claimPaySearchTypes: Array<any>;

  /**
   * Place holder text for policy input field.
   */
  public policyInputPlaceHolder = '';

  /**
  * PhoneNUmber policy holder.
  */
  public policyHolder: PolicyDto = null;

  /**
  * PhoneNUmber policy holder country policy.
  */
  public countryPolicy: boolean;

  /**
   * Member Seleted.
   */
  public member: MemberOutputDto = null;

  /**
   * 
   */
  public readonly PAGE_SIZE: number = 1;

  /**
   * 
   */
  public readonly PAGE_INDEX: number = 1;

  /**
   * Member in Session
   */
  private memberInSession: MemberOutputDto = null;


  /**
   * Constructor Method
   * @param claimFormWizardService Claim Submission Service Injection
   * @param router Router Injection
   * @param userInfoStore User Information Store Injection
   * @param policyService Policy Service Injection
   * @param uploadService UploadService Service Injection
   */
  constructor(
    private claimFormWizardService: ClaimFormWizardService,
    private router: Router,
    private policyService: PolicyService,
    private config: ConfigurationService,
    private authService: AuthService,
    private translate: TranslateService,
    private notification: NotificationService,
    private policyHelper: PolicyHelperService
  ) { }

  /**
  * Ends the component operation.
  */
  ngOnDestroy() {
    if (this.subWizard) { this.subWizard.unsubscribe(); }
  }

  /**
   * Initialize component. Get user information from redux store.
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subWizard = this.claimFormWizardService.beginWizard(
      wizard => {
        this.wizard = wizard;
        this.policyHolder = this.wizard.policyHolder;
        if (!this.policyHolder) {
          this.setPolicyHolderData();
        }
        this.member = this.wizard.member;
      }, this.currentStep, this.user
    );

    this.initiateComponent();
  }


  public initiateComponent() {
    this.claimPaySearchTypes = this.getClaimPayTypesArray();
  }

  /**
  * Sets the policy search type array.
  */
  getClaimPayTypesArray() {
    return [
      { value: this.CLAIM_SEARCH_PAY_TYPE_TRANSFER },
      { value: this.CLAIM_SEARCH_PAY_TYPE_REFUND }
    ];
  }

  /**
   * This Function allow select a policy to create and associate a claim.
   * @param member
   */
  initialVariables() {
    this.wizard.policyHolder = null;
    this.wizard.member = null;
    this.policyHolder = null;
    this.wizard.policyContact = null;
  }

  /**
   * Set Policy Holder Data.
   */
  setPolicyHolderData() {
    this.policyService.getDetailPolicyByPolicyId(
      this.user.role_id, this.user.user_key, Number(this.user.user_key), '', 'claimsearch'
    ).subscribe(
      details => {

        const members = details.members;

        if (members.length > 0) {

          this.policyHolder = details;

          this.wizard.policyHolder = details;

          const phone = this.wizard.policyHolder.phones.find(x => x.phoneTypeId === 1004);
          this.policyHolder.phone = phone ? phone.phoneNumber : '';
          this.wizard.policyHolder.phone = this.policyHolder.phone;
          const email = this.wizard.policyHolder.emails.find(x => x.emailTypeId === 1);
          this.policyHolder.email = email ? email.eMailAddress : '';
          this.wizard.policyHolder.email = this.policyHolder.email;

          if (this.rolIsPolicyMemberAndPoclicyAreHealthOrTravelIndividualOrBTI) {

            // this.getMemberInSession(members);
            this.loadContactInformation(this.memberInSession);

            // if (this.memberInSessionIsGuardian) {
            //   this.wizard.policyHolder.members = [];
            //   // this.getPaginatedMembersByPolicyId();
            // } else if (members.length == 1) {
            //   this.member = this.memberInSession;
            //   this.selectMember();
            // }

          } else {
            this.wizard.policyContact = this.policyHolder;
          }
        } else {
          this.clearContactInformation();
          this.showModalPolicyMemberIsInactive();
        }

      }, error => {
        console.error(error);
      });
  }

  /**
   * Get nested form controls.
   * @param field Field.
   */
  public getControl(field: string): FormControl {
    return this.wizard.searchForm.get(field) as FormControl;
  }

  /**
   * Cancel button.
   */
  cancel() {
    this.router.navigate(['']);
  }

  /**
   * This function route to the next step (Step2).
   */
  next() {

    // if (this.memberInSessionIsGuardian) {
    //   this.wizard.member.memberId = this.memberInSession.memberId;
    // }

    const nextRoute = this.router.url.replace(this.STEP1, this.STEP2);
    this.router.navigate([`${nextRoute}`]);
    return false;
  }


  /**
   * Select Member from UI.
   */
  selectMember() {
    this.wizard.member = this.member;
  }

  /**
   * Policy Are Health Or Travel Individual
   */
  get policyAreHealthOrTravelIndividual(): boolean {
    const policyNatureId = this.wizard.policyHolder.policyNatureId;
    let policyNatureIds: number[] = [PolicyNatureId.HEALTH, PolicyNatureId.TRAVEL];
    return (policyNatureIds.includes(policyNatureId))
  }

  /**
   * Rol Is PolicyMember And have Health Or Travel Individual Or BTI Poclicy
   */
  get rolIsPolicyMemberAndPoclicyAreHealthOrTravelIndividualOrBTI(): boolean {
    const policyNatureId = this.wizard.policyHolder.policyNatureId;
    let policyNatureIds: number[] = [PolicyNatureId.HEALTH, PolicyNatureId.TRAVEL, PolicyNatureId.TRAVELBTI];
    return (policyNatureIds.includes(policyNatureId) && Number(this.user.role_id) === Rol.POLICY_MEMBER)
  }

  /**
   * Load Contact Information
   * @param member 
   */
  private loadContactInformation(member: MemberOutputDto): void {
    if (member) {
      const eMailAddress = (member.emails && member.emails.length) ? member.emails.find(x => x.emailTypeId === 1).eMailAddress : '';
      const phoneNumber = (member.phones && member.phones.length) ? member.phones[0].phoneNumber : '';
      this.wizard.policyContact = {
        firstName: member.firstName,
        lastName: member.lastName,
        ownerDob: member.dob,
        email: eMailAddress,
        phone: phoneNumber,
      }
    }
  }

  // private getPaginatedMembersByPolicyId(): void {

  //   this.policyService.getPaginatedMembersByPolicyId(
  //     this.user.role_id, this.user.user_key, Number(this.user.user_key), 'claimsearch',
  //     this.PAGE_INDEX, this.PAGE_SIZE
  //   ).subscribe(response => {
  //     const members: MemberOutputDto[] = response.data[0].members;
  //     this.wizard.policyHolder.members = members;
  //     this.getMemberInSession(members);
  //     if (members.length == 1) {
  //       this.member = this.memberInSession;
  //       this.selectMember();
  //     }

  //   })

  // }

  /**
   * 
   * @param members 
   * @returns 
   */
  // private getMemberInSession(members: MemberOutputDto[]): void {
  //   this.memberInSession = members.find(x => x.memberId === Number(this.user.member_id));
  // }


  /**
   * 
   * @returns 
   */
  // private get memberInSessionIsGuardian(): boolean {
  //   return this.memberInSession && this.memberInSession.isGuardian;
  // }

  /**
   * Rol Is PolicyMember
   */
  private get rolIsPolicyMember(): boolean {
    return Number(this.user.role_id) === Rol.POLICY_MEMBER;
  }

  /**
   * Rol Is PolicyHolder
   */
  private get rolIsPolicyHolder(): boolean {
    return Number(this.user.role_id) === Rol.POLICY_HOLDER;
  }

  /**
 * Rol Is Group Policy Holder
 */
  private get rolIsGroupPolicyHolder(): boolean {
    return Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER;
  }

  /**
   * show Modal PolicyMember Is Inactive
   *
   */
  private async showModalPolicyMemberIsInactive() {

    let title: string;
    let message: string;
    let acceptText: string;

    let titleKey = 'APP.MESSAGE.PRE_AUTHORIZATION.POLICYMEMBER_NOT_ACTIVE.TITLE';
    let messageKey = 'APP.MESSAGE.PRE_AUTHORIZATION.POLICYMEMBER_NOT_ACTIVE.MESSAGE';
    let acceptTextKey = 'APP.BUTTON.ACEPT_BTN';

    this.translate.get(titleKey).subscribe(t => title = t);
    this.translate.get(messageKey).subscribe(m => message = m);
    this.translate.get(acceptTextKey).subscribe(m => acceptTextKey = m);

    const response = await this.notification.showDialog(title, message, false, acceptTextKey);
    if (response) {
      document.location.href = 'claims/my-claims-agent';
    }

  }

  private clearContactInformation(): void {
    this.wizard.policyContact = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  }

}
