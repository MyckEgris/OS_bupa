import { ViewCommissionComponent } from './view-commission/view-commission.component';
import { LayoutComponent } from './../core/layout/layout.component';
import { AuthorizationGuard } from './../shared/guards/authorization.guard';
import { AuthGuardService } from './../security/services/auth-guard/auth-guard.service';
import { ViewPortfolioComponent } from './view-portfolio/view-portfolio.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewPortfolioContainerComponent } from './view-portfolio-container/view-portfolio-container.component';
import { PortfolioResolver } from './Resolvers/portfolio-route-resolver';

const routes: Routes = [
  {
    path: 'agents',
    component: LayoutComponent,
    children: [
      {
        path: 'view-portfolio',
        component: ViewPortfolioContainerComponent,
        resolve: {
          team: PortfolioResolver
        },
        canActivate: [AuthGuardService, AuthorizationGuard],
        runGuardsAndResolvers: 'always',
        data: {
          allowedRoles: ['GroupAdmin', 'Agent', 'AgentAssistant']
        }
      },
      {
        path: 'view-commission',
        component: ViewCommissionComponent,
        canActivate: [AuthGuardService, AuthorizationGuard],
        data: {
          allowedRoles: ['GroupAdmin', 'Agent', 'AgentAssistant']
        }
      }
    ]
  },
  {
    path: 'child-agents-portfolio/:parent/subagent/:subagent',
    component: ViewPortfolioComponent,
    canActivate: [AuthGuardService, AuthorizationGuard],
    pathMatch: 'full',
    data: {
      allowedRoles: ['GroupAdmin', 'Agent', 'AgentAssistant']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PortfolioResolver]
})
export class AgentRoutingModule { }
