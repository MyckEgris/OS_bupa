/**
* ViewCommissionComponent.ts
*
* @description: This component handles agent and hierarchy agent commissions.
* @author Ivan Hidalgo.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 05-05-2019.
*
**/

import { ActivatedRoute, Router } from '@angular/router';
import { QuantityType } from './../../shared/services/agent/entities/quantity-type.enum';
import { SubAgent } from './../../shared/services/agent/entities/subagent';
import { Agent } from 'src/app/shared/services/agent/entities/agent';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { AuthService } from './../../security/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { ViewPortfolio, PortfolioByAgent } from './view-portfolio.model';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { MyPortfolioService } from 'src/app/security/services/my-portfolio/my-portfolio.service';
import { MyPortfolioModel, AgentIdModel } from 'src/app/security/model/my-portfolio.model';

/**
 * This component handles agent and hierarchy agent commissions.
 */
@Component({
  selector: 'app-view-portfolio',
  templateUrl: './view-portfolio.component.html'
})
export class ViewPortfolioComponent implements OnInit {

  /**
   * Agent object
   */
  public agent: Agent;

  /**
   * Subagents array
   */
  public subagents: SubAgent[];

  /**
   * Array for calculate and show subagents information
   */
  public viewPortfolio: ViewPortfolio[];

  /**
   * Array for calculate and show agent summary information
   */
  public viewSummaryPortfolio: ViewPortfolio[];

  /**
   * Parameter quantity type for show premiums or policies
   */
  public quantityType: string;

  /**
   * Address
   */
  public address: string;

  /**
   * City
   */
  public city: string;

  /**
   * Country
   */
  public country: string;

  /**
   * State
   */
  public state: string;

  /**
   * Zip code
   */
  public zip: string;

  /**
   * Complete physical address
   */
  public completePhysicalAddress = '';

  /**
   * Email
   */
  public email: string;

  /**
   * Phone
   */
  public phone: string;

  /**
   * general result of total 'ME' plus total 'My Agents'
   */
  public total: number;

  /**
   * Currency Symbol
   */
  public currencySymbol: string;

  /**
   * Portfolio object for show chart data from 'ME'
  */
  public portfolioByAgent: PortfolioByAgent[] = [];

  /**
   * Portfolio object for show chart data from 'My Agents'
   */
  public portfolioByAgents: PortfolioByAgent[] = [];

  /**
   * Child agent
   */
  public childAgent: any;

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
   * Me label
   */
  public me = '';

  /**
   * My Agents label
   */
  public my_agents = '';

  /**
   * Agent or company name to header information
   */
  public agentOrCompanyName = '';

  /**
   * Has result for the Agent
   */
  public hasResult = false;

  /**
   * Has subagents for the agent
   */
  public hasSubagents = false;

  /**
   * Detail url for subagent link
   */
  public childUrl = '';

  /**
   * Agent Id
   */
  public agentId = '';

  /**
   * agent country
  */
  public agentCountry = '';

  /**
   * translateKeys
   */
  public translateKeys: Array<any>;

  /**
   * Constant for error status 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Constant for group admin
   */
  private GROUP_ADMIN_ROLE = 'GroupAdmin';

  /**
   * Business exception message title
   */
  private BUSINESS_EXCEPTION_TITLE = 'Business Exception';

  /**
   * option physical address from agent addresses
   */
  private PHYSICAL_ADDRESS = 'Physical';

  /**
   * option preferred email from agent emails
   */
  private PREFERRED_EMAIL = 'Preferred Email';

  /**
   * option office phone from agent phones
   */
  private OFFICE_PHONE = 'Office';

  /**
   * View summary portfolio array position for ME
   */
  private SUMMARY_POSITION_FOR_AGENT = '0';

  /**
   * View summary portfolio array position for My Agents
   */
  private SUMMARY_POSITION_FOR_MY_AGENTS = '1';

  /**
   * rootAgentId
   */
  private rootAgentId: string;

  /**
   * agentsStoareged AgentIdModel[]
   */
  private agentsStoareged: AgentIdModel[] = [];

  /**
   * Constructor Method
   * @param authService Auth Service Injection
   * @param agentService Agent Service Injection
   * @param route ActivatedRoute Injection
   * @param translate Translate Injection
   * @param notification Notification Service Injection
   * @param translation Translation Service Injection
   * @param service MyPortfolio Service Injection
   * @param router Router Injection
   */
  constructor(
    private authService: AuthService,
    private agentService: AgentService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private notification: NotificationService,
    private translation: TranslationService,
    private service: MyPortfolioService,
    private router: Router
  ) {
    this.loadInitValues();
  }

