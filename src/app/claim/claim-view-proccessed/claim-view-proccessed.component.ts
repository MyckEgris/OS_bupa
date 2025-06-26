import { ConfigurationService } from './../../shared/services/configuration/configuration.service';
/**
* ClaimViewProccessedComponent.ts
*
* @description: This class search processed claims.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ClaimService } from '../../shared/services/claim/claim.service';
import * as $ from 'jquery';
import { ClaimDto } from '../../shared/services/claim/entities/claim.dto';
import { AuthService } from '../../security/services/auth/auth.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { Claim } from '../../shared/services/claim/entities/claims';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { Subject, Subscription } from 'rxjs';
import { ClaimLinesDetail } from '../../shared/services/claim/entities/claim-line-detail.dto';
import { TranslateService } from '@ngx-translate/core';
import { Utilities } from './../../shared/util/utilities';


/**
 * This class search processed claims.
 */
@Component({
  selector: 'app-claim-view-proccessed',
  templateUrl: './claim-view-proccessed.component.html'
})
export class ClaimViewProccessedComponent implements OnInit, OnDestroy {

  /**
   * Notifier subscriptor
   */
  @Input() notifier: Subject<any>;

  /**
   * Subscription
   */
  private notifySubscriber: Subscription;

  /**
   * Constant for details toggle selector
   */
  private ID_DETAIL_TOGGLE = '#ig-detallereclamo-';

  /**
   * Constant for payment detail toggle selector
   */
  private ID_PAYMENT_TOGGLE = '#ig-detallepago-';

  /**
   * Init page for pagination component
   */
  private INIT_PAGE = 1;

  /**
   * Page size for pagination component
   */
  private PAGE_SIZE = 10;

  /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Constant for error code status # 302 for EOB result
   */
  private STATUS_FOR_FOUND = 302;

  /**
   * Title for business exception modal message
   */
  private BUSINESS_EXCEPTION_TITLE = 'Business Exception';

  /**
   * Constant for type PDF
   */
  private PDF_APPLICATION_RESPONSE = 'application/pdf';

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
  public fromStartDate: any;

  /**
   * From End Date
   */
  public fromEndDate: any;

  /**
   * To Start Date
   */
  public toStartDate: any;

  /**
   * To End Date
   */
  public toEndDate: any;

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
   * Initilization for Claims object
   */
  public claims: ClaimDto = { data: [], pageIndex: 1, pageSize: 0, count: 0 };

  /**
   * Collection size for pagination component
   */
  public collectionSize: number = null;

  /**
   * Current page for pagination component
   */
  public page: number;

  /**
   * Language Id for EOB document
   */
  public languageId: number;

  /**
   * Error variable for business esceptions
   */
  public errorDetail = '';

  /**
   * currencyUsdId
   */
  public currencyUsdId: number;

  /**
   * currencyUsdSymbol
   */
  public currencyUsdSymbol: string;

  /**
   * role id
   */
  public roleId: any;

  // [style.display]="claim.currencyId === currencyUsdId ? 'none' : 'initial'"

  /**
   * Constructor Method
   * @param claimsService Claims Service Injection
   * @param authService Auth Service Injection
   * @param notification Notification Service Injection
   * @param translation Translation Service Injection
   * @param translate Translate Service Injection
   */
  constructor(
    private claimsService: ClaimService,
    private authService: AuthService,
    private notification: NotificationService,
    private translation: TranslationService,
    private translate: TranslateService,
    private configuration: ConfigurationService
  ) { }

  /**
   * When initializing the component, it subscribes to parent notifier and receive params to execute the search
   */
  ngOnInit() {
    this.currencyUsdId = this.configuration.currencyUsdId;
    this.currencyUsdSymbol = `${this.configuration.currencyUsdSymbol} `;
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
   * Search claims by member name and state equals proccess
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
          this.collectionSize = this.claims.count;
        }, error => {
          this.claims = { data: [], pageIndex: 1, pageSize: 0, count: 0 };
          if (this.checksIfHadBusinessError(error)) {
            this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
          } else if (this.checksIfHadNotFoundError(error)) {
            this.collectionSize = 0;
          }
        }
      );
  }

  /**
   * Get claim detail and add to claim object
   * @param claimDetailId Claim Detail ID
   * @param claim Claim object
   */
  getClaimDetailAndAddToClaimObject(claim: Claim) {
    this.languageId = this.translation.getLanguageId();
    this.claimsService.getDetailsForClaim(claim.claimDetailId).subscribe(
      details => {
        claim.claimLinesDetails = details;
      }, error => {
        claim.claimLinesDetails = [];
        if (this.checksIfHadBusinessError(error)) {
          this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
        } else if (this.checksIfHadNotFoundError(error)) {
          this.translate.stream('CLAIMS.PROCESSED_CLAIMS.DETAIL_NOT_FOUND').subscribe(er => {
            this.errorDetail = er;
          });
        }
      }
    );
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
   * Jquery function to toggle claim details
   * @param detail Claim Id
   */
  toggleSlideDetail(claim) {
    $(this.ID_DETAIL_TOGGLE + claim.claimNumber).slideToggle();
    $(this.ID_PAYMENT_TOGGLE + claim.claimNumber).slideUp();
    if (!claim.claimDetailsDto) {
      this.getClaimDetailAndAddToClaimObject(claim);
    }
  }

  /**
   * Jquery function to toggle payment details
   * @param detail Claim Id
   */
  toggleSlidePayment(detail: string) {
    $(this.ID_PAYMENT_TOGGLE + detail).slideToggle();
    $(this.ID_DETAIL_TOGGLE + detail).slideUp();
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
}
