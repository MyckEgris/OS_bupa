/**
* PolicyDocumentsComponent.ts
*
* Component that shows documents of the policy
* @description: PolicyDocumentsComponent
* @author Jose Daniel Hernández M
* @version 1.0
* @date 26-11-19.
*
**/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { PolicyResponse } from 'src/app/shared/services/policy/entities/policy-response.dto';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Agent } from 'src/app/shared/services/agent/entities/agent';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import * as moment from 'moment';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentOutputDto } from 'src/app/shared/services/policy/entities/documents.dto';



@Component({
  selector: 'app-policy-documents',
  templateUrl: './policy-documents.component.html'
})
export class PolicyDocumentsComponent implements OnInit, OnDestroy {

  /**
   * Stores the logged user information
   */
  private user: UserInformationModel;

  /**
   * Object for policy search by filter
   */
  public policySearchResponse: PolicyResponse;

  /**
   * Holds the form information
   */
  public formPolicyDocs: FormGroup;

  /***
   * Const to Identify the nested FormGroup filterCriteria
   */
  public FILTER_CRITERIA_FG = 'filterCriteria';

  /***
   * Const to Identify the nested FormArray policiesList
   */
  public POLICIES_LIST_FA = 'policiesList';

  /***
   * Const to Identify the nested FormControl Agent
   */
  public AGENT_CTRL = 'Agent';

  /***
   * Const to Identify the nested FormControl documentMonth
   */
  public DOC_MONTH_CTRL = 'documentMonth';

  /***
   * Const to Identify the nested FormControl documentYear
   */
  public DOC_YEAR_CTRL = 'documentYear';

  /***
   * Const to Identify the nested FormControl documentType
   */
  public DOC_TYPE_CTRL = 'documentType';

  /***
   * Const to Identify the nested FormControl email
   */
  public EMAIL_CTRL = 'email';

  /***
   * Const to Identify the nested FormControl check
   */
  public CHECK_CTRL = 'check';

  /***
   * Document Type option array
   */
  public docTypeArray: Array<any>;

  /***
   * Document Years option array
   */
  public docYearArray: Array<any>;

  /***
   * Document Years option array
   */
  public docMontshArray$: Observable<any[]>;

  /**
   * Stores the logged user information
   */
  public agentArray: Agent[];

  /***
   * Subscription Policy
   */
  private subPolicy: Subscription;

  /***
   * Subscription Common
   */
  private subCommon: Subscription;

  /***
   * Subscription Agent
   */
  private subAgent: Subscription;

  /**
   * Constant for first pager Page Index parameter
   */
  private firstPageIndex = 1;

  /**
   * Constant for pager Page Size parameter
   */
  private pageSize = 10;

  /**
   * pager object
   */
  public pager: any = {};

  /**
    * Flag for Policies data array content
    */
  public sucessSearch = false;

  /**
    * Flag for Not First
    */
  public notFirst = false;

  /**
   * Stores the filter values so it will use it when paging.
   */
  private currentAgentId: string = null;
  private currentDocFromDate: string = null;
  private currentDocToDate: string = null;
  private currentDocType: string = null;
  private currentRoleId: string = null;
  private currentUserKey: string = null;

  /***
   * Checked Policies array
   */
  public checkedPolicies: Array<any>;

  /***
   * Constant for the Current Send Date.
   */
  public sendDate = moment();

  /***
   * Constants for the policies search data not found (404) error request message.
   */
  private ERROR_DATA_NOT_FOUND_TITLE = 'POLICY.POLICY_DOCUMENTS.DATA_NOT_FOUND_ERROR_TITLE';
  private ERROR_DATA_NOT_FOUND_MSG = 'POLICY.POLICY_DOCUMENTS.DATA_NOT_FOUND_ERROR_MSG';
  private ERROR_DATA_NOT_FOUND_Ok_BTN = 'APP.BUTTON.CONTINUE_BTN';

