import { QuestionDetailModelBase } from './question-detail-base.model';

export class WomenQuestionDetail extends QuestionDetailModelBase {
  constructor(
    public applicationMedicalQuestionExtGUID: string,
    public applicationAttendingPhysicianGUID: string,
    public member: string,
    public memberFullName: string,
    public eventType: string,
    public eventCause: string,
    public eventDate: Date,
    public nameOfDoctor: string,
    public specialtyOfDoctor: string,
    public phoneNumber: string
  ) {
    super(applicationMedicalQuestionExtGUID, applicationAttendingPhysicianGUID, member,
       memberFullName, nameOfDoctor, specialtyOfDoctor, phoneNumber);
  }
}
