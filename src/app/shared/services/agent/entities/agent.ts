import { Portfolio } from './portfolio';
import { Email } from './email';
import { SubAgent } from './subagent';
import { CommissionPayment } from './commission-payment';
import { PhoneOutputDto } from '../../policy/entities/phone.dto';
import { AddressOutputDto } from '../../policy/entities/address.dto';

/**
* Agent.ts
*
* @description: Agent response
* @author Arturo Suarez
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * Agent response
 */
export interface Agent {

    agentId: number;
    agentNumber: string;
    agentName: string;
    agentEmail: string;
    companyName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string;
    isAdministrator: boolean;
    statusId: number;
    status: string;
    countryId: number;
    country: string;
    isoAlpha: string;
    insuranceBusinessId: number;
    insuranceBusiness: string;
    agencyId: number;
    agencyName: string;
    emails: Email[];
    phones: PhoneOutputDto[];
    addresses?: AddressOutputDto[];
    portfolio?: Portfolio;
    subAgents?: Array<SubAgent>;
    webClaimSubmissionAccess?: boolean;
    commissionPayments?: Array<CommissionPayment>;
    hasPolicyGroup: number;
    policyId: number;
}

