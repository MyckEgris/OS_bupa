import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MeasurementConversionService } from 'src/app/shared/services/policy-application/helpers/measurement-conversion.service';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
// tslint:disable-next-line: max-line-length
@Component({
  selector: 'app-weight-height-basic',
  templateUrl: './weight-height-basic.component.html'
})
export class WeightHeightBasicComponent implements OnInit {
  private _step: string;
  private _section: string;
  private _showValidations: boolean;
  private _formControlNameSystemMeasure: string;
  private _formControlNameHeight: string;
  private _formControlNameWeight: string;
  private _wizard: PolicyEnrollmentWizard;
  private CONST_REQUIRED = 'required';
  private _currentSection: Section;
  private _twoDecimal = 2;
  constructor( private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private measurementConversionService: MeasurementConversionService) { }

  ngOnInit() {
  }

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

  @Input()
  set currentSection(currentSection: Section) {
    this._currentSection = currentSection;
  }

  get currentSection(): Section {
    return this._currentSection;
  }

  getControl(field: string): FormControl {
    return this.wizard.enrollmentForm.get(this.step)
    .get(this.section)
    .get(field) as FormControl;
  }

    /**
   * Determines whether field required is
   * @param field form of control
   * @returns true or false
   */
  isFieldRequired(field: string) {
    if (this.wizard.enrollmentForm.get(this.step)
      .get(this.section)
      .get(field).hasError(this.CONST_REQUIRED)) {
      return true;
    } else {
      return false;
    }
  }
    /**
   * Gets validator value
   * @param controlName
   * @param validator
   * @returns validators associated to form control from view template
   */
  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }
  /**
   * Gets validator message
   * @param controlName
   * @param validator
   * @returns the message associated to validator of a form control from view template
   */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  /**
   * Converts from kg to pound (3 kilos-metros)
   * @param formControlName
   */
  convertFromKgToPound() {
    const weightInPound = this.measurementConversionService.convertKgToPound(this.getControl(this.formControlNameWeight).value);
    this.getControl(this.formControlNameWeight).setValue(weightInPound.toFixed(this.twoDecimal));
  }
  /**
   * Converts from pount to kg (4 libras-metros)
   * @param formControlName
   */
  convertFromPoundToKg() {
    const weightInKg = this.measurementConversionService.convertPoundToKg(this.getControl(this.formControlNameWeight).value);
    this.getControl(this.formControlNameWeight).setValue(weightInKg.toFixed(this.twoDecimal));
  }

  get twoDecimal(): number {
    return this._twoDecimal;
  }
}
