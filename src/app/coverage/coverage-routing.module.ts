import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/core/layout/layout.component';
import { AuthGuardService } from 'src/app/security/services/auth-guard/auth-guard.service';
import { LoadCoveragesComponent } from './load-coverages/load-coverages.component';
import { AddPlansComponent } from './add-plans/add-plans.component';
import { CopyCoverageAndPlanComponent } from './copy-coverage-and-plan/copy-coverage-and-plan.component';


const routes: Routes = [
  {
    path: 'coverages',
    component: LayoutComponent,
    children: [
      {
        path: 'load-coverages',
        component: LoadCoveragesComponent,
        canActivate: [AuthGuardService/*, NetworkProvidersGuard*/]
      },
      {
        path: 'add-plans',
        component: AddPlansComponent,
        canActivate: [AuthGuardService, /*NetworkProvidersGuard*/]
      },
      {
        path: 'copy-coverage-and-plan',
        component: CopyCoverageAndPlanComponent,
        canActivate: [AuthGuardService, /*NetworkProvidersGuard*/]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoverageRoutingModule { }
