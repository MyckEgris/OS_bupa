import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { Component, OnInit, ViewChild, AfterContentChecked, OnDestroy } from '@angular/core';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { AgreementService } from 'src/app/main/services/agreement/agreement.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { Agent } from 'src/app/shared/services/agent/entities/agent';
import { Email } from 'src/app/shared/services/agent/entities/email';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PhoneOutputDto } from 'src/app/shared/services/policy/entities/phone.dto';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { AddressOutputDto } from 'src/app/shared/services/policy/entities/address.dto';
import { Colony } from 'src/app/shared/services/common/entities/colony.dto';
import { MunicipalityDto } from 'src/app/shared/services/common/entities/municipality.dto';
import { forkJoin, Subscriber, Subscription } from 'rxjs';
import { Phones } from 'src/app/shared/classes/phone.enum';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
@Component({
  selector: 'app-agent-profile-view',
  templateUrl: './agent-profile-view.component.html'
})
export class AgentProfileViewComponent implements OnInit, AfterContentChecked, OnDestroy {

  private DATE_PATTERN = /^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;

  isMexico = false;
  isMexicoCountry = false;

  mainForm: FormGroup;
  public formGroup: FormGroup;
  public formArray: FormArray;
  countries: Country[] = [];
  country: Country;
  agent: Agent;
  agreements: any;
  agentAcceptedOn: string;
  acceptedOn: string;
  dateOfBirth: string;
  typeTranslated: string;
  companyName: string;

  public loadForm = false;
  /**
   * Agent's homePhone intance.
   */
  public homePhone: PhoneOutputDto;

  /**
   Agent's office phone instance.
   */
  public officePhone: PhoneOutputDto;

  /**
   * Agent's faxphone instnace.
   */
  public faxPhone: PhoneOutputDto;

  /**
   * Agent's officePhone1 instnace.
   */
  public officePhone1: PhoneOutputDto;

  /**
  * Agent's officePhone1 instnace.
  */
  public officePhone2: PhoneOutputDto;

  /***
   * List Colonies
   */
  public coloniesPostal: Colony[];

  /***
   * List Colonies
   */
  public coloniesMail: Colony[];

  /***
   * List Municipality
   */
  public municipalitiesPostal: MunicipalityDto[];

  /***
   * List Municipality
   */
  public municipalitiesHome: MunicipalityDto[];

  /**
   * Current language
   */
  private language: string;

  /**
   * COnstant for Locate for Spanish
   */
  private SPA_LOCATE = 'es-Us';

  /**
   * Constant for Locale for English
   */
  private ENG_LOCATE = 'en-Us';

  /**
   * Constant for Default language
   */
  private SPA_LANGUAGE = 'SPA';

  /**
   * Date format for locale English
   */
  private AGREEMENT_ENG_FORMAT = 'MM/dd/yyyy HH:mm';

  /**
   * Date format for locale Spanish
   */
  private AGREEMENT_SPA_FORMAT = 'dd/MM/yyyy HH:mm';

  /**
   * Date format for locale English
   */
  private DOB_ENG_FORMAT = 'MM/dd/yyyy';

  /**
   * Date format for locale Spanish
   */
  private DOB_SPA_FORMAT = 'dd/MM/yyyy';

  /**
   * Date pipe instance for customization
   */
  public pipe: DatePipe;

  /**
   * Error code for 404 not data found exception
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  private userEmail: string;

  /** holds the role of the logged person */
  public role: string;
  /**
   * Contains the logged in user information
   */
  private user: UserInformationModel;
  private lastConnection: string;
  agentNumber: string;
  showContent = false;

  private subscribe: Subscription;

  /***
   * Max chars allowed field email/state
   */
  public MAX_CHARS_ALLOWED_EMAIL = 150;
  public MAX_CHARS_ALLOWED_STATE = 100;
  public MAX_CHARS_ALLOWED_PHONE = 50;

  /**
   * Mexico Country Identifier.
   */
  private MEXICO_COUNTRY_ID = 13;

  public disabledControls = false;
  @ViewChild('countriesSelect1') countriesSelector1;
  @ViewChild('countriesSelect2') countriesSelector2;

  get formControls() {
    return this.mainForm.controls;
  }

  get personalInfoControls() {
    return (this.mainForm.controls.PersonalInfo as FormGroup).controls;
  }

