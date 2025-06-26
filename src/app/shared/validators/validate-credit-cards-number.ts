import { AbstractControl } from '@angular/forms';
export function ValidateCreditCardNumber(control: AbstractControl) {
    const mastercardRegex = RegExp(/^5[1-5]/);
    const visaRegex = RegExp(/^4/);
    const amexRegex = RegExp(/^3[47]/);
    if (!mastercardRegex.test(control.value) ||
        !visaRegex.test(control.value) ||
        !amexRegex.test(control.value)) {
      return { incorrectCreditCardNumber: true };
    }
    return null;
}
