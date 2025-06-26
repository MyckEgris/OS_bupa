/**
* AddedCoverageDto.ts
*
* @description: DTO coverage to send to update
* @author Santiago Gil Serna
* @date 16-03-2020 3:30pm.
*
**/

export interface AddedCoverageDto {
  coverageKey: string;
  planKey: string;
  fromDate: string;
  toDate: string;
  waitingPeriodDays: number;
  waitingPeriodMonths: number;
  waitingPeriodBetweenSameServiceDays: number;
  requiresPreauthorization: boolean;
  isActiveCoverage: boolean;
  coinsurance: number;
  deductible: boolean;
  copay: number;
  costLimitTotal: number;
  quantityLimit: number;
  costLimitUnit: number;
  generalWaitingPeriodDays: number;
}
