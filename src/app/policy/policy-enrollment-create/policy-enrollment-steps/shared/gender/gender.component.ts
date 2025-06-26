import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html'
})
export class GenderComponent implements OnInit {
  private _step: string;
  private _section: string;
  private _showValidations: boolean;
  /**
   * Genre male class css of policy enrollment step2 section1 component
   */
  GENRE_MALE_CLASS_CSS = 'bp-generoh';
  /**
   * Genre male selected class css of policy enrollment step2 section1 component
   */
  GENRE_MALE_SELECTED_CLASS_CSS = 'bp-generohselected';
  /**
   * Genre femenine class css of policy enrollment step2 section1 component
   */
  GENRE_FEMENINE_CLASS_CSS = 'bp-generom';
  /**
   * Genre femenine selected class css of policy enrollment step2 section1 component
   */
  GENRE_FEMENINE_SELECTED_CLASS_CSS = 'bp-generomselected';
  /**
   * Determines whether femenine css is
   */
  isFemenineCss = 'bp-generom';
  /**
   * Determines whether male css is
   */
  isMaleCss = 'bp-generoh';

  private _formControlNameCustom: string;
  private _wizard: PolicyEnrollmentWizard;

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
    this.setValueGender();
  }

  /**
   * Determines whether event genre on
   * @param event
   */
  onEventGender(event) {
    if (event) {
      if (event.target.className.search(this.GENRE_MALE_CLASS_CSS) !== -1
        && this.isMaleCss !== this.GENRE_MALE_SELECTED_CLASS_CSS) {
        this.isMaleCss = this.GENRE_MALE_SELECTED_CLASS_CSS;
        this.isFemenineCss = this.GENRE_FEMENINE_CLASS_CSS;
        this.getControl(this.formControlNameCustom).setValue(2);
      }

      if (event.target.className.search(this.GENRE_FEMENINE_CLASS_CSS) !== -1
        && this.isFemenineCss !== this.GENRE_FEMENINE_SELECTED_CLASS_CSS) {
        this.isFemenineCss = this.GENRE_FEMENINE_SELECTED_CLASS_CSS;
        this.isMaleCss = this.GENRE_MALE_CLASS_CSS;
        console.log(3);
        this.getControl(this.formControlNameCustom).setValue(3);
      }
    }
    event.stopPropagation();
  }

    /**
   * Sets default value genre
   */
  setValueGender() {
    const genre = this.wizard.enrollmentForm.get(this.step)
      .get(this.section)
      .get(this.formControlNameCustom).value;
    if (genre) {
      if (genre !== '') {
        if (genre === 2) {
          this.wizard.enrollmentForm.get(this.step)
            .get(this.section)
            .get(this.formControlNameCustom)
            .setValue(2);
          this.isMaleCss = this.GENRE_MALE_SELECTED_CLASS_CSS;
        } else {
          this.wizard.enrollmentForm.get(this.step)
            .get(this.section)
            .get(this.formControlNameCustom)
            .setValue(3);
          this.isFemenineCss = this.GENRE_FEMENINE_SELECTED_CLASS_CSS;
        }
      }
    }
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
