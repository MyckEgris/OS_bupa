import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SecurityModule } from 'src/app/security/security.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoverageRoutingModule } from './coverage-routing.module';
import { LoadCoveragesComponent } from './load-coverages/load-coverages.component';
import { AddPlansComponent } from './add-plans/add-plans.component';
import { AddPlansModalComponent } from './add-plans/add-plans-modal/add-plans-modal.component';
import { CopyCoverageAndPlanComponent } from './copy-coverage-and-plan/copy-coverage-and-plan.component';


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
    CoverageRoutingModule,
  ],
  declarations: [
    LoadCoveragesComponent, AddPlansComponent, AddPlansModalComponent, CopyCoverageAndPlanComponent
  ]
})
export class CoverageModule { }
