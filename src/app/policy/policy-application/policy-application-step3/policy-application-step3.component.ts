import { ConfigurationService } from './../../../shared/services/configuration/configuration.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { FileHelper } from './../../../shared/util/file-helper';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { PolicyApplicationWizard } from '../policy-application-wizard/entities/policy-application-wizard';
import { PolicyApplicationWizardService } from '../policy-application-wizard/policy-application-wizard.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';

@Component({
  selector: 'app-policy-application-step3',
  templateUrl: './policy-application-step3.component.html'
})
export class PolicyApplicationStep3Component implements OnInit {

  private user: any;

  /**
   * Subscription
   */
  private subscription: Subscription;

  private currentStep = 3;

  private HEALTH = 'POLICY.APPLICATION.STEP2.CATEGORIES.HEALTH';

  private PAYMENT = 'POLICY.APPLICATION.STEP2.CATEGORIES.PAYMENT';

  private RECORDS = 'POLICY.APPLICATION.STEP2.CATEGORIES.RECORDS';

  private REGULATORY = 'POLICY.APPLICATION.STEP2.CATEGORIES.REGULATORY';

  private CANCEL_TITLE = 'POLICY.APPLICATION.STEP3.CANCEL_TITLE';

  private CANCEL_MESSAGE = 'POLICY.APPLICATION.STEP3.CANCEL_MESSAGE';

  private CANCEL_YES = 'POLICY.APPLICATION.STEP3.CANCEL_YES';

  private CANCEL_NO = 'POLICY.APPLICATION.STEP3.CANCEL_NO';

  private VALIDATE_CONTINUE = 'POLICY.APPLICATION.STEP3.VALIDATE_CONTINUE';

  private CONTINUE_MESSAGE = 'POLICY.APPLICATION.STEP3.CONTINUE_MESSAGE';

  private ERROR_SUBMITING_TITLE = 'POLICY.APPLICATION.STEP3.ERROR_SUBMITING_TITLE';

  private ERROR_SUBMITING_MESSAGE = 'POLICY.APPLICATION.STEP3.ERROR_SUBMITING_MESSAGE';

  private ERROR_SUBMITING_MESSAGE_BE_003 = 'POLICY.APPLICATION.STEP3.ERROR_SUBMITING_MESSAGE_BE_003';

  private GO_BACK = 'POLICY.APPLICATION.STEP3.GO_BACK';

  private CLOSE = 'POLICY.APPLICATION.STEP3.CLOSE';

  private SUCCESS_TITLE = 'POLICY.APPLICATION.STEP3.SUCCESS_TITLE';

  private SUCCESS_MESSAGE = 'POLICY.APPLICATION.STEP3.SUCCESS_MESSAGE';

  private NEW_POLICY = 'POLICY.APPLICATION.STEP3.NEW_POLICY';


  /**
 * PolicyApplicationWizard object
 */
  public wizard: PolicyApplicationWizard;

  public confirmDeclaration: boolean;

  categories: Array<string> = ['type1', 'type2', 'type3', 'type4'];

  /**
   * Current agent phone string
   */
  public agentRole = '';

  /**
   * fileScroll to access native element in DOM
   */
  @ViewChild('fileScroll') fileScroll;

