/**
* NewBusinessQuotationComponent
*
* @description: This class loads the New Business Quotes' iFrame and handles the application
                Identifier that is created through the quotation process.
* @author Ivan Alejandro Hidalgo.
* @version 1.0
* @date 27-02-2020.
*
**/

import { Component, OnInit, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { Agent } from 'src/app/shared/services/agent/entities/agent';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';

@Component({
  selector: 'app-new-business-quotation',
  templateUrl: './new-business-quotation.component.html',
  styleUrls: ['./new-business-quotation.component.css']
})
export class NewBusinessQuotationComponent implements OnInit, AfterViewInit {



  /**
   * New Bussiness Quotation URL.
   */
  public NewBusinessUrl: string;

  /**
   * User who logged in inside Online Services.
   */
  private user: any;

  /**
   * Error code for 404 not data found exception
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Agent that will be retorned in order to make iFrame's URL.
   */
  agent: Agent;


  /**
   * Handles message event which contains the application Identifier.
   * @param e New Business Quote Iframe's messege event.
   */
  @HostListener('window:message', ['$event'])
  onMessage(e) {
    const isUrlAuthorize = this.validateIsNewBusinessQuoteUrlIsAuthorized(e);
    if (isUrlAuthorize !== true) {
      return false;
    }
    this.policyApplicationService.routeToPolicyApplicationForm(this.user.bupa_insurance, e.data.applicationId);
  }

  /**
   * Default constructor.
   * @param config configuration service instance.
   * @param authService authorization service instance.
   * @param router active router instance.
   */
  constructor(private config: ConfigurationService,
    private authService: AuthService,
    private _agentService: AgentService,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef,
    private notification: NotificationService,
    private policyApplicationService: PolicyApplicationService) {
    this.user = this.authService.getUser();
  }

  /**
   * Set up iFrame that will be loaded inside Online Services.
   */
  ngOnInit() {
    this.NewBusinessUrl = this.config.newBusinessQuotationUrl;
    this.getAgent(this.user.agent_number);
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  /**
   * Validates the event was thrown by New Business Quotes.
   * @param inputEvent event which was thrown by the IFrame.
   */
  validateIsNewBusinessQuoteUrlIsAuthorized(inputEvent) {
    const newBusinessQuoteUrlsAuthorized = this.config.newBusinessQuoteUrlsAuthorized.split(';');
    const newBusinessUrl = newBusinessQuoteUrlsAuthorized.findIndex(x => x === inputEvent.origin);
    if (newBusinessUrl !== -1) { return true; }
    return false;
  }

  /**
   * Gets agent information in order to make the New Business Quotes' URL.
   * @param agentNumber Agent identifier.
   */
  getAgent(agentNumber) {
    this._agentService.getAgentById(agentNumber)
      .subscribe(
        result => {
          this.agent = result;
          this.makeIframeUrl();
        },
        error => {
          if (error.error.code) {
            this.showErrorMessage(error);
          } else if (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND) {
            this.translate.get(`AGENT.PROFILE.ERROR_MESSAGE.${error.status}`)
              .subscribe(validateTitle => {
                this.translate.get(`AGENT.PROFILE.ERROR_CODE.${error.status}`).subscribe(res => {
                  this.notification.showDialog(validateTitle, res);
                });
              });
          }
        }
      );
  }

  /**
   * Builds IFrame's URL that will be loaded inside Online Services.
   * @param isAgency
   */
  private makeIframeUrl() {
    let isAgency = false;
    if (this.agent.agencyName !== '') {
      isAgency = true;
    }
    // tslint:disable-next-line: max-line-length
    this.NewBusinessUrl = `${this.NewBusinessUrl}?bupaInsuranceId=${this.user.bupa_insurance}&bupaInsuranceName=${this.agent.insuranceBusiness}&agentNumber=${this.user.agent_number}&agentFirstName=${this.agent.firstName}&agentMiddleName=${this.agent.middleName}&agentLastName=${this.agent.lastName}&isAgency=${isAgency}&agencyName=${this.agent.agencyName}&countryId=${this.agent.countryId}&countryName=${this.agent.country}`;
  }

  /**
   * Shows an error message when Agent's API failed.
   * @param errorMessage
   */
  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`AGENT.PROFILE.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`AGENT.PROFILE.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

}
