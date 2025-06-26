export class MedicalPhysician {
  constructor(public applicationAttendingPhysicianGUID: string,
    public applicationMedicalQuestionExtGUID: string,
    public applicationGUID: string,
    public physicianName: string,
    public specialty: string,
    public phoneNumber: string) {}
}
