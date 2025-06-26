import { Pipe, PipeTransform } from '@angular/core';

const PADDING = '000000';

@Pipe({ name: 'customCurencyPipe' })
export class CustomCurrencyPipe implements PipeTransform {

    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;

    constructor() {
        this.DECIMAL_SEPARATOR = '.';
        this.THOUSANDS_SEPARATOR = ',';
    }


    /**
     * removes the dollar formatting so the user can edit the value
     * @param value the current value of the input
     * @param fractionSize decimals to be removed
     */
    transform(value: number | string, currency: string = '', fractionSize: number = 2): string {
        let [integer, fraction = ''] = (value || '').toString()
            .split(this.DECIMAL_SEPARATOR);

        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : '';

        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

        return currency + integer + fraction;
    }

    /**
     * Converts the entered amount into dollar format
     * @param value amount entered
     * @param fractionSize decimals allowed.
     */
    parse(value: string, currency: string = '', fractionSize: number = 2): string {
        if (value != null) {
            value = value.replace(currency, '');
        }
        let [integer, fraction = ''] = (value || '').split(this.DECIMAL_SEPARATOR);

        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');

        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : '';

        return integer + fraction;
    }
}
