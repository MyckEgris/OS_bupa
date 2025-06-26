import { Component, OnInit, Input } from '@angular/core';
import { Options } from 'ng5-slider';
import { FormControl } from '@angular/forms';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
@Component({
  selector: 'app-weight-height',
  templateUrl: './weight-height.component.html'
})
export class WeightHeightComponent implements OnInit {
  private _step: string;
  private _section: string;
  private _showValidations: boolean;
  private _formControlNameSystemMeasure: string;
  private _formControlNameHeight: string;
  private _formControlNameWeight: string;
  _wizard: PolicyEnrollmentWizard;
  MTS = 'mts';
  KG = 'Kg';
  LB = 'Lb';
  BASE_100 = 100;
  MEASURE_CHECKED_DEFAULT = 3; // 3-kilos-metros, 4-libras-metros
  MEASURE_CONSTANT_CONVERSION = 0.454;

      /**
   * Options height of policy enrollment
   */
  optionsHeight: Options = {
    floor: 0,
    ceil: 300,
    translate: (value: number): string => {
      return `${(value / this.BASE_100)} ${this.MTS}`;
    }
  };

    /**
   * Options weight of policy enrollment
   */
  optionsWeight: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number): string => {
      const weight = +this.wizard.enrollmentForm.get(this.step)
        .get(this.section)
        .get(this.formControlNameSystemMeasure)
        .value;
      if (weight === this.MEASURE_CHECKED_DEFAULT) {
        return `${(value * this.MEASURE_CONSTANT_CONVERSION).toFixed(2)} ${this.KG}`;
      } else {
        return `${(value / this.MEASURE_CONSTANT_CONVERSION).toFixed(2)} ${this.LB}`;
      }
    }
  };

  constructor() { }

  ngOnInit() {}

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
  set formControlNameSystemMeasure(name: string) {
    this._formControlNameSystemMeasure = name;
  }

  get formControlNameSystemMeasure(): string {
    return this._formControlNameSystemMeasure;
  }

  @Input()
  set formControlNameHeight(name: string) {
    this._formControlNameHeight = name;
  }

  get formControlNameHeight(): string {
    return this._formControlNameHeight;
  }

  @Input()
  set formControlNameWeight(name: string) {
    this._formControlNameWeight = name;
  }

  get formControlNameWeight(): string {
    return this._formControlNameWeight;
  }

    /**
   * Determines whether field value greater than cero is
   * @param field of form control
   * @returns true or false
   */
  isFieldValueGreaterThanCero(field: string) {
    if (this.wizard.enrollmentForm.get(this.step)
      .get(this.section)
      .get(field).value > 0) {
      return true;
    } else {
      return false;
    }
  }

  getControl(field: string): FormControl {
    return this.wizard.enrollmentForm.get(this.step)
    .get(this.section)
    .get(field) as FormControl;
  }

}
