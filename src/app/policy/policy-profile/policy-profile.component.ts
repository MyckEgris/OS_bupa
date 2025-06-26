/**
* PolicyHolderProfileViewComponent.ts
*
* @description: This component shows the proper information for policy holders and allow them to edit it
* @author Andres Tamayo
* @version 1.0
* @date 06-06-2019.
*
**/
import { Store, select } from '@ngrx/store';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { UserInformationModel } from 'src/app/security/model/user-information.model';

import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { PhoneOutputDto } from 'src/app/shared/services/policy/entities/phone.dto';
import { AddressOutputDto } from 'src/app/shared/services/policy/entities/address.dto';
import { EmailOutputDto } from 'src/app/shared/services/policy/entities/email.dto';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { City } from 'src/app/shared/services/common/entities/city';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { Utilities } from 'src/app/shared/util/utilities';
import { PolicyChangeDto } from 'src/app/shared/services/policy/entities/policyChangeType.dto';
import { ChangeMetadataDto } from 'src/app/shared/services/policy/entities/changeMetadata.dto';
import { UpdatePolicyRequestDto } from 'src/app/shared/services/policy/entities/updatePolicyRequest.dto';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { Colony } from 'src/app/shared/services/common/entities/colony.dto';
import { MunicipalityDto } from 'src/app/shared/services/common/entities/municipality.dto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-policy-profile',
  templateUrl: './policy-profile.component.html'
})
export class PolicyProfileComponent implements OnInit {

  /**
   * Policy input data transfer object.
   */
  @Input() policyDto: PolicyDto;

  /**
   * Event that will be sent in order to update policy holder's profile.
   */
  @Output()
  policyResponse = new EventEmitter();

  /**
   * User information that is storaged inside redux' storage-
   */
  user: UserInformationModel;

  /**
   * Policy Member's instance.
   */
  policyHolder: MemberOutputDto;

  /**
   * Policy instnace.
   */
  policy: PolicyDto;

  /**
   * Policy Information instance.
   */
  policyInfo: PolicyDto;

  /**
   * Policy's country instance.
   */
  countries: Country[] = [];

  /**
   * Policy's homePhone intance.
   */
  public homePhone: PhoneOutputDto;

  /**
   Policy's office phone instance.
   */
  public officePhone: PhoneOutputDto;

  /**
   * Policy's faxphone instnace.
   */
  public faxPhone: PhoneOutputDto;
  /**
   * Policy's phisical address instance.
   */
  public phisicalAddress: AddressOutputDto;
  /**
   * Policy's postal address instance.
   */
  public postalAddress: AddressOutputDto;
  /**
   * Policy's email owner instance.
   */
  public emailOwner: EmailOutputDto;

  /**
   * Property that will reference the Policy Owner's preferred e-mail.
   */
  public mailShow: string;

  /**
   * Property that will reference the Policy Address' zip code.
   */
  public zipCode = '';

  /**
   * Minimun date on input.
   */
  public minDate: Date = new Date('1900/01/01');

  /**
   * Maximum date for input.
   */
  public maxDate = new Date();

  /**
   * Current DOB loaded from bd.
   */
  public currentDate: Date;

  /**
   * Phisical Address' Cities.
  */
  public phisicalAddressCities: City[];

  /**
   * Mailing Address' Cities.
   */
  public mailingAddressCities: City[];

  /**
   * Mailing Address' Cities.
   */
  public cities: City[];

  /**
   * Current city.
   */
  public city: City;

  /**
   * Property that will help to disable the 'Update buttom' if country is Mexico.
   */
  public isMexico = false;

  /**
   * Property that will help to disable the 'Update buttom' if country is Mexico.
   */
  public isMexicoCountry = false;

  /**
   * Mexico Country Identifier.
   */
  private MEXICO_COUNTRY_ID = 13;

  private mexicoBupaInsurance = 41;

  /**
   * Effective Date's miminal value.
   */
  public fromDateChangeMinValue = Utilities.getDateNow();

