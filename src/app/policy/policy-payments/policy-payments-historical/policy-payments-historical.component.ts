import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PaymentDto } from 'src/app/shared/services/policy/entities/payment.dto';
import { DatePipe } from '@angular/common';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { stringify } from 'querystring';


@Component({
  selector: 'app-policy-payments-historical',
  templateUrl: './policy-payments-historical.component.html',
  providers: [PagerService]
})
export class PolicyPaymentsHistoricalComponent implements OnChanges {

  private defaultDateFormat = 'MM/dd/yyyy';

  // Language
  private language: string;

  // Language for Spanish option
  private SPA_LANGUAGE = 'SPA';

  // pager object
  pager: any = {};

  // Shows or hides the not found message
  public dataNotFound: boolean;

  // stores the items per page
  totalItemsToBePaged: number;

  // paged items
  pagedItems: any[];

  public currencySymbol = '';

  // Payment array that is shown in the list
  @Input() payments: PaymentDto[];

  // Payment array that is shown in the list
  @Input() policy: PolicyDto;

  @Input() showToPayMexicanPeso: boolean;

  @Input() fixedRate: boolean;
  @Input() isRoleEmployeeOrAdmin: boolean;

  /**
   * Locale for English to pipe
   */
  private SPA_LOCATE = 'es-Us';

  /**
   * Locale for Spanish to pipe
   */
  private ENG_LOCATE = 'en-Us';

  /**
   * DatePipe object
   */
  public pipe: DatePipe;

  /**
   * Spanish birth format
   */
  private SPA_MEMBER_BIRTH_FORMAT = `dd 'd'e MMMM 'd'e yyyy`;

  /**
   * English birth format
   */
  private ENG_MEMBER_BIRTH_FORMAT = 'MMMM d, y';

  public sizeColumnToPay = 2;

  // Constructor
  constructor(private translationService: TranslationService,
    private translate: TranslateService,
    private _config: ConfigurationService,
    private pagerService: PagerService) {
    this.totalItemsToBePaged = this._config.paymentHistoricPageSize;
    }

  /**
   * Detects all the payments loaded and shows them on the page.
   * @param changes Angular parameter that contains all the items that changed
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payments'].currentValue.length > 0) {
      this.setPage(1);
    } else { this.dataNotFound = true; }

    if (this.showToPayMexicanPeso) {
      this.sizeColumnToPay = 1;
    }
  }

  /**
   * gets the whole payment list and displays the segment from the page selected.
   * @param page page number
   */
  public setPage(page: number) {
    this.totalItemsToBePaged = 5;
    if (this.payments) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      this.translate.stream(this.defaultDateFormat).subscribe(format => {
        this.language = this.translationService.getLanguage();
        this.formatDates();
      });

      // triggers the not found message
      if (this.payments.length === 0) {
        this.dataNotFound = true;
      } else {
        this.dataNotFound = false;
      }

      // get pager object from service
      this.pager = this.pagerService.getPager(this.payments.length, page, this.totalItemsToBePaged);

      // get current page of items
      this.pagedItems = this.payments.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }

  /**
   * Formats the dates on all the payments
   */
  formatDates() {
    if (this.payments.length > 0) {
      this.payments.forEach(payment => {
        this.setDateTimeFormatByLocation(payment);
      });
    }
  }

  /**
 * Formats date and time based on the current language.
 */
  private setDateTimeFormatByLocation(payment: PaymentDto) {
    const newDate = new Date(payment.paymentDate).getTime();
    if (this.language === this.SPA_LANGUAGE) {
      this.pipe = new DatePipe(this.SPA_LOCATE);
      payment.paymentDateToShow = this.pipe.transform(newDate, this.SPA_MEMBER_BIRTH_FORMAT);
    } else {
      this.pipe = new DatePipe(this.ENG_LOCATE);
      payment.paymentDateToShow = this.pipe.transform(newDate, this.ENG_MEMBER_BIRTH_FORMAT);
    }
  }
}
