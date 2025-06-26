/**
* DateFormatService.ts
*
* @description: This class formats the dates on the bootstrap datepickers based on the language.
* @author Juan Moreno.
* @author Arturo Suarez.
* @version 1.0
* @date 01-10-2018.
*
**/

import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { isNumber, toInteger, padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { TranslationService } from '../translation/translation.service';

/**
 * This class formats the dates on the bootstrap datepickers based on the language.
 */
@Injectable()
export class DateFormatService extends NgbDateParserFormatter {

  /**
   * Constructor Method
   * @param translation Translation Service Injection
   */
  constructor(
    private translation: TranslationService
  ) {
    super();
  }

  /**
   * Parse date
   * @param value Value
   */
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { day: toInteger(dateParts[0]), month: null, year: null };
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return { day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null };
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return { day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2]) };
      }
    }
    return null;
  }

  /**
   * Changes the date format.
   * @param date Formats the NGBootstrap Date picker depending on the language.
   */
  format(date: NgbDateStruct): any {
    try {
      return new Date(date.year, date.month, date.day);
    } catch {
      return new Date();
    }
    /*return date ?
    `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? padNumber(date.month) : ''}-${date.year}` :
    '';*/

    /*switch (lang) {
      case "ESP":
        return date ?
          `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? padNumber(date.month) : ''}-${date.year}` :
          '';
      default:
        return date ?
          `${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}-${date.year}` :
          '';
    }*/
  }
}
