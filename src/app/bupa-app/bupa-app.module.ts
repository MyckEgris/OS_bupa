import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { BupaAppRoutingModule } from './bupa-app-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    BupaAppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    NgSelectModule,
    NgxMaskModule
  ],
  declarations: [
    ActivateAccountComponent,
    ResetPasswordComponent
  ]
})
export class BupaAppModule { }
