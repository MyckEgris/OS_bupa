import { InteractionDocument } from './interaction-document';

export interface InteractionRequestDto {
    interationByCustomer: boolean;
    inquiryId: string;
    observation: string;
    statusCode: number;
    attachments: Array<InteractionDocument>;
}
