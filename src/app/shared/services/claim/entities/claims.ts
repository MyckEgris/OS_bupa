/**
* Claim.ts
*
* @description: Model claims
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Policy } from './policy';
import { Member } from './member';
import { Payment } from './payment';
import { ClaimLinesDetail } from './claim-line-detail.dto';

/**
 * Model claims
 */
export interface Claim {

    /**
     * claimNumber
     */
    claimNumber: number;

    /**
     * policy: Policy
     */
    policy: Policy;

    /**
     * member: Member
     */
    member: Member;

    /**
     * accountNumber
     */
    accountNumber: string;

    /**
     * serviceFrom
     */
    serviceFrom: string;

    /**
     * serviceTo
     */
    serviceTo: string;

    /**
     * exchangeRate
     */
    exchangeRate: number;

    /**
     * billedAmount
     */
    billedAmount: number;

    /**
     * netCoveredAmount
     */
    netCoveredAmount: number;

    /**
     * currencyId
     */
    currencyId: number;

    /**
     * currencySymbol
     */
    currencySymbol: string;

    /**
     * currencyCode
     */
    currencyCode: string;

    /**
     * reasonCodeId
     */
    reasonCodeId: number;

    /**
     * reasonDescription
     */
    reasonDescription: string;

    /**
     * billingProviderId
     */
    billingProviderId: number;

    /**
     * statusId
     */
    statusId: number;

    /**
     * statusName
     */
    statusName: string;

    /**
     * eoBId
     */
    eoBId: string;

    /**
     * insuranceBusinessId
     */
    insuranceBusinessId: number;

    /**
     * payment: Payment
     */
    payment: Payment;

    /**
     * claimDetailId
     */
    claimDetailId: number;

    /**
     * claimDetailsDto: ClaimDetailDto[]
     */
    claimLinesDetails: ClaimLinesDetail[];

    /**
     * selected
     */
    selected: boolean;

    /**
     * isOpen
     */
    isOpen: number;

    /**
     * payToId
     */
    payToId: number;

    /**
     * payTo
     */
    payTo: string;

    /**
     * receivedDate
     */
    receivedDate: string;

    /**
     * estimatedPaymentDate
     */
    estimatedPaymentDate?: string;

    /**
     * estimatedResolutionDate
     */
    estimatedResolutionDate?: string;

    /**
     * claimSource
     */
    source?: number;
}
