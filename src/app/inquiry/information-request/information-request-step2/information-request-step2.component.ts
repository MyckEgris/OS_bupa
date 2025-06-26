import { Component, OnInit, OnDestroy } from '@angular/core';
import { InformationRequestWizardService } from '../information-request-wizard/information-request-wizard.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, forkJoin } from 'rxjs';
import { InformationRequestWizard } from '../information-request-wizard/entities/information-request-wizard';
import { FileHelper } from 'src/app/shared/util/file-helper';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { InquiryDto } from 'src/app/shared/services/inquiry/entities/inquiry.dto';
import { CustomerService } from 'src/app/shared/services/inquiry/customer.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { InquiryHelper } from 'src/app/shared/services/inquiry/helpers/inquiry.helper';

@Component({
  selector: 'app-information-request-step2',
  templateUrl: './information-request-step2.component.html'
})
export class InformationRequestStep2Component implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  private subscription: Subscription;

  /**
   * InformationRequestWizard Object
   */
  public wizard: InformationRequestWizard;

  /**
   * Constant for current step # 2
   */
  public currentStep = 2;

  public subStepInquiry = false;

  public subStepTelemedicine = false;

  constructor(
    private informationRequestWizardService: InformationRequestWizardService,
    private authService: AuthService,
    private configurationService: ConfigurationService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.informationRequestWizardService.beginRequestInformationWizard(wizard => {
      this.wizard = wizard;
      this.handleStep2SubStep();
    }, this.user, this.currentStep);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleStep2SubStep() {
    if (this.wizard.optionType === this.configurationService.subStepInquiry) {
      this.subStepInquiry = true;
    }
    if (this.wizard.optionType === this.configurationService.subStepTelemedicine) {
      this.subStepTelemedicine = true;
    }
  }

}
