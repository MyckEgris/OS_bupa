import { AttachmentDto } from './attachment.dto';

export interface AttachmentResponseDto {
    data: Array<AttachmentDto>;
    count: number;
    pageIndex: number;
    pageSize: number;
}
