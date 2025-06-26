import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { PolicyService } from '../../shared/services/policy/policy.service';
import * as $ from 'jquery';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Utilities } from 'src/app/shared/util/utilities';
import { PolicyResponse } from 'src/app/shared/services/policy/entities/policy-response.dto';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { PolicyPaymentsHistoricalComponent } from './policy-payments-historical/policy-payments-historical.component';
import { PaymentDto } from 'src/app/shared/services/policy/entities/payment.dto';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { Router } from '@angular/router';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { PolicyAutoDeductionRequestDto } from 'src/app/shared/services/policy/entities/policyAutoDeductionRequest.dto';

@Component({
  selector: 'app-policy-payments',
  templateUrl: './policy-payments.component.html'

})
export class PolicyPaymentsComponent implements OnInit {

  @Input() isChecked = false;
  /**
   * Init page for pagination component
   */
  private INIT_PAGE = 1;

  /**
   * Page size for pagination component
   */
  private PAGE_SIZE = 10;

  /**
   * Collection size for pagination component
   */
  public collectionSize: number = null;

  /**
   * Current page for pagination component
   */
  public page: number;

  /**
   * Constant for details toggle selector
   */
  private ID_DETAIL_TOGGLE = '#ig-detallePago-';

  /**
   * Flag for searching proccess
   */
  public searchProccess = false;

  /**
   * Flag for search filtered
   */
  public searchFiltered = false;

  /**
   * Policies Dto object
   */
  public policies: PolicyResponse = { count: 0, pageindex: 1, pageSize: 0, data: [] };

  /**
   * Stores the first name value so it will use it when paging.
   */
  private currentFilterFirstName: string;

  /**
   * Stores the status value so it will use it when paging.
   */
  private currentStatus: string;

  /**
   * Stores the last name value so it will use it when paging.
   */
  private currentFilterLastName: string;

  /**
   * Stores the filter type so it will use it when paging.
   */
  private currentFilterIsByPolicyNumber: boolean;

  /**
   * Stores the policy number value so it will use it when paging.
   */
  private currentFilterPolicyNumber: number;

  /**
   * Main form
   */
  public policyPaymentForm: FormGroup;

  /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Array for member search types
   */
  public memberSearchType: Array<any>;

  /**
   * Array for payment status search types
   */
  public paymentStatusSearch: Array<any>;

  /**
   * Stores the logged user information
   */
  private user: UserInformationModel;

  /**
   * Constant for default type selected index
   */
  private DEFAULT_MEMBER_TYPE_SELECTED = 0;

  /**
 * Constant for switch case select
 */
  private SEARCH_TYPE_CASE_SELECT = 'select';

  /**
   * Constant for switch case by policy
   */
  private SEARCH_TYPE_CASE_BY_POLICY = 'by_policy';

  /**
   * Constant for switch case by member
   */
  private SEARCH_TYPE_CASE_BY_MEMBER = 'by_member';

  /**
   * Constant for switch case by member
   */
  private SEARCH_TYPE_CASE_BY_STATUS = 'by_status';

  private SEARCH_TYPE_CASE_BY_ALL = 'by_all';

  /**
   * Constant for time to delay
   */
  private TIME_TO_DELAY = 1000;

  private CONFIRM_AUTODEDUCTION_TITLE = 'PAYMENTS.AUTODEDUCTION.MODAL_TITLE';
  private CONFIRM_AUTODEDUCTION_MESSAGE = 'PAYMENTS.AUTODEDUCTION.MODAL_MESSAGE';
  private CONFIRM_AUTODEDUCTION_YES = 'PAYMENTS.AUTODEDUCTION.MODAL_CONFIRM_YES';
  private CONFIRM_AUTODEDUCTION_NO = 'PAYMENTS.AUTODEDUCTION.MODAL_CONFIRM_NO';

  type1 = 'category1';
  type2 = 'category2';
  type3 = 'category3';

  payments: PaymentDto[] = [];

  @ViewChild(PolicyPaymentsHistoricalComponent) policyPaymentsHistoricalComponent: PolicyPaymentsHistoricalComponent;

  public showToPayMexicanPeso: boolean;
  public sizeColumnToPay = 6;
  public listStatusString: string;
  private listStatus: Array<string> = new Array<string>();
  public isMexico = false;

  public startInactivityMxPortal: Date;
  public endInactivityMxPortal: Date;
  public today: Date;


  /**
   * Constructor
   */
  constructor(
    private router: Router,
    private authService: AuthService,
    private notification: NotificationService,
    private policyService: PolicyService,
    private translate: TranslateService,
    private paymentService: PaymentService,
    public uploadService: UploadService
  ) { }

