export class QuestionDetailModelBase {
  constructor(
    public applicationMedicalQuestionExtGUID: string,
    public applicationAttendingPhysicianGUID: string,
    public member: string,
    public memberFullName: string,
    public physicianName: string,
    public specialty: string,
    public phoneNumber: string
  ) {}
}