  /***
   * Constants for the policies search next page warnning message.
   */
  private CHANGE_PAGE_MSG = 'POLICY.POLICY_DOCUMENTS.NEXT_PAGE_WARNNING_MSG';
  private CHANGE_PAGE_YES_BTN = 'APP.BUTTON.ACEPT_BTN';
  private CHANGE_PAGE_NO_BTN = 'APP.BUTTON.NO_BTN';

  /***
   * Constants for the send documents emails error request message.
   */
  private SUCESS_SAVING_MESSAGE = 'POLICY.POLICY_DOCUMENTS.SEND_EMAILS_SUCESS_MSG';

  /***
   * Constants for the download documents tooltip message.
   */
  private AVAILABLE_DOCUMENTS = 'POLICY.POLICY_DOCUMENTS.DOWNLOAD_DOCS_TOOLTIP';
  private NOT_AVAILABLE_DOCUMENTS = 'POLICY.POLICY_DOCUMENTS.CANT_DOWNLOAD_DOCS_TOOLTIP';

  /***
   * Bool to show validations.
   */
  public showValidations = false;



  /**
   * constructor method
   * @param authService auth service Injection
   * @param policyEnrollmentWizardService Policy Enrollment Wizard Service Injection
   * @param translate Translate Service Injection
   * @param notification Notification Service Injection
   * @param policyService Policy Service Injection
   * @param commonService Common Service Service Injection
   * @param agentService Agent Service Injection
   * @param pagerService   Pager Service  Injection
   * @param translationService translation Service  Injection
   */
  constructor(
    private authService: AuthService,
    private policyService: PolicyService,
    private commonService: CommonService,
    private agentService: AgentService,
    private pagerService: PagerService,
    private translate: TranslateService,
    private translationService: TranslationService,
    private notification: NotificationService
  ) { }


  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subPolicy) { this.subPolicy.unsubscribe(); }
    if (this.subCommon) { this.subCommon.unsubscribe(); }
    if (this.subAgent) { this.subAgent.unsubscribe(); }
  }

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.formPolicyDocs = this.buildForm();
    this.getArrays();
    this.translate.onLangChange.subscribe((lang: LangChangeEvent) => {
      this.getArrays();
    });
    this.getDocYearArray();
    this.searchAgentHierarchyById();
    this.checkedPolicies = [];
  }

  /**
   * Gets the translated filters ararys.
   */
  getArrays() {
    this.getDocTypeArray(this.translationService.getLanguage());
    this.getDocMonthArray();
  }

  /**
   * Builds default PolicyDocs Form.
   */
  buildForm() {
    return new FormGroup({
      policiesList: new FormArray([]),
      filterCriteria: new FormGroup({
        documentType: new FormControl(true, [Validators.required]),
        documentYear: new FormControl('', [Validators.required]),
        documentMonth: new FormControl('', [Validators.required]),
        Agent: new FormControl('', [])
      })
    });
  }

  /**
   * Get nested form controls.
   * @param section Section.
   * @param field Field.
   */
  public getControl(section: string, field: string): FormControl {
    return this.formPolicyDocs.get(section).get(field) as FormControl;
  }

  /**
   * Get nested form controls in formArray.
   * @param index Index.
   * @param control Control.
   */
  public getNestedControl(index: number, control: string): FormControl {
    const policiesList = this.formPolicyDocs.get(this.POLICIES_LIST_FA) as FormArray;
    const formGrp = policiesList.controls[index] as FormGroup;
    return formGrp.get(control) as FormControl;
  }

  /**
   * Sets the form array.
   */
  setsFormArray() {
    this.formPolicyDocs.removeControl(this.POLICIES_LIST_FA);
    this.formPolicyDocs.addControl(this.POLICIES_LIST_FA, new FormArray([]));
    for (let index = 0; index < this.policySearchResponse.data.length; index++) {
      let defaultEmail = '';
      const emailArray = this.policySearchResponse.data[index].emails;
      if (emailArray.length > 0) {
        defaultEmail = emailArray[0].eMailAddress;
      }
      const policiesList = this.formPolicyDocs.get(this.POLICIES_LIST_FA) as FormArray;
      policiesList.push(
        new FormGroup({
          check: new FormControl('', []),
          email: new FormControl(defaultEmail, [])
        })
      );
    }
  }

  /***
   * Gets the Policies List and displays the segment from the page selected.
   * @param page Page.
   * @param isNextPage is NextPage.
   */
  generatePoliciesRequest(page: number, isNextPage?: boolean) {
    if (!isNextPage) {
      this.setCurrentFilterValues(
        this.getControl(this.FILTER_CRITERIA_FG, this.AGENT_CTRL).value,
        this.getControl(this.FILTER_CRITERIA_FG, this.DOC_YEAR_CTRL).value,
        this.getControl(this.FILTER_CRITERIA_FG, this.DOC_MONTH_CTRL).value,
        this.getControl(this.FILTER_CRITERIA_FG, this.DOC_TYPE_CTRL).value
      );
    }
    this.showValidations = false;
    // Generate request and set current pager.
    this.searchPoliciesByFilter(page);
  }

  /**
   * Convert and Set current values using for filter policies search.
   * @param agentId Agent Id.
   * @param documentYear Document Year.
   * @param documentMonth Document Month.
   * @param documentType Document Type.
   */
  setCurrentFilterValues(agentId: number, documentYear: number, documentMonth: number, documentType: string) {
    if (this.validateNullValue(agentId)) {
      this.currentAgentId = this.validateNullValue(agentId);
    } else {
      this.currentAgentId = this.user.agent_number;
    }
    const currentMonth = this.validateNullValue(documentMonth);
    const currentYear = this.validateNullValue(documentYear);
    const currentStartDay = 1;
    const currentFinalDay = moment(this.validateNullValue(documentMonth), 'MM').daysInMonth();
    this.currentDocFromDate = `${currentYear}-${currentMonth}-${currentStartDay}`;
    this.currentDocToDate = `${currentYear}-${currentMonth}-${currentFinalDay}`;
    this.currentDocType = this.validateNullValue(documentType);
    this.currentRoleId = this.validateNullValue(this.user.role_id);
    this.currentUserKey = this.validateNullValue(this.user.user_key);
  }

  /**
   * Validate if the control value is empty and assign it to null, otherwise return it converted to string.
   * @param value Value
   */
  validateNullValue(value: any): string {
    if (!value || value === '') {
      const newValue = null;
      return newValue;
    } else { return value.toString(); }
  }

  /**
   * Gets the Policies filtering by current filters and store the result.
   * @param page Page.
   */
  searchPoliciesByFilter(page: number) {
    this.policySearchResponse = { data: [], count: null, pageSize: null, pageindex: null };
    this.checkedPolicies = [];
    this.policyService.getPoliciesAndDocumentsByFilter(
      this.currentAgentId, this.currentDocFromDate,
      this.currentDocToDate, this.currentDocType,
      this.currentRoleId, this.currentUserKey,
      this.pageSize.toString(), page.toString())
      .subscribe(
        data => {
          this.policySearchResponse = data;
          this.setsFormArray();
          this.setPage(page);
          this.validateContentArray(this.policySearchResponse.data);
        }, error => {
          this.validateContentArray(this.policySearchResponse.data);
          this.showMessage(this.ERROR_DATA_NOT_FOUND_MSG, this.ERROR_DATA_NOT_FOUND_TITLE, this.ERROR_DATA_NOT_FOUND_Ok_BTN);
        }
      );
    this.notFirst = true;
  }

  /**
   * Gets the Policies List and displays the segment from the page selected.
   * @param page page number
   */
  public setPage(page: number) {
    if (this.pager) {
      if (page < 1 || page > this.pager.totalPages) {
        this.validateContentArray(this.policySearchResponse.data);
        return;
      }
    }
    this.pager = this.pagerService.getPager(this.policySearchResponse.count, page, this.pageSize);
  }

  /**
   * Handle the checked policy items.
   * @param checked Checked.
   * @param pos Position.
   * @param policy Policy Object.
   */
  handlePolicyCheck(checked: any, pos: number, policy: PolicyDto) {
    const value = { index: pos, policy: policy };
    const indx = this.checkedPolicies.findIndex((item) => { return (item.index === pos) });
    if (checked) {
      this.getNestedControl(pos, this.EMAIL_CTRL).setValidators([
        Validators.required, CustomValidator.emailPatternValidatorSeparatedBySemicolon
      ]);
      this.getNestedControl(pos, this.EMAIL_CTRL).updateValueAndValidity();
      if (indx === -1) {
        this.checkedPolicies.push(value);
      }
    } else {
      this.getNestedControl(pos, this.EMAIL_CTRL).setValidators([]);
      this.getNestedControl(pos, this.EMAIL_CTRL).updateValueAndValidity();
      if (indx !== -1) {
        this.checkedPolicies.splice(indx, 1);
      }
    }
  }

  /**
   * Handle the check all and uncheck all functions.
   * @param option Option.
   */
  checkAll(option: number) {
    const policiesList = this.formPolicyDocs.get(this.POLICIES_LIST_FA) as FormArray;
    if (option === 1) {
      for (let index = 0; index < policiesList.length; index++) {
        const policy = this.policySearchResponse.data[index];
        if (!this.handleDownloadDocumentsBtn(policy)) {
          const checked = this.getNestedControl(index, this.CHECK_CTRL);
          checked.setValue(true);
          this.handlePolicyCheck(checked.value, index, policy);
        }
      }
    } else {
      for (let index = 0; index < policiesList.length; index++) {
        const policy = this.policySearchResponse.data[index];
        if (!this.handleDownloadDocumentsBtn(policy)) {
          const checked = this.getNestedControl(index, this.CHECK_CTRL);
          checked.setValue(false);
          this.handlePolicyCheck(checked.value, index, policy);
        }
      }
    }
  }

  /**
   * Gets the Document Type Array for filters.
   * @param lang Language.
   */
  getDocTypeArray(lang: string) {
    this.docTypeArray = [];
    this.subPolicy = this.policyService.getPolicyDocumentsTypeArrayTranslated(lang).subscribe(
      (data: any[]) => {
        this.docTypeArray = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  /**
   * Gets the Document Year Array for filters.
   */
  async getDocYearArray() {
    this.docYearArray = [];
    this.subCommon = this.commonService.getArrayOfYearsByRange(1, 1).subscribe(
      (data: any[]) => {
        this.docYearArray = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  /**
   * Gets the Document Months Array for filters.
   */
  getDocMonthArray() {
    this.docMontshArray$ = Observable.of([]);
    this.docMontshArray$ = this.commonService.getMonthsofYearTranslated();
  }

  /**
   * Gets the Agents Hirarchy Array for filters.
   */
  searchAgentHierarchyById() {
    this.agentArray = [];
    this.subAgent = this.agentService.getAgentHierarchyById(this.user.user_key).subscribe(data => {
      this.agentArray = data;
      this.handleAgentHierarchy(this.agentArray);
    }, error => {
      console.error(error);
    });
  }

  /**
   * Handle the Agent name for each Agents Array item and Store it.
   * @param dataArray Data Array.
   */
  handleAgentHierarchy(dataArray) {
    dataArray.forEach((agent: Agent) => {
      const name = this.agentService.getAgentName(agent);
      if (name.indexOf(String(agent.agentId)) === -1) {
        agent.companyName = `${name} - ${agent.agentId}`;
      }
    });
  }

  /**
   * Validates if filter values are Incorrect.
   */
  filterCriteriaInvalid() {
    if (this.formPolicyDocs) {
      if (this.formPolicyDocs.get(this.FILTER_CRITERIA_FG).invalid) {
        return true;
      } else { return false; }
    }
  }

  /**
   * Validates if filter values are Empty.
   */
  filterCriteriaEmpty() {
    if (this.formPolicyDocs) {
      if (!this.formPolicyDocs.get(this.FILTER_CRITERIA_FG).touched) {
        return true;
      } else { return false; }
    }
  }

  /**
   * Validate if policies data array content > 0 and Flag for view True.
   * @param dataArray Data Array
   */
  validateContentArray(dataArray) {
    if (dataArray) {
      if (dataArray.length > 0) {
        this.sucessSearch = true;
      } else {
        this.sucessSearch = false;
      }
    } else { this.sucessSearch = false; }
  }

  /**
   * Handles the send policy documents to the selected emails array.
   */
  handleSendEmails() {
    if (this.formPolicyDocs.get(this.POLICIES_LIST_FA).valid) {
      this.showValidations = false;
      const arraytoSend: PolicyDto[] = [];
      this.checkedPolicies.forEach(element => {
        element.policy.email = this.getNestedControl(element.index, this.EMAIL_CTRL).value;
        arraytoSend.push(element.policy);
      });
      if (arraytoSend.length > 0) {
        this.sendPolicyDocumentsToEmails(arraytoSend);
      }
    } else {
      this.showValidations = true;
    }

  }

  /**
   * Sends the policy documents to the selected emails.
   * @param policyArray Array of Policies.
   */
  sendPolicyDocumentsToEmails(policyArray: PolicyDto[]) {
    this.policyService.sendPolicyNotifications('renewal', policyArray, this.translationService.getLanguage()).subscribe(
      p => {
        this.showSuccessMsg();
      }, e => {
        if (this.checkIfHasError(e)) {
          console.error(e);
        }
      },
    );
  }

  /**
   * Show the success message.
   */
  async showSuccessMsg() {
    let response;
    let message = '';
    let messageTitle = '';
    let okBtn = null;
    this.translate.get(this.SUCESS_SAVING_MESSAGE.toString()).subscribe(
      result => message = result
    );
    this.translate.get(this.ERROR_DATA_NOT_FOUND_TITLE).subscribe(
      result => messageTitle = result
    );
    this.translate.get(this.ERROR_DATA_NOT_FOUND_Ok_BTN).subscribe(
      result => okBtn = result
    );
    response = await this.notification.showDialog(messageTitle, message, false, okBtn);
    if (response) {
      this.setsCheckedSendDates();
    }
  }

  /**
   * Check if has error.
   */
  checkIfHasError(error) {
    return (error.error);
  }

  /**
   * Clean the filter and form values.
   */
  cleanFilterValuesAndSearch() {
    this.getControl(this.FILTER_CRITERIA_FG, this.DOC_YEAR_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.DOC_YEAR_CTRL).setValidators([]);
    this.getControl(this.FILTER_CRITERIA_FG, this.DOC_MONTH_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.DOC_MONTH_CTRL).setValidators([]);
    this.getControl(this.FILTER_CRITERIA_FG, this.AGENT_CTRL).setValue('');
    this.getControl(this.FILTER_CRITERIA_FG, this.AGENT_CTRL).setValidators([]);
    const policiesList = this.formPolicyDocs.get(this.POLICIES_LIST_FA) as FormArray;
    for (let index = 0; index < policiesList.length; index++) {
      this.getNestedControl(index, this.EMAIL_CTRL).setValue('');
      this.getNestedControl(index, this.EMAIL_CTRL).setValidators([]);
      this.getNestedControl(index, this.CHECK_CTRL).setValue('');
      this.getNestedControl(index, this.CHECK_CTRL).setValidators([]);
    }
    this.policySearchResponse = { data: [], count: null, pageSize: null, pageindex: null };
    this.checkedPolicies = [];
    this.sucessSearch = false;
    this.notFirst = false;
    this.showValidations = false;
  }

  /**
   * Searchs the preferred email on the emails array.
   * @param policy Policy object.
   */
  handleRenewalDate(policy: PolicyDto) {
    if (policy) {
      const datesArray = policy.policyDates;
      if (datesArray) {
        const renewalDate = datesArray.find((item) => { return (item.policyDateId === 101) });
        return renewalDate ? renewalDate.policyDateValue : '';
      } else {
        return '';
      }
    }
  }

  /**
   * Handle if the download files button is disabled.
   * @param policy Policy object.
   */
  handleDownloadDocumentsBtn(policy: PolicyDto) {
    if (policy) {
      const docsArray = policy.documents;
      if (docsArray.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  /**
   * Handle if the user can download documents.
   * @param policy Policy object.
   */
  handleDownloadFile(policy: PolicyDto) {
    if (policy) {
      const docsArray = policy.documents;
      if (docsArray.length > 0) {
        const doc = docsArray[0];
        this.downloadFile(doc);
      }
    }
  }

  /**
   * downloads the documents the user select on the screen
   * @param doc Document object.
   */
  downloadFile(doc: DocumentOutputDto) {
    const peticion = this.commonService.getDocumentByDocumentPath(doc);
    peticion.subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      saveAs(blob, doc.documentType);
    }, error => {
      this.showNotFoundDocument(error);
    }
    );
  }


  /**
   * Shows the message when the Item was not found.
   * @param error Http Error message.
   */
  showNotFoundDocument(error: HttpErrorResponse) {
    if (error.error === '404') {
      let message = '';
      let messageTitle = '';
      this.translate.get(`POLICY.ERROR.ERROR_CODE.404`).subscribe(
        result => messageTitle = result
      );
      this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.404`).subscribe(
        result => message = result
      );
      this.notification.showDialog(messageTitle, message);
    }
  }

  /***
   * Show message.
   * @param msgPath Message Path.
   * @param titlePath Title Path.
   * @param okBtnPath Ok Button Path.
   */
  showMessage(msgPath: string, titlePath: string, okBtnPath?: string) {
    let message = '';
    let messageTitle = '';
    let okBtn = null;
    this.translate.get(msgPath.toString()).subscribe(
      result => message = result
    );
    this.translate.get(titlePath).subscribe(
      result => messageTitle = result
    );
    this.translate.get(okBtnPath).subscribe(
      result => okBtn = result
    );
    this.notification.showDialog(messageTitle, message, false, okBtn);
  }

  /***
   * Show message.
   * @param page Page.
   */
  async handleNextPage(page: number) {
    if (this.checkedPolicies.length > 0) {
      let response;
      let message = '';
      let messageTitle = '';
      let okBtn = null;
      let cancelBtn = null;
      this.translate.get(this.CHANGE_PAGE_MSG.toString()).subscribe(
        result => message = result
      );
      this.translate.get(this.ERROR_DATA_NOT_FOUND_TITLE).subscribe(
        result => messageTitle = result
      );
      this.translate.get(this.CHANGE_PAGE_YES_BTN).subscribe(
        result => okBtn = result
      );
      this.translate.get(this.CHANGE_PAGE_NO_BTN).subscribe(
        result => cancelBtn = result
      );
      response = await this.notification.showDialog(messageTitle, message, true, okBtn, cancelBtn);
      if (response) {
        this.generatePoliciesRequest(page, true);
      }
    } else {
      this.generatePoliciesRequest(page, true);
    }

  }

  /***
   * Show message.
   * @param policy Policy object.
   */
  validateIsGroup(policy: PolicyDto) {
    if (policy) {
      if (String(policy.isGroupPolicy) === String(1)) {
        return true;
      } else {
        return false;
      }
    }
  }

  /***
   * Sets the lastSendDate property.
   */
  setsCheckedSendDates() {
    for (let index = 0; index < this.checkedPolicies.length; index++) {
      const pos = this.checkedPolicies[index].index;
      this.policySearchResponse.data[pos].documents[0].lastSentDate = String(this.sendDate);
    }
  }

  /***
   * Handle download documents tooltip text.
   * @param policy Policy object.
   */
  handleDownloadDocumentsTooltip(policy: PolicyDto) {
    if (policy) {
      const docsArray = policy.documents;
      if (docsArray.length > 0) {
        return this.AVAILABLE_DOCUMENTS;
      } else {
        return this.NOT_AVAILABLE_DOCUMENTS;
      }
    }
  }




}
