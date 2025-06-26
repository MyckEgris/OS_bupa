/**
 * MemberOutputDto.ts
 *
 * @description: DTO member response
 * @author Juan Camilo Moreno
 * @author Arturo Suarez
 * @version 1.0
 * @date 10-10-2018.
 *
 **/


import { SpecialConditionOutputDto } from './specialCondition.dto';
import { EligibilitiesDto } from './eligibilities.dto';
import { PremiumValueComponentDto } from './premium-value-component.dto';
//Agregado
import { EmailOutputDto } from './email.dto';


/**
 * DTO member response
 */
export interface MemberOutputDto {
  memberId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  dob: string;
  policyId: string;
  policyNumber: number;
  isGroupPolicy: boolean;
  groupId?: number;
  applicationId: number;
  contactBaseId: number;
  memberStatus: string;
  memberStatusId: number;
  premiumValue: number;
  policyStatus: string;
  policyCountry: string;
  policyCountryId: number;
  insuranceBusinessId: number;
  insuranceBusinessName: string;
  relationTypeId: number;
  relationType: string;
  genderId: number;
  gender: string;
  searchDate: string;
  referenceNumber: string;
  requesterName: string;
  transactionId: number;
  benefitCurrencyCode: string;
  deductibleId: number;
  deductibleValue: number;
  maximumCoverageValue: number;
  plan: string;
  planDescription?: string;
  wWperiod: boolean;
  address: string;
  email: string;
  specialConditions: SpecialConditionOutputDto[];
  filterSpecialConditions?: SpecialConditionOutputDto[];
  eligibilities?: EligibilitiesDto[];
  premiumComponent?: PremiumValueComponentDto[];
  startDate?: string;
  endDate?: string;
  policyReference?: string;
  guardianMemberId?: number;
  emails?: EmailOutputDto[];
  phones?: any[];
}
