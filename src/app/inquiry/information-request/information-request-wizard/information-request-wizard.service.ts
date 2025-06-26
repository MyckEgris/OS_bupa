import { Injectable } from '@angular/core';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { InformationRequestWizard } from './entities/information-request-wizard';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { InquiryDto } from 'src/app/shared/services/inquiry/entities/inquiry.dto';
import { InquiryHelper } from 'src/app/shared/services/inquiry/helpers/inquiry.helper';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { UploadResponse } from 'src/app/shared/services/common/entities/uploadReponse';
import { AttachmentDto } from 'src/app/shared/services/inquiry/entities/attachment.dto';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { InquiryUserDto } from 'src/app/shared/services/inquiry/entities/inquiry-user.dto';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { Priority } from 'src/app/shared/services/inquiry/entities/priority-label.enum';



@Injectable({
  providedIn: 'root'
})
export class InformationRequestWizardService {

  /**
   * user
   */
  private user: UserInformationModel;

  /**
   * informationRequestSubject
   */
  private informationRequestSubject: Subject<InformationRequestWizard>;

  /**
   * informationRequest
   */
  private informationRequest: InformationRequestWizard;

  /**
   * inquiryDto
   */
  private inquiryDto: InquiryDto;

  /**
   * Parent inquiry id
   */
  private parentInquiryId: string;

  /***
   * Channel Indicate from where the information request was created
   * 3 -> Web
   */
  private CHANNEL = 3;

  /****
   * Indicates group that attends the information request
   * 2 -> Customer service
   */
  private RECORD_ORIGIN_ID = 2;

  /****
   * Indicates group that attends the information request
   * 2 -> Provider service
   */
  private RECORD_ORIGIN_PROVIDER_ID = 5;

   /****
   * Indicates Team Resolver Id
   * 7 -> Provider services inquiries
   */
  private PROVIDER_SERVICE_TEAM_RESOLVER_ID = 7;

     /****
   * Indicates Team Resolver Id
   * 7 -> Provider services inquiries
   */
  private WEB_INQUIRY_SERVICE_TEAM_RESOLVER_ID = 1;

  /**
   * Indicates Inquiry Web Type
   * 1 -> Web
   */
  private INQUIRY_WEB_TYPE = 1;

  /**
   * constructor method
   * @param uploadService uploadService Injection
   */
  constructor(
    private uploadService: UploadService,
    private translate: TranslateService,
    private translation: TranslationService
  ) {
    this.informationRequestSubject = new Subject<InformationRequestWizard>();
  }


  /**
   *  Initiate Information request wizard.
   * @fn subscription function
   */
  beginRequestInformationWizard(fn, user, step?: number): Subscription {
    this.user = user;
    const subscription = this.informationRequestSubject.subscribe(fn);
    if (!this.informationRequest) {
      this.newRequestInformation(user);
    }
    if (step) {
      this.informationRequest.currentStep = step;
    }
    this.next();
    return subscription;
  }

  /**
   * Generate new Request Information.
   */
  newRequestInformation(user: UserInformationModel) {
    this.informationRequest = {
      infoRequestForm: new FormGroup({
        applicantRole: new FormControl(user.role, Validators.required),
        applicantName: new FormControl(user.name, Validators.required),
        agentName: new FormControl(user.name, Validators.required),
        policyNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
        title: new FormControl('', []),
        details: new FormControl('', []),
        type: new FormControl('', [])
      }),
      currentStep: 0,
      member: null,
      memberSearch: null,
      documents: null,
      subject: null,
      holderMemberId: null,
      listSubject: null,
      optionType: null,
      countryOfResident: null,
      countryAreaCode: null,
      phoneNumber: null,
      appointmentType: null,
      speciality: null
    };
  }

  /**
   * Send parameters to subscriptors
   */
  private next() {
    this.informationRequestSubject.next(this.informationRequest);
  }

  /**
   * Close the wizard of claim submission
   */
  endInformationRequestWizard(user) {
    this.newRequestInformation(user);
    this.uploadService.removeAllDocuments();
    this.next();
  }

