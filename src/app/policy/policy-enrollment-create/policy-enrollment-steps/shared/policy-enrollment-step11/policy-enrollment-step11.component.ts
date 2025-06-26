import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router } from '@angular/router';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { FileHelper } from 'src/app/shared/util/file-helper';
import { Rule } from 'src/app/shared/services/policy-application/entities/rule';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
@Component({
  selector: 'app-policy-enrollment-step11',
  templateUrl: './policy-enrollment-step11.component.html'
})
export class PolicyEnrollmentStep11Component implements OnInit, OnDestroy {

  private MAX_LENGTH_FILENAME = 20;
  public user: any;
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 11;
  private subscription: Subscription;
  private configStep: ViewTemplateStep;
  public petitionerType: any[];

  public formInvalid: Boolean = false;

  public currentSection: Section;

  public rulesByOwner = [];
  public rulesByPhysicalPetitioner = [];
  public rulesByMoralPetitioner = [];

  public documents: Array<any> = [];

  private rulesToAdd: Array<Rule> = [];

  public showValidateMessage = false;

  public showMinDocumentsMessage = false;

  public showMaxDocumentsMessage = false;

  /***
   * Const to Identify Next Step Variation Number
   */
  private STEP_VARIATION_NUMBER = '{stepVariationNumber}';

  private SECTION_VARIATION_NUMBER = '{sectionVariationNumber}';

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

  constructor(
    private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private notification: NotificationService,
    private translate: TranslateService,
    private commonService: CommonService,
    private uploadService: UploadService,
    private policyApplicationService: PolicyApplicationService
  ) { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.documents = this.uploadService.getDocuments();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      wizard => { this.wizard = wizard; }, this.user, null, this.currentStep, 1);
      this.getRules();
      this.setUpForm();
  }

  /***
  * Sets the Selected Rules Checked.
  * @param rule Selected Rule
  */
 setChecked(rule: any) {
  if (this.wizard.rulesSelected.indexOf(rule) > -1) {
    return true;
  } else { return false; }
}

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm
      .addControl(this.configStep.type,
        this.policyEnrollmentWizardService.buildStep(this.currentStep)
      );
    this.currentSection = this.configStep.sections.filter(s => s.id === 1)[0];
    // this.getFormGroup(this.INTRODUCTION_STEP, this.WEKNOW_SECTION).addControl(this.HAS_RESIDED_QUESTION_CTRL, new FormControl('x', []));
  }

  getRules() {
    this.commonService.getRulesByBusiness(this.user.bupa_insurance, 'ElectronicApplication', 'physicalpetitioner').subscribe(rules => {
      this.rulesByPhysicalPetitioner = rules;
    });
    this.commonService.getRulesByBusiness(this.user.bupa_insurance, 'ElectronicApplication', 'moralpetitioner').subscribe(rules => {
      this.rulesByMoralPetitioner = rules;
    });
    this.commonService.getRulesByBusiness(this.user.bupa_insurance, 'ElectronicApplication', 'owner').subscribe(rules => {
      this.rulesByOwner = rules;
    });
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

  next() {
    // this.validateForm();
    this.submit();
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

  addOrRemoveRulesDocuments(type, rule, event) {
    if (event.target.checked) {
      if (!(this.wizard.rulesSelected.indexOf(rule) > -1)) {
        this.wizard.rulesSelected.push(rule);
      }
    } else {
      this.wizard.rulesSelected.splice(this.wizard.rulesSelected.indexOf(rule), 1);
    }
  }

  validatePhysicalRequiredRulesDocuments() {
    const requiredPhysical = this.rulesByPhysicalPetitioner.filter(x => x.isRequired === true);
    if (requiredPhysical.length > 0) {
      requiredPhysical.forEach(r => {
        const exist = this.rulesToAdd.find(x => x.rulesByBusinessId === r.rulesByBusinessId);
        if (!exist) {
          return false;
        }
      });
    }

    return true;
  }

  validateMoralRequiredRulesDocuments() {
    const requiredMoral = this.rulesByMoralPetitioner.filter(x => x.isRequired === true);
    if (requiredMoral.length > 0) {
      requiredMoral.forEach(r => {
        const exist = this.rulesToAdd.find(x => x.rulesByBusinessId === r.rulesByBusinessId);
        if (!exist) {
          return false;
        }
      });
    }

    return true;
  }

  validateOwnerRequiredRulesDocuments() {
    const requiredOwner = this.rulesByOwner.filter(x => x.isRequired === true);
    if (requiredOwner.length > 0) {
      requiredOwner.forEach(r => {
        const exist = this.rulesToAdd.find(x => x.rulesByBusinessId === r.rulesByBusinessId);
        if (!exist) {
          return false;
        }
      });
    }

    return true;
  }

  async submit() {
    if (this.validatePhysicalRequiredRulesDocuments() && this.validateMoralRequiredRulesDocuments() &&
      this.validateOwnerRequiredRulesDocuments()) {
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
          this.showMinDocumentsMessage = true;
        }
      } catch {
        // this.showError();
      }
    } else {
      this.showValidateMessage = true;
    }

  }

  /**
   * Save the form information in the wizard service and show sucess message.
   */
  async createPolicyApplication(documents: FileDocument[], folderName: string) {
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
    this.nextStep();
  }

  getFileName(file_name: string): string {
    const file_ext = file_name.substring(file_name.lastIndexOf('.') + 1);
    if (file_name.length >= this.MAX_LENGTH_FILENAME) {
        file_name = `${file_name.substring(0, this.MAX_LENGTH_FILENAME - 1)} ...  ${file_ext}`;
    }
    return file_name;
  }

}