  // get accessor
  get value(): any {
    return this.isChecked;
  }

  // set accessor including call the onchange callback
  set value(value: any) {
    this.isChecked = value;
  }

  ngOnInit() {
    this.page = this.INIT_PAGE;
    this.user = this.authService.getUser();
    this.showToPayMexicanPesos();
    this.whichIsInsuranceBusiness();
    this.paymentStatusSearch = this.loadAndTranslateStatusSearchTypes();
    this.memberSearchType = this.loadAndTranslateSearchTypes();
    this.translate.onLangChange.subscribe(() => {
      this.memberSearchType = this.loadAndTranslateSearchTypes();
      this.paymentStatusSearch = this.loadAndTranslateStatusSearchTypes();
    });
    Utilities.delay(this.TIME_TO_DELAY);
    this.policyPaymentForm = this.buildForm();
    this.currentFilterIsByPolicyNumber = false;
    this.searchFiltered = false;
    if (Number(this.user.role_id) === Rol.POLICY_HOLDER) {
      this.searchPolicyById(Number(this.user.user_key));
    } else {
      this.searchPolicyByFilter(1, this.PAGE_SIZE);
    }
    this.policyPaymentForm.controls.searchMemberType.valueChanges.subscribe(val => this.setValidations(val));
  }

  /**
   * Builds search types control.
   */
  loadSearchTypes() {
    return [
      { value: 'select' },
      { value: 'by_policy' },
      { value: 'by_member' },
      { value: 'by_status' },
      { value: 'by_all' }
    ];
  }

  loadStatusSearchTypes() {
    return [
      { value: 'grace_period' },
      { value: 'lapsed' },
      { value: 'active' },
      { value: 'pending_payment' }
    ];
  }

  /**
   * Shows the selected options in the state filter
   * @param event onClick event
   * @param value selected / unselected value
   */
  changeValueFilterStatus(event, value) {
    const listTemp: Array<string> = new Array<string>();

    if (event.target.checked) {
      this.listStatus.push(value);
    } else {
      if (this.listStatus.indexOf(value) > -1) {
        this.listStatus.splice(this.listStatus.indexOf(value), 1);
      }
    }

    if (this.listStatus.length > 0) {
      this.listStatus.forEach(x => {
        this.translate.getTranslation('ENG').toPromise();
        this.translate.get(`PAYMENTS.PAYMENT_STATUS.${x.toUpperCase()}`).subscribe(
          result => {
            listTemp.push(result);
            this.listStatusString = listTemp.join();
          }
        );
      });
    } else {
      this.listStatusString = '';
    }
  }

  /**
   * Loads Search Type control by Language.
   */
  loadAndTranslateSearchTypes() {
    const searchTypes = this.loadSearchTypes();
    return searchTypes;
  }

  loadAndTranslateStatusSearchTypes() {
    const searchStatus = this.loadStatusSearchTypes();
    return searchStatus;
  }

  /**
   * When the user sets a new search, it goes here.
   * @param value Contains the value of the dropdown once the value changes
   */
  NewFilterPolicies(value: any) {
    this.policies = { count: 0, pageindex: 0, pageSize: 0, data: [] };
    const searchMemberType = value.searchMemberType;
    switch (searchMemberType) {
      case this.SEARCH_TYPE_CASE_SELECT:
        break;
      case this.SEARCH_TYPE_CASE_BY_MEMBER:
        this.searchFiltered = true;
        this.currentFilterIsByPolicyNumber = false;
        this.currentFilterFirstName = this.policyPaymentForm.controls.firstName.value;
        this.currentFilterLastName = this.policyPaymentForm.controls.lastName.value;
        this.currentFilterPolicyNumber = null;
        this.searchPolicyByFilter(this.INIT_PAGE, this.PAGE_SIZE);
        break;
      case this.SEARCH_TYPE_CASE_BY_POLICY:
        this.searchFiltered = true;
        this.currentFilterIsByPolicyNumber = true;
        this.currentFilterFirstName = '';
        this.currentFilterLastName = '';
        this.currentFilterPolicyNumber = this.policyPaymentForm.controls.policyId.value;
        this.searchPolicyById(this.policyPaymentForm.controls.policyId.value);
        break;
      case this.SEARCH_TYPE_CASE_BY_STATUS:
        this.searchFiltered = true;
        this.currentStatus = this.listStatusString;
        this.currentFilterIsByPolicyNumber = false;
        this.currentFilterFirstName = '';
        this.currentFilterLastName = '';
        this.currentFilterPolicyNumber = null;
        this.searchPolicyByFilter(this.INIT_PAGE, this.PAGE_SIZE);
        break;
      case this.SEARCH_TYPE_CASE_BY_ALL:
        this.searchFiltered = true;
        this.currentStatus = '';
        this.currentFilterIsByPolicyNumber = false;
        this.currentFilterFirstName = '';
        this.currentFilterLastName = '';
        this.currentFilterPolicyNumber = null;
        this.searchPolicyByFilter(1, this.PAGE_SIZE);
        break;
      default:
        break;
    }
  }

