import { Directive, HostListener, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';
import { CustomCurrencyPipe } from '../pipes/currency/custom-currency.pipe';

@Directive({
    selector: '[appCurrencyFormatter]',
    providers: [CustomCurrencyPipe]
})
export class CurrencyFormatterDirective {

    public el: HTMLInputElement;

    constructor(
        private elementRef: ElementRef,
        private currencyPipe: CustomCurrencyPipe
    ) {
        this.el = this.elementRef.nativeElement;
    }

    /**
 * Input flag for indicates true or false for execute directive
 */
    @Input() appCurrencyFormatter: string;

    /**
     * The method triggers when the control is focused
     * @param value value of the control
     */
    @HostListener('focus', ['$event.target.value'])
    onFocus(value: any) {
        this.el.value = this.currencyPipe.parse(value, this.appCurrencyFormatter); // opossite of transform
    }

    /**
     * The method triggers when the control looses its focus
     * @param value value of the control
     */
    @HostListener('blur', ['$event.target.value'])
    public onBlur(value: any) {
        this.el.value = this.currencyPipe.transform(value, this.appCurrencyFormatter);
    }
}
