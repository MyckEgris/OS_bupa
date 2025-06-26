import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { Petitioner } from 'src/app/shared/services/policy-application/entities/petitioner';
import { PetitionerInformation } from 'src/app/shared/services/policy-application/entities/petitioner-information';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { PolicyEnrollmentTransformMembersService } from './policy-enrollment-transform-members.service';
import { InfoContactMember } from 'src/app/shared/services/policy-application/entities/info-contact-member';
import { PhoneTypes } from 'src/app/shared/services/policy-application/constants/phone-types.enum';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
import { IdentificationTypes } from 'src/app/shared/services/policy-application/constants/identification-type.enum';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { CompanyContacts } from 'src/app/shared/services/policy-application/entities/company-contacts';
import { PetitionerConctactType } from 'src/app/shared/classes/petitioner-contact-type.enum';
import { Person } from 'src/app/shared/services/policy-application/entities/person';

@Injectable({
    providedIn: 'root'
})
export class PolicyEnrollmentTransformPetitionerService {

  private STRING_EMPTY = '';

    private INITIAL_VALUE_UNO = 1;

    public deletedOfficerSharedholderGUID: Array<string> = [];

    constructor(
        private transformService: PolicyEnrollmentTransformMembersService,
    ) { }

    public createPetitioner(formPetitioner: FormGroup, policyAppModel: PolicyApplicationModel) {
        let formPetitionerInfo = null;
        let formEconomicInfoPetitioner = null;

        if (policyAppModel.petitionerTypeId === PetitionerType.COMPANY) {
            formPetitionerInfo = formPetitioner.get('policyAppInfoMoralPetitioner') as FormGroup;
            formEconomicInfoPetitioner = formPetitioner.get('policyAppInfoEconomicMoralPetitioner') !== null ?
                                            formPetitioner.get('policyAppInfoEconomicMoralPetitioner') as FormGroup : null;
            this.createUpdateInfoPetitioner(formPetitioner, policyAppModel, formPetitionerInfo, formEconomicInfoPetitioner);

        } else if (policyAppModel.petitionerTypeId === PetitionerType.INDIVIDUAL) {
            formPetitionerInfo = formPetitioner.get('policyAppInfoPhysicalPetitioner') as FormGroup;
            formEconomicInfoPetitioner = formPetitioner.get('policyAppInfoEconomicPhysicalPetitioner') !== null ?
                                            formPetitioner.get('policyAppInfoEconomicPhysicalPetitioner') as FormGroup : null;
            this.createUpdateInfoPetitioner(formPetitioner, policyAppModel, formPetitionerInfo, formEconomicInfoPetitioner);

        }
    }

