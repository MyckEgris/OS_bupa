/**
* ViewCommissionComponent.ts
*
* @description: This component handles agent paid commissions.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 12-02-2019.
*
**/

import { CommissionDetailSummary } from './../../shared/services/agent/entities/commission-detail-summary';
import { Agent } from './../../shared/services/agent/entities/agent';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { Component, OnInit } from '@angular/core';
import { CommissionPayment } from 'src/app/shared/services/agent/entities/commission-payment';
import * as $ from 'jquery';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { Utilities } from 'src/app/shared/util/utilities';
/**
 * This component handles agent paid commissions.
 */
@Component({
  selector: 'app-view-commission',
  templateUrl: './view-commission.component.html'
})
export class ViewCommissionComponent implements OnInit {


  /**
   * Agent
   */
  public agent: Agent;

  /**
   * Loaded data
   */
  public loaded = false;

  /**
   * Error
   */
  public error: string;

  /**
   * commissionPayments
   */
  public commissionPayments: Array<CommissionPayment> = [];

  /**
   * hierarchyByAgent
   */
  public hierarchyByAgent: Array<any> = [];

  /**
   * commissionSummary
   */
  public commissionSummary: CommissionDetailSummary;

  /**
   * formCommissions
   */
  public formCommissions: FormGroup;

  private FIRST_LEVEL_FOR_COLLAPSE = 'level1';

  private SECOND_LEVEL_FOR_COLLAPSE = 'level2';

  private COLLAPSE_ELEMENT_FIRST_LEVEL_ROOT_ID = 'collapse';

  private COLLAPSE_ELEMENT_SECOND_LEVEL_ROOT_ID = 'collapsedet';

  private ARROW_FIRST_LEVEL_ROOT_ID = 'arrow';

  private ARROW_SECOND_LEVEL_ROOT_ID = 'arrowdet';

  private ARROW_DIRECTION_DOWN = 'keyboard_arrow_down';

  private ARROW_DIRECTION_UP = 'keyboard_arrow_up';

  /**
   * Constant for type PDF
   */
  private PDF_APPLICATION_RESPONSE = 'application/pdf';

  /**
   * Constructor method
   * @param agentService AgentService Injection
   * @param notificationService NotificationService Injection
   */
  constructor(
    private translationService: TranslationService,
    private agentService: AgentService,
    private authService: AuthService) { }

  /**
   * Build form and execute service
   */
  ngOnInit() {
    const agentNumber = this.authService.getUser().agent_number;
    this.formCommissions = this.buildFormCommission();
    this.getAgentById(agentNumber);
  }

  /**
   * Get agent by ID
   * @param agentId Agent ID
   */
  getAgentById(agentId) {
    this.agentService.getAgentById(agentId).subscribe(agent => {
      this.agent = agent;
      this.getHierarchyByAgent(agent);
    }, error => {
      this.handleError404(error);
    });
  }

  /**
   * Get hierarchy by agent
   * @param currentAgent Agent
   */
  getHierarchyByAgent(currentAgent: Agent) {
    this.hierarchyByAgent = [];
    this.agentService.getAgentHierarchyById(currentAgent.agentId.toString()).subscribe(data => {
      data.unshift(currentAgent);
      this.hierarchyForAgent(data);
    }, error => {
      this.handleHierarchy404(error, currentAgent);
    });
  }

  /**
   * Prepare hierarchy for agent if exists, or define current agent as unique hierarchy
   * @param data Data
   */
  hierarchyForAgent(data) {
    this.hierarchyByAgent = data.map(agent => {
      return {
        agentId: agent.agentId,
        companyName: `${this.agentService.getAgentName(agent)} - ${agent.agentId}`
      };
    });
    this.formCommissions.controls['agent'].setValue(this.hierarchyByAgent[0].agentId);
    this.getCommissionDatesAndPaymentTypesBySelectedAgent(this.hierarchyByAgent[0]);
  }

