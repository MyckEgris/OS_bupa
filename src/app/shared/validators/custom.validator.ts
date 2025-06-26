import * as moment from 'moment';
/**
* custom-validator.ts
*
* @description: This class has custom validators that will be applied on Online Services' forms.
* @author Ivan Hidalgo.
* @version 1.0
* @date 26-10-2018.
*
**/

import { AbstractControl, ValidatorFn, FormGroup, FormControl } from '@angular/forms';
import { format } from 'url';
import { Utilities } from '../util/utilities';

/**
 * This class has custom validators that will be applied on Online Services' forms.
 */
export class CustomValidator {

    /**
     *  Validates password pattern.
     * @param password Password form element.
     */
    static passwordPatternValidator(password): any {
        if (password.pristine) {
            return null;
        }

        const PASSWORD_REGEXP = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&)(\-?@])(?=^\S*$)[A-Za-z\d\D].{7,11}/;
        const PASSWORD_WHITELIST = /[^a-z^A-Z^0-9!#$%&()\-?@]+/;
        password.markAsTouched();
        if (PASSWORD_WHITELIST.test(password.value)) {
            return {
                'invalidPassword': true
            };
        }

        if (PASSWORD_REGEXP.test(password.value)) {
            return null;
        }
        return {
            'invalidPassword': true
        };
    }

    /**
     * Validates that two elements, which were defined in the same form, have the same value.
     * @param formGroup Form Grup element that contains both elements.
     * @param fieldToCompare Field that will be compared.
     * @param fieldToBeConfirmed Field which has the same value that the first one.
     */
    static elementsMatch(fieldToCompare: string, fieldToBeConfirmed: string): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
            const elementToCompare = formGroup.get(fieldToCompare);
            const elementToBeConfirmed = formGroup.get(fieldToBeConfirmed);
            if (elementToCompare.value !== elementToBeConfirmed.value) {
                return { 'match': true };
            }
            return null;
        };
    }

    /**
     * Validates the amount of the input is not higher than the max amount, or lower/equal to 0
     * @param maxAmount The amount the validator will compare against
     */
    static maxAmountExceeded(maxAmount: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value > maxAmount || control.value <= 0) {
                return { 'maxAmountExceeded': true };
            }
            return null;
        };
    }

    /**
     * Validates that an initial date is less than the end date, and returns a custom validate field
     * @param startDate Start date
     * @param endDate End date
     * @param validatorField Response field
     */
    static startDateLessThanEndDate(startDate: string, endDate: string, validatorField: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const dateStart = c.get(startDate).value;
            const dateEnd = c.get(endDate).value;
            if ((dateStart !== null && dateEnd !== null) && dateStart > dateEnd) {
                return validatorField;
            }
            return null;
        };
    }

    static startDateLessThanEndDateGroup(startDate: string, endDate: string): ValidatorFn {
        return (g: FormGroup): { [key: string]: any } => {
            try {
                const dateStart = new Date(g.controls[startDate].value);
                const dateEnd = new Date(g.controls[endDate].value);
                const dateStart1 = Utilities.getOnlyDateFromDateTime(dateStart);
                const dateEnd1 = Utilities.getOnlyDateFromDateTime(dateEnd);
                if ((dateStart !== null && dateEnd !== null) && dateStart1 > dateEnd1) {
                    return {
                        dates: 'Date from should be less than Date to'
                    };
                }
            } catch (ex) {
                return null;
            }

            return null;
        };
    }

    /**
     * Validates only alphabet letters, upper or lower case
     * @param input Input to apply validator
     * @param validatorField Response field
     */
    static onlyInt(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value === null || control.value === '') {
                return null;
            }
            if (!Number.isInteger(control.value)) {
                return { 'isNaN': true };
            }
            if (control.value > 2147483647 || control.value <= 0) {
                return { 'maxAmountExceeded': true };
            }
            return null;
        };
    }


    /**
     *  Validates password pattern.
     * @param email email form element.
     */
    static emailPatternValidator(email): any {
        if (email.pristine) {
            return null;
        }

        if (!email.value) {
            return null;
        }

        // tslint:disable-next-line:max-line-length
        const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        email.markAsTouched();


        if (EMAIL_REGEXP.test(email.value)) {
            return null;
        }
        return {
            'invalidEmail': true
        };
    }

    /**
     * this method validate phone format
     * @param phoneNumber phone number param
     */
    static phoneNumberPatternValidator(phoneNumber): any {
        if (phoneNumber.pristine) {
            return null;
        }

        if (!phoneNumber.value) {
            return null;
        }

        // tslint:disable-next-line:max-line-length
        const PHONENUMBER_REGEXP = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\s?\d{1,14}$/;
        phoneNumber.markAsTouched();


        if (PHONENUMBER_REGEXP.test(phoneNumber.value)) {
            return null;
        }
        return {
            'invalidPhoneNumber': true
        };
    }

    // Validates US phone numbers
    static phoneValidator(number): any {
        if (number.pristine) {
            return null;
        }
        const PHONE_REGEXP = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
        number.markAsTouched();
        if (PHONE_REGEXP.test(number.value)) {
            return null;
        }
        return {
            invalidNumber: true
        };
    }

    // Validates zip codes
    static zipCodeValidator(zip): any {
        if (zip.pristine) {
            return null;
        }
        const ZIP_REGEXP = /^[0-9]{5}(?:-[0-9]{4})?$/;
        zip.markAsTouched();
        if (ZIP_REGEXP.test(zip.value)) {
            return null;
        }
        return {
            invalidZip: true
        };
    }

    /**
    * validate if the date picker component return a correct value
    * @param control
    */
    static datePickerValidator(control: AbstractControl) {
        if (JSON.stringify(control.value) !== 'null') {
            return null;
        } if (isNaN(control.value)) {
            return { 'isNaN': true };
        } else {
            return { existe: true };
        }
    }


    /**
    * validate if the date picker date value is between 18-74 years old
    * @param dateValue
    */
    static dateValueRange(dateValue: AbstractControl) {
        const actualDate = Date.now();
        const actualAge = moment(actualDate).diff(dateValue.value, 'year');
        if (actualAge >= 18 && actualAge <= 74) {
            return null;
        } else {
            return { 'invalidDateRange': true };
        }
    }

    /**
     * Determines whether an adult age
     * @param selectedDate
     * @returns
     */
    static isAnAdultAge(selectedDate: AbstractControl) {
        const currentDate = Date.now();
        const ageDiff = moment(currentDate).diff(selectedDate.value, 'year');
        if (ageDiff < 18) {
             return { 'invalidAdultAge': true };
        } else {
            return null;
        }
     }

    /**
     * Constrainst to avoid policy application for people greater than 75 years old
     * @param selectedDate
     * @returns
     */
    static ageRangePolicy(selectedDate: AbstractControl) {
       const currentDate = Date.now();
       const ageDiff = moment(currentDate).diff(selectedDate.value, 'year');
       if (ageDiff >= 75) {
            return { 'invalidAgeRangePolicy': true };
       } else {
           return null;
       }
    }

    /**
     * Limitations to validate the application of policies for the elderly 65
     * @param selectedDate
     * @returns
     */
    static ageRangeMedicalPolicy(selectedDate: AbstractControl) {
        const currentDate = Date.now();
        const ageDiff = moment(currentDate).diff(selectedDate.value, 'year');
        if (ageDiff >= 65 && ageDiff <= 74) {
             return { 'invalidAgeRangeMedicalPolicy': true };
        } else {
            return null;
        }
     }

    /**
     * Constraint to avoid dependents older than 24 in policy application
     * @param selectedDate
     * @returns
     */
    static ageRangePolicyDependents(selectedDate: AbstractControl) {
        const currentDate = Date.now();
        const ageDiff = moment(currentDate).diff(selectedDate.value, 'year');
        if (ageDiff >= 24) {
             return { 'invalidAgeRangePolicyDependents': true };
        } else {
            return null;
        }
     }

    /**
     * Avoid to selecte date less than current date
     * @param selectedDate
     * @returns
     */
    static insuranceCoverageDate(selectedDate: AbstractControl) {
        const currentDate = Date.now();
        const dateDiff = moment(currentDate).diff(selectedDate.value, 'day');
        if (dateDiff <= 0) {
            return null;
        }

        if (dateDiff < currentDate) {
            return { 'invalidCoverageDate': true };
        }
    }

    /**
     *  Validates email pattern separated by semicolon.
     * @param email email form element.
     */
    static emailPatternValidatorSeparatedBySemicolon(email): any {
        if (email.pristine) {
            return null;
        }

        if (!email.value) {
            return null;
        }

        // tslint:disable-next-line:max-line-length
        const EMAIL_REGEXP = /^([\w+-.%]+@[\w.-]+\.[A-Za-z]{2,4})(;[\w+-.%]+@[\w.-]+\.[A-Za-z]{2,4})*$/;
        email.markAsTouched();


        if (EMAIL_REGEXP.test(email.value)) {
            return null;
        }
        return {
            'invalidEmail': true
        };
    }

    /**
     *  Validates password pattern.
     * @param password Password form element.
     */
     static passwordCustomPatternValidator(regex: string): any {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.pristine) {
          return null;
      }

      const PASSWORD_REGEXP = new RegExp(regex);
      control.markAsTouched();

      if (PASSWORD_REGEXP.test(control.value)) {
          return null;
      }
      return {
          'invalidPassword': true
      };
    };

  }
}
