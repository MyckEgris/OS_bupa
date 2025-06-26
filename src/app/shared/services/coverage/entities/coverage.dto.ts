/**
* CoverageDto.ts
*
* @description: DTO coverage
* @author Santiago Gil Serna
* @date 11-03-2020.
*
**/

export interface CoverageDto {
  coverageKey: string;
  coverageName: string;
  coverageSourceCode: string;
  fromDate: string;
  toDate: string;
  minAge: number;
  maxAge: number;
  gender: string;
  coverageId: number;
}

