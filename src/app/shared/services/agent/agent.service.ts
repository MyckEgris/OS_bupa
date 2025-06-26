/**
* AgentService.ts
*
* @description: This class interacts with agent API.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 15-01-2019.
*
**/

import { CommissionDetailGroupPolicy } from './entities/commission-detail-group-policy';
import { CommissionDetailPolicy } from './entities/commission-detail-policy';
import { CommissionDetailConcept } from './entities/commission-detail-concept';
import { CommissionPayment } from './entities/commission-payment';
import { CommissionDetailSummary } from './entities/commission-detail-summary';
import { Commission } from './entities/commision';
import { Utilities } from './../../util/utilities';
import { Injectable } from '@angular/core';
import { Agent } from '../../services/agent/entities/agent';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { map } from 'rxjs/operators';
import { CachingService } from '../caching/caching-service';
import { AgentDto } from './entities/agent.dto';
import { ViewPortfolio } from 'src/app/agent/view-portfolio/view-portfolio.model';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import * as moment from 'moment';

/**
 * This class interacts with agent API.
 */
@Injectable({
  providedIn: 'root'
})
export class AgentService {

  /**
   * Constant for agent root endpoint
   */
  private AGENT = 'agents';

  /**
   * Constant for portfolios endpoint
   */
  private PORTFOLIO = 'portfolios';

  /**
   * Constant for hierarchy endpoint
   */
  private HIERARCHY = 'hierarchy';

  /**
   * Constant for commissionPayments endpoint
   */
  private COMMISSION_PAYMENT = 'commissionPayments';

  /**
   * Constant for commissions endpoint
   */
  private COMMISSIONS = 'commissions';

  /**
   * Param preferredemail
   */
  private PARAM_AGENT_PREFERRED_MAIL = 'preferredemail';

  /**
   * Param quantitytype
   */
  private PARAM_QUANTITY_TYPE = 'quantitytype';

  /**
   * Costant for individual policies
   */
  private CONSTANT_INDIVIDUAL_POLICIES = 0;

  /**
   * Constant for group policies
   */
  private CONSTANT_GROUP_POLICIES = 1;

  /**
   * Constant for subtotal or total initial value in 0
   */
  private CONSTANT_INITIAL_VALUE_ZERO = 0;

  private portfolioTranslations: Array<any>;

