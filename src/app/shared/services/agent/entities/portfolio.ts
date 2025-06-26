export interface Portfolio {
    agentId: number;
    quantityType: string;
    currencySymbol: string;
    activeQuantity: number;
    graceQuantity: number;
    lapsedQuantity: number;
    cancelledQuantity: number;
    pendingPaymentQuantity: number;
    pendingAppQuantity: number;
    pendingInfoQuantity: number;
    pendingOtherQuantity: number;
    rejectedQuantity: number;
}
