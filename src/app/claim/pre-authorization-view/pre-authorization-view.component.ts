import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewPreAuthorizationInputDto } from 'src/app/shared/services/pre-authorization/entities/view-pre-authorization-input.dto';
import * as $ from 'jquery';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Subscription } from 'rxjs';
import { } from 'src/app/shared/services/claim/pre-authorization/pre-authorization.service';
import { PreAuthorizationService } from 'src/app/shared/services/pre-authorization/pre-authorization.service';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { ProviderOutputDto } from 'src/app/shared/services/provider/entities/provider.dto';
import * as moment from 'moment';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { PreAuthDocumentModel } from 'src/app/shared/services/pre-authorization/entities/preAuthDocumentModel';
import { DocumentOutputDto } from 'src/app/shared/services/policy/entities/documents.dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pre-authorization-view',
  templateUrl: './pre-authorization-view.component.html'
})
export class PreAuthorizationViewComponent implements OnInit {



  /**
  * Constant for snapchot data object who is bring by the resolver
  */
  private PRE_AUTH_INFO = 'preAuthInfo';

  /**
  * Constant for first pager Page Index parameter
  */
  private firstPageIndex = 1;

  /**
  * Constant for first pager Page Size parameter
  */
  private firstPageSize = 10;

  /**
  * Collection size for pagination component
  */
  public collectionSize = 0;

  /**
  * Flag for preAuthorization data array content
  */
  public sucessSearch = false;

  /**
  * holds the preAuth information who is bring by the resolver
  */
  preAuthInfo: any;

  /**
  * pager object
  */
  pager: any = {};

  /**
  * Current Page
  */
  currentPage: number;

  /***
  * Subscription Countries
  */
  private subCountries: Subscription;

  /**
  * List countries
  */
  public countries: Country[];

  /**
  * contais the notifications id to slideToggle
  */
  private ID_DETAIL_TOGGLE = '#ig-detalleNotification-';

  /**
  * holds the preAuth information who is bring by the resolver
  */
  user: UserInformationModel;

  /**
  * Main form
  */
  public preAuthViewForm: FormGroup;

  /**
  * associatedProviderResult: ProviderOutputDto[];
  */
  associatedProviderResult: ProviderOutputDto[];

  /**
  * ASSOCIATED_PROVIDER
  */
  public ASSOCIATED_PROVIDER = 'associatedProvider';

  /**
  * rol
  */
  public rol = Rol;

  /**
  * minDate
  */
  public minDate: Date = Utilities.getFiveYearsPrior();

  /**
  * maxDate
  */
  public maxDate = new Date();

  /**
  * actualStartDate
  */
  public actualStartDate: Date = this.minDate;

  /**
  * actualEndDate
  */
  public actualEndDate: Date = this.maxDate;

  /**
  * minDateRange
  */
  public minDateRange: Date = new Date(this.minDate);

  /**
  * invalidStartDate
  */
  public invalidStartDate: Boolean = false;

  /**
  * invalidEndDate
  */
  public invalidEndDate: Boolean = false;

  /**
  * invalidDateRange
  */
  public invalidDateRange: Boolean = true;

  /**
  * dateNotValid
  */
  public dateNotValid: Boolean = false;

  /**
  * results
  */
  private results = { count: 0, data: [], pageIndex: 0, pageSize: 0 };



  /**
   * Stores the filter type so it will use it when paging.
   */
  private currentPolicyId: string = null;
  private currentReferenceNumber: string = null;
  private currentTrackingNumber: string = null;
  private currentMemberFirstName: string = null;
  private currentMemberLastName: string = null;
  private currentRequestStartDate: string = null;
  private currentRequestEndDate: string = null;
  private currentServiceCountry: string = null;
  private currentProviderId: string = null;