  get contactPhoneArray(): FormArray {
    return <FormArray>this.mainForm.get('ContactPhones');
  }

  get contactPhoneControl() {
    return (this.mainForm.get('ContactPhones') as FormGroup).controls;
  }

  get contactPhoneOffice(): FormArray {
    return <FormArray>(this.mainForm.get('ContactPhones') as FormGroup).get('office');
  }

  get contactPhoneHome(): FormArray {
    return <FormArray>(this.mainForm.get('ContactPhones') as FormGroup).get('home');
  }

  get contactPhoneMovil(): FormArray {
    return <FormArray>(this.mainForm.get('ContactPhones') as FormGroup).get('movil');
  }

  get contactPhoneFax(): FormArray {
    return <FormArray>(this.mainForm.get('ContactPhones') as FormGroup).get('fax');
  }

  get addressesGroup() {
    return (this.mainForm.controls.Addresses as FormGroup).controls;
  }

  getControl(formGroupName: string, field: string) {
    return this.mainForm.controls.Addresses.get(formGroupName).get(field) as FormControl;
  }

  get agentDateOfBirth() {
    if (this.dateOfBirth) {
      return this.ChangeDateFormat(this.dateOfBirth, this.DOB_SPA_FORMAT, this.DOB_ENG_FORMAT);
    }
    return this.dateOfBirth;
  }

  /**
   * Checks if user language is Spanish
   */
  checksIflanguageIsSpanish() {
    return (this.language === this.SPA_LANGUAGE);
  }

