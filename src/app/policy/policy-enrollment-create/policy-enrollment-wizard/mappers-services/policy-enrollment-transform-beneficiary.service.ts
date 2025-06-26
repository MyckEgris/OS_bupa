import { Injectable } from '@angular/core';
import { PolicyEnrollmentWizard } from '../entities/policy-enrollment-wizard';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Beneficiary } from 'src/app/shared/services/policy-application/entities/beneficiary';
import { Identification } from 'src/app/shared/services/policy-application/entities/identification';
import { Email } from 'src/app/shared/services/policy-application/entities/email';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
@Injectable({
  providedIn: 'root'
})
export class PolicyEnrollmentTransformBeneficiaryService {

  private INITIAL_VALUE_ZERO = 0;
  private policyEnrollment: PolicyEnrollmentWizard;
  private insuranceBupaIdECU = 39;
  constructor() { }

  public transformDataFormToModel(policyEnrollment: PolicyEnrollmentWizard) {
    this.policyEnrollment = policyEnrollment;
    let phone: Phone;
    let cellPhone: Phone;
    let address: Address;
    let identification: Identification;
    if (this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 1).name, 'question') === 'false') {
      this.policyEnrollment.policyApplicationModel.beneficiary = null;
    } else {
      if (!this.policyEnrollment.policyApplicationModel.beneficiary) {
        this.policyEnrollment.policyApplicationModel.beneficiary = {} as Beneficiary;
        this.policyEnrollment.policyApplicationModel.beneficiary.applicationGuid =
          this.policyEnrollment.policyApplicationModel.applicationGuid;
        this.policyEnrollment.policyApplicationModel.beneficiary.applicationBeneficiaryGuid =
          this.policyEnrollment.beneficiaryGuid;
        this.policyEnrollment.policyApplicationModel.beneficiary.addresses = [];
        this.policyEnrollment.policyApplicationModel.beneficiary.phones = [];
      }
      this.policyEnrollment.policyApplicationModel.beneficiary.firstName = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 1).name, 'firstName');
      this.policyEnrollment.policyApplicationModel.beneficiary.middleName = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 1).name, 'secondName');
      this.policyEnrollment.policyApplicationModel.beneficiary.paternalLastName = this.getValuesFromEnrollmentForm(
        this.getConfigStep(6).type, this.getConfigStep(6).sections.find(s => s.id === 1).name, 'surname');
      this.policyEnrollment.policyApplicationModel.beneficiary.maternalLastName = this.getValuesFromEnrollmentForm(
        this.getConfigStep(6).type, this.getConfigStep(6).sections.find(s => s.id === 1).name, 'secondSurname');
      this.policyEnrollment.policyApplicationModel.beneficiary.dob = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 1).name, 'dob');
      this.policyEnrollment.policyApplicationModel.beneficiary.lastName = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 1).name, 'surname') + ' ' +
        this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
          this.getConfigStep(6).sections.find(s => s.id === 1).name, 'secondSurname');

      if (this.policyEnrollment.policyApplicationModel.beneficiary.phones &&
        this.policyEnrollment.policyApplicationModel.beneficiary.phones.length > 0) {
        phone = this.policyEnrollment.policyApplicationModel.beneficiary.phones.find(phoneFind => phoneFind.phoneTypeId === 1000);
        cellPhone = this.policyEnrollment.policyApplicationModel.beneficiary.phones.find(phoneFind => phoneFind.phoneTypeId === 1004);
        phone = this.getContactPhoneBeneficiary(phone);
        cellPhone = this.getContactCellPhoneBeneficiary(cellPhone);
        this.policyEnrollment.policyApplicationModel.beneficiary.phones = [phone, cellPhone];
      } else {
        phone = this.getContactPhoneBeneficiary(phone);
        cellPhone = this.getContactCellPhoneBeneficiary(cellPhone);
        this.policyEnrollment.policyApplicationModel.beneficiary.phones = [phone, cellPhone];
      }

      address = this.policyEnrollment.policyApplicationModel.beneficiary.addresses.find(a => a.contactType === 2);
      this.policyEnrollment.policyApplicationModel.beneficiary.addresses = [this.getHomeAddressBeneficiary(address)];

      if (this.policyEnrollment.policyApplicationModel.beneficiary.identifications) {
        identification = this.policyEnrollment.policyApplicationModel.beneficiary.identifications.find(i => i.contactType === 0);
        this.policyEnrollment.policyApplicationModel.beneficiary.identifications = [this.getIdentificationsBeneficiary(identification)];
      } else {
        this.policyEnrollment.policyApplicationModel.beneficiary.identifications = [this.getIdentificationsBeneficiary(identification)];
      }

      if (+this.policyEnrollment.user.bupa_insurance === this.insuranceBupaIdECU) {
        if (this.policyEnrollment.policyApplicationModel.beneficiary.emails &&
          this.policyEnrollment.policyApplicationModel.beneficiary.emails.length > 0) {
            this.policyEnrollment.policyApplicationModel.beneficiary.emails.find(c => c.contactGuid ===
              this.policyEnrollment.policyApplicationModel.beneficiary.applicationBeneficiaryGuid).emailAddress =
                this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
                this.getConfigStep(6).sections.find(s => s.id === 2).name, 'email');
        } else {
          this.policyEnrollment.policyApplicationModel.beneficiary.emails =
            [this.getEmailDataContact(this.policyEnrollment.beneficiaryEmailGuid,
              this.policyEnrollment.policyApplicationModel.beneficiary.applicationBeneficiaryGuid)];
        }

        this.policyEnrollment.policyApplicationModel.beneficiary.relationOwner = this.getValuesFromEnrollmentForm(
          this.getConfigStep(6).type, this.getConfigStep(6).sections.find(s => s.id === 1).name, 'relationCustomer');

      }
    }
  }

  private getContactPhoneBeneficiary(phone: Phone): Phone {
    if (!phone) {
      phone = {} as Phone;
      phone.applicationPhoneGuid = this.policyEnrollment.beneficiaryPhoneNumberGuid;
      phone.applicationGuid = this.policyEnrollment.policyApplicationModel.applicationGuid;
    }
    phone.contactType = 2,
      phone.phoneTypeId = 1000,
      phone.phoneNumber = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 2).name, 'phoneNumber');
    phone.ext = null,
      phone.countryId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 2).name, 'countryContactPhone');
    phone.cityId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 2).name, 'cityContactPhone');
    phone.areaCodeId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 2).name, 'areaCode');
    phone.areaCode = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 2).name, 'areaCode');
    phone.fullPhone = null;
    phone.phoneType = null;
    phone.contactGuid = this.policyEnrollment.beneficiaryGuid;
    return phone;
  }

  private getContactCellPhoneBeneficiary(phone: Phone): Phone {
    if (!phone) {
      phone = {} as Phone;
      phone.applicationPhoneGuid = this.policyEnrollment.beneficiaryCellPhoneNumberGuid;
      phone.applicationGuid = this.policyEnrollment.policyApplicationModel.applicationGuid;
    }
    phone.contactType = 2,
      phone.phoneTypeId = 1004,
      phone.phoneNumber = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 2).name, 'cellPhoneNumber');
    phone.ext = null,
      phone.countryId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 2).name, 'countryContactPhone');
    phone.cityId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 2).name, 'cityContactPhone');
    phone.areaCodeId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 2).name, 'areaCode');
    phone.areaCode = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 2).name, 'areaCode');
    phone.fullPhone = null;
    phone.phoneType = null;
    phone.contactGuid = this.policyEnrollment.beneficiaryGuid;
    return phone;
  }

  private getHomeAddressBeneficiary(address: Address): Address {
    if (!address) {
      address = {} as Address;
      address.applicationGuid = this.policyEnrollment.policyApplicationModel.applicationGuid;
      address.applicationAddressGuid = this.policyEnrollment.beneficiaryAddressGuid;
    }
    address.contactType = 2,
      address.addressTypeId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 4).name, 'addressType');
    address.zip = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'zipCode');
    address.colonyId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'colony');
    address.state = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'state');
    address.municipality = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'mayoralMunicipality');
    address.interior = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'insideNumber');
    address.exterior = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'outsideNumber');
    address.countryId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'countryHomeAddress');
    address.localityId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'locality');
    address.cityId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'cityHomeAddress');
    address.addressLine1 = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'streeAvenue') + ' ' +
      this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 3).name, 'insideNumber') + ' ' +
      this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 3).name, 'outsideNumber');
    address.addressLine2 = null,
      address.addressType = null,
      address.city = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 3).name, 'cityHomeAddress');
    address.contactGuid = this.policyEnrollment.beneficiaryGuid,
      address.country = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 3).name, 'countryHomeAddress');
    address.colony = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'colony');
    address.street = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 3).name, 'streeAvenue');
    return address;
  }

  private getIdentificationsBeneficiary(identification: Identification): Identification {
    if (!identification) {
      identification = {} as Identification;
      identification.applicationGuid = this.policyEnrollment.policyApplicationModel.applicationGuid;
      identification.applicationIdentificationGuid = this.policyEnrollment.beneficiaryIdentificationGuid;
    }
    identification.contactType = 0,
    identification.identificationTypeId = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 1).name, 'typeOfDocument');
    identification.identificationNumber = this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
      this.getConfigStep(6).sections.find(s => s.id === 1).name, 'numberOfDocument');
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

  private getEmailDataContact(emailGuid: string, contactGuid: string) {
    const email: Email =  {
      applicationEmailGuid: emailGuid,
      applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
      contactType: this.INITIAL_VALUE_ZERO,
      emailTypeId: EmailEnum.OTHER_EMAIL,
      emailAddress: this.getValuesFromEnrollmentForm(this.getConfigStep(6).type,
        this.getConfigStep(6).sections.find(s => s.id === 2).name, 'email'),
      contactGuid: contactGuid,
      emailType: ''
    };
    return email;
  }
}
