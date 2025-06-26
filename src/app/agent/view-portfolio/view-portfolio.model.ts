export interface ViewPortfolio {
    title: string;
    active: number;
    gracePeriod: number;
    pendingPayment: number;
    pendingOther: number;
    pendingApp: number;
    pendingInfo: number;
    pendingOthers: number;
    inactive: number;
    rejected: number;
    cancelled: number;
    total: number;
    lapsed: number;
    symbol: string;
    pendingDetailed?: Array<any>;
    inactiveDetailed?: Array<any>;
    agentName?: string;
}

export class PortfolioByAgent {
    typePortfolio: string;
    val: number;
}
