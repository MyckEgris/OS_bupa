import { Component, OnInit, OnDestroy } from '@angular/core';
import { InformationRequestWizardService } from './information-request-wizard/information-request-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { Utilities } from 'src/app/shared/util/utilities';
import { InformationRequestWizard } from './information-request-wizard/entities/information-request-wizard';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { Location } from '@angular/common';



@Component({
  selector: 'app-information-request',
  templateUrl: './information-request.component.html'
})
export class InformationRequestComponent implements OnInit, OnDestroy {

  /**
   * currentStep
   */
  public currentStep = 1;

  /**
   * user
   */
  private user: UserInformationModel;

  /**
   * subscription
   */
  private subscription: Subscription;

  /**
   * RequestInformationWizard Object
   */
  public wizard: InformationRequestWizard;

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;

  /**
   * Constants for message.
   */
  private CANCEL_TITLE = 'POLICY.APPLICATION.STEP3.CANCEL_TITLE';
  private CANCEL_MESSAGE = 'POLICY.APPLICATION.STEP3.CANCEL_MESSAGE';
  private CANCEL_YES = 'POLICY.APPLICATION.STEP3.CANCEL_YES';
  private CANCEL_NO = 'POLICY.APPLICATION.STEP3.CANCEL_NO';

  /**
   * Constant for step1 Inquiry subStep
   */
  public subStepInquiry: string;

  /**
   * Constant for step1 Telemedicine subStep
   */
  public subStepTelemedicine: string;

  /**
   * currentPath
   */
  public currentPath: string;



  /**
   * constructor method
   * @param informationRequestWizardService informationRequestWizardService Injection
   * @param authService authService Injection
   * @param translate Translate Service Injection
   * @param notification Notification Service Injection
   * @param router routerService Injection
   * @param activeRouter activeRouter Injection
   * @param config Configuration Service Injection
   * @param location Location Injection
   */
  constructor(
    private informationRequestWizardService: InformationRequestWizardService,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private translate: TranslateService,
    private activeRouter: ActivatedRoute,
    private config: ConfigurationService,
    private location: Location
  ) {
  }



  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.setSubSteps();
    this.subscription = this.informationRequestWizardService.beginRequestInformationWizard(wizard => {
      this.wizard = wizard;
      this.getRouteParams();
      this.setStep(this.wizard.currentStep);
    }, this.user, this.currentStep);
  }

  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.informationRequestWizardService.endInformationRequestWizard(this.user);
    }
  }

  /**
   * Set sub steps.
   */
  setSubSteps() {
    this.subStepInquiry = this.config.subStepInquiry;
    this.subStepTelemedicine = this.config.subStepTelemedicine;
  }

  /**
   * Get route params
   */
  getRouteParams() {
    this.activeRouter.params.subscribe(params => {
      if (params) {
        this.wizard.optionType = params['optionType'];
        if (this.wizard.optionType !== this.subStepInquiry &&
          this.wizard.optionType !== this.subStepTelemedicine) {
          this.wizard.optionType = this.subStepInquiry;
          this.router.navigate(['inquiry/information-request/inquiry']);
        }
      }
    }, error => {
      console.error(error);
    });
  }

  /**
   * Establish step to current step
   * @param step Step number
   */
  async setStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.currentStep = step;
  }

  /**
   * Go to search
   */
  async goToSearch() {
    const title = await this.translate.get(this.CANCEL_TITLE).toPromise();
    const message = await this.translate.get(this.CANCEL_MESSAGE).toPromise();
    const yes = await this.translate.get(this.CANCEL_YES).toPromise();
    const no = await this.translate.get(this.CANCEL_NO).toPromise();
    const confirmGo = await this.notification.showDialog(title, message, true, yes, no);
    if (confirmGo) {
      this.router.navigate(['inquiry/view-information-request']);
    }
  }

}

