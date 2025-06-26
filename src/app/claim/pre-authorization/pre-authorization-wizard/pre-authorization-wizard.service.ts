import { Injectable } from '@angular/core';
import { Subscription, Subject, from } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PreAuthorizationWizard } from './entities/pre-authorization-wizard';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { PreAuthorizationDto } from 'src/app/shared/services/claim/pre-authorization/entities/pre-authorization.dto';
import { Utilities } from 'src/app/shared/util/utilities';
import { Contact } from 'src/app/shared/services/claim/pre-authorization/entities/contact.dto';
import { PatientDto } from 'src/app/shared/services/claim/pre-authorization/entities/patient.dto';
import { ProviderDto } from 'src/app/shared/services/claim/pre-authorization/entities/provider.dto';
import { SenderUserDto } from 'src/app/shared/services/claim/pre-authorization/entities/sender-user.dto';
import { UploadResponse } from 'src/app/shared/services/common/entities/uploadReponse';
import { AttachmentDto } from 'src/app/shared/services/claim/pre-authorization/entities/attachment.dto';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { Rol } from 'src/app/shared/classes/rol.enum';

/***
 * Service for management the wizard pre-authorization
 */
@Injectable({
    providedIn: 'root'
})
export class PreAuthorizationWizardService {

    private user: UserInformationModel;

    private preAuthorizationSubject: Subject<PreAuthorizationWizard>;

    private preAuthorization: PreAuthorizationWizard;

    constructor(
        private uploadService: UploadService
    ) {
        this.preAuthorizationSubject = new Subject<PreAuthorizationWizard>();
    }

    /**
   *  Initiate Pre Authorization wizard.
   * @fn subscription function
   */
    beginPreAuthWizardServiceWizard(fn, user, step?: number): Subscription {
        this.user = user;
        const subscription = this.preAuthorizationSubject.subscribe(fn);

        if (!this.preAuthorization) {
            this.newPreAuthorization(user);
        }
        if (step) {
            this.preAuthorization.currentStep = step;
        }
        this.next();
        return subscription;
    }

    /**
     * Close the wizard of preAuthorization
     */
    endPreAuthWizard(user) {
        this.newPreAuthorization(user);
        this.uploadService.removeAllDocuments();
        this.next();
    }

    /***
     * Initiate Pre Authorization wizard.
     */
    newPreAuthorization(user: UserInformationModel) {
        this.preAuthorization = {
            currentStep: 0,
            member: null,
            city: null,
            country: null,
            listDiagnosticSelected: [],
            listProcedureSelected: [],
            serviceType: null,
            requestType: null,
            documents: null,
            holderMemberId: null,
            memberSearch: null,
            taxNumber: null,
            policyDto: null,
            associatedProvider: null,
            lstAssociatedProvider: null,
            providerInSession: null,
            preAuthForm: new FormGroup({
                memberInformation: new FormGroup({
                    policyNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
                    provider: new FormControl(''),
                    country: new FormControl(null, Validators.required),
                    city: new FormControl(null),
                    member: new FormControl()
                })
            }),
        };
    }

    /**
     * Send parameters to subscriptors
     */
    private next() {
        this.preAuthorizationSubject.next(this.preAuthorization);
    }

    /***
     * Build Dto for created preauthorization
     */
    buildDtoPreAuthorization(lstDoc: UploadResponse[], lang: number): PreAuthorizationDto {
        return {
            createdOn: Utilities.convertDateToString(new Date()),
            admissionDate: Utilities.convertDateToString(this.getMedicalInformation().get('admissionDate').value),
            contacts: this.getContactInformation(),
            countryOfService: this.getMemberInformation().get('country').value,
            currencyCode: null,
            diagnostics: this.preAuthorization.listDiagnosticSelected,
            dischargeDate: null,
            documents: this.getDocuments(lstDoc),
            incurredDate: Utilities.convertDateToString(this.getMedicalInformation().get('incurredDate').value),
            insuranceBusiness: {
                id: this.preAuthorization.policyDto.insuranceBusinessId,
                name: this.preAuthorization.policyDto.policyCountry
            },
            languageId: lang,
            lengthOfStayRequested: this.getMedicalInformation().get('lengthOfStayRequested').value,
            notes: this.getMedicalInformation().get('notes').value,
            patient: this.getPatient(),
            preAuthId: 0,
            procedures: this.preAuthorization.listProcedureSelected,
            providers: this.getInformationProvider(),
            referenceNumber: null,
            requestDate: Utilities.convertDateToString(new Date()),
            requestType: this.preAuthorization.requestType,
            senderUser: this.getSenderUser(),
            serviceType: this.preAuthorization.serviceType,
            trackingNumber: null
        };
    }

