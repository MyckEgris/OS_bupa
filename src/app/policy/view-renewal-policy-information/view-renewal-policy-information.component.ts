/**
* ViewRenewalPolicyInformationComponent.ts
*
* @description: This component show policies for make renewal according search filters
* @author Juan Camilo Moreno
* @version 1.0
* @date 15-09-2019.
*
**/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { PolicyResponse } from 'src/app/shared/services/policy/entities/policy-response.dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { Utilities } from 'src/app/shared/util/utilities';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { Subscriber, Subscription } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { RoutingStateService } from 'src/app/shared/services/routing/routing-state.service';
import { QuotePolicyService } from 'src/app/security/services/quote-policy/quote-policy.service';
import { QuotePolicyModel } from 'src/app/security/model/quote-policy.model';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { Agent } from 'src/app/shared/services/agent/entities/agent';

/**
 * This component show policies for make renewal according search filters
 */
@Component({
  selector: 'app-view-renewal-policy-information',
  templateUrl: './view-renewal-policy-information.component.html'
})
export class ViewRenewalPolicyInformationComponent implements OnInit, OnDestroy {

  /**
   * policyForm
   */
  public policyForm: FormGroup;

  /**
   * parameters
   */
  public parameters: Array<any>;

  /**
   * status
   */
  public status: Array<any>;

  /**
   * visibleParameters
   */
  public visibleParameters: Array<any>;

  /**
   * renewalDateFrom
   */
  public renewalDateFrom: Date;

  /**
   * renewalDateTo
   */
  public renewalDateTo: Date;

  /**
   * minDate
   */
  public minDate: Date;

  /**
   * maxDate
   */
  public maxDate: Date;

  /**
   * page
   */
  public page: number;

  /**
   * pageSize
   */
  public pageSize = 10;

  /**
   * policyResponse
   */
  public policyResponse: PolicyResponse;

  /**
   * changeDateFrom
   */
  public changeDateFrom = false;

  /**
   * changeDateTo
   */
  public changeDateTo = false;

  /**
   * isValidRenewalPeriod
   */
  public isValidRenewalPeriod: boolean;

  /**
   * isValidRange
   */
  public isValidRange: boolean;

  /**
   * Stores the logged user information
   */
  public agentList: Agent[];

  /**
   * Stores the logged agent information
   */
  private agentAut: Agent;

  /**
   * user
   */
  private user: any;

  /**
   * constant DEFAULT_STATUS
   */
  private DEFAULT_STATUS = 'Active';

  /**
   * constant DEFAULT_BUSINESS_MODE
   */
  private DEFAULT_BUSINESS_MODE = '1';

  /**
   * constant INITIAL_PAGE
   */
  private INITIAL_PAGE = 1;

  /**
   * Constant for sanitas bupa insurance
   */
  private SANITAS_INSURANCE = 59;

  /**
   * statusJoined
   */
  private statusJoined: string;

  /**
   * insurancesJoined
   */
  private insurancesJoined: string;

  /**
   * dateSubscription
   */
  private dateSubscription: Subscription;

  /**
   * Policy Issue Date.
   */
  private policyIssueDate: Date;

  /**
   * Policy Application Date.
   */
  private policyApplicationRecivedDate: Date;

  /**
   * Policy Renewal Date.
   */
  private policyRenewalDate: Date;

  private defaultSeparator = ',';

  public disableQuotationButton: boolean;

  /**
   * Constructor method
   * @param policyService policyService injection
   * @param authService authService injection
   * @param router router injection
   */
  constructor(
    private policyService: PolicyService,
    private authService: AuthService,
    private router: Router,
    private routingState: RoutingStateService,
    private quotePolicyService: QuotePolicyService,
    private agentService: AgentService,
    private config: ConfigurationService
  ) { }

