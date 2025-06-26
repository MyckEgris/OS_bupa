import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PetitionerInformation } from 'src/app/shared/services/policy-application/entities/petitioner-information';
import { Person } from 'src/app/shared/services/policy-application/entities/person';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { PetitionerExtension } from 'src/app/shared/services/policy-application/entities/petitioner-extension';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { Email } from 'src/app/shared/services/policy-application/entities/email';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Utilities } from 'src/app/shared/util/utilities';

@Injectable({
  providedIn: 'root'
})
export class TransformPetitionerService {

  private petitionerGuids = {
    petitioner: '',
    person: '',
    address: '',
    phone: '',
    email: ''
  };

  constructor(private commonService: CommonService) { }

  private async createGuidsPetitioner() {
    this.petitionerGuids.petitioner = await this.createGuid();
    this.petitionerGuids.person = await this.createGuid();
    this.petitionerGuids.address = await this.createGuid();
    this.petitionerGuids.email = await this.createGuid();
    this.petitionerGuids.phone = await this.createGuid();
  }

  async createGuid() {
    return await this.commonService.newGuidNuevo().toPromise();
  }

  public async assignGuids(policyAppModel: PolicyApplicationModel) {
    if (policyAppModel.petitioner) {
      this.petitionerGuids.petitioner = policyAppModel.petitioner.applicationPetitionerGuid ?
        policyAppModel.petitioner.applicationPetitionerGuid : await this.createGuid();

      this.petitionerGuids.person = policyAppModel.petitioner.person && policyAppModel.petitioner.person.applicationPersonPetitionerGuid ?
        policyAppModel.petitioner.person.applicationPersonPetitionerGuid : await this.createGuid();

      this.petitionerGuids.address = policyAppModel.petitioner.addresses && policyAppModel.petitioner.addresses.length > 0 ?
        policyAppModel.petitioner.addresses[0].applicationAddressGuid : await this.createGuid();

      this.petitionerGuids.email = policyAppModel.petitioner.emails && policyAppModel.petitioner.emails.length > 0 ?
        policyAppModel.petitioner.emails[0].applicationEmailGuid : await this.createGuid();

      this.petitionerGuids.phone = policyAppModel.petitioner.phones && policyAppModel.petitioner.phones.length > 0 ?
        policyAppModel.petitioner.phones[0].applicationPhoneGuid : await this.createGuid();
    } else {
      await this.createGuidsPetitioner();
    }
  }

  createPetitioner(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel) {
    if (policyAppModel.petitionerTypeId === PetitionerType.INDIVIDUAL || policyAppModel.petitionerTypeId === PetitionerType.POLICY_HOLDER) {
      if (!policyAppModel.petitioner) {
        policyAppModel.petitioner = this.createGeneralPetitioner(formPetitioner, policyAppModel);
        const petitonerMember = this.getMemberPetitioner(policyAppModel);
        if (this.checkIfPetitionerIsOwner(petitonerMember)) {
          this.addContactInformationOwner(petitonerMember, policyAppModel);
        }
      } else {
        policyAppModel.petitioner = this.updateGeneralPetitioner(formPetitioner, policyAppModel);
        if (!policyAppModel.petitioner.person) {
          this.cleanPetitionerContactData(policyAppModel);
        }

        const existsContact = formPetitioner.get('policyApplicationPetitionerContact');
        if (existsContact) {
          this.addContactInformationDependent(formPetitioner, policyAppModel);
        } else {
          const petitonerMember = this.getMemberPetitioner(policyAppModel);
          if (this.checkIfPetitionerIsOwner(petitonerMember)) {
            this.cleanPetitionerContactData(policyAppModel);
            this.addContactInformationOwner(petitonerMember, policyAppModel);
          }
        }
      }
      const member = this.getMemberPetitioner(policyAppModel);
      policyAppModel.petitioner.industryId = member.industryId;
    }
  }

  cleanPetitionerContactData(policyAppModel) {
    policyAppModel.petitioner.addresses.length = 0;
    policyAppModel.petitioner.phones.length = 0;
    policyAppModel.petitioner.emails.length = 0;
    policyAppModel.petitioner.identifications.length = 0;
  }