  /**
  * Contruct Methos
  * @param translate Translate Service Injection
  * @param notification Notification Service Injection
  * @param preAuthService PreAuthorization Service Injection
  * @param router Router Service Injection
  * @param _route Activated Route  Injection
  * @param commonService Common Service Service Injection
  * @param userInfoStore UserInfoStore
  * @param providerService Provider Service Injection
  * @param pagerService   Pager Service  Injection
  */
  constructor(
    private translate: TranslateService,
    private notification: NotificationService,
    private preAuthService: PreAuthorizationService,
    private router: Router,
    private _route: ActivatedRoute,
    private commonService: CommonService,
    private providerService: ProviderService,
    private pagerService: PagerService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>) {
    this.results = this._route.snapshot.data[this.PRE_AUTH_INFO];
    this.preAuthInfo = this.results;
  }



  ngOnInit() {
    this.getUserInfo();
    this.validateContentArray(this.preAuthInfo.preAuthInfo);
    this.getCountries();
    this.getAssociatedProviders();
    this.setFirstPager();
    this.preAuthViewForm = this.buildForm();
    this.preAuthViewForm.controls.requestStartDate.valueChanges.subscribe(val => {
      this.validateDateRange(val); this.validateStartDateEntered();
    }
    );
    this.preAuthViewForm.controls.requestEndDate.valueChanges.subscribe(val => {
      this.validateEndDateEntered();
    }
    );
  }


  /**
  * Ruting foreward to Make preAuthorization
  */
  async goToPreAuth() {
    this.router.navigate(['claims/pre-authorization']);
  }


