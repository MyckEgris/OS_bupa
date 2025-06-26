export class MedicalHistoryDetailModelBase {
  constructor(
    public applicationMedicalHistoryGUID: string,
    public member: string,
    public memberFullName: string
  ) {}
}
