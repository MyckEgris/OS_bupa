/**
* PolicyAppViewHelper.ts
*
* @description: This class helps to validate through a custom validators
* @author Vanessa Luna
* @version 1.0
* @date 14-01-2019.
*
**/

import { ValidatorFn, AbstractControl } from '@angular/forms';

export class PolicyAppViewHelper {

   /**
   * Custom validation that checks if any value has been entered as a criteria.
   * @param type type we're not validating
   */
    public static checkAnyValueIsEntered(type: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control) {
                if (control.get('policyAppSearchType').value === type) {
                    return null;
                }
                if (!control.get('firstName').value && !control.get('lastName').value
                    && !control.get('policyId').value && !control.get('policyAppNumber').value) {
                    return { anyNameIsRequired: true };
                }
            }
            return null;
        };
    }
}
