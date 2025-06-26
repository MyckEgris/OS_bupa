import { Injectable } from '@angular/core';
import { PolicyEnrollmentWizard } from '../entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { IdentificationTypes } from 'src/app/shared/services/policy-application/constants/identification-type.enum';
import { Identification } from 'src/app/shared/services/policy-application/entities/identification';
import { Utilities } from 'src/app/shared/util/utilities';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { Email } from 'src/app/shared/services/policy-application/entities/email';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { PhoneTypes } from 'src/app/shared/services/policy-application/constants/phone-types.enum';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
@Injectable({
  providedIn: 'root'
})
export class PolicyEnrollmentTransformOwnerService {

  private INITIAL_VALUE_ZERO = 0;
  private policyEnrollment: PolicyEnrollmentWizard;
  private OWNER_RELATION_TYPE = 2;
  private MEASURE_CONSTANT_CONVERSION = 0.45359237;
  private BASE_100 = 100;
  constructor() { }

  public transformDataFormToModel(policyEnrollment: PolicyEnrollmentWizard) {
    this.policyEnrollment = policyEnrollment;
    if (+this.policyEnrollment.currentStep === 2) {

      switch (+this.policyEnrollment.currentSection) {
        case 1: {
          this.enrichPolicyApplicationModelWithStep2Steps();
          break;
        }

        case 2: {
          this.enrichPolicyApplicationModelWithStep2Steps();
          break;
        }

        case 3: {
          this.enrichPolicyApplicationModelWithStep2Steps();
          break;
        }
      }
    }
  }

  private enrichPolicyApplicationModelWithStep2Steps() {
    this.enrichPolicyApplicationModelWithIntroductionAndPolicyData();
    this.enrichPolicyApplicationModelWithOwnerMember();
  }

  private enrichPolicyApplicationModelWithIntroductionAndPolicyData() {
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
  }

  private enrichPolicyApplicationModelWithOwnerMember() {
    const memberOwner = this.enrichPolicyApplicationModelWithOwnerMemberData();
    this.enrichPolicyApplicationModelWithEmails(memberOwner);
    this.enrichPolicyApplicationModelWithPhones(memberOwner);
    this.enrichPolicyApplicationModelWithAddresses(memberOwner);
    this.enrichPolicyApplicationModelWithIdentifications(memberOwner);
  }

  private enrichPolicyApplicationModelWithOwnerMemberData(): Member {
    let memberOwner: Member = null;
    if (!this.policyEnrollment.policyApplicationModel.members) {
      this.policyEnrollment.policyApplicationModel.members = [];
    }
    if (this.policyEnrollment.policyApplicationModel.members.length === 0) {
      memberOwner = this.getOwnerMemberFromForm(null);
      this.policyEnrollment.policyApplicationModel.members = [memberOwner];
    } else {
      this.policyEnrollment.policyApplicationModel.members.forEach(member => {
        if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
          member = this.getOwnerMemberFromForm(member);
          memberOwner = member;
        }
      });
    }

