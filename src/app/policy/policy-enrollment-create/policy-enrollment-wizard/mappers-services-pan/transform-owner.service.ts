import { Injectable } from '@angular/core';
import { PolicyEnrollmentWizard } from '../entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Identification } from 'src/app/shared/services/policy-application/entities/identification';
import { Utilities } from 'src/app/shared/util/utilities';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { Email } from 'src/app/shared/services/policy-application/entities/email';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { PhoneTypes } from 'src/app/shared/services/policy-application/constants/phone-types.enum';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { MemberExtension } from 'src/app/shared/services/policy-application/entities/member-extension';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
import { MeasurementConversionService } from 'src/app/shared/services/policy-application/helpers/measurement-conversion.service';
@Injectable({
  providedIn: 'root'
})
export class TransformOwnerService {

  private INITIAL_VALUE_ZERO = 0;
  private policyEnrollment: PolicyEnrollmentWizard;
  private OWNER_RELATION_TYPE = 2;
  private MEASURE_CONSTANT_CONVERSION = 0.45359237;
  private BASE_100 = 100;
  private STRING_EMPTY = '';
    /**** 3-kilos-metros, 4-libras-metros */
    MEASURE_SYSTEM_KG_MTS = 3;
  constructor(private measurementConversionService: MeasurementConversionService) { }

  public transformDataFormToModel(policyEnrollment: PolicyEnrollmentWizard) {
    this.policyEnrollment = policyEnrollment;
    switch (+this.policyEnrollment.currentSection) {
      case 1: {
        this.mapperFormValuesToPolicyModelOwnerSection1();
        break;
      }

      case 2: {
        this.mapperFormValuesToPolicyModelOwnerSection2();
        break;
      }

      case 3: {
        this.mapperFormValuesToPolicyModelOwnerSection3();
        break;
      }

      case 4: {
        this.mapperFormValuesToPolicyModelOwnerSection4();
        break;
      }
    }
  }

  private mapperFormValuesToPolicyModelOwnerSection1() {
    this.policyEnrollment.policyApplicationModel.paperless = (this.getValuesFromEnrollmentForm(
      this.getConfigStep(1).type,
      this.getConfigStep(1).sections.find(s => s.id === 2).name,
      'policyApplicationRPaperLessQuestion') === 'true');
    this.policyEnrollment.policyApplicationModel.petitionerTypeId = this.getValuesFromEnrollmentForm(
      this.getConfigStep(1).type,
      this.getConfigStep(1).sections.find(s => s.id === 1).name,
      'policyApplicationPetitionerType');
    this.policyEnrollment.policyApplicationModel.signedDate = Utilities.getDateNow();
    this.policyEnrollment.policyApplicationModel.issueDate = this.getValuesFromEnrollmentForm(
      this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyApplicationSinceDate');

    if (this.policyEnrollment.policyApplicationModel.members.length === 0) {
      this.policyEnrollment.policyApplicationModel.members =
        [this.createMember(this.policyEnrollment.ownerMemberGuid, this.policyEnrollment.policyApplicationGuid)];
    } else {
      this.policyEnrollment.policyApplicationModel.members.forEach((member, index) => {
        if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
          this.policyEnrollment.policyApplicationModel.members[index] =
            this.createMember(member.applicationMemberGuid, member.applicationGuid);
        }
      });
    }
  }

