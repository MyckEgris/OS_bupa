/**
* ClaimDetailDto.ts
*
* @description: DTO claim detail
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Remark } from './remark';

/**
 * DTO claim detail
 */
export interface ClaimDetailDto {

    /**
     * claimLineDetailId
     */
    claimLineDetailId: number;

    /**
     * coInsuranceAmount
     */
    coInsuranceAmount: number;

    /**
     * deductibleAmount
     */
    deductibleAmount: number;

    /**
     * fromDate
     */
    fromDate: string;

    /**
     * memberLiabilityAmount
     */
    memberLiabilityAmount: number;

    /**
     * netCoveredAmount
     */
    netCoveredAmount: number;

    /**
     * providerLiabilityAmount
     */
    providerLiabilityAmount: number;

    /**
     * remarks: Remark[]
     */
    remarks: Remark[];

    /**
     * serviceProviderId
     */
    serviceProviderId: number;

    /**
     * serviceProviderName
     */
    serviceProviderName: string;

    /**
     * toDate
     */
    toDate: string;

    /**
     * xchangeBilledAmount
     */
    xchangeBilledAmount: number;

    /**
     * ineligibleAmount
     */
    ineligibleAmount: number;

    /**
     * ineligibleDescription
     */
    ineligibleDescription: string;
}
