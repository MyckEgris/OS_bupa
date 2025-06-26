/**
* ClaimViewDetailsComponent.ts
*
* @description: This class shows details of a item in processed claims.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ClaimLinesDetail } from '../../shared/services/claim/entities/claim-line-detail.dto';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PagerService } from '../../shared/services/pager/pager.service';

/**
 * This class shows details of a item in processed claims.
 */
@Component({
  selector: 'app-claim-view-details',
  templateUrl: './claim-view-details.component.html'
})
export class ClaimViewDetailsComponent implements OnInit, OnChanges {

  /**
   * Input for claim details dto
   */
  @Input() claimDetails: ClaimLinesDetail[];

  /**
   * Input for currency symbol
   */
  @Input() currencySymbol: string;

  /**
   * Input for number
   */
  @Input() number: number;

  /**
   * Input for currency symbol for USD
   */
  @Input() currencySymbolUsd: string;

  /**
   * Input for currency Code.
   */
  @Input() currencyCode: string;

  /**
   * Input for exchange rate
   */
  @Input() exchangeRate: number;

  /**
   * Input for chack if USD is the local currency
   */
  @Input() isLocalUsd: boolean;

  /**
   * Input for policy number
   */
  @Input() policy: any;

  /**
   * Claim status name
   */
  @Input() statusName: string;


  /**
   * Constant for default language id
   */
  private DEFAULT_LANGUAGE_ID = 1;

  /**
   * Language id
   */
  public languageId: number;

  /**
   * Input for role id
   */
  public roleId: string;

  // paged items
  pagedItems: any[];

  // stores the items per page
  totalItemsToBePaged: number;

  // pager object
  pager: any = {};

  /**
   * Constructor Method
   * @param translate Translate Service Injection
   * @param translation Translation Service Injection
   */
  constructor(
    private translate: TranslateService,
    private translation: TranslationService,
    private authService: AuthService,
    private pagerService: PagerService
  ) {
    this.roleId = this.authService.getUser().role_id;
  }

  /**
   * When initializing the component, get language id (1-English, 2-Spanish), and subscribe to language change event
   */
  ngOnInit() {

    this.languageId = this.translation.getLanguageId() || this.DEFAULT_LANGUAGE_ID;
    this.translate.onLangChange.subscribe(() => {
      this.languageId = this.translation.getLanguageId() || this.DEFAULT_LANGUAGE_ID;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setPage(1);
  }

  /**
   * gets the whole payment list and displays the segment from the page selected.
   * @param page page number
   */
  public setPage(page: number) {
    this.totalItemsToBePaged = 5;
    if (this.claimDetails) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      // this.translate.stream(this.defaultDateFormat).subscribe(format => {
      //   this.language = this.translationService.getLanguage();
      //   this.formatDates();
      // });

      // triggers the not found message
      // if (this.claimDetails.length === 0) {
      //   this.dataNotFound = true;
      // } else {
      //   this.dataNotFound = false;
      // }

      // get pager object from service
      this.pager = this.pagerService.getPager(this.claimDetails.length, page, this.totalItemsToBePaged);

      // get current page of items
      this.pagedItems = this.claimDetails.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }
}
