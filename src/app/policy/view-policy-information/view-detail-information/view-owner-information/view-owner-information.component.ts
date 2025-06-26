/**
* ViewOwnerInformationComponent
*
* @description: recibes the main member's information and show it on the screen
* @author Andres Tamayo
* @version 1.0
* @date 13-02-2019.
*
**/


import { Component, Input, OnInit } from '@angular/core';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { PhoneOutputDto } from 'src/app/shared/services/policy/entities/phone.dto';
import { AddressOutputDto } from 'src/app/shared/services/policy/entities/address.dto';
import { EmailOutputDto } from 'src/app/shared/services/policy/entities/email.dto';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { SpecialConditionOutputDto } from 'src/app/shared/services/policy/entities/specialCondition.dto';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { Language } from 'src/app/shared/classes/language.enum';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { HttpErrorResponse } from '@angular/common/http/http';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { AuthService } from '../../../../security/services/auth/auth.service';

@Component({
  selector: 'app-view-owner-information',
  templateUrl: './view-owner-information.component.html'
})
export class ViewOwnerInformationComponent implements OnInit {

  @Input() policyDto: PolicyDto;

  /** home phone of main member */
  public homePhone: PhoneOutputDto;
  /** office phone of main member */
  public officePhone: PhoneOutputDto;
  /** fax phone of main member */
  public faxPhone: PhoneOutputDto;
  /** phisical address of main member */
  public phisicalAddress: AddressOutputDto;
  /** postal address of main member */
  public postalAddress: AddressOutputDto;
  /** main member 's email */
  public emailOwner: EmailOutputDto;

  public paperless: boolean;

  /** holds actual rol of logged user */
  public actualRol: number;

  /** message to show on the tooltip's prefer language */
  public tooltipPreferLanguaje: string[] = [];
  /** message to show on the tooltip's prefer treatment document */
  public tooltipDocumentSubmission: string[] = [];
  /** message to show on tooltip´s email submission */
  public tooltipEmailSubmission: string[] = [];
  /** contains the mainMember's information */
  public mainMember: MemberOutputDto;
  public filterConditions: SpecialConditionOutputDto[] = [];

  public editing = false;

  public listLanguage: Array<any>;
  public documentSubmissionList: Array<any>;

  /**
   * Main form
   */
  public preferencesForm: FormGroup;

  public documentSubmission = '';

  private isChange = false;

  public mailShow = '';
  public zipCode = '';

  /**
   * @param _authService Auth Service Injection
   * @param translate translate service inyection
   */
  constructor(private translate: TranslateService,
    private translationService: TranslationService,
    private policyService: PolicyService,
    private notification: NotificationService, private _authService: AuthService, ) { }

  /**
   * loads the page actual language and filters the special information who its going to
   * print on the screen
   */
  ngOnInit() {

    this.actualRol = Number(this._authService.getUser().role_id);

    this.paperless = this.policyDto.paperless;

    if (this.policyDto.phones) {
      this.homePhone = this.policyDto.phones.filter(phonesF => phonesF.phoneTypeId === 1000)[0];
      this.officePhone = this.policyDto.phones.filter(phonesF => phonesF.phoneTypeId === 1001)[0];
      this.faxPhone = this.policyDto.phones.filter(phonesF => phonesF.phoneTypeId === 1005)[0];
    }
    if (this.policyDto.addresses) {
      this.phisicalAddress = this.policyDto.addresses.filter(addresses => addresses.addressTypeId === 2)[0];
      this.postalAddress = this.policyDto.addresses.filter(addresses => addresses.addressTypeId === 1)[0];

      if (this.postalAddress !== undefined) {
        this.zipCode = this.postalAddress.zipCode;
      }
    }
    if (this.policyDto.emails && this.policyDto.emails.length > 0) {
      this.emailOwner = this.policyDto.emails.filter(emailsF => emailsF.emailTypeId === 1)[0];
      if (this.emailOwner) {
        this.mailShow = this.emailOwner.eMailAddress;
      }
    }
    this.setMainMember();

    this.translate.onLangChange.subscribe(res => {
      this.loadactualLanguages();
    });

    this.loadactualLanguages();

    this.listLanguage = this.loadAndTranslateLanguaje();
    this.documentSubmissionList = this.loadAndTranslateDocSubm();
    this.translate.onLangChange.subscribe(() => {
      this.listLanguage = this.loadAndTranslateLanguaje();
      this.documentSubmissionList = this.loadAndTranslateDocSubm();
    });

    this.preferencesForm = this.buildForm();
    this.preferencesForm.controls.listLanguage.valueChanges.subscribe(val => this.setValidations(val));
    this.preferencesForm.controls.documentSubmissionList.valueChanges.subscribe(val => this.setValidations(val));
    this.preferencesForm.controls.allowDownloadDocuments.valueChanges.subscribe(val => this.setValidations(val));
  }

