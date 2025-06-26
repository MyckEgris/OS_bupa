import { BaseControl } from './base.control';

export class ComboControl extends BaseControl<string> {
  controlType = 'combo';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
