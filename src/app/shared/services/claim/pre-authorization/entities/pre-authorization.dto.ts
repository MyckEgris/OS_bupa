import { SenderUserDto } from './sender-user.dto';
import { PatientDto } from './patient.dto';
import { BupaInsuranceDto } from '../../../user/entities/bupaInsurance.dto';
import { ServiceTypeDto } from './service-type.dto';
import { RequestTypeDto } from './request-type.dto';
import { Country } from '../../../agent/entities/country';
import { Contact } from './contact.dto';
import { DiagnosticDto } from '../../../common/entities/diagnostic.dto';
import { ProcedureDto } from '../../../common/entities/procedure.dto';
import { ProviderDto } from './provider.dto';
import { AttachmentDto } from './attachment.dto';

/***
 * Information to create PreAuthorization
 */
export interface PreAuthorizationDto {
    senderUser: SenderUserDto;
    patient: PatientDto;
    insuranceBusiness: BupaInsuranceDto;
    serviceType: ServiceTypeDto;
    requestType: RequestTypeDto;
    countryOfService: Country;
    contacts: Contact[];
    diagnostics: DiagnosticDto[];
    procedures: ProcedureDto[];
    providers: ProviderDto[];
    documents: AttachmentDto[];

    requestDate: string;
    languageId: number;
    incurredDate: string;
    lengthOfStayRequested: number;
    admissionDate: string;
    currencyCode: string;
    dischargeDate: string;

    trackingNumber: string;
    referenceNumber: string;
    notes: string;

    preAuthId: number;
    createdOn: string;
}

