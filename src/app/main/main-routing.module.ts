import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
import { LayoutComponent } from '../core/layout/layout.component';
import { UnderConstructionComponent } from '../core/under-construction/under-construction.component';
import { HomeComponent } from './home/home.component';
import { InfographicsComponent } from './infographics/infographics.component';
import { InfoSecureComponent } from './infographics/info-secure/info-secure.component';
import { ContentInformation } from './home/contentManagementService/conten-Information';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'infographics',
        component: InfographicsComponent,
        canActivate : [ AuthGuardService ]
      },
      {
        path: 'info',
        component: InfoSecureComponent,
        canActivate : [ AuthGuardService ]
      },
      {
        path: 'core/in-construction',
        component: UnderConstructionComponent,
        canActivate : [ AuthGuardService ]
      },
      {
        path: '',
        component: HomeComponent,
        canActivate : [ AuthGuardService ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
