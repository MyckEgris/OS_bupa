/**
* Utilities.ts
*
* @description: Static class for share helper functions without instance
* @author Juan Camilo Moreno
* @version 1.0
* @date 17-09-2018.
*
**/

import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';


/**
 * Static class for share helper functions without instance
 */
export class Utilities {

    /**
     * Get current browser date
     */
    public static getDateNow() {
        const dateNow = new Date();
        return new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(),
            dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds());
    }

    /**
     * Get current UTC date
     */
    public static getDateUTCNow() {
        const dateNow = new Date();
        return new Date(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), dateNow.getUTCDate(),
            dateNow.getUTCHours(), dateNow.getUTCMinutes(), dateNow.getUTCSeconds());
    }

    /**
     * Delay for sleeping time in any requirement
     * @param ms Milliseconds
     */
    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Extract date from NgbDatePickerControl
     * @param dateToFormat dateformat
     */
    public static extractDateFromNgDatePicker(dateToFormat: any) {
        return dateToFormat.month + '-' + dateToFormat.day + '-' + dateToFormat.year;
    }

    /**
     * Get current browser date for ng-bootstrap datePicker
     */
    public static getDateNowForDatePicker(date?) {
        if (!date) {
            date = new Date();
        }

        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }

    /**
     * Get current browser date for ng-bootstrap datePicker
     */
    public static convertDateToString(date?) {
        if (!date) {
            date = new Date();
        }

        return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    }

    /**
     * Convert date in string according format
     */
    public static convertDateToStringWithFormat(date: Date, format: string) {
        if (!date) {
            return '';
        }

        try {
            const formatArray = this.clasifyDateFormat(format);
            const resultD = [];
            formatArray.forEach(p => {
                resultD.push(this.buildDateResult(p, date));
            });

            return resultD.join('');
        } catch (error) {
            return '';
        }
    }

    private static clasifyDateFormat(dateFormat) {
        let aux = '';
        const returnFormat = [];
        let partIndex = 0;
        for (let i = 0; i < dateFormat.length; i++) {
            if (i === 0) {
                returnFormat.push(dateFormat[i]);
                aux = dateFormat[i];
            } else {
                if (dateFormat[i].toLowerCase() !== aux.toLowerCase()) {
                    partIndex++;
                    aux = dateFormat[i];
                    returnFormat.push(dateFormat[i]);
                } else {
                    returnFormat[partIndex] = returnFormat[partIndex] + dateFormat[i];
                }
            }
        }

        return returnFormat;
    }

    private static buildDateResult(datePart, date) {
        switch (datePart) {
            case 'yyyy':
            case 'yy':
            case 'y':
            case 'YYYY':
            case 'Y':
            case 'YY':
                return this.getYearFromDate(date);
            case 'MM':
                return this.getMonthFromDate(date);
            case 'MMMM':
                return this.getMonthNameFromDate(date);
            case 'dd':
            case 'DD':
                return this.getDayFromDate(date);
            case 'd':
            case 'D':
                return this.getDayNameFromDate(date);
            case '-':
            case '/':
            case '|':
            case ' ':
                return datePart;
            case 'hh':
                return this.getHour12FromDate(date);
            case ':':
            case 'mm':
            case 'a':
            case 'z':
                return '';
        }
    }

    private static getDayFromDate(date) {
        return this.completeDatePart(date.getDate().toString());
    }

    private static getDayNameFromDate(date) {
        return date.toLocaleString(this.getLocaleFromCurrentLanguage(), { weekday: 'long' });
    }

    private static getMonthFromDate(date) {
        return this.completeDatePart((date.getMonth() + 1).toString());
    }

    private static getMonthNameFromDate(date) {
        return date.toLocaleString(this.getLocaleFromCurrentLanguage(), { month: 'long' });
    }

    private static getYearFromDate(date) {
        return date.getFullYear();
    }

    private static getSecondsFromDate(date) {
        return this.completeDatePart(date.getSeconds());
    }

    private static getMinutesFromDate(date) {
        return this.completeDatePart(date.getMinutes());
    }

    private static getHoursFromDate(date) {
        return this.completeDatePart(date.getHours());
    }

    private static getHour12FromDate(date) {
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }

    private static getHour24FromDate(date) {
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
    }

    private static getLocaleFromCurrentLanguage() {
        return (localStorage.getItem('currentLang') ? (localStorage.getItem('currentLang') === 'SPA' ? 'es' : 'default') : 'es');
    }

    public static completeDatePart(datePart: string) {
        return datePart.toString().length === 1 ? `0${datePart}` : datePart;
    }

    public static checkIfIsSafari() {
        return (navigator.userAgent.search('Safari') >= 0 && navigator.userAgent.search('Chrome') < 0);
    }

    /* Sets a color depending on the status of the policy
    * @param status status to confirm
    */
    public static getStatusClass(status: string) {
        switch (status) {
            case 'Grace Period':
                return 'grace-period-status';
            case 'Cancelled':
                return 'canceled-status';
            case 'Lapsed':
                return 'canceled-status';
            case 'Expired':
                return 'canceled-status';
            case 'Pending Payment':
                return 'pending-payment-status';
            case 'Active':
                return 'active-status';
            default:
                return '';
        }
    }

    public static getValueIfIsNumberAndNotNull(value, decimals) {
        const returnValue = (!value && isNumber(value) ? new Intl.NumberFormat('es-Us', {
            minimumFractionDigits: decimals
        }).format(Number(value)) : 0);
        return returnValue;
    }

    public static getSixMonthsPrior(): Date {
        const dateSixMonthsPrior = this.addMonths(new Date(), - 5);
        return new Date(dateSixMonthsPrior.getFullYear(), dateSixMonthsPrior.getMonth(), 1);
    }

    public static getFiveYearsPrior(): Date {
        const dateFiveYearsPrior = this.addYears(new Date(), - 5);
        return new Date(dateFiveYearsPrior.getFullYear(), dateFiveYearsPrior.getMonth(), dateFiveYearsPrior.getDay());
    }

    public static getLastDayMonth(): Date {
        return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    }

    public static addDays(date: Date, days: number) {
        date.setDate(date.getDate() + days);
        return date;
    }

    public static addMonths(date: Date, months: number) {
        date.setMonth(date.getMonth() + months);
        return date;
    }

    public static addYears(date: Date, years: number) {
        date.setFullYear(date.getFullYear() + years);
        return date;
    }

    public static generateRandomId() {
        const min = 1;
        const max = 10000;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static getDateWithoutSpecialCharacters() {
        const today = new Date();
        return `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
    }

    public static getHoursWithoutSpecialCharacters() {
        const today = new Date();
        return `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;
    }

    public static getOnlyDateFromDateTime(date?) {
        if (!date) {
            date = new Date();
        }

        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    public static calculateAge(dob) {
        const fbirth: any = new Date(dob);
        const ftoday: any = new Date();

        const age: number = Math.trunc((ftoday - fbirth) / (1000 * 60 * 60 * 24 * 365));
        return age;
    }

    public static calculateAgeInSpecificDate(dob, specificDate) {
        const fbirth: any = new Date(dob);
        const ftoday: any = new Date(specificDate);

        const age: number = Math.trunc((ftoday - fbirth) / (1000 * 60 * 60 * 24 * 365));
        return age;
    }

    public static generateUUID() { // Public Domain/MIT
        const u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
        const guid = [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
        return guid;
    }


    public static getYearsPrior(years: number): Date {
        const dateFiveYearsPrior = this.addYears(new Date(), - years);
        return new Date(dateFiveYearsPrior.getFullYear(), dateFiveYearsPrior.getMonth(), dateFiveYearsPrior.getDay());
    }

    public static getMeridianTime(time: any) {
        const hour = time.toString().substring(0, time.toString().indexOf(':'));
        const finalhour = +hour > 12 ? hour - 12 : hour;
        const minute = time.substring(time.indexOf(':') + 1, time.length);
        const meridian = +hour > 12 ? 'PM' : 'AM';
        return `${this.completeDatePart(finalhour)}:${this.completeDatePart(minute)} ${meridian}`;
    }

}
