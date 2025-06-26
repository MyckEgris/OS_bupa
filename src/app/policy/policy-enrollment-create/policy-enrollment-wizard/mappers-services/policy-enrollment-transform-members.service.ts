import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { FormArray, FormGroup } from '@angular/forms';
import { Identification } from 'src/app/shared/services/policy-application/entities/identification';
import { IdentificationTypes } from 'src/app/shared/services/policy-application/constants/identification-type.enum';
import { Email } from 'src/app/shared/services/policy-application/entities/email';
import { InfoContactMember } from 'src/app/shared/services/policy-application/entities/info-contact-member';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { PhoneTypes } from 'src/app/shared/services/policy-application/constants/phone-types.enum';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { Injectable } from '@angular/core';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { MeasurementConversionService } from 'src/app/shared/services/policy-application/helpers/measurement-conversion.service';
import { MemberExtension } from 'src/app/shared/services/policy-application/entities/member-extension';
@Injectable({
  providedIn: 'root'
})
export class PolicyEnrollmentTransformMembersService {

  private STRING_EMPTY = '';
  private INITIAL_VALUE_ZERO = 0;

  private OWNER_GUID = null;

  public deletedMembersGUID: Array<string> = [];
  /**** 3-kilos-metros, 4-libras-metros */
  private MEASURE_SYSTEM_KG_MTS = 3;
  constructor(private auth: AuthService,
    private measurementConversionService: MeasurementConversionService) { }

  public createMembers(formArrayMember: FormArray, policyApplicationModel: PolicyApplicationModel) {
    this.OWNER_GUID = policyApplicationModel.members.find(o => o.relationTypeId === RelationType.OWNER).applicationMemberGuid;
    this.removeMembers(policyApplicationModel);
    this.createUpdateInfoMember(formArrayMember, policyApplicationModel);
  }

  public createUpdateInfoMember(formArrayMember: FormArray, policyApplicationModel: PolicyApplicationModel) {
    formArrayMember.controls.map((m: FormGroup) => {
      const infoMember = m.get('policyAppInfoDependents') as FormGroup;
      const guidMember = m.get('GUID').value;
      const formInfoContact = m.get('policyAppContactDependents') !== null ?
        m.get('policyAppContactDependents') as FormGroup : null;
      const formInfoAddress = m.get('policyAppAddressDependents') !== null ?
        m.get('policyAppAddressDependents') as FormGroup : null;

      this.createUpdateMember(policyApplicationModel, infoMember, guidMember);

      if (InsuranceBusiness.BUPA_MEXICO === +this.auth.getUser().bupa_insurance) {
        this.createUpdateIdentifications(policyApplicationModel, infoMember, 'guidRFC', guidMember, 'rfc', IdentificationTypes.RFC);
      this.createUpdateIdentifications(policyApplicationModel, infoMember, 'guidCURP',
        guidMember, 'curp', IdentificationTypes.CURP);
      this.createUpdateIdentifications(policyApplicationModel, infoMember, 'guidNroSerie',
        guidMember, 'serialOfNumberCertificate', IdentificationTypes.SERIAL_NUMBER);
      }

      if (InsuranceBusiness.BUPA_PANAMA === +this.auth.getUser().bupa_insurance) {
        this.createUpdateIdentifications(policyApplicationModel, infoMember, 'guidDep', guidMember, 'numberAndExtension',
        infoMember.get('typeOfDocument').value);
      }
      // Email
      const dependentEmail = infoMember.get('email') ? infoMember.get('email').value : '';
      if (dependentEmail && dependentEmail !== '') {
        // For members only save the preferred email
        // this.createUpdateEmail(policyApplicationModel, infoMember, guidMember, dependentEmail,
        //   EmailEnum.ONLINE_SERVICES_EMAIL, 'guidEmailOnline');
        this.createUpdateEmail(policyApplicationModel, infoMember, guidMember, dependentEmail,
          EmailEnum.PREFERRED_EMAIL, 'guidEmailPrefered');
      }
      const diffInfoContactAddress: boolean = infoMember.get('diffInfoContactAddress').value;
      if (diffInfoContactAddress) {
        // Phone
        const infoContact = this.setInfoContact(formInfoContact, policyApplicationModel);
        this.createUpdatePhone(policyApplicationModel, infoMember, guidMember, infoContact);

        // Address
        const address = this.setInfoAddress(formInfoAddress, policyApplicationModel);
        this.createUpdateAddress(policyApplicationModel, infoMember, guidMember, address);
      } else { // We dont need save Info contact and Info address (And if exists we must be delete it)
        // To remove address
        if (policyApplicationModel.addresses.find(me => me.contactGuid === guidMember)) {
          policyApplicationModel.addresses.splice(policyApplicationModel.addresses.indexOf(
              policyApplicationModel.addresses.find(me => me.contactGuid === guidMember)), 1);
        }
        // To remove phone
        if (policyApplicationModel.phones.find(me => me.contactGuid === guidMember)) {
          policyApplicationModel.phones.splice(policyApplicationModel.phones.indexOf(
              policyApplicationModel.phones.find(me => me.contactGuid === guidMember)), 1);
        }
      }
    });
  }

