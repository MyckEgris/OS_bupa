/**
* ClaimFormStep1AgentComponent.ts
*
* @description: This class shows step 1 Agent of claim Form wizard.
* @author Juan Camilo
* @version 1.0
* @date 08-09-2020.
*/

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { ClaimFormWizard } from '../../claim-form-wizard/entities/ClaimFormWizard';
import { ClaimFormWizardService } from '../../claim-form-wizard/claim-form-wizard.service';
import { Subscription } from 'rxjs';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { FormControl, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyHelperService } from 'src/app/shared/services/policy-helper/policy-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { PolicyNatureId } from 'src/app/shared/classes/policy-nature.enum';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { Rol } from 'src/app/shared/classes/rol.enum';


/**
 * This class shows step 1 Agent of claim submission wizard V2.
 */
@Component({
  selector: 'app-claim-form-step1-agent',
  templateUrl: './claim-form-step1-agent.component.html'
})
export class ClaimFormStep1AgentComponent implements OnInit, OnDestroy {

  /**
   * Constant to identify the ClaimSubmissionWizard current step 1
   */
  public currentStep = 1;

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * ClaimFormWizard Object
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
   *  Search Type form control.
   */
  public SEARCH_TYPE_CTRL = 'searchType';

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
   *  Policy Id form control.
   */
  public POLICY_ID_CTRL = 'policyId';

  /**
   *  Policy legacy form control.
   */
  public POLICY_LEGACY_CTRL = 'policyLegacy';

  /**
   *  Policy Names form control.
   */
  public POLICY_NAMES_CTRL = 'policyNames';

  /**
   *  Policy Names form control.
   */
  public POLICY_LAST_NAMES_CTRL = 'policyLastNames';

  /**
   * Search type value for policy member.
   */
  public SEARCH_TYPE_POLICY_NAME = 'by_member';

  /**
   * Search type value for policy.
   */
  public SEARCH_TYPE_POLICY_ID = 'by_policy';

  /**
   * Search type value for policy legacy.
   */
  public SEARCH_TYPE_POLICY_LEGACY = 'by_legacy';

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
  public policySearchTypes: Array<any>;

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
  * subPolicy.
  */
  private subPolicy: Subscription;

  /**
   * Is Policy BTI
   */
  public isPolicyBTI: boolean = false;

  /**
 * Member Seleted.
 */
  public member: MemberOutputDto = null;

  /**
   * Constructor Method
   * @param claimFormWizardService Claim Form Service Injection
   * @param router Router Injection
   * @param userInfoStore User Information Store Injection
   * @param policyService Policy Service Injection
   * @param uploadService UploadService Service Injection
   */
  constructor(
    private claimFormWizardService: ClaimFormWizardService,
    private router: Router,
    private policyService: PolicyService,
    private uploadService: UploadService,
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
    if (this.subPolicy) { this.subPolicy.unsubscribe(); }
  }

  /**
   * Initialize component. Get user information from redux store.
   */
  ngOnInit() {
    debugger;
    this.user = this.authService.getUser();
    this.subWizard = this.claimFormWizardService.beginWizard(
      wizard => {
        this.wizard = wizard;
        this.handleFormInput();
        this.valueChanges();
        this.setPolicyHolderFromWizard();
        this.policySearchTypes = this.getPolicySearchTypesArray();
        this.claimPaySearchTypes = this.getClaimPayTypesArray();
        this.member = this.wizard.member;
      }, this.currentStep
    );
    this.getControl(this.POLICY_ID_CTRL).setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
    this.getControl(this.POLICY_ID_CTRL).updateValueAndValidity();
  }

  /**
   * Sets form validations.
   */
  private handleFormInput() {
    // debugger
    if (this.wizard && !this.wizard.searchForm.contains(this.SEARCH_TYPE_CTRL)) {
      this.wizard.searchForm.addControl(this.SEARCH_TYPE_CTRL, new FormControl(this.SEARCH_TYPE_POLICY_ID, [Validators.required]));
      this.wizard.searchForm.get(this.SEARCH_TYPE_CTRL).updateValueAndValidity();
    }
  }


