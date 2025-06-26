import { NgxMaskModule } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../core/core.module';
import { ViewDisclaimerComponent } from './view-disclaimer/view-disclaimer.component';
import { ProfileContainerComponent } from './profile/profile-container/profile-container.component';
import { AgentProfileViewComponent } from './profile/agent-profile-view/agent-profile-view.component';
import { EditAgentProfileComponent } from './profile/edit-agent-profile/edit-agent-profile.component';
import { ProviderProfileViewComponent } from './profile/provider-profile/provider-profile-view/provider-profile-view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { AgentAssistantApprovalComponent } from './agent-assistant-approval/agent-assistant-approval.component';
import { PolicyHolderProfileViewComponent } from './profile/policy-holder-profile-view/policy-holder-profile-view.component';
import { UnlockAccountComponent } from './unlock-account/unlock-account.component';
import { ImpersonationComponent } from './impersonation/impersonation.component';
import { GoBackImpersonationComponent } from './go-back-impersonation/go-back-impersonation.component';
import { SpikeDynamicFormsComponent } from './spike-dynamic-forms/spike-dynamic-forms.component';
import { DynamicFormsBuildComponent } from './spike-dynamic-forms/dynamic-forms-build/dynamic-forms-build.component';
import { ChangePortfolioComponent } from './change-portfolio/change-portfolio.component';
import { ProviderProfileComponent } from './profile/provider-profile/provider-profile.component';
import { ProviderProfileDetailComponent } from './profile/provider-profile/provider-profile-detail/provider-profile-detail.component';
import { ProviderSummaryComponent } from './profile/provider-profile/provider-profile-detail/provider-summary/provider-summary.component';
// tslint:disable-next-line:max-line-length
import { ProviderBeneficialOwnerComponent } from './profile/provider-profile/provider-profile-detail/provider-beneficial-owner/provider-beneficial-owner.component';
// tslint:disable-next-line:max-line-length
import { ProviderBeneficialOwnerDataComponent } from './profile/provider-profile/provider-profile-detail/provider-beneficial-owner/provider-beneficial-owner-data/provider-beneficial-owner-data.component';



@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    TranslateModule,
    SharedModule,
    ReactiveFormsModule,
    CoreModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    NgxMaskModule
  ],
  declarations: [
    ProviderProfileViewComponent,
    ChangePasswordComponent,
    ViewDisclaimerComponent,
    ProfileContainerComponent,
    AgentProfileViewComponent,
    ProfileViewComponent,
    AgentAssistantApprovalComponent,
    EditAgentProfileComponent,
    PolicyHolderProfileViewComponent,
    UnlockAccountComponent,
    ImpersonationComponent,
    GoBackImpersonationComponent,
    SpikeDynamicFormsComponent,
    DynamicFormsBuildComponent,
    ChangePortfolioComponent,
    ProviderProfileComponent,
    ProviderProfileDetailComponent,
    ProviderSummaryComponent,
    ProviderBeneficialOwnerComponent,
    ProviderBeneficialOwnerDataComponent
  ],
  exports: [
    ImpersonationComponent
  ]
})
export class UserModule { }
