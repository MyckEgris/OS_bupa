/**
* OnlyLettersDirective.ts
*
* @description: Custom directive for restrict only letters in text inputs
* @author Juan Camilo Moreno.
* @version 1.0
* @date 05-11-2018.
*
**/

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Custom directive for restrict only letters in text inputs
 */
@Directive({
  selector: '[appOnlyLetters]'
})
export class OnlyLettersDirective {

  /**
   * Contructor Method
   * @param el Access dom element
   */
  constructor(private el: ElementRef) { }

  /**
   * Input flag for indicates true or false for execute directive
   */
  @Input() appOnlyLetters: boolean;

  /**
   * Captures events from keyboard for restrict alphanumeric and copy-cut-paste events
   * @param event Event
   */
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if (this.appOnlyLetters) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||

        (e.keyCode === 81 || (e.altKey || e.metaKey)) ||

        (e.keyCode === 18 || (e.altKey || e.metaKey)) ||

        // Allow space
        (e.keyCode === 32 || (e.altKey || e.metaKey)) ||

        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is an alphabet letter [a-z] and stop the keypress
      if ((e.shiftKey || (e.keyCode < 65 || e.keyCode > 90))) {
        e.preventDefault();
      }
    }
  }
}
