import { ClaimViewAgentComponent } from './claim-view-agent/claim-view-agent.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
import { ClaimViewContainerComponent } from './claim-view-container/claim-view-container.component';
import { ClaimSubmissionComponent } from './claim-submission/claim-submission.component';
//
//CLAIMSONLINEV2
import { ClaimSubmissionV3Component } from './claim-submission-v3/claim-submission-v3.component';
//
//
import { ClaimFormComponent } from './claim-form/claim-form.component';
import { ClaimFormStep1Component } from './claim-form/claim-form-step1/claim-form-step1.component';
import { ClaimFormStep2Component } from './claim-form/claim-form-step2/claim-form-step2.component';
import { ClaimFormStep3Component } from './claim-form/claim-form-step3/claim-form-step3.component';
import { ClaimFormStep4Component } from './claim-form/claim-form-step4/claim-form-step4.component';
import { ClaimFormStep5Component } from './claim-form/claim-form-step5/claim-form-step5.component';
import { ClaimFormStep6Component } from './claim-form/claim-form-step6/claim-form-step6.component';
import { ClaimMenuComponent } from './claim-menu/claim-menu.component';
import { ClaimSubmissionStep2Component } from './claim-submission/claim-submission-step2/claim-submission-step2.component';
import { ClaimSubmissionStep1Component } from './claim-submission/claim-submission-step1/claim-submission-step1.component';
import { ClaimSubmissionStep3Component } from './claim-submission/claim-submission-step3/claim-submission-step3.component';
import { ClaimSubmissionGuardService } from './claim-submission/claim-submission-guard/claim-submission-guard.service';
import { AuthorizationGuard } from '../shared/guards/authorization.guard';
import { DeactivateRouteGuard } from '../shared/guards/deactivate-route.guard';
import { FeatureRestrictionsGuard } from '../shared/guards/features-restrictions.guard';
import { ClaimViewAllClaimsComponent } from './claim-view-all-claims/claim-view-all-claims.component';
import { PreAuthorizationComponent } from './pre-authorization/pre-authorization.component';
import { PreAuthorizationGuard } from './pre-authorization/pre-authorization-guard/pre-authorization.guard';
import { PreAuthorizationStep1Component } from './pre-authorization/pre-authorization-step1/pre-authorization-step1.component';
import { PreAuthorizationStep2Component } from './pre-authorization/pre-authorization-step2/pre-authorization-step2.component';
import { PreAuthorizationStep3Component } from './pre-authorization/pre-authorization-step3/pre-authorization-step3.component';
import { ClaimSubmissionUpdateComponent } from './claim-submission-update/claim-submission-update.component';
import { PreAuthorizationViewComponent } from './pre-authorization-view/pre-authorization-view.component';
import { PreAuthorizationViewResolverService } from './resolvers/pre-authorization-view/pre-authorization-view.resolver.service';
import { from } from 'rxjs';
import { ClaimFormGuardService } from './claim-form/claim-form-guard/claim-form-guard.service';
import { ClaimFormStep1PaymentComponent } from './claim-form/claim-form-step1-1/claim-form-step1-1.component';

