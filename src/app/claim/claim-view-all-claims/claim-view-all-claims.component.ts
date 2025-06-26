/**
* ClaimViewAllClaimsComponent.ts
*
* @description: This component handles view all claims by member id.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClaimService } from 'src/app/shared/services/claim/claim.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Utilities } from 'src/app/shared/util/utilities';
import { ClaimByMemberDto } from 'src/app/shared/services/claim/entities/claim-by-member.dto';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

/**
 * This component handles view all claims by member id.
 */
@Component({
  selector: 'app-claim-view-all-claims',
  templateUrl: './claim-view-all-claims.component.html'
})
export class ClaimViewAllClaimsComponent implements OnInit, OnDestroy {

  /**
   * claims
   */
  public claims: ClaimByMemberDto;

  /**
   * all claims
   */
  public allClaims: ClaimByMemberDto;

  /**
   * collection size
   */
  public collectionSize: number;

  /**
   * select all model
   */
  public selectAll: boolean;

  /**
   * unselect all model
   */
  public unSelectAll: boolean;

  /**
   * countSelected
   */
  public countSelected: number;

  /**
   * Constant for In process status
   */
  public IN_PROCESS_STATUS = 'In Process';

  /**
    * Form group for claim view reactive form
    */
  public claimViewForm: FormGroup;

  /**
   * Legend to init component
   */
  public LEGEND = '';

  /**
   * resetPicker
   */
  public resetPicker: boolean;

  /**
   * filtering
   */
  public filtering: boolean;

  /**
   * claimStatus
   */
  public claimStatus: Array<any>;

  /**
   * selectedStatus
   */
  public selectedStatus: any;

  /**
   * numberOfClaimsForEobBundle
   */
  private numberOfClaimsForEobBundle: number;

  /**
   * Constant for default page
   */
  private DEFAULT_PAGE = 1;

  /**
   * Constant per page
   */
  private RECORDS_PER_PAGE = 10;

  /**
   * Constant for Provider role
   */
  private PROVIDER = 'Provider';

  /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Title for business exception modal message
   */
  private BUSINESS_EXCEPTION_TITLE = 'Business Exception';

  /**
   * Constant for type PDF
   */
  private PDF_APPLICATION_RESPONSE = 'application/pdf';


  /**
   * user
   */
  private user: any;

  /**
   * Member ID
   */
  private memberId: any;

  /**
   * errorDetail
   */
  private errorDetail: string;

  /**
   * File
   */
  private file: Blob;

  /**
   * searchFilter
   */
  private searchFilter: any;

  /**
   * Constructor method
   * @param claimService Claims Service Injection
   * @param authService Auth Service Injection
   * @param router Router Injection
   * @param notificationService Notification Service Injection
   * @param configurationService Configuration Service Injection
   * @param translate Translate Injection
   * @param router Router Injection
   * @param route ActivatedRoute Injection
   * @param fb FormBuilder Injection
   */
  constructor(
    private claimService: ClaimService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private configurationService: ConfigurationService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.user = this.authService.getUser();
    this.numberOfClaimsForEobBundle = this.configurationService.numberOfClaimsForEboBundle;
  }

  /**
   * Initialize variables and construct default claim response
   */
  ngOnInit() {
    this.initializeOrResetComponent();
    this.getLegend();
    this.translate.onLangChange.subscribe(() => {
      this.getLegend();
    });
    // this.claimViewForm = this.buildDefaultClaimViewForm();
  }

  /**
   * Destroy objects that can use memory in excess
   */
  ngOnDestroy(): void {
    this.claims = null;
    this.allClaims = null;
    this.file = null;
  }

  /**
   * Get initial legend with instructions for claim eob bundle
   */
  getLegend() {
    this.translate.get('CLAIMS.ALL_CLAIMS.LEGEND').subscribe(value => {
      this.LEGEND = value.toString().replace('{0}', this.numberOfClaimsForEobBundle);
    });
  }

  /**
   * Load claim status for filtering
   */
  loadClaimStatus() {
    const statusRootKey = 'CLAIMS.PROCESSED_CLAIMS.STATUS.';
    return [
      { statusName: `${statusRootKey}IN PROCESS`, statusKey: 'In Process' },
      { statusName: `${statusRootKey}PROCESSED`, statusKey: 'Processed' },
      { statusName: `${statusRootKey}DENIED`, statusKey: 'Denied' },
      { statusName: `${statusRootKey}INCOMPLETE`, statusKey: 'Incomplete' }
    ];
  }

