import { SubjectDto } from './subject.dto';
import { InquiryUserDto } from './inquiry-user.dto';
import { AttachmentDto } from './attachment.dto';

/***
 * Information to create a information request
 */
export interface InformationRequestDto {
    title: string;
    description: string;
    channelId: number;
    languageId: number;
    recordOriginId: number;
    subject: SubjectDto;
    interestedUser: InquiryUserDto;
    attachments: AttachmentDto[];
    senderUser: InquiryUserDto;
}