  constructor(
    private authService: AuthService,
    private policyApplicationWizardService: PolicyApplicationWizardService,
    private policyApplicationService: PolicyApplicationService,
    private router: Router,
    private commonService: CommonService,
    private notification: NotificationService,
    private translate: TranslateService,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit() {
    this.confirmDeclaration = undefined;
    this.user = this.authService.getUser();
    this.subscription = this.policyApplicationWizardService.beginPolicyApplicationWizard(wizard => {
      this.wizard = wizard;
    }, this.user, this.currentStep);
    this.commonService.newGuid(g => this.wizard.policyApplicationGuid = g);
    this.commonService.newGuid(g => this.wizard.statusGuid = g);

    this.commonService.newGuid(g => this.wizard.phoneGuid = g);
    this.commonService.newGuid(g => this.wizard.emailGuid = g);
    this.commonService.newGuid(g => this.wizard.memberGuid = g);
    this.getRoleTranslated();
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    this.router.navigate(['policies/create-policy-application/step2']);
  }


  async cancel() {
    const title = await this.translate.get(this.CANCEL_TITLE).toPromise();
    const message = await this.translate.get(this.CANCEL_MESSAGE).toPromise();
    const yes = await this.translate.get(this.CANCEL_YES).toPromise();
    const no = await this.translate.get(this.CANCEL_NO).toPromise();
    const confirmCancel = await this.notification.showDialog(title, message, true, yes, no);
    if (confirmCancel) {
      this.policyApplicationWizardService.endPolicyApplicationWizard(this.user);
      this.router.navigate(['policies/create-policy-application/step1']);
    }
  }

  checkIfHaveDocumentsByCategory(category) {
    return this.wizard.documents.find(d => d.category === category);
  }

  async showMessageIfWishContinueForCategory(category, categoryname, continueProcess) {
    if (!continueProcess) {
      return;
    }
    let haveDocument = true;
    if (!this.checkIfHaveDocumentsByCategory(category)) {
      const title = await this.translate.get(this.VALIDATE_CONTINUE).toPromise();
      const message = await this.translate.get(this.CONTINUE_MESSAGE).toPromise();
      await this.notification.showDialog(title.toString().replace('{0}', categoryname), message.toString().replace('{0}', categoryname));
      haveDocument = false;
    }

    return haveDocument;
  }

  /**
   * Submit Step 3 to claim submission service with claims, documents and folders
   */
  async submit() {
    this.checkIfDeclarationIsConfirmed();
    if (!this.confirmDeclaration) {
      return;
    }
    try {
      if (this.wizard.documents.length > 0) {
        for (let i = 0; i < this.categories.length; i++) {
          const documentsFilteredByCategory = this.getDocumentsByCategory(this.categories[i]);
          if (documentsFilteredByCategory.length > 0 ) {
            const response = await this.commonService.uploadFirstDocument(documentsFilteredByCategory[0]);
            this.wizard.folderNameByCategory.push({category: this.categories[i], folder: response.folderName});
            if (documentsFilteredByCategory.length > 1) {
              for (let index = 1; index < documentsFilteredByCategory.length; index++) {
                if (index > 10) {
                  this.fileScroll.nativeElement.scrollTop = ((index - 6) * 22);
                }
                await this.commonService.uploadDocumentToFolder(documentsFilteredByCategory[index], response.folderName);
              }
            }
          }
        }
      }

      this.policyApplicationWizardService.buildPolicyApplication();
      this.policyApplicationService.createPolicyApplication(this.wizard.policyApplication)
        .subscribe(
          p => {
              this.success(p);
          }, async e => {
            if (this.checkIfHasError(e)) {
              const errorMessage = e.error.code === 'BE_003' ? this.ERROR_SUBMITING_MESSAGE_BE_003 : this.ERROR_SUBMITING_MESSAGE;
              const title = await this.translate.get(this.ERROR_SUBMITING_TITLE).toPromise();
              const message = await this.translate.get(errorMessage).toPromise();
              const goBack = await this.translate.get(this.GO_BACK).toPromise();
              const close = await this.translate.get(this.CLOSE).toPromise();
              const failed = await this.notification.showDialog(title, message, true, goBack, close);
              if (failed) {
                return;
              } else {
                this.goToHomePage();
              }
            }
          },
        );
    } catch {
      // this.showError();
    }
  }

  async success(policyApplicationOutput: PolicyApplicationOutputDto) {

    const policyApplicationNumber = policyApplicationOutput.applicationId;
    const title = await this.translate.get(this.SUCCESS_TITLE).toPromise();
    const message = await this.translate.get(this.SUCCESS_MESSAGE).toPromise();
    const newPolicy = await this.translate.get(this.NEW_POLICY).toPromise();
    const close = await this.translate.get(this.CLOSE).toPromise();
    const getIt = await this.notification.showDialog(title,
      message.toString().replace('{0}', policyApplicationNumber), true, newPolicy, close);
    if (getIt) {
      this.policyApplicationWizardService.endPolicyApplicationWizard(this.user);
      Utilities.delay(1000);
      this.router.navigate(['policies/create-policy-application/step1']);
    } else {
      this.goToHomePage();
    }
  }

  checkIfHasError(error) {
    return (error.error);
  }

  goToHomePage() {
    location.href = this.configurationService.returnUrl;
  }

  goToStepOne() {
    location.href = `${this.configurationService.returnUrl}/policies/create-policy-application`;
  }

  /**
 * This fucntion allows calculate the size of a upload file.
 * @param file file to calculate size.
 */
  getFileSize(file) {
    return FileHelper.calculateFileSize(file);
  }

  changeConfirm(e) {
    this.confirmDeclaration = e.target.checked;
  }

  checkIfDeclarationIsConfirmed() {
    if (this.confirmDeclaration === undefined) {
      this.confirmDeclaration = false;
    }
  }

  /**
   * translate current user role
   */
  getRoleTranslated() {
    this.agentRole = this.policyApplicationWizardService.getRoleTranslated(this.user.role);
  }

  public getDocumentsByCategory(category: string) {
    return this.wizard.documents.filter(x => x.category === category);
  }
}