  private removeMembers(policyApplicationModel: PolicyApplicationModel) {
    this.deletedMembersGUID.forEach(
      a => {
        if (policyApplicationModel.members.find(me => me.applicationMemberGuid === a)) {
          policyApplicationModel.members.splice(
            policyApplicationModel.members.indexOf(
              policyApplicationModel.members.find(me => me.applicationMemberGuid === a)), 1);
        }

        if (policyApplicationModel.identifications.find(me => me.contactGuid === a)) {
          policyApplicationModel.identifications.splice(
            policyApplicationModel.identifications.indexOf(
              policyApplicationModel.identifications.find(me => me.contactGuid === a)), 1);
        }


        policyApplicationModel.emails.filter(em => em.contactGuid === a).forEach(
          c => {
            if (policyApplicationModel.emails.find(me => me.contactGuid === a)) {
              policyApplicationModel.emails.splice(
                policyApplicationModel.emails.indexOf(
                  policyApplicationModel.emails.find(me => me.contactGuid === a)), 1);
            }
          }
        );

        if (policyApplicationModel.phones.find(me => me.contactGuid === a)) {
          policyApplicationModel.phones.splice(
            policyApplicationModel.phones.indexOf(
              policyApplicationModel.phones.find(me => me.contactGuid === a)), 1);
        }

        if (policyApplicationModel.addresses.find(me => me.contactGuid === a)) {
          policyApplicationModel.addresses.splice(
            policyApplicationModel.addresses.indexOf(
              policyApplicationModel.addresses.find(me => me.contactGuid === a)), 1);
        }
      }
    );
  }

  private createUpdateMember(policyApplicationModel: PolicyApplicationModel, infoMember: FormGroup, guidMember: string) {
    const indexMember = policyApplicationModel.members.indexOf(
      policyApplicationModel.members.find(me => me.applicationMemberGuid === guidMember));
    if (indexMember !== -1) {
      policyApplicationModel.members[indexMember] =
        this.getInfoMember(policyApplicationModel, infoMember, guidMember);
    } else {
      policyApplicationModel.members.push(this.getInfoMember(policyApplicationModel, infoMember, guidMember));
    }
  }

  private getInfoMember(policyApplicationModel: PolicyApplicationModel, infoMember: FormGroup, guidMember: string): Member {
    return {
      applicationGuid: policyApplicationModel.applicationGuid,
      applicationMemberGuid: guidMember,
      contactBaseId: null,
      countryOfBirth: infoMember.get('countryDOB').value,
      countryOfBirthId: infoMember.get('countryDOB').value,
      countryOfResidenceId: infoMember.get('countryResidence').value,
      countryOfResidence: infoMember.get('countryResidence').value,
      dependentRelation: infoMember.get('relationCustomer').value,
      dependentRelationId: infoMember.get('relationCustomer').value,
      dob: infoMember.get('dob').value,
      firstName: infoMember.get('firstName').value,
      fullTimeStudent: null,
      gender: infoMember.get('gender').value,
      genderId: infoMember.get('gender').value,
      height: infoMember.get('height').value,
      industry: null,
      industryId: null,
      lastName: `${infoMember.get('fatherLastName').value} ${infoMember.get('motherLastName').value}`,
      maritalStatus: infoMember.get('maritalStatus').value,
      maritalStatusId: infoMember.get('maritalStatus').value,
      maternalLastName: infoMember.get('motherLastName').value,
      middleName: infoMember.get('middleName').value,
      nationality: infoMember.get('nationality').value,
      nationalityId: infoMember.get('nationality').value,
      ocupation: infoMember.get('employmentProfessionBusiness').value,
      ocupationId: null,
      otherSourceOfFunding: null,
      paternalLastName: infoMember.get('fatherLastName').value,
      previousMemberId: null,
      previousPolicyId: null,
      relationType: infoMember.get('relationCustomer').value,
      relationTypeId: infoMember.get('relationCustomer').value,
      schoolName: null,
      sourceOfFunding: infoMember.get('resourcesOrigin').value,
      sourceOfFundingId: infoMember.get('resourcesOrigin').value,
      systemMeasure: infoMember.get('systemMeasureId').value,
      systemMeasureId: infoMember.get('systemMeasureId').value,
      usCitizenResident: this.getUsCitizenResidentFromOwner(policyApplicationModel),
      weight: infoMember.get('weight').value,
      patrimonialLinks: null,
      memberExtension: this.buildMemberExtension(infoMember.get('averageAnnualIncome').value)
    };
  }