  /**
  * Get the user information saved from redux
  */
  private getUserInfo() {
    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.user = userInfo;
    });
  }

  isProvider() {
    if (Number(this.user.role_id) === Rol.PROVIDER) {
      return true;
    }
  }


  /***
  * Get all countries
  */
  getCountries() {
    this.subCountries = this.commonService.getCountries().subscribe(
      countries => {
        this.countries = countries;
      },
      error => console.error(error)
    );
  }


  /***
  * Get all associated providers for provider users
  */
  async getAssociatedProviders() {
    if (this.user.role_id === this.rol.PROVIDER.toString()) {
      if (!this.associatedProviderResult) {
        this.associatedProviderResult = await this.providerService.getAssociatedProviderById(
          this.user.provider_id.toString()).toPromise();
      }
    }
  }


  /***
  * Set the first pager object
  */
  setFirstPager() {
    if (this.preAuthInfo.preAuthInfo) {
      this.pager = this.pagerService.getPager(this.preAuthInfo.preAuthInfo.count, this.firstPageIndex, this.firstPageSize);
    }
  }


  /**
  * Builds default preAuthView Form.
  */
  buildForm() {
    return new FormGroup({
      policyId: new FormControl(''),
      referenceNumber: new FormControl(''),
      trackingNumber: new FormControl(''),
      memberFirstName: new FormControl(''),
      memberLastName: new FormControl(''),
      requestStartDate: new FormControl(''),
      requestEndDate: new FormControl(''),
      serviceCountry: new FormControl(''),
      providerId: new FormControl('')
    });
  }


  /**
  * gets the subsequent preAuthorization List and displays the segment from the page selected.
  * @param page page number
  */
  public setPage(page: number, isNextPage?: boolean) {
    if (this.preAuthInfo) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }
      this.validateContentArray(this.preAuthInfo.preAuthInfo);
    }
    // get current page of items
    this.generateSearchPreAuthRequest(page, isNextPage);
  }


  /**
  * generate the search preAuthorization request and assign filter values to request.
  * @param page page number
  */
  generateSearchPreAuthRequest(page: number, isNextPage?: boolean) {

    if (!isNextPage) {
      // assign values for pagination
      this.setValuesCurrentFilterValues(
        this.preAuthViewForm.controls.policyId.value,
        this.preAuthViewForm.controls.referenceNumber.value,
        this.preAuthViewForm.controls.trackingNumber.value,
        this.preAuthViewForm.controls.memberFirstName.value,
        this.preAuthViewForm.controls.memberLastName.value,
        this.preAuthViewForm.controls.requestStartDate.value,
        this.preAuthViewForm.controls.requestEndDate.value,
        this.preAuthViewForm.controls.serviceCountry.value,
        this.preAuthViewForm.controls.providerId.value);
    }

    // make search
    this.searchPreAuthorizationsByFilter(page);
    // validate content view
    this.validateContentArray(this.preAuthInfo.preAuthInfo);

  }


  /**
  * Convert and Set current values using for filter preAuthorization search.
  */
  setValuesCurrentFilterValues(policyId: number, referenceNumber: number, trackingNumber: number, memberFirstName: string,
    memberLastName: string, requestStartDate: Date, requestEndDate: Date, serviceCountry: string, providerId: number) {

    this.currentPolicyId = this.validateNullValue(policyId);
    this.currentReferenceNumber = this.validateNullValue(referenceNumber.toString());
    this.currentTrackingNumber = this.validateNullValue(trackingNumber.toString());
    this.currentMemberFirstName = this.validateNullValue(memberFirstName);
    this.currentMemberLastName = this.validateNullValue(memberLastName);
    const startDate = this.convertDateToFormat(requestStartDate);
    this.currentRequestStartDate = this.validateNullValue(startDate);
    const endtDate = this.convertDateToFormat(requestEndDate);
    this.currentRequestEndDate = this.validateNullValue(endtDate);
    this.currentServiceCountry = this.validateNullValue(serviceCountry);
    this.currentProviderId = this.validateNullValue(providerId);
  }


  /**
  * Get the preAuthorizations filtering by current filters and store the result.
  * @param pageIndex Page Index
  */
  searchPreAuthorizationsByFilter(pageIndex: number) {
    this.preAuthService.getViewPreAuthorizations(
      pageIndex.toString(), this.firstPageSize.toString(), this.currentPolicyId,
      this.currentReferenceNumber, this.currentTrackingNumber,
      this.currentMemberFirstName, this.currentMemberLastName,
      this.currentRequestStartDate, this.currentRequestEndDate,
      this.currentServiceCountry, this.currentProviderId).subscribe(
        result => {
          this.preAuthInfo = { 'preAuthInfo': result, 'error': 'null' };
          this.pager = this.pagerService.getPager(this.preAuthInfo.preAuthInfo.count, pageIndex, this.firstPageSize);
        }, error => {
          this.handleDataNotFound(error);
        }
      );
  }


  /**
  * Clean the preAuthorizations filter values and make dafault search.
  */
  cleanFilterValuesAndSearch() {
    this.preAuthViewForm.reset();
    this.preAuthViewForm.controls.policyId.setValue('');
    this.preAuthViewForm.controls.referenceNumber.setValue('');
    this.preAuthViewForm.controls.trackingNumber.setValue('');
    this.preAuthViewForm.controls.memberFirstName.setValue('');
    this.preAuthViewForm.controls.memberLastName.setValue('');
    this.preAuthViewForm.controls.requestStartDate.setValue('');
    this.preAuthViewForm.controls.requestEndDate.setValue('');
    this.preAuthViewForm.controls.serviceCountry.setValue('');
    this.preAuthViewForm.controls.providerId.setValue('');
    this.setPage(this.firstPageIndex, false);
    this.invalidStartDate = false;
    this.invalidEndDate = false;
    this.dateNotValid = false;
    this.invalidDateRange = true;
  }


  /**
  * downloads the documents the user select on the screen
  * @param doc Document
  */
  downloadFile(doc: PreAuthDocumentModel) {
    const fileParams: DocumentOutputDto = {
      policyId: 0,
      documentPath: doc.documentUri,
      documentType: `${doc.documentName}/`,
      eligibilityDate: '',
      documentLanguage: 0,
      lastSentDate: null
    };
    const peticion = this.commonService.getDocumentByDocumentPath(fileParams);
    peticion.subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      saveAs(blob, doc.documentUri);
    }, error => {
      this.showNotFoundDocument(error);
    }
    );
  }


  /**
  * Shows the message when the Item was not found.
  * @param error Http Error message.
  */
  showNotFoundDocument(error: HttpErrorResponse) {
    if (error.error === '404') {
      let message = '';
      let messageTitle = '';
      this.translate.get(`POLICY.ERROR.ERROR_CODE.404`).subscribe(
        result => messageTitle = result
      );
      this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.404`).subscribe(
        result => message = result
      );
      this.notification.showDialog(messageTitle, message);
    }
  }


  /**
  * handle 404 Error when data not found.
  * @param error Http Error message.
  */
  handleDataNotFound(error: HttpErrorResponse) {
    if (error.status === Number('404')) {
      let message = '';
      let messageTitle = '';
      this.translate.get(`CLAIMS.PRE_AUTHORIZATION.SEARCH.ERRORS.404.404_TITLE`).subscribe(
        result => messageTitle = result
      );
      this.translate.get(`CLAIMS.PRE_AUTHORIZATION.SEARCH.ERRORS.404.404_MESSAGE`).subscribe(
        result => message = result
      );
      this.notification.showDialog(messageTitle, message);
    } else {
      this.preAuthInfo = { 'preAuthInfo': null, 'error': error };
    }
    this.cleanFilterValuesAndSearch();
  }


  /**
  * Validate if preAuthorization data array content > 0 and Flag for view True
  * @param dataArray Data Array
  */
  validateContentArray(dataArray: ViewPreAuthorizationInputDto) {
    if (dataArray) {
      if (dataArray.data.length > 0) {
        this.sucessSearch = true;
      } else {
        this.sucessSearch = false;
      }
    } else { this.sucessSearch = false; }
  }


  /**
  * Validate if the control value is empty and assign it to null.
  * @param value Value
  */
  validateNullValue(value: any) {
    if (!value || value === 'Invalid date') {
      const newValue = '';
      return newValue;
    } else { return value.toString(); }
  }


  /**
  * Convert date value to format YYYY-MM-DD.
  * @param value Value
  */
  convertDateToFormat(value: any) {
    return moment(value).format('YYYY-MM-DD');
  }


  /**
  * Validates the start date ie less than the end date.
  * @param date Date
  */
  validateDateRange(date: string) {
    if (date) {
      this.minDateRange = new Date(date);
    }
  }


  /**
  * Validates if Start date is entered, End date must be requierd.
  * @param date Date
  */
  validateStartDateEntered() {
    const fromDate = this.preAuthViewForm.controls.requestStartDate.value;
    const toDate = this.preAuthViewForm.controls.requestEndDate.value;
    if (fromDate && fromDate !== 'Invalid date') {
      this.invalidDateRange = false;
      this.preAuthViewForm.controls.requestEndDate.setValidators([Validators.required]);
    } else if (fromDate && fromDate === 'Invalid date') {
      this.preAuthViewForm.controls.requestStartDate.setValue('');
    } else if (!fromDate) {
      this.preAuthViewForm.controls.requestStartDate.setValidators([]);
      this.preAuthViewForm.controls.requestEndDate.setValidators([]);
      this.invalidStartDate = false;
      this.invalidEndDate = false;
    }
    if (fromDate >= toDate) {
    } else { this.invalidDateRange = false; }
  }


  /**
  * Validates if End date is entered, Start date must be requierd.
  * @param date Date
  */
  validateEndDateEntered() {
    const fromDate = this.preAuthViewForm.controls.requestStartDate.value;
    const toDate = this.preAuthViewForm.controls.requestEndDate.value;
    if (toDate && toDate !== 'Invalid date') {
      this.preAuthViewForm.controls.requestStartDate.setValidators([Validators.required]);
    } else if (toDate && toDate === 'Invalid date') {
      this.preAuthViewForm.controls.requestEndDate.setValue('');
    } else if (!toDate) {
      this.preAuthViewForm.controls.requestStartDate.setValidators([]);
      this.preAuthViewForm.controls.requestEndDate.setValidators([]);
      this.invalidStartDate = false;
      this.invalidEndDate = false;
    }
    if (fromDate > toDate) {
      this.dateNotValid = true;
    } else { this.invalidDateRange = false; }
  }

  /**
  * Use to slidown the notification detail
  * @param item Item
  */
  toggleSlideDetail(item: any) {
    $(this.ID_DETAIL_TOGGLE + item.trackingNumber).slideToggle();
  }




}
