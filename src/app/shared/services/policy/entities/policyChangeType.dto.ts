import { DescriptionByLanguageDto } from './descriptionByLanguage.dto';

/**
* PolicyChangeDto.ts
*
* @description: Policy Change DTO.
* @author Ivan Hidalgo
* @date 11-02-2019.
*
**/
export interface PolicyChangeDto {
    processId: number;
    processOptionId: number;
    processOptionName: string;
    descriptionByLanguage: DescriptionByLanguageDto[];
}