  /***
   * Build Dto for created information request
   */
  buildDtoInformationRequest(listUrlDoc: UploadResponse[], languajeId: number): InquiryDto {
    const inquiryDto = {} as InquiryDto;
    switch (this.informationRequest.optionType) {
      case 'telemedicine':
        inquiryDto.title = this.getTelemedicineInquiryTitle(this.informationRequest);
        inquiryDto.description = this.getTelemedicineInquiryDescriptionTranslateKeysAndGetDescription(this.informationRequest);
        inquiryDto.attachments = [];
        inquiryDto.priorityId = Priority.High;
        inquiryDto.recordOriginId = this.RECORD_ORIGIN_ID;
        inquiryDto.teamResolverId = this.WEB_INQUIRY_SERVICE_TEAM_RESOLVER_ID;
        break;
      default:
        inquiryDto.title = this.informationRequest.infoRequestForm.controls.title.value;
        inquiryDto.description = this.informationRequest.infoRequestForm.controls.details.value;
        inquiryDto.attachments = this.buildListDocuments(listUrlDoc);
        inquiryDto.priorityId = Priority.Normal;
        if (Number(this.user.role_id) === Rol.PROVIDER) {
          inquiryDto.recordOriginId = this.RECORD_ORIGIN_PROVIDER_ID;
          inquiryDto.teamResolverId = this.PROVIDER_SERVICE_TEAM_RESOLVER_ID;
        } else {
          inquiryDto.recordOriginId = this.RECORD_ORIGIN_ID;
          inquiryDto.teamResolverId = this.WEB_INQUIRY_SERVICE_TEAM_RESOLVER_ID;
        }
        break;
    }

    inquiryDto.channelId = this.CHANNEL;
    inquiryDto.languageId = languajeId;
    inquiryDto.inquiryType = this.INQUIRY_WEB_TYPE;
    inquiryDto.subject = InquiryHelper.getSubjectFromTreeview(this.informationRequest.subject);
    inquiryDto.interestedUser = this.buildInterestedUser();
    inquiryDto.senderUser = this.buildSenderdUser();
    inquiryDto.parentInquiryId = this.getParentInquiryId() || null;

    return inquiryDto;
  }

  /**
   * Get title and build for telemedicine
   * @param informationRequest Information Request
   */
  private getTelemedicineInquiryTitle(informationRequest: InformationRequestWizard) {
    const subject = InquiryHelper.getSubjectFromTreeview(informationRequest.subject);
    // tslint:disable-next-line: max-line-length
    return `${subject.subjectReference} ${informationRequest.appointmentType.appointmentTypeDescription} [${informationRequest.member.policyId}]`;
  }

  /**
   * Get description and translate keys for telemedicine
   * @param informationRequest Information Request
   */
  private getTelemedicineInquiryDescriptionTranslateKeysAndGetDescription(informationRequest: InformationRequestWizard) {
    const subject = InquiryHelper.getSubjectFromTreeview(informationRequest.subject);
    const name = this.translate.get(`INQUIRY.INFORMATION_REQUEST.NAME`);
    const identification = this.translate.get(`INQUIRY.INFORMATION_REQUEST.IDENTIFICATION`);
    const dob = this.translate.get(`INQUIRY.INFORMATION_REQUEST.DOB`);
    const email = this.translate.get(`INQUIRY.INFORMATION_REQUEST.EMAIL`);
    const country = this.translate.get(`INQUIRY.INFORMATION_REQUEST.COUNTRY`);
    const phone = this.translate.get(`INQUIRY.INFORMATION_REQUEST.PHONE_PH`);
    const date = this.translate.get(`INQUIRY.INFORMATION_REQUEST.DATE`);
    const speciality = this.translate.get(`INQUIRY.INFORMATION_REQUEST.SPECIALITY`);
    const created = this.translate.get(`INQUIRY.INFORMATION_REQUEST.CREATED`);
    // tslint:disable-next-line: max-line-length
    const specialityDescription = this.translate.get(`INQUIRY.INFORMATION_REQUEST.${informationRequest.speciality.specialityName.toUpperCase()}`);
    // tslint:disable-next-line: max-line-length
    const appointmentDescription = this.translate.get(`INQUIRY.INFORMATION_REQUEST.${informationRequest.appointmentType.appointmentTypeName.toUpperCase()}`);
    const lang = this.translate.get(`INQUIRY.INFORMATION_REQUEST.LANG`);
    const agreement_title = this.translate.get(`INQUIRY.INFORMATION_REQUEST.AGREEMENT_TITLE`);
    const agreement = this.translate.get(`INQUIRY.INFORMATION_REQUEST.AGREEMENT`);
    const agreement2 = this.translate.get(`INQUIRY.INFORMATION_REQUEST.STEP_2.TYC_HTML_04`);

    let description = '';

    forkJoin([
      name, identification, dob, email, country, phone, date, speciality,
      created, appointmentDescription, specialityDescription, lang, agreement_title, agreement, agreement2
    ]).subscribe(async keys => {
      description = `${subject.subjectReference} - ${this.getTelemedicineInquiryDescription(informationRequest, keys)}`;
    });

    return description;
  }