  /**
   * Initialize or reset variables and objects in the component
   */
  initializeOrResetComponent() {
    this.memberId = this.route.snapshot.params['memberId'];
    this.initVariables();
    this.viewAllClaimsByMemberId(this.memberId);
  }

  /**
   * Initialize variables and objects for operations
   */
  initVariables() {
    this.claimStatus = this.loadClaimStatus();
    this.selectAll = false;
    this.unSelectAll = false;
    this.claims = this.claimService.buildDefaultClaimByMemberResponse();
    this.file = null;
    this.resetPicker = false;
    this.filtering = false;
    this.countSelected = 0;
    this.searchFilter = {
      claimNumber: null,
      dateOfService: { dateFrom: undefined, dateTo: undefined },
      paymentNumber: null,
      dateOfPayment: { dateFrom: undefined, dateTo: undefined },
      selectedClaimStatus: []
    };
  }

  /**
   * Build claim list form array for reactive form checkboxes
   * @param claims CLaims
   */
  buildClaimsList(claims) {
    const arr = claims.map(() => {
      return this.fb.control(false);
    });
    return this.fb.array(arr);
  }

  /**
   * Build claim status list for reactive form status filter
   * @param searchStatus SearchStatus
   */
  buildClaimStatusList(searchStatus) {
    const arr = this.claimStatus.map((status, i) => {
      return this.fb.control(searchStatus ? searchStatus.selectedStatus[i] : false);
    });
    return this.fb.array(arr);
  }

  /**
   * Build Claim View Form
   * @param claims Claims
   */
  private buildDefaultClaimViewForm(claims) {
    const searchFilter = this.getSearchFilter();
    const claimViewForm = this.fb.group(
      {
        selectAll: new FormControl({ value: false, disabled: false }),
        unselectAll: new FormControl({ value: false, disabled: true }),
        dateOfService: new FormControl(searchFilter.dateOfService),
        claimNumber: new FormControl(searchFilter.claimNumber),
        dateOfPayment: new FormControl(searchFilter.dateOfPayment),
        paymentNumber: new FormControl(searchFilter.paymentNumber),
        claimsResult: this.fb.group({
          selectedClaim: this.buildClaimsList(claims)
        }),
        claimStatus: this.fb.group({
          selectedStatus: this.buildClaimStatusList(searchFilter.claimStatus)
        })
      }
    );

    return claimViewForm;
  }

  private createAllClaimsObject() {
    this.allClaims = Object.create(this.claims);
  }

  /**
   * Build Form and subscribe check events in select all and unselect all
   * @param claims Claims
   */
  buildFormAndChangeEvents(claims) {
    this.claimViewForm = this.buildDefaultClaimViewForm(claims);
    this.onSelectAllChanges();
    this.onUnselectAllChanges();
  }

  /**
   * View all claims by member Id
   * @param memberId Member ID
   */
  viewAllClaimsByMemberId(memberId: string) {
    this.claimService.getClaimsByMemberId(this.user.user_key, this.user.role_id, 'all', memberId).subscribe(
      claims => {
        this.claims = claims;
        this.createAllClaimsObject();
        this.buildFormAndChangeEvents(claims.list);
        this.collectionSize = this.allClaims.totalCount;
      }, error => {
        if (this.checksIfHadBusinessError(error)) {
          this.notificationService.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
        } else if (this.checksIfHadNotFoundError(error)) {
          this.collectionSize = 0;
        }
      }
    );
  }

  /**
   * Function for search claims in memory, filtering according parameter
   */
  search() {
    this.createAllClaimsObject();
    this.filtering = true;
    this.selectAll = false;
    this.unSelectAll = false;
    let claims = this.allClaims.list;
    this.claimViewForm.controls['selectAll'].patchValue(false);
    this.claimViewForm.controls['unselectAll'].patchValue(false);
    this.setSearchFilter(this.claimViewForm.value);
    const serviceDates = this.claimViewForm.get('dateOfService').value;
    const paymentDates = this.claimViewForm.get('dateOfPayment').value;
    const paymentNumber = this.claimViewForm.get('paymentNumber').value;
    const status = this.claimViewForm.get('claimStatus').value;

    if (serviceDates.dateFrom && serviceDates.dateTo) {
      claims = this.searchByServiceDates(claims, serviceDates);
    }
    if (status.selectedStatus[0] || status.selectedStatus[1] || status.selectedStatus[2] || status.selectedStatus[3]) {
      claims = this.searchByStatus(claims);
    }
    if (paymentDates.dateFrom && paymentDates.dateTo) {
      claims = this.searchByPaymentDates(claims, paymentDates);
    }
    if (paymentNumber) {
      claims = this.searchByPaymentNumber(claims, paymentNumber);
    }

    this.allClaims.list = claims;
    this.collectionSize = this.allClaims.list.length;
    this.buildFormAndChangeEvents(this.allClaims.list);
  }

