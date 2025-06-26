import { Injectable } from '@angular/core';
import { BaseControl } from 'src/app/shared/services/dynamic-forms/entities/base.control';
import { ComboControl } from 'src/app/shared/services/dynamic-forms/entities/combo.control';
import { TextControl } from 'src/app/shared/services/dynamic-forms/entities/text.control';
import { CheckBoxGroupControl, RadioButtonGroupControl, FileControl } from 'src/app/shared/services/dynamic-forms/entities/entities.index';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormDataService {

  constructor() { }

  
  getControls() {

    const controls: BaseControl<any>[] = [

      new ComboControl({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3
      }),

      new TextControl({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1
      }),

      new TextControl({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2
      }),

      new CheckBoxGroupControl({
        key: 'brave',
        label: 'Bravery Rating',
        name: 'example',
        type: 'checkbox',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 4
      }),

      new RadioButtonGroupControl({
        key: 'brave',
        label: 'Bravery Rating',
        name: 'example',
        type: 'radio',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 5
      }),

      new FileControl({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        type: 'file',
        required: true,
        order: 6
      }),

      new TextControl({
        key: 'emailAddress',
        label: 'Number',
        type: 'number',
        order: 8
      }),

      new TextControl({
        key: 'emailAddress',
        label: 'Email',
        type: 'date',
        order: 7
      })
    ];

    return controls.sort((a, b) => a.order - b.order);
  }
}
