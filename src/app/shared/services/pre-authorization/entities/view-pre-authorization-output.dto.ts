
/**
* ViewPreAuthorizationOutputDto.ts
*
* @description: Output DTO search pre authorization
* @author Jose Daniel Hernández.
* @version 1.0
* @date 08-06-2019.
*
**/



/**
 * DTO ViewPreAuthorizationOutputDto
 */
export interface ViewPreAuthorizationOutputDto {

    /**
     * pageIndex: number
     */
    pageIndex: number;

    /**
     * pageSize: number
     */
    pageSize: number;

    /**
     * policyId: string
     */
    policyId: string;

    /**
     * referenceNumber: string
     */
    referenceNumber: string;

    /**
     *  trackingNumber: string
     */
    trackingNumber: string;

    /**
     * memberFirstName: string
     */
    memberFirstName: string;

    /**
     *  memberLastName: string
     */
    memberLastName: string;

    /**
     * requestStartDate: Date
     */
    requestStartDate: Date;

    /**
     *  requestEndDate: Date
     */
    requestEndDate: Date;

    /**
     * serviceCountry: string[]
     */
    serviceCountry: string[];

    /**
     *  providerId: number
     */
    providerId: number;

}
