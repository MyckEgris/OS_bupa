import { Time } from "@angular/common";



/**
 *  InquiryAppointment Interface.
 */
export interface InquiryAppointment {

    /**
     * appointmentTypeId
     */
    appointmentTypeId: number;

    /**
     * appointmentTypeName
     */
    appointmentTypeName: string;

    /**
     * appointmentTypeDescription
     */
    appointmentTypeDescription: string;

    /**
     * appointmentDate
     */
    appointmentDate: Date;

    /**
     * appointmentTime
     */
    appointmentTime: any;

}
