import { ErrorsResponseDto } from './errorsResponse.dto';

/**
* DocumentProcessingResponseDto.ts
*
* @description: DTO Document Processing Response
* @author Jose Daniel Hernández M
* @date 27-01-2020.
*
**/

export interface DocumentProcessingResponseDto {
    message: string;
    status: string;
    errors: ErrorsResponseDto[];
}
