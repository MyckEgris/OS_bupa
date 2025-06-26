import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { InformationRequestComponent } from './information-request/information-request.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SecurityModule } from '../security/security.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeviewModule } from 'ngx-treeview';
import { InquiryRoutingModule } from './inquiry-routing.module';
import { InformationRequestStep2Component } from './information-request/information-request-step2/information-request-step2.component';
import { ViewInformationRequestComponent } from './view-information-request/view-information-request.component';
import { TreeViewPersonalizedComponent } from '../shared/components/tree-view-personalized/tree-view-personalized.component';
import { InformationRequestStep1Component } from './information-request/information-request-step1/information-request-step1.component';
import { InformationRequestStep1InquiryComponent } from './information-request/information-request-step1/information-request-step1-inquiry/information-request-step1-inquiry.component';
import { InformationRequestStep1TelemedicineComponent } from './information-request/information-request-step1/information-request-step1-telemedicine/information-request-step1-telemedicine.component';
import { InformationRequestStep2InquiryComponent } from './information-request/information-request-step2/information-request-step2-inquiry/information-request-step2-inquiry.component';
import { InformationRequestStep2TelemedicineComponent } from './information-request/information-request-step2/information-request-step2-telemedicine/information-request-step2-telemedicine.component';
import { ViewInformationResultComponent } from './view-information-result/view-information-result.component';
import { InteractionsComponent } from './view-information-result/interactions/interactions.component';
import { AddResponseComponent } from './view-information-result/add-response/add-response.component';
import { InteractionsItemComponent } from './view-information-result/interactions-item/interactions-item.component';
import { InformationRequestStep1InquiryDefaultComponent } from './information-request/information-request-step1/information-request-step1-inquiry-default/information-request-step1-inquiry-default.component';

/****
 * Module for grouping the inquiry functionalities
 */
@NgModule({
  imports: [
    CommonModule,
    InquiryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SecurityModule,
    TranslateModule,
    NgbModule,
    CoreModule,
    SharedModule,
    NgSelectModule,
    TreeviewModule.forRoot()
  ],
  declarations: [TreeViewPersonalizedComponent,
    InformationRequestComponent,
    InformationRequestStep1Component,
    InformationRequestStep1InquiryComponent,
    InformationRequestStep1TelemedicineComponent,
    InformationRequestStep2Component,
    ViewInformationRequestComponent,
    InformationRequestStep2InquiryComponent,
    InformationRequestStep2TelemedicineComponent,
    ViewInformationResultComponent,
    InteractionsComponent,
    AddResponseComponent,
    InteractionsItemComponent,
    InformationRequestStep1InquiryDefaultComponent
    ]
})
export class InquiryModule { }
