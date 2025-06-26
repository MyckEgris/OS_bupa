/**
* Policy.ts
*
* @description: Contract for policy service.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

import { MemberInputDto } from '../services/policy/entities/member.dto';
import { UserInformationModel } from 'src/app/security/model/user-information.model';

/**
 * Contract for policy service.
 */
export interface Policy {

    /**
     * Gets members by policy and DoB.
     * @param member MemberInputDto
     * @param user User information
     */
    getPolicyMembersByPolicyIdAndDoBAndEligibility(member: MemberInputDto, user: UserInformationModel);

    /**
     * Gets members by name, last name and DoB filters.
     * @param member MemberInputDto
     * @param user User information
     */
    getMembersEligibility(member: MemberInputDto, user: UserInformationModel);

    /**
     * Gets the reference number of a member.
     * @param memberId Member Id.
     * @param referencenumber Reference Number.
     * @param transactionId Transaction Id.
     */
    getReferenceNumberOfMemberEligible(memberId: number, referencenumber: string, transactionId: number);

    /**
     * Gets all policy members filtered by policy id.
     * @param policyId Policy Id.
     * @param searchMemberType Search Member Type.
     */
    getPolicyMembersByPolicyId(policyId: number, searchMemberType?: string);

    /**
     * Gets all policy members filtered by policy number.
     * @param policyId Policy Id.
     * @param roleId Role Id.
     * @param paymentPendingTopay Set to true to include the records with status Pending to pay.
     * @param userKey User Key.
     */
    getPolicyByPolicyId(roleId: string, userKey: string, paymentPendingTopay: boolean, policyId: number);


    /**
     * Gets all policy members filtered by names.
     * @param policyId Policy Id.
     * @param roleId Role Id.
     * @param paymentPendingTopay Set to true to include the records with status Pending to pay.
     * @param userKey User Key.
     * @param firstName First Name
     * @param lastName Last Name
     * @param pageSize Page Size
     * @param pageIndex Page Index
     */
    getListOfPolicies(roleId: string, userKey: string, paymentPendingTopay: boolean,
        firstName: string, lastName: string, pageIndex: number, pageSize: number);


    /**
     * Gets all payments belonging to a policy.
     * @param policyId Policy Id.
     */
    getPaymentsByPolicyId(policyId: number);

    /**
     * Gets all Uso CFDI active.     
     */
    getCFDIAndRegimes();

    /**
     * Send a pdf file to API.
     * @param pdf Pdf file.
     */
    processPDF(formData: FormData);

    /**
     * Send tax data to API.
     * @param data Tax data.
     */
    updateTaxData(data: any);

    /**
     * Save PDF document
     * @param data 
     * @param file
     */
    saveDocument(data: any, file: File);
}