  /**
   * Get description for telemedicine
   * @param informationRequest InformationRequest
   * @param keys Keys
   */
  private getTelemedicineInquiryDescription(informationRequest: InformationRequestWizard, keys: Array<any>) {
    const name = `${keys[0]}: ${informationRequest.member.fullName}`;
    const identification = `${keys[1]}: ${informationRequest.member.policyId}-${informationRequest.member.memberId}`;
    const dob = `${keys[2]}: ${informationRequest.member.dob}`;
    const email = `${keys[3]}: ${this.user.sub}`;
    const country = `${keys[4]}: ${informationRequest.countryOfResident.countryName}`;
    const phone = `${keys[5]}: ${informationRequest.countryOfResident.areaCode} ${informationRequest.phoneNumber}`;
    // tslint:disable-next-line: max-line-length
    const date = informationRequest.appointmentType.appointmentDate ? `${keys[6]}: ${keys[9]} ${Utilities.convertDateToString(informationRequest.appointmentType.appointmentDate)} - ${Utilities.completeDatePart(informationRequest.appointmentType.appointmentTime.hour)}:${Utilities.completeDatePart(informationRequest.appointmentType.appointmentTime.minute)}` : `${keys[6]}: ${keys[9]}`;
    const speciality = `${keys[7]}: ${keys[10]}`;
    const newdate = new Date();
    const created = `${keys[8]}: ${newdate.toLocaleString()}`;
    const lang = `${keys[11]}: ${this.translation.getLanguageDescription()}`;
    const agreement = `${keys[12]}: ${keys[13]} - ${keys[14]}`;

    return `${name}, ${identification}, ${dob}, ${email}, ${country}, ${phone}, ${date}, ${speciality}, ${created}, ${lang}, ${agreement}`;
  }

  /***
   * Build interested user when exists member
   */
  buildInterestedUser(): InquiryUserDto {
    if (this.informationRequest.member) {
      return {
        id: this.informationRequest.member.memberId.toString(),
        name: this.informationRequest.member.fullName,
        roleId: 3,
        userId: '',
        policyId: (this.informationRequest.member.policyId || '')
      };
    } else {
      return null;
    }
  }

  /***
   * Build sender user when Holder
   */
  buildSenderdUser(): InquiryUserDto {
    if (Number(this.user.role_id) === Rol.POLICY_HOLDER
      || Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) {
      return {
        id: this.informationRequest.holderMemberId.toString(),
        name: '',
        roleId: Number(this.user.role_id),
        userId: this.user.sub,
        policyId: this.user.user_key
      };
    } else if (Number(this.user.role_id) === Rol.PROVIDER) {
      return {
        id: this.user.user_key_alternative,
        name: '',
        roleId: Number(this.user.role_id),
        userId: this.user.sub,
        policyId: ''
      };
    } else {
        return {
          id: this.user.user_key,
          name: '',
          roleId: Number(this.user.role_id),
          userId: this.user.sub,
          policyId: ''
        };
    }
  }

  /***
   * Build list attachments for information request
   */
  private buildListDocuments(listUrlDoc: UploadResponse[]) {
    const attachments: AttachmentDto[] = [];
    listUrlDoc.forEach(
      doc => attachments.push({
        fileName: doc.fileName,
        aliasFileName: doc.aliasFileName,
        uri: `/${doc.folderName}/${doc.aliasFileName}`
      })
    );
    return attachments;
  }

  setParentInquiryId(parentId) {
    this.parentInquiryId = parentId;
  }

  getParentInquiryId() {
    return this.parentInquiryId;
  }

}
