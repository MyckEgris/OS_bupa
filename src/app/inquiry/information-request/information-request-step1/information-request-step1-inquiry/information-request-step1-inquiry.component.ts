import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InformationRequestWizard } from '../../information-request-wizard/entities/information-request-wizard';
import { InformationRequestWizardService } from '../../information-request-wizard/information-request-wizard.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { ClaimSubmissionMember } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionMember';
import { TreeviewConfig } from 'ngx-treeview';
import { FormGroup, Validators, FormControl } from '@angular/forms';
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
import { Utilities } from 'src/app/shared/util/utilities';
import { InquiriesOutputDto } from 'src/app/shared/services/inquiry/entities/inquiries-output.dto';
import { SearchMemberTypeConstants } from 'src/app/shared/services/policy/constants/policy-search-member-type-constants';

@Component({
  selector: 'app-information-request-step1-inquiry',
  templateUrl: './information-request-step1-inquiry.component.html'
})
export class InformationRequestStep1InquiryComponent implements OnInit, OnDestroy {

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
   * InformationRequestWizard Object
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

  /**
   *  title form control.
   */
  public TITLE_CTRL = 'title';

  /**
   *  details form control.
   */
  public DETAILS_CTRL = 'details';

  /***
   * Const to identify the FormControl PolicyNumber
   */
  private POLICY_NUMBER = 'policyNumber';

  /**
   *  Search Type form control.
   */
  public SEARCH_TYPE_CTRL = 'searchType';

  /**
   * Search type value for policy id.
   */
  public SEARCH_TYPE_POLICY_ID = 'by_policy_id';

  /**
   * Search type value for policy legacy.
   */
  public SEARCH_TYPE_POLICY_LEGACY = 'by_legacy_policy';

  /**
   * Array for policy search types
   */
  public policySearchTypes: Array<any>;

  /**
   * Place holder text for policy input field.
   */
  public policyInputPlaceHolder = '';

