import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription, forkJoin, concat } from 'rxjs';
import { PreAuthorizationWizardService } from '../pre-authorization-wizard/pre-authorization-wizard.service';
import { PreAuthorizationService } from 'src/app/shared/services/claim/pre-authorization/pre-authorization.service';
import { UploadService } from 'src/app/shared/services/upload/upload.service';
import { PreAuthorizationWizard } from '../pre-authorization-wizard/entities/pre-authorization-wizard';
import { FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FileHelper } from 'src/app/shared/util/file-helper';
import { PreAuthorizationDto } from 'src/app/shared/services/claim/pre-authorization/entities/pre-authorization.dto';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { UploadResponse } from 'src/app/shared/services/common/entities/uploadReponse';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';

@Component({
  selector: 'app-pre-authorization-step3',
  templateUrl: './pre-authorization-step3.component.html'
})
export class PreAuthorizationStep3Component implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /**
   * Subscription wizard
   */
  private subscription: Subscription;

  /***
   * Subscription provider servide
   */
  private subProvider: Subscription;

  /**
   * PreAuthorizationWizard Object
   */
  public wizard: PreAuthorizationWizard;

  /**
   * Constant for current step # 3
   */
  public currentStep = 3;

  /***
   * FormArray contains Provider information
   */
  public itemsProvider: FormArray = null;

  /***
   * FormArray contains contact information
   */
  public itemsContacts: FormArray = null;

  constructor(
    private translate: TranslateService,
    private notification: NotificationService,
    private router: Router,
    private preAuthWizardService: PreAuthorizationWizardService,
    private translationService: TranslationService,
    private authService: AuthService,
    private preAuthorizationService: PreAuthorizationService,
    private commonService: CommonService,
    private configurationService: ConfigurationService,
    private providerService: ProviderService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.preAuthWizardService.beginPreAuthWizardServiceWizard(wizard => {
      this.wizard = wizard;
    }, this.user, this.currentStep);
    this.getProviderInformation();
    this.getContactInformation();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subProvider) {
      this.subProvider.unsubscribe();
    }
    this.itemsProvider = null;
    this.itemsContacts = null;
  }

  /***
   * Get Member Information
   */
  getControlMember() {
    return this.wizard.preAuthForm.get('memberInformation');
  }

  /***
   * Get Provider Information
   */
  getProviderInformation() {
    this.itemsProvider = this.wizard.preAuthForm.get('infoProviderForm').get('items') as FormArray;
  }

  /***
   * Get Conctacts Informarion
   */
  getContactInformation() {
    this.itemsContacts = this.wizard.preAuthForm.get('contactInformation').get('items') as FormArray;
  }

  /***
   * Get Medical Information
   */
  getMedicalInformation() {
    return this.wizard.preAuthForm.get('medicalInformation');
  }

  /**
   * This function allows calculate the size of a upload file.
   * @param file file to calculate size.
  */
  getFileSize(file) {
    return FileHelper.calculateFileSize(file);
  }

  /**
   * This Function allows go to back (Step 2).
   */
  back() {
    this.router.navigate(['claims/pre-authorization/step2']);
  }

  /***
  * Submit form for create new preAuthorization
  */
  submit() {
    if (this.wizard.preAuthForm.valid) {
      this.validateProvider();
    }
  }

  /***
   * If the authenticated user is a provider, the TaxNumber should be consulted to store it.
   * This data is required for the CRM
   */
  validateProvider() {
    if (Number(this.user.role_id) === Rol.PROVIDER) {
      this.subProvider = this.providerService.getProviderById(this.user.user_key).subscribe(
        pro => {
          this.wizard.taxNumber = pro.taxNumber;
          this.save();
        },
        error => console.error(error)
      );
    } else {
      this.save();
    }
  }

  save() {
    if (this.wizard.documents.length > 0) {
      this.saveWithDocuments();
    } else {
      const toSave: PreAuthorizationDto =
            this.preAuthWizardService.buildDtoPreAuthorization([], this.translationService.getLanguageId());
      this.savePreAuthorization(toSave);
    }
  }

  async saveFirstDoc() {
    const response = await this.commonService.uploadFirstDocument(this.wizard.documents[0]);
    return response;
  }

  /***
   * If the new preauthorization have attachments,
   * first save of documents and then save preauthorization with the URL that return Azure.
   * The preauthorization is associated with the url of the documents in Azure
   */
  saveWithDocuments() {
    forkJoin(this.saveFirstDoc()).subscribe(
      (response: UploadResponse[])  => {
        const listUrlDocSave = [];
        this.wizard.documents.forEach( e => {
          listUrlDocSave.push(this.commonService.uploadDocumentToFolder(e, response[0].folderName));
        });

        forkJoin(listUrlDocSave).subscribe(
          listDoc => {
            const toSave: PreAuthorizationDto =
              this.preAuthWizardService.buildDtoPreAuthorization(listDoc, this.translationService.getLanguageId());
            this.savePreAuthorization(toSave);
          }
        );
      }
    );
  }

  /***
   * Call the service Preauthorization to Save Preauthorization
   */
  savePreAuthorization(toSavePreAuthorizationDto: PreAuthorizationDto) {
    this.preAuthorizationService.savePreAuthorization(toSavePreAuthorizationDto).subscribe(
      ok => {
        this.showMessageOK(ok);
      },
      error => {
        console.error(error);
      }
    );
  }

  /***
   * Show message Information Request save OK
   */
  showMessageOK(trackingNumber: string) {
    const messageS = this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.SAVE_OK_1`);
    const message1 = this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.SAVE_OK_2`);
    const tittleS =  this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.SAVE_OK_TITLE`);
    const newPreAuth = this.translate.get(`CLAIMS.PRE_AUTHORIZATION.NEW_PREAUTH`);
    const finish = this.translate.get(`CLAIMS.PRE_AUTHORIZATION.FINISH`);

    forkJoin([tittleS, messageS, message1, newPreAuth, finish]).subscribe( async response => {
      const message = String().concat(response[1], trackingNumber, ' ', response[2]);
      const getIt = await this.notification.showDialog(response[0], message, true, response[3], response[4]);
      if (getIt) {
        this.preAuthWizardService.endPreAuthWizard(this.user);
        this.back();
      } else {
        this.goToHomePage();
      }
    });
  }

  goToHomePage() {
    location.href = this.configurationService.returnUrl;
  }

}