    private createUpdateInfoPetitioner(formPetitioner: FormGroup,
        policyAppModel: PolicyApplicationModel, formPetitionerInfo: FormGroup,
        formEconomicInfoPetitioner: FormGroup) {
        this.removeOfficerSharedholder(policyAppModel);

        const formInfoAddress = formPetitioner.get('policyAppAddressPetitioner') !== null ?
                                    formPetitioner.get('policyAppAddressPetitioner') as FormGroup : null;
        const formInfoContact = formPetitioner.get('policyAppContactPetitioner') !== null ?
                                    formPetitioner.get('policyAppContactPetitioner') as FormGroup : null;

        const guidPetitioner = formPetitionerInfo.get('GUID').value;

        // Petitioner
        this.createUpdatePetitioner(policyAppModel, formPetitionerInfo, formEconomicInfoPetitioner);

        // Company
        if (formPetitionerInfo.get('guidCompany')) {
            this.createUpdateCompany(policyAppModel, guidPetitioner, formPetitionerInfo);

            // CompanyContacts - LegalRepresentative
            this.createUpdateCompanyContacts(policyAppModel,
            formPetitionerInfo.get('guidLegalRepresentative').value,
            formPetitionerInfo, PetitionerConctactType.LEGAL_REPRESENTATIVE);

            // CompanyContacts
            if (formPetitioner.get('itemsOfficerAdvisors') && formPetitioner.get('itemsSharedholders')) {
                const itemsOfficerAdvisors = formPetitioner.get('itemsOfficerAdvisors') as FormArray;
                itemsOfficerAdvisors.controls.forEach((officerAdvisors: FormGroup) => {
                    this.createUpdateCompanyContacts(policyAppModel,
                        officerAdvisors.get('GUID').value, officerAdvisors, PetitionerConctactType.OFFICIAL);
                });

                const itemsSharedholders = formPetitioner.get('itemsSharedholders') as FormArray;
                itemsSharedholders.controls.forEach((sharedholders: FormGroup) => {
                    this.createUpdateCompanyContacts(policyAppModel,
                        sharedholders.get('GUID').value, sharedholders, PetitionerConctactType.SHAREHOLDER);
                });
            }
        }

        // Person
        if (formPetitionerInfo.get('guidPerson')) {
            this.createUpdatePerson(policyAppModel, guidPetitioner, formPetitionerInfo.get('guidPerson').value,
                    formPetitionerInfo, formEconomicInfoPetitioner);
        }

        // Addresses
        if (formInfoAddress) {
            const address = this.setInfoAddress(formInfoAddress);
            this.createUpdateAddress(policyAppModel, formInfoAddress.get('guidAddress').value, guidPetitioner, address);
        }

        // Phones - Email
        const infoContact = this.setInfoContact(formInfoContact);
        this.createUpdatePhone(policyAppModel, formInfoContact.get('guidPhone').value, guidPetitioner, infoContact);

        this.createUpdateEmail(policyAppModel, formInfoContact.get('guidEmail').value, guidPetitioner,
            infoContact.email, EmailEnum.PREFERRED_EMAIL);

        // Identification
        if (formEconomicInfoPetitioner) {
            this.createUpdateIdentifications(policyAppModel, formEconomicInfoPetitioner.get('guidRFC').value, guidPetitioner,
            formEconomicInfoPetitioner.get('rfc').value, IdentificationTypes.RFC);
            this.createUpdateIdentifications(policyAppModel, formEconomicInfoPetitioner.get('guidCURP').value,
                guidPetitioner, formEconomicInfoPetitioner.get('curp').value, IdentificationTypes.CURP);
            this.createUpdateIdentifications(policyAppModel, formEconomicInfoPetitioner.get('guidNroSerie').value,
                guidPetitioner, formEconomicInfoPetitioner.get('serialOfNumberCertificate').value, IdentificationTypes.SERIAL_NUMBER);
        }
    }

    private removeOfficerSharedholder(policyAppModel: PolicyApplicationModel) {
        this.deletedOfficerSharedholderGUID.forEach(
            a => {
              if (policyAppModel.petitioner.company.companyContacts.find(me => me.applicationCompanyPetitionerContactGuid === a)) {
                policyAppModel.petitioner.company.companyContacts.splice(
                    policyAppModel.petitioner.company.companyContacts.indexOf(
                        policyAppModel.petitioner.company.companyContacts.find(me => me.applicationCompanyPetitionerContactGuid === a)), 1);
              }
            }
        );
    }

