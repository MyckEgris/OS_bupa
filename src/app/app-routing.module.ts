import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  {
    path: 'user',
    loadChildren: './user/user.module#UserModule'
  },
  {
    path: 'policy',
    loadChildren: './policy/policy.module#PolicyModule'
  },
  {
    path: 'claim',
    loadChildren: './claim/claim.module#ClaimModule'
  },
  {
    path: 'agent',
    loadChildren: './agent/agent.module#AgentModule'
  },
  {
    path: 'payment',
    loadChildren: './payment/payment.module#PaymentModule'
  },
  {
    path: 'support',
    loadChildren: './support/support.module#SupportModule'
  },
  {
    path: 'network',
    loadChildren: './network/network.module#NetworkModule'
  },
  {
    path: 'report',
    loadChildren: './report/report.module#ReportModule'
  },
  {
    path: 'coverage',
    loadChildren: './coverage/coverage.module#CoverageModule'
  },
  {
    path: 'event-notification',
    loadChildren: './event-notification/event-notification.module#EventNotificationModule'
  },
  {
    path: '',
    loadChildren: './main/main.module#MainModule'
  },
  {
    path: 'bupa-app',
    loadChildren: './bupa-app/bupa-app.module#BupaAppModule'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