  constructor(
    private _commonService: CommonService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private agreementService: AgreementService,
    private translation: TranslationService,
    private translate: TranslateService,
    private _agentService: AgentService,
    private notification: NotificationService,
    private _authService: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadForm = false;
    this.role = this._authService.getUser().role;
    if (this.role === 'AgentAssistant') {
      this.disabledControls = true;
    }

    this.showContent = false;
    this.subscribe = this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.user = userInfo;
      this.agentNumber = this.user.agent_number;
      this.lastConnection = this.user.last_login_date;
      this.userEmail = this.user.sub;
      this.validateIsMexico();
      this.getDisclaimer('ENG');
      this.getCountries();
    });
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }

  /**
   * Loads Coutry's cities by country selected.
   */
  onChanges() {
    this.getControl('Postal', 'Country').valueChanges.subscribe(val => {
      this.validateIsCountryMexico(val);
    });
  }

  private validateIsCountryMexico(val) {
    // this.clearFilds('Postal');
    if (Number(val) === this.MEXICO_COUNTRY_ID) {
      this.isMexicoCountry = true;
      this.setIsCountryMexico('Postal');
      this.setIsCountryMexico('Home');
    } else {
      this.isMexicoCountry = false;
    }
  }

  private validateIsMexico() {
    if (Number(this.user.bupa_insurance) === InsuranceBusiness.BUPA_MEXICO) {
      this.isMexico = true;
    } else {
      this.isMexico = false;
    }
  }

  ngAfterContentChecked() {
    if (this.countriesSelector1 !== undefined && this.role === 'AgentAssistant') {
      this.countriesSelector1.disabled = true;
      this.countriesSelector2.disabled = true;
    }
  }

  getAgent() {
    this._agentService.getAgentById(this.agentNumber)
      .subscribe(
        result => {
          this.agent = result;
          this.BuildMainForm();
          this.showContent = true;
        },
        error => {
          if (error.error.code) {
            this.showErrorMessage(error);
          } else if (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND) {
            this.translate.get(`AGENT.PROFILE.ERROR_MESSAGE.${error.status}`)
              .subscribe(validateTitle => {
                this.translate.get(`AGENT.PROFILE.ERROR_CODE.${error.status}`).subscribe(res => {
                  this.notification.showDialog(validateTitle, res);
                });
              });
          }
        }
      );
  }

  /**
   * Get countrie from common API
   */
  getCountries() {
    this._commonService.getCountries()
      .subscribe(
        result => {
          this.countries = result;
          this.getAgent();
        },
        error => {
          if (error.error.code) {
            this.showErrorMessage(error);
          }
        }
      );
  }

  BuildMainForm() {
    this.dateOfBirth = this.agent.dob;
    if (this.agent.companyName) {
      this.companyName = this.agent.companyName;
    } else {
      this.companyName = this.agent.firstName + this.agent.lastName;
    }

    this.mainForm = new FormGroup({
      FullName: new FormControl(this.companyName),
      LastConnection: new FormControl(this.lastConnection),
      OfficeCountry: new FormControl(this.agent.country),
      OfficeName: new FormControl(this.agent.agencyName),
      PersonalInfo: new FormGroup({
        FirstName: new FormControl(this.agent.firstName),
        LastName: new FormControl(this.agent.lastName),
        Dob: new FormControl(this.agent.dob, {
          validators:
            [Validators.pattern(this.DATE_PATTERN)], updateOn: 'blur'
        })
      }),
      ContactPhones:  new FormGroup({
        office: this.buildPhonesForm([Phones.OFFICE, Phones.OFFICE_1, Phones.OFFICE_2]),
        home: this.buildPhonesForm([Phones.HOME]),
        movil: this.buildPhonesForm([Phones.MOVIL]),
        fax: this.buildPhonesForm([Phones.FAX]),
      }),
      ContactEmails:  new FormGroup({
        preferredEmail: this.BuildEmailsForm(EmailEnum.PREFERRED_EMAIL),
        alternateEmail: this.BuildEmailsForm(EmailEnum.ALTERNATE_EMAIL),
        assistantEmail: this.BuildEmailsForm(EmailEnum.ASSISTANT_EMAIL),
        otherEmail: this.BuildEmailsForm(EmailEnum.OTHER_EMAIL),
        onlineServicesEmail: this.BuildEmailsForm(EmailEnum.ONLINE_SERVICES_EMAIL),
      }),
      Addresses: new FormGroup({
        Postal: this.BuilAddressForm(AddressTypes.MAILING),
        Home: this.BuilAddressForm(AddressTypes.PHYSICAL),
      })
    });
    this.loadForm = true;
    this.validateIsCountryMexico(this.getControl('Postal', 'Country').value);
    this.onChanges();
  }

  getControlContact(formMail: string) {
    return this.mainForm.get('ContactEmails').get(formMail);
  }

  buildPhonesForm(typePhone: number[]): FormArray {
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([])
    });
    this.formArray = this.formGroup.controls['formArray'] as FormArray;
    if (this.agent.phones) {
      this.agent.phones.filter(function(item) {
        return typePhone.indexOf(item.phoneTypeId) >= 0;
      }).forEach(phone => {
          const newFormGroup: FormGroup = this.formBuilder.group(
            {
              Type: new FormControl(phone.type),
              Number: new FormControl(phone.phoneNumber),
              PhoneTypeId: new FormControl(phone.phoneTypeId),
              countryId: new FormControl((phone.countryId === undefined || phone.countryId === null) ?
                this.countries.filter(x => x.isoAlpha === this.user.cc)[0].countryId
                : phone.countryId),
              ext: new FormControl(phone.ext)
            }
          );
          this.formArray.push(newFormGroup);
        });
    }
    return this.formArray;
  }

  /**
   * Validate Include Value
   */
  include(container: any[], value: any) {
    let returnValue = false;
    const pos = container.indexOf(value);
    if (pos >= 0) {
      returnValue = true;
    }
    return returnValue;
  }

  BuildEmailsForm(typeEmail): FormGroup {
    const email = this.agent.emails.find(e => e.emailTypeId === typeEmail);
    return new FormGroup({
      Type: new FormControl(email.type),
      EmailTypeId: new FormControl(email.emailTypeId),
      Email: new FormControl(email.eMailAddress, {
        validators:
          [CustomValidator.emailPatternValidator], updateOn: 'blur'
      })
    });
  }

  BuilAddressForm(addressTypeId: number): FormGroup {
    if (this.agent.addresses) {
      const address = this.agent.addresses.find(x => x.addressTypeId === addressTypeId);
      if (address) {
        return new FormGroup({
          StreetAddress: new FormControl(address.addressLine),
          City: new FormControl(address.city),
          State: new FormControl(address.state),
          ZipCode: new FormControl(address.zipCode),
          Country: new FormControl(address === undefined && !address.countryId ?
            this.countries.filter(x => x.isoAlpha === this.user.cc)[0].countryId
            : address.countryId),

          AddressTypeId: new FormControl(address.addressTypeId),

          countryName: new FormControl(this.GetCountrySelected((address === undefined && !address.countryId ?
            this.countries.filter(x => x.isoAlpha === this.user.cc)[0].countryId
            : address.countryId).toString())),

          interior: new FormControl(address.interior),
          exterior: new FormControl(address.exterior),
          municipality: new FormControl(address.municipality),
          colonyId: new FormControl(address.colonyId)
        });
      }
    }
    return this.BuildDefaultAddress(addressTypeId);
  }

  BuildDefaultAddress(addressTypeId: number) {
    return new FormGroup({
      StreetAddress: new FormControl(''),
      City: new FormControl(''),
      State: new FormControl(''),
      ZipCode: new FormControl(''),
      Country: new FormControl(this.countries.find(x => x.isoAlpha === this.user.cc).countryId),
      AddressTypeId: new FormControl(addressTypeId),
      countryName: new FormControl(this.countries.find(x => x.isoAlpha === this.user.cc).countryName),
      interior: new FormControl(''),
      exterior: new FormControl(''),
      municipality: new FormControl(''),
      colonyId: new FormControl('')
    });
  }

  async getDisclaimer(lang) {
    this.agreements = await this.agreementService.getUserAgreementById(this.user.sub);
    this.setTermsUse(this.agreements.userAgreementVersionsDto[0].dateAccepted);
    this.setAgentTerms(this.agreements.userAgreementVersionsDto[1].dateAccepted);
  }

  setTermsUse(value) {
    this.acceptedOn = value;
  }

  setAgentTerms(value) {
    this.agentAcceptedOn = value;
  }

  reportChanges() {
    const agent: Agent = {
      agentId: this.agent.agentId,
      agentName: this.agent.agentName,
      agentNumber: this.agent.agentNumber,
      agentEmail: '',
      companyName: this.agent.companyName,
      firstName: this.mainForm.value.PersonalInfo.FirstName,
      middleName: this.agent.middleName,
      lastName: this.mainForm.value.PersonalInfo.LastName,
      dob: this.mainForm.value.PersonalInfo.Dob,
      isAdministrator: this.agent.isAdministrator,
      statusId: this.agent.statusId,
      countryId: this.agent.countryId,
      insuranceBusinessId: this.agent.insuranceBusinessId,
      agencyId: this.agent.agencyId,
      agencyName: this.agent.agencyName,
      country: this.agent.country,
      isoAlpha: this.agent.isoAlpha,
      status: this.agent.status,
      insuranceBusiness: this.agent.insuranceBusiness,
      addresses: this.GetAddressessFromFormObject(),
      phones: this.getPhoneCollectionFromFormObject(),
      emails: this.getEmailCollectionFromFormObject(),
      portfolio: null,
      subAgents: [],
      hasPolicyGroup: 0,
      policyId: 0,
    };
    if (agent.addresses[0].countryId === 0) {
      delete agent['addresses'];
    }
    this.updateAgentData(agent);
  }

  private updateAgentData(agent: Agent) {
    this._agentService.updateAgentProfile(agent)
      .subscribe(async () => {
        const message = await this.translate.get('AGENT.PROFILE.OK_MESSAGE').toPromise();
        const messageTitle = await this.translate.get('AGENT.PROFILE.OK_MESSAGE_TITLE').toPromise();
        this.notification.showDialog(messageTitle, message);
      },
        async error => {
          if (error.error.code) {
            this.showErrorMessage(error);
          }
        });
  }

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

  private GetAddressessFromFormObject() {

    const addresses: AddressOutputDto[] = [];
    const postalAddress: AddressOutputDto = {
      addressLine: this.mainForm.value.Addresses.Postal.StreetAddress,
      type: 'Mailing',
      city: this.mainForm.value.Addresses.Postal.City,
      state: this.mainForm.value.Addresses.Postal.State,
      zipCode: this.mainForm.value.Addresses.Postal.ZipCode,
      isoAlpha: this.mainForm.value.Addresses.Postal.Country,
      countryId: this.GetCountryIdSelected(this.mainForm.value.Addresses.Postal.Country),
      country: this.GetCountrySelected(this.mainForm.value.Addresses.Postal.Country),
      addressTypeId: AddressTypes.MAILING,
      cityId: this.mainForm.value.Addresses.Postal.CityId,
      colony: this.GetColonyNamePhysical(+this.mainForm.value.Addresses.Postal.colonyId),
      colonyId: this.mainForm.value.Addresses.Postal.colonyId,
      exterior: this.mainForm.value.Addresses.Postal.exterior,
      fromDate: null,
      interior: this.mainForm.value.Addresses.Postal.interior,
      localityId: null,
      municipality: this.mainForm.value.Addresses.Postal.municipality,
      street: null,
      toDate: null
    };
    const homeAddress: AddressOutputDto = {
      addressLine: this.mainForm.value.Addresses.Home.StreetAddress,
      type: 'Physical',
      city: this.mainForm.value.Addresses.Home.City,
      state: this.mainForm.value.Addresses.Home.State,
      zipCode: this.mainForm.value.Addresses.Home.ZipCode,
      isoAlpha: this.mainForm.value.Addresses.Home.Country,
      countryId: this.GetCountryIdSelected(this.mainForm.value.Addresses.Home.Country),
      country: this.GetCountrySelected(this.mainForm.value.Addresses.Home.Country),
      addressTypeId: AddressTypes.PHYSICAL,
      cityId: this.mainForm.value.Addresses.Home.CityId,
      colony: this.GetColonyNameMailing(+this.mainForm.value.Addresses.Home.colonyId),
      colonyId: this.mainForm.value.Addresses.Home.colonyId,
      exterior: this.mainForm.value.Addresses.Home.exterior,
      fromDate: null,
      interior: this.mainForm.value.Addresses.Home.interior,
      localityId: null,
      municipality: this.mainForm.value.Addresses.Home.municipality,
      street: null,
      toDate: null
    };
    addresses.push(postalAddress);
    addresses.push(homeAddress);

    return addresses;
  }

  private GetColonyNamePhysical(colonyId: number) {
    if (this.coloniesPostal) {
      const colony: Colony[] = this.coloniesPostal.filter(x => {
        return x.colonyId === colonyId;
      });
      if (colony) {
        if (colony.length > 0) {
          return colony[0].colonyName;
        }
      }
    }
  }

  private GetColonyNameMailing(colonyId: number) {
    if (this.coloniesMail) {
      const colony: Colony[] = this.coloniesMail.filter(x => {
        return x.colonyId === colonyId;
      });
      if (colony && colony.length > 0) {
        return colony[0].colonyName;
      }
    }
  }

  private GetCountrySelected(countryId: string) {
    if (countryId === undefined || countryId === '' || this.countries.length <= 0) {
      return '';
    } else {
      const country = this.countries.find(x => x.countryId === Number(countryId));
      return country.countryName;
    }
  }

  private GetCountryIdSelected(countryId: string): number {
    if (countryId === undefined || countryId === '' || this.countries.length <= 0) {
      return 0;
    } else {
      const country = this.countries.find(x => x.countryId === Number(countryId));
      return country.countryId;
    }
  }

  private getEmailCollectionFromFormObject() {
    const emailCollection: Email[] = [];
    if (this.mainForm.controls.ContactEmails.value.preferredEmail) {
      emailCollection.push(
        this.mapEmailToObject(this.mainForm.controls.ContactEmails.value.preferredEmail));
    }
    if (this.mainForm.controls.ContactEmails.value.alternateEmail) {
      emailCollection.push(
        this.mapEmailToObject(this.mainForm.controls.ContactEmails.value.alternateEmail));
    }
    if (this.mainForm.controls.ContactEmails.value.assistantEmail) {
      emailCollection.push(
        this.mapEmailToObject(this.mainForm.controls.ContactEmails.value.assistantEmail));
    }
    if (this.mainForm.controls.ContactEmails.value.otherEmail) {
      emailCollection.push(
        this.mapEmailToObject(this.mainForm.controls.ContactEmails.value.otherEmail));
    }
    if (this.mainForm.controls.ContactEmails.value.onlineServicesEmail) {
      emailCollection.push(
        this.mapEmailToObject(this.mainForm.controls.ContactEmails.value.onlineServicesEmail));
    }
    return emailCollection;
  }

  private mapEmailToObject(email) {
    return {
      type: email.Type,
      emailTypeId: email.EmailTypeId,
      eMailAddress: email.Email
    };
  }

  private getPhoneCollectionFromFormObject() {
    const phoneCollection: PhoneOutputDto[] = [];
    for (const phone of this.mainForm.value.ContactPhones.office) {
      phoneCollection.push(this.mapPhonesToObject(phone));
    }
    for (const phone of this.mainForm.value.ContactPhones.home) {
      phoneCollection.push(this.mapPhonesToObject(phone));
    }
    for (const phone of this.mainForm.value.ContactPhones.fax) {
      phoneCollection.push(this.mapPhonesToObject(phone));
    }
    for (const phone of this.mainForm.value.ContactPhones.movil) {
      phoneCollection.push(this.mapPhonesToObject(phone));
    }
    return phoneCollection;
  }

  private mapPhonesToObject(phone) {
    return {
      type: phone.Type,
      phoneTypeId: phone.PhoneTypeId,
      phoneNumber: phone.Number,
      areaCodeId: null,
      countryId: phone.countryId,
      ext: phone.ext
    };
  }

  private ChangeDateFormat(value: string, dateSpanishFormat: string, dateEnglishFormat: string) {
    this.language = this.translation.getLanguage();
    if (this.checksIflanguageIsSpanish()) {
      this.pipe = new DatePipe(this.SPA_LOCATE);
      return this.pipe.transform(value, dateSpanishFormat);
    } else {
      this.pipe = new DatePipe(this.ENG_LOCATE);
      return this.pipe.transform(value, dateEnglishFormat);
    }
  }

  searchByZip(type: number) {
    if (type === 1) {
      this.getColoniesByZipCode(this.getControl('Postal', 'ZipCode').value, 'Postal');
    } else {
      this.getColoniesByZipCode(this.getControl('Home', 'ZipCode').value, 'Home');
    }
  }

  /**
   * Gets Colonies by ZipCode
   * @param type 1=Postal
   */
  getColoniesByZipCode(zipCode: string, type: string) {
    if (zipCode) {
      this._commonService.getColoniesByZipCode(zipCode).subscribe(colonies => {
        if (type === 'Postal') {
          this.coloniesPostal = colonies;
          this.getMunicipalitiesByZipCode(this.getControl('Postal', 'ZipCode').value, type);
        } else {
          this.coloniesMail = colonies;
          this.getMunicipalitiesByZipCode(this.getControl('Home', 'ZipCode').value, type);
        }
      }, error => {
        if (error.status === 404) {
          this.clearFilds(type);
          this.showMessageZipNotValid();
        }
      });
    }
  }

  /**
   * Gets municipalities by ZipCode
   */
  getMunicipalitiesByZipCode(zipCode: string, type: string) {
    if (zipCode) {
      this._commonService.getMunicipalitiesByZipCode(zipCode).subscribe(municipalities => {
        if (type === 'Postal') {
          this.municipalitiesPostal = municipalities;
          this.validMunicipality(this.municipalitiesPostal[0], type);
        } else {
          this.municipalitiesHome = municipalities;
          this.validMunicipality(this.municipalitiesHome[0], type);
        }
      }, error => {
        if (error.status === 404) {
          this.clearFilds(type);
          this.showMessageZipNotValid();
        }
      });
    }
  }

  private validMunicipality(municipality: MunicipalityDto, type: string) {
    if (municipality.cityId === undefined || municipality.cityId === 0 || municipality.cityId === null
      || municipality.stateId === undefined || municipality.stateId === 0
      || municipality.stateId === null) {
      this.clearFilds(type);
      this.showMessageZipNotValid();
    } else {
      if (municipality.countryId !== this.MEXICO_COUNTRY_ID) {
        this.showMessageZipNotMexico();
      } else {
        this.getControl(type, 'municipality').setValue(municipality.municipalityName);
        this.getControl(type, 'State').setValue(municipality.stateName);
      }
    }
  }

  private clearFilds(type: string) {
    this.getControl(type, 'ZipCode').setValue('');
    this.getControl(type, 'colonyId').setValue('');
    this.getControl(type, 'municipality').setValue('');
    this.getControl(type, 'State').setValue('');
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

  setIsCountryMexico(type: string) {
    if (this.isMexicoCountry) {
      if (type === 'Postal') {
        if (this.getControl('Postal', 'ZipCode') && this.getControl('Postal', 'ZipCode').value) {
          this.getColoniesByZipCode(this.getControl('Postal', 'ZipCode').value, 'Postal');
        }
      }
      if (type === 'Home') {
        if (this.getControl('Home', 'ZipCode') && this.getControl('Home', 'ZipCode').value) {
          this.getColoniesByZipCode(this.getControl('Home', 'ZipCode').value, 'Home');
        }
      }
    }
  }

}
