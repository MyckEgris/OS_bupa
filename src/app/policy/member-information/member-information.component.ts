/**
* MemberInformationComponent.ts
*
* @description: This component handles member information.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 08-05-2019.
*
**/

import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { PolicyResponse } from 'src/app/shared/services/policy/entities/policy-response.dto';
import { Router } from '@angular/router';
import { RoutingStateService } from 'src/app/shared/services/routing/routing-state.service';
import { PolicyInformationModel } from 'src/app/security/model/policy-information.model';
import { PolicyInformationService } from 'src/app/security/services/policy-information/policy-information.service';
import * as $ from 'jquery';

/**
 * This component handles member information.
 */
@Component({
  selector: 'app-member-information',
  templateUrl: './member-information.component.html'
})
export class MemberInformationComponent implements OnInit, AfterViewInit {
  /**
   * Form group for claim view reactive form
   */
  public searchPolicyForm: FormGroup;

  /**
   * Months of year
   */
  public monthsOfYear: Array<any>;

  /**
   * Min Date
   */
  public minDate = new Date();

  /**
   * Max Date
   */
  public maxDate = new Date();

  /**
   * PolicyResponse
   */
  public policyResponse: PolicyResponse;

  /**
   * Page
   */
  public page = 1;

  /**
   * Initial Renewal Date
   */
  public initialDate: any;

  /**
   * Final Renewal Date
   */
  public finalDate: any;

  /**
   * birthMonthsList
   */
  public birthMonthsList: string;

  /**
   * birthMonths
   */
  private birthMonths: Array<any> = [];

  /**
   * User
   */
  private user: any;

  /**
   * Defailt page
   */
  private DEFAULT_PAGE = 1;

  /**
   * Constructor Method
   * @param commonService Common Service Injection
   * @param policyService Policy Service Injection
   * @param authService Auth Service Injection
   * @param router Router Service Injection
   * @param routingState Routing Service Injection
   * @param policyInformationService Policy Information Service Injection
   */
  constructor(
    private commonService: CommonService,
    private policyService: PolicyService,
    private authService: AuthService,
    private router: Router,
    private routingState: RoutingStateService,
    private policyInformationService: PolicyInformationService
  ) { }

  /**
   * Build form, initialize component and resolve if search policies or bind last search
   */
  async ngOnInit() {
    this.searchPolicyForm = this.buildSearchPoliciesForm();
    this.initComponentValues();
    if (this.isDetailRouteOrigin()) {
      const policyCriteria = this.policyInformationService.getPolicyCriteria();
      this.bindSearchCriteria(policyCriteria);
      return;
    } else {
      this.searchPaginate(this.DEFAULT_PAGE);
    }
  }

  /**
   * Initialize variables and configurations
   */
  private initComponentValues() {
    this.user = this.authService.getUser();
    this.page = 1;
    this.policyResponse = this.policyService.CreateNewPolicyResponse();
    this.monthsOfYear = this.commonService.monthsOfYear();
    this.initialDate = this.getInitialDate();
    this.searchPolicyForm.controls['initialDate'].setValue(this.initialDate);
    this.setFinalDate();
    this.onInitialDateChange();
    this.onFinalDateChange();
    this.setValidators();
  }

  /**
   * Event on initial date change
   */
  onInitialDateChange() {
    this.searchPolicyForm.get('initialDate').valueChanges.subscribe(val => {
      (<FormControl>this.searchPolicyForm.controls['finalDate']).reset();
      this.initialDate = val;
      this.setFinalDate();
    });
  }

  /**
   * Event on final date change
   */
  onFinalDateChange() {
    this.searchPolicyForm.get('finalDate').valueChanges.subscribe(val => {
      this.finalDate = val;
      if (this.finalDate < this.initialDate) {
        this.setFinalDate();
      }
    });
  }

  /**
   * Event on search criteria change
   */
  onSearchCriteriaChange() {
    this.page = 1;

  }

  /**
   * Set validator depending search criteria
   */
  private setValidators() {
    switch (this.searchPolicyForm.value.searchCriteria) {
      case '0':
        this.validatorsForDependantCoverage();
        break;
      case '1':
        this.validatorsForBirthDate();
    }
  }

  /**
   * Validator for dependant coverage
   */
  private validatorsForDependantCoverage() {
    this.searchPolicyForm.controls.initialDate.setValidators([Validators.required]);
    this.searchPolicyForm.controls.finalDate.setValidators([Validators.required]);
  }

  /**
   * Validator for birth date
   */
  private validatorsForBirthDate() {
    if (this.birthMonthsList === '') {
      return false;
    }
  }

  /**
   * Set final date
   */
  private setFinalDate() {
    this.finalDate = this.getFinalDate();
    this.searchPolicyForm.controls['finalDate'].setValue(this.finalDate);
  }

  /**
   * Build search policy form
   */
  private buildSearchPoliciesForm() {
    return new FormGroup(
      {
        searchCriteria: new FormControl('0'),
        initialDate: new FormControl(''),
        finalDate: new FormControl(''),
        months: new FormControl('')
      }
    );
  }