  private getUsCitizenResidentFromOwner(policyApplicationModel: PolicyApplicationModel): boolean {
    return policyApplicationModel.members.find(member => member.relationTypeId === RelationType.OWNER).usCitizenResident;
  }

  private buildMemberExtension(averageAnnualIncome: string): MemberExtension {
    return {
      averageAnnualIncome: averageAnnualIncome,
      placeWherePayTaxes: '',
      isPEP: false,
      relationshipPEP: false,
      associatedPEP: false,
      workPlace: '',
      performingJob: ''
    };
  }

  private createUpdateIdentifications(policyApplicationModel: PolicyApplicationModel,
    infoMember: FormGroup, nameGUIDId: string, guidMember: string, nameControlID: string, IDType: number) {
    const index = policyApplicationModel.identifications.indexOf(
      policyApplicationModel.identifications.find(
        me => me.applicationIdentificationGuid === infoMember.get(nameGUIDId).value));
    if (index !== -1) {
      policyApplicationModel.identifications[index] =
        this.getInfoIdentifications(infoMember.get(nameGUIDId).value, guidMember,
          policyApplicationModel.applicationGuid, IDType, infoMember.get(nameControlID).value,
          this.INITIAL_VALUE_ZERO);
    } else {
      policyApplicationModel.identifications.push(
        this.getInfoIdentifications(infoMember.get(nameGUIDId).value, guidMember,
          policyApplicationModel.applicationGuid, IDType, infoMember.get(nameControlID).value,
          this.INITIAL_VALUE_ZERO));
    }
  }

  public getInfoIdentifications(guidIdentification: string, guidMember: string, guidApp: string,
    typeIdentification: number, valueIden: string, contactType: number): Identification {
    return {
      applicationGuid: guidApp,
      contactType: contactType,
      contactGuid: guidMember,
      identificationTypeId: typeIdentification,
      applicationIdentificationGuid: guidIdentification,
      identificationNumber: valueIden
    };
  }

  private createUpdateEmail(policyApplicationModel: PolicyApplicationModel, infoMember: FormGroup, guidMember: string,
    email: string, typeEmail: number, nameGUIDId: string) {

    const index = policyApplicationModel.emails.indexOf(
      policyApplicationModel.emails.find(
        me => me.applicationEmailGuid === infoMember.get(nameGUIDId).value));
    if (index !== -1) {
      policyApplicationModel.emails[index] =
        this.getInfoEmail(infoMember.get(nameGUIDId).value, guidMember,
          policyApplicationModel.applicationGuid, email, typeEmail, this.INITIAL_VALUE_ZERO);
    } else {
      policyApplicationModel.emails.push(this.getInfoEmail(infoMember.get(nameGUIDId).value, guidMember,
        policyApplicationModel.applicationGuid, email, typeEmail, this.INITIAL_VALUE_ZERO));
    }
  }

  public getInfoEmail(guidEmail: string, guidMember: string, guidApp: string,
    email: string, typeEmail: number, contactType: number): Email {
    return {
      applicationEmailGuid: guidEmail,
      applicationGuid: guidApp,
      contactGuid: guidMember,
      contactType: contactType,
      emailAddress: email,
      emailType: '',
      emailTypeId: typeEmail // EmailEnum
    };
  }