  getMemberPetitioner(policyAppModel: PolicyApplicationModel) {
    return policyAppModel.members.find(x => x.applicationMemberGuid === policyAppModel.petitioner.person.applicationPersonPetitionerGuid);
  }

  addContactInformationOwner(member: Member, policyAppModel: PolicyApplicationModel) {
    const memberGuid = member.applicationMemberGuid;
    const ownerAddress = policyAppModel.addresses.filter(x => x.contactGuid === memberGuid && x.addressTypeId === 4);
    if (ownerAddress) {
      ownerAddress.forEach(address => {
        policyAppModel.petitioner.addresses.push(address);
      });
    }

    const ownerPhones = policyAppModel.phones.filter(x => x.contactGuid === memberGuid && x.phoneTypeId === 1001);
    if (ownerPhones) {
      ownerPhones.forEach(phone => {
        policyAppModel.petitioner.phones.push(phone);
      });
    }

    const ownerEmails = policyAppModel.emails.filter(x => x.contactGuid === memberGuid && x.emailTypeId === 2);
    if (ownerEmails) {
      policyAppModel.petitioner.emails = ownerEmails;
      ownerEmails.forEach(email => {
        policyAppModel.petitioner.emails.push(email);
      });
    }

    const ownerIdentifications = policyAppModel.identifications.filter(x => x.identificationTypeId === 4);
    if (ownerIdentifications) {
      ownerIdentifications.forEach(identification => {
        policyAppModel.petitioner.identifications.push(identification);
      });
    }
  }

  addContactInformationDependent(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel) {
    this.completeInfo(formPetitioner, policyAppModel);
    policyAppModel.petitioner.addresses = this.addOfficeAddress(formPetitioner, policyAppModel);
    policyAppModel.petitioner.emails = this.addContactEmail(formPetitioner, policyAppModel);
    policyAppModel.petitioner.phones = this.addContactPhone(formPetitioner, policyAppModel);
  }

  createGeneralPetitioner(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel): PetitionerInformation {
    const formPetitionerInfo = formPetitioner.get('policyApplicationPetitionerPersonalInfo') as FormGroup;
    return {
      applicationPetitionerGuid: formPetitionerInfo.get('guidPetitioner').value,
      applicationGuid: policyAppModel.applicationGuid,
      petitionerTypeId: +policyAppModel.petitionerTypeId,
      petitionerType: '',
      sourceOfFunding: '',
      otherSourceOfFounding: '',
      industry: '',
      company: null,
      person: this.createPersonPetitioner(formPetitioner, policyAppModel),
      addresses: [],
      phones: [],
      emails: [],
      identifications: []
    };
  }

  updateGeneralPetitioner(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel): PetitionerInformation {
    const petitioner = policyAppModel.petitioner;
    petitioner.person = this.updatePersonPetitioner(formPetitioner, policyAppModel);
    return petitioner;
  }

  checkIfPetitionerIsOwner(member: Member) {
    return (member.relationTypeId === 2 || member.relationTypeId === 5);
  }

  createPersonPetitioner(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel): Person {
    const formPetitionerInfo = formPetitioner.get('policyApplicationPetitionerPersonalInfo') as FormGroup;
    const member = this.getPetitionerForSelectedMember(formPetitioner, policyAppModel);
    if (member) {
      return {
        applicationPersonPetitionerGuid: member.applicationMemberGuid,
        applicationPetitionerGuid: formPetitionerInfo.get('guidPetitioner').value,
        firstName: member.firstName,
        middleName: member.middleName,
        lastName: member.lastName,
        paternalLastName: member.paternalLastName,
        maternalLastName: member.maternalLastName,
        dob: member.dob,
        genderId: member.genderId,
        patrimonialLinks: member.patrimonialLinks,
        nationalityId: member.nationalityId,
        countryOfBirthId: member.countryOfBirthId,
        petitionerExtension: this.createPersonExtension(formPetitioner, policyAppModel, member)
      };
    } else {
      return null;
    }
  }

  updatePersonPetitioner(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel): Person {
    return this.createPersonPetitioner(formPetitioner, policyAppModel);
  }

