import { InquiriesOutputDto } from './inquiries-output.dto';

/***
 * Encapsulates the query response - information request
 */
export interface InquiryResponseDto {
    status: number;
    count: number;
    pageindex: number;
    pageSize: number;
    data: InquiriesOutputDto[];
}
