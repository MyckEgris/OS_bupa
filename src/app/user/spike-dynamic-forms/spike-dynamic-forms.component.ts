import { Component, OnInit, Input } from '@angular/core';
import { BaseControl } from 'src/app/shared/services/dynamic-forms/entities/base.control';
import { FormGroup } from '@angular/forms';
import { DynamicFormsService } from 'src/app/shared/services/dynamic-forms/dynamic-forms.service';
import { DynamicFormDataService } from './dynamic-form-data.service';

@Component({
  selector: 'app-spike-dynamic-forms',
  templateUrl: './spike-dynamic-forms.component.html',
  styleUrls: ['./spike-dynamic-forms.component.css']
})
export class SpikeDynamicFormsComponent implements OnInit {

  controls: Array<any>;

  constructor(private service: DynamicFormDataService) { }

  ngOnInit() {
    this.controls = this.service.getControls();
  }

}
