import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SecurityModule } from '../security/security.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ViewReportComponent } from './view-report/view-report.component';
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    SecurityModule,
    NgbModule,
    CoreModule,
    SharedModule,
    ReportRoutingModule
  ],
  declarations: [
    ViewReportComponent
  ],
  exports: []
})
export class ReportModule { }
