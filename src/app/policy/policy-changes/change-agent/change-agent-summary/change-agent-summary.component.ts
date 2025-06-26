import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyChangesWizard } from '../../policy-changes-wizard/entities/policy-changes-wizard';
import { Subscription, forkJoin } from 'rxjs';
import { PolicyChangesWizardService } from '../../policy-changes-wizard/policy-changes-wizard.service';
import { Router } from '@angular/router';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { FormControl } from '@angular/forms';
import { FileHelper } from 'src/app/shared/util/file-helper';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { UpdatePolicyRequestDto } from 'src/app/shared/services/policy/entities/updatePolicyRequest.dto';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';

@Component({
  selector: 'app-change-agent-summary',
  templateUrl: './change-agent-summary.component.html'
})
export class ChangeAgentSummaryComponent implements OnInit, OnDestroy {

  /**
   * Constant for current step # 1
   */
  public currentStep = 3;

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

  /**
   * Constant for azureStorage
   */
  private REPOSITORY_TARGET = 'azureStorage';

  /**
   * Constant for bupacustomerinquirydocs
   */
  private FOLDER_DOC_INQUIRY = 'bupacustomerinquirydocs';


  /**
   * Contruct Methos
   * @param translate translate injection
   * @param policyChangesService policyChangesService injection
   * @param router router injection
   * @param authService authService injection
   * @param commonService Common Service injection
   * @param policyChangesWizardService Policy Changes Wizard Service injection
   * @param translationService Translation Service injection
   * @param policyService Policy Service injection
   */
  constructor(
    private policyChangesService: PolicyChangesWizardService,
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService,
    private policyChangesWizardService: PolicyChangesWizardService,
    private translationService: TranslationService,
    private policyService: PolicyService,
    private translate: TranslateService,
    private notification: NotificationService,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyChangesService.beginPolicyChangesWizardServiceWizard(
      wizard => { this.wizard = wizard; }, this.user, this.currentStep);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * This function route to the next step (Step2).
   */
  async changeStep2() {
    this.wizard.policyChange.processOptionName = 'ChangeOfPetitioner';
    this.router.navigate(['policies/policy-changes/step2']);
  }

  /**
   * Get nested form controls
   */
  public getControl(formGroupName: string, field: string) {
    return this.wizard.policyChangesForm.get(formGroupName).get(field) as FormControl;
  }


  /**
   * Routing to the back step
   */
  back() {
    this.router.navigate(['policies/policy-changes/step2']);
  }

  /**
  * This function allows calculate the size of a upload file.
  * @param file file to calculate size.
  */
  getFileSize(file) {
    return FileHelper.calculateFileSize(file);
  }

  save() {
    const listDocToSave = this.getUrlDocToSave();
    if (listDocToSave.length > 0) {
      this.saveWithDocuments(listDocToSave);
    } else {
      this.updatePolicy(listDocToSave);
    }
  }

  /***
   * Save documents in Azure. Return the list of url with the that to saved in Azure
   */
  getUrlDocToSave(): any[] {
    const listUrlDocSave = [];
    if (this.wizard.documents.length > 0) {
      this.wizard.documents.forEach(
        doc => {
          listUrlDocSave.push(this.commonService.uploadDocumentToFolderToRepository(
            doc, this.FOLDER_DOC_INQUIRY, this.REPOSITORY_TARGET, true));
        }
      );
    }
    return listUrlDocSave;
  }

  /***
   * If the new policy changes have attachments,
   * first save of documents and then save information request with the URL that return Azure.
   * The request for information is associated with the url of the documents in Azure
   */
  saveWithDocuments(listDocToSave: any[]) {
    forkJoin(listDocToSave).subscribe(
      listDoc => {
        this.updatePolicy(listDoc);
      }
    );
  }

  updatePolicy(listDoc: any[]) {
    const toSave: UpdatePolicyRequestDto =
      this.policyChangesWizardService.buildUpdatePolicyRequestDto(listDoc,
        this.translationService.getLanguageId(), this.wizard.policy,
        this.wizard.policyChangesForm.get('step2').get('description').value,
        this.wizard.policyChange, this.wizard.newAgent);
    this.policyService.updatePolicy(toSave, this.wizard.policyChange.processOptionName).subscribe(async result => {
      await this.showSucessfullMessage();
    },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  showSucessfullMessage() {
    const messageS = this.translate.get(`POLICY.POLICY_CHANGES.SAVE_OK`);
    const tittleS = this.translate.get(`POLICY.POLICY_CHANGES.SAVE_OK_TITLE`);
    const button1 = this.translate.get(`POLICY.POLICY_CHANGES.BUTTON_EXIT`);
    const button2 = this.translate.get(`POLICY.POLICY_CHANGES.BUTTON_NEW_CHANGE`);

    forkJoin([tittleS, messageS, button1, button2]).subscribe(async response => {
      const result = await this.notification.showDialog(response[0],
        response[1], true, response[3], response[2]);
      if (result) {
        this.policyChangesWizardService.endPolicyChangesWizard(this.user);
        this.router.navigate(['policies/policy-changes']);
      } else {
        location.href = this.configurationService.returnUrl;
      }
    });
  }

  showErrorMessage(err: any) {
    const tittleS = this.translate.get(`POLICY.POLICY_CHANGES.SAVE_OK_TITLE`);

    forkJoin([tittleS]).subscribe(async response => {
      this.notification.showDialog(response[0], err);
    });
  }

}
