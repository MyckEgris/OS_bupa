import { PolicyChangeDto } from './policyChangeType.dto';

/**
* changeMetadata.ts
*
* @description: DTO changeMetadata member
* @author Ivan Hidalgo
* @date 04-09-2019.
*
**/
export interface ChangeMetadataDto {
    policyChangeType: PolicyChangeDto;
    effectiveDate: Date;
    description: string;
    languageId: number;
}