    private createUpdatePetitioner(policyApplicationModel: PolicyApplicationModel, petitionerInfo: FormGroup,
            economicInfoPetitioner: FormGroup) {
        if (policyApplicationModel.petitioner) {
            policyApplicationModel.petitioner.otherSourceOfFounding =
                    economicInfoPetitioner !== null ? economicInfoPetitioner.get('otherResourcesOrigin').value : null;
            policyApplicationModel.petitioner.sourceOfFunding =
                    economicInfoPetitioner !== null ? economicInfoPetitioner.get('resourcesOrigin').value : null;
            policyApplicationModel.petitioner.sourceOfFundingId =
                    economicInfoPetitioner !== null ? economicInfoPetitioner.get('resourcesOrigin').value : null;
            policyApplicationModel.petitioner.petitionerType = PetitionerType.getDescription(policyApplicationModel.petitionerTypeId);
            policyApplicationModel.petitioner.petitionerTypeId = policyApplicationModel.petitionerTypeId;
            policyApplicationModel.petitioner.industry =
                    economicInfoPetitioner !== null ? economicInfoPetitioner.get('employmentProfessionBusiness').value : null;
            policyApplicationModel.petitioner.industryId =
                    economicInfoPetitioner !== null ? economicInfoPetitioner.get('employmentProfessionBusiness').value : null;
        } else {
            policyApplicationModel.petitioner = {
                addresses: [],
                applicationGuid: policyApplicationModel.applicationGuid,
                applicationPetitionerGuid: petitionerInfo.get('GUID').value,
                company: null,
                emails: [],
                identifications: [],
                industry: economicInfoPetitioner !== null ? economicInfoPetitioner.get('employmentProfessionBusiness').value : null,
                industryId: economicInfoPetitioner !== null ? economicInfoPetitioner.get('employmentProfessionBusiness').value : null,
                otherSourceOfFounding: economicInfoPetitioner !== null ? economicInfoPetitioner.get('otherResourcesOrigin').value : null,
                person: null,
                petitionerType: PetitionerType.getDescription(policyApplicationModel.petitionerTypeId),
                petitionerTypeId: policyApplicationModel.petitionerTypeId,
                phones: [],
                sourceOfFunding: economicInfoPetitioner !== null ? economicInfoPetitioner.get('resourcesOrigin').value : null,
                sourceOfFundingId: economicInfoPetitioner !== null ? economicInfoPetitioner.get('resourcesOrigin').value : null
            };
        }
    }

    private createUpdateCompany(policyApplicationModel: PolicyApplicationModel, petitionerGUID: string, petitionerInfo: FormGroup) {
        if (policyApplicationModel.petitioner.company) {
            policyApplicationModel.petitioner.company.commercialNumber = petitionerInfo.get('businessFolio').value;
            policyApplicationModel.petitioner.company.companyName = petitionerInfo.get('reasonCorporateName').value;
            policyApplicationModel.petitioner.company.constitution = petitionerInfo.get('constitutionDate').value;
            policyApplicationModel.petitioner.company.nationalityId = petitionerInfo.get('nationality').value;
            policyApplicationModel.petitioner.company.companyContacts = [];
            policyApplicationModel.petitioner.company.isContractor = petitionerInfo.get('contractingType').value;
        } else {
            policyApplicationModel.petitioner.company = {
                applicationCompanyPetitionerGuid: petitionerInfo.get('guidCompany').value,
                applicationPetitionerGuid: petitionerGUID,
                commercialNumber: petitionerInfo.get('businessFolio').value,
                companyContacts: [],
                companyName: petitionerInfo.get('reasonCorporateName').value,
                constitution: petitionerInfo.get('constitutionDate').value,
                nationalityId: petitionerInfo.get('nationality').value,
                isContractor: petitionerInfo.get('contractingType').value
            };
        }
    }

    private createUpdatePerson(policyAppModel: PolicyApplicationModel, guidPetitioner: string,
        guidPerson: string, formPetitionerInfo: FormGroup, economicInfoPetitioner: FormGroup) {
        policyAppModel.petitioner.person = this.getPerson(guidPetitioner, guidPerson, formPetitionerInfo, economicInfoPetitioner);
    }

    private getPerson(guidPetitioner: string, guidPerson: string,
                formPetitionerInfo: FormGroup, economicInfoPetitioner: FormGroup): Person {
        return {
            applicationPersonPetitionerGuid: guidPerson,
            applicationPetitionerGuid: guidPetitioner,
            dob: formPetitionerInfo.get('dob').value,
            firstName: formPetitionerInfo.get('firstName').value,
            genderId: formPetitionerInfo.get('gender').value,
            lastName: `${formPetitionerInfo.get('fatherLastName').value} ${formPetitionerInfo.get('motherLastName').value}`,
            maternalLastName: formPetitionerInfo.get('motherLastName').value,
            middleName: formPetitionerInfo.get('middleName').value,
            paternalLastName: formPetitionerInfo.get('fatherLastName').value,
            patrimonialLinks: economicInfoPetitioner !== null ? economicInfoPetitioner.get('patrimonialLinks').value : null,
            countryOfBirthId: formPetitionerInfo.get('countryDOB').value,
            nationalityId: formPetitionerInfo.get('nationality').value
        };
    }

