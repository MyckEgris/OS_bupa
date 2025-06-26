import { SubjectDto } from './subject.dto';
import { AttachmentDto } from './attachment.dto';
import { InquiryUserDto } from './inquiry-user.dto';
import { Priority } from './priority-label.enum';

/***
 * Information to create a information request
 */
export interface InquiryDto {
    title: string;
    description: string;
    channelId: number;
    languageId: number;
    recordOriginId: number;
    inquiryType: number;
    subject: SubjectDto;
    interestedUser: InquiryUserDto;
    attachments: AttachmentDto[];
    senderUser: InquiryUserDto;
    priorityId?: number;
    parentInquiryId?: string;
    teamResolverId: number;
}
