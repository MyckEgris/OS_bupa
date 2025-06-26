import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyChangesWizard } from '../policy-changes-wizard/entities/policy-changes-wizard';
import { Subscription } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { TranslateService } from '@ngx-translate/core';
import { PolicyChangesWizardService } from '../policy-changes-wizard/policy-changes-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { Agent } from 'src/app/shared/services/agent/entities/agent';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { UploadService } from 'src/app/shared/upload/upload.service';

@Component({
  selector: 'app-change-agent',
  templateUrl: './change-agent.component.html'
})
export class ChangeAgentComponent implements OnInit, OnDestroy {

  /**
   * Constant for current step # 1
   */
  public currentStep = 2;

  /**
   * PolicyChangesWizard Object
   */
  public wizard: PolicyChangesWizard;

  /***
   * Subscription wizard
   */
  private subscription: Subscription;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /***
   * Subscription New Agent
   */
  private subNewAgent: Subscription;

  /**
   * New Agent information
   */
  public newAgent: Agent;

  /**
   * Array for policy search types
   */
  public agentSearchTypes: Array<any>;

  /**
   * Flag for search by agent id view
   */
  public flagByAgentId = false;

  /**
   * Flag for search by agent name view
   */
  public flagByAgentName = false;

  /**
   * Flag for new agent valid view
   */
  public flagNewAgentValid = false;

  /**
   * Flag for new agent search sucess search
   */
  public flagNewAgentSucessSearch = false;

  /**
   * Flag for new agent search error
   */
  public flagNewAgentByIdValid = false;

  /***
   * Const to identify the FormControl agentId
   */
  public AGENT_ID = 'agentId';

  /***
   * Const to identify the FormControl agentName
   */
  public AGENT_NAME = 'agentName';

  /***
   * Const to identify the FormControl agentSearchType
   */
  public AGENT_SEARCH_TYPE = 'agentSearchType';

  /***
   * Const to identify the FormControl newAgent
   */
  public NEW_AGENT = 'newAgent';

  /***
   * Const to Identify the FormGroup step2
   */
  public STEP2 = 'step2';

  /***
   * Const to Identify the FormControl currentAgent
   */
  public CURRENT_AGENT = 'currentAgent';

  /***
   * Const to Identify the FormControl policychangeType
   */
  public POLICY_CHANGE_TYPE = 'policyChangeType';

  /**
   * User Insurance Business Id
   */
  private userBupaBusinessId: number;

  /**
   * saveAgent
   */
  private saveAgent: { agentId: number; agentName: string };

  /**
   * List of attachments
   */
  public documents: Array<any>;

  /**
   * Document types
   */
  public type1 = 'type1';