    private setInfoAddress(infoAddress: FormGroup): Address {
        if (infoAddress) {
            return {
                colony: infoAddress.get('colony').value,
                country: infoAddress.get('country').value,
                interior: infoAddress.get('insideNumber').value,
                localityId: infoAddress.get('locality').value,
                municipality: infoAddress.get('mayoraltyMunicipality').value,
                exterior: infoAddress.get('outsideNumber').value,
                state: infoAddress.get('state').value,
                street: infoAddress.get('streetAvenue').value,
                zip: infoAddress.get('zipCode').value,
                addressLine1: null,
                addressLine2: null,
                addressType: null,
                city: infoAddress.get('city').value,
                cityId: infoAddress.get('city').value,
                colonyId: Number(infoAddress.get('colony').value),
                countryId: infoAddress.get('colony').value,
                applicationAddressGuid: null,
                applicationGuid: null,
                contactGuid: null,
                contactType: null,
                addressTypeId: AddressTypes.PHYSICAL,
                yearsInAddress: this.STRING_EMPTY
            };
        } else {
            return {
                colony: null,
                country: null,
                interior: null,
                localityId: null,
                municipality: null,
                exterior: null,
                state: null,
                street: null,
                zip: null,
                addressLine1: null,
                addressLine2: null,
                addressType: null,
                city: null,
                cityId: null,
                colonyId: null,
                countryId: null,
                applicationAddressGuid: null,
                applicationGuid: null,
                contactGuid: null,
                contactType: null,
                addressTypeId: AddressTypes.PHYSICAL,
                yearsInAddress: this.STRING_EMPTY
            };
        }
    }

    public createUpdateAddress(policyApplicationModel: PolicyApplicationModel, guidAddress: string,
        guidContact: string, address: Address) {
        const indexAddress = policyApplicationModel.petitioner.addresses.indexOf(
            policyApplicationModel.petitioner.addresses.find(
                me => me.applicationAddressGuid === guidAddress));
        if (indexAddress !== -1) {
            policyApplicationModel.petitioner.addresses[indexAddress] =
                this.transformService.getInfoAddress(guidAddress, guidContact,
                    policyApplicationModel.applicationGuid, address, this.INITIAL_VALUE_UNO);
        } else {
            policyApplicationModel.petitioner.addresses.push(
                this.transformService.getInfoAddress(guidAddress, guidContact,
                policyApplicationModel.applicationGuid, address, this.INITIAL_VALUE_UNO));
        }
    }

    public createUpdatePhone(policyApplicationModel: PolicyApplicationModel, guidPhone: string, guidContact: string,
        infoContact: InfoContactMember) {
        const indexPhone = policyApplicationModel.petitioner.phones.indexOf(
          policyApplicationModel.petitioner.phones.find(
            me => me.applicationPhoneGuid === guidPhone));
        if (indexPhone !== -1) {
          policyApplicationModel.petitioner.phones[indexPhone] =
            this.transformService.getInfoPhone(guidPhone, guidContact,
              policyApplicationModel.applicationGuid, infoContact, PhoneTypes.OFFICE, this.INITIAL_VALUE_UNO);
        } else {
          policyApplicationModel.petitioner.phones.push(
              this.transformService.getInfoPhone(guidPhone, guidContact,
                policyApplicationModel.applicationGuid, infoContact, PhoneTypes.OFFICE, this.INITIAL_VALUE_UNO));
        }
    }

    private setInfoContact(policyAppContact: FormGroup): InfoContactMember {
        if (policyAppContact) {
            return {
                cityId: policyAppContact.get('city').value,
                codeArea: policyAppContact.get('areaCode').value,
                countryId: policyAppContact.get('country').value,
                email: policyAppContact.get('email').value,
                phone: policyAppContact.get('nroPhone').value,
                extension: policyAppContact.get('extension').value
            };
        } else {
            return {
                cityId: null,
                codeArea: null,
                countryId: null,
                email: null,
                phone: null
            };
        }
    }

