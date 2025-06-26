import { SubjectDto } from './subject.dto';
import { InquiryDigitalStatusDto } from './inquiry-digital-status.dto';
import { InquiryUserDto } from './inquiry-user.dto';
import { InquiryResolutionDto } from './inquiry-resolution.dto';

/***
 * Interface that maps the response of the information requests.
 */
export  interface InquiriesOutputDto {
    inquiryId: string;
    title: string;
    ticketNumber: string;
    subject: SubjectDto;
    interestedUser: InquiryUserDto;
    senderUser: InquiryUserDto;
    createdOn: Date;
    inquiryDigitalStatus: InquiryDigitalStatusDto;
    inquiryResolution: InquiryResolutionDto;
    parentInquiry: any;
    description?: string;
}
