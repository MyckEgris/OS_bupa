/**
* ProviderBeneficialOwnerComponent.ts
*
* @description: This component displays and manages the provider detail profile beneficial owners option.
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
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BeneficialOwnerTempDto } from '../../provider-profile-detail-wizard/entities/beneficialOwnerTemp.dto';
import { BeneficialOwnerDto } from 'src/app/shared/services/provider-detail/entities/beneficialOwner.dto';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';


/**
 * This component displays and manages the provider detail profile beneficial owners option.
 */
@Component({
  selector: 'app-provider-beneficial-owner',
  templateUrl: './provider-beneficial-owner.component.html'
})
export class ProviderBeneficialOwnerComponent implements OnInit, OnDestroy {


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
  public currentStep = 2;

  /***
   * Subscription provider detail.
   */
  private subProviderDetail: Subscription;

  /***
   * Subscription provider detail Patch.
   */
  private subProviderDetailPatch: Subscription;

  /**
   * Constant to identify the Step 2 beneficial owners FormGroup.
   */
  private STEP2_FG = 'ownersFormArray';

  /**
  * Boolean for show new beneficial owner form.
  */
  public showNewBeneficialOwnerForm = false;

  /**
   * Object for save the edit beneficial owner information.
   */
  public editBeneficialOwner: BeneficialOwnerTempDto;

  /***
   * Constants for the save provider information request message.
   */
  private SAVE_MSG_TITLE = 'USER.PROFILEVIEW.PROVIDER_PROFILE_DETAIL.OWNERS.SECTION2_TITLE';
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
   * @param translationService translation Service  Injection.
   * @param notification Notification Service Injection.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private providerProfileDetailWizardService: ProviderProfileDetailWizardService,
    private providerDetailService: ProviderDetailService,
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
    }, this.user, this.currentStep);
  }

  /**
   * Ends subscription to wizard subject.
   */
  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subProviderDetailPatch) { this.subProviderDetailPatch.unsubscribe(); }
    if (this.subProviderDetail) { this.subProviderDetail.unsubscribe(); }
  }

  /**
   * Gets the provider profile detail information from crm.
   */
  getProviderProfileDetail() {
    if (!this.wizard.providerProfileDetailInfo || !this.wizard.benefitialOwnerList) {
      this.wizard.providerProfileDetailInfo = null;
      this.subProviderDetail = this.providerDetailService.getProviderProfileDetailByProviderKey(
        this.user.user_key_alternative
      ).subscribe(data => {
        this.wizard.providerProfileDetailInfo = data;
        this.handleForm();
        this.formatBeneficialOwnersListToTemp();
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
    this.wizard.benefitialOwnerList = [];
  }

  /**
   * Get nested form controls.
   * @param field Field.
   */
  public getControl(field: string): FormControl {
    if (this.validateForExists()) {
      return this.wizard.providerProfileForm.get(this.STEP2_FG).get(field) as FormControl;
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
    return this.wizard.providerProfileForm.get(this.STEP2_FG);
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
   * Save the user changes on crm.
   */
  save() {
    this.formatProviderSendingObject();
  }

  /**
   * Format beneficial owners list to temporary object format.
   */
  formatBeneficialOwnersListToTemp() {
    if (this.wizard.benefitialOwnerList.length < 1) {
      const ownersList = this.wizard.providerProfileDetailInfo.beneficialOwners;
      ownersList.forEach(
        element => {
          const item: BeneficialOwnerTempDto = {
            beneficialOwnerKey: this.validateNullValue(element.beneficialOwnerKey),
            firstName: this.validateNullValue(element.firstName),
            secondName: this.validateNullValue(element.secondName),
            firstSurname: this.validateNullValue(element.firstSurname),
            secondSurname: this.validateNullValue(element.secondSurname),
            dateOfBirth: this.validateNullValue(element.dateOfBirth),
            nacionality: this.validateNullValue(element.nacionality),
            countryOfResidence: this.validateNullValue(element.countryOfResidence),
            ownershipSharePercentage: this.validateNullValue(element.ownershipSharePercentage)
          };
          this.wizard.benefitialOwnerList.push(item);
        });
    }
  }

  /**
   * Handle the create new or edit beneficial owner form and display.
   */
  addOrEditNewBeneficialOwner(benefitialOwner?: BeneficialOwnerTempDto) {
    if (benefitialOwner) {
      this.editBeneficialOwner = benefitialOwner;
    } else {
      this.editBeneficialOwner = null;
    }

    if (this.validateForExists()) {
      this.wizard.providerProfileForm.removeControl(this.STEP2_FG);
      this.wizard.providerProfileForm.updateValueAndValidity();
    }

    window.scroll(0, 0);
    this.showNewBeneficialOwnerForm = true;
  }

  /**
   * Gets the new or edited beneficial owner from form event emit and push to array.
   */
  getNewOwner(newBeneficialOwner: BeneficialOwnerTempDto) {
    if (newBeneficialOwner) {
      if (this.editBeneficialOwner) {
        const index = this.wizard.benefitialOwnerList.indexOf(this.editBeneficialOwner);
        this.wizard.benefitialOwnerList.splice(index, 1);
      }
      this.wizard.benefitialOwnerList.push(newBeneficialOwner);
      this.editBeneficialOwner = null;
      this.showNewBeneficialOwnerForm = false;
    } else {
      this.editBeneficialOwner = null;

      this.showNewBeneficialOwnerForm = false;
    }
  }

  /**
   * Format the provider sengind object whit the edited values.
   */
  formatProviderSendingObject() {
    let newOwnersArray: BeneficialOwnerDto[] = [];

    this.wizard.benefitialOwnerList.forEach(
      element => {
        const item: BeneficialOwnerDto = {
          beneficialOwnerKey: element.beneficialOwnerKey,
          firstName: element.firstName,
          secondName: element.secondName,
          firstSurname: element.firstSurname,
          secondSurname: element.secondSurname,
          dateOfBirth: element.dateOfBirth,
          nacionality: element.nacionality,
          nacionalityCountryKey: element.countryOfResidence.countryKey,
          countryOfResidence: element.countryOfResidence,
          countryOfResidenceKey: element.countryOfResidence.countryKey,
          ownershipSharePercentage: element.ownershipSharePercentage,

        };
        newOwnersArray.push(item);
      });

    this.wizard.providerProfileDetailInfo.beneficialOwners = newOwnersArray;
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
