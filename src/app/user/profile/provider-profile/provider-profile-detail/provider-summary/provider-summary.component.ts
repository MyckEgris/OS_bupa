/**
* ProviderSummaryComponent.ts
*
* @description: This component displays and manages the provider detail profile summary option.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/


import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProviderProfileDetailWizardService } from '../../provider-profile-detail-wizard/provider-profile-detail-wizard.service';
import { ProviderDetailService } from 'src/app/shared/services/provider-detail/provider-detail.service';
import { ProviderProfileDetailWizardDto } from '../../provider-profile-detail-wizard/entities/providerProfileDetailWizard.dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { ProviderProfileDetailDto } from 'src/app/shared/services/provider-detail/entities/providerProfileDetail.dto';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';


/**
 * This component displays and manages the provider detail profile summary option.
 */
@Component({
  selector: 'app-provider-summary',
  templateUrl: './provider-summary.component.html'
})
export class ProviderSummaryComponent implements OnInit, OnDestroy {


  /**
   * User Authenticated Object.
   */
  public user: UserInformationModel;

  /**
   * Subscription.
   */
  private subscription: Subscription;

  /**
   * ProviderProfileDetailWizardDto Object.
   */
  public wizard: ProviderProfileDetailWizardDto;

  /**
   * Constant to identify the ProviderProfileDetailWizardService current step 1.
   */
  public currentStep = 1;

  /***
   * Subscription provider detail.
   */
  private subProviderDetail: Subscription;

  /***
   * Subscription provider detail Patch.
   */
  private subProviderDetailPatch: Subscription;

  /**
   * Constant to identify the Step 1 summary FormGroup.
   */
  private STEP1_FG = 'summaryForm';

  /**
   * Constant to identify the nested FormControl providerKey.
   */
  public PROVIDER_KEY_CTRL = 'providerKey';

  /**
   * Constant to identify the nested FormControl accountName.
   */
  public ACCOUNT_NAME_CTRL = 'accountName';

  /**
   * Constant to identify the nested FormControl aliasForCheck.
   */
  public ALIAS_CTRL = 'aliasForCheck';

  /**
   * Constant to identify the nested FormControl principalLanguage.
   */
  public PPAL_LANG_CTRL = 'principalLanguage';

  /**
   * Constant to identify the nested FormControl documentType.
   */
  public DOC_TYPE_CTRL = 'documentType';

  /**
   * Constant to identify the nested FormControl numberId.
   */
  public NUMBER_ID_CTRL = 'numberId';

  /**
   * Constant to identify the nested FormControl parentAccount.
   */
  public PARENT_ACCOUNT_CTRL = 'parentAccount';

  /**
   * Constant to identify the nested FormControl country.
   */
  public COUNTRY_CTRL = 'country';

  /**
   * Constant to identify the nested FormControl state.
   */
  public STATE_CTRL = 'state';

  /**
   * Constant to identify the nested FormControl city.
   */
  public CITY_CTRL = 'city';

  /**
   * Constant to identify the nested FormControl phone.
   */
  public PHONE_CTRL = 'phone';

  /**
   * Constant to identify the nested FormControl cellPhone.
   */
  public CELLPHONE_CTRL = 'cellPhone';

  /**
   * Constant to identify the nested FormControl email.
   */
  public EMAIL_CTRL = 'email';

  /**
   * Constant to identify the nested FormControl webSiteUrl.
   */
  public WEBSITE_CTRL = 'webSiteUrl';

  /**
   * Boolean for show validations.
   */
  public showValidations = false;

  /**
   * Boolean for show no changes message.
   */
  public showNoChangesMsg = false;

  /***
   * Subscription Countries.
   */
  private subCountries: Subscription;

  /***
   * Subscription Cities.
   */
  private subCities: Subscription;

  /***
   * Subscription States.
   */
  private subStates: Subscription;

  /***
   * Subscription Languages.
   */
  private subLanguages: Subscription;

  /***
   * Constants for the save provider information request message.
   */
  private SAVE_MSG_TITLE = 'USER.PROFILEVIEW.PROVIDER_PROFILE_DETAIL.SUMMARY.SECTION1_TITLE';
  private SAVE_SUCCESS_MSG = 'USER.PROFILEVIEW.PROVIDER_PROFILE_DETAIL.SAVE_SUCCESS_MSG';
  private SAVE_ERROR_MSG = 'USER.PROFILEVIEW.PROVIDER_PROFILE_DETAIL.SAVE_ERROR_MSG';
  private SAVE_MSG_OK_BTN = 'APP.BUTTON.CONTINUE_BTN';


