import { Email } from './email';
import { Portfolio } from './portfolio';
import { Phone } from './phone';
import { Address } from './address';

export interface SubAgent {
    agentId: number;
    agentName: string;
    agentNumber: string;
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
    phones: Phone[];
    addresses: Address[];
    portfolio: Portfolio;
    subAgents: Array<SubAgent>;
    webClaimSubmissionAccess?: boolean;
}
