import { FileDocument } from './../../../shared/upload/dialog/fileDocument';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { RuleByBusiness } from 'src/app/shared/services/common/entities/rule-by-business';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationWizard } from '../policy-application-wizard/entities/policy-application-wizard';
import { PolicyApplicationWizardService } from '../policy-application-wizard/policy-application-wizard.service';

@Component({
  selector: 'app-policy-application-step2',
  templateUrl: './policy-application-step2.component.html'
})
export class PolicyApplicationStep2Component implements OnInit, OnDestroy {

  /**
   * Subscription
   */
  private subscription: Subscription;

  private currentStep = 2;

  private user;

  /**
   * PolicyApplicationWizard object
   */
  public wizard: PolicyApplicationWizard;

  public type1 = 'type1';

  public type2 = 'type2';

  public type3 = 'type3';

  public type4 = 'type4';

  public documents: Array<any>;

  public rules: Array<RuleByBusiness>;

  public rulesForm: FormGroup;

  public typeAttachment: string;

  private HEALTH = 'POLICY.APPLICATION.STEP2.CATEGORIES.HEALTH';

  private PAYMENT = 'POLICY.APPLICATION.STEP2.CATEGORIES.PAYMENT';

  private RECORDS = 'POLICY.APPLICATION.STEP2.CATEGORIES.RECORDS';

  private REGULATORY = 'POLICY.APPLICATION.STEP2.CATEGORIES.REGULATORY';

  private UPLOAD_DOCUMENT_MANDATORY_TITLE = 'POLICY.APPLICATION.STEP2.HEALTH_MANDATORY_TITLE';

  private UPLOAD_DOCUMENT_MANDATORY_MESSAGE = 'POLICY.APPLICATION.STEP2.SECTION_MANDATORY_MESSAGE';

  private VALIDATE_CONTINUE = 'POLICY.APPLICATION.STEP2.VALIDATE_CONTINUE';

  private CONTINUE_MESSAGE = 'POLICY.APPLICATION.STEP2.CONTINUE_MESSAGE';

  private CONTINUE_YES = 'APP.BUTTON.YES_BTN';

  private CONTINUE_NO = 'APP.BUTTON.NO_BTN';



  constructor(
    private policyApplicationWizardService: PolicyApplicationWizardService,
    private router: Router,
    private uploadService: UploadService,
    private authService: AuthService,
    private notification: NotificationService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.initStructures();
    // this.buildRulesForm();
    this.documents = this.uploadService.getDocuments();
    this.subscription = this.policyApplicationWizardService.beginPolicyApplicationWizard(wizard => {
      this.wizard = wizard;
    }, this.user, this.currentStep);
    // this.commonService.getRulesByBusiness(41, 'PolicyIntake').subscribe(rules => this.rules = rules);
  }

  /**
   * Destroy and free subscription resource
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initStructures() {
    this.documents = [];
    this.rules = [];
  }

  buildRulesForm() {
    this.rulesForm = this.fb.group({
      rule: this.fb.array([])
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

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    this.router.navigate(['policies/create-policy-application/step1']);
  }

  /**
   * This function route to the next step (Step3).
   */
  async next() {
    if (await this.continueProcess()) {
      this.wizard.documents = this.uploadService.getDocuments();
      this.router.navigate(['policies/create-policy-application/step3']);
    }
  }

  checkIfHaveDocumentsByCategory(category) {
    return this.documents.find(d => d.category === category);
  }

  async continueProcess() {
    let continueProcess = true;

    continueProcess = await this.showMessageIfWishContinueForCategory(this.type1,
      await this.translate.get(this.HEALTH).toPromise(), continueProcess, true);
    continueProcess = await this.showMessageIfWishContinueForCategory(this.type2,
      await this.translate.get(this.PAYMENT).toPromise(), continueProcess, false);
    continueProcess = await this.showMessageIfWishContinueForCategory(this.type3,
      await this.translate.get(this.RECORDS).toPromise(), continueProcess, false);
    continueProcess = await this.showMessageIfWishContinueForCategory(this.type4,
      await this.translate.get(this.REGULATORY).toPromise(), continueProcess, false);

    return continueProcess;
  }

  async showMessageIfWishContinueForCategory(category, categoryname, continueProcess, isMandatory) {
    if (!this.checkIfHaveDocumentsByCategory(category) && continueProcess) {
      if (isMandatory) {
        const msg = await this.translate.get(this.UPLOAD_DOCUMENT_MANDATORY_MESSAGE).toPromise();
        await this.notification.showDialog(this.UPLOAD_DOCUMENT_MANDATORY_TITLE,
          msg.toString().replace('{0}', categoryname));
        return false;
      }
      const title = await this.translate.get(this.VALIDATE_CONTINUE).toPromise();
      const message = await this.translate.get(this.CONTINUE_MESSAGE).toPromise();
      const yes = await this.translate.get(this.CONTINUE_YES).toPromise();
      const no = await this.translate.get(this.CONTINUE_NO).toPromise();
      continueProcess = await this.notification.showDialog(title.toString().replace('{0}', categoryname),
        message.toString().replace('{0}', categoryname), true, yes, no);
    }
    return continueProcess;
  }

  onRuleCheckboxChange(rule: RuleByBusiness, isChecked: boolean) {
    this.wizard.rulesFormArray = <FormArray>this.rulesForm.controls.rule;

    if (isChecked) {
      this.wizard.rulesFormArray.push(new FormControl(rule));
    } else {
      const index = this.wizard.rulesFormArray.controls.findIndex(x => x.value === rule);
      this.wizard.rulesFormArray.removeAt(index);
    }
  }

}