const routes: Routes = [
  {
    path: 'claims',
    component: LayoutComponent,
    children: [
      {
        path: 'my-claims',
        component: ClaimViewContainerComponent,
        canActivate: [AuthGuardService, AuthorizationGuard],
        data: {
          allowedRoles: ['Provider', 'Admin', 'Agent', 'GroupAdmin', 'AgentAssistant']
        }
      },
      {
        path: 'claim-submission',
        component: ClaimMenuComponent,
        canActivate: [AuthGuardService],
        data: {
          allowedRoles: ['Agent', 'Admin', 'Provider', 'GroupAdmin', 'AgentAssistant', 'PolicyHolder', 'GroupPolicyHolder']
        },
      },
      {
        path: 'claim-submission-create-v2/:claimsubmissiontype',
        component: ClaimFormComponent,
        canActivate: [AuthorizationGuard, FeatureRestrictionsGuard],
        data: {
          allowedRoles: ['Agent', 'Admin', 'Provider', 'GroupAdmin', 'AgentAssistant', 'PolicyHolder', 'GroupPolicyHolder']
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'step1'
          },
          {
            path: 'step1',
            component: ClaimFormStep1Component,
            data: { step: 1 },
            canActivate: [AuthGuardService]
          },
          {
            path: 'step2',
            component: ClaimFormStep1PaymentComponent,
            data: { step: 2 },
            canActivate: [AuthGuardService, ClaimFormGuardService]
          },
          {
            path: 'step3',
            component: ClaimFormStep2Component,
            data: { step: 3 },
            canActivate: [AuthGuardService, ClaimFormGuardService]
          },
          {
            path: 'step4',
            component: ClaimFormStep3Component,
            data: { step: 4 },
            canActivate: [AuthGuardService, ClaimFormGuardService]
          },
          {
            path: 'step5',
            component: ClaimFormStep4Component,
            data: { step: 5 },
            canActivate: [AuthGuardService, ClaimFormGuardService]
          },
          {
            path: 'step6',
            component: ClaimFormStep5Component,
            data: { step: 6 },
            canActivate: [AuthGuardService, ClaimFormGuardService]
          },
          {
            path: 'step7',

            component: ClaimFormStep6Component,
            data: { step: 6 },
            canActivate: [AuthGuardService]
          }
        ],
        canDeactivate: [DeactivateRouteGuard],
      },
      // {
      //   path: 'claim-submission-create-v3/:claimsubmissiontype',
      //   component: ClaimFormComponent,
      //   canActivate: [AuthorizationGuard, FeatureRestrictionsGuard],
      //   data: {
      //     allowedRoles: ['Agent', 'Admin', 'Provider', 'GroupAdmin', 'AgentAssistant', 'PolicyHolder', 'GroupPolicyHolder']
      //   },
      //   children: [
      //     {
      //       path: '',
      //       pathMatch: 'full',
      //       redirectTo: 'step1'
      //     },
      //     {
      //       path: 'step1',
      //       component: ClaimFormStep1Component,
      //       data: { step: 1 },
      //       canActivate: [AuthGuardService]
      //     },
      //     {
      //       path: 'step2',
      //       component: ClaimFormStep1PaymentComponent,
      //       data: { step: 2 },
      //       canActivate: [AuthGuardService, ClaimFormGuardService]
      //     },
      //     {
      //       path: 'step3',
      //       component: ClaimFormStep2Component,
      //       data: { step: 3 },
      //       canActivate: [AuthGuardService, ClaimFormGuardService]
      //     },
      //     {
      //       path: 'step4',
      //       component: ClaimFormStep3Component,
      //       data: { step: 4 },
      //       canActivate: [AuthGuardService, ClaimFormGuardService]
      //     },
      //     {
      //       path: 'step5',
      //       component: ClaimFormStep4Component,
      //       data: { step: 5 },
      //       canActivate: [AuthGuardService, ClaimFormGuardService]
      //     },
      //     {
      //       path: 'step6',
      //       component: ClaimFormStep5Component,
      //       data: { step: 6 },
      //       canActivate: [AuthGuardService, ClaimFormGuardService]
      //     },
      //     {
      //       path: 'step7',

      //       component: ClaimFormStep6Component,
      //       data: { step: 6 },
      //       canActivate: [AuthGuardService]
      //     }
      //   ],
      //   canDeactivate: [DeactivateRouteGuard],
      // },

      {
        path: 'claim-submission-create-v3/:claimsubmissiontype',
        component: ClaimSubmissionV3Component,
        canActivate: [AuthorizationGuard, FeatureRestrictionsGuard],
        data: {
          allowedRoles: ['Agent', 'Admin', 'Provider', 'GroupAdmin', 'AgentAssistant', 'PolicyHolder', 'GroupPolicyHolder']
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'step1'
          },
          {
            path: 'step1',
            component: ClaimSubmissionStep1Component,
            data: { step: 1 },
            canActivate: [AuthGuardService]
          },
          {
            path: 'step2',
            component: ClaimSubmissionStep2Component,
            data: { step: 2 },
            canActivate: [AuthGuardService, ClaimSubmissionGuardService]
          },
          {
            path: 'step3',
            component: ClaimSubmissionStep3Component,
            data: { step: 3 },
            canActivate: [AuthGuardService, ClaimSubmissionGuardService]
          }
        ],
        canDeactivate: [DeactivateRouteGuard],
      },
      {
        path: 'claim-submission-create-v1/:claimsubmissiontype',
        component: ClaimSubmissionComponent,
        canActivate: [AuthorizationGuard, FeatureRestrictionsGuard],
        data: {
          allowedRoles: ['Agent', 'Admin', 'Provider', 'GroupAdmin', 'AgentAssistant', 'PolicyHolder', 'GroupPolicyHolder']
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'step1'
          },
          {
            path: 'step1',
            component: ClaimSubmissionStep1Component,
            data: { step: 1 },
            canActivate: [AuthGuardService]
          },
          {
            path: 'step2',
            component: ClaimSubmissionStep2Component,
            data: { step: 2 },
            canActivate: [AuthGuardService, ClaimSubmissionGuardService]
          },
          {
            path: 'step3',
            component: ClaimSubmissionStep3Component,
            data: { step: 3 },
            canActivate: [AuthGuardService, ClaimSubmissionGuardService]
          }
        ],
        canDeactivate: [DeactivateRouteGuard],
      },
      {
        path: 'claim-update',
        component: ClaimSubmissionUpdateComponent,
        canActivate: [AuthGuardService, AuthorizationGuard],
        data: {
          allowedRoles: ['Agent', 'Provider', 'AgentAssistant', 'PolicyHolder', 'GroupPolicyHolder', 'GroupAdmin']
        }
      },
      {
        path: 'my-claims-agent',
        component: ClaimViewAgentComponent,
        canActivate: [AuthGuardService, AuthorizationGuard],
        data: {
          allowedRoles: ['Agent', 'Admin', 'Provider', 'GroupAdmin', 'AgentAssistant', 'PolicyHolder', 'GroupPolicyHolder']
        }
      },
      {
        path: 'all-claims/:memberId',
        component: ClaimViewAllClaimsComponent,
        canActivate: [AuthGuardService, AuthorizationGuard],
        data: {
          allowedRoles: ['Provider', 'Admin', 'Agent', 'GroupAdmin', 'AgentAssistant', 'PolicyHolder', 'GroupPolicyHolder']
        }
      },
      {
        path: 'pre-authorization-view',
        component: PreAuthorizationViewComponent,
        canActivate: [AuthGuardService],
        resolve: { preAuthInfo: PreAuthorizationViewResolverService }
      },
      {
        path: 'pre-authorization',
        component: PreAuthorizationComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'step1'
          },
          {
            path: 'step1',
            component: PreAuthorizationStep1Component,
            data: { step: 1 },
            canActivate: [AuthGuardService],
          },
          {
            path: 'step2',
            component: PreAuthorizationStep2Component,
            data: { step: 2 },
            canActivate: [AuthGuardService, PreAuthorizationGuard]
          },
          {
            path: 'step3',
            component: PreAuthorizationStep3Component,
            data: { step: 3 },
            canActivate: [AuthGuardService, PreAuthorizationGuard]
          }
        ],
        canDeactivate: [DeactivateRouteGuard],
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule { }
