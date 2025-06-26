/**
* ClaimFormStep1-1Component.ts
*
* @description: This class shows step 1-1 Payment information of claim submission wizard.
* @author Jose Daniel Hernandez M
* @version 1.0
* @date 18-09-2020.
*
*/


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Store, select } from '@ngrx/store';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { ClaimFormWizard } from '../claim-form-wizard/entities/ClaimFormWizard';
import { ClaimFormWizardService } from '../claim-form-wizard/claim-form-wizard.service';
import { Subscription } from 'rxjs';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { UploadService } from 'src/app/shared/upload/upload.service';
import * as moment from 'moment';
import { FormControl, Validators } from '@angular/forms';
import { FinanceService } from 'src/app/shared/services/finance/finance.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { PolicyNatureId } from 'src/app/shared/classes/policy-nature.enum';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';


/**
 * This class shows step 1-1 Payment information of claim submission wizard.
 */
@Component({
  selector: 'app-claim-form-step1-1',
  templateUrl: './claim-form-step1-1.component.html'
})
export class ClaimFormStep1PaymentComponent implements OnInit {


  /**
   * Constant to identify the ClaimSubmissionWizard current step 1
   */
  public currentStep = 2;

  /**
   * ClaimFormWizard Object
   */
  public wizard: ClaimFormWizard;

  /**
  * Wizard Subscription.
  */
  public subWizard: Subscription;

  /**
   * Const to Identify current step.
   */
  public STEP2 = 'step2';

  /**
   * Const to Identify next step.
   */
  public STEP3 = 'step3';

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
  * PhoneNUmber policy holder country policy.
  */
  public showPaymentMethodTypeSelect: boolean;

  /**
   * show Bank Information.
   */
  public showBankInformation: boolean;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /**
   * Flag for step1 agent subStep
   */
  public subStepAgent = false;

  /**
   * Flag for step1 member subStep
   */
  public subStepMember = false;

  /**
   * Flag for step1 provider subStep
   */
  public subStepProvider = false;


  public isReadOnly = true;
  /**
   * User Rol enum
   */
  public rol = Rol;

  public bankAccountType = 0;

  private MANDATORY_TITLE_WARNING = 'POLICY.APPLICATION.STEP2.HEALTH_WARNING_TITLE';
  private MANDATORY_TITLE_WARNING_DESCRIPTION_BANK = 'POLICY.APPLICATION.STEP2.HEALTH_WARNING_DESCRIPTION_BANK';
  private CONTINUE_YES = 'APP.BUTTON.YES_BTN';
  private CONTINUE_NO = 'APP.BUTTON.NO_BTN';


  /**
   * Constructor Method
   * @param claimFormWizardService Claim Form Service Injection
   * @param router Router Injection
   * @param policyService Policy Service Injection
   * @param uploadService UploadService Service Injection
   */
  constructor(
    private claimFormWizardService: ClaimFormWizardService,
    private router: Router,
    private translate: TranslateService,
    private uploadService: UploadService,
    private financeService: FinanceService,
    private config: ConfigurationService,
    private authService: AuthService,
    private notification: NotificationService,
  ) { }