    public createUpdateEmail(policyApplicationModel: PolicyApplicationModel, guidEmail: string, guidContact: string,
        email: string, typeEmail: number) {
        const index = policyApplicationModel.petitioner.emails.indexOf(
          policyApplicationModel.petitioner.emails.find(
            me => me.applicationEmailGuid === guidEmail));
        if (index !== -1) {
          policyApplicationModel.petitioner.emails[index] =
            this.transformService.getInfoEmail(guidEmail, guidContact,
              policyApplicationModel.petitioner.applicationGuid, email, typeEmail, this.INITIAL_VALUE_UNO);
        } else {
          policyApplicationModel.petitioner.emails.push(
              this.transformService.getInfoEmail(guidEmail, guidContact,
            policyApplicationModel.applicationGuid, email, typeEmail, this.INITIAL_VALUE_UNO));
        }
    }

    public createUpdateIdentifications(policyApplicationModel: PolicyApplicationModel,
        guidId: string, guidContact: string, valueId: string, IDType: number) {
        const index = policyApplicationModel.petitioner.identifications.indexOf(
            policyApplicationModel.petitioner.identifications.find(
            me => me.applicationIdentificationGuid === guidId));
        if (index !== -1) {
            policyApplicationModel.petitioner.identifications[index] =
            this.transformService.getInfoIdentifications(guidId, guidContact,
                policyApplicationModel.applicationGuid, IDType, valueId,
                this.INITIAL_VALUE_UNO);
        } else {
            policyApplicationModel.petitioner.identifications.push(
            this.transformService.getInfoIdentifications(guidId, guidContact,
                policyApplicationModel.applicationGuid, IDType, valueId,
                this.INITIAL_VALUE_UNO));
        }
    }

    private createUpdateCompanyContacts(policyAppModel: PolicyApplicationModel, guid: string,
                                infoCompanyContact: FormGroup, conctactType: number) {
        const index = policyAppModel.petitioner.company.companyContacts.indexOf(
            policyAppModel.petitioner.company.companyContacts.find(
                me => me.applicationCompanyPetitionerContactGuid === guid));
          if (index !== -1) {
            policyAppModel.petitioner.company.companyContacts[index] =
              this.getInfoCompanyContacts(guid,
                policyAppModel.petitioner.company.applicationCompanyPetitionerGuid,
                infoCompanyContact, conctactType);
          } else {
            policyAppModel.petitioner.company.companyContacts.push(
                this.getInfoCompanyContacts(guid,
                    policyAppModel.petitioner.company.applicationCompanyPetitionerGuid,
                    infoCompanyContact, conctactType));
          }
    }

    private getInfoCompanyContacts(guidContact: string, guidCompany: string,
            infoCompanyContact: FormGroup, conctactType: number): CompanyContacts {
        return {
            applicationCompanyPetitionerContactGuid: guidContact,
            applicationCompanyPetitionerGuid: guidCompany,
            firstName: infoCompanyContact.get('firstName').value,
            lastName: `${infoCompanyContact.get('fatherLastName').value} ${infoCompanyContact.get('motherLastName').value}`,
            maternalLastName: infoCompanyContact.get('motherLastName').value,
            middleName: infoCompanyContact.get('middleName').value,
            nationalityId: infoCompanyContact.get('nationality') !== null ? infoCompanyContact.get('nationality').value : 0,
            paternalLastName: infoCompanyContact.get('fatherLastName').value,
            petitionerContactType: conctactType,
            position: infoCompanyContact.get('jobPerforms') !== null ? infoCompanyContact.get('jobPerforms').value : null,
            stockPercentage: infoCompanyContact.get('percentageShareCapital') !== null ?
                        infoCompanyContact.get('percentageShareCapital').value : null
        };
    }

}
