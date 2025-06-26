import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseControl } from './entities/base.control';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormsService {

  constructor() { }

  buildFormGroup(controls: BaseControl<any>[]) {
    const group: any = {};

    controls.forEach(control => {
      group[control.key] =
        control.required ? new FormControl(control.value || '', Validators.required) : new FormControl(control.value || '');
    });

    return new FormGroup(group);
  }

}
