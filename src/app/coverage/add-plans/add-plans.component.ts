import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BupaInsuranceDto } from 'src/app/shared/services/user/entities/bupaInsurance.dto';
import { ProductByBussinessDto } from 'src/app/shared/services/products/entities/productByBussiness.dto';
import { ProductsService } from 'src/app/shared/services/products/products.service';
import { PlanService } from 'src/app/shared/services/plan/plan.service';


import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { PlanbyProductDto } from 'src/app/shared/services/products/entities/planbyProductDto';
import { PlanByProductKeyDto } from 'src/app/shared/services/network/entities/planByProductKey.dto';
import { CoveragesService } from 'src/app/shared/services/coverage/coverages.service';
import { CoverageResponseDto } from 'src/app/shared/services/coverage/entities/coverageResponse.dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
// import { AddedPlanDto } from 'src/app/shared/services/plan/entities/addedPlan.dto';

import { count } from 'rxjs/operators';
import { CoverageByPlanKeyDto } from 'src/app/shared/services/coverage/entities/coverageByPlanKey.dto';
import { AddPlansModalComponent } from './add-plans-modal/add-plans-modal.component';
import { AddedCoverageDto } from 'src/app/shared/services/coverage/entities/addedCoverage.dto';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { CustomCurrencyPipe } from 'src/app/shared/pipes/currency/custom-currency.pipe';
import { element } from 'protractor';
import * as _ from 'underscore';

