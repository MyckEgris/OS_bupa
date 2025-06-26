import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, forkJoin } from 'rxjs';
import { InformationRequestWizard } from '../../information-request-wizard/entities/information-request-wizard';
import { InformationRequestWizardService } from '../../information-request-wizard/information-request-wizard.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CustomerService } from 'src/app/shared/services/inquiry/customer.service';
import { InquiryHelper } from 'src/app/shared/services/inquiry/helpers/inquiry.helper';
import { FileHelper } from 'src/app/shared/util/file-helper';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { InquiryDto } from 'src/app/shared/services/inquiry/entities/inquiry.dto';
import { InquiriesOutputDto } from 'src/app/shared/services/inquiry/entities/inquiries-output.dto';

@Component({
  selector: 'app-information-request-step2-inquiry',
  templateUrl: './information-request-step2-inquiry.component.html'
})
export class InformationRequestStep2InquiryComponent implements OnInit, OnDestroy {

  /**
  * User Authenticated Object
  */
  public user: UserInformationModel;

  private subscription: Subscription;

  private subscriptionTraslate: Subscription;

  /**
   * InformationRequestWizard Object
   */
  public wizard: InformationRequestWizard;

  /**
   * Constant for current step # 2
   */
  public currentStep = 2;

  /***
   * Confirm read terms and conditions
   */
  confirmDeclaration: boolean;

  showError: Boolean = false;

  public oldInquiry: InquiriesOutputDto;

  private REPOSITORY_TARGET = 'azureStorage';
  private FOLDER_DOC_INQUIRY = 'bupacustomerinquirydocs';

  constructor(
    private informationRequestWizardService: InformationRequestWizardService,
    private router: Router,
    private translationService: TranslationService,
    private authService: AuthService,
    private notification: NotificationService,
    private translate: TranslateService,
    private commonService: CommonService,
    private customerService: CustomerService,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit() {
    this.confirmDeclaration = undefined;
    this.user = this.authService.getUser();
    this.subscription = this.informationRequestWizardService.beginRequestInformationWizard(wizard => {
      this.wizard = wizard;
    }, this.user, this.currentStep);

    this.subscriptionTraslate = this.translate.onLangChange.subscribe(() => {
      InquiryHelper.getTreeViewTraslate(this.wizard.listSubject, this.wizard.subject, this.translationService.getLanguageId());
    });

    this.oldInquiry = this.customerService.getInquiryResultByInquiry();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscriptionTraslate.unsubscribe();
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    this.router.navigate([`inquiry/information-request/${this.wizard.optionType}/step1`]);
  }

  /**
 * This function allows calculate the size of a upload file.
 * @param file file to calculate size.
 */
  getFileSize(file) {
    return FileHelper.calculateFileSize(file);
  }

  /***
   * Confirm read terms and conditions
   */
  changeConfirm(e) {
    this.confirmDeclaration = e.target.checked;
  }

  checkIfDeclarationIsConfirmed() {
    if (this.confirmDeclaration === undefined) {
      this.confirmDeclaration = false;
    }
  }

  /***
   * Submit form for create new information request
   */
  save() {
    if (this.confirmDeclaration) {
      let listDocToSave = [];
      let userKey = this.user.user_key;
      if (Number(this.user.role_id) === Rol.POLICY_HOLDER
        || Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) {
        userKey = this.wizard.holderMemberId.toString();
      }
      if (Number(this.user.role_id) === Rol.PROVIDER) {
        userKey = this.user.user_key_alternative;
      }
      if (this.wizard.documents.length > 0) {
        listDocToSave = this.getUrlDocToSave();
        this.saveWithDocuments(listDocToSave, userKey);
      } else {
        this.saveWithoutDoc(userKey);
      }
    } else {
      this.showError = true;
    }
  }

  /***
   * Save documents in Azure. Return the list of url with the that to saved in Azure
   */
  getUrlDocToSave(): any[] {
    if (this.wizard.documents.length > 0) {
      const listUrlDocSave = [];
      this.wizard.documents.forEach(
        doc => {
          listUrlDocSave.push(this.commonService.uploadDocumentToFolderToRepository(
            doc, this.FOLDER_DOC_INQUIRY, this.REPOSITORY_TARGET, true));
        }
      );
      return listUrlDocSave;
    }
  }

  /***
   * If the new information request have attachments,
   * first save of documents and then save information request with the URL that return Azure.
   * The request for information is associated with the url of the documents in Azure
   */
  saveWithDocuments(listDocToSave: any[], userKey: string) {
    forkJoin(listDocToSave).subscribe(
      listDoc => {
        const toSave: InquiryDto =
          this.informationRequestWizardService.buildDtoInformationRequest(listDoc, this.translationService.getLanguageId());
        this.saveInquiry(toSave, userKey);
      }
    );
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
    const messageS = this.translate.get(`INQUIRY.INFORMATION_REQUEST.MESSAGES.MESSAGE_SAVE_OK`);
    const tittleS = this.translate.get(`INQUIRY.INFORMATION_REQUEST.MESSAGES.MESSAGE_SAVE_OK_TITLE`);
    const newInformationRequest = this.translate.get(`INQUIRY.INFORMATION_REQUEST.MESSAGES.NEW_INFORMATION_REQUEST`);
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

  /**
   * Cancel the inquiry wizard process and redirect to home.
   */
  cancel() {
    this.informationRequestWizardService.endInformationRequestWizard(this.user);
    this.goToHomePage();
  }

}