  /**
   * Get search status management
   */
  getSearchFilter() {
    return this.searchFilter;
  }

  /**
   * Set search status management
   * @param formValues Claim View Form
   */
  setSearchFilter(formValues) {
    this.searchFilter = {
      claimNumber: formValues.claimNumber,
      dateOfService: formValues.dateOfService,
      paymentNumber: formValues.paymentNumber,
      dateOfPayment: formValues.dateOfPayment,
      selectedClaimStatus: formValues.claimStatus,
      claimStatus: formValues.claimStatus
    };
  }

  /**
   * Search by date of service
   * @param serviceDates Service Dates
   */
  searchByServiceDates(claims, serviceDates) {
    let from: Date;
    let to: Date;
    if (serviceDates.dateFrom) {
      from = new Date(serviceDates.dateFrom);
    }
    if (serviceDates.dateTo) {
      to = new Date(serviceDates.dateTo);
    }
    if (from && to) {
      return claims.filter(c => new Date(c.serviceFrom) >= from && new Date(c.serviceTo) <= to);
    } else if (from) {
      return claims.filter(c => new Date(c.serviceFrom) >= from);
    } else if (to) {
      return claims.filter(c => new Date(c.serviceTo) <= to);
    }
  }

  /**
   * Search by date of payment
   * @param paymentDates Payment Dates
   */
  searchByPaymentDates(claims, paymentDates) {
    const from = new Date(paymentDates.dateFrom);
    const to = new Date(paymentDates.dateTo);
    return claims.filter(c => new Date(c.serviceFrom) >= from && new Date(c.serviceTo) <= to);
  }

  /**
   * Search by payment number
   * @param paymentNumber Payment number
   */
  searchByPaymentNumber(claims, paymentNumber) {
    return claims.filter(c => c.payment.paymentNumber === paymentNumber);
  }

  /**
   * Search by claim status
   */
  searchByStatus(claims) {
    const filterStatus = this.claimViewForm.get('claimStatus').value.selectedStatus;
    let statusArray = [];
    filterStatus.forEach((status, index) => {
      if (status) {
        statusArray = Array.from(new Set(statusArray
          .concat(claims.filter(c => c.statusName === this.claimStatus[index].statusKey))));
      }
    });
    return statusArray;
  }

  /**
   * Clear filters
   */
  clearSearch() {
    this.resetPicker = true;
    (<FormControl>this.claimViewForm.controls['claimNumber']).reset();
    (<FormControl>this.claimViewForm.controls['dateOfService']).reset();
    (<FormControl>this.claimViewForm.controls['paymentNumber']).reset();
    (<FormControl>this.claimViewForm.controls['dateOfPayment']).reset();
    (<FormControl>this.claimViewForm.controls['claimStatus']).reset();
    this.resetPicker = false;

    this.initializeOrResetComponent();
  }

  /**
   * Calculate number of pages, according result count
   * @param allClaims All claims array
   */
  getNumberOfPages(allClaims) {
    return Math.ceil(allClaims.list.length / this.RECORDS_PER_PAGE);
  }

  /**
   * On Select All change event, for check all claims
   */
  onSelectAllChanges(): void {
    this.claimViewForm.get('selectAll').valueChanges
      .subscribe(selected => {
        if (selected) {
          this.countSelected = 0;
          this.claimViewForm.controls['unselectAll'].patchValue(false);
          this.selectAll = true;
          this.unSelectAll = false;
          const formArray = (this.claimViewForm.controls['claimsResult'].get('selectedClaim') as FormArray);
          formArray.controls.forEach((c, i) => {
            if (this.allClaims.list[i].statusName !== this.IN_PROCESS_STATUS) {
              c.patchValue(true);
              this.countSelected += 1;
            }
          });
        }
      });
  }

  /**
   * On Unselect All change event
   */
  onUnselectAllChanges(): void {
    this.claimViewForm.get('unselectAll').valueChanges.subscribe(selected => {
      if (selected) {
        this.claimViewForm.controls['claimsResult'].get('selectedClaim')
          .patchValue(Array(this.allClaims.list.length).fill(!selected), { emitEvent: false });
        this.countSelected = 0;
        this.claimViewForm.controls['selectAll'].patchValue(false);
        this.selectAll = false;
        this.unSelectAll = true;
      }
    });
  }

