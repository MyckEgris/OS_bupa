import { Directive, HostListener, ElementRef, OnInit, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Directive({ selector: '[appFormatValue]' })
export class FormatValueDirective implements OnInit {

    @Input('isPremiums') isPremiums: boolean;
    @Input('currencySymbol') currencySymbol: any;

    private el: HTMLInputElement;
    private currencyPipe: CurrencyPipe;

    constructor(
        private elementRef: ElementRef
    ) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnInit() {
        if (this.isPremiums) {
            this.el.value = this.currencyPipe.transform(this.el.value, this.currencySymbol);
        }
    }
}
