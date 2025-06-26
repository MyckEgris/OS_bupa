/**
* MemberInputDto.ts
*
* @description: DTO member
* @author Juan Camilo Moreno
* @author Arturo Suarez
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * DTO member
 */
export interface MemberInputDto {

    /**
     * searchMemberType
     */
    searchMemberType: string;

    /**
     * policyId
     */
    policyId: string;

    /**
     * firstName
     */
    firstName: string;

    /**
     * lastName
     */
    lastName: string;

    /**
     * dob
     */
    dob: Date;
}
