
/**
* Agent.ts
*
* @description: Contract for agent service.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 21-11-2018.
*
**/

import { Agent } from 'src/app/shared/services/agent/entities/agent';

/**
 * Contract for agent service.
 */
export interface Agent {
    /**
   * Gets agent information by id.
   * @param id Agent Id.
   */
    getAgentById(id: string, agentPreferredMail?: string);

    /**
   * Update Agent Profile
   * @param agent Agent
   */
    updateAgentProfile(agent: Agent);

    getPortfolioByAgent();

    getPortfolioByAgentAndShowPremiums();

    getPortfolioByAgentAndShowPolicies();
}
