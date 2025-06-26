
/**
* ViewPreAuthorization.ts
*
* @description: Model for pre authorization
* @author Jose Daniel Hernández.
* @version 1.0
* @date 08-06-2019.
*
**/

import { CountryOfServiceModel } from './countryOfServiceModel';
import { RequestTypeModel } from './requestTypeModel';
import { ServiceTypeModel } from './serviceTypeModel';
import { PatientModel } from './patientModel';
import { StatusPreAuthModel } from './statusPreAuthModel';
import { ReferralPreAuthModel } from './referralPreAuthModel';

/**
 * Model ViewPreAuthorization
 */

export class ViewPreAuthorization {

    /**
     * status: StatusPreAuthModel
     */
    status: StatusPreAuthModel;

    /**
     * countryOfService: CountryOfServiceModel
     */
    countryOfService: CountryOfServiceModel;

    /**
     * dischargeDate: Date
     */
    dischargeDate: string;

    /**
     * documents: any
     */
    documents: any;

    /**
     * patient: PatientModel
     */
    patient: PatientModel;

    /**
     * preAuthId: number
     */
    preAuthId: number;

     /**
     * referenceNumber: string
     */
    referenceNumber: string;

     /**
     * requestDate: Date
     */
    requestDate: string;

    /**
     * requestType: RequestTypeModel
     */
    requestType: RequestTypeModel;

     /**
     * serviceType: ServiceTypeModel
     */
    serviceType: ServiceTypeModel;

     /**
     * trackingNumber: string
     */
    trackingNumber: string;

    createdOn: string;

    senderUser: string;

    notes: string;

    languageId: number;

    incurredDate: string;

    lengthOfStayRequested: string;

    admissionDate: string;

    currencyCode: string;

    requestStartDate: string;

    requestEndDate: string;

    statusId: number;

    pathFileURL: string;

    referral: ReferralPreAuthModel;

    insuranceBussines: string;

    contacts: any;

    diagnostics: any;

    procedures: any;

    providers: any;




}
