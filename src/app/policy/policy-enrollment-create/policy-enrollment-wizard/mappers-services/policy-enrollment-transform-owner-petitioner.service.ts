import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { Person } from 'src/app/shared/services/policy-application/entities/person';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { PolicyEnrollmentTransformMembersService } from './policy-enrollment-transform-members.service';
import { PolicyEnrollmentTransformPetitionerService } from './policy-enrollment-transform-petitioner.service';
import { IdentificationTypes } from 'src/app/shared/services/policy-application/constants/identification-type.enum';
import { Email } from 'src/app/shared/services/policy-application/entities/email';
import { EmailEnum } from 'src/app/shared/classes/email.enum';

@Injectable({
    providedIn: 'root'
})
export class PolicyEnrollmentTransformOwnerPetitionerService {

    private OWNER: Member = null;

    constructor(
        private transformService: PolicyEnrollmentTransformMembersService,
        private transformServicePetitioner: PolicyEnrollmentTransformPetitionerService
    ) { }

    public createPetitioner(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel) {
        this.OWNER = policyAppModel.members.find(o => o.relationTypeId === RelationType.OWNER);
        this.createUpdateInfoPetitioner(policyAppModel, formPetitioner);
    }

    private createUpdateInfoPetitioner(policyAppModel: PolicyApplicationModel, formPetitioner: FormGroup) {
        const guidPetitioner = formPetitioner.get('policyAppPhysicalOwnerPetitioner').get('guidPetitioner').value;
        const guidPerson = formPetitioner.get('policyAppPhysicalOwnerPetitioner').get('guidPerson').value;
        const guidAddress = formPetitioner.get('policyAppPhysicalOwnerPetitioner').get('guidAddress').value;
        const guidPhone = formPetitioner.get('policyAppPhysicalOwnerPetitioner').get('guidPhone').value;
        const guidRFC = formPetitioner.get('policyAppPhysicalOwnerPetitioner').get('guidRFC').value;
        const guidCURP = formPetitioner.get('policyAppPhysicalOwnerPetitioner').get('guidCURP').value;
        const guidNroSerie = formPetitioner.get('policyAppPhysicalOwnerPetitioner').get('guidNroSerie').value;
        const guidEmail = formPetitioner.get('policyAppPhysicalOwnerPetitioner').get('guidEmail').value;

        // Petitioner
        this.createUpdatePetitioner(policyAppModel, guidPetitioner);

        // Person
        policyAppModel.petitioner.person =
            this.getPerson(guidPetitioner, guidPerson);

        // Address
        const addressOwner =
            policyAppModel.addresses.find(a => a.contactGuid === this.OWNER.applicationMemberGuid
                && a.addressTypeId === AddressTypes.PHYSICAL);
        this.transformServicePetitioner.createUpdateAddress(policyAppModel, guidAddress, guidPetitioner, addressOwner);

        // phone - email
        const phoneOwner =
            this.setInfoContact(policyAppModel);
        this.transformServicePetitioner.createUpdatePhone(policyAppModel, guidPhone, guidPetitioner, phoneOwner);
        this.transformServicePetitioner.createUpdateEmail(policyAppModel, guidEmail,
            guidPetitioner, phoneOwner.email, EmailEnum.PREFERRED_EMAIL);

        // Identifications
        const rfc =
            policyAppModel.identifications.find(
                i => i.identificationTypeId === IdentificationTypes.RFC
                && i.contactGuid === this.OWNER.applicationMemberGuid).identificationNumber;
        this.transformServicePetitioner.createUpdateIdentifications(policyAppModel, guidRFC, guidPetitioner,
                rfc, IdentificationTypes.RFC);

        const curp =
            policyAppModel.identifications.find(
                i => i.identificationTypeId === IdentificationTypes.CURP
                && i.contactGuid === this.OWNER.applicationMemberGuid).identificationNumber;

        this.transformServicePetitioner.createUpdateIdentifications(
            policyAppModel, guidCURP, guidPetitioner, curp, IdentificationTypes.CURP);

        const serialOfNumberCertificate =
            policyAppModel.identifications.find(
                i => i.identificationTypeId === IdentificationTypes.SERIAL_NUMBER
                && i.contactGuid === this.OWNER.applicationMemberGuid).identificationNumber;

        this.transformServicePetitioner.createUpdateIdentifications(policyAppModel, guidNroSerie,
            guidPetitioner, serialOfNumberCertificate, IdentificationTypes.SERIAL_NUMBER);
    }

    private setInfoContact(policyApplicationModel: PolicyApplicationModel) {
    const emailOwner: Email = policyApplicationModel.emails.find(e => e.contactGuid === this.OWNER.applicationMemberGuid);
      const phoneOwner = policyApplicationModel.phones.find(e => e.contactGuid === this.OWNER.applicationMemberGuid);
      return {
        cityId: phoneOwner.cityId,
        codeArea: phoneOwner.areaCodeId,
        countryId: phoneOwner.countryId,
        email: emailOwner.emailAddress,
        phone: phoneOwner.phoneNumber
      };
    }

    private createUpdatePetitioner(policyApplicationModel: PolicyApplicationModel, guidPetitioner: string) {
        if (policyApplicationModel.petitioner) {
            policyApplicationModel.petitioner.otherSourceOfFounding = this.OWNER.otherSourceOfFunding;
            policyApplicationModel.petitioner.sourceOfFunding = this.OWNER.sourceOfFunding;
            policyApplicationModel.petitioner.sourceOfFundingId = this.OWNER.sourceOfFundingId;
            policyApplicationModel.petitioner.petitionerType = PetitionerType.getDescription(policyApplicationModel.petitionerTypeId);
            policyApplicationModel.petitioner.petitionerTypeId = policyApplicationModel.petitionerTypeId;
            policyApplicationModel.petitioner.industry = this.OWNER.industry;
            policyApplicationModel.petitioner.industryId = this.OWNER.industryId;
        } else {
            policyApplicationModel.petitioner = {
                addresses: [],
                applicationGuid: policyApplicationModel.applicationGuid,
                applicationPetitionerGuid: guidPetitioner,
                company: null,
                emails: [],
                identifications: [],
                industry: this.OWNER.industry,
                industryId: this.OWNER.industryId,
                otherSourceOfFounding: this.OWNER.otherSourceOfFunding,
                person: null,
                petitionerType: PetitionerType.getDescription(policyApplicationModel.petitionerTypeId),
                petitionerTypeId: policyApplicationModel.petitionerTypeId,
                phones: [],
                sourceOfFunding: this.OWNER.sourceOfFunding,
                sourceOfFundingId: this.OWNER.sourceOfFundingId
            };
        }
    }

    private getPerson(guidPetitioner: string, guidPerson: string): Person {
        return {
            applicationPersonPetitionerGuid: guidPerson,
            applicationPetitionerGuid: guidPetitioner,
            dob: this.OWNER.dob,
            firstName: this.OWNER.firstName,
            genderId: this.OWNER.genderId,
            lastName: `${this.OWNER.paternalLastName} ${this.OWNER.maternalLastName}`,
            maternalLastName: this.OWNER.maternalLastName,
            middleName: this.OWNER.middleName,
            paternalLastName: this.OWNER.paternalLastName,
            patrimonialLinks: this.OWNER.patrimonialLinks,
            countryOfBirthId: this.OWNER.countryOfBirthId,
            nationalityId: this.OWNER.nationalityId
        };
    }
}
