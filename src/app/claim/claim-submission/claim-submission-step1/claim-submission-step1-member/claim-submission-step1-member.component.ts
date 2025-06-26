/**
* ClaimSubmissionStep1MemberComponent.ts
*
* @description: This class shows step 1 Member of claim submission wizard.
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
import { ClaimSubmissionWizard } from '../../claim-submission-wizard/entities/ClaimSubmissionWizard';
import { ClaimSubmissionWizardService } from '../../claim-submission-wizard/claim-submission-wizard.service';
import { ClaimSubmissionMember } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionMember';
import { Subscription } from 'rxjs';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { UploadService } from 'src/app/shared/upload/upload.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { SearchMemberTypeConstants } from 'src/app/shared/services/policy/constants/policy-search-member-type-constants';




/**
 * This class shows step 1 Member of claim submission wizard.
 */
@Component({
  selector: 'app-claim-submission-step1-member',
  templateUrl: './claim-submission-step1-member.component.html'
})
export class ClaimSubmissionStep1MemberComponent implements OnInit, OnDestroy {

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
   * Const to Identify the single_provider sub step component
   */
  public STEP2_SINGLE_PROVIDER = 'single_provider';

  /**
   * Const to Identify the multi_provider sub step component
   */
  public STEP2_MULTI_PROVIDER = 'multi_provider';

  /**
   *  Start Date form control.
   */
  public START_DATE_CTRL = 'startDate';

  /**
   * Policy's country instance.
   */
  public countries: Country[] = [];

  public subStep: string;

  /**
   * Constructor Method
   * @param claimSubmissionWizardService Claim Submission Service Injection
   * @param router Router Injection
   * @param userInfoStore User Information Store Injection
   * @param policyService Policy Service Injection
   * @param uploadService UploadService Service Injection
   */
  constructor(
    private claimSubmissionWizardService: ClaimSubmissionWizardService,
    private router: Router,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private policyService: PolicyService,
    private uploadService: UploadService,
    private _commonService: CommonService,
    private translate: TranslateService,
    private notification: NotificationService
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
      this.handleFormInput(userInfo.user_key);
    });
    this.getSubStepFromUrl();
    this.validateCalendarState();
    this.getCountries();
  }

  /**
   * Assing form startDate value.
   */
  private validateCalendarState() {
    this.wizard.searchForm.get(this.START_DATE_CTRL).setValue(moment().format('YYYY-MM-DD HH:mm'));
    this.wizard.searchForm.get(this.START_DATE_CTRL).updateValueAndValidity();
  }

  private getSubStepFromUrl() {
    const url = document.URL;
    this.subStep = url.indexOf('quickpay') > -1 ? this.STEP2_MULTI_PROVIDER : this.STEP2_SINGLE_PROVIDER;
  }

  /**
   * Preload policy id for PolicyHolders and GropPolicyHolder roles.
   * @param key policy id
   */
  private handleFormInput(key: string) {
    if (this.wizard.searchForm.untouched) {
      this.wizard.searchForm.patchValue({ policyId: key });
      this.wizard.searchForm.updateValueAndValidity();
      if (!this.wizard.member) {
        this.searchPolicyMembers();
      }
    }
  }

  /**
   * This function route to the next step (Step2).
   * @param subStep subStep
   */
  next() {
    if (this.subStep) {
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
   * This function allows to search policy members.
   */
  searchPolicyMembers() {
    this.wizard.member = null;
    this.wizard.memberSearchResult = [];
    this.policyService.getPolicyMembersByPolicyId(
      this.wizard.searchForm.value.policyId,
      SearchMemberTypeConstants.CLAIM_SEARCH
    ).subscribe(
      data => {
        this.wizard.memberSearchResult = data;
        this.defaultCountry(data);
      }, error => {
        this.wizard.memberSearchResult = [];
      }
    );
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
  * Loads countries for charge the select option
  */
  getCountries() {
    this._commonService.getCountries()
      .subscribe(
        result => {
          this.countries = result;
        },
        error => {
          if (error.error.code) {
            this.showErrorMessage(error);
          }
        }
      );
  }

  /**
   * Shows an error message.
   * @param errorMessage error message that will be shown.
   */
  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`AGENT.PROFILE.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`AGENT.PROFILE.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);

  }

  /**
  * This Function allow select a country to create and associate a claim.
  * @param countryId
  */
  selectCountry($event, countryValue: number) {
    this.wizard.countryOfServiceId = Number(countryValue);
  }
  /**
   * This Function allow filter a country of member policy
   * @param filterMember[]
   */
  defaultCountry(filterMember: ClaimSubmissionMember[]) {
    this.wizard.countryOfServiceId = filterMember.length > 1 ? (
      filterMember.filter(relationTypeId => relationTypeId.relationTypeId === 2 || relationTypeId.relationTypeId === 5),
      filterMember[0].policyCountryId) : filterMember[0].policyCountryId;
  }

}