  /**
   * Trigger search of agent's portfolio by money as default option
   */
  async ngOnInit() {
    this.translateKeys = await this.getPortfolioTranslations();
    const agentStoraged = this.service.getMyPortfolioFromReduxStorage();
    if (agentStoraged === undefined) {
      this.agentId = this.authService.getUser().agent_number;
    } else {
      this.agentId = agentStoraged.currentAgentId;
      this.rootAgentId = agentStoraged.rootAgentId;
      this.agentsStoareged = agentStoraged.agents;
    }

    this.agentCountry = this.authService.getUser().cc;
    this.childUrl = 'agents/view-portfolio';
    this.initSearchAccordinRole();
    this.translate.onLangChange.subscribe(() => {
      this.getPortfolioTranslations().then(translatedKeys => {
        this.translateKeys = translatedKeys;
        this.searchPortfolioByAgent();
      });
    });
  }

  /**
   * Load values for init and destroy memory
   */
  loadInitValues() {
    this.agent = {} as Agent;
    this.subagents = [];
    this.viewSummaryPortfolio = [];
    this.viewPortfolio = [];
    this.total = 0;
    this.currencySymbol = '';
    this.childAgent = null;
    this.agentsStoareged = [];
  }

  /**
   * Get Portfolio translated keys asyncronously
   */
  async getPortfolioTranslations() {
    return await this.agentService.getPortfolioTranslations(this.translation.getLanguage());
  }

  /**
   * Init search for policy if role is GroupAdmin, for premium id roles are Agent or AgentAssistant
   */
  initSearchAccordinRole() {
    const currentRole = this.authService.getUser().role;
    this.quantityType = currentRole === this.GROUP_ADMIN_ROLE ? QuantityType.POLICIES_COUNT : QuantityType.MONEY;
    if (currentRole === this.GROUP_ADMIN_ROLE) {
      this.searchPortfolioWithPoliciesInformation();
    } else {
      this.searchPortfolioWithMoneyInformation();
    }
  }

  /**
   * Search portfolio, switching if search is by authenticated agent or by child agent
   */
  searchPortfolioByAgent() {
    this.initComponentVariables();
    this.getTranslatedGeneralKeys();
    this.route.params.subscribe(parameters => {
      if (parameters.parent && parameters.subagent) {
        this.childAgent = parameters.subagent;
      }
      this.getAgentInformation(this.agentId);
    });
  }

  /**
   * Initialize arrays
   */
  initComponentVariables() {
    this.agent = {} as Agent;
    this.hasResult = false;
    this.hasSubagents = false;
    this.viewPortfolio = [];
    this.viewSummaryPortfolio = [];
    this.portfolioByAgent = [];
    this.portfolioByAgents = [];
  }

  /**
   * Search portfolio information by money
   */
  searchPortfolioWithMoneyInformation() {
    this.quantityType = QuantityType.MONEY;
    this.searchPortfolioByAgent();
    return false;
  }

  /**
   * Search portfolio information by policies count
   */
  searchPortfolioWithPoliciesInformation() {
    this.quantityType = QuantityType.POLICIES_COUNT;
    this.searchPortfolioByAgent();
    return false;
  }

