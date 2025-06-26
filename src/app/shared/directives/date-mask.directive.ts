import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateMask]'
})
export class DateMaskDirective {

  constructor() { }

  @HostListener('keypress', ['$event']) onKeyPress(event) {

    if (event.target.value.length < 10 && event.keyCode !== 8) {

      if ( event.target.value.length === 2 || event.target.value.length === 5) {
        if ( event.keyCode !== 8) {
          event.target.value = event.target.value + '/';
        }
      }
    } else {
      event.preventDefault();
    }

  }
}
