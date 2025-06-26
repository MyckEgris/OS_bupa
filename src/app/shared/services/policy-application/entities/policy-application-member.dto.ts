/**
* PolicyApplicationDto.ts
*
* @description: DTO policy-application
* @author Vanessa Luna
* @version 1.0
* @date 10-01-2019.
*
**/

/**
 * DTO policy-application-member
 */

export interface PolicyApplicationMemberDto {
    applicationMemberGuid: string;
    applicationGuid: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: Date;
    genderId: string;
    systemMeasureId: string;
    weight: string;
    height: string;
    fullTimeStudent: string;
    schoolName: string;
    usCitizenResident: string;
    nationalityId: string;
    maritalStatusId: string;
    relationTypeId: number;
    dependentRelationId: string;
    ocupationId: string;
    previousPolicyId: string;
    previousMemberId: string;
    contactBaseId: string;
    gender: string;
    systemMeasure: string;
    nationality: string;
    maritalStatus: string;
    relationType: string;
    dependentRelation: string;
    ocupation: string;

}
