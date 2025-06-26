import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AddNetworksComponent } from './add-networks/add-networks.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SecurityModule } from '../security/security.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { NetworkRoutingModule } from './network-routing.module';
import { AddNetworksModalComponent } from './add-networks/add-networks-modal/add-networks-modal.component';
import { LoadDocumentsComponent } from './load-documents/load-documents.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    SecurityModule,
    NgbModule,
    CoreModule,
    SharedModule,
    NetworkRoutingModule
  ],
  declarations: [
    LoadDocumentsComponent, AddNetworksComponent, AddNetworksModalComponent
  ]
})
export class NetworkModule { }