  /**
   * Contruct Methods
   * @param translate translate injection
   * @param policyChangesService policyChangesService injection
   * @param authService authService injection
   * @param policyService policyService injection
   * @param agentService agentService injection
   * @param router router injection
   * @param uploadService Upload ervice injection
   * @param notification Notification Service injection
   */
  constructor(
    private translate: TranslateService,
    private policyChangesService: PolicyChangesWizardService,
    private authService: AuthService,
    private policyService: PolicyService,
    private agentService: AgentService,
    private router: Router,
    private uploadService: UploadService,
    private notification: NotificationService
  ) { }



  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyChangesService.beginPolicyChangesWizardServiceWizard(
      wizard => { this.wizard = wizard; }, this.user, this.currentStep);
    this.buildStep2Form();
    this.userBupaBusinessId = Number(this.user.bupa_insurance);
    this.agentSearchTypes = this.loadSearchTypes();
    this.getControl(this.STEP2, this.AGENT_SEARCH_TYPE).valueChanges.subscribe(val => {
      this.validateAgentSearchTypeView();
      this.setNewAgentFormValidations();
    }
    );
    this.validateAgentSearchTypeView();
    this.documents = this.uploadService.getDocuments();
  }

  /***
   * kill subscriptions to free memory
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Create new step2 Change Agent FormGroup in Policy Changes Wizard FormGroup
   */
  private buildStep2Form() {
    this.getFormGroup(this.STEP2).addControl('currentAgent', new FormControl('', []));
    this.getFormGroup(this.STEP2).addControl('policyChangeType', new FormControl('', []));
    this.getFormGroup(this.STEP2).addControl('agentSearchType', new FormControl('', [Validators.required]));
    this.setInformation();
  }

  /**
   * Set non editabled values on the form provided by the wizard information
   */
  private setInformation() {
    this.getControl(this.STEP2, this.POLICY_CHANGE_TYPE).patchValue(this.wizard.policyChange.description);
  }


  /**
   * Search the agent information using the input agent code value
   */
  public searchNewAgent() {
    const inputAgentId = this.getControl(this.STEP2, this.AGENT_ID);
    if (inputAgentId) {
      this.subNewAgent = this.agentService.getAgentById(String(inputAgentId.value))
        .subscribe(agent => {
          this.flagNewAgentSucessSearch = true;
          this.validateNewAgentValid(agent);
        }, error => {
          this.flagNewAgentSucessSearch = false;
          this.flagNewAgentByIdValid = true;
          if (error.status === 404) {
            this.translate.get(`POLICY.POLICY_CHANGES.STEP2.CHANGE_AGENT.INVALID_AGENT_CODE_MSG`).subscribe(
              result => {
                const message = result;
                this.showMessageErrorNewAgent(message);
              }
            );
          }
          console.error(error);
        }
        );
    }
  }

  /**
   * Save the new Agent information in the policy changes wizard.
   */
  saveNewAgent() {
    const option = this.getControl(this.STEP2, this.AGENT_SEARCH_TYPE).value;
    let AgentName = '';
    if (option === 'byAgentId') {
      if (this.newAgent.firstName) {
        AgentName = `${this.newAgent.firstName} ${this.newAgent.middleName} ${this.newAgent.lastName}`;
      } else {
        AgentName = this.newAgent.companyName;
      }
      this.saveAgent = { agentId: this.newAgent.agentId, agentName: AgentName };
      this.wizard.newAgent = this.saveAgent;
    } else if (option === 'byAgentName') {
      this.saveAgent = { agentId: 0, agentName: this.getControl(this.STEP2, this.AGENT_NAME).value };
      this.wizard.newAgent = this.saveAgent;
    }
  }


  /**
   * Loads search types select control values.
   */
  private loadSearchTypes() {
    const searchTypes = [
      { value: 'byAgentId' },
      { value: 'byAgentName' }
    ];
    return searchTypes;
  }

  /**
   * Get nested form controls
   */
  public getControl(formGroupName: string, field: string) {
    return this.wizard.policyChangesForm.get(formGroupName).get(field) as FormControl;
  }

  /**
   * Get form group
   */
  public getFormGroup(formGroupName: string): FormGroup {
    return this.wizard.policyChangesForm.get(formGroupName) as FormGroup;
  }

  /**
   * Validates agent search type value for form view
   */
  private validateAgentSearchTypeView() {
    const searchTypeValue = this.getControl(this.STEP2, this.AGENT_SEARCH_TYPE);
    if (searchTypeValue) {
      if (searchTypeValue.value === 'byAgentId') {
        this.flagByAgentId = true;
        this.flagByAgentName = false;
        this.flagNewAgentByIdValid = true;
      } else if (searchTypeValue.value === 'byAgentName') {
        this.flagByAgentId = false;
        this.flagByAgentName = true;
        this.flagNewAgentByIdValid = false;
      }
    }
  }

  /**
   * Validates new agent result is valid according Bupa Businesss
   * @param agent New Agent
   */
  private validateNewAgentValid(agent: Agent) {
    const newAgentBupaBusinessId: number = agent.insuranceBusinessId;
    if (agent) {
      if (this.userBupaBusinessId === newAgentBupaBusinessId) {
        this.flagNewAgentValid = true;
        this.newAgent = agent;
        this.flagNewAgentByIdValid = false;
      } else {
        this.flagNewAgentValid = false;
        this.flagNewAgentByIdValid = true;
        this.translate.get(`POLICY.POLICY_CHANGES.STEP2.CHANGE_AGENT.INVALID_AGENT_MSG`).subscribe(
          result => {
            const message = result;
            this.showMessageErrorNewAgent(message);
          }
        );
      }
    }
  }


  /**
   * Set Form requiered validations according to new agent search type option
   */
  private setNewAgentFormValidations() {
    const searchTypeValue = this.getControl(this.STEP2, this.AGENT_SEARCH_TYPE);
    if (searchTypeValue) {
      if (searchTypeValue.value === 'byAgentId') {
        this.getFormGroup(this.STEP2).removeControl(this.AGENT_NAME);
        this.getFormGroup(this.STEP2).addControl(this.AGENT_ID, new FormControl('', [Validators.required, Validators.min(1)]));
      } else if (searchTypeValue.value === 'byAgentName') {
        this.getFormGroup(this.STEP2).removeControl(this.AGENT_ID);
        this.getFormGroup(this.STEP2).addControl(this.AGENT_NAME, new FormControl('', Validators.required));
        this.flagNewAgentValid = false;
        this.flagNewAgentSucessSearch = false;
        this.newAgent = null;
      }
      this.getFormGroup(this.STEP2).updateValueAndValidity();
    }
  }

  /**
   * Routing to the next step
   */
  next() {
    this.saveNewAgent();
    this.wizard.documents = this.uploadService.getDocuments();
    this.router.navigate(['policies/policy-changes/step3']);
  }

  /**
   * Routing to the back step
   */
  back() {
    this.router.navigate(['policies/policy-changes/step1']);
  }

  /**
   * This function allows remove a single upload file.
   * @param document File to remove.
   * @param e parameter to specify a component to remove file.
   */
  removeDocument(document: FileDocument, e) {
    this.uploadService.remove(document);
    this.documents = this.uploadService.getDocuments();
    e.preventDefault();
  }

  /**
   * Show errors in new agent search
   */
  async showMessageErrorNewAgent(msg: string) {
    const message = msg;
    let messageTitle = '';
    this.translate.get(`POLICY.POLICY_CHANGES.STEP2.CHANGE_AGENT.TITLE_MSG`).subscribe(
      result => {
        messageTitle = result;
        this.notification.showDialog(messageTitle, message);
      }
    );
  }

}
