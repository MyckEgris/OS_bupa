/**
* Claim.ts
*
* @description: Contract for claim service.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

/**
 * Contract for claim service.
 */
export interface Claim {
    /**
     * This method get claims from claim API with provider id, member name as parameter and state of claims
     * @param providerId Provider Id
     * @param memberName Member Name
     * @param state State
     * @param page Page
     * @param pageSize Page Size
     */
    getClaimsByProviderIdAndStateAndAdvancedOptions(userKey: string, roleId: string, providerId: string, memberFirstName: string,
        memberLastName: string, state: string, page: number, pageSize: number, billedAmount: number, claimNumber: number, policyId: number,
        accountNumber: number, serviceFromStart: Date, serviceFromEnd: Date, serviceToStart: Date, serviceToEnd: Date);

    /**
     * This method gets claims from claim API with role id agent and state of claims
     * @param userKey userKey
     * @param roleId roleId
     * @param state state
     * @param pageSize pageSize
     * @param page page
     * @param memberLastName memberLastName
     * @param policyId policyId
     * @param policyLegacyId policyLegacyId
     * @param providerName providerName
     * @param paymentType paymentType
     * @param paymentNumber paymentNumber
     * @param claimNumber claimNumber
     * @param claimSource claimSource All = 0, BupaMex = 1, BupaBGLA = 2
     */
    getClaimsByAgentRoleAndStateAndAdvancedOptions(userKey: string, roleId: string, state: string, pageSize: number,
        page: number, memberLastName: string, policyId: number, policyLegacyId: number, providerName: string, paymentType: string,
        paymentNumber: string, claimNumber: number, claimSource?: number, claimsListLogId?: number
    );

    /**
     * Get detail for each claim
     * @param claimDetail Claim Detail Id
     */
    getDetailsForClaim(claimDetail: number);

    /**
     * Get explanation of benefits document.
     * @param claimDetail Claim Detail Id
     * @param statusId Status Id
     * @param insuranceBusinessId Insurance business Id
     */
    getEobForClaim(claimDetail: number, roleId: string, businessId: string);
}
