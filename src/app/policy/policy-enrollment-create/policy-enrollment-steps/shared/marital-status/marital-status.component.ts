import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
@Component({
  selector: 'app-marital-status',
  templateUrl: './marital-status.component.html'
})
export class MaritalStatusComponent implements OnInit {
  private _step: string;
  private _section: string;
  private _showValidations: boolean;
  private _formControlNameCustom: string;
  private _wizard: PolicyEnrollmentWizard;
  MARITAL_STATUS_UNKNOWN = 5;
  constructor() { }
  @Input()
  set wizard(wizard: PolicyEnrollmentWizard) {
    this._wizard = wizard;
  }

  get wizard(): PolicyEnrollmentWizard {
    return this._wizard;
  }

  @Input()
  set step(name: string) {
    this._step = name;
  }

  get step(): string {
    return this._step;
  }

  @Input()
  set section(name: string) {
    this._section = name;
  }

  get section(): string {
    return this._section;
  }

  @Input()
  set showValidations(value: boolean) {
    this._showValidations = value;
  }

  get showValidations(): boolean {
    return this._showValidations;
  }

  @Input()
  set formControlNameCustom(name: string) {
    this._formControlNameCustom = name;
  }
  get formControlNameCustom(): string {
    return this._formControlNameCustom;
  }
  ngOnInit() {
  }

      /**
   * Gets control
   * @param field
   * @returns formControl
   */
  getControl(field: string): FormControl {
    return this.wizard.enrollmentForm.get(this.step).get(this.section).get(field) as FormControl;
  }
}
