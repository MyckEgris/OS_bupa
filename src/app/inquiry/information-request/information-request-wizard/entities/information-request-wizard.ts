import { FormGroup } from '@angular/forms';
import { ClaimSubmissionMember } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionMember';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { TreeViewPersonalized } from 'src/app/shared/components/tree-view-personalized/entities/treeview-personalized';
import { ListSubjectDto } from 'src/app/shared/services/inquiry/entities/list-subject.dto';
import { Country } from 'src/app/shared/services/common/entities/country';
import { InquiryAppointment } from './inquiryAppointment';
import { InquirySpeciality } from './inquirySpeciality';



/**
 * DTO information request wizard
 */
export interface InformationRequestWizard {


    /**
     * infoRequestForm
     */
    infoRequestForm: FormGroup;

    /**
     * currentStep
     */
    currentStep: number;

    /**
     * documents
     */
    documents: FileDocument[];

    /**
     * memberSearch
     */
    memberSearch: ClaimSubmissionMember[];

    /**
     * member
     */
    member: ClaimSubmissionMember;

    /**
     * subject
     */
    subject: TreeViewPersonalized;

    /**
     * holderMemberId
     */
    holderMemberId: number;

    /**
     * listSubject
     */
    listSubject: ListSubjectDto;

    /**
     * optionType
     */
    optionType: string;

    /**
     * countryOfResident
     */
    countryOfResident: Country;

    /**
     * countryAreaCode
     */
    countryAreaCode: string;

    /**
     * phoneNumber
     */
    phoneNumber: string;

    /**
     * appointmentType
     */
    appointmentType: InquiryAppointment;

    /**
     * speciality
     */
    speciality: InquirySpeciality;

}