  /**
   * Constructor Method.
   * @param authService Auth Service Injection.
   * @param router Router Injection.
   * @param translate Translate Service Injection.
   * @param providerProfileDetailWizardService Provider Profile Detail Wizard Service Injection.
   * @param providerDetailService Provider Detail Service Injection.
   * @param commonService Common Service Injection.
   * @param translationService translation Service  Injection.
   * @param notification Notification Service Injection.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private providerProfileDetailWizardService: ProviderProfileDetailWizardService,
    private providerDetailService: ProviderDetailService,
    private commonService: CommonService,
    private translationService: TranslationService,
    private notification: NotificationService
  ) { }


  /**
   * Initialize the component. Get user information from redux store.
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.providerProfileDetailWizardService.beginProviderProfileDetailWizard(wizard => {
      this.wizard = wizard;
      this.getProviderProfileDetail();
      this.getArrays();
    }, this.user, this.currentStep);
  }

  /**
   * Ends subscription to wizard subject.
   */
  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subProviderDetail) { this.subProviderDetail.unsubscribe(); }
    if (this.subProviderDetailPatch) { this.subProviderDetailPatch.unsubscribe(); }
    if (this.subCountries) { this.subCountries.unsubscribe(); }
    if (this.subCities) { this.subCities.unsubscribe(); }
    if (this.subStates) { this.subStates.unsubscribe(); }
    if (this.subLanguages) { this.subLanguages.unsubscribe(); }
  }

  /**
   * Gets the provider profile detail information from crm.
   */
  getProviderProfileDetail() {
    if (!this.wizard.providerProfileDetailInfo) {
      this.wizard.providerProfileDetailInfo = null;
      this.subProviderDetail = this.providerDetailService.getProviderProfileDetailByProviderKey(
        this.user.user_key_alternative
      ).subscribe(data => {
        this.wizard.providerProfileDetailInfo = data;
        this.handleForm();
        this.valueChanges();
      }, error => {
        this.wizard.providerProfileDetailInfo = null;
        console.log(error);
      });
    }
  }

  /**
   * Sets the component form and validations.
   */
  private handleForm() {
    if (!this.validateForExists() && this.wizard.providerProfileDetailInfo) {
      const prov: ProviderProfileDetailDto = this.wizard.providerProfileDetailInfo;
      this.wizard.providerProfileForm.addControl(
        this.STEP1_FG, new FormGroup({
          providerKey: new FormControl({ value: '', disabled: true }, []),
          accountName: new FormControl({ value: '', disabled: true }, [Validators.required]),
          aliasForCheck: new FormControl({ value: '', disabled: true }, [Validators.required]),
          principalLanguage: new FormControl({ value: '', disabled: false }, [Validators.required]),
          documentType: new FormControl({ value: '', disabled: true }, []),
          numberId: new FormControl({ value: '', disabled: true }, []),
          parentAccount: new FormControl({ value: '', disabled: true }, []),
          country: new FormControl({ value: '', disabled: true }, [Validators.required]),
          state: new FormControl({ value: '', disabled: true }, []),
          city: new FormControl({ value: '', disabled: true }, [Validators.required]),
          phone: new FormControl({ value: '', disabled: false }, [Validators.required]),
          cellPhone: new FormControl({ value: '', disabled: false }, [Validators.required]),
          email: new FormControl({ value: '', disabled: false }, [CustomValidator.emailPatternValidator]),
          webSiteUrl: new FormControl({ value: '', disabled: false }, [])
        })
      );
      this.wizard.providerProfileForm.updateValueAndValidity();
      this.handleFormSetValues(prov);
    }
  }

  /**
   * Sets the component form values whit provider information.
   * @param prov Provider information object.
   */
  private handleFormSetValues(prov: ProviderProfileDetailDto) {
    this.getControl(this.PROVIDER_KEY_CTRL).setValue(this.validateNullValue(prov.providerKey));
    this.getControl(this.ACCOUNT_NAME_CTRL).setValue(this.validateNullValue(prov.accountName));
    this.getControl(this.ALIAS_CTRL).setValue(this.validateNullValue(prov.aliasForCheck));
    this.getControl(this.PPAL_LANG_CTRL).setValue(this.validateNullValue(prov.principalLanguage));
    this.getControl(this.DOC_TYPE_CTRL).setValue(this.validateNullValue(prov.documentType));
    this.getControl(this.NUMBER_ID_CTRL).setValue(this.validateNullValue(prov.documentTaxId));
    this.getControl(this.PARENT_ACCOUNT_CTRL).setValue(this.validateNullValue(
      prov.parentProviderAccount ? prov.parentProviderAccount.accountName : ''));
    this.getControl(this.COUNTRY_CTRL).setValue(this.validateNullValue(prov.country));
    this.getControl(this.STATE_CTRL).setValue(this.validateNullValue(prov.state));
    this.getControl(this.CITY_CTRL).setValue(this.validateNullValue(prov.city));
    this.getControl(this.PHONE_CTRL).setValue(this.validateNullValue(prov.phone));
    this.getControl(this.CELLPHONE_CTRL).setValue(this.validateNullValue(prov.cellPhone));
    this.getControl(this.EMAIL_CTRL).setValue(this.validateNullValue(prov.email));
    this.getControl(this.WEBSITE_CTRL).setValue(this.validateNullValue(prov.webSiteUrl));
    this.wizard.providerProfileForm.updateValueAndValidity();
  }

  /**
   * Get nested form controls.
   * @param field Field.
   */
  public getControl(field: string): FormControl {
    if (this.validateForExists()) {
      return this.wizard.providerProfileForm.get(this.STEP1_FG).get(field) as FormControl;
    }
  }

  /**
   * Get nested form groups.
   * @param section Section.
   */
  public getFormGroup(section: string): FormGroup {
    return this.wizard.providerProfileForm.get(section) as FormGroup;
  }

  /**
   * Validates if the form group exists.
   */
  validateForExists() {
    return this.getFormGroup(this.STEP1_FG);
  }

  /**
   * Validates if the value is empty and assign it to null.
   * @param value Value.
   */
  validateNullValue(value: any) {
    if (!value || value === '' || value === undefined) {
      const newValue = '';
      return newValue;
    } else { return value; }
  }

  /**
   * Gets the selects arrays.
   */
  getArrays() {
    this.getCountriesCrm();
    this.getLanguagesCrm();
  }

  /***
  * Get countries of service array from crm.
  */
  getCountriesCrm() {
    if (!this.wizard.countries) {
      this.subCountries = this.commonService.getCountriesCrm().subscribe(
        countries => {
          this.wizard.countries = countries;
        },
        error => console.log(error)
      );
    }
  }

  /***
  * Get all countries.
  */
  getCities() {
    if (this.getControl(this.COUNTRY_CTRL).value) {
      this.subCities = this.commonService.getCitiesByCountry(this.getControl(this.COUNTRY_CTRL).value.countryId).subscribe(
        cities => {
          this.wizard.cities = cities;
        },
        error => console.log(error)
      );
    }
  }

  /***
    * Get all countries filtering by bussinessId.
    */
  getStates() {
    if (this.getControl(this.COUNTRY_CTRL).value) {
      this.subStates = this.commonService.getStatesByCountry(this.getControl(this.COUNTRY_CTRL).value.countryId).subscribe(
        states => {
          this.wizard.states = states;
        },
        error => console.log(error)
      );
    }
  }

  /***
   * Get Languages array from crm.
   */
  getLanguagesCrm() {
    if (!this.wizard.languages) {
      this.subLanguages = this.commonService.getLanguagesCrm().subscribe(
        lang => {
          this.wizard.languages = lang;
        },
        error => console.log(error)
      );
    }
  }


  /**
   * Subscribe to value changes.
   */
  valueChanges() {
    if (this.validateForExists()) {
      this.getControl(this.COUNTRY_CTRL).valueChanges.subscribe(val => {
        if (val) {
          // this.getCities();
          // this.getStates();
        }
      });
    }
  }

  /**
   * Save the user changes on crm.
   */
  save() {
    if (this.getFormGroup(this.STEP1_FG).pristine && this.getFormGroup(this.STEP1_FG).untouched) {
      this.showNoChangesMsg = true;
    } else {
      this.showNoChangesMsg = false;
      if (this.getFormGroup(this.STEP1_FG).valid) {
        this.showValidations = false;
        this.formatProviderSendingObject();
      } else {
        this.showValidations = true;
      }
    }
  }

  /**
   * Format the provider sengind object whit the edited values.
   */
  formatProviderSendingObject() {
    this.wizard.providerProfileDetailInfo.providerKey = this.getControl(this.PROVIDER_KEY_CTRL).value;
    this.wizard.providerProfileDetailInfo.accountName = this.getControl(this.ACCOUNT_NAME_CTRL).value;
    this.wizard.providerProfileDetailInfo.aliasForCheck = this.getControl(this.ALIAS_CTRL).value;
    this.wizard.providerProfileDetailInfo.principalLanguage = this.getControl(this.PPAL_LANG_CTRL).value;
    this.wizard.providerProfileDetailInfo.languageKey = this.getControl(this.PPAL_LANG_CTRL).value.languageKey;
    this.wizard.providerProfileDetailInfo.documentType = this.getControl(this.DOC_TYPE_CTRL).value;
    this.wizard.providerProfileDetailInfo.documentTypeKey = this.getControl(this.DOC_TYPE_CTRL).value.documentTypeKey;
    this.wizard.providerProfileDetailInfo.documentTaxId = this.getControl(this.NUMBER_ID_CTRL).value;
    if (this.wizard.providerProfileDetailInfo.parentProviderAccount != null) {
      this.wizard.providerProfileDetailInfo.parentProviderAccount.accountName = this.getControl(this.PARENT_ACCOUNT_CTRL).value;
    }
    this.wizard.providerProfileDetailInfo.country = this.getControl(this.COUNTRY_CTRL).value;
    this.wizard.providerProfileDetailInfo.countryKey = this.getControl(this.COUNTRY_CTRL).value.countryKey;
    this.wizard.providerProfileDetailInfo.state = this.getControl(this.STATE_CTRL).value;
    this.wizard.providerProfileDetailInfo.stateKey = this.getControl(this.STATE_CTRL).value.stateKey;
    this.wizard.providerProfileDetailInfo.city = this.getControl(this.CITY_CTRL).value;
    this.wizard.providerProfileDetailInfo.cityKey = this.getControl(this.CITY_CTRL).value.cityKey;
    this.wizard.providerProfileDetailInfo.phone = this.getControl(this.PHONE_CTRL).value;
    this.wizard.providerProfileDetailInfo.cellPhone = this.getControl(this.CELLPHONE_CTRL).value;
    this.wizard.providerProfileDetailInfo.email = this.getControl(this.EMAIL_CTRL).value;
    this.wizard.providerProfileDetailInfo.webSiteUrl = this.getControl(this.WEBSITE_CTRL).value;
    this.saveProviderInformationChanges();
  }

  /**
   * Save the edited provider detail information to crm.
   */
  saveProviderInformationChanges() {
    if (this.wizard.providerProfileDetailInfo) {
      this.subProviderDetailPatch = this.providerDetailService.patchProviderProfileDetail(
        this.user.user_key_alternative,
        this.wizard.providerProfileDetailInfo,
        this.translationService.getLanguage()
      ).subscribe(data => {
        this.showSaveMsg(false);
        this.wizard.providerProfileDetailInfo = null;
        this.getProviderProfileDetail();
      }, error => {
        this.showSaveMsg(true);
        console.log(error);
      });
    }
  }

  /**
   * Show the save message.
   * @param errror Has error.
   */
  showSaveMsg(error: boolean) {
    let message = '';
    let messageKey = '';
    let messageTitle = '';
    let okBtn = '';

    if (error) {
      messageKey = this.SAVE_ERROR_MSG;
    } else {
      messageKey = this.SAVE_SUCCESS_MSG;
    }

    this.translate.get(messageKey.toString()).subscribe(
      result => message = result
    );
    this.translate.get(this.SAVE_MSG_TITLE).subscribe(
      result => messageTitle = result
    );
    this.translate.get(this.SAVE_MSG_OK_BTN).subscribe(
      result => okBtn = result
    );

    this.notification.showDialog(messageTitle, message, false, okBtn);
  }


}
