import { ConfigurationService } from './../../shared/services/configuration/configuration.service';
/**
* ClaimViewIncompleteComponent.ts
*
* @description: This class This class search incomplete or -receive and pending- claims
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ClaimService } from '../../shared/services/claim/claim.service';
import { ClaimDto } from '../../shared/services/claim/entities/claim.dto';
import { AuthService } from '../../security/services/auth/auth.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { Subject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Utilities } from './../../shared/util/utilities';
import { ClaimUpdateWizardService } from 'src/app/shared/services/claim/claim-update-wizard.service';
import { Router } from '@angular/router';

/**
 * This class This class search incomplete or -receive and pending- claims
 */
@Component({
  selector: 'app-claim-view-incomplete',
  templateUrl: './claim-view-incomplete.component.html'
})
export class ClaimViewIncompleteComponent implements OnInit, OnDestroy {

  /**
   * Input for subscriptor
   */
  @Input() notifier: Subject<any>;


  /**
   * Subscription
   */
  private notifySubscriber: Subscription;

  /**
   * Constant for error status 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Constant for error status 302 for eob
   */
  private STATUS_FOR_FOUND = 302;

  /**
   * Translate root key
   */
  private rootTitle = 'CLAIMS.INCOMPLETE_OR_PENDING';

  /**
   * Constant for init page for pagination component
   */
  private INIT_PAGE = 1;

  /**
   * Business exception message title
   */
  private BUSINESS_EXCEPTION_TITLE = 'Business Exception';

  /**
   * COnstant for PDF files
   */
  private PDF_APPLICATION_RESPONSE = 'application/pdf';

  /**
   * Page size for pagination component
   */
  public PAGE_SIZE = 10;

  /**
   * State
   */
  public state: string;

  /**
   * Member First Name
   */
  public memberFirstName: string;

  /**
   * Member Last Name
   */
  public memberLastName: string;

  /**
   * From Start Date
   */
  public fromStartDate: Date;

  /**
   * From End Date
   */
  public fromEndDate: Date;

  /**
   * To Start Date
   */
  public toStartDate: Date;

  /**
   * To End Date
   */
  public toEndDate: Date;

  /**
   * Object that contains startService and endService
   */
  public dateOfService: any;

  /**
   * Billed Amount
   */
  public billedAmount: number;

  /**
   * Claim Number
   */
  public claimNumber: number;

  /**
   * Policy Id
   */
  public policyId: number;

  /**
   * Account Number
   */
  public accountNumber: number;

  /**
   * Error variable for business esceptions
   */
  public errorDetail = '';

  /**
   * Initial Claims Dto object
   */
  public claims: ClaimDto = { data: [], pageIndex: 0, pageSize: 0, count: 0 };

  /**
   * Collection size for pagination component
   */
  public collectionSize: number = null;

  /**
   * Current page for pagination component
   */
  public page: number;

  /**
   * Title
   */
  public title: string;

  /**
   * currencyUsdId
   */
  public currencyUsdId: number;

  /**
   * currencyUsdSymbol
   */
  public currencyUsdSymbol: string;

  /**
   * Constructor Method
   * @param claimsService Claims Service Injection
   * @param authService Auth Service Injection
   * @param notification Notification Service Injection
   * @param translate Translate Service Injection
   * @param configuration Configuration Service Injection
   */
  constructor(
    private claimsService: ClaimService,
    private authService: AuthService,
    private notification: NotificationService,
    private translate: TranslateService,
    private configuration: ConfigurationService,
    private claimUpdate: ClaimUpdateWizardService,
    private router: Router
  ) { }

