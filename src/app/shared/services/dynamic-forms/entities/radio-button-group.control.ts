import { BaseControl } from './base.control';

export class RadioButtonGroupControl extends BaseControl<string> {
  controlType = 'radio';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
