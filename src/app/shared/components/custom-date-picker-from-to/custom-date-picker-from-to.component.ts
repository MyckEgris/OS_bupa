/**
* CustomDatePickerFromToComponent.ts
*
* @description: Custom range datepicker.
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 11-10-2018.
*
**/

import {
  Component,
  OnInit,
  Input,
  OnChanges,
  forwardRef,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgbDatepicker, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { Utilities } from './../../util/utilities';

/**
 * result date picker object
 */
export interface DatePickerValue {

  /**
   * Init date
   */
  dateFrom: Date;

  /**
   * End date
   */
  dateTo: Date;
}

/**
 * Custom range datepicker.
 */
@Component({
  selector: 'app-custom-date-picker-from-to',
  templateUrl: './custom-date-picker-from-to.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDatePickerFromToComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomDatePickerFromToComponent),
      multi: true
    }
  ]
})
export class CustomDatePickerFromToComponent
  implements OnInit, ControlValueAccessor, OnChanges {

  /**
   * Input for date value
   */
  @Input('dateValue')
  public dateValue: DatePickerValue;

  /**
   * Input for placeholder
   */
  @Input('placeholderkey')
  public placeholderkey: string;

  @Input('bothmandatory')
  public bothmandatory = false;

  /**
   * Access to native dom date input 'FROM' control
   */
  @ViewChild('dateInputFrom')
  public dateInputFrom;

  /**
   * Access to native dom date input 'TO' control
   */
  @ViewChild('dateInputTo')
  public dateInputTo;

  /**
   * Access to native dom date calendar 'FROM' control
   */
  @ViewChild('pickerFrom')
  public pickerFrom: NgbDatepicker;

  /**
   * Access to native dom date calendar 'TO' control
   */
  @ViewChild('pickerTo')
  public pickerTo: NgbDatepicker;

  /**
   * Flag to show popup
   */
  public showPopup: boolean;

  /**
   * Value format
   */
  public formattedValue: string;

  /**
   * Flag for disable control
   */
  public disabled: boolean;

  /**
   * Error
   */
  public error: any;

  /**
   * maxDatePickerFrom
   */
  public maxDatePickerFrom: any;

  /**
   * maxDatePickerTo
   */
  public maxDatePickerTo: any;

  /**
   * minDatePickerFrom
   */
  public minDatePickerFrom: any;

  /**
   * minDatePickerTo
   */
  public minDatePickerTo: any;

  /**
   * Auxiliar for see previous value
   */
  public previousValue: string;

  /**
   * Shows message when only a date was selected
   */
  public oneSelectedDateMessage: string;

  /**
   * Translate key for dash date format
   */
  private DASH_FORMAT = 'APP.DATE_FORMAT_DASH';

  /**
   * Auxiliar date picker control
   */
  private tempDateValue: DatePickerValue;

  /**
   * Function to show changes in range of dates
   */
  propagateChange: any = () => { };

  /**
   * Validate
   */
  validateFn: any = () => { };

  /**
   * Constructor Method
   * @param translate Translate Service Injection
   */
  constructor(
    private translate: TranslateService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.getCurrentDateInPickerFormat();
    this.reset();
  }

  /**
   * Events registered on picker changes
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges) {
    this.propagateChange(this.dateValue);
  }

  /**
   * Implementation of ControlValueAccessor writeValue function
   * Writes a new value to the element.
   * @param date Value entered in DatePicker object
   */
  writeValue(date) {
    if (date) {
      if (date instanceof Date) {
        this.dateValue = { dateFrom: date, dateTo: undefined };
      } else if (date instanceof Array) {
        if (date.length >= 1) {
          this.dateValue = { dateFrom: date[0], dateTo: undefined };
        }
        if (date.length > 1) {
          this.dateValue.dateTo = date[1];
        }
      } else {
        this.dateValue = { dateFrom: date.dateFrom, dateTo: date.dateTo };
      }
    } else {
      this.dateValue = { dateFrom: undefined, dateTo: undefined };
    }
    this.setCalendarDate(this.pickerFrom, this.dateValue.dateFrom);
    this.setCalendarDate(this.pickerTo, this.dateValue.dateTo);
  }

  /**
   * Implementation of ControlValueAccessor registerOnChange function
   * Registers a callback function that should be called when the control receives a blur event.
   * @param fn Callback function
   */
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  /**
   * Implementation of ControlValueAccessor registerOnTouched function
   */
  registerOnTouched() { }

  /**
   * Implementation of ControlValueAccessor setDisabledState function
   * This function is called by the forms API when the control status changes to
   * or from "DISABLED". Depending on the value, it should enable or disable the
   * appropriate DOM element.
   * @param isDisabled Boolean isDisabled
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  /**
   * Handle validate control for formValidation
   * @param c FormControl
   */
  validate(c: FormControl) {
    return this.error;
  }

  /**
   * Implements select event of ngb-datepicker control for 'From' date
   * @param date Start date for range picker
   */
  selectFrom(date) {
    this.dateValue.dateFrom = new Date(date.year, date.month - 1, date.day);
    this.minDatePickerTo = Utilities.getDateNowForDatePicker(this.dateValue.dateFrom);
  }

  /**
   * Implements select event of ngb-datepicker control for 'To' date
   * @param date Final date for range picker
   */
  selectTo(date) {
    this.dateValue.dateTo = new Date(date.year, date.month - 1, date.day);
    this.maxDatePickerFrom = Utilities.getDateNowForDatePicker(this.dateValue.dateTo);
  }

  /**
   * OnChange event for input passed in dateTarget
   * @param e Captured event
   * @param dateTarget input that change content
   */
  async dateManualChange(e, dateTarget) {
    this.error = null;
    let format = await this.translate.get(this.DASH_FORMAT).toPromise();
    format = format.split('-');
    const valueArray = e.target.value.split('-');
    const indexArray = [
      valueArray[format.indexOf('yyyy')],
      valueArray[format.indexOf('MM')],
      valueArray[format.indexOf('dd')]
    ];
    for (let i = 0; i < indexArray.length; i++) {
      if (format[i].length !== valueArray[i].length) {
        this.previousValue = e.target.value;
        this.error = { formatError: false };
        break;
      }
    }
    if (dateTarget === 1) {
      this.dateValue.dateFrom = this.error
        ? undefined
        : new Date(indexArray.join('/'));

      if (this.dateValue.dateTo) {
        if (this.dateValue.dateFrom < this.dateValue.dateTo) {
          this.setCalendarDate(this.pickerFrom, this.dateValue.dateFrom);
        } else {
          this.dateValue.dateFrom = undefined;
          this.dateInputFrom.nativeElement.value = '';
        }
      } else {
        this.setCalendarDate(this.pickerFrom, this.dateValue.dateFrom);
      }

    } else {
      this.dateValue.dateTo = this.error
        ? undefined
        : new Date(indexArray.join('/'));

      if (this.dateValue.dateFrom) {
        if (this.dateValue.dateFrom < this.dateValue.dateTo) {
          this.setCalendarDate(this.pickerTo, this.dateValue.dateTo);
        } else {
          this.dateValue.dateTo = undefined;
          this.dateInputTo.nativeElement.value = '';
        }
      } else {
        this.setCalendarDate(this.pickerTo, this.dateValue.dateTo);
      }
    }

    if (this.error) {
      Utilities.delay(10).then(() => {
        if (dateTarget === 1) {
          this.dateInputFrom.nativeElement.value = this.previousValue;
        } else {
          this.dateInputTo.nativeElement.value = this.previousValue;
        }
      });
    }
  }

  /**
   * Open or close calendar container
   */
  toggle() {
    this.showPopup = !this.showPopup;
    if (!this.dateValue.dateFrom && !this.dateValue.dateTo) {
      this.reset();
    }
    if (this.showPopup) {
      this.tempDateValue = Object.assign({}, this.dateValue);
    } else {
      this.dateValue = this.tempDateValue;
    }
  }

  /**
   * Event click for accept dates
   */
  ok() {
    if (this.bothmandatory) {
      if (this.validateBothDates()) {
        this.selectDatesAndPropagateChanges();
      }
    } else {
      this.selectDatesAndPropagateChanges();
    }

    return false;
  }

  selectDatesAndPropagateChanges() {
    this.showPopup = false;
    this.showSelectedDateMessage();
    this.propagateChange(this.dateValue);
  }

  validateBothDates() {
    if (!this.dateValue.dateFrom || !this.dateValue.dateTo) {
      this.oneSelectedDateMessage = 'APP.SELECT_DATES_IS_MANDATORY';
      this.reset();
      this.showPopup = false;
      return false;
    }
    this.oneSelectedDateMessage = '';
    return true;
  }

  showSelectedDateMessage() {
    if (this.dateValue.dateFrom && !this.dateValue.dateTo) {
      this.oneSelectedDateMessage = 'APP.SELECTED_DATE_START';
      return;
    }
    if (!this.dateValue.dateFrom && this.dateValue.dateTo) {
      this.oneSelectedDateMessage = 'APP.SELECTED_DATE_END';
      return;
    }
    this.oneSelectedDateMessage = '';
  }

  /**
   * Event button for cancel operation
   */
  cancel() {
    this.showPopup = false;
    this.dateValue = this.tempDateValue;
    // this.dateValue = undefined;
    this.reset();
    this.propagateChange(this.dateValue);
    return false;
  }

  /**
   * Establish date in calendar since input control
   * @param picker NgbDatepicker control
   * @param date Initial date to show as selected
   */
  setCalendarDate(picker: NgbDatepicker, date?: Date) {
    if (date) {
      picker.onDateSelect(
        new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
      );
    }
  }

  reset() {
    const now = new Date;
    const navigatedDate = { year: now.getFullYear(), month: now.getMonth() + 1 };
    // this.oneSelectedDateMessage = '';
    this.dateInputFrom.nativeElement.value = '';
    this.dateInputTo.nativeElement.value = '';
    this.maxDatePickerFrom = Utilities.getDateNowForDatePicker(null);
    this.pickerFrom.onDateSelect(undefined);
    this.pickerTo.onDateSelect(undefined);
    this.pickerFrom.navigateTo(navigatedDate);
    this.pickerTo.navigateTo(navigatedDate);
    if (this.dateValue) {
      this.dateValue.dateFrom = null;
      this.dateValue.dateTo = null;
    }
    this.propagateChange(this.dateValue);

    return false;
  }

  /**
   * Set datepicker 'To' the max date in today
   */
  getCurrentDateInPickerFormat() {
    this.maxDatePickerFrom = Utilities.getDateNowForDatePicker();
    this.maxDatePickerTo = Utilities.getDateNowForDatePicker();
  }


  test() {
    return false;
  }
}
