/**
* DisableControlDirective.ts
*
* @description: Custom directive for enable or disable control according condition
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-06-2019.
*
**/

import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDisableControl]'
})
export class DisableControlDirective {

  @Input() set appDisableControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]();
  }

  constructor(private ngControl: NgControl) {
  }

}