  private createUpdatePhone(policyApplicationModel: PolicyApplicationModel, infoMember: FormGroup, guidMember: string,
    infoContact: InfoContactMember) {
    const indexPhone = policyApplicationModel.phones.indexOf(
      policyApplicationModel.phones.find(
        me => me.applicationPhoneGuid === infoMember.get('guidPhone').value));
    if (indexPhone !== -1) {
      policyApplicationModel.phones[indexPhone] =
        this.getInfoPhone(infoMember.get('guidPhone').value, guidMember,
          policyApplicationModel.applicationGuid, infoContact, PhoneTypes.HOME, this.INITIAL_VALUE_ZERO);
    } else {
      policyApplicationModel.phones.push(this.getInfoPhone(infoMember.get('guidPhone').value, guidMember,
        policyApplicationModel.applicationGuid, infoContact, PhoneTypes.HOME, this.INITIAL_VALUE_ZERO));
    }
  }

  public getInfoPhone(guidPhone: string, guidMember: string, guidApp: string,
    infoContact: InfoContactMember, phoneType: number, contactType: number): Phone {
    return {
      applicationGuid: guidApp,
      applicationPhoneGuid: guidPhone,
      contactGuid: guidMember,
      contactType: contactType,
      phoneType: phoneType.toString(),
      phoneTypeId: phoneType,
      ext: infoContact.extension,

      areaCode: (infoContact.codeArea) ? infoContact.codeArea.toString() : null,
      areaCodeId: (infoContact.codeArea) ? infoContact.codeArea : null,
      countryId: infoContact.countryId,
      fullPhone: infoContact.phone,
      phoneNumber: infoContact.phone,
      cityId: infoContact.cityId,
    };
  }

  private createUpdateAddress(policyApplicationModel: PolicyApplicationModel, infoMember: FormGroup,
    guidMember: string, address: Address) {
    const indexAddress = policyApplicationModel.addresses.indexOf(
      policyApplicationModel.addresses.find(
        me => me.applicationAddressGuid === infoMember.get('guidAddress').value));
    if (indexAddress !== -1) {
      policyApplicationModel.addresses[indexAddress] =
        this.getInfoAddress(infoMember.get('guidAddress').value, guidMember,
          policyApplicationModel.applicationGuid, address, this.INITIAL_VALUE_ZERO);
    } else {
      policyApplicationModel.addresses.push(this.getInfoAddress(infoMember.get('guidAddress').value, guidMember,
        policyApplicationModel.applicationGuid, address, this.INITIAL_VALUE_ZERO));
    }
  }

  public getInfoAddress(guidAddress: string, guidConctact: string, guidApp: string, address: Address, contactType: number) {
    const addressReturn = address;
    addressReturn.applicationAddressGuid = guidAddress;
    addressReturn.applicationGuid = guidApp;
    addressReturn.contactGuid = guidConctact;
    addressReturn.contactType = contactType;
    addressReturn.addressLine1 = this.getAddressLine(address.street, address.interior, address.exterior);
    return addressReturn;
  }

  public getAddressLine(streetAvenueHome: string, insideNumberHome: string, outsideNumberHome: string): string {
    return `${streetAvenueHome} ${insideNumberHome} ${outsideNumberHome}`;
  }

  public setInfoContact(policyAppContactDependents: FormGroup, policyApplicationModel: PolicyApplicationModel): InfoContactMember {
    return {
      cityId: policyAppContactDependents.get('city').value,
      codeArea: policyAppContactDependents.get('areaCode').value,
      countryId: policyAppContactDependents.get('country').value,
      email: '',
      phone: policyAppContactDependents.get('nroPhone').value
    };
  }

  public setInfoAddress(infoAddress: FormGroup, policyApplicationModel: PolicyApplicationModel): Address {
    return {
      colony: infoAddress.get('colonyHome').value,
      country: infoAddress.get('countryHome').value,
      interior: infoAddress.get('insideNumberHome').value,
      localityId: infoAddress.get('localityHome').value,
      municipality: infoAddress.get('mayoraltyMunicipalityHome').value,
      exterior: infoAddress.get('outsideNumberHome').value,
      state: infoAddress.get('stateHome').value,
      street: infoAddress.get('streetAvenueHome').value,
      zip: infoAddress.get('zipCodeHome').value,
      addressLine1: null,
      addressLine2: null,
      addressType: null,
      city: infoAddress.get('cityHome').value,
      cityId: infoAddress.get('cityHome').value,
      colonyId: Number(infoAddress.get('colonyHome').value),
      countryId: infoAddress.get('countryHome').value,
      applicationAddressGuid: null,
      applicationGuid: null,
      contactGuid: null,
      contactType: null,
      addressTypeId: AddressTypes.PHYSICAL,
      yearsInAddress: infoAddress.get('yearsInHome') ? infoAddress.get('yearsInHome').value : this.STRING_EMPTY
    };
  }
}
