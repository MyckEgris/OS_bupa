/**
* DateDashedDirective.ts
*
* @description: Custom directive for restrict only dashed date format in picker inputs
* @author Juan Camilo Moreno.
* @version 1.0
* @date 05-11-2018.
*
**/

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Custom directive for restrict only dashed date format in picker inputs
 */
@Directive({
  selector: '[appDateDashed]'
})
export class DateDashedDirective {

  /**
   * Contructor Method
   * @param el Access dom element
   */
  constructor(private el: ElementRef) { }

  /**
   * Input flag for indicates true or false for execute directive
   */
  @Input() appDateDashed: boolean;

  /**
   * Captures events from keyboard for restrict alphanumeric and copy-cut-paste events
   * @param event Event
   */
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if (this.appDateDashed) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number [0-9] and [-] and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)
        && (e.keyCode < 189 || e.keyCode > 189) && (e.keyCode < 109 || e.keyCode > 109)) {
        e.preventDefault();
      } else {
        return;
      }
    }
  }
}
