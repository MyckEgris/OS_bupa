/**
* MemberElegibilityComponent.ts
*
* @description: This class searches members based on the policy number or name, and DOB.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 26-09-2018.
*
**/
import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { PolicyService } from '../../shared/services/policy/policy.service';
import { MemberInputDto } from '../../shared/services/policy/entities/member.dto';
import { MemberOutputDto } from '../../shared/services/policy/entities/member';
import { Store, select } from '@ngrx/store';
import { UserInformationReducer } from '../../security/reducers/user-information.reducer';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { Utilities } from '../../shared/util/utilities';
import { TranslateService } from '@ngx-translate/core';
import { UserInformationModel } from '../../security/model/user-information.model';
import { CustomValidator } from './../../shared/validators/custom.validator';
import { forkJoin, timer } from 'rxjs';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { PolicyCountry } from 'src/app/shared/classes/policyCountry.enum';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { forEach } from '@angular/router/src/utils/collection';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { switchMap } from 'rxjs/operators';

/**
 * This class searches members based on the policy number or name, and DOB.
 */
@Component({
  selector: 'app-member-elegibility',
  templateUrl: './member-elegibility.component.html'
})
export class MemberElegibilityComponent implements OnInit, AfterViewChecked {

  /**
   * Constant for default type selected index
   */
  private DEFAULT_MEMBER_TYPE_SELECTED = 0;

  /**
   * Constant for error 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * User Information Model
   */
  private user: UserInformationModel;

  /**
   * Constant for switch case select
   */
  private SEARCH_TYPE_CASE_SELECT = 'select';

  /**
   * Constant for switch case by policy
   */
  private SEARCH_TYPE_CASE_BY_POLICY = 'by_policy';

  /**
   * Constant for switch case by member
   */
  private SEARCH_TYPE_CASE_BY_MEMBER = 'by_member';

   /**
   * Constant for switch case by member
   */
   private SEARCH_TYPE_CASE_BY_LEGACY_POLICY = 'by_legacy_policy';

  /**
   * Flag for searching proccess
   */
  public searchProccess = false;

  /**
   * Flag for show DoB
   */
  public showDoB = true;

  /**
   * Form group for memeber eligibility reactive form
   */
  public memberElegibilityForm: FormGroup;

  /**
   * Array for member search types
   */
  public memberSearchType: Array<any>;

  /**
   * Member Dto object
   */
  public members: MemberOutputDto[] = [];

  /**
   * date format
   */
  public dateFormat: string;

  /**
   * Init page for pagination component
   */
  private INIT_PAGE = 1;

  /**
   * Page size for pagination component
   */
  private PAGE_SIZE = 10;

  /**
   * Tag to show business exceptions
   */
  public errorMessage: string;

  /**
   * Initial min date
   */
  public minDate = { year: 1900, month: 1, day: 1 };

  public maxDate = new Date();

  public loadedDate;

  public popoverMsg = '';

  /**
  * Policy Dto.
  */
  private policyDto: PolicyDto;

  /**
  * Current Legacy Number.
  */
  private currentLegacyNumber: string;

  /**
  * OwnerDbo.
  */
  private ownerDbo: string;

  /**
  * Variable to know if the provider have a policy of Mexico.
  */
  private isProviderWithPolicyBGLAOrMexico = false;

  /**
  * Redirect url for split mexico.
  */
  private redirectUrlForSplitMexico: string;

  /**
   * implemented to defined if the component will have the default behavior
   * or it will only redirect the page to execute the search in other page
   * false = normalBehavior
   * true = redirect to other page
   */
  @Input() onHomeProvider: false;

  @ViewChild('inputDate') inputDate;

  /**
   * Constructor Method
   * @param policyService Policy Service Injection
   * @param userInfoStore User Information Store Injection
   * @param notification Notification Service Injection
   * @param translate Translate Service Injection
   */
  constructor(
    private policyService: PolicyService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private notification: NotificationService,
    private translate: TranslateService,
    private router: Router,
    private _activeRouter: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private config: ConfigurationService
  ) { }

