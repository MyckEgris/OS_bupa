import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyChangesWizard } from '../policy-changes-wizard/entities/policy-changes-wizard';
import { Subscription, forkJoin } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Router } from '@angular/router';
import { PolicyChangesWizardService } from '../policy-changes-wizard/policy-changes-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { FileHelper } from 'src/app/shared/util/file-helper';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { UpdatePolicyRequestDto } from 'src/app/shared/services/policy/entities/updatePolicyRequest.dto';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { Rol } from 'src/app/shared/classes/rol.enum';

@Component({
  selector: 'app-policy-changes-step3-default',
  templateUrl: './policy-changes-step3-default.component.html'
})
export class PolicyChangesStep3DefaultComponent implements OnInit, OnDestroy {

/***
   * List of attachments
   */
  public documents: Array<any>;

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

  private REPOSITORY_TARGET = 'azureStorage';
  private FOLDER_DOC_INQUIRY = 'bupacustomerinquirydocs';

  isPolicyHolder: Boolean = false;

  constructor(
    private router: Router,
    private policyChangesWizardService: PolicyChangesWizardService,
    private authService: AuthService,
    private commonService: CommonService,
    private translationService: TranslationService,
    private policyService: PolicyService,
    private translate: TranslateService,
    private notification: NotificationService,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyChangesWizardService.beginPolicyChangesWizardServiceWizard(
      wizard => { this.wizard = wizard; }, this.user, this.currentStep);
    this.isHolder();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  back() {
    this.router.navigate(['policies/policy-changes/step2']);
  }

  /***
   * Show label Policy Holder
   */
  isHolder() {
    if ((Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) ||
      (Number(this.user.role_id) === Rol.POLICY_HOLDER)) {
      this.isPolicyHolder = true;
    } else {
      this.isPolicyHolder = false;
    }
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
    if ( this.wizard.documents.length > 0) {
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
   * first save of documents and then save policy changes with the URL that return Azure.
   * The policy changes is associated with the url of the documents in Azure
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
        this.wizard.policyChange, null);
    this.policyService.updatePolicy(toSave, this.wizard.policyChange.processOptionName).subscribe( async result => {
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

    forkJoin([tittleS, messageS, button1, button2]).subscribe( async response => {
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

    forkJoin([tittleS]).subscribe( async response => {
      this.notification.showDialog(response[0], err);
    });
  }

}
