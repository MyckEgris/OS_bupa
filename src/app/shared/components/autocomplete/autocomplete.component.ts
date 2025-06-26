import { debounceTime } from 'rxjs/operators';
import { Component, OnInit, forwardRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validator, AbstractControl } from '@angular/forms';

export interface Source {
  id: string;
  value: string;
}

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AutocompleteComponent), multi: true }],
})
export class AutocompleteComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {

  @Input('country')
  public country: any;

  @Input('inputPlaceholder')
  public inputPlaceholder: string;

  @Input('source')
  public source: Array<any>;

  @Input('id')
  public id: string;

  @Input('value')
  public value: string;

  @Input('loaded')
  public loaded: boolean;

  @ViewChild('inputAutocomplete')
  public inputAutocomplete;

  public autocompleteArray: Source[];

  public showList;

  public filteredItems: Source[];

  public validationError: boolean;

  private propagateChange = (_: any) => { };


  constructor() {
  }

  ngOnInit() {
    this.loaded = false;
    this.validationError = false;
    this.autocompleteArray = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mapperInputSourceToSource();
    this.showList = false;
    this.filteredItems = this.autocompleteArray;
    this.loaded = true;
  }

  mapperInputSourceToSource() {
    for (const i of this.source) {
      this.autocompleteArray.push({ id: i[this.id], value: i[this.value] });
    }

  }

  writeValue(obj: any): void {
    this.country = { id: '', value: obj };
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  public validate(c: FormControl) {
    return (!this.validationError) ? null : {
      jsonParseError: {
        valid: false,
      },
    };
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled = false;
  }

  selectItem(item) {
    this.validationError = false;
    this.country = { id: item.id, value: item.value };
    this.propagateChange(this.country);
    this.hide();
  }

  toggle() {
    this.showList = !this.showList;
  }

  show() {
    this.showList = true;
    this.filteredItems = this.autocompleteArray;
  }

  hide() {
    this.showList = false;
  }

  onChange(e) {
    this.filteredItems = e.target.value ? this.performFilter(e.target.value) : this.autocompleteArray;
  }

  performFilter(filterBy: string): Source[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.autocompleteArray.filter((item: Source) =>
      item.value.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  close() {
    this.country = { id: '', value: '' };
    this.propagateChange(this.country);
    this.writeValue('');
    this.inputAutocomplete = '';
    this.hide();
  }

}