  /**
   * indicates flags states. Translate search type according the language
   * Build reactive form. Set validators
   */
  ngOnInit() {
    if (!this.onHomeProvider) {
      this.showDoB = false;
    }
    this.searchProccess = false;
    this.loadAndTranslateSearchTypes();
    this.translate.onLangChange.subscribe(() => {
      this.loadAndTranslateSearchTypes();
      this.loadPopoverMsg();
    });

    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      if (userInfo !== undefined) {
        this.user = userInfo;
      }
    });
    this.redirectUrlForSplitMexico = this.config.splitRedirectUrl;
  }

  /**
   * reads the route params
   */
  private readRouteParams() {
    this._activeRouter.params.subscribe(params => {
      if (params.searchMemberType) {

        this.showDoB = true;

        this.memberElegibilityForm.setValue({
          searchMemberType: params.searchMemberType,
          firstName: params.firstName,
          lastName: params.lastName,
          policyId: params.policyId,
          dob: new Date(params.dob)
        });


        this.loadedDate = new Date(params.dob);
        this.executeSearch(this.memberElegibilityForm.value);
      }
    });

  }

  /**
   * load the pop over msg
   */
  async loadPopoverMsg() {
    this.popoverMsg = await this.translate.get('APP.POPOVER_DOB').toPromise();
  }

  /**
   * Loads Search Type control by Language.
   */
  loadAndTranslateSearchTypes() {
    const translateOpt1 = this.translate.get('ELIGIBILITY.SEARCH_TYPES.SELECT');
    const translateOpt2 = this.translate.get('ELIGIBILITY.SEARCH_TYPES.BY_POLICY');
    const translateOpt3 = this.translate.get('ELIGIBILITY.SEARCH_TYPES.BY_MEMBER');
    const translateOpt4 = this.translate.get('ELIGIBILITY.SEARCH_TYPES.BY_LEGACY_POLICY');

    const arrayValues = ['select', 'by_policy', 'by_member', 'by_legacy_policy'];

    forkJoin([translateOpt1, translateOpt2, translateOpt3, translateOpt4]).subscribe(descriptionOptions => {
      this.memberSearchType = [];

      for (let a = 0; a < arrayValues.length; a++) {

        this.memberSearchType.push({ value: arrayValues[a], description: descriptionOptions[a] });
      }
      this.memberElegibilityForm = this.buildDefaultMemberElegibilityForm();

      if (this.onHomeProvider) {
        this.memberElegibilityForm.patchValue({ searchMemberType: this.memberSearchType[1].value });
      }

      this.memberElegibilityForm.controls.searchMemberType.valueChanges.subscribe(val => {
        this.setValidations(val);
      });
      this.readRouteParams();
      this.loadPopoverMsg();

    });


  }

  /**
   * Builds default Member Elegibility Form.
   */
  buildDefaultMemberElegibilityForm() {
    return new FormGroup({
      searchMemberType: new FormControl(this.memberSearchType[this.DEFAULT_MEMBER_TYPE_SELECTED].value),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      policyId: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
      dob: new FormControl('', Validators.required)
    });
  }

  /**
   * Builds Member form and sets its validators.
   * @param value SearchTypeSelected.
   */
  setValidations(value: any) {
    this.members = [];
    this.searchProccess = false;
    this.showDoB = false;

    this.clearAllValidations();
    // this.inputDate.dateInput.nativeElement.value = '';

    this.memberElegibilityForm.controls.dob.setValidators([Validators.required, CustomValidator.datePickerValidator]);

    switch (value) {
      case this.SEARCH_TYPE_CASE_SELECT:
        break;
      case this.SEARCH_TYPE_CASE_BY_POLICY:
        this.memberElegibilityForm.controls.firstName.setValue('');
        this.memberElegibilityForm.controls.lastName.setValue('');
        this.memberElegibilityForm.controls.policyId.setValue('');
        this.memberElegibilityForm.controls.policyId.setValidators(
          [Validators.required, Validators.minLength(5), Validators.maxLength(10)]);
        this.showDoB = true;
        break;
      case this.SEARCH_TYPE_CASE_BY_MEMBER:
        this.memberElegibilityForm.controls.firstName.setValue('');
        this.memberElegibilityForm.controls.lastName.setValue('');
        this.memberElegibilityForm.controls.policyId.setValue('');
        this.memberElegibilityForm.controls.firstName.setValidators(Validators.required);
        this.memberElegibilityForm.controls.lastName.setValidators(Validators.required);
        this.showDoB = true;
        break;
      case this.SEARCH_TYPE_CASE_BY_LEGACY_POLICY:
        this.memberElegibilityForm.controls.firstName.setValue('');
        this.memberElegibilityForm.controls.lastName.setValue('');
        this.memberElegibilityForm.controls.policyId.setValue('');
        this.memberElegibilityForm.controls.policyId.setValidators(
          [Validators.required, Validators.minLength(5), Validators.maxLength(18)]);
        this.showDoB = true;
        break;
      default:
        break;
    }

    this.memberElegibilityForm.updateValueAndValidity();

  }


  /**
   * clear all validators.
   */
  clearAllValidations() {
    this.memberElegibilityForm.controls.firstName.clearValidators();
    this.memberElegibilityForm.controls.lastName.clearValidators();
    this.memberElegibilityForm.controls.policyId.clearValidators();

    if (this.showDoB) {
      this.memberElegibilityForm.controls.dob.clearValidators();
    }
  }

  /**
   * Finds a member.
   * @param memberForm member elegibility form.
   */
  searchMember(memberForm: any) {
    if (this.onHomeProvider) {
      this.router.navigate(['/policies/member-elegibility', this.memberElegibilityForm.value]);
    } else {
      this.executeSearch(memberForm);
    }
  }

  /**
   * Execute the search
   * @param memberForm params to seach
   */
  private executeSearch(memberForm: any) {
    this.searchProccess = false;
    this.members = [];
    const memberInputDto = memberForm as MemberInputDto; // this.mapperMemberFormToMemberInputDto(memberForm);

    const timer$ = timer(250);

    timer$.subscribe(t => {
      if (memberInputDto.searchMemberType === this.memberSearchType[1].value){
        this.getPolicyMembersByPolicyIdAndDoBAndEligibility(memberInputDto);
      } else if (memberInputDto.searchMemberType === this.memberSearchType[3].value) {
        this.setValuesCurrentFilter(this.memberElegibilityForm.controls.policyId.value, this.memberElegibilityForm.controls.dob.value);
        this.searchLegacyPoliciesByFilter(1)
      } else {
        this.getMembersEligibility(memberInputDto);
      }
    });

  }

  /**
   * Gets the members eligibility list from the service.
   * @param memberInputDto
   */
  private getMembersEligibility(memberInputDto: MemberInputDto) {
    this.policyService.getMembersEligibility(memberInputDto, this.user)
      .subscribe(
        data => {
          this.searchProccess = true;
          this.members = data;
          this.validateIsAProviderWithAMexicoOrBGLAPolicy(data[0].policyId, this.user);
        }, error => {
          this.showIfHadBusinessError(error);
        });
  }

  /**
   * Gets the policy member on the service based on the policy number and DOB.
   * @param memberInputDto Member Input Data Transfer Object.
   */
  private getPolicyMembersByPolicyIdAndDoBAndEligibility(memberInputDto: MemberInputDto) {
    this.isProviderWithPolicyBGLAOrMexico = false;
    if (!this.validateIsAProviderWithAMexicoOrBGLAPolicy(memberInputDto.policyId, this.user)) {
      this.policyService.getPolicyMembersByPolicyIdAndDoBAndEligibility(memberInputDto, this.user)
        .subscribe(
          data => {
            this.searchProccess = true;
            this.members = data;
          }, error => {
            this.showIfHadBusinessError(error);
          });
    }
  }

  private validateIsAProviderWithAMexicoOrBGLAPolicy(policyId: string, user: UserInformationModel): boolean {
    return this.validatePolicyByPolicyId(user.role_id, user.user_key, +policyId);
  }

  private validatePolicyByPolicyId(rolId: string, userKey: string, policyId: number): boolean {
    this.policyService.getDetailPolicyByPolicyIdAndExclueDetail(
      rolId,
      userKey,
      policyId,
      null,
      true
    ).subscribe((data: PolicyDto) => {
      this.policyDto = data;
      this.isProviderWithPolicyBGLAOrMexico = this.policyService.validatePolicyAccordingToDomainUrlMexicoSplit(
        rolId, this.policyDto.insuranceBusinessId);
      return this.isProviderWithPolicyBGLAOrMexico;
    }, error => {
      this.isProviderWithPolicyBGLAOrMexico = false;
      this.showIfHadBusinessError(error);
    });
    return false;
  }

  /**
 * Handles the service error.
 * @param error HttpErrorMessage.
 */
  private showIfHadBusinessError(error) {
    if (error.error.code) {
      this.errorMessage = error.error.message;
      this.notification.showDialog('Business Exception', error.error.message);
    } else if (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND) {
      this.searchProccess = true;
    }
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  setValuesCurrentFilter(legacyNumber: string, ownerDbo: string) {
    this.currentLegacyNumber = legacyNumber;
    this.ownerDbo = ownerDbo;
  }

   searchLegacyPoliciesByFilter(pageIndex: number,) {

    return this.policyService.getPoliciesByFilter(this.user.role_id, this.user.user_key, pageIndex, this.PAGE_SIZE,
      null, null, this.currentLegacyNumber, null, null, null, null, this.ownerDbo, null, null,
      null, null, null).pipe(switchMap(async (data) => {
            this.searchProccess = true;
            data.data.forEach(element => {
              element.members.forEach(member => {
          
              }) 
            });
            this.members = data.data[0].members;
      }
      )).subscribe();
        
    }
  
}
