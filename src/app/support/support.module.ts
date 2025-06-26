import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { SupportRoutingModule} from './support-routing.module';
import { CoreModule } from '../core/core.module';
import { UnderConstructionInformationComponent } from './under-construction-information/under-construction-information.component';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    CoreModule,
    SupportRoutingModule
  ],
  declarations: [
    UnderConstructionInformationComponent
  ]
})
export class SupportModule { }
