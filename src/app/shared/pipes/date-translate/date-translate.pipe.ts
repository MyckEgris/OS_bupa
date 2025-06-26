/**
* DateTranslatePipe.ts
*
* @description: Transform dates in custom formats based on translate formats
* @author Yefry Lopez.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Pipe, PipeTransform, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Utilities } from '../../util/utilities';

/**
 * Transform dates in custom formats based on translate formats
 */
@Pipe({
  name: 'dateTranslate',
  pure: false
})
export class DateTranslatePipe implements PipeTransform {

  /**
   * Get format from translate files i18n
   */
  private DATE_FORMAT = 'APP.DATE_FORMAT';

  /**
   * Return date format according translate current language
   */
  public result = '';

  /**
   * Constructor Method
   * @param translate Translate Service Injection
   * @param _ref ChangeDetectorRef
   */
  constructor(private translate: TranslateService, private _ref: ChangeDetectorRef) { }

  /**
   * Method for transform a date with custom format according the current language
   * @param value Date to transform
   * @param dateFormat Date format
   * @param lang Language
   */
  updateValue(value: any, dateFormat: string, lang: string) {
    const datePipe = new DatePipe('en');
    try {
      this.result = datePipe.transform(value, dateFormat);
      // this.result = Utilities.convertDateToStringWithFormat(value, dateFormat);
    } catch {
      this.result = '';
    }
    this._ref.markForCheck();
  }

  /**
   * Implementation of transform function of PipeTransform
   * @param value any
   * @param dateFormat Format
   * @param locale Locale
   */
  transform(value: any, dateFormat?: string, locale?: string): any {
    if (!value) {
      return '';
    }

    if (!dateFormat) {
      dateFormat = this.DATE_FORMAT;
    }

    if (!locale) {
      locale = 'en-US';
    }

    let dateValue: any;
    if (Utilities.checkIfIsSafari()) {
      dateValue = new Date(value.replace(/-/g, "/"));
    } else {
      dateValue = Date.parse(value);
    }
     
    this.translate.stream(dateFormat).subscribe(format => {
      this.updateValue(dateValue, format, this.translate.currentLang);
    });

    return this.result;
  }

}