  /**
   * When initilizing the component, it subscribes to the parent notifier and receive params to execute the search.
   * According claim type search, get title for incomplete or -receive and pending-
   */
  ngOnInit() {

    this.currencyUsdId = this.configuration.currencyUsdId;
    this.currencyUsdSymbol = this.configuration.currencyUsdSymbol;


    this.notifySubscriber = this.notifier.subscribe(params => {

      this.state = params[0];
      this.memberFirstName = params[1];
      this.memberLastName = params[2];

      const startDates = params[3] === null ? undefined : params[3];
      if (startDates) {
        this.fromStartDate = startDates === null ? undefined : startDates.dateFrom;
        this.fromEndDate = startDates === null ? undefined : startDates.dateTo;
      }

      const endDates = params[4] === null ? undefined : params[4];
      if (endDates) {
        this.toStartDate = endDates === null ? undefined : endDates.dateFrom;
        this.toEndDate = endDates === null ? undefined : endDates.dateTo;
      }

      this.billedAmount = params[5];
      this.claimNumber = params[6];
      this.policyId = params[7];
      this.accountNumber = params[8];
      this.page = this.INIT_PAGE;
      this.getTitle();
      this.getClaimsByProviderIdAndStateMemberName(this.page);
    });
  }

  /**
   * Unsubscribe to parent notifier
   */
  ngOnDestroy() {
    this.notifySubscriber.unsubscribe();
  }

  /**
   * Search claims by member name and state equals incomplete or state equals pending
   */
  getClaimsByProviderIdAndStateMemberName(page: number) {

    const user = this.authService.getUser();

    this.claimsService.getClaimsByProviderIdAndStateAndAdvancedOptions(user.user_key, user.role_id, user.provider_id,
      this.memberFirstName, this.memberLastName, this.state, page, this.PAGE_SIZE, this.billedAmount, this.claimNumber,
      this.policyId, this.accountNumber, this.fromStartDate, this.fromEndDate, this.toStartDate, this.toEndDate).subscribe(
        data => {
          this.claims = data;
          this.claims.data.forEach(cl => {
            cl.currencySymbol = cl.currencySymbol != null ? `${cl.currencySymbol.toUpperCase()} ` : ' ';
          });
          this.collectionSize = data.count;
        },
        error => {
          this.claims = { data: [], pageIndex: 0, pageSize: 0, count: 0 };
          if (this.checksIfHadBusinessError(error)) {
            this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
          } else if (this.checksIfHadNotFoundError(error)) {
            this.collectionSize = 0;
          }
        }
      );
  }

  /**
   * Get title depending of claim state for pending or incomplete
   */
  getTitle() {
    const componentTitle = this.state === 'pending' ? `${this.rootTitle}.TITLE_PENDING` : `${this.rootTitle}.TITLE_INCOMPLETE`;
    this.translate.stream(componentTitle).subscribe(t => {
      this.title = t;
    });
  }

   /**
   * Get explain of benefits document
   * @param claimDetailId Claim detail ID
   */
  getClaimEob(claimDetailId, businessId) {
    const user = this.authService.getUser();
    if (businessId === 0) {
      businessId = user.bupa_insurance;
    }

    this.claimsService.getEobForClaim(claimDetailId, user.role_id, businessId).subscribe(
      data => {
        const file = new Blob([new Uint8Array(data)], { type: this.PDF_APPLICATION_RESPONSE });
        const date = new Date();
        const fileName = `EOB-${Utilities.generateRandomId()}`;
        saveAs(file, fileName + '.' + 'pdf');
      }, error => {
        if (this.checksIfHadNotFoundError(error)) {
          this.translate.get('CLAIMS.PROCESSED_CLAIMS.EOB_NOT_FOUND').subscribe(er => {
            this.errorDetail = er;
          });
          this.notification.showDialog('Not Data Found', this.errorDetail);
        }
      });
      return false;
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
   * Check if status is 302 and show message for found
   * @param error Http Error
   */
  checksIfHasFoundState(error) {
    return (error.status === this.STATUS_FOR_FOUND);
  }

  goToUpdateClaim(claim) {
    this.claimUpdate.claim = claim;
    this.router.navigate(['claims/claim-update']);
  }
}
