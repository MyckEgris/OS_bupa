import { Portfolio } from './portfolio';
import { SubAgent } from './subagent';

export interface PortfolioDto {
    agentId: number;
    portfolio: Portfolio;
    subAgents: Array<SubAgent>;
}