  createPersonExtension(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel, member: Member): PetitionerExtension {
    if (this.checkIfPetitionerIsOwner(member)) {
      // this.addContactInformationOwner(member, policyAppModel);
      return this.createPersonExtensionOwner(member);
    } else {
      const formPetitionerInfo = formPetitioner.get('policyApplicationPetitionerPersonalInfo') as FormGroup;
      return {
        isUsResident: (formPetitionerInfo.get('policyApplicationResidentQuestion').value === 'true'),
        averageAnnualIncome: formPetitionerInfo.get('averageAnnualIncome').value,
        placeWherePayTaxes: formPetitionerInfo.get('placeWherePayTaxes').value,
        isPEP: (formPetitionerInfo.get('isPEP').value === 'true'),
        associatedPEP: (formPetitionerInfo.get('associatedPEP').value === 'true'),
        relationshipPEP: (formPetitionerInfo.get('relationshipPEP').value === 'true'),
        performingJob: this.getPerformingJob(formPetitioner, policyAppModel),
        workPlace: this.getWorkplace(formPetitioner, policyAppModel)
      };
    }
  }

  createPersonExtensionOwner(member: Member): PetitionerExtension {
    return {
      isUsResident: member.usCitizenResident,
      averageAnnualIncome: member.memberExtension.averageAnnualIncome,
      placeWherePayTaxes: member.memberExtension.placeWherePayTaxes,
      isPEP: member.memberExtension.isPEP,
      associatedPEP: member.memberExtension.associatedPEP,
      relationshipPEP: member.memberExtension.relationshipPEP,
      performingJob: member.memberExtension.performingJob,
      workPlace: member.memberExtension.workPlace
    };
  }

  getPerformingJob(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel) {
    const contactForm = formPetitioner.get('policyApplicationPetitionerContact');
    if (contactForm) {
      return contactForm.get('performingJobContactInfoOffice').value;
    }

    if (policyAppModel.petitioner && policyAppModel.petitioner.person &&
      policyAppModel.petitioner.person.petitionerExtension && policyAppModel.petitioner.person.petitionerExtension.performingJob) {
      return policyAppModel.petitioner.person.petitionerExtension.performingJob;
    }

    return '';
  }

  getWorkplace(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel) {
    const contactForm = formPetitioner.get('policyApplicationPetitionerContact');
    if (contactForm) {
      return contactForm.get('workPlaceOffice').value;
    }

    if (policyAppModel.petitioner && policyAppModel.petitioner.person &&
      policyAppModel.petitioner.person.petitionerExtension && policyAppModel.petitioner.person.petitionerExtension.workPlace) {
      return policyAppModel.petitioner.person.petitionerExtension.workPlace;
    }

    return '';
  }

  getPetitionerForSelectedMember(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel): Member {
    if (formPetitioner.get('policyApplicationPetitionerPersonalInfo').get('question').value === 'true') {
      const selectedMember = formPetitioner.get('policyApplicationPetitionerPersonalInfo').get('petitionerName').value;
      return policyAppModel.members ? policyAppModel.members.find(x => x.applicationMemberGuid === selectedMember) : null;
    } else {
      return policyAppModel.members ? policyAppModel.members.find(x => x.relationTypeId === 2 || x.relationTypeId === 5) : null;
    }
  }

