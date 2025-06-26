import { Component, OnInit, ViewChild, OnDestroy, ElementRef, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { Rule } from 'src/app/shared/services/policy-application/entities/rule';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { FileHelper } from 'src/app/shared/util/file-helper';
import { RuleByBusiness } from 'src/app/shared/services/common/entities/rule-by-business';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-sign-and-attach-docs',
  templateUrl: './sign-and-attach-docs.component.html'
})
export class SignAndAttachDocsComponent implements OnInit, OnDestroy, AfterContentChecked {

  private MAX_LENGTH_FILENAME = 20;
  public user: UserInformationModel;
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 11;
  private subscription: Subscription;
  private configStep: ViewTemplateStep;
  public petitionerType: any[];

  public formInvalid: Boolean = false;

  public currentSection: Section;

  public rules: Array<RuleByBusiness>;

  public showValidateMessage = false;

  public showMinDocumentsMessage = false;

  public showMaxDocumentsMessage = false;

  /***
   * Const to Identify the saving error title message
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';

  /***
   * Const to Identify the saving error message
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';

  /***
   * Const to Identify the saving error button message
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  /**
   * fileScroll to access native element in DOM
   */
  @ViewChild('fileScroll') fileScroll;
  signAndAttachDocsFormGroup: FormGroup;
  wasValidated: boolean;
  showIsValidDocsUploadRulesRequired: boolean;
  isSubmitted = false;
  groupedMap: Map<any, any>;
  constructor(
    private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private notification: NotificationService,
    private translate: TranslateService,
    private commonService: CommonService,
    public uploadService: UploadService,
    private policyApplicationService: PolicyApplicationService,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => { this.wizard = wizard; }, this.user, null, this.currentStep, 1);
      this.signAndAttachDocsFormGroup = this.fb.group({});
      this.getRules();
      this.setUpForm();
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 1);
  }

  getRules() {
    this.policyApplicationService.getRulesByApplicationId(this.wizard.policyApplicationModel.applicationId).subscribe(rules => {
      this.rules = rules;
      this.wizard.policyApplicationModel.rules = rules;
      this.addControlToForm();
      this.sortRulesByDocumentTypeId();
      this.groupRulesByDocumentTypeId();
      this.assignRulesByDefault(rules);
    });
  }

  addControlToForm() {
    this.rules.forEach(rule => {
      this.signAndAttachDocsFormGroup.addControl(rule.rulesByBusinessId.toString(),
        this.fb.control(rule.answer, (rule.isRequired) ? Validators.required : null));
    });
  }

  sortRulesByDocumentTypeId() {
    this.rules.sort((x, y) => {
      return x.documentTypeId - y.documentTypeId;
    });
  }

  groupRulesByDocumentTypeId() {
    this.groupedMap = this.rules.reduce(
      (entryMap, e) => entryMap.set(e.documentTypeId, [...entryMap.get(e.documentTypeId) || [], e]),
      new Map()
    );
  }

  assignRulesByDefault(rules: Array<RuleByBusiness>) {
    rules.forEach(rule => {
      const countRules = this.rules.filter(x => x.documentTypeId === rule.documentTypeId).length;
      if (countRules === 1) {
        this.wizard.policyApplicationModel.rules.find(r => r.rulesByBusinessId === rule.rulesByBusinessId).answer = true;
        this.signAndAttachDocsFormGroup.get(rule.rulesByBusinessId.toString()).setValue('true');
      }
    });

  }

  getDocumentsByDocumentTypeToEdit(key) {
    if (this.wizard.policyApplicationModel.documents.filter(d => d.applicationDocumentTypeId === key).length > 0) {
      return this.wizard.policyApplicationModel.documents.filter(d => d.applicationDocumentTypeId === key);
    }
  }

  /**
  * This function allows remove a single upload file.
  * @param document File to remove.
  * @param e parameter to specify a component to remove file.
  */
  removeDocument(document: FileDocument, e) {
    this.uploadService.remove(document);
    e.preventDefault();
  }

  getKeys(map) {
    return Array.from(map.keys());
  }

  next() {
    if ((this.isAllRulesRequiredChecked().some(x => x === false)
    || this.checkIsAllDocsUploadRulesRequired().some(c => c === false))
    && this.wizard.policyApplicationModel.documents.length === 0) {
      this.isSubmitted  = true;
    } else {
      this.submit();
    }
  }

  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

  nextStep() {
    this.router.navigate([this.currentSection.nextStep]);
  }

  /**
 * This fucntion allows calculate the size of a upload file.
 * @param file file to calculate size.
 */
  getFileSize(file) {
    return FileHelper.calculateFileSize(file);
  }

  addOrRemoveRules(rule: RuleByBusiness, event: { target: { checked: any; }; }) {
    this.wizard.policyApplicationModel.rules.find(r => r.rulesByBusinessId === rule.rulesByBusinessId).answer = event.target.checked;
  }

  /**
   * Determines whether all rules required has been checked
   * @returns all rules required checked
   */
  isAllRulesRequiredChecked(): Array<boolean> {
    const isAllValid: Array<boolean> = [];
    Object.keys(this.signAndAttachDocsFormGroup.controls).forEach(key => {
      isAllValid.push(this.isRuleRequiredCheckedByBusinessId(key));
    });
    return isAllValid;
  }

  /**
   * Determines whether rule that is required by business id is checked (rule checked). That is, user answered true
   * @param businessId
   * @returns true if rule valid business id
   */
  isRuleRequiredCheckedByBusinessId(businessId: string): boolean {
    if (this.signAndAttachDocsFormGroup.get(businessId)) {
      const rule = this.rules.find(r => r.rulesByBusinessId === +businessId);
      if (this.signAndAttachDocsFormGroup.get(businessId).value && rule.isRequired) {
        return true;
      } else if (!rule.isRequired) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Validate whether rule that is required has all docs upload
   * @returns is all docs upload rules required
   */
  checkIsAllDocsUploadRulesRequired(): Array<boolean> {
    const isAllValid: Array<boolean> = [];
    this.getKeys(this.groupedMap).forEach(key => {
      isAllValid.push(this.isUploadDocsRulesRequiredByDocumentTypeId(key));
    });
    return isAllValid;
  }

  /**
   * Validate whether all rules required is checked (to use in view template)
   * @returns true if is all rule valid
   */
  checkIsAllRuleValid(): boolean {
    if (this.isAllRulesRequiredChecked().some(r => r === false)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Determines whether rules required by document type id has docs uploaded
   * @param documentTypeId
   * @returns true if upload docs rules required by document type id
   */
  isUploadDocsRulesRequiredByDocumentTypeId(documentTypeId): boolean {
    const rules = this.rules.filter(d => d.documentTypeId === documentTypeId);
    const docs = this.uploadService.getDocumentsByCategory(documentTypeId);
    if (rules.some(x => x.isRequired) && docs.length > 0) {
      return true;
    } if (!rules.some(d => d.isRequired)) {
      return true;
    } else {
      return false;
    }
  }

  async submit() {
      try {
        const documents = this.uploadService.getDocuments();
        if (documents.length > 0) {
          if (documents.length >= 100) {
            this.showMaxDocumentsMessage = true;
            return;
          }
          if (this.wizard.policyApplicationModel.documents.length > 0) {
            const folderName = this.wizard.documentsFolderName;
            this.commonService.deleteFolder(folderName);
          }
          const response = await this.commonService.uploadFirstDocument(documents[0]);
          if (documents.length > 1) {
            for (let i = 1; i < documents.length; i++) {
              if (i > 10) {
                this.fileScroll.nativeElement.scrollTop = ((i - 6) * 22);
              }
              await this.commonService.uploadDocumentToFolder(documents[i], response.folderName);
            }
          }
          this.createPolicyApplication(documents, response.folderName);
        } else {
          if (this.wizard.policyApplicationModel.documents.length === 0) {
            this.showMinDocumentsMessage = true;
          } else {
            this.nextStep();
          }
        }
      } catch {
        // this.showError();
      }
  }

  /**
   * Save the form information in the wizard service and show sucess message.
   */
  async createPolicyApplication(documents?: any, folderName?: string) {
    this.saveCheckpoint();
    this.wizard.documentsFolderName = folderName;
    await this.policyEnrollmentWizardService.buildPolicyApplication(documents);
    this.policyApplicationService.createPolicyEnrollment(this.wizard.policyApplicationModel)
      .subscribe(
        p => {
          this.success(p);
        }, async e => {
          if (this.checkIfHasError(e)) {
            const errorMessage = this.ERROR_SAVING_MESSAGE;
            const title = await this.translate.get(this.ERROR_SAVING_TITLE).toPromise();
            const message = await this.translate.get(errorMessage).toPromise();
            const ok = await this.translate.get(this.ERROR_SAVING_OK).toPromise();
            const failed = await this.notification.showDialog(title, message, false, ok);
            if (failed) {
              return;
            }
          }
        },
      );
  }

  private saveCheckpoint() {
    const currentStepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
    if (currentStepCompleted.stepNumber === this.currentStep) {
      const totalSections = this.wizard.viewTemplate.steps.find(st => st.stepNumber === currentStepCompleted.stepNumber).sections.length;
      if (totalSections > 1 && currentStepCompleted.sectionId < this.currentSection.id) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSection.id));
      }
    } else {
      if (currentStepCompleted.stepNumber < this.currentStep) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSection.id));
      }
    }
  }

  private createCheckpoint(stepNumber: number, sectionId: number) {
    return {
      stepNumber: stepNumber,
      sectionId: sectionId
    };
  }

  /**
   * Check for request errors.
   */
  checkIfHasError(error) {
    return (error.error);
  }

  /**
   * Store the succes request id in wizard and continue to next page.
   */
  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.uploadService.removeAllDocuments();
    this.nextStep();
  }

  getFileName(file_name: string): string {
    const file_ext = file_name.substring(file_name.lastIndexOf('.') + 1);
    if (file_name.length >= this.MAX_LENGTH_FILENAME) {
        file_name = `${file_name.substring(0, this.MAX_LENGTH_FILENAME - 1)} ...  ${file_ext}`;
    }
    return file_name;
  }

  getFileNameDocsToEdit(file_name: string): string {
    const file_ext = file_name.substring(file_name.lastIndexOf('.') + 1);
    const fileNameArr = file_name.split('\\');
    if (fileNameArr[1].length >= this.MAX_LENGTH_FILENAME) {
        file_name = `${fileNameArr[1].substring(0, this.MAX_LENGTH_FILENAME - 1)} ...  ${file_ext}`;
    } else {
      file_name = fileNameArr[1];
    }
    return file_name;
  }

    /**
   * downloads the documents the user select on the screen
   * @param doc Document object.
   */
  downloadFile() {
    const peticion = this.policyApplicationService.generatePolicyApplicationPdf(this.wizard.policyApplicationModel.applicationGuid,
      this.wizard.policyApplicationModel.applicationId,
      this.wizard.policyApplicationModel.status,
      this.user.language, 'false');
    peticion.subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      saveAs(blob, String(this.wizard.policyApplicationModel.applicationId));
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

}
