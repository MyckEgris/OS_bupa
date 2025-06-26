/**
* CustomDatePickerComponent.ts
*
* @description: Custom datepicker extends from NgbDatePicker
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @author Enrique durango
* @version 1.0
* @date 10-10-2018.
* @dateModified 2019-11-23
*
**/

import { Component, OnInit, Input, OnChanges, forwardRef, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Utilities } from '../../util/utilities';
import { NgbInputDatepicker, NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import * as moment from 'moment';

/**
 * Custom datepicker extends from NgbDatePicker
 */
@Component({
  selector: 'app-datepicker-wrapper',
  templateUrl: './datepicker-wrapper.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatepickerWrapperComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DatepickerWrapperComponent), multi: true }
  ]
})
export class DatepickerWrapperComponent implements OnInit, ControlValueAccessor, OnChanges {

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
   * Input  of datepicker wrapper component
   */
  @Input('hasErrors') hasErrors: boolean;

  /**
   * Input  of datepicker wrapper component
   */
  @Input('showValidations') showValidations: boolean;

  /**
   * Input  of datepicker wrapper component
   */
  @Input('validateError') validateError: boolean;
  @Input() markDisabledCustom: (date: NgbDateStruct, current: { year: number;    month: number; }) => boolean;
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
   * Regexone  of datepicker wrapper component. Match format dd-mm-yyyy
   */
  regexone = '^(3[01]|[12][0-9]|0[1-9])-(1[0-2]|0[1-9])-[0-9]{4}$';
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
    if (changes.minDate && changes.minDate.currentValue) {
      this.picker.minDate = { year: this.minDate.getFullYear(), month: this.minDate.getMonth() + 1, day: this.minDate.getDate() };
    }
    if (changes.maxDate && changes.maxDate.currentValue) {
      this.picker.maxDate = { year: this.maxDate.getFullYear(), month: this.maxDate.getMonth() + 1, day: this.maxDate.getDate() };
    }
    this.propagateChange(this.dateValue);
  }

  ngOnInit(): void {
    if (!this.picker.minDate) {
      this.picker.minDate = { year: 1901, month: 1, day: 1 };
    }
    if (this.dateValue) {
      this.dateInput.nativeElement.value = this.dateValue;
      this.propagateChange(this.dateValue);
    }
    this.picker.markDisabled = this.markDisabledCustom;
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
  if (!this.validateError) {
      return (!this.error ? null : { valid: true });
    } else {
      return (!this.error ? null : null);
    }
  }

  /**
   * Actions for date selected
   * Javacript ISO Dates
   * Separate date and time with a capital T
   * Indicate UTC time with a capital Z
   * @param date Date
   */
  async dateSelect(date: { year: any; month: any; day: any; }) {
    this.error = null;
    const formatPromise = await this.translate.get(this.DASH_FORMAT).toPromise();
    const formatTranslated: string = formatPromise.toString().toUpperCase();
    // const month = `${date.month}`.padStart(2, '0'); Doesnt work in IE
    // const day = `${date.day}`.padStart(2, '0');     Doesnt work in IE
    const month = ('0' + date.month).slice(-2);
    const day = ('0' + date.day).slice(-2);
    const dateTimeFormatted = moment(`${date.year}-${month}-${day}`).format(formatTranslated);
    this.dateValue = moment(dateTimeFormatted, formatTranslated).toDate();
    this.propagateChange(this.dateValue);
  }

  /**
   * Entablish changes manually
   * @param e Event
   */
  async dateManualChange(e) {
    this.error = null;
    if (e.target.value !== '') {
      const formatPromise = await this.translate.get(this.DASH_FORMAT).toPromise();
      const formatTranslated: string = formatPromise.toString().toUpperCase();
      const regex = RegExp(this.regexone);
      const isValidValue = regex.test(e.target.value);
      const isValidDate = moment(e.target.value, formatTranslated, true).isValid();
      if (isValidValue && isValidDate) {
        this.error = null;
        this.dateValue = this.error ? undefined : moment(e.target.value, formatTranslated).toDate();
      } else {
        this.dateValue  = undefined;
        this.previousValue = e.target.value;
        this.error = { formatError: false };
      }
    } else {
      this.dateValue = e.target.value;
    }

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
    // Logic specyfic for field since date (policyApplicationSinceDate) (Fecha de Cobertura de la póliza)
    if (typeof this.markDisabledCustom === 'function') {
      if (this.dateValue.getDate() !== 1 || this.dateValue.getDate() !== 15) {
        await Utilities.delay(10);
        this.dateValue = undefined;
      }
    }
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
