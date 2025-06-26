import { Component, OnInit, Input } from '@angular/core';
import { AgentService } from '../../shared/services/agent/agent.service';
import { AuthService } from '../../security/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-view-summary-agent-commissions',
  templateUrl: './view-summary-agent-commissions.component.html',
  styleUrls: ['./view-summary-agent-commissions.component.css']
})
export class ViewSummaryAgentCommissionsComponent implements OnInit {

  /**
   * current user id
   */
  @Input() currentUserId: string;

  /**
   * commission date
   */
  public date: Date;

  /**
   * payment type
   */
  public paymentType: string;

  /**
   * payment type
   */
  public paymentTypes: any;

  /**
   * dates object
   */
  public commissionsDates: any[];

  /**
   * commisions group
   */
  public commissionsGroups: any[];

  /**
   * current commision
   */
  public currentCommission: any;

  /**
   * chart type
   */
  public chartType: string;

  /**
   * total
   */
  public total: number;

  /**
   * validate negative values in chart
   */
  public hasNegativeValues: boolean;

  /**
   * validate if there are commissions dates
   */
  public hasCommissionsDates: boolean;

  private agentNumber: string;

  constructor(
    private agentService: AgentService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.date = new Date(1995, 11, 17);
    this.paymentType = '1026';
    this.hasNegativeValues = false;
    this.agentNumber = this.authService.getUser().agent_number;
    this.chartType = 'doughnut';
    this.paymentTypes = this.agentService.setUpPaymentTypes();
    this.getCommissionDatesAndPaymentTypesBySelectedAgent(+this.agentNumber);
    this.commissionsGroups = [];
    this.commissionsDates = [];
    this.total = 0;
    this.translate.onLangChange.subscribe(() => {
      if (this.commissionsGroups.length > 0) {
        this.commissionsGroups = this.agentService.translateCommisionsGrapLabels(this.commissionsGroups);
        this.getAgentCommissions(this.currentCommission);
      }
    });
  }

  /**
   * get agent portfolio
   */
  getAgentCommissions(paymentId) {
    this.agentService.getCommissionPaymentsByDateAndPaymentType(+this.agentNumber, paymentId).subscribe(
      data => {
        this.hasNegativeValues = false;
        this.commissionsGroups = this.agentService.groupCommissionType(data.commissionPayments[0].commissions);
        this.total = this.agentService.getCommissionsTotal(data.commissionPayments[0].commissions);
        this.paymentType = this.paymentTypes['paymentType'];
        this.validateNegativeValues(this.commissionsGroups);
      }
    );
  }

  getCommissionDatesAndPaymentTypesBySelectedAgent(agentId) {
    this.agentService.getCommisionDatesAndPaymentTypeByAgent(agentId).subscribe(
      results => {
        this.hasCommissionsDates = true;
        this.commissionsDates = results.commissionPayments;
        this.commissionsDates.sort((x, y) => new Date(y.paymentDate).getTime() - new Date(x.paymentDate).getTime());
        this.currentCommission = results.commissionPayments[0].paymentId;
        this.getAgentCommissions(results.commissionPayments[0].paymentId);
      }, error => {
        this.hasCommissionsDates = false;
      });
  }

  handleDateChange(commission) {
    this.currentCommission = commission;
    this.getAgentCommissions(+commission);
  }

  handleChangeChartType(type: string) {
    this.chartType = type;
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  orderCommissionsBydate(commissions) {
    commissions.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return (dateA < dateB);
    });
  }

  /**
   * validate negative values in chart data
   * @param array commissions array
   */
  validateNegativeValues(array) {
    array.forEach(element => {
      if (element.total < 0) {
        this.hasNegativeValues = true;
      }
    });
  }
}
