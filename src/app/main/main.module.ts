import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './home/home.component';

import { AgreementsComponent } from './services/agreement/agreements/agreements.component';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';
import { AgentModule } from '../agent/agent.module';
import { SharedModule } from '../shared/shared.module';
import { PolicyModule } from '../policy/policy.module';
import { QuickAccessLinksComponent } from './quick-access-links/quick-access-links.component';
import { ContentFactoryService } from './home/contentManagementService/content-factory';
import { ContentInformationService } from './home/contentManagementService/content.service';
import { AgentHomeComponent } from './agent-home/agent-home.component';
import { ProviderHomeComponent } from './provider-home/provider-home.component';
import { PolicyHolderHomeComponent } from './policy-holder-home/policy-holder-home.component';
import { InfographicsComponent } from './infographics/infographics.component';

import { ClaimModule} from '../claim/claim.module';
import { PreHomeComponent } from './pre-home/pre-home.component';
import { EmployeeAdminHomeComponent } from './employee-admin-home/employee-admin-home.component';
import { UserModule } from '../user/user.module';
import { InfoSecureComponent } from './infographics/info-secure/info-secure.component';
import { PreHomeProviderComponent } from './pre-home-provider/pre-home-provider.component';
import { BupaAppModule } from '../bupa-app/bupa-app.module';


@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    TranslateModule,
    AgentModule,
    SharedModule,
    PolicyModule,
    ClaimModule,
    UserModule,
    BupaAppModule
  ],
  declarations: [ HomeComponent, AgreementsComponent, QuickAccessLinksComponent, InfographicsComponent,
     AgentHomeComponent, ProviderHomeComponent, PolicyHolderHomeComponent, PreHomeComponent, EmployeeAdminHomeComponent, InfoSecureComponent, PreHomeProviderComponent],
  exports : [ AgreementsComponent ],
  providers: [ContentFactoryService, ContentInformationService]
})
export class MainModule { }
