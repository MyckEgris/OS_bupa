import { Component, Input } from '@angular/core';
import { BaseControl } from '../../services/dynamic-forms/entities/base.control';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent {

  @Input() control: BaseControl<any>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.control.key].valid; }

  constructor() { }
}
