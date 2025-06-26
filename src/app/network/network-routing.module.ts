import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
import { LoadDocumentsComponent } from './load-documents/load-documents.component';
import { AddNetworksComponent } from './add-networks/add-networks.component';


const routes: Routes = [
  {
    path: 'networks',
    component: LayoutComponent,
    children: [
      {
        path: 'load-documents',
        component: LoadDocumentsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'add-networks',
        component: AddNetworksComponent,
        canActivate: [AuthGuardService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkRoutingModule { }
