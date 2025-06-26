import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PreAuthorizationWizard } from '../pre-authorization-wizard/entities/pre-authorization-wizard';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { ProviderOutputDto } from 'src/app/shared/services/provider/entities/provider.dto';
import { PreAuthorizationWizardService } from '../pre-authorization-wizard/pre-authorization-wizard.service';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Country } from 'src/app/shared/services/common/entities/country';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Router } from '@angular/router';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StatusPolicy } from 'src/app/shared/classes/status-policy.enum';
import { concat } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { SearchMemberTypeConstants } from 'src/app/shared/services/policy/constants/policy-search-member-type-constants';
import { PolicyCountry } from 'src/app/shared/classes/policyCountry.enum';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';

@Component({
  selector: 'app-pre-authorization-step1',
  templateUrl: './pre-authorization-step1.component.html'
})
export class PreAuthorizationStep1Component implements OnInit, OnDestroy {

  /**
   * PreAuthorizationWizard Object
   */
  public wizard: PreAuthorizationWizard;

  /**
   * Provider Object
   */
  provider: ProviderOutputDto;

  /***
   * Subscription wizard
   */
  private subscription: Subscription;

  /**
   * Subscription provider
   */
  private subProvider: Subscription;

  /***
   * Subscription details policy
   */
  private subPolicyMembers: Subscription;

  /***
   * Subscription policy all
   */
  private subPolicy: Subscription;

  /***
   * Subscription Countries
   */
  private subCountries: Subscription;

  /**
   * Constant for current step # 1
   */
  public currentStep = 1;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /***
   * isProvider validate for show info only provider
   */
  public isProvider: Boolean = false;

  /***
   * Const to identify the FormControl PolicyNumber
   */
  public POLICY_NUMBER = 'policyNumber';

  /***
   * Const to Identify the FormGroup MemberInformation
   */
  public MEMBER_INFORMATION = 'memberInformation';

  /**
   * Const to Identify the FormGroup contactInformation
   */
  public CONTACT_INFORMATION = 'contactInformation';

  /***
   * Const to Identify the FormGroup infoProviderForm
   */
  public INFO_PROVIDER_FORM = 'infoProviderForm';

  /**
   * List countries
   */
  public countries: Country[];

  /***
   * Policy statements allowed to create pre authorization
   */
  private POLICY_STATUS_IDS =
    String().concat(
      StatusPolicy.ACTIVE.toString(), ',',
      StatusPolicy.PENDING_PAYMENT.toString(), ',',
      StatusPolicy.GRACE_PERIOD.toString());

  /***
   * showInputPolicyNumber
   */
  public showInputPolicyNumber = true;

  /***
   * Show required message field when next button is pressed
   */
  public showValidations = false;

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
   * Variable that indicate if a provider has a policy of Mexico.
   */
  public isAmexicoProviderWithPolicyOfMexico = false;

  constructor(
    private configurationService: ConfigurationService,
    private router: Router,
    private authService: AuthService,
    private providerService: ProviderService,
    private preAuthWizardService: PreAuthorizationWizardService,
    private translate: TranslateService,
    private notification: NotificationService,
    private policyService: PolicyService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.preAuthWizardService.beginPreAuthWizardServiceWizard(
      wizard => {
        this.wizard = wizard;
        this.handleFormInput();
        this.getCountryIdProvider(this.user.user_key);
        this.showListProvider();
        this.getCountries();
        this.isHolder();
        this.valueChanges();
        this.policySearchTypes = this.getPolicySearchTypesArray();
      }, this.user, this.currentStep);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subProvider) {
      this.subProvider.unsubscribe();
    }
    if (this.subPolicyMembers) {
      this.subPolicyMembers.unsubscribe();
    }
    if (this.subPolicy) {
      this.subPolicy.unsubscribe();
    }
    this.subCountries.unsubscribe();
    this.countries = null;
  }

  /***
   * To display the list of suppliers (Only applies to the provider role)
   */
  showListProvider() {
    if (Number(this.user.role_id) === Rol.PROVIDER) {
      this.isProvider = true;
      (this.wizard.preAuthForm.get(this.MEMBER_INFORMATION) as FormGroup)
        .addControl('provider', new FormControl('', [Validators.required]));
      this.getListProviders();
    }
  }

  /***
   * Get list the providers associated to the provider Id Authentication
   */
  getListProviders() {
    this.subProvider = this.providerService.getAssociatedProviderById(this.user.user_key).subscribe(
      listProvider => {
        this.wizard.lstAssociatedProvider = listProvider;
      },
      error => {
        console.error(error);
      }
    );
  }

  /**
   * This Function allow select a member to create and associate a preauthorization.
   * @param member
   */
  selectMember(member: MemberOutputDto) {
    this.wizard.member = member;
  }

  /**
   * This function allows to search the policy detail according to policy search type.
   */
  searchPolicyDetail() {
    this.isAmexicoProviderWithPolicyOfMexico = false;
    switch (this.getControl(this.MEMBER_INFORMATION, this.SEARCH_TYPE_CTRL).value) {
      case this.SEARCH_TYPE_POLICY_ID:
        this.searchPolicyMembersByPolicyId();
        break;
      case this.SEARCH_TYPE_POLICY_LEGACY:
        this.searchPolicyMembersByPolicyLegacy();
        break;
    }
  }

  /**
   * Search the policy detail by policy id.
   */
  searchPolicyMembersByPolicyId() {
    this.getControl(this.MEMBER_INFORMATION, this.POLICY_NUMBER).enable();
    this.wizard.member = null;
    this.wizard.memberSearch = [];
    this.wizard.policyDto = null;
    this.wizard.holderMemberId = null;
    this.subPolicy = this.policyService.getDetailPolicyByPolicyId(
      this.user.role_id,
      this.user.user_key,
      this.getControl(this.MEMBER_INFORMATION, this.POLICY_NUMBER).value,
      this.POLICY_STATUS_IDS
    ).subscribe(
      (data: PolicyDto) => {
        if (this.validateIsAProviderFromMexico(data)) {
          this.wizard.memberSearch = [];
          this.wizard.policyDto = null;
          this.wizard.holderMemberId = null;
        } else {
          this.wizard.memberSearch = data.members;
          this.wizard.policyDto = data;
          this.saveMemberIdHolder(data.members);
          this.getCountryPolicy(this.wizard.policyDto);
        }
      },
      error => {
        this.wizard.memberSearch = [];
        this.handlePolicyError(error);
      });
  }

  /**
   * Validate if it is a provider from Mexico
   */
  validateIsAProviderFromMexico(policyData: PolicyDto) {
    if (+this.user.role_id === Rol.PROVIDER) {
        this.isAmexicoProviderWithPolicyOfMexico = true;
        return true;
    } else {
      return false;
    }
  }

  /**
   * Get country Provider.
   */
  getCountryIdProvider(idProvider: string) {
    if (+this.user.role_id === Rol.PROVIDER && !this.wizard.providerInSession) {
      this.providerService.getProviderById(idProvider)
        .subscribe(provider => {
          this.wizard.providerInSession = provider;
        });
    }
  }


  /**
   * Search the policy detail by policy legacy.
   */
  searchPolicyMembersByPolicyLegacy() {
    this.getControl(this.MEMBER_INFORMATION, this.POLICY_NUMBER).enable();
    this.wizard.member = null;
    this.wizard.memberSearch = [];
    this.wizard.policyDto = null;
    this.wizard.holderMemberId = null;

    this.policyService.getPoliciesByFilter(
      this.user.role_id, this.user.user_key, 1, 10,
      null, null,
      this.getControl(this.MEMBER_INFORMATION, this.POLICY_NUMBER).value,
      null, null, null, null, null, null, null, null, null
    ).subscribe(
      info => {

        const item = info.data.find(
          policy => Number(policy.legacyNumber) === Number(this.getControl(this.MEMBER_INFORMATION, this.POLICY_NUMBER).value)
        );
        this.getCountryIdProvider(this.user.user_key);
        this.subPolicy = this.policyService.getDetailPolicyByPolicyId(
          this.user.role_id,
          this.user.user_key,
          item.policyId,
          this.POLICY_STATUS_IDS
        ).subscribe(
          (data: PolicyDto) => {
            if (this.validateIsAProviderFromMexico(data)) {
              this.wizard.memberSearch = [];
              this.wizard.policyDto = null;
              this.wizard.holderMemberId = null;
            } else {
              this.wizard.memberSearch = data.members;
              this.wizard.policyDto = data;
              this.saveMemberIdHolder(data.members);
              this.getCountryPolicy(this.wizard.policyDto);
            }
          },
          error => {
            this.wizard.memberSearch = [];
            this.handlePolicyError(error);
          });

      },
      error => {
        this.handlePolicyError(error);
        console.log(error);
      });

  }

  /***
   * Set country to the PolicyDto
   */
  getCountryPolicy(policyDto: PolicyDto) {
    this.commonService.getCountryById(policyDto.policyCountryId).subscribe(
      country => {
        policyDto.policyCountryObject = country;
      },
      error => {
        console.error(error);
      }
    );
  }

  /***
   * Save memberId when user is Holder
   */
  saveMemberIdHolder(members: MemberOutputDto[]) {
    if (Number(this.user.role_id) === Rol.POLICY_HOLDER
      || Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) {
      this.getControl(this.MEMBER_INFORMATION, this.POLICY_NUMBER).disable();
      this.wizard.holderMemberId = members.filter(member => member.relationTypeId === RelationType.OWNER)[0].memberId;
    }
  }

  /***
   * Evaluated type error
   */
  private handlePolicyError(error: any) {
    if (error.status === 404) {
      this.showMessageError();
    }
    if (error.error.code === 'BE_015') {
      this.showMessageErrorBusiness(error.error.code);
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
   * If error is Not Found = 404
   */
  async showMessageErrorBusiness(cod: string) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.${cod}`).subscribe(
      result => message = result
    );
    this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.TITLE`).subscribe(
      result => messageTitle = result
    );

    if (!this.showInputPolicyNumber) {
      const result1 = await this.notification.showDialog(messageTitle, message);
      if (result1) {
        this.goToHome();
      }
    } else {
      this.notification.showDialog(messageTitle, message);
    }
  }

  /***
   * Get all countries
   */
  getCountries() {
    this.subCountries = this.commonService.getCountries().subscribe(
      countries => {
        this.countries = countries;
        if (Number(this.user.role_id) !== Rol.PROVIDER) {
          if (!this.getControl(this.MEMBER_INFORMATION, 'country').value) {
            const country = (countries).filter(c => c.isoAlpha === this.user.cc)[0];
            this.getControl(this.MEMBER_INFORMATION, 'country').setValue(country);
          }
        }
      },
      error => console.log(error)
    );
  }

  /***
   * Search member when user is Holder
   */
  isHolder() {
    if ((Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) ||
      (Number(this.user.role_id) === Rol.POLICY_HOLDER)) {
      this.getControl(this.MEMBER_INFORMATION, this.POLICY_NUMBER).setValue(this.user.user_key);
      this.getControl(this.MEMBER_INFORMATION, this.SEARCH_TYPE_CTRL).setValue(this.SEARCH_TYPE_POLICY_ID);
      this.wizard.preAuthForm.updateValueAndValidity();
      if (!this.wizard.member) {
        this.searchPolicyDetail();
      }
      this.showInputPolicyNumber = false;
    }
  }

  /***
   * Go to step 2
   */
  next() {
    if (this.wizard.member
      && (this.wizard.preAuthForm.get(this.MEMBER_INFORMATION).valid)
      && (this.wizard.preAuthForm.get(this.CONTACT_INFORMATION).valid)
      && (this.wizard.preAuthForm.get(this.INFO_PROVIDER_FORM).valid)
      && this.getValueProvider()) {
      this.router.navigate(['claims/pre-authorization/step2']);
    } else {
      this.showValidations = true;
    }
  }

  /***
   * Get Value Provider
   */
  getValueProvider() {
    if (this.isProvider) {
      return (this.getControl(this.MEMBER_INFORMATION, 'provider').value !== '');
    }
    return true;
  }

  /***
   * Validated field valid
   */
  isFieldValid(formGroupName: string, field: string) {
    return !this.wizard.preAuthForm.get(formGroupName).get(field).valid
      && this.wizard.preAuthForm.get(formGroupName).get(field).touched;
  }

  getControl(formGroupName: string, field: string) {
    return this.wizard.preAuthForm.get(formGroupName).get(field) as FormControl;
  }

  /**
  * handleProviderChange
  */
  handleProviderChange(provider) {
    this.wizard.associatedProvider = provider;
    const country = this.countries.filter(c => c.countryId === provider.countryId)[0];
    this.getControl(this.MEMBER_INFORMATION, 'country').setValue(country);
    this.getControl(this.MEMBER_INFORMATION, 'country').disable();
  }

  goToHome() {
    location.href = this.configurationService.returnUrl;
  }

  /**
   * Sets form validations.
   */
  private handleFormInput() {
    if (this.wizard.preAuthForm.untouched) {
      (this.wizard.preAuthForm.get(this.MEMBER_INFORMATION) as FormGroup)
        .addControl(this.SEARCH_TYPE_CTRL, new FormControl('', [Validators.required]));
      this.wizard.preAuthForm.updateValueAndValidity();
    }
  }

  /**
   * Subscribe to value changes.
   */
  valueChanges() {
    if (this.wizard) {
      this.getControl(this.MEMBER_INFORMATION, this.SEARCH_TYPE_CTRL).valueChanges.subscribe(val => {
        if (val) {
          this.wizard.member = null;
          this.wizard.memberSearch = null;
          this.wizard.policyDto = null;
          this.wizard.holderMemberId = null;
          this.getControl(this.MEMBER_INFORMATION, this.POLICY_NUMBER).setValue('');
          this.getControl(this.MEMBER_INFORMATION, this.POLICY_NUMBER).updateValueAndValidity();
          switch (this.getControl(this.MEMBER_INFORMATION, this.SEARCH_TYPE_CTRL).value) {
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
   * Sets the policy search type array.
   */
  getPolicySearchTypesArray() {
    return [
      { value: this.SEARCH_TYPE_POLICY_ID },
      { value: this.SEARCH_TYPE_POLICY_LEGACY }
    ];
  }


}
