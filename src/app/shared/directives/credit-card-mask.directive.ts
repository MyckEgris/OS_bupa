import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appCreditCardMask]'
})
export class CreditCardMaskDirective {
    mastercardRegex = RegExp(/^5[1-5]/);
    visaRegex = RegExp(/^4/);
    amexRegex = RegExp(/^3[47]/);
    constructor(public ngControl: NgControl) { }

    @HostListener('ngModelChange', ['$event'])
    onModelChange(event) {
      this.onInputChange(event, false);
    }

    @HostListener('keydown.backspace', ['$event'])
    keydownBackspace(event) {
      this.onInputChange(event.target.value, true);
    }

    onInputChange(event, backspace) {
        let newVal = event.replace(/\D/g, '');
        if (backspace && newVal.length <= 12) {
          newVal = newVal.substring(0, newVal.length - 1);
        }
        if (newVal.length === 0) {
          newVal = '';
        } else if (this.mastercardRegex.test(newVal.substring(0, 2))) {
          newVal = this.formatCreditCardCommon(newVal);
        } else if (this.visaRegex.test(newVal)) {
          newVal = this.formatCreditCardCommon(newVal);
        } else if (this.amexRegex.test(newVal)) {
          newVal = this.formatCrediCardAmex(newVal);
        }
        this.ngControl.valueAccessor.writeValue(newVal);
      }

      formatCreditCardCommon(newVal): string {
        if (newVal.length <= 4) {
          newVal = newVal.replace(/^(\d{0,4})/, '$1');
        } else if (newVal.length <= 8) {
            newVal = newVal.replace(/^(\d{0,4})(\d{0,4})/, '$1 $2');
        } else if (newVal.length <= 12 ) {
            newVal = newVal.replace(/^(\d{0,4})(\d{0,4})(\d{0,4})/, '$1 $2 $3');
        } else if (newVal.length <= 16) {
            newVal = newVal.replace(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/, '$1 $2 $3 $4');
        } else {
            newVal = newVal.substring(0, 16);
            newVal = newVal.replace(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/, '$1 $2 $3 $4');
        }
        return newVal;
      }

      formatCrediCardAmex(newVal): string {
        if (newVal.length <= 4) {
          newVal = newVal.replace(/^(\d{0,4})/, '$1');
        } else if (newVal.length <= 8) {
          newVal = newVal.replace(/^(\d{0,4})(\d{0,6})/, '$1 $2');
        } else if (newVal.length <= 12 ) {
          newVal = newVal.replace(/^(\d{0,4})(\d{0,6})(\d{0,5})/, '$1 $2 $3');
        } else if (newVal.length <= 15) {
          newVal = newVal.replace(/^(\d{0,4})(\d{0,6})(\d{0,5})/, '$1 $2 $3');
        } else {
          newVal = newVal.substring(0, 15);
          newVal = newVal.replace(/^(\d{0,4})(\d{0,6})(\d{0,5})/, '$1 $2 $3');
        }
        return newVal;
      }
}
