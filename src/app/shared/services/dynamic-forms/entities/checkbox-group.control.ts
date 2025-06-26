import { BaseControl } from './base.control';

export class CheckBoxGroupControl extends BaseControl<string> {
  controlType = 'checkbox';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