  /**
   * Subscribe to value changes.
   */
  valueChanges() {
    if (this.wizard) {
      //debugger
      this.getControl(this.SEARCH_TYPE_CTRL).valueChanges.subscribe(val => {
        if (val) {
          this.getControl(this.POLICY_ID_CTRL).setValue('');
          this.getControl(this.POLICY_ID_CTRL).updateValueAndValidity();
          this.getControl(this.POLICY_NAMES_CTRL).setValue('');
          this.getControl(this.POLICY_NAMES_CTRL).updateValueAndValidity();
          this.getControl(this.POLICY_LAST_NAMES_CTRL).setValue('');
          this.getControl(this.POLICY_LAST_NAMES_CTRL).updateValueAndValidity();
          this.getControl(this.POLICY_LEGACY_CTRL).setValue('');
          this.getControl(this.POLICY_LEGACY_CTRL).updateValueAndValidity();
          switch (this.getControl(this.SEARCH_TYPE_CTRL).value) {
            case this.SEARCH_TYPE_POLICY_NAME:
              this.policyInputPlaceHolder = 'CLAIMFORM.SEARCH_TYPE.BY_MEMBER';
              this.getControl(this.POLICY_ID_CTRL).setValidators([]);
              this.getControl(this.POLICY_ID_CTRL).updateValueAndValidity();
              this.getControl(this.POLICY_NAMES_CTRL).setValidators([]);
              this.getControl(this.POLICY_NAMES_CTRL).updateValueAndValidity();
              this.getControl(this.POLICY_LAST_NAMES_CTRL).setValidators([]);
              this.getControl(this.POLICY_LAST_NAMES_CTRL).updateValueAndValidity();
              this.getControl(this.POLICY_LEGACY_CTRL).setValidators([]);
              this.getControl(this.POLICY_LEGACY_CTRL).updateValueAndValidity();
              break;
            case this.SEARCH_TYPE_POLICY_ID:
              this.policyInputPlaceHolder = 'CLAIMFORM.SEARCH_TYPE.BY_ID';
              this.getControl(this.POLICY_ID_CTRL).setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
              this.getControl(this.POLICY_ID_CTRL).updateValueAndValidity();
              this.getControl(this.POLICY_NAMES_CTRL).setValidators([]);
              this.getControl(this.POLICY_NAMES_CTRL).updateValueAndValidity();
              this.getControl(this.POLICY_LAST_NAMES_CTRL).setValidators([]);
              this.getControl(this.POLICY_LAST_NAMES_CTRL).updateValueAndValidity();
              this.getControl(this.POLICY_LEGACY_CTRL).setValidators([]);
              this.getControl(this.POLICY_LEGACY_CTRL).updateValueAndValidity();
              break;
            case this.SEARCH_TYPE_POLICY_LEGACY:
              this.policyInputPlaceHolder = 'CLAIMFORM.SEARCH_BY_LEGACY';
              this.getControl(this.POLICY_ID_CTRL).setValidators([]);
              this.getControl(this.POLICY_ID_CTRL).updateValueAndValidity();
              this.getControl(this.POLICY_NAMES_CTRL).setValidators([]);
              this.getControl(this.POLICY_NAMES_CTRL).updateValueAndValidity();
              this.getControl(this.POLICY_LAST_NAMES_CTRL).setValidators([]);
              this.getControl(this.POLICY_LAST_NAMES_CTRL).updateValueAndValidity();
              this.getControl(this.POLICY_LEGACY_CTRL).setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]+$/)]);
              this.getControl(this.POLICY_LEGACY_CTRL).updateValueAndValidity();
              break;
          }
        }
      });
    }
  }

  /**
   * Sets the policy search type array.
   */
  getPolicySearchTypesArray() {
    if (!this.policySearchTypes) {
      //debugger
      return [
        { value: this.SEARCH_TYPE_POLICY_NAME },
        { value: this.SEARCH_TYPE_POLICY_ID },
        { value: this.SEARCH_TYPE_POLICY_LEGACY }
      ];
    }
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
   * This function allows to search the policy according to policy search type.
   */
  searchPoliciesByFilters() {
    //debugger;
    this.clearSearchPoliciesByFilter();
    switch (this.getControl(this.SEARCH_TYPE_CTRL).value) {
      case this.SEARCH_TYPE_POLICY_NAME:
        this.searchPolicyByNames();
        break;
      case this.SEARCH_TYPE_POLICY_ID:
        this.searchPolicyByPolicyId();
        break;
      case this.SEARCH_TYPE_POLICY_LEGACY:
        this.searchPolicyByPolicyLegacy();
        break;
    }
  }

  /**
   * Clear Search Policies by filters.
   */
  clearSearchPoliciesByFilter() {
    //debugger
    this.policyHolder = null;
    this.wizard.policyHolder = null;
    this.wizard.policySearchResult = [];
    this.wizard.member = null;
    this.isPolicyBTI = false;
    this.uploadService.removeAllDocuments();
    this.wizard.policyContact = null;
  }

  searchPolicyByPolicyId() {
    //debugger;
    this.clearSearchPoliciesByFilter();
    this.subPolicy = this.policyService.getDetailPolicyByPolicyIdAndExclueDetail(
      this.wizard.user.role_id, this.wizard.user.user_key, this.wizard.searchForm.value.policyId,
      null, true
    ).subscribe(data => {
      this.isPolicyBTI = (data.policyNatureId === PolicyNatureId.TRAVELBTI);
      this.wizard.policySearchResult = [data];
      this.selectDefaultFirstPolicy();
    }, error => {
      this.wizard.policySearchResult = [];
    });
  }

  /**
   * Search the policy members by policy legacy.
   */
  searchPolicyByPolicyLegacy() {
    //debugger
    this.clearSearchPoliciesByFilter();
    this.subPolicy = this.policyService.getPoliciesByFilter(
      this.wizard.user.role_id, this.wizard.user.user_key, 1, 10,
      null, null, this.wizard.searchForm.value.policyLegacy,
      null, null, null, null, null, null, null, null, null)
      .subscribe(
        data => {
          this.wizard.policySearchResult = data.data;
          this.selectDefaultFirstPolicy();
        },
        error => {
          this.wizard.policySearchResult = [];
        });
  }

  /**
  * Search the policy members by policy names.
  */
  searchPolicyByNames() {
    //debugger
    this.clearSearchPoliciesByFilter();
    this.subPolicy = this.policyService.getPoliciesByFilter(
      this.wizard.user.role_id, this.wizard.user.user_key, 1, 10, null, null, null,
      this.wizard.searchForm.value.policyNames, this.wizard.searchForm.value.policyLastNames,
      null, null, null, null, null, null, null)
      .subscribe(
        data => {
          this.wizard.policySearchResult = data.data;
          this.selectDefaultFirstPolicy();
        },
        error => {
          this.wizard.policySearchResult = [];
        });
  }

  /**
   * Set defaultPolicy.
   */
  selectDefaultFirstPolicy() {
    //debugger
    if (this.wizard.policySearchResult && this.wizard.policySearchResult.length > 0) {
      this.policyHolder = this.wizard.policySearchResult[0];
      this.wizard.policyContact = this.policyHolder;
      this.selectPolicy();
    }
  }

  /**
   * This Function allow select a policy to create and associate a claim.
   * @param member
   */
  selectPolicy() {
    //debugger
    this.wizard.policyHolder = null;
    this.wizard.member = null;
    this.member = null;
    this.setPolicyHolderData();
  }

  /**
   * Set Policy Holder Data.
   */
  setPolicyHolderData() {
    //debugger
    this.subPolicy = this.policyService.getDetailPolicyByPolicyId(
      this.user.role_id, this.user.user_key, this.policyHolder.policyId, '', 'claimsearch'
    ).subscribe(
      details => {
        this.wizard.policyHolder = details;
        const phone = this.wizard.policyHolder.phones.find(x => x.phoneTypeId === 1004);
        this.policyHolder.phone = phone ? phone.phoneNumber : '';
        this.wizard.policyHolder.phone = this.policyHolder.phone;
        const email = this.wizard.policyHolder.emails.find(x => x.emailTypeId === 1);
        this.policyHolder.email = email ? email.eMailAddress : '';
        this.wizard.policyHolder.email = this.policyHolder.email;
        this.wizard.policyContact = this.policyHolder;
      });
  }

  /**
  * Set PolicyHolder Seleted.
  */
  setPolicyHolderFromWizard() {
    //debugger
    if (this.wizard.policyHolder) {
      this.policyHolder = this.wizard.policySearchResult.find(x => x.policyId === this.wizard.policyHolder.policyId);
    }
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
    const nextRoute = this.router.url.replace(this.STEP1, this.STEP2);
    this.router.navigate([`${nextRoute}`]);
    return false;
  }


  /**
   * Select Member from UI.
   */
  selectMember() {

    this.wizard.member = this.member;

    if (this.handleIsBTIPolicy && this.handleIsAgent) {
      let policyContact: MemberOutputDto;
      const age = this.calculateAge(this.member.dob);
      const guardianMember = this.wizard.policyHolder.members.find(x => x.memberId === this.member.guardianMemberId);

      if (age >= 18) {
        policyContact = Object.assign({}, this.member);
      } else {
        policyContact = Object.assign({}, guardianMember);
      }

      this.loadContactInformation(policyContact);
    }
  }

  /**
   * They is health Policy
   * @returns
   */
  public get handleIsHealtPolicy(): boolean {
    return this.wizard.policyHolder.policyNatureId == PolicyNatureId.HEALTH;
  }

  /**
 * Is Travel Policy
 */
  public get handleIsTravelPolicy(): boolean {
    return this.wizard.policyHolder.policyNatureId == PolicyNatureId.TRAVEL;
  }

  /**
   * Role is Agent or Agent Assistant
   */
  public get handleIsAgent(): boolean {
    const rolesIds = [Rol.AGENT, Rol.AGENT_ASSISTANT];
    return (rolesIds.includes(Number(this.user.role_id)));
  }

  /**
   * Is BTI Policy
   */
  public get handleIsBTIPolicy(): boolean {
    const policyNatureId = this.wizard.policyHolder.policyNatureId;
    const policyNatureIds: number[] = [PolicyNatureId.TRAVELBTI];
    return (policyNatureIds.includes(policyNatureId));
  }


  private calculateAge(date): number {
    var todate = new Date();
    var cumpleanos = new Date(date);
    var age = todate.getFullYear() - cumpleanos.getFullYear();
    var m = todate.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && todate.getDate() < cumpleanos.getDate())) {
      age--;
    }
    return age;
  }

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
}
