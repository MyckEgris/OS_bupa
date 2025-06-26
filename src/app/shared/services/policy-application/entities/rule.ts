export interface Rule {
    applicationRulesGuid: string;
    applicationGuid: string;
    rulesByBusinessId: number;
    answer: boolean;
    ruleName: string;
    ruleDescription: string;
    isRequired: boolean;
    order: number;
}
