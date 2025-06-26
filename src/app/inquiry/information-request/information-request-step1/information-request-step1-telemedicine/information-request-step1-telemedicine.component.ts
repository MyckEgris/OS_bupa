import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InformationRequestWizard } from '../../information-request-wizard/entities/information-request-wizard';
import { InformationRequestWizardService } from '../../information-request-wizard/information-request-wizard.service';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { ClaimSubmissionMember } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionMember';
import { TreeviewConfig } from 'ngx-treeview';
import { FormGroup, Validator, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DateTranslatePipe } from 'src/app/shared/pipes/date-translate/date-translate.pipe';
import { CustomerService } from 'src/app/shared/services/inquiry/customer.service';
import { InquiryHelper } from 'src/app/shared/services/inquiry/helpers/inquiry.helper';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TreeViewPersonalized } from 'src/app/shared/components/tree-view-personalized/entities/treeview-personalized';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { RuleByBusiness } from 'src/app/shared/services/common/entities/rule-by-business';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { Router } from '@angular/router';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { ProviderOutputDto } from 'src/app/shared/services/provider/entities/provider.dto';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Country } from 'src/app/shared/services/common/entities/country';
import { AreaCodes } from 'src/app/shared/services/common/entities/areacodes';
import { SubjectDto } from 'src/app/shared/services/inquiry/entities/subject.dto';
import { ListSubjectDto } from 'src/app/shared/services/inquiry/entities/list-subject.dto';
import * as moment from 'moment';
import { InquirySpeciality } from '../../information-request-wizard/entities/inquirySpeciality';
import { InquiryAppointment } from '../../information-request-wizard/entities/inquiryAppointment';
import { SearchMemberTypeConstants } from 'src/app/shared/services/policy/constants/policy-search-member-type-constants';



@Component({
  selector: 'app-information-request-step1-telemedicine',
  templateUrl: './information-request-step1-telemedicine.component.html'
})
export class InformationRequestStep1TelemedicineComponent implements OnInit, OnDestroy {

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
   * subscriptionTraslate
   */
  private subscriptionTraslate: Subscription;

  /***
   * Pipe to format dates
   */
  private dateTranslate: DateTranslatePipe;

  /***
   * List of subject in the entity TreeViewPersonalized for show in the component Treview
   */
  public listSubject: TreeViewPersonalized[];

  /***
   * Validated if show input policy number
   */
  public showInputPolicyNumber = false;

  /***
   * Validated if show member select
   */
  public showMemberSelect = false;

  /***
   * List of attachments
   */
  public documents: Array<any>;

  /***
   * Rules
   */
  public rules: Array<RuleByBusiness>;

  /***
   * Show Validations
   */
  public showValidations = false;

  /***
   * type1
   */
  public type1 = 'type1';

  /***
   * Max chars allowed field title
   */
  public MAX_CHARS_ALLOWED_TITLE = 200;

  /***
  * Max chars allowed field details
  */
  public MAX_CHARS_ALLOWED_DETAILS = 2000;

  /***
   * Name that is displayed in the requesting field
   */
  public nameShow: string;

  /***
   * Const to identify the FormControl PolicyNumber
   */
  private POLICY_NUMBER = 'policyNumber';

  /**
    *  title form control.
    */
  public TITLE_CTRL = 'title';

  /**
   *  details form control.
   */
  public DETAILS_CTRL = 'details';

  /**
   * title form control.
   */
  public COUNTRY_CTRL = 'countryOfResident';

  /**
   * title form control.
   */
  public PHONE_CTRL = 'phoneNumber';

  /**
   * date form control.
   */
  public APPOINTMENT_CTRL = 'dateType';

  /**
   * date form control.
   */
  public DATE_CTRL = 'date';

  /**
   * time form control.
   */
  public TIME_CTRL = 'time';

  /**
   * details form control.
   */
  public SPECIALITY_CTRL = 'speciality';

  /**
   * countries array.
   */
  public countries: Country[] = [];

  /**
   * appointmentTypes array.
   */
  public appointmentTypes: InquiryAppointment[] = [];

  /**
   * Flag for show Caledar.
   */
  public showCalendar: boolean;

  /**
   * Flag for show InmediatelyMsg.
   */
  public showInmediatelyMsg: boolean;