  /**
   * Get commission dates and payment types
   * @param agent Agent
   */
  getCommissionDatesAndPaymentTypesBySelectedAgent(agent) {
    agent.agentId = this.verifyIfAgentIsNotNull(agent);
    this.commissionPayments = [];
    this.agentService.getCommisionDatesAndPaymentTypeByAgent(agent.agentId).subscribe(
      results => {
        this.commissionPayments = results.commissionPayments;
        this.commissionPayments.sort((x, y) => new Date(y.paymentDate).getTime() - new Date(x.paymentDate).getTime());
        this.formCommissions.controls['date'].setValue(this.commissionPayments[0].paymentId);
        this.loaded = true;
        this.getCommissionDetails(this.formCommissions.value);
      }, error => {
        this.handleError404(error);
      });
  }

  /**
   * Verify if agent is not null
   * @param agent Agent
   */
  verifyIfAgentIsNotNull(agent) {
    return (!agent ? this.authService.getUser().agent_number : agent.agentId);
  }

  /**
   * Execute commissions service
   * @param formCommissionValues FormGroup
   */
  getCommissionDetails(formCommissionValues) {
    this.agentService.getCommissionPaymentsByDateAndPaymentType(formCommissionValues.agent, formCommissionValues.date).subscribe(data => {
      this.commissionSummary = this.agentService.createCommissionDetailsObject(data.commissionPayments);
    });
  }

  /**
   * Build Form
   */
  private buildFormCommission() {
    return new FormGroup(
      {
        agent: new FormControl(null),
        date: new FormControl(null)
      }
    );
  }

  /**
   * On Change event of agent
   * @param event Event
   */
  onAgentChange(event) {
    this.getCommissionDatesAndPaymentTypesBySelectedAgent(event);
  }

  /**
   * Handle error 404 for not found data
   * @param error Error
   */
  handleError404(error) {
    this.error = error.error.message;
    this.commissionSummary = null;
  }

  /**
   * Error handler for hierarchy
   * @param error ErrorResponse
   * @param currentAgent Current Agent
   */
  handleHierarchy404(error, currentAgent) {
    if (error.status === 404) {
      this.hierarchyForAgent([currentAgent]);
    } else {
      this.commissionSummary = null;
    }
  }

  /**
   * Jquery function to collapse accordion
   * @param idElement Elment
   * @param type Type if level 1 or level 2
   */
  collapseElements(idElement, type) {
    const collapseName = (type === this.FIRST_LEVEL_FOR_COLLAPSE ?
      this.COLLAPSE_ELEMENT_FIRST_LEVEL_ROOT_ID : this.COLLAPSE_ELEMENT_SECOND_LEVEL_ROOT_ID);
    const arrowName = (type === this.FIRST_LEVEL_FOR_COLLAPSE ? this.ARROW_FIRST_LEVEL_ROOT_ID : this.ARROW_SECOND_LEVEL_ROOT_ID);
    $(`#${collapseName}-${idElement}`).slideToggle();
    const arrow = $(`#${arrowName}-${idElement}`);
    if (arrow[0].innerHTML === this.ARROW_DIRECTION_DOWN) {
      arrow.html(this.ARROW_DIRECTION_UP);
    } else {
      arrow.html(this.ARROW_DIRECTION_DOWN);
    }
  }

  /**
   * Download a pdf file wit the commision of an agent
   */
  downloadCommissionPDF() {

    const agent = this.formCommissions.value.agent.toString();
    const paymentId = this.formCommissions.value.date.toString();
    const languageId = this.translationService.getLanguageId().toString();

    this.agentService.getDocumentCommision(agent, paymentId, languageId).subscribe(data => {
      const file = new Blob([new Uint8Array(data)], { type: this.PDF_APPLICATION_RESPONSE });
      const fileName = `commissions-${Utilities.generateRandomId()}`;
      saveAs(file, fileName + '.' + 'pdf');
    }, error => {
    });

  }

}
