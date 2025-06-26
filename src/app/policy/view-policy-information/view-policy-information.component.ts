import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { Agent } from 'src/app/shared/services/agent/entities/agent';
import { PolicyResponse } from 'src/app/shared/services/policy/entities/policy-response.dto';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilities } from 'src/app/shared/util/utilities';
import { PolicyDetailDates } from 'src/app/shared/services/policy/constants/policy-detail-dates.enum';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { PolicyInformationService } from 'src/app/security/services/policy-information/policy-information.service';
import { PolicyInformationModel } from 'src/app/security/model/policy-information.model';
import { RoutingStateService } from 'src/app/shared/services/routing/routing-state.service';
import * as $ from 'jquery';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import * as moment from 'moment';

@Component({
  selector: 'app-view-policy-information',
  templateUrl: './view-policy-information.component.html'
})
export class ViewPolicyInformationComponent implements OnInit, AfterViewInit {

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
  public collectionSize = 0;

  /**
   * Current page for pagination component
   */
  public page: number;

  /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_AS_302 = 302;

  /**
   * Main form
   */
  public policyViewForm: FormGroup;

  /**
   * Array for policy search types
   */
  public policySearchType: Array<any>;

  /**
   * Array for policy status search types
   */
  public policyStatusSearch: Array<any>;

  /**
   * Flag for searching proccess
   */
  public searchProccess = false;

  /**
   * Stores the logged user information
   */
  public user: UserInformationModel;

  /**
   * Stores the logged agent information
   */
  private agentAut: Agent;

  /**
   * Stores the logged user information
   */
  public agentList: Agent[];

  /**
   * Policy Dto object
   */
  public policies: PolicyResponse = { count: 0, pageindex: 1, pageSize: 0, data: [] };

  /**
   * Stores the filter type so it will use it when paging.
   */
  private currentPolicSearchType: string;

  /**
   * currentBusinessType
   */
  private currentBusinessType: number;

  /**
   * currentPolicyId
   */
  private currentPolicyId: number;

  /**
   * currentLegacyNumber
   */
  private currentLegacyNumber: string;

  /**
   * currentFirstName
   */
  private currentFirstName: string;

  /**
   * currentLastName
   */
  private currentLastName: string;

  /**
   * currentStatus
   */
  private currentStatus: string;

  /**
   * currentAgentId
   */
  private currentAgentId: number;

  /**
   * currentOwnerDOB
   */
  private currentOwnerDOB: string;

  /**
   * currentReceptionDateFrom
   */
  private currentReceptionDateFrom: string;

  /**
   * currentReceptionDateTo
   */
  private currentReceptionDateTo: string;

  /**
   * currentRenewalsDateFrom
   */
  private currentRenewalsDateFrom: string;

  /**
   * currentRenewalsDateTo
   */
  private currentRenewalsDateTo: string;

  /**
   * Constant for default type selected index
   */
  private DEFAULT_FILTER_TYPE_SELECTED = 0;

  /**
   * Constant for switch case filters
   */
  private SEARCH_TYPE_CASE_ALL_BUSINESS = 'by_all_policies_all_business';

  /**
   * Constant for switch case by_policy_id
   */
  private SEARCH_TYPE_CASE_POLICY_ID = 'by_policy_id';

  /**
   * Constant for switch case by_legacy_policy
   */
  private SEARCH_TYPE_CASE_LEGACY_ID = 'by_legacy_policy';

  /**
   * Constant for switch case by_owner
   */
  private SEARCH_TYPE_CASE_OWNER = 'by_owner';

  /**
   * Constant for switch case by_agent
   */
  private SEARCH_TYPE_CASE_AGENT = 'by_agent';

  /**
   * Constant for switch case by_owner_dob
   */
  private SEARCH_TYPE_CASE_OWNER_DOB = 'by_owner_dob';

  /**
   * Constant for switch case by_status
   */
  private SEARCH_TYPE_CASE_STATUS = 'by_status';

  /**
   * Constant for switch case by_reception_date
   */
  private SEARCH_TYPE_CASE_RECEPTION_DATE = 'by_reception_date';

  /**
   * Constant for switch case by_renewal_date
   */
  private SEARCH_TYPE_CASE_RENEWAL_DATE = 'by_renewal_date';

  /**
   * Constant individual
   */
  public SEARCH_TYPE_CASE_ALL_INDIVIDUAL = '1';

  /**
   * Constant group
   */
  public SEARCH_TYPE_CASE_ALL_GROUP = '2';

  /**
   * Constant individual and group
   */
  public SEARCH_TYPE_CASE_ALL_BOTH = '0';

  /**
   * Constant criteria filter title_policies
   */
  public CRITERIA_FILTER = 'title_policies';

  /**
   * Constant criteria filter title_policies
   */
  public CRITERIA_POLICIES = 'title_policies';

  /**
   * Constant criteria filter title_new_business
   */
  public CRITERIA_NEW_BUSSINES = 'title_new_business';

  /**
   * Constant criteria filter title_renewals
   */
  public CRITERIA_RENEWALS = 'title_renewals';

  /**
  * Constant for type XLXS
  */
  private XLS_APPLICATION_RESPONSE = 'application/vnd.ms-excel';

  /**
   * Constant title_policies
   */
  public title = 'title_policies';

  public isDiffGroupAdminAgentRole = false;
  public showOptionSearchGroup = false;

  public minDate: Date = new Date('1900/01/01');
  public maxDate = new Date();
  public minDateRange: Date = new Date('1900/01/01');

  public listStatusString: string;
  private listStatus: Array<string> = new Array<string>();

