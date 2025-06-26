/**
* CoveragesByPlanKeyDto.ts
*
* @description: DTO networks by productKey
* @author Santiago Gil Serna
* @date 11-03-2020.
*
**/

import { CoverageDto } from './coverage.dto';

export interface CoverageByPlanKeyDto {
  coverageKey: string;
  planKey: string;
  fromDate: string;
  toDate: string;
  waitingPeriodDays: number;
  waitingPeriodMonths: number;
  waitingPeriodBetweenSameServiceDays: number;
  requiresPreauthorization: boolean;
  coverages: CoverageDto;
  coinsurance: number;
  deductible: boolean;
  copay: number;
  costLimitTotal: number;
  quantityLimit: number;
  costLimitUnit: number;
  generalWaitingPeriodDays: number;
}
