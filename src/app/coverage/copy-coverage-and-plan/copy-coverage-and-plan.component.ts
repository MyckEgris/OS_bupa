import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { ProductsService } from 'src/app/shared/services/products/products.service';
import { CoveragesService } from 'src/app/shared/services/coverage/coverages.service';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BupaInsuranceDto } from 'src/app/shared/services/user/entities/bupaInsurance.dto';
import { Subscription } from 'rxjs';
import { ProductByBussinessDto } from 'src/app/shared/services/products/entities/productByBussiness.dto';
import { PlanByProductKeyDto } from 'src/app/shared/services/network/entities/planByProductKey.dto';
import { AddedCoverageDto } from 'src/app/shared/services/coverage/entities/addedCoverage.dto';

@Component({ selector: 'app-copy-coverage-and-plan', templateUrl: './copy-coverage-and-plan.component.html' })
export class CopyCoverageAndPlanComponent implements OnInit,
    OnDestroy { /**
  * User Authenticated Object
  */
    user: UserInformationModel;

    /**
   * Holds the form information
   */
    public formCopyCoverageAndPlan: FormGroup;

    /**
    * Object for bussiness source
    */
    public bussinessSourceList: BupaInsuranceDto[];

    /**
    * Object for bussiness source
    */
    public bussinessTargetList: BupaInsuranceDto[];

    /**
   * Subscription source Bussiness
   */
    private subSourceBussiness: Subscription;

    /**
   * Subscription target Bussiness
   */
    private subTargetBussiness: Subscription;

    /**
   * Subscription source Products
   */
    private subSourceProducts: Subscription;

    /**
   * Subscription target Products
   */
    private subTargetProducts: Subscription;

    /**
   * Subscription source Plans
   */
    private subSourcePlans: Subscription;

    /**
   * Subscription source Plans
   */
    private subTargetPlans: Subscription;

    /**
  * Subscription Coverages
  */
    private subCoverages: Subscription;

    /**
   * Const to Identify the nested FormGroup filterCriteriaSource
   */
    public FILTER_CRITERIA_SOURCE_PRODUCT = 'filterCriteriaSource';

    /**
   * Const to Identify the nested FormControl bussinessIdSource
   */
    public BUSINESS_ID_SOURCE_CTRL = 'bussinessIdSource';

    /**
   * Const to Identify the nested FormControl productSource
   */
    public PRODUCT_SOURCE_CTRL = 'productSource';

    /**
   * Const to Identify the nested FormControl planSource
   */
    public PLAN_SOURCE_CTRL = 'planSource';

    /**
     * Const to Identify the nested FormGroup filterCriteriaTarget
     */
    public FILTER_CRITERIA_TARGET = 'filterCriteriaTarget';

    /**
   * Const to Identify the nested FormControl bussinessIdTarget
   */
    public BUSINESS_TARGET_CTRL = 'bussinessIdTarget';

    /**
     * Const to Identify the nested FormControl productTarget
     */
    public PRODUCT_TARGET_CTRL = 'productTarget';

    /**
     * Const to Identify the nested FormArray plansTarget
     */
    public PLANS_TARGET_FORM_ARRAY = 'plansTarget';

    /**
   * Object for source products obtained
   */
    public productSourceList: ProductByBussinessDto[];

    /**
   * Object for target products obtained
   */
    public productTargetList: ProductByBussinessDto[];

    /**
   * Object for selected plans array
   */
    public plansSourceList: PlanByProductKeyDto[];

    /**
   * Object for selected plans array
   */
    public plansTargetList: PlanByProductKeyDto[];

    /**
  * Object for selected plans array
  */
    public selectedPlanList: PlanByProductKeyDto[] = [];


    /**
     * Map to get existingPlans to compare with new plans
     */
    public groupedExistingPlans: Map<string,
        any[]>;

    /**
   * Constants for the add plans modal message.
   */
    private ADD_COVERAGES_MSG_TITLE = 'COVERAGES.ADD_PLANS.TITLE_MSG';
    private ADD_COVERAGES_MSG_OK_BTN = 'COVERAGES.ADD_PLANS.OK_BTN';

    private SUCCESS_SUBMIT_COVERAGES = 'COVERAGES.ADD_PLANS.SUCCESS_SUBMIT_MSG';
    private ERROR_SUBMIT_COVERAGES = 'COVERAGES.ADD_PLANS.ERROR_SUBMIT_MSG';

    /**
   * Bool to show validations.
   */
    public formInvalid = false;




    /**
   * Creates an instance of copy coverage and plan component.
   * @param authService 
   * @param commonService 
   * @param translate 
   * @param translationService 
   * @param productsService 
   * @param coveragesService 
   * @param pagerService 
   * @param modalService 
   * @param notification 
   */
    constructor(private authService: AuthService, private commonService: CommonService, private translate: TranslateService, private translationService: TranslationService, private productsService: ProductsService, private coveragesService: CoveragesService, private pagerService: PagerService, private modalService: NgbModal, private notification: NotificationService) { }

    /**
  * Executed when the component is destroyed
  */
    ngOnDestroy(): void {
        if (this.subTargetBussiness) {
            this.subTargetBussiness.unsubscribe();
        }
        if (this.subSourceProducts) {
            this.subSourceProducts.unsubscribe();
        }
        if (this.subTargetProducts) {
            this.subTargetProducts.unsubscribe();
        }
        if (this.subCoverages) {
            this.subCoverages.unsubscribe();
        }
        if (this.subSourcePlans) {
            this.subSourcePlans.unsubscribe();
        }
        if (this.subTargetPlans) {
            this.subTargetPlans.unsubscribe();
        }
        if (this.subCoverages) {
            this.subCoverages.unsubscribe();
        }

    }

    /**
   * Executed when the component is initiallized
   */
    ngOnInit() {
        this.getUserInfo();
        this.formCopyCoverageAndPlan = this.buildForm();
        this.getBussinessList();
        this.valueChangesSourceProduct();
        this.valueChangesTargetProduct();
    }

    /**
    * Subscribe to value changes Target Product
    */
    valueChangesTargetProduct() {
        this.getControl(this.FILTER_CRITERIA_TARGET, this.BUSINESS_TARGET_CTRL).valueChanges.subscribe(val => {
            this.cleanTargetProductCtrl();
            if (val) { // this.cleanFilterValuesAndSearch(true);
                this.restorePlansTargetFormArray();
                this.getProductsTargetByBussinessList(val);
            }
        });

        this.getControl(this.FILTER_CRITERIA_TARGET, this.PRODUCT_TARGET_CTRL).valueChanges.subscribe(val => {
            if (val) { // this.cleanFilterValuesAndSearch(true);
                this.restorePlansTargetFormArray();
                this.getTargetPlansByProduct(val);
            }
        });
    }

    /**
     * Restores plans target form array
     */
    private restorePlansTargetFormArray() {
        this.selectedPlanList = [];
        this.plansTargetList = [];
        this.formCopyCoverageAndPlan.removeControl(this.PLANS_TARGET_FORM_ARRAY);
        this.formCopyCoverageAndPlan.addControl(this.PLANS_TARGET_FORM_ARRAY, new FormArray([]));
        this.formCopyCoverageAndPlan.updateValueAndValidity();
    }

    /**
   * Subscribe to value changes Source Product
   */
    valueChangesSourceProduct() {
        this.getControl(this.FILTER_CRITERIA_SOURCE_PRODUCT, this.BUSINESS_ID_SOURCE_CTRL).valueChanges.subscribe(val => {
            this.cleanSourceProductCtrl();
            if (val) { // this.cleanFilterValuesAndSearch(true);
                this.getProductsSourceByBussinessList(val);
            }
        });

        this.getControl(this.FILTER_CRITERIA_SOURCE_PRODUCT, this.PRODUCT_SOURCE_CTRL).valueChanges.subscribe(val => {
            if (val) { // this.cleanFilterValuesAndSearch(true);
                this.getControl(this.FILTER_CRITERIA_SOURCE_PRODUCT, this.PLAN_SOURCE_CTRL).setValue('');
                this.getSourcePlansByProduct(val);
            }
        });
    }

    /**
     * Gets target plans by product
     * @param productKey 
     */
    getTargetPlansByProduct(productKey: string) {
        this.restorePlansTargetFormArray();
        this.plansTargetList = [];
        var allPlans: PlanByProductKeyDto[];
        var allPlansHelper: PlanByProductKeyDto[] = [];
        var dataExistingPlanReduce = [];
        this.subTargetPlans = this.productsService.getPlansByProductKey(productKey).subscribe((data: any[]) => {
            allPlans = data;
            allPlansHelper = data;
            if (allPlans.length > 0) {
                this.coveragesService.getPlansAndCoveragesConfigurated(allPlans).subscribe((dataExistingPlan: any[]) => {
                    dataExistingPlanReduce = dataExistingPlan;
                    const groupedMap: Map<string, any> = dataExistingPlanReduce.reduce((entryMap, e) => entryMap.set(e.planKey, [
                        ...entryMap.get(e.planKey) || [],
                        e
                    ]), new Map());
                    var existingPlanKeys = Array.from(groupedMap.keys());
                    existingPlanKeys.forEach(element => {
                        var plan = allPlans.filter(data => (data.planKey === element));
                        if (plan !== null) {
                            allPlans.splice(allPlans.indexOf(plan[0]), 1);
                        }
                    });
                    this.plansTargetList = allPlansHelper;
                    this.plansTargetList = allPlansHelper.sort((a, b) => (a.planName > b.planName) ? 1 : -1);

                    this.handlePlansArray(this.plansTargetList);
                });
            }

        }, error => {
            console.error(error);
        });
    }

    /**
     * Handles plans array
     * @param plansTargetList 
     */
    handlePlansArray(plansTargetList: PlanByProductKeyDto[]) {
        plansTargetList.forEach(element => {
            const planList = this.formCopyCoverageAndPlan.get(this.FILTER_CRITERIA_TARGET).get(this.PLANS_TARGET_FORM_ARRAY) as FormArray;
            planList.push(new FormControl('', []));
        });
    }

    /**
     * Gets source plans by product
     * @param productKey 
     */
    getSourcePlansByProduct(productKey: string) {
        this.groupedExistingPlans = null;
        this.plansSourceList = [];
        var allPlans: PlanByProductKeyDto[];
        var allPlansHelper: PlanByProductKeyDto[] = [];
        var dataExistingPlanReduce = [];
        this.subSourcePlans = this.productsService.getPlansByProductKey(productKey).subscribe((data: any[]) => {
            allPlans = data;
            if (allPlans.length > 0) {
                this.coveragesService.getPlansAndCoveragesConfigurated(allPlans).subscribe((dataExistingPlan: any[]) => {
                    dataExistingPlanReduce = dataExistingPlan;
                    var groupedPlansHelper: Map<string, any> = dataExistingPlanReduce.reduce((entryMap, e) => entryMap.set(e.planKey, [
                        ...entryMap.get(e.planKey) || [],
                        e
                    ]), new Map());

                    var existingPlanKeys = Array.from(groupedPlansHelper.keys());

                    existingPlanKeys.forEach(element => {
                        var plan = allPlans.filter(data => (data.planKey === element));
                        if (plan !== null) {
                            allPlansHelper.push(plan[0]);
                        }
                    });
                    this.groupedExistingPlans = groupedPlansHelper;
                    this.plansSourceList = allPlansHelper.sort((a, b) => (a.planName > b.planName) ? 1 : -1);
                });
            }

        }, error => {
            console.error(error);
        });
    }

    /**
   * Gets the products list filtering by insurance bussiness.
   * @param bussiness Selected insurance bussiness.
   */
    getProductsSourceByBussinessList(bussiness: number) {
        this.subSourceProducts = this.productsService.getProductsByBussinessId(bussiness).subscribe((data: any[]) => {
            this.productSourceList = [];
            this.productSourceList = data;
            this.productSourceList.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }, error => {
            console.error(error);
        });
    }

    /**
     * Gets the products list filtering by insurance bussiness.
     * @param bussiness Selected insurance bussiness.
     */
    getProductsTargetByBussinessList(bussiness: number) {
        this.subTargetProducts = this.productsService.getProductsByBussinessId(bussiness).subscribe((data: any[]) => {
            this.productTargetList = [];
            this.productTargetList = data;
            this.productTargetList.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }, error => {
            console.error(error);
        });
    }

    /**
   * Clean the product key control value and products list.
   */
    cleanSourceProductCtrl() {
        this.getControl(this.FILTER_CRITERIA_SOURCE_PRODUCT, this.PRODUCT_SOURCE_CTRL).setValue('');
        this.getControl(this.FILTER_CRITERIA_SOURCE_PRODUCT, this.PRODUCT_SOURCE_CTRL).updateValueAndValidity();
        this.getControl(this.FILTER_CRITERIA_SOURCE_PRODUCT, this.PLAN_SOURCE_CTRL).setValue('');
        this.getControl(this.FILTER_CRITERIA_SOURCE_PRODUCT, this.PLAN_SOURCE_CTRL).updateValueAndValidity();
        this.productSourceList = [];
    }

    /**
  * Clean the product key control value and products list.
  */
    cleanTargetProductCtrl() {
        this.getControl(this.FILTER_CRITERIA_TARGET, this.PRODUCT_TARGET_CTRL).setValue('');
        this.getControl(this.FILTER_CRITERIA_TARGET, this.PRODUCT_TARGET_CTRL).updateValueAndValidity();
        this.restorePlansTargetFormArray();
        this.productTargetList = [];
        this.selectedPlanList = [];
        this.formInvalid = false;
    }

    /**
   * Gets the insurance bussiness list.
   */
    getBussinessList() {
        this.bussinessSourceList = [];
        this.bussinessTargetList = [];
        this.subSourceBussiness = this.commonService.getBupaBusiness().subscribe((data: any) => {
            this.bussinessSourceList = data.nameValuePairs;
            this.bussinessSourceList.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }, error => {
            console.error(error);
        });
        this.subTargetBussiness = this.commonService.getBupaBusiness().subscribe((data: any) => {
            this.bussinessTargetList = data.nameValuePairs;
            this.bussinessTargetList.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }, error => {
            console.error(error);
        });
    }

    /**
   * Builds default PolicyDocs Form.
   */
    buildForm() {
        return new FormGroup({
            filterCriteriaSource: new FormGroup(
                {
                    bussinessIdSource: new FormControl('', [Validators.required]),
                    productSource: new FormControl('', [Validators.required]),
                    planSource: new FormControl('', [Validators.required])
                }
            ),
            filterCriteriaTarget: new FormGroup(
                {
                    bussinessIdTarget: new FormControl('', [Validators.required]),
                    productTarget: new FormControl('', [Validators.required]),
                    plansTarget: new FormArray([])
                }
            )
        });
    }

    /**
   * Gets the user information saved from redux
   */
    getUserInfo() {
        this.user = this.authService.getUser();
    }

    /**
   * Get nested form controls.
   * @param section Section.
   * @param field Field.
   */
    public getControl(section: string, field: string): FormControl {
        return this.formCopyCoverageAndPlan.get(section).get(field) as FormControl;
    }

    /**
     * Handles check box change
     * @param check 
     * @param item 
     */
    public handleCheckBoxChange(check: any, item: PlanByProductKeyDto) {
        if (check.srcElement.checked) {
            this.selectedPlanList.push(item);
        } else {
            var plan = this.selectedPlanList.filter(data => (data.planKey === item.planKey));
            if (plan !== null) {
                this.selectedPlanList.splice(this.selectedPlanList.indexOf(plan[0]), 1);
            }
        }
    }

    /**
   * Validates Form and continue.
   */
    continue() {
        this.validateForm();
    }

    /**
     * Validates form, changes flag to show validations
     */
    validateForm() {
        const isInvalid = this.formCopyCoverageAndPlan.get(this.FILTER_CRITERIA_SOURCE_PRODUCT).invalid || this.formCopyCoverageAndPlan.get(this.FILTER_CRITERIA_TARGET).invalid || this.selectedPlanList.length === 0;
        
        if (isInvalid) {
            if(!this.getControl(this.FILTER_CRITERIA_TARGET,this.PRODUCT_TARGET_CTRL).invalid && this.plansTargetList.length===0) {
                this.formInvalid = false;
            }
            else {this.formInvalid = true;}
        } else {
            this.formInvalid = false;
            this.formatAddedPlans();
        }
    }

    /**
     * Formats added plans to convert to object AddedCoverageDto[] to send
     */
    formatAddedPlans() {
        const updatedCoveragesArray: AddedCoverageDto[] = [];
        this.selectedPlanList.forEach(selectedElement => {
            const existingConfiguratedPlanSelected = this.groupedExistingPlans.get(this.getControl(this.FILTER_CRITERIA_SOURCE_PRODUCT, this.PLAN_SOURCE_CTRL).value);
            if (existingConfiguratedPlanSelected !== null) {
                existingConfiguratedPlanSelected.forEach(existingElement => {
                    const element: AddedCoverageDto = {
                        coverageKey: existingElement.coverageKey,
                        planKey: selectedElement.planKey,
                        waitingPeriodDays: existingElement.waitingPeriodDays,
                        waitingPeriodMonths: existingElement.waitingPeriodMonths,
                        waitingPeriodBetweenSameServiceDays: 0,
                        fromDate: existingElement.fromDate,
                        toDate: existingElement.toDate !== null ? existingElement.toDate : null,
                        requiresPreauthorization: existingElement.requiresPreauthorization,
                        isActiveCoverage: true,
                        coinsurance: existingElement.coinsurance,
                        deductible: existingElement.deductible,
                        copay: existingElement.copay,
                        costLimitTotal: existingElement.costLimitTotal,
                        quantityLimit: existingElement.quantityLimit,
                        costLimitUnit: existingElement.costLimitUnit,
                        generalWaitingPeriodDays: null
                    };
                    updatedCoveragesArray.push(element);
                });
            }
            this.restorePlansTargetFormArray();
        });
        this.submitAddedCoverages(updatedCoveragesArray);
    }

    /**
   * Submit added coverage list to be updated.
   */
    submitAddedCoverages(addedCoverages: AddedCoverageDto[]) {
        this.restorePlansTargetFormArray();
        this.subCoverages = this.coveragesService.postAddedCoveragesToPlan(addedCoverages).subscribe(data => {
            this.resetCriteriaFilters();
            this.showMessage(this.SUCCESS_SUBMIT_COVERAGES);
        }, error => {
            this.showMessage(this.ERROR_SUBMIT_COVERAGES);
        });
    }

    /**
     * Resets criteria filters
     */
    private resetCriteriaFilters() {
        this.getControl(this.FILTER_CRITERIA_TARGET, this.PRODUCT_TARGET_CTRL).setValue('');
        this.getControl(this.FILTER_CRITERIA_SOURCE_PRODUCT, this.BUSINESS_ID_SOURCE_CTRL).setValue('');
        this.getControl(this.FILTER_CRITERIA_TARGET, this.BUSINESS_TARGET_CTRL).setValue('');
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
}

