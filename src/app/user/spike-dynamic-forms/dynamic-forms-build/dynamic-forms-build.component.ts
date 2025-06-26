import { Component, OnInit, Input } from '@angular/core';
import { BaseControl } from 'src/app/shared/services/dynamic-forms/entities/base.control';
import { FormGroup } from '@angular/forms';
import { DynamicFormsService } from 'src/app/shared/services/dynamic-forms/dynamic-forms.service';

@Component({
  selector: 'app-dynamic-forms-build',
  templateUrl: './dynamic-forms-build.component.html',
  styleUrls: ['./dynamic-forms-build.component.css']
})
export class DynamicFormsBuildComponent implements OnInit {

  @Input() controls: BaseControl<any>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private dynamicFormsService: DynamicFormsService) { }

  ngOnInit() {
    this.form = this.dynamicFormsService.buildFormGroup(this.controls);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }

}