  /**
   * Contructor Method
   * @param _http HttpClient Injection
   * @param _config Configuration Service Injection
   * @param _cachingService Cache Service Injection
   * @param translate Translate Service Injection
   */
  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService,
    private _cachingService: CachingService,
    private translate: TranslateService
  ) {
    this.portfolioTranslations = [];
  }

  /**
   * Get Agent status options
   */
  getAgentStatus() {
    return [
      { value: 'select', description: 'CLAIMS.AGENT.STATUS.SELECT' },
      { value: 'paid', description: 'CLAIMS.AGENT.STATUS.PAID' },
      { value: 'pending', description: 'CLAIMS.AGENT.STATUS.PENDING' },
      { value: 'denied', description: 'CLAIMS.AGENT.STATUS.DENIED' },
      { value: 'closed', description: 'CLAIMS.AGENT.STATUS.CLOSED' }
    ];
  }

  /**
   * Get payment status options
   */
  getPaymentMethods() {
    return [
      { value: 'select', description: 'CLAIMS.AGENT.PAYMENTMETHOD.SELECT' },
      { value: 'ach', description: 'CLAIMS.AGENT.PAYMENTMETHOD.ACH' },
      { value: 'check', description: 'CLAIMS.AGENT.PAYMENTMETHOD.CHECK' },
      { value: 'transfer', description: 'CLAIMS.AGENT.PAYMENTMETHOD.TRANSFER' }
    ];
  }

  /**
   * Gets agent information by id.
   * @param id Agent Id.
   */
  getAgentById(id: string, agentPreferredMail?: string): Observable<Agent> {
    const params = this.addParamsToEobRequest(agentPreferredMail);
    return this._cachingService.getCached<Agent>(`${this._config.apiHostAgent}/${this.AGENT}/${id}`, agentPreferredMail ? { params } : {})
      .pipe(
        map(p => (p as any).agent)
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Get agent hierarchy
   * @param id
   */
  getAgentHierarchyById(id: string): Observable<Agent[]> {
    return this._cachingService.getCached<Agent>(`${this._config.apiHostAgent}/${this.AGENT}/${id}/${this.HIERARCHY}`)
      .pipe(
        map(p => (p as any).agents)
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Update agent profile
   * @param agent Agent
   */
  updateAgentProfile(agent: Agent): Observable<any> {
    return this._http.patch(`${this._config.apiHostAgent}/${this.AGENT}`, agent)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get portfolio by agent
   * @param id Agent id
   * @param quantityType Quantity type parameter
   */
  getPortfolioByAgent(id: string, quantityType: string) {
    const params = new HttpParams().set(this.PARAM_QUANTITY_TYPE, quantityType);
    return this._cachingService.getCached<AgentDto>(`${this._config.apiHostAgent}/${this.AGENT}/${id}/${this.PORTFOLIO}`, { params })
      .pipe(map(p => (p as any).agent))
      .pipe(catchError(this.handleError));
  }

  /**
   * Add to summary
   * @param item Item
   * @param itemTitle Item Title
   * @param pending Pending
   * @param information Information
   * @param otherPending Other Pending
   * @param rejected Rejected
   * @param cancelled Cancelled
   */
  addItemToSummaryPortfolio(item, itemTitle, pending, information, otherPending, rejected, cancelled) {
    if (!item) {
      return this.buildEmptyPortfolioItem(itemTitle, pending, information, otherPending, rejected, cancelled);
    }

    return {
      title: itemTitle,
      active: item.activeQuantity,
      gracePeriod: item.graceQuantity,
      lapsed: item.lapsedQuantity,
      pendingPayment: item.pendingPaymentQuantity,
      pendingOther: (item.pendingAppQuantity + item.pendingInfoQuantity + item.pendingOtherQuantity),
      pendingApp: item.pendingAppQuantity,
      pendingInfo: item.pendingInfoQuantity,
      pendingOthers: item.pendingOtherQuantity,
      inactive: (item.rejectedQuantity + item.cancelledQuantity),
      rejected: item.rejectedQuantity,
      cancelled: item.cancelledQuantity,
      total: (item.activeQuantity + item.graceQuantity + item.pendingPaymentQuantity
        + item.cancelledQuantity + item.lapsedQuantity),
      symbol: item.currencySymbol,
    };
  }

  /**
   * Build item when portfolio is null
   * @param itemTitle Item Title
   * @param pending Pending
   * @param information Information
   * @param otherPending Other Pending
   * @param rejected Rejected
   * @param cancelled Cancelled
   */
  buildEmptyPortfolioItem(itemTitle, pending, information, otherPending, rejected, cancelled) {
    const currency = '';

    return {
      title: itemTitle,
      active: 0,
      gracePeriod: 0,
      lapsed: 0,
      pendingPayment: 0,
      pendingOther: 0,
      pendingApp: 0,
      pendingInfo: 0,
      pendingOthers: 0,
      inactive: 0,
      rejected: 0,
      cancelled: 0,
      total: 0,
      symbol: currency,
    };
  }

  /**
   * Add item to details array for each agent's child
   * @param item portfolio item
   * @param agentId Agent id
   */
  addItemToDetailsPortfolio(item, agentId, pending, information, otherPending, rejected, cancelled) {
    if (!item) {
      return this.buildEmptyPortfolioItem(0, pending, information, otherPending, rejected, cancelled);
    }

    return {
      title: agentId,
      agentName: item.agentName,
      active: item.activeQuantity,
      gracePeriod: item.graceQuantity,
      lapsed: item.lapsedQuantity,
      pendingPayment: item.pendingPaymentQuantity,
      pendingOther: (item.pendingAppQuantity + item.pendingInfoQuantity + item.pendingOtherQuantity),
      pendingApp: item.pendingAppQuantity,
      pendingInfo: item.pendingInfoQuantity,
      pendingOthers: item.pendingOtherQuantity,
      inactive: (item.rejectedQuantity + item.cancelledQuantity),
      rejected: item.rejectedQuantity,
      cancelled: item.cancelledQuantity,
      total: (item.activeQuantity + item.graceQuantity + item.pendingPaymentQuantity
        + item.cancelledQuantity + item.lapsedQuantity),
      symbol: item.currencySymbol,
    };
  }

  /**
   * Calculate summary portfolio and add to array
   * @param item Item
   * @param itemValue Item Value
   * @param pending Pending
   * @param information Information
   * @param otherPending Other Pending
   * @param rejected Rejected
   * @param cancelled Cancelled
   */
  addAndCalculateItemToSummaryPortfolio(item, itemValue: ViewPortfolio, pending, information, otherPending, rejected, cancelled) {
    itemValue.active += item.activeQuantity;
    itemValue.gracePeriod += item.graceQuantity;
    itemValue.lapsed += item.lapsedQuantity;
    itemValue.pendingPayment += item.pendingPaymentQuantity;
    itemValue.pendingOther += (item.pendingAppQuantity + item.pendingInfoQuantity + item.pendingOtherQuantity);
    itemValue.pendingApp += item.pendingAppQuantity;
    itemValue.pendingInfo += item.pendingInfoQuantity;
    itemValue.pendingOthers += item.pendingOtherQuantity;
    itemValue.inactive += (item.rejectedQuantity + item.cancelledQuantity);
    itemValue.rejected += item.rejectedQuantity;
    itemValue.cancelled += item.cancelledQuantity;
    itemValue.total += (item.activeQuantity + item.graceQuantity + item.pendingPaymentQuantity
      + item.cancelledQuantity + item.lapsedQuantity);

    return itemValue;
  }

  generalKeysArray() {
    const root = 'AGENT.PORTFOLIO.GRID_INFORMATION.';
    return [
      `${root}ME`,
      `${root}MY_AGENTS`,
      `${root}PENDING_EVALUATION`,
      `${root}PENDING_INFORMATION`,
      `${root}PENDING_OTHER`,
      `${root}REJECTED`,
      `${root}CANCELLED`,
      `${root}LAPSED`,
    ];
  }

  /**
   * Add translated key-value to portfolio translation array
   * @param lang Language
   */
  async addTranslatedKeysForPortfolio(lang) {
    const translation = { lang: '', values: [] };
    translation.lang = lang;
    const keys = this.generalKeysArray();
    for (const key of keys) {
      const keyName = key.split('.').pop();
      const keyValue = await this.translate.get(key).toPromise();
      translation.values.push({ key: keyName, value: keyValue });
    }
    this.portfolioTranslations.push(translation);
  }

  /**
   * Get all portfolio translations
   * @param lang Language
   */
  async getPortfolioTranslations(lang) {
    const existTranslation = this.portfolioTranslations.find(t => t.lang === lang);
    if (!existTranslation) {
      await this.addTranslatedKeysForPortfolio(lang);
    }
    return this.portfolioTranslations;
  }

  /**
   * Get agents dates and payment types
   * @param agentId Agent ID
   */
  getCommisionDatesAndPaymentTypeByAgent(agentId) {
    return this._http.get<AgentDto>(`${this._config.apiHostAgent}/${this.AGENT}/${agentId}/${this.COMMISSION_PAYMENT}`)
      .pipe(map(p => (p as any).agent))
      .pipe(catchError(this.handleError));
  }

  /**
   * Get dates and payment type for filters
   * @param agentId Agent ID
   * @param paymentId Payment ID
   */
  getCommissionPaymentsByDateAndPaymentType(agentId: number, paymentId: number) {
    return this._cachingService.getCached<AgentDto>
      (`${this._config.apiHostAgent}/${this.AGENT}/${agentId}/${this.COMMISSION_PAYMENT}/${paymentId}/${this.COMMISSIONS}`)
      .pipe(map(p => (p as any).agent))
      .pipe(catchError(this.handleError));
  }

  /**
   * Create CommissionDetailSummary with processed data for show in commissions
   * @param commissionPayments CommissionPayment
   */
  createCommissionDetailsObject(commissionPayments: CommissionPayment): CommissionDetailSummary {
    let commissionSummary = this.initCommissionDetailSummary(commissionPayments[0]);
    const commissions: Commission[] = commissionPayments[0].commissions;
    for (const commission of commissions) {
      const existsCommissionType = this.checkIfExistsCommissionTypeForSummary(commissionSummary, commission);
      if (!existsCommissionType) {
        commissionSummary.commissionDetailConcepts.push(this.addConcept(commission));
      } else {
        if (commission.groupId === this.CONSTANT_INDIVIDUAL_POLICIES) {
          const findIndividual = this.findIndividualPolicies(existsCommissionType);
          findIndividual.details.push(this.addPolicyToConcept(commission));
        } else {
          const findGrouping = this.findGroupingPolicies(commissionSummary);
          if (!findGrouping) {
            commissionSummary.commissionDetailConcepts.push(this.addConcept(commission));
          } else {
            const findGroup = this.findGroupPolicy(findGrouping, commission);
            if (!findGroup) {
              findGrouping.commissionDetailGroup.push(this.addGroup(commission));
            } else {
              findGroup.details.push(this.addPolicyToConcept(commission));
            }
          }
        }
      }
    }
    commissionSummary = this.calculateTotalForCommissionSummary(commissionSummary);

    return commissionSummary;
  }

  /**
   * Check, in summary object, if type of commission already exists
   * @param commissionSummary Commission Summary
   * @param commission Commission
   */
  private checkIfExistsCommissionTypeForSummary(commissionSummary, commission) {
    return commissionSummary.commissionDetailConcepts.find(
      x => x.conceptName === commission.commissionType
    );
  }

  /**
   * Find individual Policies
   * @param existsCommissionType Commission Summary
   */
  private findIndividualPolicies(existsCommissionType) {
    return existsCommissionType.commissionDetailGroup.find(x => x.groupId === this.CONSTANT_INDIVIDUAL_POLICIES);
  }

  /**
   * Find group policies in summary object
   * @param commissionSummary Commission Summary
   */
  private findGroupingPolicies(commissionSummary) {
    return commissionSummary.commissionDetailConcepts.find(x => x.groupId === this.CONSTANT_GROUP_POLICIES);
  }

  /**
   * Find a group inside groups of policies of a type of commission
   * @param findGrouping Commission detail group
   * @param commission Commission
   */
  private findGroupPolicy(findGrouping, commission) {
    return findGrouping.commissionDetailGroup.find(x => x.groupId === commission.groupId);
  }

  /**
   * Init commission object
   * @param commissionPayments CommissionPayment
   */
  private initCommissionDetailSummary(commissionPayments: CommissionPayment): CommissionDetailSummary {
    return {
      referenceNumber: commissionPayments.commissions.length > 0 ?
        commissionPayments.commissions[0].paymentNumber.toString() : commissionPayments.paymentId.toString(),
      amount: 0,
      currencyCode: '',
      commissionDetailConcepts: []
    };
  }

  /**
   * Add concept
   * @param commission Commission
   */
  private addConcept(commission: Commission): CommissionDetailConcept {
    const groupToConcept = this.addGroup(commission);
    return {
      conceptId: Utilities.generateRandomId(),
      conceptName: commission.commissionType,
      groupId: commission.groupId === this.CONSTANT_INDIVIDUAL_POLICIES ? this.CONSTANT_INDIVIDUAL_POLICIES : this.CONSTANT_GROUP_POLICIES,
      groupName: commission.groupId === this.CONSTANT_INDIVIDUAL_POLICIES ? 'Individual Policies' : 'Group Policies',
      subtotal: this.CONSTANT_INITIAL_VALUE_ZERO,
      currencyCode: commission.currencyCode,
      commissionDetailGroup: [groupToConcept]
    };
  }

  /**
   * Add group to concept
   * @param commission Commission
   */
  private addGroup(commission: Commission): CommissionDetailGroupPolicy {
    const policyToConcept = this.addPolicyToConcept(commission);
    return {
      groupId: commission.groupId,
      groupName: commission.groupName,
      subtotal: this.CONSTANT_INITIAL_VALUE_ZERO,
      currencyCode: commission.currencyCode,
      details: [policyToConcept]
    };
  }

  /**
   * Add policy to concept
   * @param detailPolicy Commission
   */
  private addPolicyToConcept(detailPolicy): CommissionDetailPolicy {
    return {
      commissionType: detailPolicy.commissionType,
      eligibilityDate: detailPolicy.eligibilityDate,
      previousPolicyId: detailPolicy.previousPolicyId,
      commissionDescription: detailPolicy.commissionDescription,
      policyReferenceId: detailPolicy.policyReferenceId,
      policyId: detailPolicy.policyId,
      paymentMethod: detailPolicy.paymentMode,
      paymentMethodId: detailPolicy.paymentModeAbbr,
      policyOwnerFullName: detailPolicy.policyOwnerFullName,
      commissionablePremiumValue: detailPolicy.commissionablePremiumValue,
      commissionPercentage: detailPolicy.commissionPercentage,
      commissionTotal: detailPolicy.commissionTotal,
      agentName: detailPolicy.policyAgentName,
      agentId: detailPolicy.policyAgentId,
      currencyCode: detailPolicy.currencyCode,
      invoiceNbr: detailPolicy.invoiceNbr,
      subtotal: detailPolicy.subtotal,
      iva: detailPolicy.iva,
      retentionIVA: detailPolicy.retentionIVA,
      retentionISR: detailPolicy.retentionISR
    };
  }

  /**
   * Calculate totals
   * @param summary CommissionDetailSummary
   */
  private calculateTotalForCommissionSummary(summary: CommissionDetailSummary) {
    for (const concept of summary.commissionDetailConcepts) {
      for (const group of concept.commissionDetailGroup) {
        for (const detail of group.details) {
          group.subtotal += detail.commissionTotal;
        }
        concept.subtotal += group.subtotal;
      }
      summary.amount += concept.subtotal;
      summary.currencyCode = concept.currencyCode;
    }
    return summary;
  }

  /**
   * Adds params to agent request
   * @param agentUserId Agent Preferred Email.
   */
  private addParamsToEobRequest(agentPreferredMail: string): HttpParams {
    return new HttpParams()
      .set(this.PARAM_AGENT_PREFERRED_MAIL, agentPreferredMail);
  }

  /**
   * PENDIENTE!!! Encapsular nombre teniendo en cuenta hacer trim
   * @param agent Agent
   */
  getAgentName(agent: Agent) {
    if (agent.agentName) {
      return agent.agentName;
    }
    return agent.companyName === '' ? `${agent.firstName} ${agent.lastName}` : agent.companyName;
  }

  /**
   * Group commision type
   */
  groupCommissionType(commissions) {
    const nbIndividual = this.setUpCommissionsType('New Individual', 0, 0, 'AGENT.HOME.COMMISSIONS.NB_INDIVIDUAL');
    const nbGroup = this.setUpCommissionsType('New Group', 0, 0, 'AGENT.HOME.COMMISSIONS.NB_GROUP');
    const rnIndividual = this.setUpCommissionsType('Renewal Individual', 0, 0, 'AGENT.HOME.COMMISSIONS.RN_INDIVIDUAL');
    const rnGroup = this.setUpCommissionsType('Renewal Group', 0, 0, 'AGENT.HOME.COMMISSIONS.RN_GROUP');
    const adjIndividual = this.setUpCommissionsType('Adjustment Individual', 0, 0, 'AGENT.HOME.COMMISSIONS.ADJ_INDIVIDUAL');
    const adjGroup = this.setUpCommissionsType('Adjustment Group', 0, 0, 'AGENT.HOME.COMMISSIONS.ADJ_GROUP');
    const nbIndividualIhi = this.setUpCommissionsType('New Individual IHI', 0, 0, 'AGENT.HOME.COMMISSIONS.NB_INDIVIDUAL_IHI');
    const nbGroupIhi = this.setUpCommissionsType('New Group IHI', 0, 0, 'AGENT.HOME.COMMISSIONS.NB_GROUP_IHI');
    const rnIndividualIhi = this.setUpCommissionsType('Renewal Individual IHI', 0, 0, 'AGENT.HOME.COMMISSIONS.RN_INDIVIDUAL_IHI');
    const rnGroupIhi = this.setUpCommissionsType('Renewal Group IHI', 0, 0, 'AGENT.HOME.COMMISSIONS.RN_GROUP_IHI');
    const adjIndividualIhi = this.setUpCommissionsType('Adjustment Individual IHI', 0, 0, 'AGENT.HOME.COMMISSIONS.ADJ_INDIVIDUAL_IHI');
    const adjGroupIhi = this.setUpCommissionsType('adjustment Group', 0, 0, 'AGENT.HOME.COMMISSIONS.ADJ_GROUP_IHI');
    let total = 0;
    commissions.forEach(element => {
      total += element.commissionTotal;
      switch (element.commissionType) {
        case 'NB Commissions':
          if (element.groupId === 0) {
            nbIndividual.total += element.commissionTotal;
          } else {
            nbGroup.total += element.commissionTotal;
          }
          break;
        case 'RN Commissions':
          if (element.groupId === 0) {
            rnIndividual.total += element.commissionTotal;
          } else {
            rnGroup.total += element.commissionTotal;
          }
          break;
        case 'ADJ Commissions':
          if (element.groupId === 0) {
            adjIndividual.total += element.commissionTotal;
          } else {
            adjGroup.total += element.commissionTotal;
          }
          break;
        case 'NB Commissions IHI':
          if (element.groupId === 0) {
            nbIndividualIhi.total += element.commissionTotal;
          } else {
            nbGroupIhi.total += element.commissionTotal;
          }
          break;
        case 'RN Commissions IHI':
          if (element.groupId === 0) {
            rnIndividualIhi.total += element.commissionTotal;
          } else {
            rnGroupIhi.total += element.commissionTotal;
          }
          break;
        case 'ADJ Commissions IHI':
          if (element.groupId === 0) {
            adjIndividualIhi.total += element.commissionTotal;
          } else {
            adjGroupIhi.total += element.commissionTotal;
          }
          break;
      }
    });
    nbIndividual.val = (nbIndividual.total * 100) / total;
    nbGroup.val = (nbGroup.total * 100) / total;
    rnIndividual.val = (rnIndividual.total * 100) / total;
    rnGroup.val = (rnGroup.total * 100) / total;
    adjIndividual.val = (adjIndividual.total * 100) / total;
    adjGroup.val = (adjGroup.total * 100) / total;
    nbIndividualIhi.val = (nbIndividualIhi.total * 100) / total;
    nbGroupIhi.val = (nbGroupIhi.total * 100) / total;
    rnIndividualIhi.val = (rnIndividualIhi.total * 100) / total;
    rnGroupIhi.val = (rnGroupIhi.total * 100) / total;
    adjIndividualIhi.val = (adjIndividualIhi.total * 100) / total;
    adjGroupIhi.val = (adjGroupIhi.total * 100) / total;
    const commisionsGrop = [nbIndividual, nbGroup, rnIndividual, rnGroup, adjIndividual, adjGroup, nbIndividualIhi,
      nbGroupIhi, rnIndividualIhi, rnGroupIhi, adjIndividualIhi, adjGroupIhi];
    return this.translateCommisionsGrapLabels(commisionsGrop);
  }

  /**
   * setUp chart element
   * @param typePortfolio chart string
   * @param val chart percentage
   * @param total total amount
   * @param label translate label
   */
  setUpCommissionsType(typePortfolio, val, total, label) {
    return {
      'typePortfolio': typePortfolio, 'val': val, 'total': total,
      'transLabel': label
    };
  }

  /**
   * Get total for commission
   * @param commissions Commissions for agent
   */
  getCommissionsTotal(commissions) {
    let total = 0;
    commissions.forEach(element => {
      total += element.commissionTotal;
    });
    return total;
  }

  /**
   * Set payment types
   */
  setUpPaymentTypes() {
    const returnTranslated = {};
    const root = 'AGENT.HOME.COMMISSIONS.';
    const chartLabels = [
      'ACH',
      'WIRE_TRANSFER',
      'CHECK'
    ];

    for (const key of chartLabels) {
      this.translate.get(root + key).subscribe(value => {
        returnTranslated[key] = value;
      });
    }
    return returnTranslated;
  }

  /**
   * Get translate for Graph labels
   * @param commissions Commissions
   */
  translateCommisionsGrapLabels(commissions) {
    const newCommissions = commissions;
    newCommissions.forEach((commission, i) => {
      this.translate.get(commission.transLabel).subscribe(value => {
        newCommissions[i].typePortfolio = value;
      });
    });
    return newCommissions;
  }

  /**
   * Translate label for portfolio chart
   */
  translatePortfolioChartInstance() {
    const returnTranslated = [];
    const root = 'AGENT.PORTFOLIO.GRID_INFORMATION.';
    const chartLabels = [
      `${root}ACTIVE`,
      `${root}GRACE_PERIOD`,
      `${root}PENDING_PAYMENT`,
      `${root}PENDING_OTHERS`,
      `${root}INACTIVE`,
      `${root}LAPSED`,
      `${root}CANCELLED`
    ];

    for (const key of chartLabels) {
      this.translate.get(key).subscribe(value => {
        returnTranslated.push(value);
      });
    }

    return returnTranslated;
  }

  /**
   * sort commissions date array
   */
  sortCommissionsArrayByDate(array) {
    array.sort((x, y) => new Date(y.paymentDate).getTime() - new Date(x.paymentDate).getTime());
  }

  /**
   * Get Hierarchy including authenticated agent
   * @param agentId Current AgentID
   */
  async getHierarchyIncludingCurrentAgent(agentId) {
    let returnHierarchy: Array<Agent> = [];
    const currentAgent = await this.getAgentById(agentId).toPromise();

    this.getAgentHierarchyById(agentId).subscribe(
      hierarchy => {
        returnHierarchy = hierarchy;
        // returnHierarchy.unshift(currentAgent);
      },
      error => {
        if (error.status === 404) {
          returnHierarchy.push(currentAgent);
        }
      });

    returnHierarchy.forEach(agent => {
      agent.companyName = `${this.getAgentName(agent)} - ${agent.agentId}`;
    });
    return returnHierarchy;
  }

  /**
   * Get document commission
   * @param agent AgentID
   * @param paymentId PaymentID
   * @param languageId LanguageID
   */
  getDocumentCommision(agent: string, paymentId: string, languageId: string) {
    const params = new HttpParams()
      .set('LanguageId', languageId)
      .set('reportformat', '1')
      .set('PaymentId', paymentId)
      .set('AgentId', agent);
    const httpOptions = { 'responseType': 'arraybuffer' as 'json', params };

    return this._http.get<ArrayBuffer>(`${this._config.apiHostCommon}/common/reports/commission`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * handle service errors
   * @param error HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