  /**
   * oldInquiry.
   */
  public oldInquiry: InquiriesOutputDto;



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
    private providerService: ProviderService
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
    this.valueChanges();
    this.policySearchTypes = this.getPolicySearchTypesArray();
    this.setNameShowFromRol();
    this.documents = this.uploadService.getDocuments();
    this.subscriptionTraslate = this.translate.onLangChange.subscribe(() => {
      this.getSubjects();
    });
    this.getSubjects();
    this.checkIfInquiryIsResponseFromOtherInquiry();
  }

  checkIfInquiryIsResponseFromOtherInquiry() {
    this.oldInquiry = this.customerService.getInquiryResultByInquiry();
    if (this.oldInquiry) {
      const policyId = this.oldInquiry.interestedUser.policyId;
      this.wizard.infoRequestForm.get('policyNumber').setValue(policyId);
      this.searchPolicyMembers();
      this.renderInquiry();
    }
  }

  renderInquiry() {
    this.renderMember();
    this.renderSubject();
    this.wizard.infoRequestForm.get('title').setValue(this.oldInquiry.title);
    this.wizard.infoRequestForm.get('details').setValue(this.oldInquiry.description);
    this.wizard.infoRequestForm.updateValueAndValidity();
  }

  renderMember() {
    Utilities.delay(5000).then(() => {
      if (this.wizard.memberSearch.length > 0) {
        this.wizard.holderMemberId = Number(this.oldInquiry.interestedUser.id);
        const member = this.wizard.memberSearch.find(x => x.memberId === +this.oldInquiry.interestedUser.id);
        this.wizard.member = member;
        this.selectMember(member);
      }
    });
  }

  renderSubject() {
    const subjectIdOldInquiry = this.oldInquiry.subject.subjectId;
    const subject = this.listSubject.find(x => x.value === subjectIdOldInquiry);
    this.onValueChange(subject);
  }

  goToInquiryAsociated(inquiryId, e) {
    e.preventDefault();
    this.router.navigate([`/inquiry/view-information-result/${inquiryId}`]);
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
      this.wizard.infoRequestForm.get(this.TITLE_CTRL).setValidators([Validators.required]);
      this.wizard.infoRequestForm.get(this.TITLE_CTRL).updateValueAndValidity();
      this.wizard.infoRequestForm.get(this.DETAILS_CTRL).setValidators([Validators.required]);
      this.wizard.infoRequestForm.get(this.DETAILS_CTRL).updateValueAndValidity();
      this.wizard.infoRequestForm.addControl(this.SEARCH_TYPE_CTRL, new FormControl('', [Validators.required]));
      this.wizard.infoRequestForm.get(this.SEARCH_TYPE_CTRL).updateValueAndValidity();
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
   * This function allows to search the policy members according to policy search type.
   */
  searchPolicyMembers() {
    switch (this.wizard.infoRequestForm.get(this.SEARCH_TYPE_CTRL).value) {
      case this.SEARCH_TYPE_POLICY_ID:
        this.searchPolicyMembersByPolicyId();
        break;
      case this.SEARCH_TYPE_POLICY_LEGACY:
        this.searchPolicyMembersByPolicyLegacy();
        break;
    }
  }

  /**
  * Search the policy members by policy id.
  */
  searchPolicyMembersByPolicyId() {
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

  /**
   * Search the policy members by policy legacy.
   */
  searchPolicyMembersByPolicyLegacy() {
    this.wizard.member = null;
    this.wizard.memberSearch = [];
    this.policyService.getPolicyMembersByLegacyPolicyNumber(
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
        data.subjectsInformation = data.subjectsInformation.filter(subject => subject.subjectReference !== 'Telemedicine');
        const treeView: TreeViewPersonalized[] = InquiryHelper.mappedSubjectToTreeview(data, this.translationService.getLanguageId());
        this.listSubject = treeView;
      },
      error => {
        this.handleError(error);
      }
    );
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
      this.wizard.infoRequestForm.get(this.SEARCH_TYPE_CTRL).setValue(this.SEARCH_TYPE_POLICY_ID);
      this.wizard.infoRequestForm.updateValueAndValidity();
      if (!this.wizard.member) {
        this.searchPolicyMembers();
      }
    } else {
      this.showInputPolicyNumber = false;
      this.showMemberSelect = false;
      this.wizard.infoRequestForm.get(this.POLICY_NUMBER).setValue(this.user.user_key);
      this.wizard.infoRequestForm.get(this.SEARCH_TYPE_CTRL).setValue(this.SEARCH_TYPE_POLICY_ID);
      this.wizard.infoRequestForm.updateValueAndValidity();
    }
  }

  /***
   * Clear form
   */
  clearForm() {

    this.wizard.infoRequestForm.controls[this.TITLE_CTRL].setValue(null);
    this.wizard.infoRequestForm.controls[this.DETAILS_CTRL].setValue(null);
    this.wizard.infoRequestForm.updateValueAndValidity();
    this.uploadService.removeAllDocuments();
    this.documents = this.uploadService.getDocuments();
    this.wizard.subject = null;

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

  /**
   * Sets the policy search type array.
   */
  getPolicySearchTypesArray() {
    return [
      { value: this.SEARCH_TYPE_POLICY_ID },
      { value: this.SEARCH_TYPE_POLICY_LEGACY }
    ];
  }

  /**
   * Subscribe to value changes.
   */
  valueChanges() {
    if ((Number(this.user.role_id) === Rol.AGENT)
      || (Number(this.user.role_id) === Rol.AGENT_ASSISTANT)
      || (Number(this.user.role_id) === Rol.GROUP_ADMIN)) {
      if (this.wizard) {
        this.wizard.infoRequestForm.get(this.SEARCH_TYPE_CTRL).valueChanges.subscribe(val => {
          if (val) {
            this.wizard.member = null;
            this.wizard.memberSearch = [];
            this.wizard.infoRequestForm.get(this.POLICY_NUMBER).setValue('');
            this.wizard.infoRequestForm.get(this.POLICY_NUMBER).updateValueAndValidity();
            switch (this.wizard.infoRequestForm.get(this.SEARCH_TYPE_CTRL).value) {
              case this.SEARCH_TYPE_POLICY_ID:
                this.policyInputPlaceHolder = 'CLAIMSUBMISSION.STEP1INPUTTEXT';
                break;
              case this.SEARCH_TYPE_POLICY_LEGACY:
                this.policyInputPlaceHolder = 'CLAIMSUBMISSION.STEP1INPUTTEXT02';
                break;
            }
          }
        });
      }
    }
  }

}
