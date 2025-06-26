import { GoBackImpersonationComponent } from './go-back-impersonation/go-back-impersonation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ViewDisclaimerComponent } from './view-disclaimer/view-disclaimer.component';
import { ProfileContainerComponent } from './profile/profile-container/profile-container.component';
import { EditAgentProfileComponent } from './profile/edit-agent-profile/edit-agent-profile.component';
import { AgentAssistantApprovalComponent } from './agent-assistant-approval/agent-assistant-approval.component';
import { UnlockAccountComponent } from './unlock-account/unlock-account.component';
import { ImpersonationComponent } from './impersonation/impersonation.component';
import { PolicyInformationResolverService } from '../policy/resolvers/policy/policy-information.resolver.service';
import { PolicyHolderProfileViewComponent } from './profile/policy-holder-profile-view/policy-holder-profile-view.component';
import { ChangePortfolioComponent } from './change-portfolio/change-portfolio.component';
import { SpikeDynamicFormsComponent } from './spike-dynamic-forms/spike-dynamic-forms.component';
import { DeactivateRouteGuard } from '../shared/guards/deactivate-route.guard';
import { ProviderProfileComponent } from './profile/provider-profile/provider-profile.component';
import { ProviderProfileViewComponent } from './profile/provider-profile/provider-profile-view/provider-profile-view.component';
import { ProviderProfileDetailComponent } from './profile/provider-profile/provider-profile-detail/provider-profile-detail.component';
import { ProviderSummaryComponent } from './profile/provider-profile/provider-profile-detail/provider-summary/provider-summary.component';
// tslint:disable-next-line:max-line-length
import { ProviderBeneficialOwnerComponent } from './profile/provider-profile/provider-profile-detail/provider-beneficial-owner/provider-beneficial-owner.component';



const routes: Routes = [
  {
    path: 'users',
    component: LayoutComponent,
    children: [
      {
        path: 'profile-view',
        component: ProfileContainerComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'profile-policy-holder-view',
        component: PolicyHolderProfileViewComponent,
        canActivate: [AuthGuardService],
        resolve: { policyInfo: PolicyInformationResolverService }
      },
      {
        path: 'edit-agent-profile',
        component: EditAgentProfileComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'view-disclaimer',
        component: ViewDisclaimerComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'agent-assistant-approval',
        component: AgentAssistantApprovalComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'unlock-account',
        component: UnlockAccountComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'impersonation',
        component: ImpersonationComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'go-back-impersonation',
        component: GoBackImpersonationComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'change-portfolio',
        component: ChangePortfolioComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'forms',
        component: SpikeDynamicFormsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'provider-profile',
        component: ProviderProfileComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: ''
          },
          {
            path: 'view',
            component: ProviderProfileViewComponent,
            canActivate: [AuthGuardService],
          },
          {
            path: 'detail',
            component: ProviderProfileDetailComponent,
            canActivate: [AuthGuardService],
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'summary'
              },
              {
                path: 'summary',
                component: ProviderSummaryComponent,
                canActivate: [AuthGuardService],
              },
              {
                path: 'beneficial-owners',
                component: ProviderBeneficialOwnerComponent,
                canActivate: [AuthGuardService]
              }
            ],
            canDeactivate: [DeactivateRouteGuard]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
