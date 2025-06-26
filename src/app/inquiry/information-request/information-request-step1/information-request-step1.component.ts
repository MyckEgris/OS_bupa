import { Component, OnInit, OnDestroy } from '@angular/core';
import { InformationRequestWizard } from '../information-request-wizard/entities/information-request-wizard';
import { InformationRequestWizardService } from '../information-request-wizard/information-request-wizard.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';



@Component({
  selector: 'app-information-request-step1',
  templateUrl: './information-request-step1.component.html'
})
export class InformationRequestStep1Component implements OnInit, OnDestroy {

  /**
   * currentStep
   */
  public currentStep = 1;

  /**
   * user
   */
  public user: UserInformationModel;

  /**
   * subscription
   */
  private subscription: Subscription;

  /**
   * RequestInformationWizard Object
   */
  public wizard: InformationRequestWizard;

  /**
   * Flag for step1 Inquiry Mexico subStep
   */
  public subStepInquiryMexico = false;

  /**
   * Flag for step1 Inquiry Default subStep
   */
  public subStepInquiryDefault = false;

  /**
   * Flag for step1 Telemedicine subStep
   */
  public subStepTelemedicine = false;



  /**
  * constructor method
  * @param informationRequestWizardService informationRequestWizardService Injection
  * @param authService authService Injection
  * @param translate Translate Service Injection
  * @param config Configuration Service Injection
  */
  constructor(
    private informationRequestService: InformationRequestWizardService,
    private authService: AuthService,
    private translate: TranslateService,
    private config: ConfigurationService
  ) { }


  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.informationRequestService.beginRequestInformationWizard(
      wizard => {
        this.wizard = wizard;
        this.handleStep1SubStep();
      }, this.user, this.currentStep);
  }

  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Handle step1 sub step according optionType.
   */
  handleStep1SubStep() {
    if (this.wizard.optionType === this.config.subStepInquiry) {
      if (this.user.bupa_insurance === InsuranceBusiness.BUPA_MEXICO.toString()) {
        this.subStepInquiryMexico = true;
      } else {
        this.subStepInquiryDefault = true;
      }
    }
    if (this.wizard.optionType === this.config.subStepTelemedicine) {
      this.subStepTelemedicine = true;
    }
  }


}
