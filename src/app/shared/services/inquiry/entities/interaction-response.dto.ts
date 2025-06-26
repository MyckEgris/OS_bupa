import { InteractionDto } from './interaction.dto';

export interface InteractionResponseDto {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Array<InteractionDto>;
}
