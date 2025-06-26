/**
* ProviderBeneficialOwnerDataComponent.ts
*
* @description: This component displays and manages the provider detail profile beneficial owners data option.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/


import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProviderProfileDetailWizardService } from '../../../provider-profile-detail-wizard/provider-profile-detail-wizard.service';
import { ProviderProfileDetailWizardDto } from '../../../provider-profile-detail-wizard/entities/providerProfileDetailWizard.dto';
import { BeneficialOwnerTempDto } from '../../../provider-profile-detail-wizard/entities/beneficialOwnerTemp.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common/common.service';


/**
 * This component displays and manages the provider detail profile beneficial owners data option.
 */
@Component({
  selector: 'app-provider-beneficial-owner-data',
  templateUrl: './provider-beneficial-owner-data.component.html'
})
export class ProviderBeneficialOwnerDataComponent implements OnInit, OnDestroy {


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

  /**
   * Constant to identify the Step 2 beneficial owners FormGroup.
   */
  private STEP2_FG = 'ownersForm';

  /**
   * Constant to identify the nested FormControl beneficialOwnerKey.
   */
  public OWNER_KEY_CTRL = 'beneficialOwnerKey';

  /**
   * Constant to identify the nested FormControl firstName.
   */
  public FIRST_NAME_CTRL = 'firstName';

  /**
   * Constant to identify the nested FormControl secondName.
   */
  public SECOND_NAME_CTRL = 'secondName';

  /**
   * Constant to identify the nested FormControl firstSurname.
   */
  public FIRST_SUR_NAME_CTRL = 'firstSurname';

  /**
   * Constant to identify the nested FormControl secondSurname.
   */
  public SECOND_SUR_NAME_CTRL = 'secondSurname';

  /**
   * Constant to identify the nested FormControl dateOfBirth.
   */
  public DATE_OF_BIRTH_CTRL = 'dateOfBirth';

  /**
   * Constant to identify the nested FormControl nacionality.
   */
  public NATIONALITY_CTRL = 'nacionality';

  /**
   * Constant to identify the nested FormControl countryOfResidence.
   */
  public COUNTRY_RESIDENCE_CTRL = 'countryOfResidence';

  /**
   * Constant to identify the nested FormControl ownershipSharePercentage.
   */
  public OWNERSHIP_CTRL = 'ownershipSharePercentage';

  /**
   * Output to pass the new beneficial owner created o modificated.
   */
  @Output() newBeneficialOwner = new EventEmitter<BeneficialOwnerTempDto>();

  /**
   * Input to receive the beneficial owner for modificate.
   */
  @Input() EditBeneficialOwner: BeneficialOwnerTempDto;

  /**
   * Boolean for show validations.
   */
  public showValidations = false;

  /**
   * Boolean for show no changes message.
   */
  public showNoChangesMsg = false;

  /**
   * Max date for calendar control.
   */
  public currentMaxDate: Date = new Date();

  /**
   * Subscription countries of service.
   */
  private subCountriesCrm: Subscription;


