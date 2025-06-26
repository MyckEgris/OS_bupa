import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClaimRoutingModule } from './claim-routing.module';
import { ClaimViewContainerComponent } from './claim-view-container/claim-view-container.component';
import { ClaimViewProccessedComponent } from './claim-view-proccessed/claim-view-proccessed.component';
import { ClaimViewIncompleteComponent } from './claim-view-incomplete/claim-view-incomplete.component';
import { ClaimViewDetailsComponent } from './claim-view-details/claim-view-details.component';
import { ClaimViewPaymentComponent } from './claim-view-payment/claim-view-payment.component';
import { ClaimSubmissionComponent } from './claim-submission/claim-submission.component';
//
//CLAIMSONLINEV2
import { ClaimSubmissionV3Component } from './claim-submission-v3/claim-submission-v3.component';
//
//
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClaimViewAdvancedSearchComponent } from './claim-view-advanced-search/claim-view-advanced-search.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { ClaimViewEobComponent } from './claim-view-eob/claim-view-eob.component';
import { ClaimViewAgentComponent } from './claim-view-agent/claim-view-agent.component';
import { ClaimViewAllClaimsComponent } from './claim-view-all-claims/claim-view-all-claims.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PreAuthorizationComponent } from './pre-authorization/pre-authorization.component';
import { PreAuthorizationStep1Component } from './pre-authorization/pre-authorization-step1/pre-authorization-step1.component';
import { PreAuthorizationStep2Component } from './pre-authorization/pre-authorization-step2/pre-authorization-step2.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfoProvidersComponent } from './pre-authorization/info-providers/info-providers.component';
import { InfoInsuredContactComponent } from './pre-authorization/info-insured-contact/info-insured-contact.component';
import { PreAuthorizationStep3Component } from './pre-authorization/pre-authorization-step3/pre-authorization-step3.component';
import { ModalDiagnosticComponent } from './pre-authorization/diagnostic/modal-diagnostic/modal-diagnostic.component';
import { DiagnosticComponent } from './pre-authorization/diagnostic/diagnostic.component';
import { ProcedureComponent } from './pre-authorization/procedure/procedure.component';
import { ModalProcedureComponent } from './pre-authorization/procedure/modal-procedure/modal-procedure.component';
import { ClaimSubmissionUpdateComponent } from './claim-submission-update/claim-submission-update.component';
import { PreAuthorizationViewComponent } from './pre-authorization-view/pre-authorization-view.component';
// tslint:disable-next-line:max-line-length
import { ClaimSubmissionStep2SingleProvicerComponent } from './claim-submission/claim-submission-step2/claim-submission-step2-single-provider/claim-submission-step2-single-provider.component';
// tslint:disable-next-line:max-line-length
import { ClaimSubmissionStep2MultiProvicerComponent } from './claim-submission/claim-submission-step2/claim-submission-step2-multi-provider/claim-submission-step2-multi-provider.component';
// tslint:disable-next-line:max-line-length
import { ClaimSubmissionStep1MemberComponent } from './claim-submission/claim-submission-step1/claim-submission-step1-member/claim-submission-step1-member.component';
// tslint:disable-next-line:max-line-length
import { ClaimSubmissionStep1AgentComponent } from './claim-submission/claim-submission-step1/claim-submission-step1-agent/claim-submission-step1-agent.component';
// tslint:disable-next-line:max-line-length
import { ClaimSubmissionStep1ProviderComponent } from './claim-submission/claim-submission-step1/claim-submission-step1-provider/claim-submission-step1-provider.component';
import { ClaimSubmissionStep1Component } from './claim-submission/claim-submission-step1/claim-submission-step1.component';
import { ClaimSubmissionStep2Component } from './claim-submission/claim-submission-step2/claim-submission-step2.component';
import { ClaimSubmissionStep3Component } from './claim-submission/claim-submission-step3/claim-submission-step3.component';
import { ClaimFormComponent } from './claim-form/claim-form.component';
import { ClaimFormStep1Component } from './claim-form/claim-form-step1/claim-form-step1.component';
import { ClaimFormStep1AgentComponent } from './claim-form/claim-form-step1/claim-form-step1-agent/claim-form-step1-agent.component';
import { ClaimFormStep1MemberComponent } from './claim-form/claim-form-step1/claim-form-step1-member/claim-form-step1-member.component';
import { ClaimFormStep2Component } from './claim-form/claim-form-step2/claim-form-step2.component';
import { ClaimFormStep3Component } from './claim-form/claim-form-step3/claim-form-step3.component';
import { ClaimFormStep4Component } from './claim-form/claim-form-step4/claim-form-step4.component';
import { ClaimFormStep5Component } from './claim-form/claim-form-step5/claim-form-step5.component';
import { ClaimFormStep6Component } from './claim-form/claim-form-step6/claim-form-step6.component';
import { ClaimMenuComponent } from './claim-menu/claim-menu.component';
import { QuestionsComponent } from './shared/questions/questions.component';
import { QuestionComponent } from './shared/question/question.component';
import { ClaimFormStep1PaymentComponent } from './claim-form/claim-form-step1-1/claim-form-step1-1.component';
import {ClaimReportComponent} from './claim-report/claim-report.component';
//import { ClaimSubmissionV3Component } from './claim-submission-v3/claim-submission-v3.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClaimRoutingModule,
    TranslateModule,
    SharedModule,
    CoreModule,
    NgbModule,
    InfiniteScrollModule,
    NgSelectModule,
  ],
  declarations: [
    ClaimViewContainerComponent,
    ClaimViewProccessedComponent,
    ClaimViewIncompleteComponent,
    ClaimViewDetailsComponent,
    ClaimViewPaymentComponent,
    ClaimSubmissionComponent,
    ClaimMenuComponent,
    ClaimFormComponent,
    ClaimFormStep1Component,
    ClaimFormStep1AgentComponent,
    ClaimFormStep1MemberComponent,
    ClaimFormStep1PaymentComponent,
    ClaimFormStep2Component,
    ClaimFormStep3Component,
    ClaimFormStep4Component,
    ClaimFormStep5Component,
    ClaimFormStep6Component,
    ClaimSubmissionStep1Component,
    ClaimSubmissionStep1ProviderComponent,
    ClaimSubmissionStep1AgentComponent,
    ClaimSubmissionStep1MemberComponent,
    ClaimSubmissionStep2Component,
    ClaimSubmissionStep2SingleProvicerComponent,
    ClaimSubmissionStep2MultiProvicerComponent,
    ClaimSubmissionStep3Component,
    ClaimViewAdvancedSearchComponent,
    ClaimViewEobComponent,
    ClaimViewAgentComponent,
    ClaimViewAllClaimsComponent,
    PreAuthorizationComponent,
    PreAuthorizationStep1Component,
    PreAuthorizationStep2Component,
    InfoProvidersComponent,
    InfoInsuredContactComponent,
    PreAuthorizationStep3Component,
    PreAuthorizationViewComponent,
    ModalDiagnosticComponent,
    DiagnosticComponent,
    ProcedureComponent,
    ModalProcedureComponent,
    ClaimSubmissionUpdateComponent,
    QuestionsComponent,
    QuestionComponent,
    ClaimReportComponent,
    ClaimSubmissionV3Component
  ],
  exports: [
    ClaimViewIncompleteComponent,
  ],
  entryComponents: [
    ClaimReportComponent,
  ],
})
export class ClaimModule { }