  /**
   * Effective Date's current value.
   */
  public fromDateChangeCurrentValue = Utilities.getDateNow();

  /**
   * Effective Date's sending by the user.
   */
  public toDateChangeCurrentValue = Utilities.getDateNow();

  /**
   * Effective Date's minimal value.
   */
  public toDateChangeMinValue = Utilities.getDateNow();

  /***
   * Max chars allowed field email/state
   */
  public MAX_CHARS_ALLOWED_EMAIL = 150;
  public MAX_CHARS_ALLOWED_STATE = 100;
  public MAX_CHARS_ALLOWED_PHONE = 50;

  /***
   * List Colonies
   */
  public colonies: Colony[];

  /***
   * List Colonies
   */
  public municipalities: MunicipalityDto[];

  showValidations = false;

  formPolicyProfile = new FormGroup({
    'name': new FormControl({ value: '', disabled: true }),
    'lastName': new FormControl({ value: '', disabled: true }),
    'DOB': new FormControl({ value: '', disabled: true }),
    'Addresses': new FormGroup({
      Home: new FormGroup({
        addressLine: new FormControl({ value: '', disabled: true }),
        city: new FormControl({ value: '', disabled: true }),
        cityId: new FormControl({ value: '', disabled: true }),
        state: new FormControl({ value: '', disabled: true }),
        zipCode: new FormControl({ value: '', disabled: true }),
        countryId: new FormControl({ value: '', disabled: true }),
        addressTypeId: new FormControl({ value: '', disabled: true }),
        type: new FormControl({ value: '', disabled: true }),
        fromDate: new FormControl({ value: '', disabled: true }),
        toDate: new FormControl({ value: '', disabled: true })
      }),
      Postal: new FormGroup({
        addressLine: new FormControl('', [Validators.maxLength(this.MAX_CHARS_ALLOWED_EMAIL)]),
        city: new FormControl(),
        cityId: new FormControl(),
        state: new FormControl('', [Validators.maxLength(this.MAX_CHARS_ALLOWED_STATE)]),
        zipCode: new FormControl(),
        countryId: new FormControl(),
        addressTypeId: new FormControl(),
        type: new FormControl(),
        fromDate: new FormControl(),
        toDate: new FormControl(),
        municipality: new FormControl(),
        colonyId: new FormControl(),
        interior: new FormControl(),
        exterior: new FormControl()
      })
    }),
    'Phones': new FormGroup({
      Home: new FormGroup({
        phoneNumber: new FormControl(),
        type: new FormControl(),
        phoneTypeId: new FormControl(),
        countryId: new FormControl(),
        ext: new FormControl()
      }),
      Office: new FormGroup({
        phoneNumber: new FormControl(),
        type: new FormControl(),
        phoneTypeId: new FormControl(),
        countryId: new FormControl(),
        ext: new FormControl()
      }),
      Fax: new FormGroup({
        phoneNumber: new FormControl(),
        type: new FormControl(),
        phoneTypeId: new FormControl(),
        countryId: new FormControl(),
        ext: new FormControl()
      }),
    }),

    'mailShow': new FormControl(''),

  });

  /**
   * Policy Profile's constructor.
   * @param userInfoStore inyect store reducre information
   * @param _route ActivatedRoute
   */
  constructor(
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private _route: ActivatedRoute,
    private _commonService: CommonService,
    private notification: NotificationService,
    private translate: TranslateService,
  ) {
    this.policy = this._route.snapshot.data['policyInfo'].policyInfo;
  }

