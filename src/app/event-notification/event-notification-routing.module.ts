import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
import { EventNotificationComponent } from './event-notification/event-notification.component';
import { AuthorizationGuard } from '../shared/guards/authorization.guard';

const routes: Routes = [
  {
    path: 'notification',
    component: LayoutComponent,
    children: [
      {
        path: 'notification-panel',
        component: EventNotificationComponent,
        canActivate: [AuthGuardService, AuthorizationGuard],
        data: {
          allowedRoles: ['Admin', 'Agent', 'GroupAdmin', 'AgentAssistant', 'PolicyHolder', 'GroupPolicyHolder']
        }
      }
    ],
  }, {path: '**', pathMatch: 'full', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventNotificationRoutingModule { }
