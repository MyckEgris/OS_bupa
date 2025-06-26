import { Component, OnInit } from '@angular/core';
import { TreeviewConfig } from 'ngx-treeview';
import { CustomerService } from 'src/app/shared/services/inquiry/customer.service';
import { TreeViewPersonalized } from 'src/app/shared/components/tree-view-personalized/entities/treeview-personalized';
import { InquiryHelper } from 'src/app/shared/services/inquiry/helpers/inquiry.helper';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { FormGroup, FormControl } from '@angular/forms';
import { isNil } from 'lodash';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { InquiryResponseDto } from 'src/app/shared/services/inquiry/entities/inquiry-response.dto';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { ClaimSubmissionMember } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionMember';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { Router } from '@angular/router';
import { InquiriesOutputDto } from 'src/app/shared/services/inquiry/entities/inquiries-output.dto';
import { InformationRequestWizardService } from '../information-request/information-request-wizard/information-request-wizard.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { SearchMemberTypeConstants } from 'src/app/shared/services/policy/constants/policy-search-member-type-constants';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';

@Component({
  selector: 'app-view-information-request',
  templateUrl: './view-information-request.component.html'
})
export class ViewInformationRequestComponent implements OnInit {

  /***
   * List of subject in the entity TreeViewPersonalized for show in the component Treview
   */
  public listSubject: TreeViewPersonalized[];

  /***
   * Subject selected for created inquiry
   */
  private subject: TreeViewPersonalized;

  /**
   * Flag for searching proccess
   */
  public searchProccess = false;

  /**
   * Stores the logged user information
   */
  private user: UserInformationModel;

  /**
   * Main form
   */
  public infoRequestViewForm: FormGroup;

  /***
   * List data (Information Request) for show
   */
  public inqueries: InquiryResponseDto = { status: null, count: 0, pageindex: 1, pageSize: 0, data: [] };

  /**
   * Collection size for pagination component
   */
  public collectionSize: number = null;

  /**
   * Init page for pagination component
   */
  private INIT_PAGE = 1;

  /**
   * Page size for pagination component
   */
  public PAGE_SIZE = 10;

  /**
   * Current page for pagination component
   */
  public page: number;

  public minDate: Date = new Date('1900/01/01');
  public maxDate = new Date();
  public minDateRange: Date = new Date('1900/01/01');
  public isDisableCreatedDateTo: Boolean = true;

  public dateValueFrom = undefined;
  public dateValueTo = undefined;
  public resetPicker: boolean;

  private userKey: string;

  public clearSubject: Boolean = false;

  public businessInsurance: number;

  public isProvider = false;

  public redirectUrlForSplitMexico: string;

  constructor(
    private translationService: TranslationService,
    private customerService: CustomerService,
    private translate: TranslateService,
    private authService: AuthService,
    private policyService: PolicyService,
    private router: Router,
    private informationRequestService: InformationRequestWizardService,
    private configurationService: ConfigurationService
  ) { }

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

  ngOnInit() {
    this.page = this.INIT_PAGE;
    this.getSubjects();
    this.user = this.authService.getUser();
    this.redirectUrlForSplitMexico = this.configurationService.splitRedirectUrl;
    this.validateIfIsProvider(this.user);
    this.businessInsurance = +this.user.bupa_insurance;
    this.getUserKey();
    this.infoRequestViewForm = this.buildDefaultForm();
    this.collectionSize = 0;
    this.resetPicker = false;
    this.translate.onLangChange.subscribe(() => {
      this.getSubjects();
      InquiryHelper.getSubjectTraslate(this.inqueries, this.translationService.getLanguageId());
      this.search('', this.INIT_PAGE);
    });
    this.search('', this.INIT_PAGE);
    this.infoRequestViewForm.controls.createdFrom.valueChanges.subscribe(val => this.changeMinDateRange(val, 'createdFrom'));
    this.infoRequestViewForm.controls.createdTo.valueChanges.subscribe(val => this.changeMinDateRange(val, 'createdTo'));
  }

  validateIfIsProvider(user: UserInformationModel) {
    this.isProvider = +user.role_id === Rol.PROVIDER ? true : false;
  }

  buildDefaultForm() {
    return new FormGroup({
      ticketNumber: new FormControl(''),
      subjectId: new FormControl(''),
      createdFrom: new FormControl(),
      createdTo: new FormControl()
    });
  }

  getUserKey() {
    this.userKey = this.user.user_key;
    if (Number(this.user.role_id) === Rol.POLICY_HOLDER
      || Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) {
      this.getMemberId();
    }
    if (Number(this.user.role_id) === Rol.PROVIDER) {
      this.userKey = this.user.user_key_alternative;
    }
  }

  getMemberId() {
    this.policyService.getPolicyMembersByPolicyId(
      Number(this.user.user_key),
      SearchMemberTypeConstants.ACTIVE_MEMBERS
    ).subscribe(
      (members: ClaimSubmissionMember[]) => {
        if (Number(this.user.role_id) === Rol.POLICY_HOLDER
          || Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) {
          this.userKey = members.filter(member => member.relationTypeId === RelationType.OWNER)[0].memberId.toString();
        }
      },
      error => {
        console.error(error);
      });
  }

  search(value, page) {
    this.clearSubject = false;
    let subjectId = null;
    if (this.subject) {
      subjectId = this.subject.value;
    }
    this.customerService.getInquiryByParams(this.userKey, this.infoRequestViewForm.controls.ticketNumber.value,
      subjectId, this.infoRequestViewForm.controls.createdFrom.value,
      this.infoRequestViewForm.controls.createdTo.value, page, this.PAGE_SIZE).subscribe(
        (data: InquiryResponseDto) => {
          this.searchProccess = true;
          InquiryHelper.getSubjectTraslate(data, this.translationService.getLanguageId());
          this.inqueries = data;
          this.collectionSize = this.inqueries.count;
          this.customerService.setInquiryResponse(this.inqueries.data);
        },
        error => {
          this.collectionSize = 0;
          this.inqueries = { status: null, count: 0, pageindex: 1, pageSize: 0, data: [] };
          this.handlePolicyError(error);
        }
      );
  }

  /***
   * Evaluated type error
   */
  private handlePolicyError(error: any) {
    if (error.status === 404) {
      this.searchProccess = true;
    }
  }

  /***
   * Get List of Subject for Role (The backend take the role of token)
   */
  getSubjects() {
    this.customerService.getSubjects().subscribe(
      data => {
        const treeView: TreeViewPersonalized[] = InquiryHelper.mappedSubjectToTreeview(data, this.translationService.getLanguageId());
        this.listSubject = treeView;
      },
      error => {
        console.error(error);
      }
    );
  }

  /***
   * Validate dates
   */
  changeMinDateRange(date: string, control: string) {
    if (control === 'createdFrom') {
      if (!isNil(date)) {
        this.minDateRange = new Date(date);
        this.isDisableCreatedDateTo = false;
      }
    }

    if (this.infoRequestViewForm.controls.createdTo.value !== null
      && this.infoRequestViewForm.controls.createdTo.value !== undefined) {
      if (this.minDateRange > this.infoRequestViewForm.controls.createdTo.value) {
        this.dateValueTo = undefined;
        this.infoRequestViewForm.controls.createdTo.setValue(undefined);
        (<FormControl>this.infoRequestViewForm.controls['createdTo']).reset();
      }
    }
  }

  /***
   * Clean fields of form
   */
  clearFields() {
    if (event) {
      this.searchProccess = false;
      this.removeValues();
      this.inqueries = { status: null, count: 0, pageindex: 1, pageSize: 0, data: [] };
    }
  }

  removeValues() {
    this.resetPicker = true;
    Object.keys(this.infoRequestViewForm.controls).forEach(key => {
      this.infoRequestViewForm.get(key).setValue('');
    });
    (<FormControl>this.infoRequestViewForm.controls['createdTo']).reset();
    (<FormControl>this.infoRequestViewForm.controls['createdFrom']).reset();

    this.subject = undefined;
    this.resetPicker = false;
    this.clearSubject = true;
    this.collectionSize = 0;
  }

  /**
   * Updates pagination
   */
  changePageOfInformationRequest(page: number) {
    if (!page) { return; }
    this.page = page;
    this.search(this.infoRequestViewForm.value, this.page);
  }

  /***
   * Set value selected of list Subject
   */
  onValueChange(value: TreeViewPersonalized) {
    this.subject = value;
  }

  onSelectedChange(value) {
  }

  onFilterChange(value) {
  }

  onViewResponse(inquiry: InquiriesOutputDto) {
    this.customerService.setInquiryResultByInquiry(inquiry);
    this.router.navigate([`/inquiry/view-information-result/${inquiry.inquiryId}`]);
  }

  checkIfStateCanViewResponse(inquiry: InquiriesOutputDto) {
    return (inquiry.inquiryDigitalStatus && this.checkIfBusinessCanViewResponse() &&
      (inquiry.inquiryDigitalStatus.statusDigitalName.toLowerCase() === 'resolved' ||
        inquiry.inquiryDigitalStatus.statusDigitalName.toLowerCase() === 'in progress'));
  }

  checkIfBusinessCanViewResponse() {
    return (this.user.bupa_insurance !== InsuranceBusiness.BUPA_MEXICO.toString());
  }

  checkInquiryResolution(resolution) {
    return (resolution && resolution.resolutionDate && resolution.resolutionResponse);
  }

  createInquiry() {
    this.informationRequestService.setParentInquiryId(null);
    this.router.navigate([`/inquiry/information-request/inquiry`]);
  }

}
