/**
* ClaimViewAgentComponent.ts
*
* @description: This component handles agent claims view interactions.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { ConfigurationService } from './../../shared/services/configuration/configuration.service';
import { ClaimService } from './../../shared/services/claim/claim.service';
import { AuthService } from './../../security/services/auth/auth.service';
import { ClaimDto } from './../../shared/services/claim/entities/claim.dto';
import { Utilities } from './../../shared/util/utilities';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Claim } from '../../shared/services/claim/entities/claims';
import * as $ from 'jquery';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClaimUpdateWizardService } from 'src/app/shared/services/claim/claim-update-wizard.service';
import { ClaimUpdateWizard } from 'src/app/shared/services/claim/entities/claim-update-wizard';
import { RoleService } from 'src/app/shared/services/roles/role.service';
import { Policy } from 'src/app/shared/services/claim/entities/policy';
import { Member } from 'src/app/shared/services/claim/entities/member';

/**
 * This component handles agent claims view interactions.
 */
@Component({
  selector: 'app-claim-view-agent',
  templateUrl: './claim-view-agent.component.html',

})
export class ClaimViewAgentComponent implements OnInit {

  /**
   * Constant for default claim type selected index
   */
  private DEFAULT_OPTION_SELECTED = 0;

  /**
  * Constant for time to delay (ms)
  */
  private TIME_TO_DELAY = 1000;

  /**
   * Constant for advanced options selector
   */
  private ID_ADVANCED_OPTIONS = '#ig-textomasopciones';

  /**
   * Constant for type PDF
   */
  private PDF_APPLICATION_RESPONSE = 'application/pdf';

  /**
   * Init page for pagination component
   */
  private INIT_PAGE = 1;

  /**
   * Page size for pagination component
   */
  private PAGE_SIZE = 10;

  /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Title for business exception modal message
   */
  private BUSINESS_EXCEPTION_TITLE = 'Business Exception';

  /**
  * Constant for error code status # 302 for EOB result
  */
  private STATUS_FOR_FOUND = 302;

  /**
   * Constant for details toggle selector
   */
  private ID_DETAIL_TOGGLE = '#ig-detallereclamo-';

  /**
   * user
   */
  private user: any;

  /**
   * Claim types Array
   */
  public claimStatus: Array<any>;

  /**
   * Payment Type Array
   */
  public paymentType: Array<any>;

  /**
   * Form group for claim view reactive form
   */
  public claimViewForm: FormGroup;

  /**
 * Initilization for Claims object
 */
  public claims: ClaimDto = { data: [], pageIndex: 1, pageSize: 0, count: 0 };

  /**
   * Collection size for pagination component
   */
  public collectionSize: number = null;

  /**
   * Language Id for EOB document
   */
  public languageId: number;

  /**
   * Error variable for business esceptions
   */
   public errorTitle = '';

  /**
   * Error variable for business esceptions
   */
  public errorDetail = '';

  /**
 * currencyUsdId
 */
  public currencyUsdId: number;

  /**
   * currencyUsdSymbol
   */
  public currencyUsdSymbol: string;

  /**
   * claimStatusFilter
   */
  public claimStatusFilter: string;

  /**
   * Current page for pagination component
   */
  public page: number;

  /**
   * policyId
   */
  public policyId: number;

  /**
   * IS_POLICY_HOLDER
   */
  public IS_POLICY_HOLDER = false;

  /**
   * hasPermissionCreateClaimSubmission
   */
  public hasPermissionCreateClaimSubmission: boolean;

  /**
   * hasPermissionToUpdateCloseClaim
   */
  public hasPermissionToUpdateCloseClaim: boolean;

  /**
   * policy abd member info list
   */
  public policiesInfo: Array<{ policy: Policy, member: Member }>;

