/**
* ClaimSubmissionMember.ts
*
* @description: Model claim submission member
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * Model claim submission member
 */
export interface ClaimSubmissionMember {

  /**
   * memberId
   */
  memberId: number;

  /**
   * firstName
   */
  firstName: string;

  /**
   * middleName
   */
  middleName: string;

  /**
   * lastName
   */
  lastName: string;

  /**
   * fullName
   */
  fullName: string;

  /**
   * dob
   */
  dob: Date;

  /**
   * policyId
   */
  policyId: string;

  /**
   * policyNumber
   */
  policyNumber: string;

  /**
   * isGroupPolicy
   */
  isGroupPolicy: boolean;

  /**
   * groupId
   */
  groupId?: number;

  /**
   * applicationId
   */
  applicationId: string;

  /**
   * contactBaseId
   */
  contactBaseId: number;

  /**
   * memberStatus
   */
  memberStatus: string;

  /**
   * policyStatus
   */
  policyStatus: string;

  /**
   * policyCountryId
   */
  policyCountryId: number;

  /**
   * policyCountry
   */
  policyCountry: string;

  /**
   * insuranceBusinessName
   */
  insuranceBusinessName: string;

  /**
   * insuranceBusinessId
   */
  insuranceBusinessId: number;

  /**
   * relationTypeId
   */
  relationTypeId: number;

  /**
   * relationType
   */
  relationType: string;

  /**
   * genderId
   */
  genderId: number;

  /**
   * gender
   */
  gender: string;

  /**
   * searchDate
   */
  searchDate: Date;

  /**
   * referenceNumber
   */
  referenceNumber: string;

  /**
   * requesterName
   */
  requesterName: string;

  /**
   * transactionId
   */
  transactionId: number;
  
  /**
   * email
   */
  email: string;

  /**
   * phoneNumber
   */
  phoneNumber: number;

  /**
   * policyReference
   */
  policyReference: string;

}
