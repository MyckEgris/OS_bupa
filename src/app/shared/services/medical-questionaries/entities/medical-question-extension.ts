import { MedicalPhysician } from './medical-physician';

export class MedicalQuestionExtension {
  constructor(public applicationMedicalQuestionExtGUID: string,
    public applicationMedicalQuestionGUID: string,
    public applicationMemberGUID: string,
    public medicalProblem: string,
    public firstSymptomDate: Date,
    public treatmentStartDate: Date,
    public treatmentEndDate: Date,
    public treatmentDetail: string,
    public cause: string,
    public type: string,
    public eventDate: Date,
    public habitType: string,
    public habitHowLong: string,
    public habitQuantityPerDay: string,
    public attendingPhysician: MedicalPhysician) {}
}
