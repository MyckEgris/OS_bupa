/**
* CustomDatePickerComponent.ts
*
* @description: Custom datepicker extends from NgbDatePicker
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component, OnInit, Input, OnChanges, forwardRef, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Utilities } from '../../util/utilities';
import { NgbInputDatepicker, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import * as moment from 'moment';

/**
 * Custom datepicker extends from NgbDatePicker
 */
@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustomDatePickerComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CustomDatePickerComponent), multi: true }
  ]
})
export class CustomDatePickerComponent implements OnInit, ControlValueAccessor, OnChanges {

  /**
   * Input with date value
   */
  @Input('dateValue') dateValue: Date;

  /**
   * restrict Min date
   */
  @Input('minDate') minDate: Date;

  /**
   * Restrict Max date
   */
  @Input('maxDate') maxDate: Date;

  /**
   * Is disable
   */
  @Input('isDisable') isDisable = false;

  /***
   * Is isDisableOnlyInput
   */
  @Input('isDisableOnlyInput') isDisableOnlyInput = false;

  /**
   * Date input
   */
  @ViewChild('dateInput') dateInput;

  /**
   * NgbInputDatePicker
   */
  @ViewChild('d') picker: NgbInputDatepicker;

  /**
   * Formatted Value
   */
  public formattedValue: string;

  /**
   * Flag for disable input
   */
  // public disabled: boolean;

  /**
   * Detect control Error
   */
  public error: any;

  /**
   * Aux for previous value
   */
  previousValue: string;

  /**
   * Translate key for date format according selected language
   */
  private DASH_FORMAT = 'APP.DATE_FORMAT_DASH';

  /**
   * Emit changes
   */
  propagateChange: any = () => { };

  /**
   * Validate
   */
  validateFn: any = () => { };

  onTouched = () => { };

  /**
   * Contructor Method
   * @param translate Translate Service Injection
   */
  constructor(private translate: TranslateService) { }

  /**
   * Init control with min and max date restrictions
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.minDate) {
      this.picker.minDate = { year: this.minDate.getFullYear(), month: this.minDate.getMonth() + 1, day: this.minDate.getDate() };
    }
    if (changes.maxDate) {
      this.picker.maxDate = { year: this.maxDate.getFullYear(), month: this.maxDate.getMonth() + 1, day: this.maxDate.getDate() };
    }
    this.propagateChange(this.dateValue);
  }

  ngOnInit(): void {
    if (!this.picker.minDate) {
      this.picker.minDate = {year: 1901 , month: 1 , day: 1};
    }
    if (this.dateValue) {
      this.dateInput.nativeElement.value = this.dateValue;
      this.propagateChange(this.dateValue);
    }
  }

  /**
   * Implementation for writeValue
   * 02-JUL se comenta date = this.dateValue porque cuando se pone el valor en null no limpia el campo
   */
  writeValue(date) {
      // date = this.dateValue;
      if (date) {
        if (date instanceof Date) {
          this.dateValue = date;
        } else {
          this.dateValue = new Date(date.year, date.month - 1, date.day);
        }
      } else {
        this.dateValue = undefined;
      }
  }

  /**
   * Implementation for Register on changes
   * @param fn Callback
   */
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  /**
   * Implementation for Register on Touched
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled control
   * @param isDisabled disable param
   */
  setDisabledState(isDisabled: boolean) {
    this.isDisable = isDisabled;
  }

  /**
   * Set disabled control
   * @param isDisabled disable param
   */
  setDisabledOnlyInput(isDisableOnlyInput: boolean) {
    this.isDisableOnlyInput = isDisableOnlyInput;
  }

  /**
   * Implementation for validate
   * @param c Control
   */
  validate(c: FormControl) {
    if (this.error) {
      Utilities.delay(10)
        .then(() => this.dateInput.nativeElement.value = this.previousValue);
    }
    return (!this.error ? null : { valid: false });
  }

  /**
   * Actions for date selected
   * @param date Date
   */
  dateSelect(date) {
    this.error = null;
    this.dateValue = new Date(date.year, date.month - 1, date.day);
    this.propagateChange(this.dateValue);
  }

  /**
   * Entablish changes manually
   * @param e Event
   */
  async dateManualChange(e) {
    this.error = null;
    let format = await this.translate.get(this.DASH_FORMAT).toPromise();
    format = format.split('-');
    const valueArray = e.target.value.split('-');
    const indexArray = [
      valueArray[format.indexOf('yyyy')],
      valueArray[format.indexOf('MM')],
      valueArray[format.indexOf('dd')]
    ];
    if (format.length !== valueArray.length) {
      this.previousValue = e.target.value;
      this.error = { formatError: false };
    } else {
      for (let i = 0; i < indexArray.length; i++) {
        if (format[i].length !== valueArray[i].length) {
          this.previousValue = e.target.value;
          this.error = { formatError: false };
          break;
        }
      }
    }

    this.dateValue = this.error ? undefined : new Date(indexArray.join('/'));
    if (this.dateValue) {
      if (this.maxDate && this.dateValue.getTime() > this.maxDate.getTime()) {
        await Utilities.delay(10);
        this.dateValue = this.maxDate;
      }

      if (this.minDate && this.dateValue.getTime() < this.minDate.getTime()) {
        await Utilities.delay(10);
        this.dateValue = this.minDate;
      }
    }
    if (this.error) {
      Utilities.delay(100).then(() => {
        this.dateInput.nativeElement.value = e.target.value;
      });
    }
    // this.setCalendarDate(this.picker, this.dateValue);
    this.propagateChange(this.dateValue);
  }

  setCalendarDate(picker: NgbInputDatepicker, date: Date) {
    if (date) {
      picker.navigateTo(
        new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
      );
    }
  }

}