  /**
   * Call service getAgentById and Call getPortfolioByAgent service method
   * @param agentId Agent Id
   */
  getAgentInformation(agentId?: string) {
    if (!agentId || agentId === '') {
      agentId = this.authService.getUser().agent_number;
    }
    this.agentService.getAgentById(agentId).subscribe(agent => {
      this.hasResult = true;
      this.agent = agent;
      this.getPhysicalAddress(agent);
      this.getPreferredEmail(agent);
      this.getOfficePhone(agent);
      this.getPortfolioByAgent(agent);
      this.agentOrCompanyName = this.chooseCompanyOrPersonName(agent);
    },
      error => {
        if (this.checksIfHadBusinessError(error)) {
          this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, this.getBusinessErrorMessage(error.error.code));
        } else if (this.checksIfHadNotFoundError(error)) {
          this.hasResult = false;
        }
      });
  }

  /**
   * Get business error message
   * @param code Error Code
   */
  getBusinessErrorMessage(code: string) {
    let errorMessage = '';
    this.translate.get(`AGENT.PORTFOLIO.BUSINESS_ERRORS.${code}`).subscribe(message => {
      errorMessage = message;
    });

    return errorMessage;
  }

  /**
   * Choose company name or person name with first name - middle name - last name
   * @param agent Agent
   */
  chooseCompanyOrPersonName(agent: Agent) {
    return agent.companyName || agent.companyName !== '' ? agent.companyName
      : `${agent.firstName} ${agent.middleName} ${agent.lastName}`;
  }

  /**
   * Get physical address from agent addresses
   * @param agent Agent
   */
  getPhysicalAddress(agent: Agent) {
    const agentAddress = agent.addresses.find(address => address.type === this.PHYSICAL_ADDRESS);
    if (agentAddress) {
      this.address = agentAddress.addressLine;
      this.city = agentAddress.city;
      this.country = agentAddress.country;
      this.state = agentAddress.state;
      this.zip = agentAddress.zipCode;
      this.completePhysicalAddress = `${this.address}<br>${this.city}, ${this.country}<br>${this.state} - ${this.zip}`;
    }
  }

  /**
   * Get preferred email from agent emails
   * @param agent Agent
   */
  getPreferredEmail(agent: Agent) {
    const agentEmail = agent.emails.find(email => email.type === this.PREFERRED_EMAIL);
    if (agentEmail) {
      this.email = agentEmail.eMailAddress;
    }
  }

  /**
   * Get office phone from agent phones
   * @param agent Agent
   */
  getOfficePhone(agent: Agent) {
    const agentPhone = agent.phones.find(phone => phone.type === this.OFFICE_PHONE);
    if (agentPhone) {
      this.phone = agentPhone.phoneNumber;
    }
  }

  /**
   * Call get portfolio by agent service method and put data to show in summary portfolio and show details
   * with summary information of agent and agent's child
   * @param agent Agent
   */
  getPortfolioByAgent(agent: Agent) {
    this.agentService.getPortfolioByAgent(agent.agentId.toString(), this.quantityType).subscribe(
      data => {
        this.addAndCalculateItemToSummaryPortfolio(data.portfolio, this.me, true);
        const summaryPortfolioForMe = this.viewSummaryPortfolio[this.SUMMARY_POSITION_FOR_AGENT];
        this.currencySymbol = summaryPortfolioForMe.symbol ? summaryPortfolioForMe.symbol : 'USD';
        this.portfolioByAgent = this.buildPortfolioChartInstance(summaryPortfolioForMe);
        this.total = summaryPortfolioForMe.total;
        this.subagents = data.subAgents;
        if (this.checkIfAgentHasSubagents()) {
          this.hasSubagents = true;
          this.calculateMyAgentsSummaryInformation(data);
          const summaryPortfolioForMyAgents = this.viewSummaryPortfolio[this.SUMMARY_POSITION_FOR_MY_AGENTS];
          this.total = summaryPortfolioForMe.total + summaryPortfolioForMyAgents.total;
          this.portfolioByAgents = this.buildPortfolioChartInstance(summaryPortfolioForMyAgents);
        }
      },
      error => {
        if (this.checksIfHadBusinessError(error)) {
          this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, this.getBusinessErrorMessage(error.error.code));
        } else if (this.checksIfHadNotFoundError(error)) {
          this.hasSubagents = false;
        }
      }
    );
  }

  /**
   * Check ig agent has sub agents
   */
  checkIfAgentHasSubagents() {
    return (this.subagents.length > 0);
  }

  /**
   * Calculate summary portfolio for my agents (second row) and calculate details table
   * @param agent Agent
   */
  calculateMyAgentsSummaryInformation(agent: Agent) {
    for (const subAgent of agent.subAgents) {
      this.addAndCalculateItemToSummaryPortfolio(subAgent.portfolio, this.my_agents, false);
      this.addItemToDetailsPortfolio(subAgent.portfolio, subAgent.agentId);
    }
  }

  /**
   * Add item to summary array for agent row or child row according is parent agent
   * @param item portfolio item
   * @param itemTitle label to show in agent column
   * @param isParentAgent checks if agent is the authenticated or is a child
   */
  addAndCalculateItemToSummaryPortfolio(item, itemTitle, isParentAgent) {
    if (!isParentAgent) {
      if (this.viewSummaryPortfolio.length > 1) {
        let itemValue = this.viewSummaryPortfolio[1];
        itemValue = this.agentService.addAndCalculateItemToSummaryPortfolio(item, itemValue, this.pendingEvaluation,
          this.pendingInformation, this.pendingOther, this.rejected, this.cancelled);
      } else {
        this.addItemToSummaryPortfolio(item, itemTitle);
      }
      return;
    }

    this.addItemToSummaryPortfolio(item, itemTitle);

  }

  /**
   * Add item to summary portfolio
   * @param item Item
   * @param itemTitle ItemTitle
   */
  addItemToSummaryPortfolio(item, itemTitle) {
    this.viewSummaryPortfolio.push(
      this.agentService.addItemToSummaryPortfolio(item, itemTitle, this.pendingEvaluation, this.pendingInformation,
        this.pendingOther, this.rejected, this.cancelled)
    );
  }

  /**
   * Add item to details array for each agent's child
   * @param item portfolio item
   * @param agentId Agent id
   */
  addItemToDetailsPortfolio(item, agentId) {
    this.viewPortfolio.push(
      this.agentService.addItemToDetailsPortfolio(item, agentId, this.pendingEvaluation, this.pendingInformation, this.pendingOther,
        this.rejected, this.cancelled)
    );
  }

  /**
   * Build instance for chart widget
   * @param portfolio portfolio item
   */
  buildPortfolioChartInstance(portfolio) {

    const translatedLabels = this.translatePortfolioChartInstance();

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
      typePortfolio: translatedLabels[4],
      val: this.getPercentage(portfolio.inactive, portfolio.total)
    }, {
      typePortfolio: translatedLabels[5],
      val: this.getPercentage(portfolio.lapsed, portfolio.total)
    }];
    return portfolioByAgent;
  }

  /**
   * Translate keys for general information, likes popovers labels and chart titles
   */
  getTranslatedGeneralKeys() {
    const keysByLang = this.translateKeys.find(t => t.lang === this.translation.getLanguage());
    if (keysByLang) {
      this.me = keysByLang.values.find(v => v.key === 'ME').value;
      this.my_agents = keysByLang.values.find(v => v.key === 'MY_AGENTS').value;
      this.pendingEvaluation = keysByLang.values.find(v => v.key === 'PENDING_EVALUATION').value;
      this.pendingInformation = keysByLang.values.find(v => v.key === 'PENDING_INFORMATION').value;
      this.pendingOther = keysByLang.values.find(v => v.key === 'PENDING_OTHER').value;
      this.rejected = keysByLang.values.find(v => v.key === 'REJECTED').value;
      this.cancelled = keysByLang.values.find(v => v.key === 'CANCELLED').value;
      this.lapsed = keysByLang.values.find(v => v.key === 'LAPSED').value;
    }
  }

  /**
   * Translate portfolio chart indicators
   */
  translatePortfolioChartInstance() {
    const returnTranslated = [];
    const root = 'AGENT.PORTFOLIO.GRID_INFORMATION.';
    const chartLabels = [
      `${root}ACTIVE`,
      `${root}GRACE_PERIOD`,
      `${root}PENDING_PAYMENT`,
      `${root}PENDING_OTHERS`,
      `${root}CANCELLED`,
      `${root}LAPSED`
    ];

    for (const key of chartLabels) {
      this.translate.get(key).subscribe(value => {
        returnTranslated.push(value);
      });
    }

    return returnTranslated;
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
   * Check if response has error code to show business exception
   * @param error Http Error
   */
  checksIfHadBusinessError(error) {
    return error.error.code;
  }

  /**
   * Check if status is 404 and show message for data not found
   * @param error Http Error
   */
  checksIfHadNotFoundError(error) {
    return (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND);
  }

  /**
   * Navigate for the different choosen agents
   * @param agentId Agent Id
   */
  navigate(agentId) {
    const portfolioInstance = {} as MyPortfolioModel;
    const defaultAgentIdModel = {} as AgentIdModel;
    const agentIdModel = {} as AgentIdModel;
    if (this.rootAgentId === undefined) {
      portfolioInstance.rootAgentId = this.agentId;
      defaultAgentIdModel.agentId = this.agentId;
      portfolioInstance.agents = [];
      portfolioInstance.agents.push(defaultAgentIdModel);
    } else {
      portfolioInstance.rootAgentId = this.rootAgentId;
      portfolioInstance.agents = this.agentsStoareged;
    }
    portfolioInstance.currentAgentId = agentId;
    agentIdModel.agentId = agentId;
    portfolioInstance.agents.push(agentIdModel);
    this.service.setMyPortfolioStore(portfolioInstance);

    this.router.navigate(['/' + this.childUrl]);
  }

}
