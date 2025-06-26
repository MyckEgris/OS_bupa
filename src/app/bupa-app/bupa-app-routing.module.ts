import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutBupaAppComponent } from '../core/layout-bupa-app/layout-bupa-app.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'bupa-app',
    pathMatch: 'prefix',
    component: LayoutBupaAppComponent,
    children: [
      {path: 'activate-account', component: ActivateAccountComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: '**', redirectTo: 'activate-account'}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BupaAppRoutingModule { }