  /**
   * Constructor Method.
   * @param authService Auth Service Injection.
   * @param router Router Injection.
   * @param translate Translate Service Injection.
   * @param providerProfileDetailWizardService Provider Profile Detail Wizard Service Injection.
   * @param providerDetailService Provider Detail Service Injection.
   * @param commonService Common Service Injection.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private providerProfileDetailWizardService: ProviderProfileDetailWizardService,
    private commonService: CommonService
  ) { }


  /**
   * Initialize the component. Get user information from redux store.
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.providerProfileDetailWizardService.beginProviderProfileDetailWizard(wizard => {
      this.wizard = wizard;
      this.handleForm();
      this.getArrays();
    }, this.user, this.currentStep);
  }

  /**
   * Ends subscription to wizard subject.
   */
  ngOnDestroy() {
    this.newBeneficialOwner = null;
    this.EditBeneficialOwner = null;
    this.wizard.providerProfileForm.removeControl(this.STEP2_FG);
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subCountriesCrm) { this.subCountriesCrm.unsubscribe(); }
  }

  /**
   * Sets the component form and validations.
   */
  private handleForm() {
    if (!this.validateForExists()) {
      this.wizard.providerProfileForm.addControl(
        this.STEP2_FG, new FormGroup({
          beneficialOwnerKey: new FormControl('', []),
          firstName: new FormControl('', [Validators.required]),
          secondName: new FormControl('', []),
          firstSurname: new FormControl('', [Validators.required]),
          secondSurname: new FormControl('', []),
          dateOfBirth: new FormControl('', [Validators.required]),
          nacionality: new FormControl('', [Validators.required]),
          countryOfResidence: new FormControl('', [Validators.required]),
          ownershipSharePercentage: new FormControl('', [Validators.required])
        })
      );
      this.wizard.providerProfileForm.updateValueAndValidity();
      this.getFormGroup(this.STEP2_FG).markAsPristine();
      this.handleFormEditOwner();
    }
  }

  /**
   * Sets the component form and validations if there is a beneficial owner to Edit.
   */
  private handleFormEditOwner() {
    if (this.EditBeneficialOwner) {
      this.getControl(this.OWNER_KEY_CTRL).setValue(this.EditBeneficialOwner.beneficialOwnerKey);
      this.getControl(this.FIRST_NAME_CTRL).setValue(this.EditBeneficialOwner.firstName);
      this.getControl(this.SECOND_NAME_CTRL).setValue(this.EditBeneficialOwner.secondName);
      this.getControl(this.FIRST_SUR_NAME_CTRL).setValue(this.EditBeneficialOwner.firstSurname);
      this.getControl(this.SECOND_SUR_NAME_CTRL).setValue(this.EditBeneficialOwner.secondSurname);
      this.getControl(this.DATE_OF_BIRTH_CTRL).setValue(new Date(this.EditBeneficialOwner.dateOfBirth));
      this.getControl(this.NATIONALITY_CTRL).setValue(this.EditBeneficialOwner.nacionality);
      this.getControl(this.COUNTRY_RESIDENCE_CTRL).setValue(this.EditBeneficialOwner.countryOfResidence);
      this.getControl(this.OWNERSHIP_CTRL).setValue(this.EditBeneficialOwner.ownershipSharePercentage);
      this.wizard.providerProfileForm.updateValueAndValidity();
    }
  }

  /**
   * Gets the selects arrays.
   */
  getArrays() {
    this.getCountriesCrm();
  }

  /***
  * Get countries of service array from crm.
  */
  getCountriesCrm() {
    if (!this.wizard.countries) {
      this.subCountriesCrm = this.commonService.getCountriesCrm().subscribe(
        countries => {
          this.wizard.countries = countries;
        },
        error => console.log(error)
      );
    }
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
    return this.getFormGroup(this.STEP2_FG);
  }

  /**
   * Send the new or edited beneficial owner to parent component.
   * @param cancel Cancel boolean to send null value to parent and cancel edit form.
   */
  sendNewBeneficialOwner(cancel: boolean) {
    if (cancel) {
      this.showValidations = false;
      this.newBeneficialOwner.emit(null);
    } else {
      if (this.getFormGroup(this.STEP2_FG).untouched) {
        this.showNoChangesMsg = true;
      } else {
        this.showNoChangesMsg = false;
        if (this.getFormGroup(this.STEP2_FG).valid) {
          this.showValidations = false;
          this.newBeneficialOwner.emit(this.formatBeneficialOwnersToTemp());
        } else {
          this.showValidations = true;
        }
      }
    }

  }

  /**
   * Format form information to new benficial owner temporary object.
   */
  formatBeneficialOwnersToTemp(): BeneficialOwnerTempDto {
    const item: BeneficialOwnerTempDto = {
      beneficialOwnerKey: this.getControl(this.OWNER_KEY_CTRL).value,
      firstName: this.getControl(this.FIRST_NAME_CTRL).value,
      secondName: this.getControl(this.SECOND_NAME_CTRL).value,
      firstSurname: this.getControl(this.FIRST_SUR_NAME_CTRL).value,
      secondSurname: this.getControl(this.SECOND_SUR_NAME_CTRL).value,
      dateOfBirth: this.getControl(this.DATE_OF_BIRTH_CTRL).value,
      nacionality: this.getControl(this.NATIONALITY_CTRL).value,
      countryOfResidence: this.getControl(this.COUNTRY_RESIDENCE_CTRL).value,
      ownershipSharePercentage: this.getControl(this.OWNERSHIP_CTRL).value
    };
    return item;
  }

}