  /**
   * Select single claim
   * @param claim Claim object
   */
  selectCheck($event) {
    this.countSelected = $event.target.checked ? this.countSelected += 1 : this.countSelected -= 1;
    this.claimViewForm.controls['selectAll'].patchValue(false);
    this.claimViewForm.controls['unselectAll'].patchValue(false);
    this.selectAll = false;
    this.unSelectAll = false;
    $event.stopPropagation();
    $event.preventDefault();
  }

  /**
  * Select status
   * @param $event Event
   */
  selectStatusCheck($event) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  /**
   * Go back to my claims
   */
  goBackToClaims() {
    if (this.user.role === this.PROVIDER) {
      this.router.navigate(['/claims/my-claims']);
    } else {
      this.router.navigate(['/claims/my-claims-agent']);
    }
  }

  /**
   * Generate eob bundle with selected claims
   */
  async generateEobBundle() {
    const title = await this.translate.get('CLAIMS.ALL_CLAIMS.MESSAGE_TITLE').toPromise();
    let message = '';
    let accept = await this.translate.get('CLAIMS.ALL_CLAIMS.IM_SURE').toPromise();
    const decline = await this.translate.get('CLAIMS.ALL_CLAIMS.GO_BACK').toPromise();
    if (this.checkIfNumberOfSelectedClaimsAreValidForEobBundle(this.countSelected, this.numberOfClaimsForEobBundle)) {
      message = await this.translate.get('CLAIMS.ALL_CLAIMS.VALID_EOB_BUNDLE').toPromise();
      const validateSelectedClaims =
        await this.notificationService.showDialog(title, message.replace('{0}', this.countSelected.toString()), true, accept, decline);
      if (validateSelectedClaims) {
        let claimDetailList = '';
        const selectedClaimsForEobBundle = this.claimViewForm.controls['claimsResult'].get('selectedClaim').value;
        const claimDetailArray = [];
        selectedClaimsForEobBundle.forEach((checked, i) => {
          if (checked) {
            claimDetailArray.push(this.allClaims.list[i].claimDetailId);
          }
        });

        if (claimDetailArray.length === 1) {
          claimDetailList = claimDetailArray[0].toString();
        } else {
          claimDetailList = claimDetailArray.map((claim) => claim.toString()).join(',');
        }
        this.downloadClaimEobBundle(claimDetailList);
      }
    } else {
      message = await this.translate.get('CLAIMS.ALL_CLAIMS.INVALID_EOB_BUNDLE').toPromise();
      accept = await this.translate.get('CLAIMS.ALL_CLAIMS.OK').toPromise();
      await this.notificationService.showDialog(title, message.replace('{0}', this.numberOfClaimsForEobBundle.toString()), false, accept);
    }
  }

  /**
   * Download EOB Bundle
   * @param claimDetailList claim Detail List
   */
  async downloadClaimEobBundle(claimDetailList) {
    this.claimService.getEobBundleForClaim(claimDetailList, this.user.role_id, this.user.bupa_insurance).subscribe(
      data => {
        this.file = new Blob([new Uint8Array(data)], { type: this.PDF_APPLICATION_RESPONSE });
        const fileName = `EOB-${Utilities.generateRandomId()}`;
        const isSaved = this.saveAsFile(this.file, fileName);
        if (isSaved) {
          this.initializeOrResetComponent();
        }
      }, error => {
        if (this.checksIfHadNotFoundError(error)) {
          this.translate.get('CLAIMS.PROCESSED_CLAIMS.EOB_NOT_FOUND').subscribe(er => {
            this.errorDetail = er;
          });
          this.notificationService.showDialog('Not Data Found', this.errorDetail);
        }
      });
    return false;
  }

  /**
   * Return value when saveAs operation finish
   * @param file File Blob
   * @param fileName FileName
   */
  async saveAsFile(file, fileName) {
    await saveAs(file, fileName + '.' + 'pdf');
    return true;
  }

  /**
   * Check if claim is not in 'In Process' status name
   * @param claim Claim
   */
  checkIfIsNotInProcessStatusClaim(claim) {
    return (claim.statusName !== this.IN_PROCESS_STATUS);
  }

  /**
   * Check valid number of claims for eob bundle
   * @param countSelected Count selected
   * @param numberOfClaimsForEobBundle Number of selected claims
   */
  checkIfNumberOfSelectedClaimsAreValidForEobBundle(countSelected, numberOfClaimsForEobBundle) {
    return (countSelected <= numberOfClaimsForEobBundle);
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

}

export interface ClaimEobBundle {
  claimNumber: number;
  claimDetailId: number;
  selected?: boolean;
}