  /**
   * OnInit method. Initialize variables, load comboboxes and create reactive form, with initial values and validations
   */
  ngOnInit() {
    this.disableQuotationButton = false;
    this.parameters = this.loadSearchParameters();
    this.status = this.loadPoliciesStatus();
    this.initializeValues();
    if (this.user.role_id !== '5') {
      this.getAuthAgentInformation();
      this.searchAgentHierarchyById();
    }
    this.policyForm = this.buildPolicyForm();

    this.setVisibleParameters();
    this.setDefaultDatesValue();
    this.clearForm();

    this.dateSubscription = this.policyForm.get('renewalDatefrom').valueChanges.subscribe(date => {
      if (date !== new Date()) {
        /*const changeDateTo = moment(date).add(2, 'months').calendar();
        const toDate = this.policyForm.get('renewalDateTo');
        toDate.reset();
        this.maxDate = new Date(changeDateTo);
        this.policyForm.get('renewalDateTo').setValue(new Date(changeDateTo), { eventEmit: false });*/
        this.setDateToValue(date);
      }
    });

    if (this.isDetailRouteOrigin()) {
      const policyCriteria = this.quotePolicyService.getQuotePolicyCriteria();
      this.bindSearchCriteria(policyCriteria);
      return;
    }

  }

  setDateToValue(date) {
    const changeDateTo = moment(date).add(2, 'months').calendar();
        const toDate = this.policyForm.get('renewalDateTo');
        toDate.reset();
        this.maxDate = new Date(changeDateTo);
        this.policyForm.get('renewalDateTo').setValue(new Date(changeDateTo), { eventEmit: false });
  }

  /**
   * OnDestroy component, free objects, subscriptions, arrays
   */
  ngOnDestroy() {
    this.dateSubscription.unsubscribe();
  }

  /**
   * Checks routing state service for quote route for resolve bind parameters from redux
   */
  isDetailRouteOrigin() {
    return (this.routingState.getPreviousUrl().indexOf('quote/quotation/') > -1);
  }

  /**
   * Initialize variables
   */
  initializeValues() {
    this.user = this.authService.getUser();
    this.page = this.INITIAL_PAGE;
    this.statusJoined = this.status.map(s => s.value).join(this.defaultSeparator);
    this.insurancesJoined = this.insuranceListToExclude().join(this.defaultSeparator);
    this.isValidRenewalPeriod = false;
    this.isValidRange = true;
    this.policyResponse = { pageindex: this.INITIAL_PAGE, pageSize: this.pageSize, count: -1, data: [] } as PolicyResponse;
  }

  insuranceListToExclude() {

    const bupaInsuranceToExclude = this.config.ihiBupaInsurances;
    const bupaInsuranceToExcludeList = bupaInsuranceToExclude.split(this.defaultSeparator);
    let insuranceList: Array<any> = [];
    if (typeof(this.user.bupa_insurances) === 'string') {
      insuranceList.push(this.user.bupa_insurances);
    } else {

      insuranceList = Object.assign([], this.user.bupa_insurances);
      bupaInsuranceToExcludeList.forEach(function (value) {
        const findInsurance = insuranceList.findIndex(x => x === value);
        if (findInsurance > -1) {
          insuranceList.splice(findInsurance, 1);
        }
      });
    }

    return insuranceList;
  }

  /**
   * Set default values for dates fields
   */
  setDefaultDatesValue() {
    this.minDate = Utilities.getDateNow();
    this.maxDate = Utilities.addMonths(Utilities.getDateNow(), 2);
    this.renewalDateFrom = Utilities.getDateNow();
    this.renewalDateTo = Utilities.addDays(Utilities.getDateNow(), 60);
    this.policyForm.get('renewalDatefrom').setValue(this.renewalDateFrom, { emitEvent: false });
    this.policyForm.get('renewalDateTo').setValue(this.renewalDateTo, { emitEvent: false });
  }

  /**
   * Build reactive form for policy search
   */
  buildPolicyForm() {
    return new FormGroup({
      parameter: new FormControl(1),
      policyNumber: new FormControl(),
      agentNumber: new FormControl(),
      status: new FormControl(this.DEFAULT_STATUS),
      renewalDatefrom: new FormControl(),
      renewalDateTo: new FormControl()
    });
  }

