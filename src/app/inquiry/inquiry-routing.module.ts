
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { InformationRequestComponent } from './information-request/information-request.component';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
import { InformationRequestStep1Component } from './information-request/information-request-step1/information-request-step1.component';
import { DeactivateRouteGuard } from '../shared/guards/deactivate-route.guard';
import { InformationRequestStep2Component } from './information-request/information-request-step2/information-request-step2.component';
import { InformationRequestGuard } from './information-request/information-request-guard/information-request.guard';
import { ViewInformationRequestComponent } from './view-information-request/view-information-request.component';
import { ViewInformationResultComponent } from './view-information-result/view-information-result.component';
import { ProviderValidationGuard } from '../shared/guards/provider-validation.guard';

/***
 * Module to route the inquiry functionalities.
 */
const routes: Routes = [
  {
    path: 'inquiry',
    component: LayoutComponent,
    children: [
      {
        path: 'view-information-request',
        component: ViewInformationRequestComponent,
        canActivate: [AuthGuardService, ProviderValidationGuard]
      },
      {
        path: 'information-request/:optionType',
        component: InformationRequestComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'step1'
          },
          {
            path: 'step1',
            component: InformationRequestStep1Component,
            data: { step: 1 },
            canActivate: [AuthGuardService, ProviderValidationGuard],
          },
          {
            path: 'step2',
            component: InformationRequestStep2Component,
            data: { step: 2 },
            canActivate: [AuthGuardService, ProviderValidationGuard, InformationRequestGuard]
          }
        ],
        canDeactivate: [DeactivateRouteGuard],
      },
      {
        path: 'information-request',
        component: InformationRequestComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'step1'
          }
        ]
      },
      {
        path: 'view-information-result/:inquiryId',
        component: ViewInformationResultComponent,
        canActivate: [AuthGuardService, ProviderValidationGuard]
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InquiryRoutingModule { }
