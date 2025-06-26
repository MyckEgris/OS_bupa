import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PolicyApplicationResponse } from 'src/app/shared/services/policy-application/entities/policy-application-response.dto';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyAppViewHelper } from './policy-application-view.helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy-application-view',
  templateUrl: './policy-application-view.component.html'
})
export class PolicyApplicationViewComponent implements OnInit {

  /**
   * Init page for pagination component
   */
  private INIT_PAGE = 1;

  /**
   * Page size for pagination component
   */
  public PAGE_SIZE = 10;

  /**
   * Collection size for pagination component
   */
  public collectionSize: number = null;

  /**
   * Current page for pagination component
   */
  public page: number;

  /**
   * Flag for searching proccess
   */
  public searchProccess = false;

  /**
   * Flag for search filtered
   */
  public searchFiltered = false;

  /**
   * Stores the first name value so it will use it when paging.
   */
  private currentFilterFirstName: string;

  /**
   * Stores the last name value so it will use it when paging.
   */
  private currentFilterLastName: string;

  /**
   * Stores the policy id value so it will use it when paging.
   */
  private currentFilterPolicyId: number;

  /**
   * Stores the policy application number value so it will use it when paging.
   */
  private currentFilterPolicyAppNumber: number;

  /**
   * Main form
   */
  public policyApplicationForm: FormGroup;

  /**
   * Array for member search types
   */
  public policyAppSearchType: Array<any>;

  /**
   * PolicyApplication Dto object
   */
  public policyAplication: PolicyApplicationResponse = { totalCount: 0, pageindex: 1, pageSize: 0, policyApplications: [] };

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
  private SEARCH_TYPE_CASE_BY_POLICY_ID = 'by_policy_id';

  /**
   * Constant for switch case by application number
   */
  private SEARCH_TYPE_CASE_BY_APP_NUMBER = 'by_application_number';

  /**
   * Constant for switch case by owner
   */
  private SEARCH_TYPE_CASE_BY_OWNER = 'by_owner';

  /**
   * Constant for switch case by owner
   */
  private SEARCH_TYPE_CASE_ALL = 'by_all_application';

  /**
   * Stores the logged user information
   */
  private user: UserInformationModel;

  /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Stores the filter type so it will use it when paging.
   */
  private currentPolicyAppSearchType: string;

  constructor(private translate: TranslateService,
    private authService: AuthService,
    private policyAppService: PolicyApplicationService,
    private notification: NotificationService,
    private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('mode');
    localStorage.removeItem('applicationId');
    this.page = this.INIT_PAGE;
    this.policyAppSearchType = this.loadAndTranslateSearchTypes();
    this.translate.onLangChange.subscribe(() => {
      this.policyAppSearchType = this.loadAndTranslateSearchTypes();
    });
    this.policyApplicationForm = this.buildForm();
    this.user = this.authService.getUser();
    this.policyApplicationForm.controls.policyAppSearchType.valueChanges.subscribe(val => this.setValidations(val));
  }

  /**
   * Loads Search Type control by Language.
   */
  loadAndTranslateSearchTypes() {
    const searchTypes = this.loadSearchTypes();
    return searchTypes;
  }

  /**
   * Builds search types control.
   */
  loadSearchTypes() {
    return [
      { value: 'select' },
      { value: 'by_application_number' },
      { value: 'by_policy_id' },
      { value: 'by_owner' },
      { value: 'by_all_application' }
    ];
  }

  /**
   * Builds default Member Elegibility Form.
   */
  buildForm() {
    return new FormGroup({
      policyAppSearchType: new FormControl(this.policyAppSearchType[this.DEFAULT_MEMBER_TYPE_SELECTED].value),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      policyId: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      policyAppNumber: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
    }, PolicyAppViewHelper.checkAnyValueIsEntered(this.SEARCH_TYPE_CASE_ALL).bind(this));
  }

  /**
   * Whenever the dropdown value is changed, the validations are resetted here.
   * @param value Contains the value of the dropdown once the value changes
   */
  setValidations(value: any) {
    this.searchProccess = false;
    switch (value) {
      case this.SEARCH_TYPE_CASE_BY_POLICY_ID:
        this.policyApplicationForm.controls.policyId.setValidators(
          [Validators.required, Validators.minLength(1), Validators.maxLength(10)]);
        this.policyApplicationForm.controls.firstName.clearValidators();
        this.policyApplicationForm.controls.lastName.clearValidators();
        this.policyApplicationForm.controls.policyAppNumber.clearValidators();
        this.removeValues();
        break;
      case this.SEARCH_TYPE_CASE_BY_APP_NUMBER:
        this.policyApplicationForm.controls.policyAppNumber.setValidators(
          [Validators.required, Validators.minLength(1), Validators.maxLength(10)]);
        this.policyApplicationForm.controls.policyId.clearValidators();
        this.policyApplicationForm.controls.firstName.clearValidators();
        this.policyApplicationForm.controls.lastName.clearValidators();
        this.removeValues();
        break;
      case this.SEARCH_TYPE_CASE_BY_OWNER:
        this.policyApplicationForm.controls.policyId.clearValidators();
        this.policyApplicationForm.controls.policyAppNumber.clearValidators();
        this.policyApplicationForm.controls.firstName.clearValidators();
        this.policyApplicationForm.controls.lastName.clearValidators();
        this.removeValues();
        break;
      case this.SEARCH_TYPE_CASE_ALL:
        this.policyApplicationForm.controls.firstName.clearValidators();
        this.policyApplicationForm.controls.lastName.clearValidators();
        this.policyApplicationForm.controls.policyAppNumber.clearValidators();
        this.policyApplicationForm.controls.policyId.clearValidators();
        this.removeValues();
        break;
      default:
        break;
    }
    this.policyApplicationForm.updateValueAndValidity();
  }