  /**
   * Set field validations according selected search parameter
   */
  setValidations() {
    this.clearFieldsAndValidations();

    switch (Number(this.policyForm.controls.parameter.value)) {
      case 1:
        this.setValidationsByPolicyId();
        break;
      case 2:
        this.setValidationByAgentId();
        break;
      case 3:
        this.setValidationByStatus();
        break;
      case 4:
        this.setValidationByDateRenewal();
        break;
    }
    this.policyForm.updateValueAndValidity();
  }

  /**
   * Set validation for policy id choosen option
   */
  setValidationsByPolicyId() {
    this.policyForm.controls.policyNumber.setValidators([Validators.required, Validators.maxLength(9)]);
    this.policyForm.get('policyNumber').updateValueAndValidity();
  }

  /**
   * Set validation for agent id choosen option
   */
  setValidationByAgentId() {
    this.policyForm.controls.agentNumber.setValidators([Validators.required, Validators.maxLength(9)]);
    this.policyForm.get('agentNumber').updateValueAndValidity();
    this.setValidationByDateRenewal();
  }

  /**
   * Set validation for status choosen option
   */
  setValidationByStatus() {
    this.policyForm.controls.status.setValidators([Validators.required]);
    this.policyForm.get('status').updateValueAndValidity();
    this.setValidationByDateRenewal();
  }

  /**
   * Set validation for date renewal range choosen option
   */
  setValidationByDateRenewal() {
    const valid = false;
    this.policyForm.controls.renewalDatefrom.setValidators([Validators.required]);
    this.policyForm.controls.renewalDateTo.setValidators([Validators.required]);
    this.policyForm.get('renewalDateTo').updateValueAndValidity();
    this.policyForm.setValidators(CustomValidator.startDateLessThanEndDateGroup('renewalDatefrom', 'renewalDateTo'));
  }

  /**
   * Clear fields and validations
   */
  clearFieldsAndValidations() {
    this.changeDateFrom = true;
    this.changeDateTo = true;
    this.policyForm.controls.policyNumber.setValue('');
    this.policyForm.controls.agentNumber.setValue('');
    this.policyForm.controls.status.setValue('Active');
    // tslint:disable-next-line: forin
    for (const key in this.policyForm.controls) {
      this.policyForm.get(key).clearValidators();
      this.policyForm.get(key).updateValueAndValidity();
    }
    this.setDefaultDatesValue();
    this.changeDateFrom = false;
    this.changeDateTo = false;
  }

  /**
   * Show search fields according selected option
   */
  setVisibleParameters() {
    switch (Number(this.policyForm.get('parameter').value)) {
      case 1:
        this.visibleParameters = [true, false, false, false];
        break;
      case 2:
        this.visibleParameters = [false, true, false, true];
        break;
      case 3:
        this.visibleParameters = [false, false, true, true];
        break;
      case 4:
        this.visibleParameters = [false, false, false, true];
        break;
    }
  }

  /**
   * Load search parameters options
   */
  loadSearchParameters() {
    return [
      { key: 'EMPLOYEE.QUOTE.SEARCH_PARAMETER.BY_POLICY', value: 1 },
      { key: 'EMPLOYEE.QUOTE.SEARCH_PARAMETER.BY_AGENT', value: 2 },
      { key: 'EMPLOYEE.QUOTE.SEARCH_PARAMETER.BY_STATUS', value: 3 },
      { key: 'EMPLOYEE.QUOTE.SEARCH_PARAMETER.BY_DATE', value: 4 },
    ];
  }

  /**
   * Load search status
   */
  loadPoliciesStatus() {
    return [
      { key: 'EMPLOYEE.QUOTE.STATUS.ACTIVE', value: 'Active' },
      { key: 'EMPLOYEE.QUOTE.STATUS.LAPSED', value: 'Lapsed' },
      { key: 'EMPLOYEE.QUOTE.STATUS.GRACE_PERIOD', value: 'Grace Period' },
    ];
  }

  /**
   * Get policy date according dateid
   * @param dateId DateId
   * @param dates Dates array
   */
  getpolicyDate(dateId, dates) {
    const date = dates.find(x => x.policyDateId === dateId);
    return date.policyDateValue || '';
  }

