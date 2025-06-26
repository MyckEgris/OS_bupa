/**
* CardDTO.ts
*
* @description: Documents of policy's members
* @author Andres Tamayo
* @date 11-02-2019.
*
**/
import { PolicyDto } from './policy.dto';

export interface PolicyResponse {
    count: number;
    pageindex: number;
    pageSize: number;
    data: PolicyDto[];
}
