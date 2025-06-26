export interface QuoteRequest {
  applicationQuoteGuid: string;
  applicationGuid: string;
  amountToPay: number;
  planId: number;
  deductibleRegionPlanXRefId: number;
  numberAdultsQuoted: number;
  numberChildrenQuoted: number;
  effectiveDate: Date;
}
