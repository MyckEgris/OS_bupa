/**
* policy-enrollment-step2.component.component.ts
*
* @description: This class handle step 2 policy aplication wizard.
* @author Enrique Durango.
* @version 1.0
* @date 16-10-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, forkJoin, of, zip } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { IdentificationTypes } from 'src/app/shared/services/policy-application/constants/identification-type.enum';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { PhoneTypes } from 'src/app/shared/services/policy-application/constants/phone-types.enum';
@Component({
  selector: 'app-policy-enrollment-step2',
  templateUrl: './policy-enrollment-step2.component.html'
})
export class PolicyEnrollmentStep2Component implements OnInit, OnDestroy {
  /**
   * User  of policy enrollment step2 component
   */
  public user: UserInformationModel;
  /**
   * Wizard  of policy enrollment step2 component
   */
  public wizard: PolicyEnrollmentWizard;
  /**
   * Current step of policy enrollment step2 component
   */
  public currentStep = 2;
  /**
   * Subscription  of policy enrollment step2 component
   */
  private subscription: Subscription;
  /**
   * Config step of policy enrollment step2 component
   */
  public configStep: ViewTemplateStep;
  /**
   * Section active of policy enrollment step2 component
   */
  public sectionActive: number;

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;
  /***
   * Const to Identify the nested FormGroup policyApplicationIntroductionStep
   */
  public OWNER_STEP = 'policyApplicationOwnerStep';
  /**
   * Section formgroup name of policy enrollment step2 section1 component
   */
  public SECTION_DATA = 'policyData';
  public SECTION_OWNER = 'policyOwner';
  public SECTION_ADDRESSES = 'policyOwnerAddresses';
  private SECTION_ADDITIONAL_ADDRESSES = 'policyOwnerAdditionalAddresses';
    /**
   * Subscription colonies home of policy enrollment step2 section3 component
   */
  private subscriptionColoniesHome: Subscription;
  /**
   * Subscription colonies mail of policy enrollment step2 section3 component
   */
  private subscriptionColoniesMail: Subscription;
  /**
   * Creates an instance of policy enrollment step2 component.
   * @param policyEnrollmentWizardService
   * @param authService
   */
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private commonService: CommonService
  ) {
  }

  /**
   * on destroy
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subscriptionColoniesHome) { this.subscriptionColoniesHome.unsubscribe(); }
    if (this.subscriptionColoniesMail) { this.subscriptionColoniesMail.unsubscribe(); }
  }
  /**
   * on init
   */
  async ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
         this.wizard = wizard; this.setUpForm(); this.setSectionStep(this.wizard.currentSection);
        },
      this.user, null, this.currentStep, 0);
  }

  /**
   * Sets up form
   */
  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm
      .addControl(this.configStep.type,
        this.policyEnrollmentWizardService.buildStep(this.currentStep)
      );

      if (localStorage.getItem('mode') === 'Edit') {
        const owner: Member = this.wizard.policyApplicationModel.members.find(id => id.relationTypeId === 2);
        this.displayValuesOnEditSection1(owner);
        this.displayValuesOnEditSection2(owner);
        if (+this.user.bupa_insurance === InsuranceBusiness.BUPA_MEXICO) {
          this.displayValuesOnEditSection3();
        }
      }
  }

  private displayValuesOnEditSection1(owner: Member): void {
    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyApplicationSinceDate')
      .setValue(moment(this.wizard.policyApplicationModel.issueDate).toDate());

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerFirstName')
      .setValue(owner.firstName);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerMiddleName')
      .setValue(owner.middleName);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerFatherLastName')
      .setValue(owner.paternalLastName);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerMotherLastName')
      .setValue(owner.maternalLastName);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerDob')
      .setValue(moment(owner.dob).toDate());

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerCob')
      .setValue(owner.countryOfBirthId);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerNationality')
      .setValue(owner.nationalityId);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerMaritalStatus')
      .setValue(owner.maritalStatusId);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerSystemMeasureId')
      .setValue(owner.systemMeasureId);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerGenre')
      .setValue(owner.genderId);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerWeight').setValue(owner.weight);
    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerHeight').setValue(+owner.height);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyOwnerCountryOfResidence')
      .setValue(owner.countryOfResidenceId);

    this.getControl(this.OWNER_STEP, this.SECTION_DATA, 'policyApplicationResidentQuestion')
      .setValue(owner.usCitizenResident.toString());

  }

  private displayValuesOnEditSection2(owner: Member): void {
    const preferredEmail = this.wizard.policyApplicationModel.emails.find(id => id.emailTypeId === EmailEnum.PREFERRED_EMAIL
      && id.contactGuid === owner.applicationMemberGuid);
    if (preferredEmail) {
      this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'policyOwnerEmail')
      .setValue(preferredEmail.emailAddress);
    }

    this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'employmentProfessionBusiness')
      .setValue(owner.ocupation);

    this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'sourceOfFunding')
      .setValue(owner.sourceOfFundingId);

    this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'sourceOfFundingOther')
      .setValue(owner.otherSourceOfFunding);

    this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'patrimonialLinks')
      .setValue(owner.patrimonialLinks);

    const countryId = this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'homePhoneCountry').value;
    this.wizard.cities$ = this.commonService.getCitiesByCountry(countryId);

    this.setIdentifications(owner);
    this.setEconomicDataAndPEP(owner);
    this.setPhones(owner);
  }

  setPhones(owner: Member) {
    const phoneOwner = this.wizard.policyApplicationModel.phones.find(id => id.contactGuid === owner.applicationMemberGuid
      &&  id.phoneTypeId === PhoneTypes.HOME);
    if (phoneOwner) {
      this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'homePhoneCountry')
      .setValue(phoneOwner.countryId);

      this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'homePhoneCity')
      .setValue(phoneOwner.cityId);

      this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'homePhoneAreaCode')
      .setValue(phoneOwner.areaCodeId);

      this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'homePhoneNumber')
      .setValue(phoneOwner.phoneNumber);
    }
  }

  setIdentifications(owner: Member) {
    if (+this.user.bupa_insurance === InsuranceBusiness.BUPA_MEXICO) {
      const rfc = this.wizard.policyApplicationModel.identifications
        .find(id => id.identificationTypeId === IdentificationTypes.RFC);
      const curp = this.wizard.policyApplicationModel.identifications
        .find(id => id.identificationTypeId === IdentificationTypes.CURP);
      const serialNumber = this.wizard.policyApplicationModel.identifications
      .find(id => id.identificationTypeId === IdentificationTypes.SERIAL_NUMBER);
      if (rfc) {
        this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'policyOwnerRFC')
        .setValue(rfc.identificationNumber);
      }

      if (curp) {
        this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'policyOwnerCURP')
        .setValue(curp.identificationNumber);
      }

      if (serialNumber) {
        this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'serialOfNumberCertificate')
        .setValue(serialNumber.identificationNumber);
      }
    }

    if (+this.user.bupa_insurance === InsuranceBusiness.BUPA_PANAMA) {
      this.fillFormIdentifications(owner);
    }
  }

  fillFormIdentifications(owner: Member) {
    const identification = this.wizard.policyApplicationModel.identifications
    .find(id => id.contactGuid === owner.applicationMemberGuid);
    if (identification) {
      this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'identificationType')
      .setValue(identification.identificationTypeId);

      this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'identificationNumber')
      .setValue(identification.identificationNumber);
    }
  }

  private setEconomicDataAndPEP(owner: Member) {
    if (+this.user.bupa_insurance === InsuranceBusiness.BUPA_PANAMA) {
      if (owner.memberExtension) {
      this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'averageAnnualIncome' )
        .setValue(owner.memberExtension.averageAnnualIncome);
        this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'placeWherePayTaxes')
        .setValue(owner.memberExtension.placeWherePayTaxes);
        this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'isPEP')
        .setValue(owner.memberExtension.isPEP.toString());
        this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'relationshipPEP')
        .setValue(owner.memberExtension.relationshipPEP.toString());
        this.getControl(this.OWNER_STEP, this.SECTION_OWNER, 'associatedPEP')
        .setValue(owner.memberExtension.associatedPEP.toString());
        this.getControl(this.OWNER_STEP, this.SECTION_ADDITIONAL_ADDRESSES, 'workPlaceOffice')
        .setValue(owner.memberExtension.workPlace);
        this.getControl(this.OWNER_STEP, this.SECTION_ADDITIONAL_ADDRESSES, 'performingJobContactInfoOffice')
        .setValue(owner.memberExtension.performingJob);
      }
    }
  }

  private displayValuesOnEditSection3(): void {
    this.getCountry(); // Physical
    const physicalAddress: Address = this.wizard.policyApplicationModel.addresses.find(id => id.addressTypeId === AddressTypes.PHYSICAL);
    if (physicalAddress) {
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'zipCodeHome').setValue(physicalAddress.zip);
      if (physicalAddress.zip !== '') {
        this.searchZipCode('zipCodeHome', physicalAddress.zip); // Physical
      }
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'colonyHome')
      .setValue(physicalAddress.colonyId);
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'localityHome')
      .setValue(physicalAddress.localityId);
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'streetAvenueHome')
      .setValue(physicalAddress.street);
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'insideNumberHome')
      .setValue(physicalAddress.interior);
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'outsideNumberHome')
      .setValue(physicalAddress.exterior);
    }
    const mailingAddress: Address = this.wizard.policyApplicationModel.addresses.find(id => id.addressTypeId === AddressTypes.MAILING);
    if (mailingAddress) {
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'zipCodeMail').setValue(mailingAddress.zip);
      if (mailingAddress.zip !== '') {
        this.searchZipCode('zipCodeMail', mailingAddress.zip); // Mailing
      }
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'countryMail')
      .setValue(mailingAddress.countryId);
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'colonyMail')
      .setValue(mailingAddress.colonyId);
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'localityMail')
      .setValue(mailingAddress.localityId);
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'streetAvenueMail')
      .setValue(mailingAddress.street);
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'insideNumberMail')
      .setValue(mailingAddress.interior);
      this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'outsideNumberMail')
      .setValue(mailingAddress.exterior);
    }

    this.areAddressesDifferent(physicalAddress, mailingAddress);
  }



  areAddressesDifferent(physicalAddress: Address, mailingAddress: Address) {
    if (physicalAddress && mailingAddress) {
      if (physicalAddress.street === mailingAddress.street
        && physicalAddress.zip === mailingAddress.zip) {
          this.wizard.diffAddressHomeMail = false;
        } else {
          this.wizard.diffAddressHomeMail = true;
        }
    }
  }

   /**
   * Gets country
   */
  getCountry() {
    forkJoin(this.wizard.countries$).subscribe(
      async response => {
        const country = (response[0]).filter(c => c.isoAlpha === this.user.cc)[0];
        this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'countryHome').setValue(country);
      }
    );
  }

  /**
   * Searchs zip code
   * @param type
   */
  searchZipCode(type: string, zipCode: string) {
    this.getColoniesByZipCode(type, zipCode);
  }
  /**
   * Gets colonies by zip code
   * @param type
   * @param zipCode
   */
  getColoniesByZipCode(type: string, zipCode: string) {
    if (type === 'zipCodeHome') {
      this.wizard.coloniesHome$ = this.commonService.getColoniesByZipCode(zipCode);
      this.subscriptionColoniesHome = this.wizard.coloniesHome$.subscribe(
        result => this.getMunicipalityByZipCode(type, zipCode),
        error => console.error(error)
      );
    } else {
      this.wizard.coloniesPostal$ = this.commonService.getColoniesByZipCode(zipCode);
      this.subscriptionColoniesMail = this.wizard.coloniesPostal$.subscribe(
        result => this.getMunicipalityByZipCode(type, zipCode),
        error => console.error(error)
      );
    }
  }



    /**
   * Gets municipality by zip code
   * @param type
   * @param zipCode
   */
  getMunicipalityByZipCode(type: string, zipCode: string) {
    this.wizard.municipality$ = this.commonService.getMunicipalitiesByZipCode(zipCode);
    forkJoin(this.wizard.municipality$).subscribe(async response => {
      const municipality = (response[0])[0];
      if (type === 'zipCodeHome') {
        this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'stateHome').setValue(municipality.stateName);
        this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'mayoraltyMunicipalityHome').setValue(municipality);
      } else {
        this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'stateMail').setValue(municipality.stateName);
        this.getControl(this.OWNER_STEP, this.SECTION_ADDRESSES, 'mayoraltyMunicipalityMail').setValue(municipality);
      }
      this.getLocalityByState(type, municipality.stateId);
    });
  }

    /**
   * Gets locality by state
   * @param type
   * @param stateId
   */
  getLocalityByState(type: string, stateId: number) {
    if (type === 'zipCodeHome') {
      this.wizard.localityHome$ = this.commonService.getLocalitiesByStateId(stateId);
    } else {
      this.wizard.localityPostal$ = this.commonService.getLocalitiesByStateId(stateId);
    }
  }
    /**
   * Gets control
   * @param field
   * @returns formControl
   */
  getControl(ownerStep: string, section: string, field: string) {
    return this.wizard.enrollmentForm.get(ownerStep).get(section).get(field) as FormControl;
  }

  /**
   * Establish step to current step
   * @param step Step number
   */
  async setSectionStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.sectionActive = step;
  }

}

