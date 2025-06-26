import { Component, OnInit, OnDestroy } from '@angular/core';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { PolicyChangesWizard } from '../policy-changes-wizard/entities/policy-changes-wizard';
import { Subscription } from 'rxjs';
import { PolicyChangesWizardService } from '../policy-changes-wizard/policy-changes-wizard.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-policy-changes-step2-default',
  templateUrl: './policy-changes-step2-default.component.html'
})
export class PolicyChangesStep2DefaultComponent implements OnInit, OnDestroy {

  /***
   * List of attachments
   */
  public documents: Array<any>;

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
   * Const to Identify the FormGroup Step2
   */
  private STEP2 = 'step2';
  public type1 = 'type1';

   /***
   * Max chars allowed field details
   */
  public MAX_CHARS_ALLOWED_DESC = 2000;

  constructor(
    private translate: TranslateService,
    private notification: NotificationService,
    private router: Router,
    private uploadService: UploadService,
    private policyChangesService: PolicyChangesWizardService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyChangesService.beginPolicyChangesWizardServiceWizard(
      wizard => { this.wizard = wizard; }, this.user, this.currentStep);
    this.documents = this.uploadService.getDocuments();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
   * This function route to the next step (Step2).
   */
  async next() {
    const descrip2000 = this.wizard.policyChangesForm.get(this.STEP2).get('description').value.substring(0, this.MAX_CHARS_ALLOWED_DESC);
    this.wizard.policyChangesForm.get(this.STEP2).get('description').setValue(descrip2000);

    this.wizard.documents = this.uploadService.getDocuments();
    if (this.validateAttachament()) {
      this.router.navigate(['policies/policy-changes/step3']);
    }
  }

  private validateAttachament() {
    if (this.wizard.policyChange.documents.length > 0) {
      if (this.wizard.documents.length > 0) {
        return true;
      } else {
        this.showMessageDocuments();
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * If error is Documents
   */
  showMessageDocuments() {
    let message = '';
    let messageTitle = '';
    this.translate.get(`POLICY.POLICY_CHANGES.ERROR.ERROR_MESSAGE.MESSAGE_ATTACHMENT`).subscribe(
      result => message = result
    );
    this.translate.get(`POLICY.POLICY_CHANGES.ERROR.ERROR_CODE.MESSAGE_ATTACHMENT`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    this.router.navigate(['policies/policy-changes/step1']);
  }

}