  /**
   * Policy Profile's ngOnInit life cycle.
   */
  ngOnInit() {
    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.user = userInfo;
    });
    this.isInsuranceBussinesMexico();
    this.getCountries();
  }

  changeCountry(event) {
    this.getMailingAddressCities(event.target.value);
    this.clearFilds();
    this.setIsCountryMexico(event.target.value);
  }

  /**
   * Prepares initial values for phones and addrress.
   */
  private loadPolicyHolderValues() {
    const members = this.policy.members;

    this.policyHolder = members.filter(membersF => membersF.relationTypeId === 2)[0];

    if (!this.policyHolder) {
      this.policyHolder = members.filter(membersF => membersF.relationTypeId === 5)[0];
    }

    if (this.policy.phones) {
      this.homePhone = this.policy.phones.filter(phonesF => phonesF.phoneTypeId === 1000)[0];
      this.officePhone = this.policy.phones.filter(phonesF => phonesF.phoneTypeId === 1001)[0];
      this.faxPhone = this.policy.phones.filter(phonesF => phonesF.phoneTypeId === 1005)[0];
    }
    if (this.policy.addresses) {
      this.phisicalAddress = this.policy.addresses.filter(addresses => addresses.addressTypeId === 2)[0];
      if (this.phisicalAddress) {
        this.getPhisicalAddressCities(this.phisicalAddress.countryId);
      }

      this.postalAddress = this.policy.addresses.filter(addresses => addresses.addressTypeId === 1)[0];

      if (this.postalAddress !== undefined) {
        this.getMailingAddressCities(this.postalAddress.countryId);
        this.zipCode = this.postalAddress.zipCode;
      }
    }
    if (this.policy.emails && this.policy.emails.length > 0) {
      this.emailOwner = this.policy.emails.filter(emailsF => emailsF.emailTypeId === 1)[0];
      if (this.emailOwner) {
        this.mailShow = this.emailOwner.eMailAddress;
      }
    }

    this.loadInitialValues();
  }

  /**
   * Loads initial values on form.
  */
  private loadInitialValues() {
    this.currentDate = new Date(this.policyHolder.dob);
    if (!this.postalAddress === undefined) {
      if (!this.postalAddress.fromDate) {
        this.fromDateChangeMinValue = Utilities.getDateNow();
      } else {
        this.fromDateChangeMinValue = new Date(this.postalAddress.fromDate);
        this.fromDateChangeCurrentValue = this.fromDateChangeMinValue;
      }

      if (!this.postalAddress.toDate) {
        this.toDateChangeCurrentValue = Utilities.getDateNow();
      } else {
        this.toDateChangeCurrentValue = new Date(this.postalAddress.toDate);
        this.toDateChangeMinValue = this.toDateChangeCurrentValue;
      }
    }

    this.formPolicyProfile.setValue({
      name: this.policyHolder.firstName,
      lastName: this.policyHolder.lastName,
      DOB: new Date(this.policyHolder.dob),
      Phones: {
        Home: {
         phoneNumber: (this.homePhone === undefined) ? '' : this.homePhone.phoneNumber,
         type: 'home',
         phoneTypeId: (this.homePhone === undefined) ? 1000 : this.homePhone.phoneTypeId,
         countryId: (this.homePhone === undefined || this.homePhone.countryId === 0) ?
              this.countries.filter(x => x.isoAlpha === this.user.cc)[0].countryId
         : this.homePhone.countryId,
         ext: (this.homePhone === undefined) ? '' : this.homePhone.ext
        },
        Office: {
          phoneNumber: (this.officePhone === undefined) ? '' : this.officePhone.phoneNumber,
          type: 'office',
          phoneTypeId: (this.officePhone === undefined) ? 1001 : this.officePhone.phoneTypeId,
          countryId: (this.officePhone === undefined || this.officePhone.countryId === 0) ?
                this.countries.filter(x => x.isoAlpha === this.user.cc)[0].countryId
          : this.officePhone.countryId,
          ext: (this.officePhone === undefined) ? '' : this.officePhone.ext
        },
        Fax: {
          phoneNumber: (this.faxPhone === undefined) ? '' : this.faxPhone.phoneNumber,
          type: 'fax',
          phoneTypeId: (this.faxPhone === undefined) ? 1005 : this.faxPhone.phoneTypeId,
          countryId: (this.faxPhone === undefined || this.faxPhone.countryId === 0) ?
              this.countries.filter(x => x.isoAlpha === this.user.cc)[0].countryId
          : this.faxPhone.countryId,
          ext: (this.faxPhone === undefined) ? '' : this.faxPhone.ext
        }
      },
      Addresses: {
        Home: {
          addressLine: (this.phisicalAddress === undefined) ? '' : this.phisicalAddress.addressLine,
          city: (this.phisicalAddress === undefined) ? '' : this.phisicalAddress.city,
          cityId: (this.phisicalAddress === undefined || (!this.phisicalAddress.cityId)) ? '' : this.phisicalAddress.cityId,
          state: (this.phisicalAddress === undefined) ? '' : this.phisicalAddress.state,
          zipCode: (this.phisicalAddress === undefined) ? '' : this.phisicalAddress.zipCode,
          countryId: (this.phisicalAddress === undefined) ? this.countries.filter(x => x.isoAlpha === this.user.cc)[0].countryId
            : this.phisicalAddress.countryId,
          addressTypeId: (this.phisicalAddress === undefined) ? '' : this.phisicalAddress.addressTypeId,
          fromDate: (this.phisicalAddress === undefined || (!this.phisicalAddress.fromDate)) ?
                      Utilities.getDateNow() : this.phisicalAddress.fromDate,
          toDate: (this.phisicalAddress === undefined || (!this.phisicalAddress.toDate)) ?
                Utilities.getDateNow() : this.phisicalAddress.toDate,
          type: 'Physical',
        },
        Postal: {
          addressLine: (this.postalAddress === undefined) ? '' : this.postalAddress.addressLine,
          city: (this.postalAddress === undefined) ? '' : this.postalAddress.city,
          cityId: (this.postalAddress === undefined || (!this.postalAddress.cityId)) ? '' : this.postalAddress.cityId,
          state: (this.postalAddress === undefined) ? '' : this.postalAddress.state,
          zipCode: (this.postalAddress === undefined) ? '' : this.postalAddress.zipCode,
          countryId: (this.postalAddress === undefined) ? this.countries.filter(x => x.isoAlpha === this.user.cc)[0].countryId
            : this.postalAddress.countryId,
          addressTypeId: (this.postalAddress === undefined) ? '' : this.postalAddress.addressTypeId,
          fromDate: (this.postalAddress === undefined) ? null : this.fromDateChangeMinValue,
          toDate: (this.postalAddress === undefined) ? null : this.toDateChangeCurrentValue,
          type: 'Mailing',
          municipality: (this.postalAddress === undefined) ? null : this.postalAddress.municipality,
          colonyId: (this.postalAddress === undefined) ? null : this.postalAddress.colonyId,
          interior: (this.postalAddress === undefined) ? null : this.postalAddress.interior,
          exterior: (this.postalAddress === undefined) ? null : this.postalAddress.exterior
        }
      },
      'mailShow': (this.mailShow === undefined) ? '' : this.mailShow,
    });

    this.setFormValidators();
  }

  getControl(formGroupName: string, formGroupNameSecund: string): FormGroup {
    return this.formPolicyProfile.get(formGroupName).get(formGroupNameSecund) as FormGroup;
  }

  /**
   * Sets Form's validators.
   */
  private setFormValidators() {
    this.formPolicyProfile.get('Addresses').get('Postal').get('addressLine').
      setValidators([Validators.maxLength(this.MAX_CHARS_ALLOWED_EMAIL), Validators.required]);
    this.formPolicyProfile.get('Addresses').get('Postal').get('state').
      setValidators([Validators.maxLength(this.MAX_CHARS_ALLOWED_STATE)]);
    this.formPolicyProfile.get('Addresses').get('Postal').get('zipCode').
      setValidators([Validators.maxLength(this.MAX_CHARS_ALLOWED_PHONE)]);
    this.formPolicyProfile.get('Phones').get('Home').get('phoneNumber').
      setValidators([Validators.maxLength(this.MAX_CHARS_ALLOWED_PHONE)]);
    this.formPolicyProfile.get('Phones').get('Office').get('phoneNumber').
      setValidators([Validators.maxLength(this.MAX_CHARS_ALLOWED_PHONE)]);
    this.formPolicyProfile.get('Phones').get('Fax').get('phoneNumber').
      setValidators([Validators.maxLength(this.MAX_CHARS_ALLOWED_PHONE)]);
    this.formPolicyProfile.get('mailShow')
      .setValidators([Validators.maxLength(this.MAX_CHARS_ALLOWED_EMAIL), CustomValidator.emailPatternValidator]);

    this.setIsCountryMexico(this.getControl('Addresses', 'Postal').get('countryId').value);
    this.loadColonyNamePhysicalAddress();
  }

  loadColonyNamePhysicalAddress(): void {
    if (this.phisicalAddress && this.phisicalAddress.zipCode) {
      this.getColoniesByZipCode(this.phisicalAddress.zipCode, 1);
    }
  }

  /****
   * Validate InsuranceBussines Mexico
   */
  isInsuranceBussinesMexico() {
    if (Number(this.user.bupa_insurance) === InsuranceBusiness.BUPA_MEXICO) {
      this.isMexico = true;
    } else {
      this.isMexico = false;
    }
  }

  /**
   * Gets Cities by Country Id
   */
  getPhisicalAddressCities(countryId: number) {
    this._commonService.getCitiesByCountry(countryId).subscribe(cities => {
      this.phisicalAddressCities = cities;
    });
  }

  /**
   * Gets Cities by Country Id
   */
  getMailingAddressCities(countryId: number) {
    this._commonService.getCitiesByCountry(countryId).subscribe(cities => {
      this.mailingAddressCities = cities;
      // this.formPolicyProfile.get('Addresses').get('Postal').get('cityId').setValue(this.mailingAddressCities[0].cityId);
    }, error => {
      if (error.status === 404) {
        this.clearFilds();
      }
    });
  }

  /**
   * Loads countries for charge the select option
  */
  getCountries() {
    this._commonService.getCountries()
      .subscribe(
        result => {
          this.countries = result;
          this.loadPolicyHolderValues();
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
   * Shows an error that was inserted by sending the form.
   */
  private showFormErrorMessage() {
    let message = '';
    const messageTitle = 'Error';
    this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.FORM_VALIDATION').subscribe(
      result => message = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /**
   * Sends Policy's changes which will be updated.
   */
  reportChanges() {
    if (this.formPolicyProfile.valid) {
      const objToSend = this.policy;
      const postalAddress = this.transformAddress(this.formPolicyProfile.value.Addresses.Postal, 1);
      const homeAddress = this.policy.addresses.filter(addresses => addresses.addressTypeId === 2)[0];

      if (!(this.formPolicyProfile.value.mailShow === null || this.formPolicyProfile.value.mailShow === '')) {
        postalAddress.toDate = null;

        this.BuildPhones(objToSend);

        this.BuildPreferedEmail();

        objToSend.addresses = [postalAddress, homeAddress];

        const changeMetadataDto = this.BuildMetadata(postalAddress);
        const updatePolicyRequestDto = { policy: objToSend, changeMetadata: changeMetadataDto } as UpdatePolicyRequestDto;
        this.policyResponse.emit(updatePolicyRequestDto);
      } else {
        this.showFormErrorMessage();
      }
    } else {
      this.showValidations = true;
    }
  }

  /**
   * Builds Phones' collection.
   * @param objToSend Policy DTO.
   */
  private BuildPhones(objToSend: PolicyDto) {
    objToSend.phones = [];
    if (this.formPolicyProfile.value.Phones.Home.phoneNumber !== '') {
      this.formPolicyProfile.value.Phones.Home.countryId = Number(this.formPolicyProfile.value.Phones.Home.countryId);
      objToSend.phones.push(this.formPolicyProfile.value.Phones.Home);
    }
    if (this.formPolicyProfile.value.Phones.Office.phoneNumber !== '') {
      this.formPolicyProfile.value.Phones.Office.countryId = Number(this.formPolicyProfile.value.Phones.Office.countryId);
      objToSend.phones.push(this.formPolicyProfile.value.Phones.Office);
    }
    if (this.formPolicyProfile.value.Phones.Fax.phoneNumber !== '') {
      this.formPolicyProfile.value.Phones.Fax.countryId = Number(this.formPolicyProfile.value.Phones.Fax.countryId);
      objToSend.phones.push(this.formPolicyProfile.value.Phones.Fax);
    }
  }

  /**
  * Builds an Email Instance.
  */
  private BuildPreferedEmail() {
    let preferedEmail = { emailTypeId: 1, type: 'mailing', eMailAddress: this.formPolicyProfile.value.mailShow } as EmailOutputDto;
    if (this.policy.emails.length === 0) {
      this.policy.emails.push(preferedEmail);
    } else {
      preferedEmail = this.policy.emails.filter(emailsF => emailsF.emailTypeId === 1)[0];
      preferedEmail.eMailAddress = this.formPolicyProfile.value.mailShow;
    }
  }

  /**
   * Builds an Policy's Metadata instance.
   * @param postalAddress Postal Address intance.
   */
  private BuildMetadata(postalAddress: AddressOutputDto) {
    const policyChangeDto = { processId: 1, processOptionId: 0, processOptionName: 'ChangeContactInformation' } as PolicyChangeDto;
    const changeMetadataDto = {
      policyChangeType: policyChangeDto, effectiveDate: new Date(),
      description: ''
    } as ChangeMetadataDto;
    return changeMetadataDto;
  }

  /**
   * Build Policy's Address intance that will be updated.
   * @param address
   */
  private transformAddress(address: AddressOutputDto, type) {
    const country = this.countries.filter(
        countryF => Number(countryF.countryId) === Number(address.countryId))[0];

    let city = null;
    if (this.isMexicoCountry && this.municipalities) {
      address.city = this.municipalities[0].cityName;
      address.cityId = this.municipalities[0].cityId;
      address.municipality = this.municipalities[0].municipalityName;
      address.state = this.municipalities[0].stateName;
      address.interior = address.interior;
      address.exterior = address.exterior;
    } else {
      city = this.mailingAddressCities.filter(
        x => Number(x.cityId) === Number(address.cityId))[0];
      address.city = city.cityName;
      address.cityId = city.cityId;
      address.interior = '';
      address.exterior = '';
    }

    if (country !== undefined) {
      address.country = country.countryName;
      address.isoAlpha = country.isoAlpha;
      address.countryId = Number(address.countryId);
    }
    this.toDateChangeCurrentValue = address.toDate;
    address.fromDate = this.toDateChangeCurrentValue;
    address.addressTypeId = type;

    return address;
  }


  searchByZip() {
    this.getColoniesByZipCode(this.getControl('Addresses', 'Postal').get('zipCode').value, 0);
  }

  /**
   * Gets Colonies by ZipCode
   */
  getColoniesByZipCode(zipCode: string, type: number) {
    if (zipCode) {
      this._commonService.getColoniesByZipCode(zipCode).subscribe(colonies => {
        if (type === 1 && this.phisicalAddress && this.phisicalAddress.colonyId) {
          this.phisicalAddress.colony = (colonies.filter(a => a.colonyId === this.phisicalAddress.colonyId)[0]).colonyName;
        } else {
          if (type === 0) {
            this.colonies = colonies;
            this.getMunicipalitiesByZipCode(this.getControl('Addresses', 'Postal').get('zipCode').value);
          }
        }
      }, error => {
        if (error.status === 404 && type !== 1) {
          this.clearFilds();
          this.showMessageZipNotValid();
        }
      });
    }
  }

  /**
   * Gets municipalities by ZipCode
   */
  getMunicipalitiesByZipCode(zipCode: string) {
    if (zipCode) {
      this._commonService.getMunicipalitiesByZipCode(zipCode).subscribe(municipalities => {
        this.municipalities = municipalities;
        this.validMunicipality(this.municipalities[0]);
      }, error => {
        if (error.status === 404) {
          this.clearFilds();
          this.showMessageZipNotValid();
        }
      });
    }
  }

  private validMunicipality(municipality: MunicipalityDto) {
    if (municipality.cityId === undefined || municipality.cityId === 0 || municipality.cityId === null
      || municipality.stateId === undefined || municipality.stateId === 0
      || municipality.stateId === null) {
      this.clearFilds();
      this.showMessageZipNotValid();
    } else {
      if (municipality.countryId !== this.MEXICO_COUNTRY_ID) {
        this.clearFilds();
        this.showMessageZipNotMexico();
      } else {
        this.getControl('Addresses', 'Postal').get('municipality').setValue(this.municipalities[0].municipalityName);
        this.getControl('Addresses', 'Postal').get('state').setValue(this.municipalities[0].stateName);
        this.postalAddress.state = this.municipalities[0].stateName;
      }
    }
  }

  private clearFilds() {
    if (this.postalAddress && this.postalAddress.zipCode) { this.postalAddress.zipCode = ''; }
    this.getControl('Addresses', 'Postal').get('zipCode').setValue('');
    this.colonies = [];
    if (this.getControl('Addresses', 'Postal').get('colonyId')) {
      this.getControl('Addresses', 'Postal').get('colonyId').setValue('');
    }
    if (this.getControl('Addresses', 'Postal').get('municipality')) {
      this.getControl('Addresses', 'Postal').get('municipality').setValue('');
    }
    if (this.getControl('Addresses', 'Postal').get('state')) {
      this.getControl('Addresses', 'Postal').get('state').setValue('');
    }
  }

  showMessageZipNotValid() {
    const messageS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE');
    const tittleS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_TITLE');

    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  showMessageZipNotMexico() {
    const messageS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_NOT_MEXICO');
    const tittleS = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.ERROR.INVALID_ZIP_CODE_TITLE');

    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  setIsCountryMexico(countryId) {
    if (Number(countryId) === this.MEXICO_COUNTRY_ID) {
      this.isMexicoCountry = true;
    } else {
      this.isMexicoCountry = false;
    }

    if (this.isMexicoCountry) {

      if (this.postalAddress && this.postalAddress.zipCode) {
        this.getColoniesByZipCode(this.postalAddress.zipCode, 0);
      }

      this.formPolicyProfile.get('mailShow')
        .setValidators([Validators.required,
        Validators.maxLength(this.MAX_CHARS_ALLOWED_EMAIL), CustomValidator.emailPatternValidator]);

      this.formPolicyProfile.get('Phones').get('Home').get('countryId').
        setValidators([Validators.required]);
      this.formPolicyProfile.get('Phones').get('Office').get('countryId').
        setValidators([Validators.required]);
      this.formPolicyProfile.get('Phones').get('Fax').get('countryId').
        setValidators([Validators.required]);

      this.formPolicyProfile.get('Addresses').get('Postal').get('addressLine').
        setValidators([Validators.required]);

      this.formPolicyProfile.get('Addresses').get('Postal').get('zipCode').
        setValidators([Validators.required]);

      this.formPolicyProfile.get('Addresses').get('Postal').get('colonyId').setValidators(Validators.required);
      this.formPolicyProfile.get('Addresses').get('Postal').get('colonyId').setErrors({ required: true });
      this.formPolicyProfile.get('Addresses').get('Postal').get('colonyId').markAsDirty();
    } else {
      this.getControl('Addresses', 'Postal').get('colonyId').clearValidators();
      this.getControl('Addresses', 'Postal').get('colonyId').markAsPristine();
      this.getControl('Addresses', 'Postal').get('colonyId').updateValueAndValidity();
      this.getMailingAddressCities(countryId);
    }
  }

}