  /**
   * Whenever the dropdown value is changed, the validations are resetted here.
   * @param value Contains the value of the dropdown once the value changes
   */
  setValidations(value: any) {
    this.searchProccess = false;
    switch (value) {
      case this.SEARCH_TYPE_CASE_BY_POLICY:
        this.policyPaymentForm.controls.policyId.setValidators(
          [Validators.required, Validators.minLength(1), Validators.maxLength(10)]);
        this.clearValidatorsForm('policyId');
        this.removeValues();
        break;
      case this.SEARCH_TYPE_CASE_BY_MEMBER:
        this.clearValidatorsForm('firstName,lastName');
        this.removeValues();
        break;
      case this.SEARCH_TYPE_CASE_BY_STATUS:
        this.clearValidatorsForm('status');
        this.policyPaymentForm.controls.status.setValidators([Validators.required]);
        this.removeValues();
        break;
      case this.SEARCH_TYPE_CASE_BY_ALL:
        this.clearValidatorsForm('');
        this.removeValues();
        break;
      default:
        break;
    }
    this.policyPaymentForm.updateValueAndValidity();
  }

  clearValidatorsForm(notCleanValidator: string) {
    Object.keys(this.policyPaymentForm.controls).forEach(key => {
      if (!(notCleanValidator.indexOf(key) > -1)) {
        this.policyPaymentForm.get(key).clearValidators();
      }
    });
    this.listStatusString = '';
    this.listStatus = new Array<string>();
  }

  removeValues() {
    this.policyPaymentForm.controls.firstName.setValue('');
    this.policyPaymentForm.controls.lastName.setValue('');
    this.policyPaymentForm.controls.policyId.setValue('');
    this.policyPaymentForm.controls.status.setValue('');
    this.listStatusString = '';
    this.listStatus = new Array<string>();
  }

  /**
   * Updates pagination
   */
  changePageOfPolicies(page: number) {
    if (!page) { return; }
    if (this.currentFilterIsByPolicyNumber) {
      this.searchPolicyById(this.currentFilterPolicyNumber);
    } else {
      this.searchPolicyByFilter(page, this.PAGE_SIZE);
    }
  }

  /**
   * Searches in the policy API all policies matching the criteria used: either first name, last name or both.
   * @param memberFirstName first name owner
   * @param memberLastName last name owner
   * @param page page number
   * @param pageSize page size
   */
  searchPolicyByFilter(
    page: number, pageSize: number) {
    this.policyService.getPoliciesByUserKeyAndRoleId(
      this.user.user_key, this.user.role_id, true, this.currentFilterFirstName,
      this.currentFilterLastName, page, pageSize, this.currentStatus)
      .subscribe(
        data => {
          this.searchProccess = true;
          this.policies = data;
          this.showExchangeRate();
          this.collectionSize = this.policies.count;
        }, error => {
          this.handlePolicyError(error);
        });
  }

  /**
   * Searches in the policy API the policy matching policy number entered
   * @param policyId Policy number
   */
  searchPolicyById(policyId: number) {
    this.policyService.getPolicyByPolicyId(this.user.role_id, this.user.user_key, true, policyId)
      .subscribe(
        data => {
          this.searchProccess = true;
          this.collectionSize = data.count;
          this.policies = data;
          this.showExchangeRate();
        }, error => {
          this.handlePolicyError(error);
        });

  }

  whichIsInsuranceBusiness() {
    const insuranceBusinessAgent = Number(this.user.bupa_insurance);
    if (insuranceBusinessAgent === InsuranceBusiness.BUPA_MEXICO) {
      this.isMexico = true;
      this.isChecked = true;
    }
  }

  async onAutodeductionChange(isChecked, policyId) {

    const title = await this.translate.get(this.CONFIRM_AUTODEDUCTION_TITLE).toPromise();
    const message = await this.translate.get(this.CONFIRM_AUTODEDUCTION_MESSAGE).toPromise();
    const yes = await this.translate.get(this.CONFIRM_AUTODEDUCTION_YES).toPromise();
    const no = await this.translate.get(this.CONFIRM_AUTODEDUCTION_NO).toPromise();

    this.notification.showDialog(title, message, true, yes, no).then(confirm => {
      if (confirm) {
        this.value = isChecked;
        this.changeAutodeductionState(policyId);
      } else {
        this.searchPolicyById(policyId);
      }
    });
  }