  addOfficeAddress(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel): Address[] {
    const formPetitionerInfo = formPetitioner.get('policyApplicationPetitionerPersonalInfo') as FormGroup;
    const formPetitionerContact = formPetitioner.get('policyApplicationPetitionerContact') as FormGroup;
    if (formPetitionerContact.get('addressOffice') && formPetitionerContact.get('addressOffice').value !== '') {
      const address: Address = {
        applicationAddressGuid: formPetitionerContact.get('guidAddress').value,
        applicationGuid: policyAppModel.applicationGuid,
        contactType: 2,
        contactGuid: formPetitionerInfo.get('guidPetitioner').value,
        addressTypeId: 2,
        addressLine1: formPetitionerContact.get('addressOffice') ? formPetitionerContact.get('addressOffice').value : '',
        addressLine2: null,
        street: formPetitionerContact.get('addressOffice') ? formPetitionerContact.get('addressOffice').value : '',
        interior: '',
        exterior: '',
        cityId: formPetitionerContact.get('cityOffice') ? formPetitionerContact.get('cityOffice').value : null,
        state: formPetitionerContact.get('provinceOffice') ? formPetitionerContact.get('provinceOffice').value : null,
        zip: formPetitionerContact.get('postalCodeOffice') ? formPetitionerContact.get('postalCodeOffice').value : null,
        countryId: formPetitionerContact.get('countryOffice') ? formPetitionerContact.get('countryOffice').value : null,
        colonyId: null,
        municipality: '',
        localityId: null,
        addressType: 'OFFICE_CONTACT',
        colony: null,
        city: null,
        country: null,
        yearsInAddress: null
      };

      return [address];
    }

    return [];
  }

  addContactPhone(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel): Phone[] {
    const formPetitionerContact = formPetitioner.get('policyApplicationPetitionerContact') as FormGroup;
    const formPetitionerInfo = formPetitioner.get('policyApplicationPetitionerPersonalInfo') as FormGroup;
    if (formPetitionerContact.get('phoneNumberContactInfoOffice') &&
      formPetitionerContact.get('phoneNumberContactInfoOffice').value !== '') {
      const phone: Phone = {
        applicationPhoneGuid: formPetitionerContact.get('guidContactPhone').value,
        applicationGuid: policyAppModel.applicationGuid,
        contactType: 2,
        contactGuid: formPetitionerInfo.get('guidPetitioner').value,
        phoneTypeId: 1001,
        ext: formPetitionerContact.get('extensionContactInfoOffice') ?
          formPetitionerContact.get('extensionContactInfoOffice').value : '',
        countryId: formPetitionerContact.get('countryContactInfoOffice') ?
          formPetitionerContact.get('countryContactInfoOffice').value : null,
        areaCodeId: formPetitionerContact.get('areaCodeContactInfoOffice') ?
          formPetitionerContact.get('areaCodeContactInfoOffice').value : null,
        phoneType: 'OFFICE',
        areaCode: '',
        fullPhone: '',
        cityId: formPetitionerContact.get('cityContactInfoOffice') ?
          formPetitionerContact.get('cityContactInfoOffice').value : null,
        phoneNumber: formPetitionerContact.get('phoneNumberContactInfoOffice') ?
          formPetitionerContact.get('phoneNumberContactInfoOffice').value : ''
      };

      return [phone];
    }

    return [];
  }

  addContactEmail(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel): Email[] {
    const formPetitionerContact = formPetitioner.get('policyApplicationPetitionerContact') as FormGroup;
    const formPetitionerInfo = formPetitioner.get('policyApplicationPetitionerPersonalInfo') as FormGroup;
    if (formPetitionerContact.get('emailContactInfoOffice') && formPetitionerContact.get('emailContactInfoOffice').value !== '') {
      const email: Email = {
        applicationEmailGuid: formPetitionerContact.get('guidContactEmail').value,
        applicationGuid: policyAppModel.applicationGuid,
        contactType: 0,
        contactGuid: formPetitionerInfo.get('guidPetitioner').value,
        emailTypeId: 2,
        emailAddress: formPetitionerContact.get('emailContactInfoOffice') ?
          formPetitionerContact.get('emailContactInfoOffice').value : null,
        emailType: 'Alternate Email'
      };

      return [email];
    }

    return [];
  }

  completeInfo(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel) {
    const existsContact = formPetitioner.get('policyApplicationPetitionerContact');
    if (existsContact) {
      policyAppModel.petitioner.person.petitionerExtension.performingJob = existsContact.get('performingJobContactInfoOffice').value;
      policyAppModel.petitioner.person.petitionerExtension.workPlace = existsContact.get('workPlaceOffice').value;
    }
  }

  cleanAddressPhoneEmail(policyAppModel: PolicyApplicationModel) {
    policyAppModel.petitioner.addresses.length = 0;
    policyAppModel.petitioner.phones.length = 0;
    policyAppModel.petitioner.emails.length = 0;
  }

}
