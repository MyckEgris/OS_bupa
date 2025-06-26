import { BaseControl } from './base.control';

export class FileControl extends BaseControl<string> {
  controlType = 'file';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
