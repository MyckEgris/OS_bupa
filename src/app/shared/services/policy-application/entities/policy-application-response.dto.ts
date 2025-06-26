import { PolicyApplicationDto } from './policy-application.dto';

export interface PolicyApplicationResponse {
    totalCount: number;
    pageindex: number;
    pageSize: number;
    policyApplications: PolicyApplicationDto[];
}