  private createMember(memberGuid: string, applicationGuid: string) {
    const member: Member = {
      applicationMemberGuid: memberGuid,
      applicationGuid: applicationGuid,
      firstName: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerFirstName'),
      middleName: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerMiddleName'),
      paternalLastName: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerFatherLastName'),
      maternalLastName: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerMotherLastName'),
      lastName: this.getLastName(),
      dob: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerDob'),
      genderId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerGenre'),
      systemMeasureId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerSystemMeasureId'),
      weight: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name, 'policyOwnerWeight'),
      height: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name, 'policyOwnerHeight'),
      fullTimeStudent: null,
      schoolName: null,
      usCitizenResident: (this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyApplicationResidentQuestion') === 'true'),
      nationalityId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerNationality'),
      maritalStatusId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerMaritalStatus'),
      countryOfBirthId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name,
        'policyOwnerCob'),
      countryOfResidenceId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name, 'policyOwnerCountryOfResidence'),
      relationTypeId: this.OWNER_RELATION_TYPE,
      dependentRelationId: 1,
      ocupationId: null,
      previousPolicyId: null,
      previousMemberId: null,
      gender: null,
      systemMeasure: null,
      nationality: null,
      maritalStatus: null,
      relationType: null,
      dependentRelation: null,
      ocupation: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'employmentProfessionBusiness'),
      contactBaseId: null,
      countryOfBirth: null,
      industry: null,
      sourceOfFunding: null,
      sourceOfFundingId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'sourceOfFunding'),
      otherSourceOfFunding: this.getSourceOfFundingOther(),
      industryId: null,
      patrimonialLinks: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'patrimonialLinks'),
      memberExtension: this.getMemberExtension()
    };
    return member;
  }

  private getLastName(): string {
    return `${this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerFatherLastName')} ${this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 1).name, 'policyOwnerMotherLastName')}`;
  }

  private getWeightCalculated(): number {
    const weight = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name, 'policyOwnerWeight');
    const measureId = +this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name, 'policyOwnerSystemMeasureId');
    if (measureId === this.MEASURE_SYSTEM_KG_MTS) {
      return this.measurementConversionService.convertPoundToKg(weight);
    } else {
      return this.measurementConversionService.convertKgToPound(weight);
    }
  }

  private getHeightCalculated(): number {
    const height = +this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name, 'policyOwnerHeight');
    return this.measurementConversionService.convertCMStoMTS(height);
  }

  private getSourceOfFundingOther() {
    const sourceOfFunding = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'sourceOfFunding');
    const sourceOfFundingOther = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'sourceOfFundingOther');
    if (sourceOfFunding) {
      return null;
    } else {
      if (sourceOfFundingOther) {
        return sourceOfFundingOther;
      }
      return null;
    }
  }

  private getMemberExtension(): MemberExtension {
    const member: Member = this.policyEnrollment.policyApplicationModel.members.find(m => m.relationTypeId === this.OWNER_RELATION_TYPE);
    if (member && member.memberExtension) {
      return member.memberExtension;
    }
    return null;
  }

  private mapperFormValuesToPolicyModelOwnerSection2() {
    const member: Member = this.policyEnrollment.policyApplicationModel.members.find(m => m.relationTypeId === this.OWNER_RELATION_TYPE);
    this.fillContactInformationSection2(member, PhoneTypes.HOME, 'HOME');
    this.fillEconomicInformationSection2(member);
  }

  private fillContactInformationSection2(member: Member, phoneTypeId: number, phoneType: string) {
    this.fillPhonesSection2(member, phoneTypeId, phoneType);
    this.fillEmailsSection2(member);
  }

  private fillPhonesSection2(member: Member, phoneTypeId: number, phoneType: string) {
    const countryId =  this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneCountry');

    const cityId =  this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneCity');

    if (countryId && cityId) {
      const phonesOwner = this.policyEnrollment.policyApplicationModel.phones.filter(p => p.contactGuid === member.applicationMemberGuid);
      if (phonesOwner && phonesOwner.length > 0) { // Update
        this.editPhone(member, PhoneTypes.HOME);
      } else { // New
        this.policyEnrollment.policyApplicationModel.phones.push(this.createPhone(member, phoneTypeId, phoneType,
          this.policyEnrollment.phoneGuid));
      }
    }
  }

  private fillEmailsSection2(member: Member) {
    const emailAddress = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'policyOwnerEmail');
    if (emailAddress) {
      if (this.policyEnrollment.policyApplicationModel.emails.length === 0) {
        this.policyEnrollment.policyApplicationModel.emails =
          [this.createEmails(member, EmailEnum.PREFERRED_EMAIL, this.policyEnrollment.emailGuid, emailAddress),
          this.createEmails(member, EmailEnum.ONLINE_SERVICES_EMAIL, this.policyEnrollment.emailOnlineGuid, emailAddress)];
      } else {
        this.policyEnrollment.policyApplicationModel.emails.forEach((email, index) => {
          if (email.contactGuid === member.applicationMemberGuid && member.relationTypeId === this.OWNER_RELATION_TYPE) {
            if (email.emailTypeId === EmailEnum.PREFERRED_EMAIL || email.emailTypeId === EmailEnum.ONLINE_SERVICES_EMAIL) {
              this.policyEnrollment.policyApplicationModel.emails[index] =
                this.createEmails(member, email.emailTypeId, email.applicationEmailGuid, emailAddress);
            }
          }
        });
      }
    }
  }

  private editPhone(member: Member, phoneTypeId: number) {
    this.policyEnrollment.policyApplicationModel.phones.forEach((phone, index) => {
      if (phone.contactGuid === member.applicationMemberGuid) {
        if (member.relationTypeId === this.OWNER_RELATION_TYPE && phone.phoneTypeId === phoneTypeId) {
          this.policyEnrollment.policyApplicationModel.phones[index] =
            this.createPhone(member, phoneTypeId, phone.phoneType, phone.applicationPhoneGuid);
        }
      }
    });
  }

  private fillEconomicInformationSection2(member: Member) {
    this.complementMemberModelSection2(member);
    this.fillIdentificationsSection2(member);
    this.createMemberExtensionSection2(member);
  }

  private complementMemberModelSection2(member: Member) {
    const occupation = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'employmentProfessionBusiness');
    this.policyEnrollment.policyApplicationModel.members
      .find(memberGuid => memberGuid.applicationMemberGuid === member.applicationMemberGuid).ocupation = occupation;
  }

  private fillIdentificationsSection2(member) {
    const identificationNumberValue = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'identificationNumber');
    const identificationTypeValue = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'identificationType');

    const identsOwner = this.policyEnrollment.policyApplicationModel.identifications
      .filter(contGUID => contGUID.contactGuid === member.applicationMemberGuid);

    if (identsOwner && identsOwner.length > 0) { // Update
      this.policyEnrollment.policyApplicationModel.identifications.forEach((identification, index) => {
        if (identification.contactGuid === member.applicationMemberGuid) {
          if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
            this.policyEnrollment.policyApplicationModel.identifications[index] = this.createIdentification(member, identificationTypeValue,
              identificationNumberValue, identification.applicationIdentificationGuid);
          }
        }
      });
    } else { // NEw
      this.policyEnrollment.policyApplicationModel.identifications
        .push(this.createIdentification(member, identificationTypeValue, identificationNumberValue,
          this.policyEnrollment.applicationIdentificationDocGuid));
    }
  }

  private createIdentification(member: Member, identificationTypeId: number, identificationNumber: string, identificationGuid: string) {
    const identification: Identification = {
      applicationIdentificationGuid: identificationGuid,
      applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
      contactType: this.INITIAL_VALUE_ZERO,
      contactGuid: member.applicationMemberGuid,
      identificationNumber: identificationNumber,
      identificationTypeId: identificationTypeId
    };
    return identification;
  }

  private createMemberExtensionSection2(member: Member) {
    const memberExt: MemberExtension = {
      averageAnnualIncome: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'averageAnnualIncome'),
      placeWherePayTaxes: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'placeWherePayTaxes'),
      isPEP: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'isPEP'),
      relationshipPEP: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'relationshipPEP'),
      associatedPEP: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'associatedPEP'),

      // Section 4
      workPlace: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'workPlaceOffice'),
      performingJob: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'performingJobContactInfoOffice')
    };
    this.policyEnrollment.policyApplicationModel.members
      .find(memberGuid => memberGuid.applicationMemberGuid === member.applicationMemberGuid).memberExtension = memberExt;
  }

  private createEmails(member: Member, emailTypeId: number, emailGuid: string, emailAddress: string) {
    const email: Email = {
      applicationEmailGuid: emailGuid,
      applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
      contactType: this.INITIAL_VALUE_ZERO,
      contactGuid: member.applicationMemberGuid,
      emailTypeId: emailTypeId,
      emailAddress: emailAddress,
      emailType: ''
    };
    return email;
  }


  private createPhone(member: Member, phoneTypeId: number, phoneType: string, phoneGuid: string): Phone {
    const phone: Phone = {
      phoneType: phoneType,
      applicationPhoneGuid: phoneGuid,
      applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
      contactType: this.INITIAL_VALUE_ZERO,
      contactGuid: member.applicationMemberGuid,
      phoneTypeId: phoneTypeId,
      phoneNumber: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneNumber'),
      ext: null,
      countryId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneCountry'),
      cityId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneCity'),
      areaCodeId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneAreaCode'),
      areaCode: this.STRING_EMPTY,
      fullPhone: null,
    };
    return phone;
  }


  private mapperFormValuesToPolicyModelOwnerSection3() {
    const member: Member = this.policyEnrollment.policyApplicationModel.members.find(m => m.relationTypeId === this.OWNER_RELATION_TYPE);
    const addressesOwner = this.policyEnrollment.policyApplicationModel.addresses
      .filter(contGUID => contGUID.contactGuid === member.applicationMemberGuid);
    if (addressesOwner && addressesOwner.length > 0) { // Update
      this.updateOrCreateMailingAddress(member);
      this.updatePhysicalAddress(member);
    } else { // New
      this.mapperFormValuesToPhysicalAddress(member, this.policyEnrollment.addressGuid,
        this.policyEnrollment.addressPostalGuid);
    }
  }

  private updateOrCreateMailingAddress(member: Member) {
    const mailingAddressIndex = this.policyEnrollment.policyApplicationModel.addresses
      .findIndex(add => add.addressTypeId === AddressTypes.MAILING && add.contactGuid === member.applicationMemberGuid);
    if (this.policyEnrollment.diffAddressHomeMail) {
      if (mailingAddressIndex === -1) { // New
        this.policyEnrollment.policyApplicationModel.addresses.push(
          this.createMailingAddress(member, AddressTypes.MAILING, 'MAILING', this.policyEnrollment.addressPostalGuid,
            this.policyEnrollment.policyApplicationModel.applicationGuid));
      } else { // Update
        const addressMailing = this.policyEnrollment.policyApplicationModel.addresses[mailingAddressIndex];
        this.policyEnrollment.policyApplicationModel.addresses[mailingAddressIndex] =
          this.createMailingAddress(member, addressMailing.addressTypeId, addressMailing.addressType,
            addressMailing.applicationAddressGuid, member.applicationGuid);
      }
    } else { // Delete
      if (mailingAddressIndex !== -1) {
        this.policyEnrollment.policyApplicationModel.addresses.splice(mailingAddressIndex, 1);
      }
    }
  }

  private updatePhysicalAddress(member: Member) {
    this.policyEnrollment.policyApplicationModel.addresses.forEach((address, index) => {
      if (address.contactGuid === member.applicationMemberGuid
        && member.relationTypeId === this.OWNER_RELATION_TYPE
        && address.addressTypeId === AddressTypes.PHYSICAL) {
        this.policyEnrollment.policyApplicationModel.addresses[index] =
          this.createPhysicalAddress(member, address.addressTypeId, address.addressType,
            address.applicationAddressGuid, member.applicationGuid);
      }
    });
  }

  /**
   * Mappers form values to physical address (When is a new form)
   * @param member
   * @param addressGuid
   * @param addressPostalGuid
   */
  private mapperFormValuesToPhysicalAddress(member: Member, addressGuid: string, addressPostalGuid: string) {
    this.policyEnrollment.policyApplicationModel.addresses.push(
      this.createPhysicalAddress(member, AddressTypes.PHYSICAL, 'PHYSICAL', addressGuid,
        this.policyEnrollment.policyApplicationModel.applicationGuid));
    if (this.policyEnrollment.diffAddressHomeMail) {
      this.policyEnrollment.policyApplicationModel.addresses.push(
        this.createMailingAddress(member, AddressTypes.MAILING, 'MAILING', addressPostalGuid,
          this.policyEnrollment.policyApplicationModel.applicationGuid));
    }
  }


  private createPhysicalAddress(member: Member, addressTypeId: number, addressType: string, addressGuid: string,
    applicationGuid: string): Address {
    const address: Address = {
      addressType: addressType,
      applicationAddressGuid: addressGuid,
      applicationGuid: applicationGuid,
      contactType: this.INITIAL_VALUE_ZERO,
      contactGuid: member.applicationMemberGuid,
      addressTypeId: addressTypeId,
      addressLine1: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'streetAvenueHome'),
      addressLine2: this.STRING_EMPTY,
      cityId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'cityHome'),
      city: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'cityHome'),
      countryId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'countryHome').countryId,
      country: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'countryHome').countryName,
      colonyId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'colonyHome'),
      colony: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'colonyHome'),
      state: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'stateHome'),
      municipality: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'mayoraltyMunicipalityHome'),
      zip: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'zipCodeHome'),
      exterior: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'outsideNumberHome'),
      interior: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'insideNumberHome'),
      localityId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'localityHome'),
      street: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'streetAvenueHome'),
      yearsInAddress: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'yearsInAddress')
    };
    return address;
  }

  private createMailingAddress(member: Member, addressTypeId: number, addressType: string, addressGuid: string,
    applicationGuid: string): Address {
    const address: Address = {
      addressType: addressType,
      applicationAddressGuid: addressGuid,
      applicationGuid: applicationGuid,
      contactType: this.INITIAL_VALUE_ZERO,
      contactGuid: member.applicationMemberGuid,
      addressTypeId: addressTypeId,
      addressLine1: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'streetAvenueMail'),
      addressLine2: this.STRING_EMPTY,
      cityId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'cityMail'),
      city: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'cityMail').cityName,
      countryId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'countryMail'),
      country: this.STRING_EMPTY,
      colonyId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'colonyMail'),
      colony: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'colonyMail'),
      state: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'stateMail'),
      municipality: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'mayoraltyMunicipalityMail'),
      zip: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'zipCodeMail'),
      exterior: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'outsideNumberMail'),
      interior: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'insideNumberMail'),
      localityId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'localityMail'),
      street: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'streetAvenueMail'),
      yearsInAddress: this.STRING_EMPTY
    };
    return address;
  }

  private mapperFormValuesToPolicyModelOwnerSection4() {
    const member: Member = this.policyEnrollment.policyApplicationModel.members.find(m => m.relationTypeId === this.OWNER_RELATION_TYPE);
    this.fillOfficeAddress(member);
    this.fillOfficeContactInfo(member);
    this.complementMemberSection4(member);
    this.fillEmailOfficeContact(member);
  }

  private fillOfficeAddress(member: Member) {
    const countryOfficeId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 4).name, 'countryOffice');
    const cityOfficeId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 4).name, 'cityOffice');

  if (countryOfficeId && cityOfficeId) {
      const addressIndex = this.policyEnrollment.policyApplicationModel.addresses
        .findIndex(officeAddress => officeAddress.addressTypeId === AddressTypes.OFFICE_CONTACT);
      if (addressIndex === -1) {
        this.policyEnrollment.policyApplicationModel.addresses.push(
          this.createOfficeAddress(member, AddressTypes.OFFICE_CONTACT, 'OFFICE_CONTACT', this.policyEnrollment.otherAddressGuid));
      } else {
        const address = this.policyEnrollment.policyApplicationModel.addresses[addressIndex];
        this.policyEnrollment.policyApplicationModel.addresses[addressIndex] =
          this.createOfficeAddress(member, address.addressTypeId, address.addressType, address.applicationAddressGuid);
      }
    }
  }

  private createOfficeAddress(member: Member, addressTypeId: number, addressType: string, addressGuid: string): Address {
    const address: Address = {
      addressType: addressType,
      applicationAddressGuid: addressGuid,
      applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
      contactType: this.INITIAL_VALUE_ZERO,
      contactGuid: member.applicationMemberGuid,
      addressTypeId: addressTypeId,
      countryId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'countryOffice'),
      country: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'countryOffice'),
      zip: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'postalCodeOffice'),
      municipality: null,
      cityId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'cityOffice'),
      city: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'cityOffice'),
      addressLine1: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'addressOffice'),
      addressLine2: this.STRING_EMPTY,
      colonyId: this.INITIAL_VALUE_ZERO,
      colony: this.STRING_EMPTY,
      state: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'provinceOffice'),
      exterior: this.STRING_EMPTY,
      interior: this.STRING_EMPTY,
      localityId: this.INITIAL_VALUE_ZERO,
      street: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'addressOffice'),
      yearsInAddress: this.STRING_EMPTY
    };
    return address;
  }

  private fillOfficeContactInfo(member: Member) {
    const countryContactInfoOfficeId =  this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 4).name, 'countryContactInfoOffice');
    const cityContactInfoOfficeId =  this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 4).name, 'cityContactInfoOffice');

    if (countryContactInfoOfficeId && cityContactInfoOfficeId) {
      const phoneIndex = this.policyEnrollment.policyApplicationModel.phones.findIndex(phone => phone.phoneTypeId === PhoneTypes.OFFICE);
      if (phoneIndex === -1) {
        this.policyEnrollment.policyApplicationModel.phones.push(
          this.createOfficeContactInfo(member, PhoneTypes.OFFICE, 'OFFICE', this.policyEnrollment.phone1001Guid));
      } else {
        const phoneOffice = this.policyEnrollment.policyApplicationModel.phones[phoneIndex];
        this.policyEnrollment.policyApplicationModel.phones[phoneIndex] =
          this.createOfficeContactInfo(member, phoneOffice.phoneTypeId, phoneOffice.phoneType, phoneOffice.applicationPhoneGuid);
      }
    }
  }

  private createOfficeContactInfo(member: Member, phoneTypeId: number, phoneType: string, phoneGuid: string): Phone {
    const phone: Phone = {
      phoneType: phoneType,
      applicationPhoneGuid: phoneGuid,
      applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
      contactType: this.INITIAL_VALUE_ZERO,
      contactGuid: member.applicationMemberGuid,
      phoneTypeId: phoneTypeId,

      countryId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'countryContactInfoOffice'),
      areaCode: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'areaCodeContactInfoOffice'),
      areaCodeId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'areaCodeContactInfoOffice'),
      cityId: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'cityContactInfoOffice'),
      phoneNumber: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'phoneNumberContactInfoOffice'),
      ext: this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'extensionContactInfoOffice'),
      fullPhone: null
    };
    return phone;
  }

  private complementMemberSection4(member: Member) {
    this.policyEnrollment.policyApplicationModel.members.find(m => m.applicationMemberGuid === member.applicationMemberGuid)
      .memberExtension.workPlace = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'workPlaceOffice');

    this.policyEnrollment.policyApplicationModel.members.find(m => m.applicationMemberGuid === member.applicationMemberGuid)
      .memberExtension.performingJob = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 4).name, 'performingJobContactInfoOffice');
  }

  private fillEmailOfficeContact(member: Member) {
    const emailAddress = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 4).name, 'emailContactInfoOffice');
    if (emailAddress) {
      const indexEmail = this.policyEnrollment.policyApplicationModel.emails.findIndex(e => e.emailTypeId === EmailEnum.ALTERNATE_EMAIL);
      if (indexEmail === -1) {
        this.policyEnrollment.policyApplicationModel.emails.push(
          this.createEmails(member, EmailEnum.ALTERNATE_EMAIL, this.policyEnrollment.emailOtherGuid, emailAddress));
      } else {
        this.policyEnrollment.policyApplicationModel.emails[indexEmail] = this.createEmails(member, EmailEnum.ALTERNATE_EMAIL,
          this.policyEnrollment.policyApplicationModel.emails[indexEmail].applicationEmailGuid, emailAddress);
      }
    }
  }

  private getConfigStep(step: number): ViewTemplateStep {
    if (this.policyEnrollment.viewTemplate) {
      return this.policyEnrollment.viewTemplate.steps.find(s => s.stepNumber === step);
    } else {
      return null;
    }
  }

  private getValuesFromEnrollmentForm(stepName: string, sectionName: string, controlName: string) {
    if (this.policyEnrollment.enrollmentForm) {
      const step = this.policyEnrollment.enrollmentForm.get(stepName);
      if (step) {
        const section = step.get(sectionName);
        if (section) {
          const control = section.get(controlName);
          if (control) {
            return control.value;
          }
        }
      }
    }
    return null;
  }

}
