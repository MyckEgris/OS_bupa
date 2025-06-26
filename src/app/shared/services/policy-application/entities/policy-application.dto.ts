import { PolicyApplicationMemberDto } from './policy-application-member.dto';
import { Phone } from '../../agent/entities/phone';
import { Email } from '../../agent/entities/email';
import { Rule } from './rule';
import { HistoryLog } from './history-log';
import { ApplicationDocument } from './application-document';
import { PetitionerInformation } from './petitioner-information';

/**
* PolicyApplicationDto.ts
*
* @description: DTO policy-application
* @author Vanessa Luna
* @version 1.0
* @date 08-01-2019.
*
**/

/**
 * DTO policy-application
 */

export interface PolicyApplicationDto {
    applicationGuid: string;
    applicationId: number;
    process: string;
    enrollmentTypeId: number;
    insuranceBusinessId: number;
    businessModeId: number;
    requestorFirstName: string;
    requestorLastName: string;
    requestorTypeId: number;
    requestorEmail: string;
    requestorPhone: string;
    issueDate: Date;
    signedDate: Date;
    planId: number;
    receivedMethodId: number;
    countryId: number;
    cityId: number;
    languageId: number;
    modeOfPaymentId: number;
    paymentMethodId: number;
    agentId: number;
    updatedBy: string;
    updatedOn: Date;
    policyId: number;
    firstName: string;
    lastName: string;
    dob: Date;
    totalCount: number;
    enrollmentType: string;
    businessMode: string;
    requestorType: string;
    insuranceBusiness: string;
    plan: string;
    product: string;
    receiveMethod: string;
    country: string;
    city: string;
    modeOfPayment: string;
    paymentMethod: string;
    language: string;
    agent: string;
    status: string;
    createdOn: Date;
    daysElapsed: number;
    addresses: string;
    phones: Phone[];
    emails: Email[];
    members: PolicyApplicationMemberDto[];
    riders: string;
    documents: ApplicationDocument[];
    petitioner: PetitionerInformation;
    rules: Rule[];
    historyLogs: HistoryLog[];

}
