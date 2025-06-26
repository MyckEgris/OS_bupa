/**
* BlockCopyPasteDirective.ts
*
* @description: Custom directive for restrict copy-cut-paste events in text inputs
* @author Juan Camilo Moreno.
* @version 1.0
* @date 11-10-2018.
*
**/

import { Directive, HostListener } from '@angular/core';

/**
 * Custom directive for restrict copy-cut-paste events in text inputs
 */
@Directive({
    selector: '[appBlockCopyPaste]'
})
export class BlockCopyPasteDirective {

    /**
     * Constructor Method
     */
    constructor() { }

    /**
     * Listen paste emitted event
     * @param e Event
     */
    @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
        e.preventDefault();
    }

    /**
     * Listen copy emitted event
     * @param e Event
     */
    @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
        e.preventDefault();
    }

    /**
     * Listen cut emitted event
     * @param e Event
     */
    @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
        e.preventDefault();
    }
}