  /**
   * Mín Date
   */
  public minDate = new Date();

  /**
   * selected Date
   */
  public selectedDate;

  /**
   * specialities array.
   */
  public specialities: InquirySpeciality[] = [];



  /**
   * constructor method
   * @param informationRequestService informationRequestWizardService Injection
   * @param authService authService Injection
   * @param translate Translate Service Injection
   * @param notification Notification Service Injection
   * @param router routerService Injection
   * @param config Configuration Service Injection
   * @param translationService TranslationService Injection
   * @param policyService policyService Injection
   * @param _ref ChangeDetectorRef Injection
   * @param customerService CustomerService Injection
   * @param uploadService UploadService Injection
   * @param providerService ProviderService Injection
   * @param commonService CommonService Injection
   */
  constructor(
    private router: Router,
    private translationService: TranslationService,
    private informationRequestService: InformationRequestWizardService,
    private authService: AuthService,
    private policyService: PolicyService,
    private translate: TranslateService,
    private _ref: ChangeDetectorRef,
    private customerService: CustomerService,
    private notification: NotificationService,
    private uploadService: UploadService,
    private providerService: ProviderService,
    private commonService: CommonService
  ) {
    this.dateTranslate = new DateTranslatePipe(this.translate, this._ref);
  }



  /***
   * Configuration for the component treeView
   */
  public config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: true,
    maxHeight: 400
  });

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.informationRequestService.beginRequestInformationWizard(wizard => {
      this.wizard = wizard;
      this.handleFormInput();
      this.initStructures();
      this.showPolicyNumber();
    }, this.user, this.currentStep);
    this.setNameShowFromRol();
    this.documents = this.uploadService.getDocuments();
    this.subscriptionTraslate = this.translate.onLangChange.subscribe(() => {
      this.getSubjects();
      this.getappointmentTypes();
      this.getSpecialities();
    });
    this.getSubjects();
    this.validateCalendarState();
  }

  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subscriptionTraslate) { this.subscriptionTraslate.unsubscribe(); }
  }

  /**
   * Sets form validations.
   */
  private handleFormInput() {
    if (this.wizard.infoRequestForm.untouched) {
      this.wizard.infoRequestForm.addControl(this.COUNTRY_CTRL, new FormControl('', [Validators.required]));
      this.wizard.infoRequestForm.get(this.COUNTRY_CTRL).updateValueAndValidity();
      this.wizard.infoRequestForm.addControl(this.PHONE_CTRL, new FormControl('', [Validators.required]));
      this.wizard.infoRequestForm.get(this.PHONE_CTRL).updateValueAndValidity();
      this.wizard.infoRequestForm.addControl(this.APPOINTMENT_CTRL, new FormControl('', [Validators.required]));
      this.wizard.infoRequestForm.get(this.APPOINTMENT_CTRL).updateValueAndValidity();
      this.wizard.infoRequestForm.addControl(this.DATE_CTRL, new FormControl('', [Validators.required]));
      this.wizard.infoRequestForm.get(this.DATE_CTRL).updateValueAndValidity();
      this.wizard.infoRequestForm.addControl(this.TIME_CTRL, new FormControl('', [Validators.required]));
      this.wizard.infoRequestForm.get(this.TIME_CTRL).updateValueAndValidity();
      this.wizard.infoRequestForm.addControl(this.SPECIALITY_CTRL, new FormControl('', [Validators.required]));
      this.wizard.infoRequestForm.get(this.SPECIALITY_CTRL).updateValueAndValidity();
    }
  }

  /***
   * Establish name to show from the role
   */
  setNameShowFromRol() {
    if (Number(this.user.role_id) === Rol.PROVIDER) {
      this.getNameProvider();
    } else {
      this.nameShow = this.user.name;
    }
  }

  /**
   * Validates form state and sets defult values for calendar.
   */
  private validateCalendarState() {
    if (this.getControl(this.DATE_CTRL).value &&
      this.getControl(this.APPOINTMENT_CTRL).value.appointmentTypeId === 1) {
      this.selectedDate = this.getControl(this.DATE_CTRL).value;
      this.showCalendar = true;
    }
  }

  /**
   * This function allows to search the policy members.
   */
  searchPolicyMembers() {
    this.wizard.member = null;
    this.wizard.memberSearch = [];
    this.policyService.getPolicyMembersByPolicyId(
      this.wizard.infoRequestForm.value.policyNumber,
      SearchMemberTypeConstants.ACTIVE_MEMBERS
    ).subscribe(
      data => {
        if (Number(this.user.role_id) === Rol.POLICY_HOLDER || Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) {
          this.wizard.holderMemberId = data.filter(member => member.relationTypeId === RelationType.OWNER)[0].memberId;
        }
        this.wizard.memberSearch = data;
      }, error => {
        this.wizard.memberSearch = [];
        this.handleError(error);
      }
    );
  }

  /***
   * Evaluated type error
   */
  private handleError(error: any) {
    if (error.status === 404) {
      this.showMessageError();
    } else {
      console.error(error);
    }
  }

  /**
   * If error is Not Found = 404
   */
  showMessageError() {
    let message = '';
    let messageTitle = '';
    this.translate.get(`INQUIRY.INFORMATION_REQUEST.ERROR.ERROR_MESSAGE.MESSAGE_ERROR_NOT_FOUND`).subscribe(
      result => message = result
    );
    this.translate.get(`INQUIRY.INFORMATION_REQUEST.ERROR.ERROR_CODE.MESSAGE_ERROR_NOT_FOUND`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /**
   * This Function allow select a member to create and associate a information request.
   * @param member
   */
  selectMember(member: ClaimSubmissionMember) {
    this.wizard.member = member;
  }

  /**
   *  get basic Controls
   *  */
  get basicsControls() {
    return (this.wizard.infoRequestForm as FormGroup).controls;
  }

  /***
   * Formatted the name member to show. Concat fullName with the Date of Birth
   */
  get selectedMember() {
    let selectMember: string;
    this.translate.get(`INQUIRY.INFORMATION_REQUEST.STEP_1.SELECT_MEMBER`).subscribe(
      result => selectMember = result
    );

    if (this.wizard.member) {
      selectMember = this.wizard.member.fullName + ' - (' + this.dateTranslate.transform(this.wizard.member.dob) + ')';
    }
    return selectMember;
  }

  /***
   * Get List of Subject for Role (The backend take the role of token)
   */
  getSubjects() {
    this.customerService.getSubjects().subscribe(
      data => {
        if (data) {
          this.wizard.listSubject = data;
          this.assignDefaultSubject(data);
          const treeView: TreeViewPersonalized[] = InquiryHelper.mappedSubjectToTreeview(data, this.translationService.getLanguageId());
          this.listSubject = treeView;
        }
      },
      error => {
        this.handleError(error);
      }
    );
  }

  /***
   * Assign defualt telemedicine subject.
   * @param data list of subjects.
   */
  assignDefaultSubject(data: ListSubjectDto) {
    const subj = data.subjectsInformation.find(element => element.subjectReference === 'Telemedicine');
    let subjArray: ListSubjectDto = { subjectsInformation: [] };
    subjArray.subjectsInformation.push(subj);
    this.wizard.subject = InquiryHelper.mappedSubjectToTreeview(subjArray, this.translationService.getLanguageId())[0];
  }

  /***
   * Set value selected of list Subject
   */
  onValueChange(value: TreeViewPersonalized) {
    this.wizard.subject = value === undefined ? null : value;
  }

  initStructures() {
    if (this.wizard.infoRequestForm.untouched) {
      this.documents = [];
      this.rules = [];
      this.wizard.member = null;
      this.wizard.memberSearch = [];
    }
    this.getCountries();
    this.getappointmentTypes();
    this.getSpecialities();
  }

  /***
   * Get Inquiry Specialities.
   */
  async getSpecialities() {
    this.specialities = [
      {
        specialityId: 1,
        specialityName: 'GeneralMedicine',
        specialityDescription: await this.translate.get('INQUIRY.INFORMATION_REQUEST.SPECIALITY_01').toPromise(),
      },
      {
        specialityId: 2,
        specialityName: 'MentalHealth',
        specialityDescription: await this.translate.get('INQUIRY.INFORMATION_REQUEST.SPECIALITY_02').toPromise(),
      }
    ];
    this.handleSpecialitiesLangChange();
  }

  /***
   * Get Inquiry Specialities.
   */
  async getappointmentTypes() {
    this.appointmentTypes = [
      {
        appointmentTypeId: 0,
        appointmentTypeName: 'Immediately',
        appointmentTypeDescription: await this.translate.get('INQUIRY.INFORMATION_REQUEST.DATE_TYPE_01').toPromise(),
        appointmentDate: null,
        appointmentTime: null
      },
      {
        appointmentTypeId: 1,
        appointmentTypeName: 'Scheduled',
        appointmentTypeDescription: await this.translate.get('INQUIRY.INFORMATION_REQUEST.DATE_TYPE_02').toPromise(),
        appointmentDate: null,
        appointmentTime: null
      }
    ];
    this.handleAppointmentsLangChange();
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
   * This function route to the next step (Step2).
   */
  async next() {
    this.wizard.documents = this.uploadService.getDocuments();
    if (this.wizard.infoRequestForm.valid
      && this.wizard.subject
      && this.wizard.subject.value
      && this.handleMemberNext()) {
      const title50 = this.wizard.infoRequestForm.controls[this.TITLE_CTRL].value.substring(0, this.MAX_CHARS_ALLOWED_TITLE);
      this.wizard.infoRequestForm.controls[this.TITLE_CTRL].setValue(title50);
      const descrip2000 = this.wizard.infoRequestForm.controls[this.DETAILS_CTRL].value.substring(0, this.MAX_CHARS_ALLOWED_DETAILS);
      this.wizard.infoRequestForm.controls[this.DETAILS_CTRL].setValue(descrip2000);
      this.mapFormToWizard();
      this.router.navigate([`inquiry/information-request/${this.wizard.optionType}/step2`]);
    } else {
      this.showValidations = true;
    }
  }

  /***
   * Show Input Policy Number
   */
  showPolicyNumber() {
    if ((Number(this.user.role_id) === Rol.AGENT)
      || (Number(this.user.role_id) === Rol.AGENT_ASSISTANT)
      || (Number(this.user.role_id) === Rol.GROUP_ADMIN)) {
      this.showInputPolicyNumber = true;
      this.showMemberSelect = true;
    } else if ((Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) ||
      (Number(this.user.role_id) === Rol.POLICY_HOLDER)) {
      this.showInputPolicyNumber = false;
      this.showMemberSelect = true;
      this.wizard.infoRequestForm.get(this.POLICY_NUMBER).setValue(this.user.user_key);
      this.wizard.infoRequestForm.updateValueAndValidity();
      if (!this.wizard.member) {
        this.searchPolicyMembers();
      }
    } else {
      this.showInputPolicyNumber = false;
      this.showMemberSelect = false;
      this.wizard.infoRequestForm.get(this.POLICY_NUMBER).setValue(this.user.user_key);
      this.wizard.infoRequestForm.updateValueAndValidity();
    }
  }

  /***
   * Clear form
   */
  clearForm() {
    this.wizard.infoRequestForm.controls[this.TITLE_CTRL].setValue('');
    this.wizard.infoRequestForm.controls[this.DETAILS_CTRL].setValue('');
    this.wizard.infoRequestForm.controls[this.COUNTRY_CTRL].setValue('');
    this.wizard.infoRequestForm.controls[this.PHONE_CTRL].setValue('');
    // this.wizard.infoRequestForm.controls[this.APPOINTMENT_CTRL].setValue('');
    // this.wizard.infoRequestForm.controls[this.DATE_CTRL].setValue('');
    // this.wizard.infoRequestForm.controls[this.TIME_CTRL].setValue('');
    this.wizard.infoRequestForm.controls[this.SPECIALITY_CTRL].setValue('');
    this.wizard.infoRequestForm.updateValueAndValidity();
    this.showCalendar = false;
    this.showInmediatelyMsg = false;

    if ((Number(this.user.role_id) !== Rol.GROUP_POLICY_HOLDER) ||
      (Number(this.user.role_id) !== Rol.POLICY_HOLDER)) {
      this.wizard.member = null;
    }

    if ((Number(this.user.role_id) === Rol.AGENT)
      || (Number(this.user.role_id) === Rol.AGENT_ASSISTANT)
      || (Number(this.user.role_id) === Rol.GROUP_ADMIN)) {
      this.wizard.infoRequestForm.controls[this.POLICY_NUMBER].setValue('');
      this.wizard.member = null;
      this.wizard.memberSearch = [];
    }
  }

  /***
  * Get Name Provider
  */
  getNameProvider() {
    this.providerService.getProviderById(this.user.user_key).subscribe(
      (provider: ProviderOutputDto) => {
        this.nameShow = this.user.name + ' - ' + provider.name;
      },
      error => {
        console.error(error);
      }
    );
  }

  /***
   * On Selected Change
   */
  onSelectedChange(value) {
  }

  /***
   * On Filter Change
   */
  onFilterChange(value) {
  }

  /**
   * Get control
   */
  getControl(field: string) {
    return this.wizard.infoRequestForm.get(field) as FormControl;
  }

  /**
   * handle Country Change
   */
  handleAppointmentChange(value: any) {
    if (value) {
      if (value.appointmentTypeId === 0) {
        this.showCalendar = false;
        this.showInmediatelyMsg = true;
        this.getControl(this.DATE_CTRL).setValue(moment().toDate());
        this.getControl(this.TIME_CTRL).setValue({ hour: 0, minute: 0, second: 0 });
        this.getControl(this.DATE_CTRL).updateValueAndValidity();
      } else if (value.appointmentTypeId === 1) {
        this.getControl(this.DATE_CTRL).setValue('');
        this.getControl(this.TIME_CTRL).setValue('');
        this.showCalendar = true;
        this.showInmediatelyMsg = false;
      }
    }
  }

  /**
   * Gets countrie from common API
   */
  getCountries() {
    this.commonService.getCountries()
      .subscribe(
        result => {
          result.map((x) => {
            x.areaCode
            if ((x.countryName.indexOf(x.areaCode)) === -1) {
              x.countryName = `${x.countryName} (+ ${x.areaCode})`;
            }
          })
          this.countries = result;
        },
        error => {
          this.delayAndReloadForError(3000).then(() => {
            location.reload();
          });
        }
      );
  }

  /**
  * Delay X ms before reload page
  * @param ms Milliseconds
  */
  async delayAndReloadForError(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.error(''));
  }

  /**
   * Maps the form values to wizard.
   */
  mapFormToWizard() {
    if (this.wizard.infoRequestForm) {
      this.wizard.countryOfResident = this.getControl(this.COUNTRY_CTRL).value;
      this.wizard.countryAreaCode = this.getControl(this.COUNTRY_CTRL).value.areaCode;
      this.wizard.phoneNumber = this.getControl(this.PHONE_CTRL).value;
      const appointment = this.getControl(this.APPOINTMENT_CTRL).value;
      appointment.appointmentDate = this.getControl(this.DATE_CTRL).value;
      appointment.appointmentTime = this.getControl(this.TIME_CTRL).value;
      this.wizard.appointmentType = appointment;
      this.wizard.speciality = this.getControl(this.SPECIALITY_CTRL).value;
    }
  }

  /**
   * Handle Specialities Language Change.
   */
  handleSpecialitiesLangChange() {
    const control = this.getControl(this.SPECIALITY_CTRL);
    if (!control.pristine) {
      const item = this.specialities.find(element => element.specialityId === control.value.specialityId);
      this.wizard.infoRequestForm.controls[this.SPECIALITY_CTRL].setValue(item);
    }
    // control.setValue(this.specialities[0]);
  }

  /**
   * Handle appointment Types Language Change.
   */
  handleAppointmentsLangChange() {
    const control = this.getControl(this.APPOINTMENT_CTRL);
    if (!control.pristine) {
      const item = this.appointmentTypes.find(element => element.appointmentTypeId === control.value.appointmentTypeId);
      this.wizard.infoRequestForm.controls[this.APPOINTMENT_CTRL].setValue(item);
    }
    control.setValue(this.appointmentTypes[0]);
    this.handleAppointmentChange(this.appointmentTypes[0]);
  }

  /***
   * Handle the member object according to role to allow to continue.
   */
  handleMemberNext() {
    if (Number(this.user.role_id) === Rol.PROVIDER) {
      return true;
    } else {
      return this.wizard.member;
    }
  }

}