  setMainMember() {
    const members = this.policyDto.members;
    this.mainMember = members.filter(membersF => membersF.relationTypeId === 2)[0];
    if (!this.mainMember) {
      this.mainMember = members.filter(membersF => membersF.relationTypeId === 5)[0];
    }
    if (!this.mainMember) {
      this.mainMember = {
        memberId: this.policyDto.memberId,
        firstName: this.policyDto.firstName,
        middleName: this.policyDto.middleName,
        lastName: this.policyDto.lastName,
        fullName: '',
        dob: this.policyDto.ownerDob,
        policyId: this.policyDto.policyId.toString(),
        policyNumber: 0,
        isGroupPolicy: false,
        applicationId: 0,
        contactBaseId: 0,
        memberStatus: '',
        memberStatusId: 0,
        premiumValue: 0,
        policyStatus: '',
        policyCountry: '',
        policyCountryId: 0,
        insuranceBusinessId: 0,
        insuranceBusinessName: '',
        relationTypeId: 0,
        relationType: '',
        genderId: 0,
        gender: '',
        searchDate: '',
        referenceNumber: '',
        requesterName: '',
        transactionId: 0,
        benefitCurrencyCode: '',
        deductibleId: 0,
        deductibleValue: 0,
        maximumCoverageValue: 0,
        plan: '',
        wWperiod: false,
        address: '',
        email: '',
        specialConditions: null,
        filterSpecialConditions: null,
        eligibilities: null,
        premiumComponent: null
      };
    }
  }

  setValidations(val: any) {
    this.isChange = true;
  }

  loadAndTranslateDocSubm() {
    const documentSubmission = this.loadDocSubmision();
    return documentSubmission;
  }

  loadAndTranslateLanguaje() {
    const languages = this.loadLanguages();
    return languages;
  }

  loadDocSubmision() {
    return [
      { id: 1, value: 'email' },
      { id: 0, value: 'zip_code' },
    ];
  }

  /**
   * Builds languge control.
   */
  loadLanguages() {
    return [
      { id: Language.EN, value: Language.getDescription(Language.EN) },
      { id: Language.ES, value: Language.getDescription(Language.ES) },
      { id: Language.PT, value: Language.getDescription(Language.PT) }
    ];

  }

  /**
   * use to update the string to show on diferents segments
   * @param lng string with the current language
   */
  private loadactualLanguages() {

    let message;
    const languageId = this.translationService.getLanguageId();

    this.filterConditions = this.policyDto.specialConditions.filter(x => x.languageId === languageId);
    if (languageId === 1 && this.policyDto.isGroupPolicy) {
      this.filterConditions = this.filterConditions.filter(x => x.limitationName !== 'Extra Premium' && x.limitationName !== 'Cap Amount');
    }
    if (languageId === 2 && this.policyDto.isGroupPolicy) {
      this.filterConditions = this.filterConditions.filter(x => x.limitationName !== 'Prima Extra'
        && x.limitationName !== 'Sobreprima'
        && x.limitationName !== 'Tope máximo');
    }

    this.policyDto.specialConditions.filter(x => x.languageId === 0).forEach(z => {
      this.filterConditions.push(z);
    });

    if (this.policyDto.paperless) {
      message = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.EMAIL').toPromise();
    } else {
      message = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ZIP_CODE').toPromise();
    }

    message.then(val => {
      this.documentSubmission = val;
    });

    this.tooltipPreferLanguaje = [];
    this.tooltipDocumentSubmission = [];
    this.tooltipEmailSubmission = [];

    const tooltipLanguaje = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.TOOLTIP_PREFER_LANGUAJE').toPromise();
    tooltipLanguaje.then(val => this.tooltipPreferLanguaje.push(val));

    const tooltipSubmission = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.TOOLTIP_DOCUMENT_SUBMISSION').toPromise();
    tooltipSubmission.then(val => this.tooltipDocumentSubmission.push(val));

    const tooltipEmail = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.TOOLTIP_EMAIL_SUBMISSION').toPromise();
    tooltipEmail.then(val => this.tooltipEmailSubmission.push(val));

  }

  buildForm() {
    return new FormGroup({
      listLanguage: new FormControl(this.listLanguage
      [this.listLanguage.findIndex(x => x.id === this.policyDto.languageId)].id),
      documentSubmissionList: new FormControl(this.documentSubmissionList
      [this.documentSubmissionList.findIndex(x => x.id === this.policyDto.paperless)].id),
      allowDownloadDocuments: new FormControl((this.policyDto.agentNotAccess === null) ? true : !this.policyDto.agentNotAccess)
    });
  }


  changeEditing() {
    this.editing = true;
  }

  updatePreferences() {

    if (this.isChange) {
      this.policyDto.languageId = Number(this.preferencesForm.controls.listLanguage.value);
      this.policyDto.paperless = this.preferencesForm.controls.documentSubmissionList.value;

      this.policyDto.agentNotAccess = !this.preferencesForm.controls.allowDownloadDocuments.value;

      this.policyService.updatePolicyInformationPreference(this.policyDto).subscribe(
        ok => {
          this.policyDto.language = Language.getDescription(this.policyDto.languageId);
          this.policyDto.paperless = Boolean(Number(this.policyDto.paperless));
          this.paperless = this.policyDto.paperless;
          this.loadactualLanguages();
          this.editing = false;
          this.isChange = false;
          this.showOkMessage();
        }, error => {
          this.handlePolicyError(error);
        }
      );
    }
  }

  /***
  * handles Policy Error
  */
  private handlePolicyError(error: any) {
    if (error.status === 404) {
    } else if (this.checksIfHadBusinessError(error)) {
      this.showErrorMessage(error);
    }
  }

  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`POLICY.ERROR.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  private showOkMessage() {
    let message = '';
    let messageTitle = '';
    this.translate.get(`POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.UPDATE_PREFERENCES_OK`).subscribe(
      result => message = result
    );
    this.translate.get(`POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.POLICY_OWNER_PREFERENCES`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /**
    * Check if response has error code to show business exception
    * @param error Http Error
    */
  checksIfHadBusinessError(error) {
    return error.error.code;
  }

  revertChanges() {
    this.editing = false;
  }

}