    /***
     * Get information documents
     */
    getDocuments(lstDoc: UploadResponse[]) {
        const listDoc: AttachmentDto[] = [];
        lstDoc.forEach(e => {
            listDoc.push({
                documentAuthId: 0,
                documentName: e.fileName,
                folderName: e.folderName
            });
        });
        return listDoc;
    }

    /***
   * Get Conctacts Informarion
   */
    getContactInformation(): Contact[] {
        const contacts: Contact[] = [];
        const itemsContacts = this.preAuthorization.preAuthForm.get('contactInformation').get('items') as FormArray;
        itemsContacts.controls.forEach(e => {
            const emergencyContactPhone = e.get('emergencyContactPhone').value;
            const emergencyContactName = e.get('emergencyContactName').value;
            const emailAddress = e.get('emailAddress').value;
            const phoneInCountry = e.get('phoneInCountry').value;
            const phoneOutCountry = e.get('phoneOutCountry').value;
            const emergencyRelationToTheCustomer = e.get('emergencyRelationToTheCustomer').value;
            if (emergencyContactPhone !== '' || emergencyContactName !== '' ||
                emailAddress !== '' || phoneInCountry !== '' || phoneOutCountry !== '' ||
                emergencyRelationToTheCustomer !== '') {
                contacts.push({
                    contactPhone: emergencyContactPhone,
                    contactName: emergencyContactName,
                    contactEmail: emailAddress,
                    contactPhoneInCountry: phoneInCountry,
                    contactPhoneOutCountry: phoneOutCountry,
                    contactRelationship: emergencyRelationToTheCustomer,
                    contactAuthId: 0,
                    contactMethodId: null,
                    contactTypeId: null
                });
            }
        });
        return contacts;
    }

    /*****
     * Get Information Provider
     */
    getInformationProvider(): ProviderDto[] {
        const providers: ProviderDto[] = [];
        const itemsProvider = this.preAuthorization.preAuthForm.get('infoProviderForm').get('items') as FormArray;
        itemsProvider.controls.forEach(p => {
            providers.push({
                city: null,
                contactName: null,
                country: null,
                department: null,
                directPhone: p.get('phoneNumberProvider').value,
                email: null,
                facilityName: this.getFacility(p.get('facilityName').value),
                facilityRegisterNumber: null,
                otherPhone: null,
                physicianAddress: p.get('addressProvider').value,
                physicianDirectPhone: null,
                physicianEmail: null,
                physicianLicense: null,
                physicianName: p.get('physicianName').value,
                physicianOtherPhone: null,
                physicianOtherProfessionals: null,
                physicianSpecialty: null,
                providerAuthId: 0
            });
        });

        return providers;
    }

    getFacility(facilityName: string) {
        if (Number(this.user.role_id) === Rol.PROVIDER) {
            return (facilityName === '') ? (this.getMemberInformation().get('provider').value).name : facilityName;
        } else {
            return facilityName;
        }
    }

    /***
     * Get Medical Information
     */
    getMedicalInformation(): FormGroup {
        return this.preAuthorization.preAuthForm.get('medicalInformation') as FormGroup;
    }

    /***
     * Get Member Information
     */
    getMemberInformation(): FormGroup {
        return this.preAuthorization.preAuthForm.get('memberInformation') as FormGroup;
    }

    /**
     * Create member for whom the service is being requested
     */
    getPatient(): PatientDto {
        return {
            country: this.preAuthorization.policyDto.policyCountryObject,
            dob: this.preAuthorization.member.dob,
            fullName: this.preAuthorization.member.fullName,
            firstName: this.preAuthorization.member.firstName,
            isGroupPolicy: Number(this.preAuthorization.policyDto.isGroupPolicy),
            lastName: this.preAuthorization.member.lastName,
            memberId: this.preAuthorization.member.memberId,
            policyId: this.preAuthorization.policyDto.policyId
        };
    }

    getSenderUser(): SenderUserDto {
        let userKey = Number(this.user.user_key);
        if (Number(this.user.role_id) === Rol.PROVIDER) {
            userKey = (this.getMemberInformation().get('provider').value).id;
        }
        return {
            id: userKey,
            memberId: this.preAuthorization.holderMemberId,
            name: this.user.name,
            roleId: Number(this.user.role_id),
            taxNumber: this.preAuthorization.taxNumber
        };
    }

}
