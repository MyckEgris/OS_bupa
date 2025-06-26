/**
 * policyApplicationOutputDto.ts
 *
 * @description: DTO policyApplication response
 * @author Andres Felipe Tamayo
 * @version 1.0
 * @date 03-01-2019.
 *  policyApplicationOutputDto
 **/


export interface PolicyApplicationOutputDto {
    address: any[];
    agent: any;
    agentId: number;
    applicationGuid: string;
    applicationId: number;
    businessMode: any;
    businessModeId: number;
    city: string;
    cityId: number;
    country: string;
    countryId: number;
    createdOn: any;
    daysElapsed: number;
    dob: any;
    documents: any[];
    emails: any[];
    enrollmentType: any;
    enrollmentTypeId: number;
    firstName: string;
    historyLogs: any;
    insuranceBusiness: any;
    insuranceBusinessId: number;
    language: string;
    languageId: number;
    lastName: string;
    members: any;
    modeOfPayment: string;
    modeOfPaymentId: number;
    paymentMethod: string;
    paymentMethodId: number;
    petitioner: any;
    phones: any[];
    plan: string;
    planId: number;
    policyId: number;
    process: any;
    product: string;
    receiveMethod: string;
    receivedMethodId: number;
    requestorEmail: string;
    requestorFirstName: string;
    requestorLastName: string;
    requestorPhone: number;
    requestorType: string;
    requestorTypeId: number;
    riders: any[];
    rules: any[];
    signedDate: Date;
    issueDate: Date;
    stampDate: Date;
    status: string;
    totalCount: number;
    updatedBy: string;
    updatedOn: string;
}
