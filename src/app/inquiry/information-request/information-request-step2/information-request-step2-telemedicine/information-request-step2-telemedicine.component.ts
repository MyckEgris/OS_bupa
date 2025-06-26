import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, forkJoin } from 'rxjs';
import { InformationRequestWizard } from '../../information-request-wizard/entities/information-request-wizard';
import { InformationRequestWizardService } from '../../information-request-wizard/information-request-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from 'src/app/shared/services/inquiry/customer.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { InquiryDto } from 'src/app/shared/services/inquiry/entities/inquiry.dto';
import { Utilities } from 'src/app/shared/util/utilities';

@Component({
  selector: 'app-information-request-step2-telemedicine',
  templateUrl: './information-request-step2-telemedicine.component.html'
})
export class InformationRequestStep2TelemedicineComponent implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * InformationRequestWizard Object
   */
  public wizard: InformationRequestWizard;

  /**
  * Constant for current step # 2
  */
  public currentStep = 2;

  /**
   * Show Error
   */
  showError: Boolean = false;

  /***
   * Confirm read terms and conditions
   */
  confirmDeclaration: boolean;

  /**
   * Show Error
   */
  showErrorTwo: Boolean = false;

  /***
   * Confirm read terms and conditions
   */
  confirmDeclarationTwo: boolean;

  /***
   * hourFormatted
   */
  public hourFormatted = '';




  /**
   *
   * @param informationRequestWizardService Information Request Service Injection
   * @param router Router Service Injection
   * @param translationService Translataion Service Injection
   * @param authService auth Service Injection
   * @param notification Notification Service Injection
   * @param translate Translate Service Injection
   * @param customerService Customer Service Injection
   * @param configurationService Configuration Service Injection
   */
  constructor(
    private informationRequestWizardService: InformationRequestWizardService,
    private router: Router,
    private translationService: TranslationService,
    private authService: AuthService,
    private notification: NotificationService,
    private translate: TranslateService,
    private customerService: CustomerService,
    private configurationService: ConfigurationService
  ) { }




  /**
   * Init inquiry wizard
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.informationRequestWizardService.beginRequestInformationWizard(wizard => {
      this.wizard = wizard;
      this.setHourFormat();
    }, this.user, this.currentStep);
  }

  setHourFormat() {
    if (this.wizard.appointmentType.appointmentTime) {
      const hour = this.wizard.appointmentType.appointmentTime.hour.toString();
      const minute = this.wizard.appointmentType.appointmentTime.minute.toString();
      const time = `${hour.toString()}:${minute.toString()}`;
      this.hourFormatted = Utilities.getMeridianTime(time);
    }
  }

  /**
   * on destroy component
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    this.router.navigate([`inquiry/information-request/${this.wizard.optionType}/step1`]);
  }

  /***
   * Submit form for create new information request
   */
  save() {
    if (this.confirmDeclaration && this.confirmDeclarationTwo) {
      let userKey = this.user.user_key;
      if (Number(this.user.role_id) === Rol.POLICY_HOLDER
        || Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) {
        userKey = this.wizard.holderMemberId.toString();
      }
      if (Number(this.user.role_id) === Rol.PROVIDER) {
        userKey = this.user.user_key_alternative;
      }
      this.saveWithoutDoc(userKey);
    } else {
      if (!this.confirmDeclaration) {
        this.showError = true;
      }
      if (!this.confirmDeclarationTwo) {
        this.showErrorTwo = true;
      }
    }
  }

  /***
   * Save the information request without attachments
   */
  saveWithoutDoc(userKey: string) {
    const toSave: InquiryDto =
      this.informationRequestWizardService.buildDtoInformationRequest([], this.translationService.getLanguageId());
    this.saveInquiry(toSave, userKey);
  }

  /***
   * Call the service Customer to Save Inquiry
   */
  saveInquiry(toSaveInquiryDto: InquiryDto, userKey: string) {
    this.customerService.saveInquiry(toSaveInquiryDto, userKey).subscribe(
      ok => {
        this.showMessageOK();
      },
      error => {
        if (error.code === 'BE_001') {
          this.showErrorBussines();
        } else {
          this.showMessageError();
        }
      }
    );
  }

  /***
   * Show message Information Request save OK
   */
  showMessageOK() {
    const messageS = this.translate.get(`INQUIRY.INFORMATION_REQUEST.MESSAGES.MESSAGE_SAVE_OK_TELEMEDICINE`);
    const tittleS = this.translate.get(`INQUIRY.INFORMATION_REQUEST.MESSAGES.MESSAGE_SAVE_OK_TITLE_TELEMEDICINE`);
    const newInformationRequest = this.translate.get(`INQUIRY.INFORMATION_REQUEST.MESSAGES.NEW_INFORMATION_REQUEST_TELEMEDICINE`);
    const finish = this.translate.get(`INQUIRY.INFORMATION_REQUEST.MESSAGES.FINISH`);

    forkJoin([tittleS, messageS, newInformationRequest, finish]).subscribe(async response => {
      const getIt = await this.notification.showDialog(response[0], response[1], true, response[2], response[3]);
      if (getIt) {
        this.informationRequestWizardService.endInformationRequestWizard(this.user);
        this.back();
      } else {
        this.goToHomePage();
      }
    });
  }

  /**
   * Redirect to home
   */
  goToHomePage() {
    location.href = this.configurationService.returnUrl;
  }

  /***
   * Show message Information Request save Error
   */
  showMessageError() {
    const messageS = this.translate.get(`INQUIRY.INFORMATION_REQUEST.ERROR.ERROR_MESSAGE.MESSAGE_SAVE_ERROR`);
    const tittleS = this.translate.get(`INQUIRY.INFORMATION_REQUEST.ERROR.ERROR_CODE.MESSAGE_SAVE_ERROR_CODE`);
    const retryInformationRequest = this.translate.get(`INQUIRY.INFORMATION_REQUEST.RETRY`);
    const cancel = this.translate.get(`INQUIRY.INFORMATION_REQUEST.CANCEL`);

    forkJoin([tittleS, messageS, retryInformationRequest, cancel]).subscribe(async response => {
      const getIt = await this.notification.showDialog(response[0], response[1], true, response[2], response[3]);
      if (getIt) {
        this.save();
      } else {
        this.goToHomePage();
      }
    });
  }

  /***
   * Show message Information Request save Error
   */
  showErrorBussines() {
    const messageS = this.translate.get(`INQUIRY.INFORMATION_REQUEST.ERROR.ERROR_MESSAGE.MESSAGE_SAVE_ERROR`);
    const tittleS = this.translate.get(`INQUIRY.INFORMATION_REQUEST.ERROR.ERROR_CODE.MESSAGE_SAVE_ERROR_CODE`);

    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  /***
   * Confirm read terms and conditions
   */
  changeConfirm(e, checkNumber) {

    switch (checkNumber) {

      case 1:
        this.confirmDeclaration = e.target.checked;
        if (this.confirmDeclaration) {
          this.showError = false;
        }
        break;

      case 2:
        this.confirmDeclarationTwo = e.target.checked;
        if (this.confirmDeclarationTwo) {
          this.showErrorTwo = false;
        }
        break;

      default:
        break;
    }

  }

  /**
   * Cancel the inquiry wizard process and redirect to home.
   */
  cancel() {
    this.informationRequestWizardService.endInformationRequestWizard(this.user);
    this.goToHomePage();
  }

}
