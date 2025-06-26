import { MedicalHistoryDetailModelBase } from './medical-history-base.model';

export class HabitsQuestionDetail extends MedicalHistoryDetailModelBase {
  constructor(
    public applicationMedicalHistoryGUID: string,
    public member: string,
    public memberFullName: string,
    public type: string,
    public forHowLong: string,
    public quantityDay: string,
  ) {
    super(applicationMedicalHistoryGUID, member, memberFullName);
   }
}
