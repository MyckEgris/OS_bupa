/**
* ClaimSubmissionStep1ProviderComponent.ts
*
* @description: This class shows step 1 Provider of claim submission wizard.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 16-04-2020.
*
*/


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Store, select } from '@ngrx/store';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { ClaimSubmissionWizard } from '../../claim-submission-wizard/entities/ClaimSubmissionWizard';
import { ClaimSubmissionWizardService } from '../../claim-submission-wizard/claim-submission-wizard.service';
import { ClaimSubmissionMember } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionMember';
import { Subscription } from 'rxjs';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { FormControl, Validators } from '@angular/forms';
import { SearchMemberTypeConstants } from 'src/app/shared/services/policy/constants/policy-search-member-type-constants';
import { PolicyCountry } from 'src/app/shared/classes/policyCountry.enum';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';



/**
 * This class shows step 1 Provider of claim submission wizard.
 */
@Component({
  selector: 'app-claim-submission-step1-provider',
  templateUrl: './claim-submission-step1-provider.component.html'
})
export class ClaimSubmissionStep1ProviderComponent implements OnInit, OnDestroy {

  /**
   * Constant to identify the ClaimSubmissionWizard current step 2
   */
  public currentStep = 1;

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * ClaimSubmissionWizard Object
   */
  public wizard: ClaimSubmissionWizard;

  /**
   * User Rol enum
   */
  public rol = Rol;

  /**
   * Mín Date
   */
  public minDate = new Date('1900/01/01');

  /**
   * selected Date
   */
  public selectedDate;

  /**
   * Máx date
   */
  public maxDate = new Date();

  /**
   * valid Calendar
   */
  public validCalendar = false;

  /**
   * valid Calendar
   */
  public isApolicyBGLAOrMexico = false;

  /**
   * Const to Identify the single_provider sub step component
   */
  public STEP2_SINGLE_PROVIDER = 'single_provider';

  /**
   * Const to Identify the multi_provider sub step component
   */
  public STEP2_MULTI_PROVIDER = 'multi_provider';

  /**
   * Associated Provider form control.
   */
  public ASSOCIATED_PROVIDER_CTRL = 'associatedProvider';

  /**
   *  Start Date form control.
   */
  public START_DATE_CTRL = 'startDate';

  /**
   *  Search Type form control.
   */
  public SEARCH_TYPE_CTRL = 'searchType';

  /**
   *  Policy Id form control.
   */
  public POLICY_ID_CTRL = 'policyId';

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

  public subStep: string;

  public redirectUrlForSplitMexico: string;


  /**
   * Constructor Method
   * @param claimSubmissionWizardService Claim Submission Service Injection
   * @param router Router Injection
   * @param userInfoStore User Information Store Injection
   * @param policyService Policy Service Injection
   * @param providerService Provider Service Injection
   * @param uploadService UploadService Service Injection
   */
  constructor(
    private claimSubmissionWizardService: ClaimSubmissionWizardService,
    private router: Router,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private policyService: PolicyService,
    private providerService: ProviderService,
    private uploadService: UploadService,
    private config: ConfigurationService
  ) { }



  /**
   * Destroy subscription.
   */
  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  /**
   * Initialize component. Get user information from redux store.
   */
  ngOnInit() {
    this.subscription = this.claimSubmissionWizardService.beginClaimSubmissionWizard(
      wizard => this.wizard = wizard, this.currentStep
    );
    this.userInfoStore.pipe(select('userInformation')).subscribe((userInfo: UserInformationModel) => {
      this.wizard.user = userInfo;
    });
    this.getSubStepFromUrl();
    this.handleFormInput();
    this.validateCalendarState();
    this.getAssociatedProviders();
    this.onSelectProvider();
    this.valueChanges();
    this.policySearchTypes = this.getPolicySearchTypesArray();
    this.redirectUrlForSplitMexico = this.config.splitRedirectUrl;
  }

  /**
   * Sets form validations.
   */
  private handleFormInput() {
    if (this.wizard.searchForm.untouched) {
      this.getControl(this.POLICY_ID_CTRL).setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
      this.getControl(this.POLICY_ID_CTRL).updateValueAndValidity();
      this.wizard.searchForm.addControl(this.SEARCH_TYPE_CTRL, new FormControl('', [Validators.required]));
      this.wizard.searchForm.get(this.SEARCH_TYPE_CTRL).updateValueAndValidity();
      this.wizard.searchForm.get(this.START_DATE_CTRL).setValidators([Validators.required]);
      this.wizard.searchForm.get(this.START_DATE_CTRL).updateValueAndValidity();
      this.wizard.searchForm.get(this.ASSOCIATED_PROVIDER_CTRL).setValidators([Validators.required]);
      this.wizard.searchForm.get(this.ASSOCIATED_PROVIDER_CTRL).updateValueAndValidity();
    }
  }

  /**
   * Validates form state and sets defult values for calendar.
   */
  private validateCalendarState() {
    if (!this.wizard.searchForm.pristine) {
      this.selectedDate = new Date(this.wizard.searchForm.value.startDate);
    }
  }

  private getSubStepFromUrl() {
    console.log(this.router.url);
    const url = document.URL;
    this.subStep = url.indexOf('quickpay') > -1 ? this.STEP2_MULTI_PROVIDER : this.STEP2_SINGLE_PROVIDER;
  }

  /**
   * This function route to the next step (Step2).
   * @param subStep subStep
   */
  next() {
    if (this.subStep) {
      this.assignSelectProvider();
      this.handleSelectedSubStep(this.subStep);

      /*switch (subStep) {
        case this.STEP2_SINGLE_PROVIDER:
          this.wizard.currentSubStep = this.STEP2_SINGLE_PROVIDER;
          break;
        case this.STEP2_MULTI_PROVIDER:
          this.wizard.currentSubStep = this.STEP2_MULTI_PROVIDER;
          break;
      }*/

      this.wizard.currentSubStep = this.subStep;
      const nextRoute = this.router.url.replace('step1', 'step2');
      this.router.navigate([`${nextRoute}`]);
    }
  }

  /**
   * Handle selected subStep.
   * @param subStep subStep
   */
  handleSelectedSubStep(subStep: string) {
    if (subStep !== this.wizard.currentSubStep) {
      this.uploadService.removeAllDocuments();
      this.wizard.documents = [];
    }
  }

  /**
   * This function allows to search the policy members according to policy search type.
   */
  searchPolicyMembers() {
    switch (this.getControl(this.SEARCH_TYPE_CTRL).value) {
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
    this.isApolicyBGLAOrMexico = false;
    this.wizard.member = null;
    this.wizard.memberSearchResult = [];
    this.policyService.getPolicyMembersByPolicyId(
      this.wizard.searchForm.value.policyId,
      SearchMemberTypeConstants.CLAIM_SEARCH
    ).subscribe(
      data => {
        this.validatePolicyAccordingBGLAorMexico(this.wizard.user.role_id, data);
      }, error => {
        this.isApolicyBGLAOrMexico = false;
        this.wizard.memberSearchResult = [];
        console.log(error);
      }
    );
  }

  /**
   * Search the policy members by policy legacy.
   */
  searchPolicyMembersByPolicyLegacy() {
    this.isApolicyBGLAOrMexico = false;
    this.wizard.member = null;
    this.wizard.memberSearchResult = [];
    this.policyService.getPolicyMembersByLegacyPolicyNumber(
      this.wizard.searchForm.value.policyId,
      SearchMemberTypeConstants.CLAIM_SEARCH
    ).subscribe(
      data => {
        this.validatePolicyAccordingBGLAorMexico(this.wizard.user.role_id, data);
      }, error => {
        this.isApolicyBGLAOrMexico = false;
        this.wizard.memberSearchResult = [];
        console.log(error);
      }
    );
  }

 /**
    * Validate policy according to domain url only for Mexico split.
    * @param rolId user rol.
    * @param policyCountryId policy country id.
    */
   validatePolicyAccordingBGLAorMexico(rolId: string, data: ClaimSubmissionMember[]) {
    this.isApolicyBGLAOrMexico = this.policyService.validatePolicyAccordingToDomainUrlMexicoSplit(rolId,
      data[0].insuranceBusinessId);
    this.wizard.memberSearchResult = this.isApolicyBGLAOrMexico ? [] : data;
  }

  /**
   * This Function allow select a member to create and associate a claim.
   * @param member
   */
  selectMember(member: ClaimSubmissionMember) {
    this.wizard.member = member;
    this.wizard.groupId = member.groupId;
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
   * Get nested form controls.
   * @param field Field.
   */
  public getControl(field: string): FormControl {
    return this.wizard.searchForm.get(field) as FormControl;
  }

  /**
   * Subscribe to value changes.
   */
  valueChanges() {
    if (this.wizard) {
      this.getControl(this.SEARCH_TYPE_CTRL).valueChanges.subscribe(val => {
        if (val) {
          this.wizard.member = null;
          this.wizard.memberSearchResult = [];
          this.wizard.documents = null;
          this.uploadService.removeAllDocuments();
          this.getControl(this.POLICY_ID_CTRL).setValue('');
          this.getControl(this.POLICY_ID_CTRL).updateValueAndValidity();
          switch (this.getControl(this.SEARCH_TYPE_CTRL).value) {
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

  /**
   * This Function allow get Associated Providers to associate a claim and assign list fist value.
   */
  async getAssociatedProviders() {
    if (!this.wizard.associatedProviderResult) {
      this.wizard.associatedProviderResult = await this.providerService.getAssociatedProviderById(
        this.wizard.user.provider_id.toString()).toPromise();
    }
    if (this.wizard.associatedProviderResult && !this.wizard.associatedProvider) {
      const firstProv = this.wizard.associatedProviderResult.find(Prov => {
        return Prov.id === Number(this.wizard.user.provider_id);
      });
      this.wizard.searchForm.controls[this.ASSOCIATED_PROVIDER_CTRL].setValue(firstProv);
    }
  }

  /**
   * This Function allow select a Associated Provider to create and associate a claim.
   */
  onSelectProvider() {
    this.wizard.searchForm.controls[this.ASSOCIATED_PROVIDER_CTRL].valueChanges.subscribe(value => {
      this.wizard.associatedProvider = value;
    });
  }

  /**
   * This Function allows to asign Associated Provider selected to the claim wizard provider field.
   */
  assignSelectProvider() {
    this.providerService.getProviderById(this.wizard.associatedProvider.id.toString())
      .subscribe(provider => {
        this.wizard.provider = provider;
        this.assignCountryOfService();
      });
  }

  assignCountryOfService() {
    this.wizard.countryOfServiceId = this.wizard.provider.countryId;
  }

}