    return memberOwner;
  }

  private getOwnerMemberFromForm(member: Member): Member {
    if (!member) {
      member = {} as any;
      member.applicationMemberGuid = this.policyEnrollment.ownerMemberGuid;
      member.applicationGuid = this.policyEnrollment.policyApplicationGuid;
    }
    member.firstName = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerFirstName');
    member.middleName = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerMiddleName');
    member.paternalLastName = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerFatherLastName');
    member.maternalLastName = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerMotherLastName');
    member.lastName = `${member.paternalLastName} ${member.maternalLastName}`;
    member.dob = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerDob');
    member.genderId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerGenre');
    member.systemMeasureId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerSystemMeasureId');
    member.weight = this.getWeightCalculated();
    member.height = this.getHeightCalculated();
    member.fullTimeStudent = null;
    member.schoolName = null;
    member.usCitizenResident = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(1).sections.find(s => s.id === 1).name,
      'policyApplicationResidentQuestion').value;
    member.nationalityId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerNationality');
    member.maritalStatusId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerMaritalStatus');
    member.relationTypeId = (!member.relationTypeId) ? this.OWNER_RELATION_TYPE : member.relationTypeId;
    member.dependentRelationId = 1;
    member.ocupationId = null;
    member.previousPolicyId = null;
    member.previousMemberId = null;
    member.gender = null;
    member.systemMeasure = null;
    member.nationality = null;
    member.maritalStatus = null;
    member.relationType = null;
    member.dependentRelation = null;
    member.ocupation = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, ' employmentProfessionBusiness');
    member.sourceOfFundingId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name,
      'sourceOfFunding');
    member.otherSourceOfFunding = this.getSourceOfFundingOther();
    member.countryOfBirthId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerCob');
    member.industryId = null;
    member.patrimonialLinks = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name,
      'patrimonialLinks');
    member.countryOfResidenceId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name, 'policyOwnerCountryOfResidence');
    return member;
  }

  private getWeightCalculated() {
    const weight = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerWeight');
    const measureId = +this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerSystemMeasureId');
    if (measureId === 3) {
      return Math.floor(weight * this.MEASURE_CONSTANT_CONVERSION);
    } else {
      return weight;
    }
  }

  private getHeightCalculated() {
    const height = +this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 1).name,
      'policyOwnerHeight');
    return (height / this.BASE_100).toString();
  }

  private getSourceOfFundingOther() {
    const sourceOfFunding = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name,
      'sourceOfFunding');
    const sourceOfFundingOther = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name,
      'sourceOfFundingOther');
    if (sourceOfFunding) {
      return null;
    } else {
      if (sourceOfFundingOther) {
        return sourceOfFundingOther;
      }
      return null;
    }
  }

  private enrichPolicyApplicationModelWithEmails(member: Member) {
    if (!this.policyEnrollment.policyApplicationModel.emails) {
      this.policyEnrollment.policyApplicationModel.emails = [];
    }
    if (this.policyEnrollment.policyApplicationModel.emails.length === 0) {
      if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
        this.policyEnrollment.policyApplicationModel.emails = [this.getOwnerEmailFromForm(null, member, 1, this.policyEnrollment.emailGuid),
          this.getOwnerEmailFromForm(null, member, 11, this.policyEnrollment.emailOnlineGuid)];
      }
    } else {
      this.policyEnrollment.policyApplicationModel.emails.forEach(email => {
        if (email.contactGuid === member.applicationMemberGuid) {
          if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
            email = this.getOwnerEmailFromForm(email, member, email.emailTypeId, email.applicationEmailGuid);
          }
        }
      });
    }
  }

  private getOwnerEmailFromForm(email: Email, member: Member, emailTypeId: number, emailGuid: string) {
    if (!email) {
      email = {} as any;
      email.applicationEmailGuid = emailGuid;
      email.applicationGuid = this.policyEnrollment.policyApplicationModel.applicationGuid;
      email.contactType = this.INITIAL_VALUE_ZERO;
      email.contactGuid = member.applicationMemberGuid;
    }
    email.emailTypeId = emailTypeId;
    email.emailAddress = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name,
      'policyOwnerEmail');
    return email;
  }

  private enrichPolicyApplicationModelWithPhones(member: Member) {
    if (!this.policyEnrollment.policyApplicationModel.phones) {
      this.policyEnrollment.policyApplicationModel.phones = [];
    }
    if (this.policyEnrollment.policyApplicationModel.phones.length === 0) {
      if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
        this.policyEnrollment.policyApplicationModel.phones = [this.getOwnerPhoneFromForm(null, member)];
      } else {
        // todo: dependents
      }
    } else {
      this.policyEnrollment.policyApplicationModel.phones.forEach(phone => {
        if (phone.contactGuid === member.applicationMemberGuid) {
          if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
            phone = this.getOwnerPhoneFromForm(phone, member);
          } else {
            // todo: dependents
          }
        }
      });
    }
  }

    /**
  * Get initial phone
  */
  private getOwnerPhoneFromForm(phone: Phone, member: Member): Phone {
    if (!phone) {
      phone = {} as Phone;
      phone.applicationPhoneGuid = this.policyEnrollment.phoneGuid;
      phone.applicationGuid = this.policyEnrollment.policyApplicationModel.applicationGuid;
      phone.contactGuid = member.applicationMemberGuid;
      phone.contactType = this.INITIAL_VALUE_ZERO;
      phone.phoneTypeId = PhoneTypes.HOME;
    }
    phone.cityId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneCity');
    phone.phoneNumber = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneNumber');
    phone.ext = null;
    phone.countryId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneCountry');
    phone.areaCodeId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 2).name, 'homePhoneAreaCode');
    // phone.areaCode = this.policyEnrollment.areaCodeName;PENDIENTE
    phone.fullPhone = null;
    return phone;
  }
  private enrichPolicyApplicationModelWithAddresses(member: Member) {
    if (!this.policyEnrollment.policyApplicationModel.addresses) {
      this.policyEnrollment.policyApplicationModel.addresses = [];
    }
    if (this.policyEnrollment.policyApplicationModel.addresses.length === 0) {
      if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
        this.policyEnrollment.policyApplicationModel.addresses = [
          this.getOwnerAdressesFromForm(null, member, AddressTypes.PHYSICAL),
          this.getOwnerAdressesFromForm(null, member, AddressTypes.MAILING)];
      } else {
        // todo: dependents
      }
    } else {
      this.policyEnrollment.policyApplicationModel.addresses.forEach(address => {
        if (address.contactGuid === member.applicationMemberGuid) {
          if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
            address = this.getOwnerAdressesFromForm(address, member, address.addressTypeId);
          } else {
            // todo: dependents
          }
        }
      });
    }
  }

  private getOwnerAdressesFromForm(address: Address, member: Member, addressTypeId: number): Address {
    if (!address) {
      address = {} as any;

      address.applicationGuid = this.policyEnrollment.policyApplicationModel.applicationGuid;
      address.contactGuid = member.applicationMemberGuid;
      address.contactType = this.INITIAL_VALUE_ZERO;
      address.addressTypeId = addressTypeId;
    }

    if (address.addressTypeId === AddressTypes.PHYSICAL) {
      if (!address.applicationAddressGuid) {
        address.applicationAddressGuid = this.policyEnrollment.addressGuid;
      }

      address = this.getOwnerAddressPhysicalFromForm(address);
    }
    if (addressTypeId === AddressTypes.MAILING) {
      if (!address.applicationAddressGuid) {
        address.applicationAddressGuid = this.policyEnrollment.addressPostalGuid;
      }

      if (this.policyEnrollment.diffAddressHomeMail) {
        address = this.getOwnerAddressMailingFromForm(address);
      } else {
        address = this.getOwnerAddressPhysicalFromForm(address);
      }
    }
    return address;
  }

  private getOwnerAddressPhysicalFromForm(address: Address): Address {
    address.addressLine1 = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'streetAvenueHome') + ' ' +
      this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'insideNumberHome') + ' ' +
      this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name, 'outsideNumberHome');
    address.zip = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'zipCodeHome');
    address.colonyId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'colonyHome');
    address.state = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'stateHome');
    address.municipality = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'mayoraltyMunicipalityHome').municipalityName;
    address.interior = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'insideNumberHome');
    address.exterior = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'outsideNumberHome');
    address.countryId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'countryHome').countryId;
    address.localityId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'localityHome');
    address.cityId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'mayoraltyMunicipalityHome').cityId;
    address.street = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'streetAvenueHome');
    return address;
  }

  private getOwnerAddressMailingFromForm(address: Address): Address {
    address.zip = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'zipCodeMail');
    address.colonyId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'colonyMail');
    address.state = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'stateMail');
    address.municipality = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'mayoraltyMunicipalityMail').municipalityName;
    address.addressLine1 = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'streetAvenueMail') + ' ' + this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name,
        'insideNumberMail') + ' ' + this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
          this.getConfigStep(2).sections.find(s => s.id === 3).name,
          'outsideNumberMail');
    address.interior = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'insideNumberMail');
    address.exterior = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'outsideNumberMail');
    address.countryId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'countryMail');
    address.localityId = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'localityMail');
    address.cityId = (this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name,
      'mayoraltyMunicipalityMail')) ? this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 3).name,
        'mayoraltyMunicipalityMail').cityId : this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
          this.getConfigStep(2).sections.find(s => s.id === 3).name,
          'cityMail');
    address.street = this.getValuesFromEnrollmentForm(this.getConfigStep(2).type,
      this.getConfigStep(2).sections.find(s => s.id === 3).name, 'streetAvenueMail');
    return address;
  }

  private enrichPolicyApplicationModelWithIdentifications(member: Member) {
    // aqui hay que asignar CURP y RFC, Numero de Serie de Certificado
    // esto esta en el paso 2.2 ( en la parte central)
    if (!this.policyEnrollment.policyApplicationModel.identifications) {
      this.policyEnrollment.policyApplicationModel.identifications = [];
    }
    if (this.policyEnrollment.policyApplicationModel.identifications.length === 0) {
      if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
        const appIdentificationRfc = this.getOwnerIdentificationFromForm(null, member, IdentificationTypes.RFC);
        if (appIdentificationRfc) {
          this.policyEnrollment.policyApplicationModel.identifications.push(appIdentificationRfc);
        }

        const appIdentificationCurp = this.getOwnerIdentificationFromForm(null, member,
          IdentificationTypes.CURP);
        if (appIdentificationCurp) {
          this.policyEnrollment.policyApplicationModel.identifications.push(appIdentificationCurp);
        }

        const appIdentificationSerailNumber = this.getOwnerIdentificationFromForm(null, member, IdentificationTypes.SERIAL_NUMBER);
        if (appIdentificationSerailNumber) {
          this.policyEnrollment.policyApplicationModel.identifications.push(appIdentificationSerailNumber);
        }
      } else {
        // todo: dependents
      }
    } else {
      this.policyEnrollment.policyApplicationModel.identifications.forEach(identification => {
        if (identification.contactGuid === member.applicationMemberGuid) {
          if (member.relationTypeId === this.OWNER_RELATION_TYPE) {
            identification = this.getOwnerIdentificationFromForm(identification, member, identification.identificationTypeId);
          } else {
            // todo: dependents
          }
        }
      });
    }
  }

  private getOwnerIdentificationFromForm(identification: Identification, member: Member, identificationTypeId: number): Identification {
    if (!identification) {
      identification = {} as any;
      identification.applicationGuid = this.policyEnrollment.policyApplicationModel.applicationGuid;
      identification.contactType = this.INITIAL_VALUE_ZERO;
      identification.contactGuid = member.applicationMemberGuid;
      identification.identificationTypeId = identificationTypeId;
    }
    if (identificationTypeId === IdentificationTypes.RFC) {
      if (!identification.applicationIdentificationGuid) {
        identification.applicationIdentificationGuid = this.policyEnrollment.applicationIdentificationRUPGuid;
      }
      identification.identificationNumber = this.getValuesFromEnrollmentForm(
        this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name,
        'policyOwnerRFC');
    }

    if (identificationTypeId === IdentificationTypes.CURP) {
      if (!identification.applicationIdentificationGuid) {
        identification.applicationIdentificationGuid = this.policyEnrollment.applicationIdentificationCURPGuid;
      }
      identification.identificationNumber = this.getValuesFromEnrollmentForm(
        this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name,
        'policyOwnerCURP');
    }

    if (identificationTypeId === IdentificationTypes.SERIAL_NUMBER) {
      if (!identification.applicationIdentificationGuid) {
        identification.applicationIdentificationGuid = this.policyEnrollment.applicationIdentificationSNGuid;
      }
      identification.identificationNumber = this.getValuesFromEnrollmentForm(
        this.getConfigStep(2).type,
        this.getConfigStep(2).sections.find(s => s.id === 2).name,
        'serialOfNumberCertificate');
    }

    return identification;
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
