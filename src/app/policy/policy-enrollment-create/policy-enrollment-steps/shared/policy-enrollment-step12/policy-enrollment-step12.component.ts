import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentOutputDto } from 'src/app/shared/services/policy/entities/documents.dto';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { QuoteService } from 'src/app/shared/services/quote/quote.service';
import { QuoteDto } from 'src/app/shared/services/quote/entities/quote.dto';


@Component({
  selector: 'app-policy-enrollment-step12',
  templateUrl: './policy-enrollment-step12.component.html',
  styles: []
})
export class PolicyEnrollmentStep12Component implements OnInit, OnDestroy {

  /**
   * Authenticated User Object
   */
  public user: any;

  /***
   * Wizard Subscription
   */
  private subscription: Subscription;

  /**
   * PolicyEnrollment Wizard Object
   */
  public wizard: PolicyEnrollmentWizard;

  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  private configStep: ViewTemplateStep;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  public currentSection: Section;

  /**
   * Const to Identify the current step number
   */
  public currentStep = 12;

  /**
   * Const to Identify the current section number
   */
  public currentSectionNumber = 1;

  /***
   * Const to Identify the nested FormGroup policyApplicationSummary
   */
  public SUMMARY_STEP = 'policyApplicationSummary';

  /***
   * Const to Identify the nested FormGroup policyAppSummary
   */
  public SUMMARY_SECTION = 'policyAppSummary';

  /***
   * Const to Identify the nested FormControl disclaimerCheckSummary
   */
  public DISCLAIMER_CHECK_CTRL = 'disclaimerCheckSummary';

  /**
   * Flag for show form validations.
   */
  public formInvalid: Boolean = false;

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
     * Quotation policy object
     */
  private quotationPolicy: QuoteDto;

  /**
   * constructor method
   * @param authService auth service Injection
   * @param policyEnrollmentWizardService Policy Enrollment Wizard Service Injection
   * @param router Router Injection
   * @param translate Translate Service Injection
   * @param notification Notification Service Injection
   * @param commonService Common Service Service Injection
   * @param policyApplicationService Policy Application Service Injection
   */
  constructor(
    private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private translate: TranslateService,
    private notification: NotificationService,
    private commonService: CommonService,
    private quoteService: QuoteService,
    private policyApplicationService: PolicyApplicationService
  ) { }

  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      wizard => {
        this.wizard = wizard;
        this.setUpForm();
      }, this.user, null, this.currentStep, this.currentSectionNumber);
  }

  /**
   * Sets the Step FormGroup.
   */
  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm.addControl(
      this.configStep.type,
      this.policyEnrollmentWizardService.buildStep(this.currentStep)
    );
    this.currentSection = this.configStep.sections.filter(s => s.id === this.currentSectionNumber)[0];
  }

  /**
   * Get nested form controls.
   */
  public getControl(field: string): FormControl {
    return this.wizard.enrollmentForm.get(this.SUMMARY_STEP).get(this.SUMMARY_SECTION).get(field) as FormControl;
  }

  /**
   * Get nested form group.
   */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.SUMMARY_STEP).get(this.SUMMARY_SECTION) as FormGroup;
  }

  /**
   * Get nested Step form group.
   */
  public getStepFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.SUMMARY_STEP) as FormGroup;
  }

  /**
   * Validate the form and allow to continue.
   */
  next() {
    this.validateForm();
  }

  /**
   * Allow to return.
   */
  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

  /**
   * Redirect to Home.
   */
  goToHome() {
    this.router.navigate(['/']);
  }

  /**
   * Allow to return.
   */
  handleDeactivateMsg() {
    localStorage.setItem('enrollmentMaxStep', '0');
  }

  /**
   * Validate form validations.
   */
  validateForm() {
    const isInvalid = this.getStepFormGroup().invalid;
    if (isInvalid || !this.getControl(this.DISCLAIMER_CHECK_CTRL).value) {
      this.formInvalid = true;
    } else {
      this.formInvalid = false;
      this.createPolicyApplication();
    }
  }

  /**
   * Save the form information in the wizard service and show sucess message.
   */
  createPolicyApplication() {
    // this.policyEnrollmentWizardService.buildPolicyApplication();
    this.policyApplicationService.createPolicyApplication(this.wizard.policyApplicationModel)
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

    this.handleDeactivateMsg();
    this.nextPage();

  }

  /**
   * Route to next page.
   */
  nextPage() {
    this.router.navigate(['/']);
  }

  /**
 * Handle if the user can download documents.
 * @param policy Policy object.
 */
  handleDownloadFile(policyApplication: PolicyApplicationModel) {
    if (policyApplication) {
      const appGuid = policyApplication.applicationGuid;
      if (appGuid) {
        this.downloadFile(policyApplication);
      }
    }
  }

  /**
   * downloads the documents the user select on the screen
   * @param doc Document object.
   */
  downloadFile(policyApplication: PolicyApplicationModel) {
    const peticion = this.policyApplicationService.generatePolicyApplicationPdf(policyApplication.applicationGuid,
      policyApplication.applicationId, policyApplication.status);
    peticion.subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      saveAs(blob, String(policyApplication.applicationId));
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

  async createQuoteDto() {
    const quoteId = await this.commonService.newGuidNuevo().toPromise();
    // const quoteDto: QuoteDto = {

    // }
  }


}