  /**
   * Execute search
   * @param page page
   */
  searchPolicies(page) {
    this.policyResponse = { pageindex: this.INITIAL_PAGE, pageSize: this.pageSize, count: -1, data: [] } as PolicyResponse;
    this.isValidRenewalPeriod = this.validateRenewalPeriod();
    this.isValidRange = this.validateTwoMonthsRangeBetweenDates();
    if (!this.isValidRenewalPeriod && this.isValidRange) {
      this.page = page;
      switch (Number(this.policyForm.controls.parameter.value)) {
        case 1:
          this.callSearchByPolicyId(page);
          break;
        case 2:
          this.callSearchByAgentId(page);
          break;
        case 3:
          this.callSearchByStatus(page);
          break;
        case 4:
          this.callSearchByRenewalDate(page);
          break;
      }

      this.setQuotePolicyCriteria();
    }
  }

  /**
   * Validate renewal period
   */
  validateRenewalPeriod() {
    if (Number(this.policyForm.get('parameter').value) !== 1) {
      const from = new Date(this.policyForm.get('renewalDatefrom').value).getFullYear();
      const to = new Date(this.policyForm.get('renewalDateTo').value).getFullYear();
      const currentYear = new Date().getFullYear();
      const limitDate = new Date(currentYear, 10, 30);
      const currentDate = Utilities.getDateNow();
      return ((from > currentYear || to > currentYear) && (currentDate <= limitDate));
    }

    return false;
  }

  /**
   * Validate two months of range between initial and final date
   */
  validateTwoMonthsRangeBetweenDates() {
    if (Number(this.policyForm.get('parameter').value) !== 1) {
      const from = new Date(this.policyForm.get('renewalDatefrom').value);
      const to = new Date(this.policyForm.get('renewalDateTo').value);

      return (moment(to).diff(moment(from), 'days') <= 60);
    }

    return true;
  }

  /**
   * execute search policies by policyid
   * @param page page
   */
  callSearchByPolicyId(page) {
    this.policyService.getPoliciesToRenewalByPolicyId(this.policyForm.get('policyNumber').value, this.user.role_id, this.user.user_key,
      this.statusJoined, this.DEFAULT_BUSINESS_MODE, this.insurancesJoined, true, page, this.pageSize, true).subscribe(res => {
        this.policyResponse = { pageindex: 1, pageSize: 1, count: 1, data: [res] } as PolicyResponse;
        this.setPolicyDates(this.policyResponse);
      }, error => {
        this.catchError();
      });
  }

  /**
   * execute search policies by agentid
   * @param page page
   */
  callSearchByAgentId(page) {
    this.policyService.getPoliciesToRenewalByAgent(this.user.role_id, this.user.user_key, this.statusJoined, this.DEFAULT_BUSINESS_MODE,
      this.insurancesJoined, this.policyForm.get('renewalDatefrom').value, this.policyForm.get('renewalDateTo').value, page,
      this.pageSize, this.policyForm.get('agentNumber').value)
      .subscribe(res => {
        this.policyResponse = res;
        this.setPolicyDates(this.policyResponse);
      }, error => {
        this.catchError();
      });
  }

  private setPolicyDates(policyResponse: PolicyResponse) {
    this.policyIssueDate = new Date(policyResponse.data[0].policyDates.find(x => x.policyDateId === 100).policyDateValue);
    this.policyRenewalDate = new Date(policyResponse.data[0].policyDates
      .find(x => x.policyDateId === 111 || x.policyDateId === 101).policyDateValue);
    this.policyApplicationRecivedDate = new Date(policyResponse.data[0].policyDates.find(x => x.policyDateId === 102).policyDateValue);
  }

  /**
   * execute search policies by status
   * @param page page
   */
  callSearchByStatus(page) {
    this.policyService.getPoliciesToRenewalByStatus(this.user.role_id, this.user.user_key, this.policyForm.get('status').value,
      this.DEFAULT_BUSINESS_MODE, this.insurancesJoined, this.policyForm.get('renewalDatefrom').value,
      this.policyForm.get('renewalDateTo').value, page, this.pageSize)
      .subscribe(res => {
        this.policyResponse = res;
        this.setPolicyDates(this.policyResponse);
      }, error => {
        this.catchError();
      });
  }