  public isDisableReceptionDateTo: Boolean = true;

  public dateValueFrom = Utilities.getSixMonthsPrior();
  public dateValueTo = Utilities.getLastDayMonth();

  public dateValueOwner: Date = null;

  /**
   * insurancesJoined
   */
  private insurancesJoined: string;

  private defaultSeparator = ',';

  public listDatesToShow =
    [PolicyDetailDates.APPLICATION_RECEIVED,
    PolicyDetailDates.POLICY_ISSUE_DATE,
    PolicyDetailDates.RENEWALS_DATE];

  public tamanoAgent = 7;
  public tamanoDates = 3;
  public sizeStatus = 4;

  public selectedSearchType: any;
  role_id_employee = '5'; // Role Employee
  role_id_admin = '4';
  constructor(
    private translationService: TranslationService,
    private translate: TranslateService,
    private authService: AuthService,
    private agentService: AgentService,
    private policyService: PolicyService,
    private notification: NotificationService,
    private router: Router,
    private policyInformationService: PolicyInformationService,
    private routingState: RoutingStateService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.isRoleEmployeeOrAdmin()) {
      this.isAgentGroup();
    } else {
      this.setInsuranceBusiness();
    }
    this.page = 1;
    this.collectionSize = 0;
    this.policySearchType = this.loadAndTranslateSearchTypes();
    this.policyStatusSearch = this.loadAndTranslateStatusSearchTypes();
    this.translate.onLangChange.subscribe(() => {
      this.policySearchType = this.loadAndTranslateSearchTypes();
      this.policyStatusSearch = this.loadAndTranslateStatusSearchTypes();
    });
    this.policyViewForm = (!this.isRoleEmployeeOrAdmin()) ? this.buildForm() : this.buildFormEmployee();
    this.policyViewForm.controls.policySearchType.valueChanges.subscribe(val => this.setValidations(val));
    this.policyViewForm.controls.receptionDateFrom.valueChanges.subscribe(val => this.changeMinDateRange(val, 'receptionDateFrom'));
    this.policyViewForm.controls.renewalsDateFrom.valueChanges.subscribe(val => this.changeMinDateRange(val, 'renewalsDateFrom'));
    if (this.isDetailRouteOrigin()) {
      const policyCriteria = this.policyInformationService.getPolicyCriteria();
      if (policyCriteria) {
        this.bindSearchCriteria(policyCriteria);
      }
      return;
    }
    if (!this.isRoleEmployeeOrAdmin()) {
      this.searchPoliciesByFilter(this.page);
    }
  }

  setInsuranceBusiness() {
      let insuranceList: Array<any> = [];
      if (typeof(this.user.bupa_insurances) === 'string') {
        insuranceList.push(this.user.bupa_insurances);
      } else {
        insuranceList = Object.assign([], this.user.bupa_insurances);
      }
      this.insurancesJoined = insuranceList.join(this.defaultSeparator);
  }

  ngAfterViewInit(): void {
    if (this.listStatusString) {
      this.checklistOfStatus(this.listStatusString);
    }
  }

  isDetailRouteOrigin() {
    return (this.routingState.getPreviousUrl().indexOf('view-policy-information/') > -1);
  }

  checklistOfStatus(list: string) {
    const statusArray = list.split(',');
    for (const status of this.policyStatusSearch) {
      const statusForCheck = statusArray.find(s => s.toLowerCase().replace(' ', '_') === status.value);
      if (statusForCheck) {
        $('input:checkbox[id=' + status.value + ']').attr('checked', true);
      }
    }
  }

  bindSearchCriteria(policyCriteria: PolicyInformationModel) {
    this.CRITERIA_FILTER = policyCriteria.criteriaFilter;
    this.changeCriteriaFilterByQuickAccess(this.CRITERIA_FILTER);
    this.policyViewForm.controls['policySearchType'].setValue(policyCriteria.policySearchType);
    this.page = policyCriteria.page;
    if (policyCriteria.policySearchType === this.SEARCH_TYPE_CASE_ALL_BUSINESS) {
      this.policyViewForm.controls['businessType'].setValue(policyCriteria.businessType);
    }
    if (policyCriteria.policySearchType === this.SEARCH_TYPE_CASE_STATUS) {
      this.listStatusString = policyCriteria.statusStringList;
      this.listStatus = policyCriteria.statusStringList.split(',');
      if (policyCriteria.criteriaFilter === this.CRITERIA_NEW_BUSSINES) {
        this.dateValueFrom = policyCriteria.receptionDateFrom;
        this.dateValueTo = policyCriteria.receptionDateTo;
        this.policyViewForm.controls['receptionDateFrom'].setValue(policyCriteria.receptionDateFrom);
        this.policyViewForm.controls['receptionDateTo'].setValue(policyCriteria.receptionDateTo);
      }
    }
    if (policyCriteria.policySearchType === this.SEARCH_TYPE_CASE_POLICY_ID) {
      this.policyViewForm.controls['policyId'].setValue(policyCriteria.policyId);
    }
    if (policyCriteria.policySearchType === this.SEARCH_TYPE_CASE_LEGACY_ID) {
      this.policyViewForm.controls['policyLegacyID'].setValue(policyCriteria.policyLegacyId);
    }
    if (policyCriteria.policySearchType === this.SEARCH_TYPE_CASE_OWNER_DOB) {
      this.dateValueOwner = policyCriteria.ownerDob;
      this.policyViewForm.controls['ownerDOB'].setValue(policyCriteria.ownerDob);
    }
    if (policyCriteria.policySearchType === this.SEARCH_TYPE_CASE_OWNER) {
      this.policyViewForm.controls['firstName'].setValue(policyCriteria.firstName);
      this.policyViewForm.controls['lastName'].setValue(policyCriteria.lastName);
    }
    if (policyCriteria.policySearchType === this.SEARCH_TYPE_CASE_AGENT) {
      this.policyViewForm.controls['agent'].setValue(policyCriteria.agentId);

      if (policyCriteria.criteriaFilter === this.CRITERIA_NEW_BUSSINES) {
        this.dateValueFrom = policyCriteria.receptionDateFrom;
        this.dateValueTo = policyCriteria.receptionDateTo;
        this.policyViewForm.controls['receptionDateFrom'].setValue(policyCriteria.receptionDateFrom);
        this.policyViewForm.controls['receptionDateTo'].setValue(policyCriteria.receptionDateTo);
      }
      if (policyCriteria.criteriaFilter === this.CRITERIA_RENEWALS) {
        this.policyViewForm.controls['renewalsDateFrom'].setValue(policyCriteria.renewalDateFrom);
        this.policyViewForm.controls['renewalsDateTo'].setValue(policyCriteria.renewalDateTo);
        this.dateValueFrom = policyCriteria.renewalDateFrom;
        this.dateValueTo = policyCriteria.renewalDateTo;
      }
    }
    if (policyCriteria.policySearchType === this.SEARCH_TYPE_CASE_RECEPTION_DATE) {
      this.dateValueFrom = policyCriteria.receptionDateFrom;
      this.dateValueTo = policyCriteria.receptionDateTo;
      this.policyViewForm.controls['receptionDateFrom'].setValue(policyCriteria.receptionDateFrom);
      this.policyViewForm.controls['receptionDateTo'].setValue(policyCriteria.receptionDateTo);
    }
    if (policyCriteria.policySearchType === this.SEARCH_TYPE_CASE_RENEWAL_DATE) {
      this.policyViewForm.controls['renewalsDateFrom'].setValue(policyCriteria.renewalDateFrom);
      this.policyViewForm.controls['renewalsDateTo'].setValue(policyCriteria.renewalDateTo);
      this.dateValueFrom = policyCriteria.renewalDateFrom;
      this.dateValueTo = policyCriteria.renewalDateTo;
    }
    this.newFilterPolicies(this.policyViewForm.value, true);
  }

  saveSearchCriteria() {
    const pi = {} as PolicyInformationModel;
    pi.criteriaFilter = this.CRITERIA_FILTER;
    pi.policySearchType = this.policyViewForm.value.policySearchType;
    pi.page = this.page;

    if (this.policyViewForm.value.policySearchType === this.SEARCH_TYPE_CASE_ALL_BUSINESS) {
      pi.businessType = this.policyViewForm.value.businessType;
    }
    if (this.policyViewForm.value.policySearchType === this.SEARCH_TYPE_CASE_STATUS) {
      pi.statusStringList = this.listStatusString;
      if (this.CRITERIA_FILTER === this.CRITERIA_NEW_BUSSINES) {
        pi.receptionDateFrom = this.policyViewForm.value.receptionDateFrom;
        pi.receptionDateTo = this.policyViewForm.value.receptionDateTo;
      }
    }
    if (this.policyViewForm.value.policySearchType === this.SEARCH_TYPE_CASE_POLICY_ID) {
      pi.policyId = this.policyViewForm.value.policyId;
    }
    if (this.policyViewForm.value.policySearchType === this.SEARCH_TYPE_CASE_LEGACY_ID) {
      pi.policyLegacyId = this.policyViewForm.value.policyLegacyID;
    }
    if (this.policyViewForm.value.policySearchType === this.SEARCH_TYPE_CASE_OWNER_DOB) {
      pi.ownerDob = this.policyViewForm.value.ownerDOB;
    }
    if (this.policyViewForm.value.policySearchType === this.SEARCH_TYPE_CASE_OWNER) {
      pi.firstName = this.policyViewForm.value.firstName;
      pi.lastName = this.policyViewForm.value.lastName;
    }
    if (this.policyViewForm.value.policySearchType === this.SEARCH_TYPE_CASE_AGENT) {
      pi.agents = this.agentList;
      pi.agentId = this.policyViewForm.controls.agent.value;
      if (this.CRITERIA_FILTER === this.CRITERIA_NEW_BUSSINES) {
        pi.receptionDateFrom = this.policyViewForm.value.receptionDateFrom;
        pi.receptionDateTo = this.policyViewForm.value.receptionDateTo;
      }
      if (this.CRITERIA_FILTER === this.CRITERIA_RENEWALS) {
        pi.renewalDateFrom = this.policyViewForm.value.renewalsDateFrom;
        pi.renewalDateTo = this.policyViewForm.value.renewalsDateTo;
      }
    }
    if (this.policyViewForm.value.policySearchType === this.SEARCH_TYPE_CASE_RECEPTION_DATE) {
      pi.receptionDateFrom = this.policyViewForm.value.receptionDateFrom;
      pi.receptionDateTo = this.policyViewForm.value.receptionDateTo;
    }
    if (this.policyViewForm.value.policySearchType === this.SEARCH_TYPE_CASE_RENEWAL_DATE) {
      pi.renewalDateFrom = this.policyViewForm.value.renewalsDateFrom;
      pi.renewalDateTo = this.policyViewForm.value.renewalsDateTo;
    }

    this.policyInformationService.setPolicyCriteria(pi);
  }

  /**
   * Searches in the policy API the policy matching policy number entered
   */
  searchAgentHierarchyById() {
    this.agentService.getAgentHierarchyById(this.user.user_key).subscribe(data => {
      this.agentHierarchy(data);
      this.addCurrentAgent(this.agentAut);
    }, error => {
      this.addCurrentAgent(this.agentAut);
      this.handlePolicyError(error);
    });
  }

  agentHierarchy(data) {
    data.forEach((agent: Agent) => {
      agent.companyName = `${this.agentService.getAgentName(agent)} - ${agent.agentId}`;
    });
    this.agentList = data;
  }

  addCurrentAgent(currentAgent) {
    const exists = this.agentList.find(x => x.agentId === currentAgent.agentId);
    if (!exists) {
      currentAgent.companyName = `${this.agentService.getAgentName(currentAgent)} - ${currentAgent.agentId}`;
      if (this.agentList.length > 0) {
        this.agentList.unshift(currentAgent);
      } else {
        this.agentList = [currentAgent];
      }
      this.policyViewForm.controls['agent'].setValue(this.agentList[0].agentId);
    }
  }

  /**
   * If the role is GroupAdmin, it mustn't search by agent.
   */
  isAgentGroup() {
    const groupAdmin = 'GroupAdmin';
    const userRole = this.user.role;
    this.isDiffGroupAdminAgentRole = !(groupAdmin.indexOf(userRole) > -1);
    this.agentService.getAgentById(this.user.user_key).subscribe(result => {
      this.agentAut = result;
      if (this.isDiffGroupAdminAgentRole) {
        this.showOptionSearchGroup = this.agentAut.hasPolicyGroup === 1 ? true : false;
      }
    });
  }

  /**
   * Builds default PolicyView Form.
   */
  buildForm() {
    return new FormGroup({
      policySearchType: new FormControl(this.policySearchType
      [this.policySearchType.findIndex(x => x.value === this.SEARCH_TYPE_CASE_ALL_BUSINESS)].value),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      policyLegacyID: new FormControl(''),
      policyId: new FormControl(''),
      agent: new FormControl(''),
      status: new FormControl(''),
      renewalsDateFrom: new FormControl(''),
      renewalsDateTo: new FormControl(''),
      ownerDOB: new FormControl(''),
      receptionDateFrom: new FormControl(''),
      receptionDateTo: new FormControl(''),
      businessType: new FormControl(this.SEARCH_TYPE_CASE_ALL_BOTH),
    }, this.checkAnyValueIsEntered([]).bind(this));
  }

    /**
   * Builds default PolicyView Form.
   */
  buildFormEmployee() {
    return new FormGroup({
      policySearchType: new FormControl(this.policySearchType
      [this.policySearchType.findIndex(x => x.value === 'select')].value),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      policyLegacyID: new FormControl(''),
      policyId: new FormControl(''),
      agent: new FormControl(''),
      status: new FormControl(''),
      renewalsDateFrom: new FormControl(''),
      renewalsDateTo: new FormControl(''),
      ownerDOB: new FormControl(''),
      receptionDateFrom: new FormControl(''),
      receptionDateTo: new FormControl(''),
      businessType: new FormControl(this.SEARCH_TYPE_CASE_ALL_BOTH),
    }, this.checkAnyValueIsEntered([]).bind(this));
  }

  /**
   * Whenever the dropdown value is changed, the validations are resetted here.
   * @param value Contains the value of the dropdown once the value changes
   */
  setValidations(value: any) {
    this.searchProccess = false;
    let formControlNotValidate = this.setValidationsMandatories();
    switch (value) {
      case this.SEARCH_TYPE_CASE_POLICY_ID:
        this.clearValidationsForm('policyId');
        this.removeValues(formControlNotValidate);
        this.policyViewForm.controls.policyId.setValidators(
          [Validators.required, Validators.minLength(1), Validators.maxLength(10)]);
        break;
      case this.SEARCH_TYPE_CASE_LEGACY_ID:
        this.clearValidationsForm('policyLegacyID');
        this.removeValues(formControlNotValidate);
        this.policyViewForm.controls.policyLegacyID.setValidators(
          [Validators.required, Validators.minLength(1), Validators.maxLength(18)]);
        break;
      case this.SEARCH_TYPE_CASE_OWNER:
        this.clearValidationsForm('');
        this.removeValues(formControlNotValidate);
        break;
      case this.SEARCH_TYPE_CASE_OWNER_DOB:
        this.clearValidationsForm('ownerDOB');
        this.removeValues(formControlNotValidate);
        this.policyViewForm.controls.ownerDOB.setValidators(
          [Validators.required]);
        break;
      case this.SEARCH_TYPE_CASE_STATUS:
        if (formControlNotValidate) {
          this.tamanoDates = 2;
          this.sizeStatus = 3;
        }
        formControlNotValidate = formControlNotValidate + 'status';
        this.clearValidationsForm(formControlNotValidate);
        this.policyViewForm.controls.status.setValidators(
          [Validators.required]);
        this.removeValues(formControlNotValidate);
        break;
      case this.SEARCH_TYPE_CASE_ALL_BUSINESS:
        formControlNotValidate = formControlNotValidate + 'businessType';
        this.clearValidationsForm(formControlNotValidate);
        this.policyViewForm.controls.businessType.setValue(this.SEARCH_TYPE_CASE_ALL_BOTH);
        this.removeValues(formControlNotValidate);
        break;
      case this.SEARCH_TYPE_CASE_AGENT:
        if (formControlNotValidate) {
          this.tamanoAgent = 3;
          this.tamanoDates = 2;
          this.sizeStatus = 3;
        }
        this.removeValues(formControlNotValidate);
        formControlNotValidate = formControlNotValidate + 'agent';
        this.clearValidationsForm(formControlNotValidate);
        this.policyViewForm.controls.agent.setValidators(
          [Validators.required]);
        this.removeValues(formControlNotValidate);
        this.searchAgentHierarchyById();
        break;

    }
    this.policyViewForm.updateValueAndValidity();
  }

  setValidationsMandatories() {
    let formControlNotValidate = '';
    switch (this.CRITERIA_FILTER) {
      case this.CRITERIA_NEW_BUSSINES:
        this.policyViewForm.controls.receptionDateFrom.setValidators(
          [Validators.required]);
        this.policyViewForm.controls.receptionDateTo.setValidators(
          [Validators.required]);
        formControlNotValidate = 'receptionDateFrom, receptionDateTo';
        return formControlNotValidate;
      case this.CRITERIA_RENEWALS:
        this.policyViewForm.controls.renewalsDateFrom.setValidators(
          [Validators.required]);
        this.policyViewForm.controls.renewalsDateTo.setValidators(
          [Validators.required]);
        formControlNotValidate = 'renewalsDateFrom, renewalsDateTo';
        return formControlNotValidate;
      default:
        return formControlNotValidate;
    }
  }

  /**
   * Quita las validaciones de todos los controles menos el del control a validar
   * @param value Param not clearValidators
   */
  clearValidationsForm(value: string) {
    Object.keys(this.policyViewForm.controls).forEach(key => {
      if (!(value.indexOf(key) > -1)) {
        this.policyViewForm.get(key).clearValidators();
      }
    });
    this.listStatusString = '';
    this.listStatus = new Array<string>();
  }

  removeValues(value: string, removeAll?: boolean) {
    if (removeAll) {
      value = '';
    } else {
      value = value.concat(', policySearchType');
    }
    Object.keys(this.policyViewForm.controls).forEach(key => {
      if (!(value.indexOf(key) > -1)) {
        this.policyViewForm.get(key).setValue('');
      }
    });
    this.listStatusString = '';
    this.listStatus = new Array<string>();
  }

  /**
   * Custom validation that checks if any value has been entered as a criteria.
   * @param type type we're not validating
   */
  checkAnyValueIsEntered(type: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        if (type.indexOf(control.get('policySearchType').value) > -1) {
          return null;
        }
        if (!control.get('firstName').value && !control.get('lastName').value
          && !control.get('policyId').value && !control.get('policyLegacyID').value
          && !control.get('renewalsDateFrom').value && !control.get('renewalsDateTo').value
          && !control.get('receptionDateFrom').value && !control.get('receptionDateTo').value
          && !control.get('agent').value && !control.get('status').value
          && !control.get('businessType').value && !control.get('ownerDOB').value) {
          return { anyNameIsRequired: true };
        }
      }
      return null;
    };
  }

  /**
   * Loads Search Type control by Language.
   */
  loadAndTranslateSearchTypes() {
    const searchTypes = this.getListFilter();
    return searchTypes;
  }

  loadAndTranslateStatusSearchTypes() {
    const searchStatus = this.getListStatusFilter();
    return searchStatus;
  }

  /**
   * Builds search types control.
   */
  loadStatusSearchTypes() {
    return [
      { value: 'active' },
      { value: 'rejected' },
      { value: 'canceled' },
    ];
  }

  getListFilter() {
    switch (this.CRITERIA_FILTER) {
      case this.CRITERIA_POLICIES:
        return this.addFilterOwnerIfDiffGroupAdmin(this.getsearchListByPolicyCriteria());
      case this.CRITERIA_NEW_BUSSINES:
        return this.addFilterOwnerIfDiffGroupAdmin(this.getSearchListByNewBussinessCriteria());
      case this.CRITERIA_RENEWALS:
        return this.addFilterOwnerIfDiffGroupAdmin(this.getSearchListByRenewalsCriteria());
      default:
        break;
    }
  }

  getsearchListByPolicyCriteria() {
    if (!this.isRoleEmployeeOrAdmin()) {
      return [
        { value: 'select' },
        { value: 'by_all_policies_all_business' },
        { value: 'by_status' },
        { value: 'by_policy_id' },
        { value: 'by_legacy_policy' },
        { value: 'by_owner_dob' },
        { value: 'by_owner' }
      ];
    } else {
        return [
          { value: 'select' },
          { value: 'by_policy_id' },
          { value: 'by_legacy_policy' }
        ];
    }
  }

  getSearchListByNewBussinessCriteria() {
    return [
      { value: 'select' },
      { value: 'by_reception_date' },
      { value: 'by_status' }
    ];
  }

  getSearchListByRenewalsCriteria() {
    return [
      { value: 'select' },
      { value: 'by_renewal_date' }
    ];
  }

  addFilterOwnerIfDiffGroupAdmin(list: any[]) {
    const searchStatusTypes = list;
    if (!this.isRoleEmployeeOrAdmin()) {
      if (this.isDiffGroupAdminAgentRole) {
        searchStatusTypes.push({ value: 'by_agent' });
      }
    }
    return searchStatusTypes;
  }

  getListStatusFilter() {
    let searchTypes: any[];
    switch (this.CRITERIA_FILTER) {
      case this.CRITERIA_POLICIES:
        searchTypes = this.loadStatusSearchTypes();
        searchTypes.push(
          { value: 'pending_payment' },
          { value: 'pending_other' },
          { value: 'grace_period' },
          { value: 'lapsed' }
        );
        return searchTypes;
      case this.CRITERIA_NEW_BUSSINES:
        searchTypes = this.loadStatusSearchTypes();
        searchTypes.push(
          { value: 'pending' },
          { value: 'pending_payment' },
          { value: 'pending_other' },
        );
        return searchTypes;
      default:
        break;
    }
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
        this.translate.get(`POLICY.POLICYSTATUS.${x.toUpperCase()}`).subscribe(
          result => {
            listTemp.push(result);
            this.listStatusString = listTemp.join();
            this.policyViewForm.controls.status.setValue(this.listStatusString);
          }
        );
      });
    } else {
      this.listStatusString = '';
    }
  }

  /**
   * Changes the dropdowns depending on the selected Quick Access option.
   * @param value button event
   */
  changeCriteriaFilterByQuickAccess(value: any) {
    this.searchProccess = false;
    this.CRITERIA_FILTER = value;
    this.title = value;
    this.policySearchType = this.loadAndTranslateSearchTypes();
    this.policyStatusSearch = this.loadAndTranslateStatusSearchTypes();
    this.resetPolicySearchType();
  }

  resetPolicySearchType() {
    const notClearValidations = this.setValidationsMandatories();
    switch (this.CRITERIA_FILTER) {
      case this.CRITERIA_NEW_BUSSINES:
        this.dateValueTo = Utilities.getLastDayMonth();
        this.policyViewForm.controls.policySearchType.setValue
          (this.policySearchType[this.policySearchType.findIndex(x => x.value === this.SEARCH_TYPE_CASE_RECEPTION_DATE)].value);
        this.clearValidationsForm(notClearValidations);
        this.policyViewForm.controls.receptionDateFrom.setValue(this.dateValueFrom);
        this.policyViewForm.controls.receptionDateTo.setValue(this.dateValueTo);
        this.newFilterPolicies(this.policyViewForm.value);
        break;
      case this.CRITERIA_RENEWALS:
        this.dateValueTo = Utilities.getLastDayMonth();
        this.policyViewForm.controls.policySearchType.setValue
          (this.policySearchType[this.policySearchType.findIndex(x => x.value === this.SEARCH_TYPE_CASE_RENEWAL_DATE)].value);
        this.clearValidationsForm(notClearValidations);
        this.policyViewForm.controls.renewalsDateFrom.setValue(this.dateValueFrom);
        this.policyViewForm.controls.renewalsDateTo.setValue(this.dateValueTo);
        this.newFilterPolicies(this.policyViewForm.value);
        break;
      case this.CRITERIA_POLICIES:
        this.policyViewForm.controls.policySearchType.setValue
          (this.policySearchType[this.policySearchType.findIndex(x => x.value === this.SEARCH_TYPE_CASE_ALL_BUSINESS)].value);
        this.newFilterPolicies(this.policyViewForm.value);
        break;
      default:
        break;
    }
  }

  /**
   * Builds search types control.
   */
  loadSearchTypes() {
    return [
      { value: 'select' },
      { value: 'by_agent' },
    ];
  }

  /**
   * When the user sets a new search, it goes here.
   * @param value Contains the value of the dropdown once the value changes
   */
  newFilterPolicies(value: any, isBackSearch?: boolean) {
    this.page = !isBackSearch ? this.INIT_PAGE : this.page;
    this.policies = { count: 0, pageindex: 0, pageSize: 0, data: [] };
    this.currentPolicSearchType = value.policySearchType.toString();
    switch (this.currentPolicSearchType) {
      case this.SEARCH_TYPE_CASE_POLICY_ID:
        this.setValuesCurrentFilter(null, this.policyViewForm.controls.policyId.value, null, null,
          null, null, null, null, null, null, null, null);
        this.searchPoliciesByPolicyId();
        break;
      case this.SEARCH_TYPE_CASE_ALL_BUSINESS:
        this.setValuesCurrentFilter(this.policyViewForm.controls.businessType.value, null, null, null,
          null, null, null, null, null, null, null, null);
        this.searchPoliciesByFilter(this.page);
        break;
      case this.SEARCH_TYPE_CASE_LEGACY_ID:
        this.setValuesCurrentFilter(null, null, this.policyViewForm.controls.policyLegacyID.value, null,
          null, null, null, null, null, null, null, null);
        this.searchPoliciesByFilter(this.page);
        break;
      case this.SEARCH_TYPE_CASE_OWNER:
        this.setValuesCurrentFilter(null, null, null, this.policyViewForm.controls.firstName.value,
          this.policyViewForm.controls.lastName.value, null, null, null, null, null, null, null);
        this.searchPoliciesByFilter(this.page);
        break;
      case this.SEARCH_TYPE_CASE_STATUS:
        this.setValuesCurrentFilter(null, null, null, null, null, this.listStatusString, null,
          null, this.policyViewForm.controls.receptionDateFrom.value, this.policyViewForm.controls.receptionDateTo.value,
          this.policyViewForm.controls.renewalsDateFrom.value, this.policyViewForm.controls.renewalsDateTo.value);
        this.searchPoliciesByFilter(this.page);
        break;
      case this.SEARCH_TYPE_CASE_AGENT:
        this.setValuesCurrentFilter(null, null, null, null, null, null, this.policyViewForm.controls.agent.value, null,
          this.policyViewForm.controls.receptionDateFrom.value, this.policyViewForm.controls.receptionDateTo.value,
          this.policyViewForm.controls.renewalsDateFrom.value, this.policyViewForm.controls.renewalsDateTo.value);
        this.searchPoliciesByFilter(this.page);
        break;
      case this.SEARCH_TYPE_CASE_OWNER_DOB:
        this.setValuesCurrentFilter(null, null, null, null,
          null, null, null, this.policyViewForm.controls.ownerDOB.value, null, null, null, null);
        this.searchPoliciesByFilter(this.page);
        break;
      case this.SEARCH_TYPE_CASE_RECEPTION_DATE:
        this.setValuesCurrentFilter(null, null, null, null,
          null, null, null, null, this.policyViewForm.controls.receptionDateFrom.value,
          this.policyViewForm.controls.receptionDateTo.value, null, null);
        this.searchPoliciesByFilter(this.page);
        break;
      case this.SEARCH_TYPE_CASE_RENEWAL_DATE:
        this.setValuesCurrentFilter(null, null, null, null,
          null, null, null, null, null, null, this.policyViewForm.controls.renewalsDateFrom.value,
          this.policyViewForm.controls.renewalsDateTo.value);
        this.searchPoliciesByFilter(this.page);
        break;
      default:
        break;
    }
  }

  setValuesCurrentFilter(businessType: number, policyId: number, legacyNumber: string, firstName: string,
    lastName: string, status: string, agentId: number, ownerDOB: string, receptionDateFrom: string, receptionDateTo: string,
    renewalsDateFrom: string, renewalsDateTo: string) {
    this.currentBusinessType = businessType;
    this.currentPolicyId = policyId;
    this.currentLegacyNumber = legacyNumber;
    this.currentFirstName = firstName;
    this.currentLastName = lastName;
    this.currentStatus = status;
    this.currentAgentId = agentId;
    this.currentOwnerDOB = ownerDOB;
    this.currentReceptionDateFrom = receptionDateFrom;
    this.currentReceptionDateTo = receptionDateTo;
    this.currentRenewalsDateFrom = renewalsDateFrom;
    this.currentRenewalsDateTo = renewalsDateTo;
  }

  searchPoliciesByFilter(pageIndex: number) {

    this.policyService.getPoliciesByFilter(this.user.role_id, this.user.user_key, pageIndex, this.PAGE_SIZE,
      this.currentBusinessType, this.currentPolicyId, this.currentLegacyNumber, this.currentFirstName, this.currentLastName,
      this.currentStatus, this.currentAgentId, this.currentOwnerDOB, this.currentReceptionDateFrom, this.currentReceptionDateTo,
      this.currentRenewalsDateFrom, this.currentRenewalsDateTo, this.insurancesJoined)
      .subscribe(
        data => {
          this.policies = data;

          const groupColors = this.getGroupAsignedColor();
          this.setToolTipLegacyAndAgentName(this.policies.data);
          this.policies.data.forEach(a => {
            if (a.isGroupPolicy) {
              const color = (groupColors.find(function (element) {
                return element.id === a.groupId;
              }));
              a.color = color.value;
            }
          });
          this.collectionSize = data.count;
          this.searchProccess = true;
          this.saveSearchCriteria();
        },
        error => {
          this.handlePolicyError(error);
        });
  }

  getGroupAsignedColor() {
    const result = this.policies.data.reduce(function (r, a) {
      if (a.isGroupPolicy) {
        if (!r) {
          r = {};
        }
        r[a.groupId] = a.groupId;
        return r;
      }
    }, Object.create(null));

    if (result) {
      const objFinal = Object.keys(result).map(function (a, i) {
        let entiti = Object.create({ id: '', value: '' });
        if (i % 2 === 1) {
          entiti = { id: Number(a), value: '#9da719' };
        } else {
          entiti = { id: Number(a), value: '#0e14c3' };
        }
        return entiti;
      });
      return objFinal;
    }
  }

  searchPoliciesByPolicyId() {
    this.policyService.getAllPoliciesByPolicyId(this.user.role_id, this.user.user_key, this.currentPolicyId, this.insurancesJoined)
      .subscribe(
        data => {
          this.collectionSize = data.count;
          this.policies = data;
          this.setToolTipLegacyAndAgentName(this.policies.data);
          this.searchProccess = true;
          this.saveSearchCriteria();
        },
        error => {
          this.handlePolicyError(error);
        });
  }

  setToolTipLegacyAndAgentName(list: PolicyDto[]) {
    list.forEach(a => {
      a.agent.agentName = this.agentService.getAgentName(a.agent);
    });
  }

  /***
  * handles Policy Error
  */
  private handlePolicyError(error: any) {
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
   * Clears form object and its elements.
   * @param event status to confirm.
   */
  clearFields(event) {
    if (event) {
      this.searchProccess = false;
      this.removeValues('', true);
      this.policies = { count: 0, pageindex: 0, pageSize: 0, data: [] };
    }
  }

  goToDetail(policyId: number) {
    this.router.navigate(['policies/view-policy-information', policyId]);
  }

  changeMinDateRange(date: string, control: string) {
    if (date !== '') {
      this.minDateRange = new Date(date);
      this.isDisableReceptionDateTo = false;
    }

    if (this.minDateRange > this.dateValueTo) {
      this.dateValueTo = undefined;
    }
  }

  /**
   * Updates pagination
   */
  changePageOfPolicies(page: number) {
    if (!page) { return; }
    this.page = page;
    switch (this.currentPolicSearchType) {
      case this.SEARCH_TYPE_CASE_POLICY_ID:
        this.searchPoliciesByPolicyId();
        break;
      default:
        this.searchPoliciesByFilter(page);
        break;
    }
  }

  /**
   * Download the policies search result in Excel
   */
  downloadPoliciesExcel() {
    let agentName;
    let agentId;
    let agentSearch: Agent;
    const languageId = this.translationService.getLanguageId().toString();

    const currentBusiness = (this.currentBusinessType) ? this.currentBusinessType : 0;
    const currentPolicy = (this.currentPolicyId) ? this.currentPolicyId : 0;
    const currentLegacy = (this.currentLegacyNumber) ? this.currentLegacyNumber : '';
    const currentFirstName = (this.currentFirstName) ? this.currentFirstName : '';
    const currentLastName = (this.currentLastName) ? this.currentLastName : '';
    const currentStatus = (this.currentStatus) ? this.currentStatus : '';
    const currentOwnerDOB = (this.currentOwnerDOB) ? moment(new Date(this.currentOwnerDOB)).format('YYYY-MM-DD') : '';

    if (this.currentAgentId && this.agentList && this.agentList.length > 0) {
      agentSearch = this.agentList.find(x => x.agentId === this.policyViewForm.controls.agent.value);
      agentName = (agentSearch.firstName) ? agentSearch.firstName + ' ' + agentSearch.lastName : agentSearch.companyName;
      agentId = agentSearch.agentId;
    } else {
      agentName = (this.agentAut.agentName) ? this.agentAut.agentName : this.agentAut.companyName;
      agentId = this.agentAut.agentId.toString();
    }

    this.policyService.getDocumentPolicies(languageId, agentId, agentName, this.collectionSize.toString(),
      currentBusiness.toString(), currentStatus, currentPolicy.toString(), currentLegacy.toString(), currentOwnerDOB,
      currentFirstName, currentLastName).subscribe(data => {
        this.download(data, 'policies');
      }, error => {
        if (this.checkIfHasData(error)) {
          this.download(error.error, 'policies');
          return;
        }

        if (this.checkIfNotDataError(error)) {
          this.notification.showDialog('Not Data Found', error.message);
        } else {
          this.notification.showDialog('Unexpected error', error.message);
        }
      });
  }

  /**
   * Download the New Business policies search result in Excel
   */
  downloadNewBusinessExcel() {
    let agentName;
    let agentId;
    let agentSearch: Agent;
    const currentStatus = (this.currentStatus) ? this.currentStatus : '';
    const currentDateFrom = moment(new Date(this.currentReceptionDateFrom)).format('YYYY-MM-DD');
    const currentDateTo = moment(new Date(this.currentReceptionDateTo)).format('YYYY-MM-DD');
    const languageId = this.translationService.getLanguageId().toString();

    if (this.currentAgentId && this.agentList && this.agentList.length > 0) {
      agentSearch = this.agentList.find(x => x.agentId === this.policyViewForm.controls.agent.value);
      agentName = (agentSearch.firstName) ? agentSearch.firstName + ' ' + agentSearch.lastName : agentSearch.companyName;
      agentId = agentSearch.agentId;
    } else {
      agentName = (this.agentAut.agentName) ? this.agentAut.agentName : this.agentAut.companyName;
      agentId = this.agentAut.agentId.toString();
    }

    this.policyService.getDocumentNewBusiness(languageId, agentId, agentName, currentStatus,
      currentDateFrom, currentDateTo, this.collectionSize.toString()).subscribe(data => {
        this.download(data, 'newbusiness');
      }, error => {
        if (this.checkIfHasData(error)) {
          this.download(error.error, 'newbusiness');
          return;
        }

        if (this.checkIfNotDataError(error)) {
          this.notification.showDialog('Not Data Found', error.message);
        } else {
          this.notification.showDialog('Unexpected error', error.message);
        }
      });
  }

  /**
   * Download the Renewals policies search result in Excel
   */
  downloadRenewalsExcel() {
    let agentName;
    let agentId;
    let agentSearch: Agent;
    const renewalsDateFrom = moment(new Date(this.currentRenewalsDateFrom)).format('YYYY-MM-DD');
    const renewalsDateTo = moment(new Date(this.currentRenewalsDateTo)).format('YYYY-MM-DD');
    const languageId = this.translationService.getLanguageId().toString();

    if (this.currentAgentId && this.agentList && this.agentList.length > 0) {
      agentSearch = this.agentList.find(x => x.agentId === this.policyViewForm.controls.agent.value);
      agentName = (agentSearch.firstName) ? agentSearch.firstName + ' ' + agentSearch.lastName : agentSearch.companyName;
      agentId = agentSearch.agentId;
    } else {
      agentName = (this.agentAut.agentName) ? this.agentAut.agentName : this.agentAut.companyName;
      agentId = this.agentAut.agentId.toString();
    }

    this.policyService.getDocumentRenewals(languageId, agentId, agentName,
      renewalsDateFrom, renewalsDateTo, this.collectionSize.toString()).subscribe(data => {
        this.download(data, 'renewals');
      }, error => {
        if (this.checkIfHasData(error)) {
          this.download(error.error, 'renewals');
          return;
        }

        if (this.checkIfNotDataError(error)) {
          this.notification.showDialog('Not Data Found', error.message);
        } else {
          this.notification.showDialog('Unexpected error', error.message);
        }
      });
  }

  download(data, name) {
    const file = new Blob([data], { type: 'application/vnd.ms-excel' });
    const fileName = `${name}-${Utilities.generateRandomId()}`;
    saveAs(file, `${fileName}.xls`);
  }

  checkIfNotDataError(error) {
    return (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND);
  }

  checkIfHasData(error) {
    return (error.status === this.ERROR_STATUS_FOR_DATA_AS_302);
  }

  isRoleEmployeeOrAdmin(): boolean {
    return (this.user.role_id === this.role_id_employee || this.user.role_id === this.role_id_admin);
  }
}
