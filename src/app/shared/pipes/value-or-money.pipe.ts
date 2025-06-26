
/**
* ValueOrMoneyPipe.ts
*
* @description: Transform or not value in currency, if quantitytype is money
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-12-2018.
*
**/

import { Pipe, PipeTransform, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

/**
 * Transform or not value in currency, if quantitytype is money
 */
@Pipe({
    name: 'valueOrMoney',
    pure: false
})
export class ValueOrMoneyPipe implements PipeTransform {

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
    constructor(private _ref: ChangeDetectorRef) { }

    /**
     * Method for transform a date with custom format according the current language
     * @param value Date to transform
     * @param dateFormat Date format
     * @param lang Language
     */
    updateValue(value: number, quantityType: string, currencySymbol?: string) {
        const currencyPipe = new CurrencyPipe('en');
        const decimalPipe = new DecimalPipe('en');
        if (!currencySymbol) {
            currencySymbol = '$';
        }
        this.result = '';
        try {
            this.result = quantityType === 'money' ? currencyPipe.transform(value, `${currencySymbol} `) : decimalPipe.transform(value);
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
    transform(value: any, quantityType?: string, currencySymbol?: string): any {
        if (!value) {
            value = 0;
        }

        if (!quantityType) {
            quantityType = 'money';
        }

        if (!currencySymbol && !quantityType) {
            currencySymbol = 'US$';
        }

        this.updateValue(value, quantityType, currencySymbol);
        return this.result;
    }

}
