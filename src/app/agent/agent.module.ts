import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgentRoutingModule } from './agent-routing.module';
import { ViewPortfolioComponent } from './view-portfolio/view-portfolio.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ViewPortfolioDetailComponent } from './view-portfolio-detail/view-portfolio-detail.component';
import { ViewSummaryAgentCommissionsComponent } from './view-summary-agent-commissions/view-summary-agent-commissions.component';
import { ViewSummaryAgentPortfolioComponent } from './view-summary-agent-portfolio/view-summary-agent-portfolio.component';
import { ViewCommissionComponent } from './view-commission/view-commission.component';
import { ViewCommissionDetailComponent } from './view-commission-detail/view-commission-detail.component';
import { ViewPortfolioContainerComponent } from './view-portfolio-container/view-portfolio-container.component';

@NgModule({
  imports: [
    CommonModule,
    AgentRoutingModule,
    TranslateModule,
    SharedModule,
    CoreModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule
  ],
  declarations: [
    ViewPortfolioComponent,
    ViewPortfolioDetailComponent,
    ViewSummaryAgentCommissionsComponent,
    ViewSummaryAgentPortfolioComponent,
    ViewPortfolioComponent, ViewPortfolioDetailComponent,
    ViewCommissionComponent, ViewCommissionDetailComponent, ViewPortfolioContainerComponent
  ],
  exports: [
    ViewSummaryAgentCommissionsComponent,
    ViewSummaryAgentPortfolioComponent
  ]
})
export class AgentModule { }
