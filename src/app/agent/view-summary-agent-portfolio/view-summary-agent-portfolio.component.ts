import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AgentService } from '../../shared/services/agent/agent.service';
import { QuantityType } from './../../shared/services/agent/entities/quantity-type.enum';
import { ViewPortfolio, PortfolioByAgent } from '../view-portfolio/view-portfolio.model';
import { Router } from '../../../../node_modules/@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-view-summary-agent-portfolio',
  templateUrl: './view-summary-agent-portfolio.component.html'
})
export class ViewSummaryAgentPortfolioComponent implements OnInit, OnDestroy {

  /**
   * current user id
   */
  @Input() currentUserId: string;

  /**
   * current user id
   */
  @Input() currentUserRoleId: string;

  /**
   * Parameter quantity type for show premiums or policies
   */
  public quantityType: string;

  /**
   * Pending evaluation label
   */
  public pendingEvaluation = '';

  /**
   * Pending information label
   */
  public pendingInformation = '';

  /**
   * Pending other label
   */
  public pendingOther = '';

  /**
   * Rejected label
   */
  public rejected = '';

  /**
   * Cancelled label
   */
  public cancelled = '';

  /**
   * Lapsed label
   */
  public lapsed = '';

  /**
   * Array for calculate and show subagents information
   */
  public viewPortfolio: ViewPortfolio[];

  /**
   * portfolio report
   */
  public portfolioReport: any;

  /**
   * money constant
   */
  public MONEY = 'money';

  /**
   * policies count constant
   */
  public POLICIES_COUNT = 'policiescount';

  /**
   * Portfolio object for show chart data from 'ME'
  */
  public portfolioByAgent: PortfolioByAgent[] = [];

  public chartType: string;

  public isGroupAdminAgent = false;
  private subscription: Subscription;
  /**
   * @param AgentService agent service
   */
  constructor(
    private agentService: AgentService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnDestroy(): void {
    if (this.subscription) {this.subscription.unsubscribe(); }
  }

  ngOnInit() {
    this.quantityType = QuantityType.MONEY;
    this.viewPortfolio = [];
    this.chartType = 'bar';
    this.setUpGroupAdminAgent();
    this.getAgentPortfolio();
    this.subscription = this.translate.onLangChange.subscribe(() => {
      this.getAgentPortfolio();
    });
  }

  /**
   * get agent portfolio
   */
  getAgentPortfolio() {
    this.agentService.getPortfolioByAgent(this.currentUserId, this.quantityType).subscribe(
      data => {
        // if (data.portfolio) {
          this.portfolioReport = this.addItemToDetailsPortfolio(data.portfolio, this.currentUserId);
          if (this.checkIfAgentHasSubagents(data.subAgents)) {
            this.addSubAgentItemsToPortfolio(data.subAgents);
          }
          this.portfolioByAgent = this.buildPortfolioChartInstance(this.portfolioReport);
        }
      // }
    );
  }

  /**
   * Add item to details array
   * @param item portfolio item
   * @param agentId Agent id
   */
  addItemToDetailsPortfolio(item, agentId) {
    const viewPortfolio = [];
    viewPortfolio.push(
      this.agentService.addItemToDetailsPortfolio(item, agentId, this.pendingEvaluation, this.pendingInformation, this.pendingOther,
        this.rejected, this.cancelled)
    );
    return (viewPortfolio[0]);
  }

  /**
   * switch the quantity type string
   * @param criteria
   */
  handleChangeCriteria(criteria) {
    this.quantityType = criteria === 1 ? QuantityType.MONEY : QuantityType.POLICIES_COUNT;
    this.getAgentPortfolio();
  }

  /**
   * Build instance for chart widget
   * @param portfolio portfolio item
   */
  buildPortfolioChartInstance(portfolio) {

    const translatedLabels = this.agentService.translatePortfolioChartInstance();
    const portfolioByAgent: PortfolioByAgent[] = [{
      typePortfolio: translatedLabels[0],
      val: this.getPercentage(portfolio.active, portfolio.total)
    }, {
      typePortfolio: translatedLabels[1],
      val: this.getPercentage(portfolio.gracePeriod, portfolio.total)
    }, {
      typePortfolio: translatedLabels[2],
      val: this.getPercentage(portfolio.pendingPayment, portfolio.total)
    }/*, {
      typePortfolio: translatedLabels[3],
      val: this.getPercentage(portfolio.pendingOther, portfolio.total)
    }*/, {
      typePortfolio: translatedLabels[6],
      val: this.getPercentage(portfolio.inactive, portfolio.total)
    }, {
      typePortfolio: translatedLabels[5],
      val: this.getPercentage(portfolio.lapsed, portfolio.total)
    }];
    return portfolioByAgent;
  }

  handleChangeChartType(type: string) {
    this.chartType = type;
  }

  /**
   * Get percentage of a value
   * @param value Value
   * @param total Total
   */
  private getPercentage(value: any, total: any) {
    return value * 100 / total;
  }

  /**
   * this method set up the variables for group admin agent role
   */
  setUpGroupAdminAgent() {
    if (this.currentUserRoleId === '8') {
      this.isGroupAdminAgent = true;
      this.quantityType = QuantityType.POLICIES_COUNT;
      this.getAgentPortfolio();
    }
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  /**
   * Check ig agent has sub agents
   */
  checkIfAgentHasSubagents(subAgents) {
    return (subAgents.length > 0);
  }

  addSubAgentItemsToPortfolio(subAgents) {
    subAgents.forEach(subAgent => {
      this.updatePortfolioByAgentWithSubAgentData(subAgent.portfolio);
    });
  }

  updatePortfolioByAgentWithSubAgentData(subAgentPortfolio) {
    const subAgentPortfolioDetail = this.addItemToDetailsPortfolio(subAgentPortfolio, subAgentPortfolio.agentId);
    this.portfolioReport.active += subAgentPortfolioDetail.active;
    this.portfolioReport.cancelled += subAgentPortfolioDetail.cancelled;
    this.portfolioReport.gracePeriod += subAgentPortfolioDetail.gracePeriod;
    this.portfolioReport.lapsed += subAgentPortfolioDetail.lapsed;
    this.portfolioReport.pendingPayment += subAgentPortfolioDetail.pendingPayment;
    this.portfolioReport.pendingOther += subAgentPortfolioDetail.pendingOther;
    this.portfolioReport.inactive += subAgentPortfolioDetail.inactive;
    this.portfolioReport.total += subAgentPortfolioDetail.total;
  }
}
