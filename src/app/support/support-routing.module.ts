import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { UnderConstructionInformationComponent} from '../support/under-construction-information/under-construction-information.component';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
const routes: Routes = [
    {
      path: 'support',
      component: LayoutComponent,
      children: [
        {
          path: 'on-construction-information',
          component: UnderConstructionInformationComponent,
          canActivate : [ AuthGuardService ]
        },
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SupportRoutingModule { }
