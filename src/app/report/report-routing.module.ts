import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
import { ViewReportComponent } from './view-report/view-report.component';

const routes: Routes = [
  {
    path: 'reports',
    component: LayoutComponent,
    children: [
      {
        path: 'view-report/:reportreference',
        component: ViewReportComponent,
        canActivate: [AuthGuardService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