  /**
   * Initialize component. Get user information from redux store.
   */
  ngOnInit() {

    this.user = this.authService.getUser();
    this.wizard = this.claimFormWizardService.continueWizard(this.currentStep, this.user);
    this.loadClaimPaymentSearchType();
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
   * Get nested form controls.
   * @param field Field.
   */
  public getControl(field: string): FormControl {
    return this.wizard.searchForm.get(field) as FormControl;
  }

  /**
   * Load Country Policy for claimPaySearchType.
   */
  loadClaimPaymentSearchType() {
    this.clearPayeeData();
    if (this.wizard.policyHolder && this.wizard.policyHolder.policyCountryId &&
      this.wizard.policyHolder.policyCountryId === this.CLAIM_FORM_BRAZIL) {
      this.showPaymentMethodTypeSelect = true;
      this.showBankInformation = false;
      if (this.wizard.claimPaymentMethoidId) {
        if (this.claimPaySearchTypes != undefined) {
          this.getControl('claimFormPayType').setValue(this.claimPaySearchTypes[this.wizard.claimPaymentMethoidId - 1].value);
        }
        if (this.wizard.claimPaymentMethoidId === this.CLAIM_FORM_PAYMENT_TYPE_TRANSFERT) {
          this.showBankInformation = true;
          this.setPayeeInformation();
        }
      }
    } else {
      this.showPaymentMethodTypeSelect = false;
      this.wizard.claimPaymentMethoidId = this.CLAIM_FORM_PAYMENT_TYPE_TRANSFERT;
      this.showBankInformation = true;
      this.setPayeeInformation();
    }
  }

  /**
   * Select Payment Type.
   */
  async selectPaymentType(event: any) {
    this.clearPayeeData();
    if (event) {
      if (event.target.value === this.CLAIM_SEARCH_PAY_TYPE_REFUND) {
        this.wizard.claimPaymentMethoidId = this.CLAIM_FORM_PAYMENT_TYPE_REFUND;
        this.wizard.claimPaymentMethod = await this.translate.get('CLAIMFORM.SEARCH_PAY_TYPE.BY_REFUND').toPromise();
        this.showBankInformation = false;
      } else {
        this.wizard.claimPaymentMethoidId = this.CLAIM_FORM_PAYMENT_TYPE_TRANSFERT;
        this.wizard.claimPaymentMethod = await this.translate.get('CLAIMFORM.SEARCH_PAY_TYPE.BY_TRANSFER').toPromise();
        this.showBankInformation = true;
        this.setPayeeInformation();
      }
    }
  }

  /**
   * Clear payee data.
   */
  clearPayeeData() {
    this.wizard.bankInformationId = null;
    this.getControl('bankAccountName').setValue('');
    this.getControl('bankAccountNumber').setValue('');
    this.getControl('bankAccountCurrency').setValue('');
    this.getControl('bankAccountClabe').setValue('');

  }

  /**
   * Set Payee Information.
   */
  setPayeeInformation() {
    let policyNatureId = 0;
    let memberId = 0;
    if (this.handleIsBTIPolicy) {
      policyNatureId = this.wizard.policyHolder.policyNatureId;
      memberId = this.wizard.member.guardianMemberId ? Number(this.wizard.member.guardianMemberId) : Number(this.wizard.member.memberId)
    }
    if (this.wizard && this.wizard.policyHolder) {
      this.financeService.getPayeesByPolicy(
        this.wizard.policyHolder.policyId.toString(),
        policyNatureId,
        memberId
      ).subscribe(payess => {
        this.loadPayees(payess);
      }, error => {
        this.wizard.bankInformationId = null;
      });
    }
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    const nextRoute = this.router.url.replace('step2', 'step1');
    this.router.navigate([`${nextRoute}`]);
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
  async next() {
    const cancel = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.CANCEL').toPromise();
    const yes = await this.translate.get(this.CONTINUE_YES).toPromise();
    const not = await this.translate.get(this.CONTINUE_NO).toPromise();

    if (this.wizard.bankInformationId == null) {
      const sureNext = await this.notification.showDialog(this.MANDATORY_TITLE_WARNING, this.MANDATORY_TITLE_WARNING_DESCRIPTION_BANK, true, yes, not);
      if (sureNext) {
        const nextRoute = this.router.url.replace(this.STEP2, this.STEP3);
        this.router.navigate([`${nextRoute}`]);
      }
    } else {
      const nextRoute = this.router.url.replace(this.STEP2, this.STEP3);
      this.router.navigate([`${nextRoute}`]);
    }
  }

  getAccountType() {
    switch (this.wizard.searchForm.value.bankAccountName.toUpperCase()) {
      case 'SAVING': {
        this.bankAccountType = 1;
        break;
      }
      case 'CHECKING':
        this.bankAccountType = 2;
        break;
      default:
        this.bankAccountType = 1;
        break;
    }
  }

  public get handleIsHolder(): boolean {
    const rolesIds = [Rol.POLICY_HOLDER, Rol.GROUP_POLICY_HOLDER];
    return (rolesIds.includes(Number(this.user.role_id)));
  }

  /**
   * Role is PolicyMember
   */
  public get handleIsPolicyMember(): boolean {
    return (this.user.role_id === String(Rol.POLICY_MEMBER));
  }

  /**
   * They are health or travel Individual policy
   * @returns 
   */
  public get handleAreHealtOrTravelPolicy(): boolean {
    const policyNatureId = this.wizard.policyHolder.policyNatureId;

    let policyNatureIds: number[] = [PolicyNatureId.HEALTH, PolicyNatureId.TRAVEL];
    return (policyNatureIds.includes(policyNatureId));
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

  /**
   * Load Payess
   * @param payess 
   */
  private loadPayees(payess: any = null): void {

    if (payess.payees && payess.payees.length > 0) {
      // if(payess.payees[0].beneficiaryBankId)
      this.getControl('bankAccountName').setValue(payess.payees[0].bankAccountType);
      this.getControl('bankAccountNumber').setValue(payess.payees[0].accountNumber);
      this.getControl('bankAccountCurrency').setValue(payess.payees[0].currencyCode);
      this.getControl('bankAccountClabe').setValue(payess.payees[0].clabe);
      this.wizard.bankInformationId = payess.payees[0].payeeId;
      this.getAccountType();

    }


  }

}