  /**
   * execute search policies by renewal period
   * @param page page
   */
  callSearchByRenewalDate(page) {
    this.policyService.getPoliciesToRenewalByRenewalDates(this.user.role_id, this.user.user_key, this.insurancesJoined,
      this.policyForm.get('renewalDatefrom').value, this.policyForm.get('renewalDateTo').value, page, this.pageSize).subscribe(res => {
        this.policyResponse = res;
        this.setPolicyDates(this.policyResponse);
      }, error => {
        this.catchError();
      });
  }

  /**
   * Catch error when policies not found
   */
  catchError() {
    this.policyResponse = { pageindex: this.INITIAL_PAGE, pageSize: this.pageSize, count: 0, data: [] } as PolicyResponse;
  }

  /**
   * Clear form
   */
  clearForm() {
    this.policyResponse = { pageindex: this.INITIAL_PAGE, pageSize: this.pageSize, count: -1, data: [] } as PolicyResponse;
    this.setValidations();
  }

  /**
   * On parameter change
   * @param event event
   */
  onParameterChange() {
    this.setVisibleParameters();
    this.setDefaultDatesValue();
    this.clearForm();
    this.initializeValues();
  }

  /**
   * Go to quotation wizard for create a quote
   * @param policyId policyId
   */
  goToQuotation(policyId) {
    this.router.navigate([`/quote/quotation/${policyId}`]);
  }

  /**
   * Bind form and search result with chosen critera parameters for search
   * @param policyCriteria Policy criteria
   */
  bindSearchCriteria(policyCriteria: QuotePolicyModel) {
    this.policyForm.get('parameter').setValue(policyCriteria.criteriaFilter);
    this.onParameterChange();
    this.policyForm.get('renewalDatefrom').setValue(policyCriteria.renewalDateFrom);
    this.policyForm.get('renewalDateTo').setValue(policyCriteria.renewalDateTo);
    this.page = policyCriteria.page;

    switch (Number.parseInt(policyCriteria.criteriaFilter)) {
      case 1:
        this.policyForm.get('policyNumber').setValue(policyCriteria.policyId);
        break;
      case 2:
        this.policyForm.get('agentNumber').setValue(policyCriteria.agentId);
        break;
      case 3:
        this.policyForm.get('status').setValue(policyCriteria.policyStatus);
        break;
      default:
        this.policyForm.get('policyNumber').setValue(policyCriteria.policyId);
        break;
    }

    this.searchPolicies(this.page);
  }

  /**
   * Save parameters in redux for search quote policies
   */
  setQuotePolicyCriteria() {
    const quoteParameters = {} as QuotePolicyModel;
    quoteParameters.criteriaFilter = this.policyForm.get('parameter').value;
    quoteParameters.policyId = this.policyForm.get('policyNumber').value;
    quoteParameters.agentId = this.policyForm.get('agentNumber').value;
    quoteParameters.policyStatus = this.policyForm.get('status').value;
    quoteParameters.renewalDateFrom = this.policyForm.get('renewalDatefrom').value;
    quoteParameters.renewalDateTo = this.policyForm.get('renewalDateTo').value;
    quoteParameters.page = this.page;
    this.quotePolicyService.setQuotePolicyCriteria(quoteParameters);
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
      // this.handlePolicyError(error);
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
      this.policyForm.controls['agentNumber'].setValue(this.agentList[0].agentId);
    }
  }

  getAuthAgentInformation() {
    this.agentService.getAgentById(this.user.user_key).subscribe(result => {
      this.agentAut = result;
    });
  }

  public isIhiBupaInsurances(bupaInsurance) {
    if (bupaInsurance) {
      const bupaInsuranceToExcludeList = this.config.ihiBupaInsurances.split(',');
      const bupaInsuranceFound = bupaInsuranceToExcludeList.find(x => x === bupaInsurance.toString());
      if (bupaInsuranceFound) {
        return true;
      }
    }
    return false;
  }

}