  /**
   * Search policies by dependant coverage
   * @param page Page
   */
  searchPoliciesByDependantCoverage(page) {
    this.page = page;
    this.saveSearchCriteria();
    this.policyService.getPoliciesByDependantCoverage(this.user.role_id, this.user.user_key, this.page, 10, +this.user.agent_number,
      this.searchPolicyForm.controls['initialDate'].value, this.searchPolicyForm.controls['finalDate'].value, true).subscribe(data => {
        this.policyResponse = data;
      }, error => {
        this.policyResponse = this.policyService.CreateNewPolicyResponse();
      });
  }

  /**
   * Search policies by birth date
   * @param page Page
   */
  searchPoliciesByBirthDate(page) {
    this.page = page;
    this.saveSearchCriteria();
    this.policyService.getPoliciesByBirthDate(this.user.role_id, this.user.user_key, this.page, 10, +this.user.agent_number,
      this.birthMonthsList).subscribe(data => {
        this.policyResponse = data;
      }, error => {
        this.policyResponse = this.policyService.CreateNewPolicyResponse();
      });
  }

  /**
   * Search with pagination
   * @param page Page
   */
  searchPaginate(page) {
    this.page = page;
    switch (this.searchPolicyForm.value.searchCriteria) {
      case '0':
        this.searchPoliciesByDependantCoverage(this.page);
        break;
      case '1':
        this.searchPoliciesByBirthDate(this.page);
        break;
      default:
        this.searchPoliciesByDependantCoverage(this.page);
    }
  }

  /**
   * Get initial date
   */
  getInitialDate() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Get final date
   */
  getFinalDate() {
    const initialDate: Date = this.initialDate;
    const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 3, 0);
    return finalDate;
  }

  /**
   * Navigate to policy detail information
   * @param policyId Policy ID
   */
  goToDetail(policyId: number) {
    this.router.navigate(['policies/view-policy-information', policyId]);
  }

  /**
   * Event on change selection of status
   * @param event Event
   * @param value Value
   */
  changeValueFilterStatus(event, value) {
    if (event.target.checked) {
      this.birthMonths.push(value);
    } else {
      if (this.birthMonths.indexOf(value) > -1) {
        this.birthMonths.splice(this.birthMonths.indexOf(value), 1);
      }
    }

    if (this.birthMonths.length > 0) {
      this.birthMonths.forEach(x => {
        this.birthMonthsList = this.birthMonths.join();
      });
    } else {
      this.birthMonthsList = '';
    }
  }

  /**
   * Check months of last search
   * @param list Month list
   */
  checklistOfMonths(list: string) {
    const monthArray = list.split(',');
    for (const month of this.monthsOfYear) {
      if (monthArray.indexOf(month.id.toString()) > -1) {
        $('input:checkbox[id=month-' + month.id + ']').attr('checked', true);
      }
    }
  }

  /**
   * Evaluates last route
   */
  isDetailRouteOrigin() {
    return (this.routingState.getPreviousUrl().indexOf('member-information/') > -1);
  }

  /**
   * Bind selected filters, parameters and page
   * @param PolicyInformationModel
   */
  bindSearchCriteria(policyCriteria: PolicyInformationModel) {
    this.searchPolicyForm.controls['searchCriteria'].setValue(policyCriteria.policySearchType);
    this.page = policyCriteria.page;
    if (policyCriteria.policySearchType === '0') {
      this.initialDate = policyCriteria.renewalDateFrom;
      this.finalDate = policyCriteria.renewalDateTo;
      this.searchPolicyForm.controls['initialDate'].setValue(policyCriteria.renewalDateFrom);
      this.searchPolicyForm.controls['finalDate'].setValue(policyCriteria.renewalDateTo);
    }
    if (policyCriteria.policySearchType === '1') {
      this.birthMonths = policyCriteria.statusStringList.split(',');
      this.birthMonthsList = policyCriteria.statusStringList;
      this.checklistOfMonths(policyCriteria.statusStringList);
    }
    this.searchPaginate(policyCriteria.page);
  }

  /**
   * Save filters, parameters and current page
   */
  saveSearchCriteria() {
    const pi = {} as PolicyInformationModel;
    pi.criteriaFilter = '';
    pi.policySearchType = this.searchPolicyForm.value.searchCriteria;
    pi.page = this.page;

    if (this.searchPolicyForm.value.searchCriteria === '0') {
      pi.renewalDateFrom = this.searchPolicyForm.value.initialDate;
      pi.renewalDateTo = this.searchPolicyForm.value.finalDate;
    }
    if (this.searchPolicyForm.value.searchCriteria === '1') {
      pi.statusStringList = this.birthMonthsList;
    }

    this.policyInformationService.setPolicyCriteria(pi);
  }

  /**
   * Event after view init
   */
  ngAfterViewInit(): void {
    if (this.searchPolicyForm.value.searchCriteria === '1' && this.birthMonthsList !== '') {
      this.checklistOfMonths(this.birthMonthsList);
    }
  }

}