@Component({ selector: 'app-add-plans', templateUrl: './add-plans.component.html', providers: [CustomCurrencyPipe] })
export class AddPlansComponent implements OnInit,
  OnDestroy { /**
  * User Authenticated Object
  */
  user: UserInformationModel;

  // /**
  // * Holds the form information
  // */
  // public formAddPlans: FormGroup;

  /**
 * Object for bussiness response
 */
  public bussinessResponse: BupaInsuranceDto[];

  // /**
  // * Object for products response
  // */
  public productsResponse: ProductByBussinessDto[];

  /**
 * Object for selected plans array
 */
  public plansResponse: PlanByProductKeyDto[];

  /**
 * Object for selected networks array
 */
  public selectedCoverages: CoverageByPlanKeyDto[];

  /**
 * Object for plans response
 */
  public coverageResponse: CoverageResponseDto;

  /**
 * Subscription Bussiness
 */
  private subBussiness: Subscription;

  /**
 * Subscription Products
 */
  private subProducts: Subscription;

  /**
 * Subscription Plans
 */
  private subPlans: Subscription;

  /**
 * Subscription Coverages
 */
  private subCoverages: Subscription;

  /**
 * Subscription Excluded Plans
 */
  private subExcludedCoverages: Subscription;

  /**
 * Const to Identify the nested FormGroup filterCriteria
 */
  public FILTER_CRITERIA_FG = 'filterCriteria';

  // /**
  // * Const to Identify the nested FormArray plansList
  // */
  // public NETWORKS_LIST_FA = 'plansList';

  /***
 * Const to Identify the nested FormControl BussinessId
 */
  public BUSSINESS_ID_CTRL = 'bussinessId';

  /***
 * Const to Identify the nested FormControl ProductKey
 */
  public PRODUCT_KEY_CTRL = 'productKey';

  /***
 * Const to Identify the nested FormControl PlanKey
 */
  public PLAN_KEY_CTRL = 'planKey';

  /**
 * Const to Identify the nested FormArray plansList
 */
  public COVERAGE_LIST_FA = 'coverageList';

  /**
 * Const to Identify the nested FormControl fromDateCtrl
 */
  public FROM_DATE_CTRL = 'fromDate';

  /**
 * Const to Identify the nested FormControl toDateCtrl
 */
  public TO_DATE_CTRL = 'toDate';

  /**
 * Const to Identify the nested FormControl coverageName
 */
  public COVERAGE_NAME_CTRL = 'coverageName';

  /**
 * Const to Identify the nested FormControl waitingPeriodDays
 */
  public WAITING_PERIOD_DAYS_CTRL = 'waitingPeriodDays';

  /**
* Const to Identify the nested FormControl waitingPeriodMonths
*/
  public WAITING_PERIOD_MONTHS_CTRL = 'waitingPeriodMonths';

  /**
* Const to Identify the nested FormControl requiresPreautorization
*/
  public REQUIRES_PREAUTHORIZATION_CTRL = 'requiresPreautorization';

  /**
* Const to Identify the nested FormControl coinsurance
*/
  public COINSURANCE_CTRL = 'coinsurance';

  /**
* Const to Identify the nested FormControl deductible
*/
  public DEDUCTIBLE_CTRL = 'deductible';

  /**
* Const to Identify the nested FormControl copay
*/
  public COPAY_CTRL = 'copay';

  /**
* Const to Identify the nested FormControl costLimitTotal
*/
  public COST_LIMIT_TOTAL_CTRL = 'costLimitTotal';

  /**
* Const to Identify the nested FormControl quantityLimit
*/
  public QUANTITY_LIMIT_CTRL = 'quantityLimit';

  /**
* Const to Identify the nested FormControl costLimitUnit
*/
  public COST_LIMIT_UNIT_CTRL = 'costLimitUnit';

  /**
* Const to Identify the nested FormControl generalWaitingPeriodDays
*/
  public GENERAL_WAITING_PERIOD_DAYS_CTRL = 'generalWaitingPeriodDays';

  /**
 * Stores the filter values so it will use it when paging.
 */
  public currentPlanKey: string;

  /**
  * Init page for pagination component
  */
  public INIT_PAGE = 1;

  /**
 * Page size for pagination component
 */
  public PAGE_SIZE = 25;

  /**
 * Current page for pagination component
 */
  public page: number;

  /**
 * Collection size for pagination component
 */
  public collectionSize: number;

  public coverageNamesToClose: string[];

  /**
 * Flag for plans data array content
 */
  public sucessSearch = false;

  /**
 * Bool to show validations.
 */
  public formInvalid = false;

  /**
 * Constants for the add plans modal message.
 */
  private ADD_COVERAGES_MSG_TITLE = 'COVERAGES.ADD_PLANS.TITLE_MSG';
  private ADD_COVERAGES_MSG_OK_BTN = 'COVERAGES.ADD_PLANS.OK_BTN';

  private SUCCESS_SUBMIT_COVERAGES = 'COVERAGES.ADD_PLANS.SUCCESS_SUBMIT_MSG';
  private ERROR_SUBMIT_COVERAGES = 'COVERAGES.ADD_PLANS.ERROR_SUBMIT_MSG';

  private LEAVE = 'POLICY.POLICY_ENROLLMENT.DEACTIVATE_ROUTE_LEAVE';
  private STAY = 'POLICY.POLICY_ENROLLMENT.DEACTIVATE_ROUTE_STAY';

  private DELETE_COVERAGES = 'COVERAGES.ADD_PLANS.DELETE_COVERAGES';


  public COVERAGE_KEY_CTROL = 'coverageKeyCtrl';

  public PLAN_KEY_CTROL = 'planKeyCtrl';



  /**
 * constructor method
 * @param authService auth service Injection
 * @param policyEnrollmentWizardService Policy Enrollment Wizard Service Injection
 * @param translate Translate Service Injection
 * @param notification Notification Service Injection
 * @param policyService Policy Service Injection
 * @param commonService Common Service Service Injection
 * @param agentService Agent Service Injection
 * @param pagerService   Pager Service  Injection
 * @param translationService translation Service  Injection
 * @param notification Notification Service Injection
 */
  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService, private commonService: CommonService, private translate: TranslateService, private productsService: ProductsService, private coveragesService: CoveragesService, private modalService: NgbModal, private notification: NotificationService, private currencyPipeService: CustomCurrencyPipe) { }


  /**
 * Holds the form information
 */
  public formAddPlans: FormGroup;

  /**
 * Executed when the component is initiallized
 */
  ngOnInit() {
    this.getUserInfo();
    this.formAddPlans = this.buildForm();
    this.getArrays();
    this.valueChanges();
    this.coverageResponse = {
      count: 0,
      pageIndex: 1,
      pageSize: 0,
      data: []
    };
    this.selectedCoverages = [];
  }

  /**
 * Executed when the component is destroyed
 */
  ngOnDestroy() {
    if (this.subBussiness) {
      this.subBussiness.unsubscribe();
    }
    if (this.subProducts) {
      this.subProducts.unsubscribe();
    }
    if (this.subPlans) {
      this.subPlans.unsubscribe();
    }
    if (this.subCoverages) {
      this.subCoverages.unsubscribe();
    }
    if (this.subExcludedCoverages) {
      this.subExcludedCoverages.unsubscribe();
    }
  }

  /**
 * Gets the user information saved from redux
 */
  private getUserInfo() {
    this.user = this.authService.getUser();
  }

  /**
 * Builds default PolicyDocs Form.
 */
  buildForm() {
    return new FormGroup({
      coverageList: new FormArray([]),
      filterCriteria: new FormGroup(
        {
          bussinessId: new FormControl('', [Validators.required]),
          productKey: new FormControl('', [Validators.required]),
          planKey: new FormControl('', [Validators.required]),
          generalWaitingPeriodDays: new FormControl('', [CustomValidator.onlyInt])
        }
      )
    });
  }

  /**
 * Subscribe to value changes.
 */
  valueChanges() {
    this.getControl(this.FILTER_CRITERIA_FG, this.BUSSINESS_ID_CTRL).valueChanges.subscribe(val => {
      this.cleanProductKeyCtrl();
      if (val) {
        this.cleanFilterValuesAndSearch(true);
        this.getProductsByBussinessList(val);
      }
    });
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).valueChanges.subscribe(val => {
      if (val) {
        this.cleanFilterValuesAndSearch(true);
        this.getControl(this.FILTER_CRITERIA_FG, this.PLAN_KEY_CTRL).setValue('');
        this.getControl(this.FILTER_CRITERIA_FG, this.GENERAL_WAITING_PERIOD_DAYS_CTRL).setValue('');
        this.getPlansByProductsList(val);
      }
    });
    this.getControl(this.FILTER_CRITERIA_FG, this.PLAN_KEY_CTRL).valueChanges.subscribe(val => {
      if (val) {
        this.cleanFilterValuesAndSearch(true);
      }
    });
  }

  /**
 * Get nested form controls.
 * @param section Section.
 * @param field Field.
 */
  public getControl(section: string, field: string): FormControl {
    return this.formAddPlans.get(section).get(field) as FormControl;
  }

  /**
 * Gets nested form controls in formArray.
 * @param index Index.
 * @param control Control.
 */
  public getNestedControl(index: number, control: string): FormControl {
    const coveragesList = this.formAddPlans.get(this.COVERAGE_LIST_FA) as FormArray;
    const formGrp = coveragesList.controls[index] as FormGroup;
    return formGrp.get(control) as FormControl;
  }

  /**
 * Validates if filter values are Incorrect.
 */
  filterCriteriaInvalid() {
    if (this.formAddPlans) {
      if (this.formAddPlans.get(this.FILTER_CRITERIA_FG).invalid) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
 * Gets the filters ararys.
 */
  getArrays() {
    this.getBussinessList();
  }

  /**
 * Gets the insurance bussiness list.
 */
  getBussinessList() {
    this.bussinessResponse = [];
    this.subBussiness = this.commonService.getBupaBusiness().subscribe((data: any) => {
      this.bussinessResponse = data.nameValuePairs;
      this.bussinessResponse.sort((a, b) => (a.name > b.name) ? 1 : -1);
    }, error => {
      console.error(error);
    });
  }

  /**
 * Gets the products list filtering by insurance bussiness.
 * @param bussiness Selected insurance bussiness.
 */
  getProductsByBussinessList(bussiness: number) {
    this.productsResponse = [];
    this.subProducts = this.productsService.getProductsByBussinessId(bussiness).subscribe((data: any[]) => {
      this.productsResponse = data;
      this.productsResponse.sort((a, b) => (a.name > b.name) ? 1 : -1);
    }, error => {
      console.error(error);
    });
  }

  getPlansByProductsList(productKey) {
    this.plansResponse = [];
    this.subPlans = this.productsService.getPlansByProductKey(productKey).subscribe((data: any[]) => {
      this.plansResponse = data;
      this.plansResponse.sort((a, b) => (a.planName > b.planName) ? 1 : -1);
    }, error => {
      console.error(error);
    });
  }

  /**
 * Gets Coverage List and displays the segment from the page selected.
 * @param page Page.
 * @param isNextPage is NextPage.
 */
  generateCoverageRequest(page: number, isNextPage?: boolean) {
    if (!page) {
      return;
    }
    if (!isNextPage) {
      this.page = this.INIT_PAGE;
      this.setCurrentFilterValues(this.getControl(this.FILTER_CRITERIA_FG, this.PLAN_KEY_CTRL).value);
    } else {
      this.page = page;
    }
    this.searchCoveragesByPlanKey(this.page);
  }

  /**
 * Convert and Set current values using for filter plan search.
 * @param PlanKey ProductKey
 */
  setCurrentFilterValues(PlanKey: string) {
    this.currentPlanKey = this.validateNullValue(PlanKey);
  }

  /**
 * Validate if the control value is empty and assign it to null, otherwise return it converted to string.
 * @param value Value
 */
  validateNullValue(value: any): string {
    if (!value || value === '') {
      const newValue = null;
      return newValue;
    } else {
      return value.toString();
    }
  }

  /**
 * Gets the Plans list filtering by current filters and store the result.
 * @param page Page.
 */
  searchCoveragesByPlanKey(page: number) {
    if (page) {
      this.cleanFilterValuesAndSearch(true);
      // tslint:disable-next-line: max-line-length
      this.subCoverages = this.coveragesService.getCoveragesByPlanKey(this.currentPlanKey, String(page), String(this.PAGE_SIZE)).subscribe(data => {
        this.coverageResponse = data;
        this.coverageResponse.data = this.coverageResponse.data.sort((a, b) => (a.coverages.coverageId > b.coverages.coverageId) ? 1 : -1);

        this.setsFormArray();
        this.sucessSearch = true;
        this.collectionSize = data.count;
        this.formInvalid = false;
      }, error => {
        this.handleError(error);
        this.collectionSize = 0;
      });
    }
  }

  /***
 * Handle error
 */
  private handleError(error: any) {
    if (error.status === 404) {
      this.sucessSearch = true;
      this.coverageResponse = {
        count: 0,
        pageIndex: 1,
        pageSize: 0,
        data: []
      };
    } else {
      this.sucessSearch = false;
    }
  }

  /**
 * Sets the form array.
 */
  setsFormArray() {
    this.getControl(this.FILTER_CRITERIA_FG, this.GENERAL_WAITING_PERIOD_DAYS_CTRL).setValue('');
    this.formAddPlans.removeControl(this.COVERAGE_LIST_FA);
    this.formAddPlans.addControl(this.COVERAGE_LIST_FA, new FormArray([]));

    for (let index = 0; index < this.coverageResponse.data.length; index++) {
      const coverage = this.coverageResponse.data[index];
      this.pushCoverageinCoverageList(coverage);
    }
  }

  /**
 * Push plan item in to plan list.
 * @param plan plan item.
 */
  pushCoverageinCoverageList(coverage: CoverageByPlanKeyDto) {
    const productKeyCtrl = this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).value;
    const planKeyCtrl = this.getControl(this.FILTER_CRITERIA_FG, this.PLAN_KEY_CTRL).value;

    this.getControl(this.FILTER_CRITERIA_FG, this.GENERAL_WAITING_PERIOD_DAYS_CTRL).value === '' ? this.getControl(this.FILTER_CRITERIA_FG, this.GENERAL_WAITING_PERIOD_DAYS_CTRL).setValue(coverage.generalWaitingPeriodDays) : this.getControl(this.FILTER_CRITERIA_FG, this.GENERAL_WAITING_PERIOD_DAYS_CTRL).value;
    const coverageList = this.formAddPlans.get(this.COVERAGE_LIST_FA) as FormArray;

    coverageList.push(new FormGroup({
      productKey: new FormControl(productKeyCtrl, []),
      planKeyCtrl: new FormControl(planKeyCtrl, []),
      coverageKeyCtrl: new FormControl(coverage.coverageKey, []),
      fromDate: new FormControl(coverage.fromDate ? new Date(coverage.fromDate) : '', [Validators.required]),
      toDate: new FormControl(coverage.toDate ? new Date(coverage.toDate) : '', []),
      // tslint:disable-next-line: max-line-length
      requiresPreautorization: new FormControl(coverage.requiresPreauthorization !== null ? coverage.requiresPreauthorization.toString() : '', [Validators.required]),
      coverageName: new FormControl(coverage.coverages.coverageName, []),
      waitingPeriodDays: new FormControl(coverage.waitingPeriodDays, []),
      waitingPeriodMonths: new FormControl(coverage.waitingPeriodMonths, []),
      coinsurance: new FormControl(coverage.coinsurance, []),
      deductible: new FormControl(coverage.deductible !== null ? String(coverage.deductible === true) : '', []),
      copay: new FormControl(this.currencyPipeService.transform(coverage.copay, '$'), []),
      costLimitTotal: new FormControl(this.currencyPipeService.transform(coverage.costLimitTotal, '$'), []),
      quantityLimit: new FormControl(coverage.quantityLimit, []),
      costLimitUnit: new FormControl(this.currencyPipeService.transform(coverage.costLimitUnit, '$'), []),
    }));
  }

  /**
 * Clean the product key control value and products list.
 */
  cleanProductKeyCtrl() {
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).updateValueAndValidity();
    this.getControl(this.FILTER_CRITERIA_FG, this.PLAN_KEY_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.PLAN_KEY_CTRL).updateValueAndValidity();
    this.getControl(this.FILTER_CRITERIA_FG, this.GENERAL_WAITING_PERIOD_DAYS_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.GENERAL_WAITING_PERIOD_DAYS_CTRL).updateValueAndValidity();
    this.productsResponse = [];
  }

  /***
 * Open modal to select excluded plans
 */
  openModalExcludedCoverages() {
    const modalRef = this.modalService.open(AddPlansModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      windowClass: 'modal-claimsubmission-step3'
    });
    const dialog = modalRef.componentInstance as AddPlansModalComponent;
    dialog.inputPlanKey = this.currentPlanKey;
    dialog.inputAddedCoverages = this.coverageResponse.data;
    this.subExcludedCoverages = modalRef.componentInstance.selectedCoverages.subscribe(($e: any) => {
      switch($e.action){
        case 'removeElement' :
          const data = this.coverageResponse.data.filter(element => element.coverageKey != $e.item.coverageKey);
          this.coverageResponse.data = data.sort((a, b) => (a.coverages.coverageId > b.coverages.coverageId) ? 1 : -1);
          break;
        case 'addElement' :
          const dataSelected = $e.item.sort((a, b) => (a.coverages.coverageId > b.coverages.coverageId) ? 1 : -1);
          dataSelected.forEach(element => {
            let existElement = this.coverageResponse.data.filter(x => x.coverageKey == element.coverageKey);
            if(existElement.length == 0){
               this.selectedCoverages.push(element.coverages);
            }
          });
          this.addSelectedExcludedPlans(dataSelected);
          break;
      }
    });
  }

  /***
 * Add selected plans to array.
 * @param selectedPlans Selected Plans.
 */
  addSelectedExcludedPlans(selectedCoverages: CoverageByPlanKeyDto[]) {
    if (selectedCoverages) {
      selectedCoverages.forEach(element => {
        let existElement = this.coverageResponse.data.filter(x => x.coverageKey == element.coverageKey);
        if(existElement.length == 0){
          this.coverageResponse.data.push(element);
          this.pushCoverageinCoverageList(element);
        }
      });
      this.coverageResponse.data = this.coverageResponse.data.sort((a, b) => (a.coverages.coverageId > b.coverages.coverageId) ? 1 : -1);
      // this.setsFormArray();
    }
  }

  /**
 * Clean the filter and form values.
 */
  cleanFilterValuesAndSearch(isSearch: boolean) {
    if (!isSearch) {
      this.getControl(this.FILTER_CRITERIA_FG, this.BUSSINESS_ID_CTRL).setValue('');
      this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).setValue('');
      this.getControl(this.FILTER_CRITERIA_FG, this.PLAN_KEY_CTRL).setValue('');
      this.getControl(this.FILTER_CRITERIA_FG, this.GENERAL_WAITING_PERIOD_DAYS_CTRL).setValue('');
    }
    this.formAddPlans.removeControl(this.COVERAGE_LIST_FA);
    this.formAddPlans.addControl(this.COVERAGE_LIST_FA, new FormArray([]));
    this.coverageResponse = {
      data: [],
      count: null,
      pageSize: null,
      pageIndex: null
    };
    this.selectedCoverages = [];
    this.sucessSearch = false;
    this.formInvalid = false;
  }

  /**
 * Validates Form and continue.
 */
  continue() {
    this.validateForm();
  }

  /**
 * Validate form validations.
 */
  validateForm() {
    const isInvalid = this.formAddPlans.get(this.COVERAGE_LIST_FA).invalid;
    if (isInvalid) {
      this.formInvalid = true;
    } else {
      this.formInvalid = false;
      this.formatAddedPlans();
    }
  }


  /**
 * Format added coverage list to be updated.
 */
  async formatAddedPlans() {
    const updatedCoveragesArray: AddedCoverageDto[] = [];
    const plansList = this.formAddPlans.get(this.COVERAGE_LIST_FA) as FormArray;
    this.coverageNamesToClose = [];
    for (let index = 0; index < plansList.length; index++) {
      let isActiveCoverage = true;
      let copay = null;
      let costLimitTotal = null;
      let costLimitUnit = null;
      let toDateInFront;
      const fromDateInFront = moment(this.getNestedControl(index, this.FROM_DATE_CTRL).value).format('YYYY-MM-DD HH:mm:ss');
      if (this.getNestedControl(index, this.TO_DATE_CTRL).value) {
        toDateInFront = moment(this.getNestedControl(index, this.TO_DATE_CTRL).value).format('YYYY-MM-DD HH:mm:ss');
        if (toDateInFront <= fromDateInFront) {
          this.coverageNamesToClose.push(this.getNestedControl(index, this.COVERAGE_NAME_CTRL).value);
          isActiveCoverage = false;
        }
      }

      if (this.getNestedControl(index, this.COPAY_CTRL).value.toString().indexOf('$') > -1) {
        copay = this.currencyPipeService.parse(this.getNestedControl(index, this.COPAY_CTRL).value, '$').replace('$', '');
      }
      else {
         copay = this.getNestedControl(index, this.COPAY_CTRL).value;
      }

      if (this.getNestedControl(index, this.COST_LIMIT_TOTAL_CTRL).value.toString().indexOf('$') > -1) {
        // tslint:disable-next-line: max-line-length
        costLimitTotal = this.currencyPipeService.parse(this.getNestedControl(index, this.COST_LIMIT_TOTAL_CTRL).value, '$').replace('$', '');
      } else {
        costLimitTotal = this.getNestedControl(index, this.COST_LIMIT_TOTAL_CTRL).value;
      }

      if (this.getNestedControl(index, this.COST_LIMIT_TOTAL_CTRL).value.toString().indexOf('$') > -1) {
        // tslint:disable-next-line: max-line-length
        costLimitUnit = this.currencyPipeService.parse(this.getNestedControl(index, this.COST_LIMIT_TOTAL_CTRL).value, '$').replace('$', '');
      } else {
        costLimitUnit = this.getNestedControl(index, this.COST_LIMIT_TOTAL_CTRL).value;
      }

      const element: AddedCoverageDto = {
        coverageKey: this.getNestedControl(index, this.COVERAGE_KEY_CTROL).value,
        planKey: this.getNestedControl(index, this.PLAN_KEY_CTROL).value,
        waitingPeriodDays: this.getNestedControl(index, this.WAITING_PERIOD_DAYS_CTRL).value,
        waitingPeriodMonths: this.getNestedControl(index, this.WAITING_PERIOD_MONTHS_CTRL).value,
        waitingPeriodBetweenSameServiceDays: 0,
        fromDate: fromDateInFront,
        toDate: toDateInFront,
        // tslint:disable-next-line: max-line-length
        requiresPreauthorization: this.getNestedControl(index, this.REQUIRES_PREAUTHORIZATION_CTRL).value.toString().toLowerCase() === 'true',
        isActiveCoverage: isActiveCoverage,
        coinsurance: this.getNestedControl(index, this.COINSURANCE_CTRL).value,
        // tslint:disable-next-line: max-line-length
        deductible: this.getNestedControl(index, this.DEDUCTIBLE_CTRL).value.toString() !== '' ? this.getNestedControl(index, this.DEDUCTIBLE_CTRL).value : null,
        // tslint:disable-next-line: max-line-length
        copay: copay,
        // tslint:disable-next-line: max-line-length
        costLimitTotal: costLimitTotal,
        quantityLimit: this.getNestedControl(index, this.QUANTITY_LIMIT_CTRL).value,
        // tslint:disable-next-line: max-line-length
        costLimitUnit: costLimitUnit,
        generalWaitingPeriodDays: this.getControl(this.FILTER_CRITERIA_FG, this.GENERAL_WAITING_PERIOD_DAYS_CTRL).value
      };
      updatedCoveragesArray.push(element);
    }

    if (this.coverageNamesToClose.length === 0) {
      this.submitAddedCoverages(updatedCoveragesArray);
    } else {
      const title = await this.translate.get(this.DELETE_COVERAGES).toPromise();
      const message = this.coverageNamesToClose.toString();
      const leave = await this.translate.get(this.LEAVE).toPromise();
      const stay = await this.translate.get(this.STAY).toPromise();
      const submit = await this.notification.showDialog(title, message, true, leave, stay);
      if (submit) {
        this.submitAddedCoverages(updatedCoveragesArray);
      }
    }
  }

  /**
 * Submit added coverage list to be updated.
 */
  submitAddedCoverages(addedCoverages: AddedCoverageDto[]) {
    this.subCoverages = this.coveragesService.postAddedCoveragesToPlan(addedCoverages).subscribe(data => {
      this.showMessage(this.SUCCESS_SUBMIT_COVERAGES);
      this.cleanFilterValuesAndSearch(true);
    }, error => {
      this.showMessage(this.ERROR_SUBMIT_COVERAGES);
    });
  }

  /***
 * Show message.
 * @param msgPath Message Path.
 * @param titlePath Title Path.
 * @param okBtnPath Ok Button Path.
 */
  showMessage(msgPath: string, titlePath?: string, okBtnPath?: string) {
    let message = '';
    let messageTitle = '';
    let okBtn = null;
    this.translate.get(msgPath).subscribe(result => message = result);
    this.translate.get(titlePath ? titlePath : this.ADD_COVERAGES_MSG_TITLE).subscribe(result => messageTitle = result);
    this.translate.get(okBtnPath ? okBtnPath : this.ADD_COVERAGES_MSG_OK_BTN).subscribe(result => okBtn = result);
    this.notification.showDialog(messageTitle, message, false, okBtn);
  }

  /**
 * Validates if filter values are Empty.
 */
  filterCriteriaEmpty() {
    if (this.formAddPlans) {
      if (!this.formAddPlans.get(this.FILTER_CRITERIA_FG).touched) {
        return true;
      } else {
        return false;
      }
    }
  }

}