  changeAutodeductionState(policyId: number) {
    console.log('In changeAutodeductionState Method ');
    this.policyService.autodeductionChangeState(this.buildRequestPolicyAutodeduction(2, policyId))
      .subscribe(
        data => {
          this.searchPolicyById(policyId);
        }, error => {
          this.handlePolicyError(error);
        });
  }

  buildRequestPolicyAutodeduction(policyMode: number, policyId: number): PolicyAutoDeductionRequestDto {
    const autodeduction = {
      policyMode: policyMode,
      policyId: policyId
    };
    return autodeduction;
  }

  showExchangeRate() {
    this.policies.data.forEach(policy => {
      policy.showFixedRates = policy.fixedRate === 0 ? true : false;
    });
  }

  private handlePolicyError(error: any) {
    this.collectionSize = 0;
    if (error.status === 404) {
      this.searchProccess = true;
    } else if (this.checksIfHadBusinessError(error)) {
      this.showErrorMessage(error);
    }
  }

  /**
   * Builds default Member Elegibility Form.
   */
  buildForm() {
    return new FormGroup({
      searchMemberType: new FormControl(this.memberSearchType[this.DEFAULT_MEMBER_TYPE_SELECTED].value),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      policyId: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      status: new FormControl('')
    }, this.checkAnyValueIsEntered([this.SEARCH_TYPE_CASE_BY_ALL]).bind(this));
  }

  /**
    * Jquery function to toggle policy details
   */
  toggleSlideDetail(policy) {
    $(this.ID_DETAIL_TOGGLE + policy.policyId).slideToggle();
    if (!($(this.ID_DETAIL_TOGGLE + policy.policyId).height() > 1)) {
      this.getPolicyAndAddToPaymentHistorical(policy);
    }
  }

  /**
   * Gets all the payments where the date is greater than 'x' months related to a policy. Number of months is a
   * configurable parameter that was set in the API.
   * @param policy The policy object reference
   */
  getPolicyAndAddToPaymentHistorical(policy: PolicyDto) {
    this.policyService.getPolicyPaymentsByPolicyId(policy.policyId)
      .subscribe(
        data => {
          this.searchProccess = true;
          policy.payments = data.payments;
        }, error => {
          if (error.status === 404) {
            this.searchProccess = true;
            policy.payments = [];
          } else if (this.checksIfHadBusinessError(error)) {
            this.showErrorMessage(error);
          }
        });
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
   * Custom validation that checks if any value has been |entered as a criteria.
   * @param group Form we're validating
   */
  checkAnyValueIsEntered(type: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        if (type.indexOf(control.get('searchMemberType').value) > -1) {
          return null;
        }
        if (!control.get('firstName').value && !control.get('lastName').value
          && !control.get('policyId').value && !control.get('status').value
        ) {
          return { anyNameIsRequired: true };
        }
      }
      return null;
    };
  }

  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`POLICY.ERROR.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /**
   * Sets a color depending on the status of the policy
   * @param status status to confirm
   */
  setStatusClass(status: string) {
    return Utilities.getStatusClass(status);
  }

  /**
   * Clears form object and its elements.
   * @param event status to confirm.
   */
  clearFields(event) {
    if (event) {
      this.searchFiltered = false;
      this.searchProccess = false;
      this.removeValues();
      this.policies = { count: 0, pageindex: 0, pageSize: 0, data: [] };
    }
  }

  // Navigate to payment process, before validate field exchange rate if is country mexico
  payPolicy(policyObject: PolicyDto) {
    if (this.paymentService.validtePayPolicy(policyObject)) {
      this.paymentService.setPolicyToPay(policyObject);
      this.router.navigate(['payments/payment-process', policyObject.policyId]);
    } else {
      // this.notification.showDialog('Mensaje', 'Este sera el cuerpo del mensaje cuando halla error', false,
      // 'CLAIMSUBMISSION.STEP3VALIDATEXMLOKBUTTON');
    }
  }

  showToPayMexicanPesos() {
    const insuranceBusinessAgent = Number(this.user.bupa_insurance);
    if (insuranceBusinessAgent === InsuranceBusiness.BUPA_MEXICO) {
      this.sizeColumnToPay = 4;
      this.showToPayMexicanPeso = true;
    } else {
      this.sizeColumnToPay = 6;
      this.showToPayMexicanPeso = false;
    }
  }

  inactivityPeriod(): Boolean {
    return (this.startInactivityMxPortal < this.today) && (this.today < this.endInactivityMxPortal)
  }

}