  /**
  * Claims source
  * BupaMex = 1
  * BupaBGLA = 2
  */
  public claimsFromSource = 1;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private claimsService: ClaimService,
    private notification: NotificationService,
    private translation: TranslationService,
    private configuration: ConfigurationService,
    private router: Router,
    private claimUpdate: ClaimUpdateWizardService,
    private roleService: RoleService
  ) { }



  ngOnInit() {
    this.user = this.authService.getUser();
    this.page = this.INIT_PAGE;
    this.checkIfIsIndividualOrGroupPolicyHolder();
    this.claimStatus = this.getAgentStatus();
    this.paymentType = this.getPaymentMethods();
    this.currencyUsdId = this.configuration.currencyUsdId;
    this.currencyUsdSymbol = `${this.configuration.currencyUsdSymbol} `;
    Utilities.delay(this.TIME_TO_DELAY);
    this.claimViewForm = this.buildDefaultClaimViewForm();
    this.setValuesAccordingRole();
    this.roleService.GetRoleOptionsByRoleIdAndBupaInsurance(this.user.role_id, this.user.bupa_insurance)
      .subscribe(r => {
        this.hasPermissionCreateClaimSubmission = r.find(roleOpt => roleOpt.name === 'CLAIMSONLINE') ? true : false;
        this.hasPermissionToUpdateCloseClaim = r.find(roleOpt => roleOpt.name === 'UPDATECLOSECLAIMBUTTOM') ? true : false;
      });
    if (this.claimViewForm.untouched) {
      this.getClaimsByAgentRoleAndStateMemberName(0);
    }
  }

  setValuesAccordingRole() {
    this.policyId = (Number(this.user.role_id) === Rol.POLICY_HOLDER || (Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) ?
      this.user.policy_id : null);
    if (this.policyId) {
      this.claimViewForm.controls.policyId.setValue(this.policyId);
      this.claimViewForm.controls.policyId.disable();
    } else {
      if (this.claimsFromSource == 1)
      {
        this.claimViewForm.controls.policyId.setValue('');
      }
      this.claimViewForm.controls.policyId.enable();
    }
  }

  checkIfIsIndividualOrGroupPolicyHolder() {
    this.IS_POLICY_HOLDER = (Number(this.user.role_id) === Rol.POLICY_HOLDER || (Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER));
  }

  getAgentStatus() {
    return [
      { value: 'all' },
      { value: 'paid' },
      { value: 'pending' },
      { value: 'denied' },
      { value: 'closed' }
    ];
  }

  getPaymentMethods() {
    return [
      { value: 'select' },
      { value: 'ACH' },
      { value: 'CK' },
      { value: 'WT' }
    ];
  }

  private buildDefaultClaimViewForm() {
    return new FormGroup({
      selectedClaimStatus: new FormControl(this.claimStatus[this.DEFAULT_OPTION_SELECTED].value),
      policyId: new FormControl(''),
      legacyNumber: new FormControl(''),
      claimsListLogId: new FormControl(''),
      claimNumber: new FormControl(),
      claimantLastName: new FormControl(''),
      providerName: new FormControl(''),
      selectedPaymentType: new FormControl(this.paymentType[this.DEFAULT_OPTION_SELECTED].value, Validators.required),
      paymentNumber: new FormControl('')
    });
  }

  /**
   * Changes payment number validators.
   * @param value PaymentTypeSelected.
   */
  setPaymentNumberValidations(value: string) {
    this.claimViewForm.controls.paymentNumber.clearValidators();
    if (value !== 'select') {
      this.claimViewForm.controls.paymentNumber.markAsUntouched();
      this.claimViewForm.controls.paymentNumber.enable();
      this.claimViewForm.controls.paymentNumber.setValidators([Validators.required]);
    } else {
      this.claimViewForm.controls.paymentNumber.reset();
    }

    this.claimViewForm.controls.paymentNumber.setValue('');
    this.claimViewForm.updateValueAndValidity();
  }
  
  clearFields(cleanAllform: boolean) {

    if (cleanAllform === true) {
      this.claimViewForm.controls.selectedClaimStatus.setValue(this.claimStatus[this.DEFAULT_OPTION_SELECTED].value);
    }
    this.claimViewForm.controls.selectedPaymentType.setValue(this.paymentType[this.DEFAULT_OPTION_SELECTED].value, Validators.required);
    this.claimViewForm.controls.paymentNumber.reset();
    this.claimViewForm.controls.paymentNumber.clearValidators();
    this.claimViewForm.controls.paymentNumber.setValue('');
    if (!this.claimViewForm.controls.policyId && this.claimsFromSource==1)
      this.claimViewForm.controls.policyId.setValue('');
    this.claimViewForm.controls.legacyNumber.setValue('');
    this.claimViewForm.controls.claimsListLogId.setValue('');
    this.claimViewForm.controls.claimNumber.setValue('');
    this.claimViewForm.controls.claimantLastName.setValue('');
    this.claimViewForm.controls.providerName.setValue('');
    this.setValuesAccordingRole();
    this.claimViewForm.updateValueAndValidity();
    if (!this.claimViewForm.controls.policyId && this.claimsFromSource==1)
    {
      this.page = this.INIT_PAGE;
      this.claims = { data: [], pageIndex: 1, pageSize: 0, count: 0 };
      this.collectionSize = null;
    }
  }

  /**
   * Search claims by member name and state equals proccess
   */
  getClaimsByAgentRoleAndStateMemberName(page: number) {
    const user = this.authService.getUser();
    const form = this.claimViewForm.getRawValue();
    this.claimStatusFilter = this.claimsFromSource === 2 ? 'all' : form.selectedClaimStatus;
    this.page = page === 0 ? this.INIT_PAGE : page;
    if (this.claimsFromSource === 2 && form.policyId === '') { 
      this.languageId = this.translation.getLanguageId();
      this.translate.stream('APP.HTTP_ERRORS.ERROR_TITLE.400').subscribe(er => {
        this.errorTitle = er;
      });
      this.translate.stream('APP.MESSAGE.ALERT_POLICY_NUMBER').subscribe(er => {
        this.errorDetail = er;
      });
      this.notification.showDialog(this.errorTitle,this.errorDetail);
    }
    else {
    this.claimsService.getClaimsByAgentRoleAndStateAndAdvancedOptions(user.user_key, user.role_id,
      this.claimStatusFilter, this.PAGE_SIZE, this.page, form.claimantLastName, form.policyId,
      form.legacyNumber, form.providerName, form.selectedPaymentType, form.paymentNumber,
      form.claimNumber, this.claimsFromSource, form.claimsListLogId).subscribe(
        data => {
          this.claims = data;
          this.claims.data.forEach(cl => {
            cl.currencySymbol = cl.currencySymbol != null ? `${cl.currencySymbol.toUpperCase()} ` : ' ';
          });
          this.collectionSize = this.claims.count;
          this.policiesInfo = this.removeDuplicatesFromPoliciesList(this.claims.data);
        }, error => {
          this.claims = { data: [], pageIndex: 1, pageSize: 0, count: 0 };
          if (this.checksIfHadBusinessError(error)) {
            this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
          } else if (this.checksIfHadNotFoundError(error)) {
            this.collectionSize = 0;
          }
        }
      );
    }
  }

  /**
   * Get claim detail and add to claim object
   * @param claimDetailId Claim Detail ID
   * @param claim Claim object
   */
  getClaimDetailAndAddToClaimObject(claim: Claim) {
    this.languageId = this.translation.getLanguageId();
    this.claimsService.getDetailsForClaim(claim.claimDetailId,this.claimsFromSource).subscribe(
      details => {
        this.errorDetail = '';
        claim.claimLinesDetails = details;
      }, error => {
        claim.claimLinesDetails = [];
        if (this.checksIfHadBusinessError(error)) {
          this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
        } else if (this.checksIfHadNotFoundError(error)) {
          this.translate.stream('CLAIMS.PROCESSED_CLAIMS.DETAIL_NOT_FOUND').subscribe(er => {
            this.errorDetail = er;
          });
        }
      }
    );
  }

  /**
   * Get explain of benefits document
   * @param claimDetailId Claim detail ID
   */
  /*getClaimEob1(claimDetailId, businessId) {
    const user = this.authService.getUser();
    this.claimsService.getEobForClaim(claimDetailId, user.role_id, businessId).subscribe(
      data => {
        const file = new Blob([new Uint8Array(data)], { type: this.PDF_APPLICATION_RESPONSE });
        const fileUrl = window.URL.createObjectURL(file);
        this.claimsService.showClaimEobDialog(fileUrl);
      },
      error => {
        if (this.checksIfHadNotFoundError(error)) {
          this.translate.stream('CLAIMS.PROCESSED_CLAIMS.EOB_NOT_FOUND').subscribe(er => {
            this.errorDetail = er;
          });
          this.notification.showDialog('Not Data Found', this.errorDetail);
        }
      });
    return false;
  }*/

  /**
   * Get explain of benefits document
   * @param claimDetailId Claim detail ID
   */
  getClaimEob(claimDetailId, businessId) {
    const user = this.authService.getUser();
    if (businessId === 0) {
      businessId = user.bupa_insurance;
    }

    this.claimsService.getEobForClaim(claimDetailId, user.role_id, businessId).subscribe(
      data => {
        const file = new Blob([new Uint8Array(data)], { type: this.PDF_APPLICATION_RESPONSE });
        const date = new Date();
        const fileName = `EOB-${Utilities.generateRandomId()}`;
        saveAs(file, fileName + '.' + 'pdf');
      }, error => {
        if (this.checksIfHadNotFoundError(error)) {
          this.translate.get('CLAIMS.PROCESSED_CLAIMS.EOB_NOT_FOUND').subscribe(er => {
            this.errorDetail = er;
          });
          this.notification.showDialog('Not Data Found', this.errorDetail);
        }
      });
    return false;
  }

  /**
* Jquery function to toggle more options
*/
  toggleSlideAdvancedOptions() {
    $(this.ID_ADVANCED_OPTIONS).slideToggle();
  }

  /**
   * Check if response has error code to show business exception
   * @param error Http Error
   */
  checksIfHadBusinessError(error) {
    return error.error.code;
  }

  /**
   * Check if status is 404 and show message for data not found
   * @param error Http Error
   */
  checksIfHadNotFoundError(error) {
    return (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND);
  }

  /**
   * Check if status is 302 and show message for found
   * @param error Http Error
   */
  checksIfHasFoundState(error) {
    return (error.status === this.STATUS_FOR_FOUND);
  }

  /**
   * Jquery function to toggle claim details
   * @param detail Claim Id
   */
  toggleSlideDetail(claim) {
    $(this.ID_DETAIL_TOGGLE + claim.claimNumber).slideToggle();
    if (!($(this.ID_DETAIL_TOGGLE + claim.claimNumber).height() > 1)) {
      this.getClaimDetailAndAddToClaimObject(claim);
    }
  }

  viewAllClaimsByMemberId(memberId: number) {
    if (memberId) {
      this.router.navigate([`/claims/all-claims/${memberId}`]);
    } else {
      this.notification.showDialog('Not Member Found', 'Lost member id');
    }
  }

  canUpdateClaims(claim: Claim) {
    const statusCanUpdate = 'Incomplete';
    return (
      (this.hasPermissionToUpdateCloseClaim) &&
      (statusCanUpdate.indexOf(claim.statusName.trim()) > -1) &&
      (claim.isOpen === 1)
    );
  }

  goToUpdateClaim(claim) {
    this.claimUpdate.claim = claim;
    this.router.navigate(['claims/claim-update']);
  }

  routeToCreateClaimBtn() {
    this.router.navigate(['/claims/claim-submission']);
  }

  removeDuplicatesFromPoliciesList(policiesList) {
    const flag = {};
    const uniques = [];
    policiesList.forEach(item => {
      if (!flag[item.member.memberId]) {
        flag[item.member.memberId] = true;
        uniques.push({ 'policy': item.policy, 'member': item.member });
      }
    });
    return uniques;
  }

  getClaimsByMember(memberId: number): Claim[] {
    const filteredClaims: Claim[] = [];
    this.claims.data.forEach(claim => {
      if (claim.member.memberId === memberId) {
        filteredClaims.push(claim);
      }
    });
    return filteredClaims;
  }

  claimSourceChanged(source: number) {
    this.claimsFromSource = source;
    //limpiar filtros
    this.clearFields(false);

    if (!this.IS_POLICY_HOLDER && source === 2) {
      //Limpia la data para e Source para el valor 2 
      this.claims = { data: [], pageIndex: 1, pageSize: 0, count: 0 };
    }
    else {
      this.getClaimsByAgentRoleAndStateMemberName(0);
    }
  }
}