  getRoutePolicyProcess() {
    return '/policies/create-policy-application';
  }

  removeValues() {
    this.policyApplicationForm.controls.firstName.setValue('');
    this.policyApplicationForm.controls.lastName.setValue('');
    this.policyApplicationForm.controls.policyId.setValue('');
    this.policyApplicationForm.controls.policyAppNumber.setValue('');
  }

  /**
   * When the user sets a new search, it goes here.
   * @param value Contains the value of the dropdown once the value changes
   */
  newFilterPolicies(value: any) {
    this.policyAplication = { totalCount: 0, pageindex: 0, pageSize: 0, policyApplications: [] };
    this.currentPolicyAppSearchType = value.policyAppSearchType.toString();
    switch (this.currentPolicyAppSearchType) {
      case this.SEARCH_TYPE_CASE_SELECT:
        break;
      case this.SEARCH_TYPE_CASE_BY_OWNER:
        this.setValuesCurrentFilter(this.policyApplicationForm.controls.firstName.value,
          this.policyApplicationForm.controls.lastName.value,
          null, null);
        this.searchAllPolicyApplicationByFilter(null, this.policyApplicationForm.controls.firstName.value,
          this.policyApplicationForm.controls.lastName.value,
          this.INIT_PAGE, this.PAGE_SIZE);
        break;
      case this.SEARCH_TYPE_CASE_BY_APP_NUMBER:
        this.setValuesCurrentFilter(null, null,
          null, this.policyApplicationForm.controls.policyAppNumber.value);
        this.searchPolicyAppByNumber(this.policyApplicationForm.controls.policyAppNumber.value);
        break;
      case this.SEARCH_TYPE_CASE_BY_POLICY_ID:
        this.setValuesCurrentFilter(null, null,
          this.policyApplicationForm.controls.policyId.value, null);
        this.searchAllPolicyApplicationByFilter(this.policyApplicationForm.controls.policyId.value,
          null, null, this.INIT_PAGE, this.PAGE_SIZE);
        break;
      case this.SEARCH_TYPE_CASE_ALL:
        this.searchAllPolicyApplicationByFilter(null, null, null,
          this.INIT_PAGE, this.PAGE_SIZE);
        break;
      default:
        break;
    }
  }

  /**
   * Updates the values so it will use it when paging
   * @param currentFilterFirstName FirstName
   * @param currentFilterLastName LastName
   * @param currentFilterPolicyId PolicyId
   * @param currentFilterPolicyAppNumber PolicyAppNumber
   */
  setValuesCurrentFilter(currentFilterFirstName: string, currentFilterLastName: string,
        currentFilterPolicyId: number, currentFilterPolicyAppNumber: number) {
    this.searchFiltered = false;
    this.currentFilterFirstName = currentFilterFirstName;
    this.currentFilterLastName = currentFilterLastName;
    this.currentFilterPolicyId = currentFilterPolicyId;
    this.currentFilterPolicyAppNumber = currentFilterPolicyAppNumber;
  }

  /**
   * Searches in the policy API the policy matching policy application number entered
   * @param policyAppNumber Policy application number
   */
  searchPolicyAppByNumber(policyAppNumber: number) {
    this.policyAppService.getPolicyAppByPolicyAppNumber(this.user.role_id, this.user.user_key, policyAppNumber, true)
      .subscribe(
        data => {
          this.searchProccess = true;
          this.collectionSize = data.totalCount;
          this.policyAplication = data;
        }, error => {
          this.handlePolicyAppError(error);
        });
  }

  /**
   * Searches in the policy API the policy matching policy id entered
   * @param policyId Policy id
   */
  searchAllPolicyApplicationByFilter(policyId: number, firstName: string, lastName: string, pageIndex: number, pageSize: number) {
    this.policyAppService.getAllPolicyApplicationByFilter(this.user.role_id, this.user.user_key,
      policyId, firstName, lastName, pageIndex, pageSize)
      .subscribe(
        data => {
          this.searchProccess = true;
          this.collectionSize = data.totalCount;
          this.policyAplication = data;
        }, error => {
          this.handlePolicyAppError(error);
        });
  }

  /***
   * handles Policy App Error
   */
  private handlePolicyAppError(error: any) {
    this.collectionSize = 0;
    if (error.status === 404) {
      this.searchProccess = true;
    } else if (this.checksIfHadBusinessError(error)) {
      this.showErrorMessage(error);
    }
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
   * Updates pagination
   */
  changePageOfPoliciesApp(page: number) {
    if (!page) { return; }
    switch (this.currentPolicyAppSearchType) {
      case this.SEARCH_TYPE_CASE_BY_OWNER:
        this.searchAllPolicyApplicationByFilter(null, this.currentFilterFirstName, this.currentFilterLastName, page, this.PAGE_SIZE);
        break;
      case this.SEARCH_TYPE_CASE_BY_POLICY_ID:
        this.searchAllPolicyApplicationByFilter(this.currentFilterPolicyId, null, null, page, this.PAGE_SIZE);
        break;
      case this.SEARCH_TYPE_CASE_ALL:
        this.searchAllPolicyApplicationByFilter(null, null, null, page, this.PAGE_SIZE);
        break;
      default:
        break;
    }
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
      this.policyAplication = { totalCount: 0, pageindex: 0, pageSize: 0, policyApplications: [] };
    }
  }
}
