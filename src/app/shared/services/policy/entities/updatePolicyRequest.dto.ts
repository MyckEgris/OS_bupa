import { PolicyDto } from './policy.dto';
import { ChangeMetadataDto } from './changeMetadata.dto';

/**
* UpdatePolicyRequestDto DTO.ts
*
* @description: Update Policy Request's data transfer object.
* @author Ivan Hidalgo
* @date 05-09-2019.
*
**/
export interface UpdatePolicyRequestDto {
    policy: PolicyDto;
    changeMetadata: ChangeMetadataDto;
}
