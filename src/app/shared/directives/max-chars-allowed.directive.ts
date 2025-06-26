/**
* OnlyNumberDirective.ts
*
* @description: Custom directive for restrict only numbers in text inputs
* @author Arturo Suarez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 11-10-2018.
*
**/

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Custom directive for restrict only numbers in text inputs
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[maxCharsAllowed]'
})
export class MaxCharsAllowedDirective {

  /**
   * Contructor Method
   * @param el Access dom element
   */
  constructor(private el: ElementRef) { }

  /**
   * Input number which is the max length allowed
   */
  @Input('maxCharsAllowed') maxCharsAllowed: number;

  /**
   * Captures events from keyboard for restrict alphanumeric and copy-cut-paste events
   * @param event Event
   */
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;
    const control = (this.el.nativeElement as HTMLInputElement);
    const currentLength = control.value.length;
    const numMaxCharsAllowed = +this.maxCharsAllowed;
    if (currentLength >= numMaxCharsAllowed) {

      if ([46, 9, 8].indexOf(e.keyCode) !== -1 ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
      }
        e.preventDefault();
    }
  }

  /**
   * Captures events blur to trim the value of the control to the max lenght allowed
   * @param event Event
   */
  @HostListener('blur', ['$event.target.value']) onBlur(event) {
    const e = <KeyboardEvent>event;
    const control = (this.el.nativeElement as HTMLInputElement);
    const currentLength = control.value.length;
    const numMaxCharsAllowed = +this.maxCharsAllowed;
    if (currentLength >= numMaxCharsAllowed) {
      (this.el.nativeElement as HTMLInputElement).value = control.value.substring(0, this.maxCharsAllowed);
    }
  }
}
