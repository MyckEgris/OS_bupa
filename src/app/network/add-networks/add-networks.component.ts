import { Product } from './../../policy/rates-forms-questionaries/entities/product.dto';
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
import { NetworkService } from 'src/app/shared/services/network/network.service';
import { NetworksByProductKeyDto } from 'src/app/shared/services/network/entities/networksByProductKey.dto';
import { NetworkResponseDto } from 'src/app/shared/services/network/entities/networkResponse.dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNetworksModalComponent } from './add-networks-modal/add-networks-modal.component';
import { NetworkDto } from 'src/app/shared/services/network/entities/network.dto';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { AddedNetworkDto } from 'src/app/shared/services/network/entities/addedNetwork.dto';



@Component({
  selector: 'app-add-networks',
  templateUrl: './add-networks.component.html'
})
export class AddNetworksComponent implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  user: UserInformationModel;

  /**
   * Holds the form information
   */
  public formAddNetworks: FormGroup;

  /**
   * Object for bussiness response
   */
  public bussinessResponse: BupaInsuranceDto[];

  /**
   * Object for products response
   */
  public productsResponse: ProductByBussinessDto[];

  /**
   * Object for networks response
   */
  public networksResponse: NetworkResponseDto;

  /**
   * Object for selected networks array
   */
  public selectedNetworks: NetworksByProductKeyDto[];

  /**
   * Subscription Bussiness
   */
  private subBussiness: Subscription;

  /**
   * Subscription Products
   */
  private subProducts: Subscription;

  /**
   * Subscription Networks
   */
  private subNetworks: Subscription;

  /**
   * Subscription Network Providers
   */
  private subNetworkProviders: Subscription;

  /**
   * Subscription Excluded Networks
   */
  private subExcludedNetworks: Subscription;

  /**
   * Const to Identify the nested FormGroup filterCriteria
   */
  public FILTER_CRITERIA_FG = 'filterCriteria';

  /**
   * Const to Identify the nested FormArray networksList
   */
  public NETWORKS_LIST_FA = 'networksList';

  /***
   * Const to Identify the nested FormControl BussinessId
   */
  public BUSSINESS_ID_CTRL = 'bussinessId';

  /***
   * Const to Identify the nested FormControl ProductKey
   */
  public PRODUCT_KEY_CTRL = 'productKey';


  /***
   * Const to Identify the nested FormControl ProductKey
   */
  public PRODUCT_CTRL = 'product';

  /***
   * Const to Identify the nested FormControl NetworkKey
   */
  public NETWORK_KEY_CTRL = 'networkKey';

  /**
   * Const to Identify the nested FormControl deductibleAmount
   */
  public DEDUCTIBLE_CTRL = 'deductibleAmount';

  /**
   * Const to Identify the nested FormControl coinsurancePercent
   */
  public COINSURANCE_CTRL = 'coinsurancePercent';

  /**
   * Const to Identify the nested FormControl fromDateCtrl
   */
  public FROM_DATE_CTRL = 'fromDate';

  /**
   * Const to Identify the nested FormControl toDateCtrl
   */
  public TO_DATE_CTRL = 'toDate';


  /**
   * Const to Identify the nested FormControl externalProductId
   */
  public EXTERNAL_PRODUCT_ID_CTRL = 'externalProductId';

  /**
   * Const to Identify the nested FormControl description
   */
  public DESCRIPTION_CTRL = 'description';

  /**
   * Const to Identify the nested FormControl description
   */
  public IS_PRODUCT_CLOSED = 'isProductClosed';


  /**
   * Stores the filter values so it will use it when paging.
   */
  public currentProductKey: string;

  /**
    * Init page for pagination component
    */
  public INIT_PAGE = 1;

  /**
   * Page size for pagination component
   */
  public PAGE_SIZE = 5;

  /**
   * Current page for pagination component
   */
  public page: number;

  /**
   * Collection size for pagination component
   */
  public collectionSize: number;

  /**
   * Flag for searching proccess
   */
  public searchProccess = false;

  /**
   * Flag for networks data array content
   */
  public sucessSearch = false;

  /**
   * Bool to show validations.
   */
  public formInvalid: boolean = false;

  private productByBussinessDtoObtained: ProductByBussinessDto = {
    productKey: null,
    insuranceBusinessId: null,
    name: null,
    description: null,
    outOfNetworkCoinsurance: null,
    isClosedProduct: null,
    productExternalId: null
  };

  /**
   * Constants for the add networks modal message.
   */
  private ADD_NETWORK_MSG_TITLE = 'NETWORK.ADD_NETWORKS.TITLE_MSG';
  private ADD_NETWORK_MSG_OK_BTN = 'APP.BUTTON.CONTINUE_BTN';

  private SUCCESS_SUBMIT_NETWORKS = 'NETWORK.ADD_NETWORKS.SUCCESS_SUBMIT_MSG';
  private ERROR_SUBMIT_NETWORKS = 'NETWORK.ADD_NETWORKS.ERROR_SUBMIT_MSG';
  private SUCCESS_PRODUCT_SUBMIT_MSG = 'NETWORK.ADD_NETWORKS.SUCCESS_PRODUCT_SUBMIT_MSG';



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
  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private translate: TranslateService,
    private translationService: TranslationService,
    private productsService: ProductsService,
    private networkService: NetworkService,
    private pagerService: PagerService,
    private modalService: NgbModal,
    private notification: NotificationService
  ) { }

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.getUserInfo();
    this.formAddNetworks = this.buildForm();
    this.getArrays();
    this.valueChanges();
    this.networksResponse = { count: 0, pageIndex: 1, pageSize: 0, data: [] };
    this.selectedNetworks = [];
  }

  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subBussiness) { this.subBussiness.unsubscribe(); }
    if (this.subProducts) { this.subProducts.unsubscribe(); }
    if (this.subNetworks) { this.subNetworks.unsubscribe(); }
    if (this.subNetworkProviders) { this.subNetworkProviders.unsubscribe(); }
    if (this.subExcludedNetworks) { this.subExcludedNetworks.unsubscribe(); }
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
      networksList: new FormArray([]),
      filterCriteria: new FormGroup({
        isProductClosed: new FormControl(),
        bussinessId: new FormControl('', [Validators.required]),
        productKey: new FormControl('', [Validators.required]),
        externalProductId: new FormControl(),
        description: new FormControl(),
        product: new FormControl(),
      })
    });
  }

  /**
   * Subscribe to value changes.
   */
  valueChanges() {
    this.cleanProductKeyCtrl();
    this.getControl(this.FILTER_CRITERIA_FG, this.BUSSINESS_ID_CTRL).valueChanges.subscribe(val => {
      this.cleanFilterValuesAndSearch(true);
      this.cleanProductKeyCtrl();
      if (val) {
        this.getProductsByBussinessList(val);
      }
    }
    );
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_CTRL).valueChanges.subscribe(val => {
      if (val) {
        this.cleanFilterValuesAndSearch(true);
        this.SetValuesToProductByBusiness(val);
      }
    }
    );
  }

  private SetValuesToProductByBusiness(val: any) {
    this.productByBussinessDtoObtained.description = val.description;
    this.productByBussinessDtoObtained.insuranceBusinessId = val.insuranceBusinessId;
    this.productByBussinessDtoObtained.name = val.name;
    this.productByBussinessDtoObtained.outOfNetworkCoinsurance = val.outofNetworkCoinsurance;
    this.productByBussinessDtoObtained.productKey = val.productKey;
    this.productByBussinessDtoObtained.productExternalId = val.productExternalId;
    this.productByBussinessDtoObtained.isClosedProduct = val.isClosedProduct;

    this.getControl(this.FILTER_CRITERIA_FG, this.EXTERNAL_PRODUCT_ID_CTRL).setValue(val.productExternalId);
    this.getControl(this.FILTER_CRITERIA_FG, this.DESCRIPTION_CTRL).setValue(val.description);
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).setValue(val.productKey);
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).updateValueAndValidity();
    this.getControl(this.FILTER_CRITERIA_FG, this.EXTERNAL_PRODUCT_ID_CTRL).updateValueAndValidity();
    this.getControl(this.FILTER_CRITERIA_FG, this.DESCRIPTION_CTRL).updateValueAndValidity();
  }

  /**
   * Get nested form controls.
   * @param section Section.
   * @param field Field.
   */
  public getControl(section: string, field: string): FormControl {
    return this.formAddNetworks.get(section).get(field) as FormControl;
  }

  /**
   * Get nested form controls.
   * @param section Section.
   * @param field Field.
   */
  public getFormGroup(field: string): FormGroup {
    return this.formAddNetworks.get(this.FILTER_CRITERIA_FG).get(field) as FormGroup;
  }

  /**
   * Gets nested form controls in formArray.
   * @param index Index.
   * @param control Control.
   */
  public getNestedControl(index: number, control: string): FormControl {
    const networksList = this.formAddNetworks.get(this.NETWORKS_LIST_FA) as FormArray;
    const formGrp = networksList.controls[index] as FormGroup;
    return formGrp.get(control) as FormControl;
  }

  /**
   * Validates if filter values are Incorrect.
   */
  filterCriteriaInvalid() {
    if (this.formAddNetworks) {
      if (this.formAddNetworks.get(this.FILTER_CRITERIA_FG).invalid) {
        return true;
      } else { return false; }
    }
  }

  /**
   * Validates if filter values are Empty.
   */
  filterCriteriaEmpty() {
    if (this.formAddNetworks) {
      if (!this.formAddNetworks.get(this.FILTER_CRITERIA_FG).touched) {
        return true;
      } else { return false; }
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
    this.subBussiness = this.commonService.getBupaBusiness().subscribe(
      (data: any) => {
        this.bussinessResponse = data.nameValuePairs;
        this.bussinessResponse.sort((a, b) => (a.name > b.name) ? 1 : -1);
      },
      error => {
        console.error(error);
      }
    );
  }

  /**
   * Gets the products list filtering by insurance bussiness.
   * @param bussiness Selected insurance bussiness.
   */
  getProductsByBussinessList(bussiness: number) {
    this.productsResponse = [];
    this.subProducts = this.productsService.getProductsByBussinessId(bussiness).subscribe(
      (data: any[]) => {
        this.productsResponse = data;
        this.productsResponse.sort((a, b) => (a.name > b.name) ? 1 : -1);
      },
      error => {
        console.error(error);
      }
    );
  }

  /**
   * Gets the Networks List and displays the segment from the page selected.
   * @param page Page.
   * @param isNextPage is NextPage.
   */
  generateNetworksRequest(page: number, isNextPage?: boolean) {
    if (!page) { return; }
    if (!isNextPage) {
      this.page = this.INIT_PAGE;
      this.setCurrentFilterValues(
        this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).value
      );
    } else {
      this.page = page;
    }
    this.searchNetworksByProductKey(this.page);
    this.getControl(this.FILTER_CRITERIA_FG, this.IS_PRODUCT_CLOSED).setValidators(Validators.required);
    // tslint:disable-next-line: max-line-length
    this.getControl(this.FILTER_CRITERIA_FG, this.IS_PRODUCT_CLOSED).setValue(this.productByBussinessDtoObtained.isClosedProduct ? 'true' : 'false');
    this.getControl(this.FILTER_CRITERIA_FG, this.IS_PRODUCT_CLOSED).updateValueAndValidity();
  }

  /**
   * Convert and Set current values using for filter policies search.
   * @param agentId Agent Id.
   * @param documentYear Document Year.
   * @param documentMonth Document Month.
   * @param documentType Document Type.
   */
  setCurrentFilterValues(ProductKey: number) {
    this.currentProductKey = this.validateNullValue(ProductKey);
  }

  /**
   * Validate if the control value is empty and assign it to null, otherwise return it converted to string.
   * @param value Value
   */
  validateNullValue(value: any): string {
    if (!value || value === '') {
      const newValue = null;
      return newValue;
    } else { return value.toString(); }
  }

  /**
   * Gets the Networks list filtering by current filters and store the result.
   * @param page Page.
   */
  searchNetworksByProductKey(page: number) {
    if (page) {
      this.cleanFilterValuesAndSearch(true);
      this.subNetworks = this.networkService.getNetworksByProductKey(
        this.currentProductKey, String(page), String(this.PAGE_SIZE))
        .subscribe(
          data => {
            this.networksResponse = data;
            this.setsFormArray();
            this.sucessSearch = true;
            this.collectionSize = data.count;
            this.formInvalid = false;
          }, error => {
            this.handleError(error);
            this.collectionSize = 0;
          }
        );
    }
  }

  /***
   * Handle error
   */
  private handleError(error: any) {
    if (error.status === 404) {
      this.sucessSearch = true;
      this.networksResponse = { count: 0, pageIndex: 1, pageSize: 0, data: [] };
    } else {
      this.sucessSearch = false;
    }
  }

  /**
   * Sets the form array.
   */
  setsFormArray() {
    this.formAddNetworks.removeControl(this.NETWORKS_LIST_FA);
    this.formAddNetworks.addControl(this.NETWORKS_LIST_FA, new FormArray([]));
    this.formAddNetworks.updateValueAndValidity();

    for (let index = 0; index < this.networksResponse.data.length; index++) {
      const network = this.networksResponse.data[index];
      this.pushNetworkInNetworkList(network);
    }
  }

  /**
   * Push network item in to network list.
   * @param network network item.
   */
  pushNetworkInNetworkList(network: NetworksByProductKeyDto) {
    const porductKeyCtrl = this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).value;
    const networksList = this.formAddNetworks.get(this.NETWORKS_LIST_FA) as FormArray;
    networksList.push(
      new FormGroup({
        productKey: new FormControl(porductKeyCtrl, []),
        networkKey: new FormControl(network.networkKey, []),
        deductibleAmount: new FormControl(network.deductibleAmount, [Validators.required]),
        coinsurancePercent: new FormControl(network.coinsurancePercent, [Validators.required]),
        fromDate: new FormControl(network.fromDate ? new Date(network.fromDate) : '', [Validators.required]),
        toDate: new FormControl(network.toDate ? new Date(network.toDate) : '', [])
      })
    );
  }

  /**
   * Clean the product key control value and products list.
   */
  cleanProductKeyCtrl() {
    this.getControl(this.FILTER_CRITERIA_FG, this.EXTERNAL_PRODUCT_ID_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.DESCRIPTION_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_CTRL).updateValueAndValidity();
    this.getControl(this.FILTER_CRITERIA_FG, this.EXTERNAL_PRODUCT_ID_CTRL).updateValueAndValidity();
    this.getControl(this.FILTER_CRITERIA_FG, this.DESCRIPTION_CTRL).updateValueAndValidity();
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).updateValueAndValidity();
    this.getControl(this.FILTER_CRITERIA_FG, this.IS_PRODUCT_CLOSED).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.IS_PRODUCT_CLOSED).updateValueAndValidity();

    this.sucessSearch = false;
    this.productsResponse = [];
  }

  /***
   * Open modal to select excluded networks
   */
  openModalExcludedNetworks() {
    const modalRef = this.modalService.open(AddNetworksModalComponent,
      { centered: true, backdrop: 'static', keyboard: false, size: 'lg', windowClass: 'modal-claimsubmission-step3' });
    const dialog = modalRef.componentInstance as AddNetworksModalComponent;
    dialog.inputProductKey = this.currentProductKey;
    dialog.inputAddedNetworks = this.networksResponse.data;
    this.subExcludedNetworks = modalRef.componentInstance.selectedNetworks.subscribe(($e: NetworksByProductKeyDto[]) => {
      $e.forEach(element => {
        this.selectedNetworks.push(element);
      });
      this.addSelectedExcludedNetworks($e);
    });
  }

  /***
   * Add selected networks to array.
   * @param selectedNetworks Selected Networks.
   */
  addSelectedExcludedNetworks(selectedNetworks: NetworksByProductKeyDto[]) {
    if (selectedNetworks) {
      selectedNetworks.forEach(element => {
        this.networksResponse.data.push(element);
        this.pushNetworkInNetworkList(element);
      });
    }
  }

  /**
   * Clean the filter and form values.
   * @param isSearch Determines if function is executed from search.
   */
  cleanFilterValuesAndSearch(isSearch?: boolean) {
    if (!isSearch) {
      this.getControl(this.FILTER_CRITERIA_FG, this.EXTERNAL_PRODUCT_ID_CTRL).setValue('');
      this.getControl(this.FILTER_CRITERIA_FG, this.DESCRIPTION_CTRL).setValue('');
      this.getControl(this.FILTER_CRITERIA_FG, this.BUSSINESS_ID_CTRL).setValue('');
      this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_CTRL).setValue('');
      this.getControl(this.FILTER_CRITERIA_FG, this.PRODUCT_KEY_CTRL).setValue('');
    }
    this.getControl(this.FILTER_CRITERIA_FG, this.IS_PRODUCT_CLOSED).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.IS_PRODUCT_CLOSED).setValidators([]);
    this.formAddNetworks.removeControl(this.NETWORKS_LIST_FA);
    this.formAddNetworks.addControl(this.NETWORKS_LIST_FA, new FormArray([]));
    this.formAddNetworks.updateValueAndValidity();
    this.networksResponse = { data: [], count: null, pageSize: null, pageIndex: null };
    this.selectedNetworks = [];
    this.sucessSearch = false;
    this.formInvalid = false;
  }

  /**
   * Validates Form and continue.
   */
  continue() {
    // tslint:disable-next-line: max-line-length
    this.productByBussinessDtoObtained.isClosedProduct = this.getBoolFromString(this.getControl(this.FILTER_CRITERIA_FG, this.IS_PRODUCT_CLOSED).value);
    this.validateForm();
  }

  public getBoolFromString(stringBool: String) {
    return stringBool === 'true' ? true : false;
  }

  /**
   * Validate form validations.
   */
  validateForm() {
    // tslint:disable-next-line: max-line-length
    const isInvalid = this.formAddNetworks.get(this.NETWORKS_LIST_FA).invalid || this.getControl(this.FILTER_CRITERIA_FG, this.IS_PRODUCT_CLOSED).invalid;
    if (isInvalid) {
      this.formInvalid = true;
    } else {
      this.formInvalid = false;
      this.sendProductToUpdate();
    }
  }

  sendProductToUpdate() {
    if (this.productByBussinessDtoObtained.productKey !== null) {

      this.productsService.sendProductToUpdate(this.productByBussinessDtoObtained).subscribe(
        data => {
          this.formatAddedNetworks();
        }, error => {
          console.error(error);
        });
    }
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
    this.translate.get(msgPath).subscribe(
      result => message = result
    );
    this.translate.get(titlePath ? titlePath : this.ADD_NETWORK_MSG_TITLE).subscribe(
      result => messageTitle = result
    );
    this.translate.get(okBtnPath ? okBtnPath : this.ADD_NETWORK_MSG_OK_BTN).subscribe(
      result => okBtn = result
    );
    this.notification.showDialog(messageTitle, message, false, okBtn);
  }

  /**
   * Format added networks list to be updated.
   */
  formatAddedNetworks() {
    const updatedNetworksArray: AddedNetworkDto[] = [];
    const networksList = this.formAddNetworks.get(this.NETWORKS_LIST_FA) as FormArray;

    if (networksList.length > 0) {
      for (let index = 0; index < networksList.length; index++) {
        let toDateInFront;
        toDateInFront = moment(this.getNestedControl(index, this.TO_DATE_CTRL).value).format('YYYY-MM-DD HH:mm:ss');
        if (toDateInFront === 'Invalid date') {
           toDateInFront = null;
        }

        const element: AddedNetworkDto = {
          productKey: this.getNestedControl(index, this.PRODUCT_KEY_CTRL).value,
          networkKey: this.getNestedControl(index, this.NETWORK_KEY_CTRL).value,
          deductibleAmount: Number(this.getNestedControl(index, this.DEDUCTIBLE_CTRL).value),
          coinsurancePercent: Number(this.getNestedControl(index, this.COINSURANCE_CTRL).value),
          fromDate: moment(this.getNestedControl(index, this.FROM_DATE_CTRL).value).format('YYYY-MM-DD HH:mm:ss'),
          toDate: toDateInFront
        };
        updatedNetworksArray.push(element);
      }
      this.submitAddedNetworks(updatedNetworksArray);
    } else {
      this.showMessage(this.SUCCESS_PRODUCT_SUBMIT_MSG);
    }
  }

  /**
   * Submit added networks list to be updated.
   */
  submitAddedNetworks(addedNetworks: AddedNetworkDto[]) {
    this.subNetworkProviders = this.networkService.postAddedNetworksToProduct(
      addedNetworks)
      .subscribe(
        data => {
          this.showMessage(this.SUCCESS_SUBMIT_NETWORKS);
        }, error => {
          this.showMessage(this.ERROR_SUBMIT_NETWORKS);
        });
  }


}
