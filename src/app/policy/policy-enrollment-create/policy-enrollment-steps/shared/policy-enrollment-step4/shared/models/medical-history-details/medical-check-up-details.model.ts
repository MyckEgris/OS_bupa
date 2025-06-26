import { MedicalHistoryDetailModelBase } from './medical-history-base.model';

export class MedicalCheckUpQuestionDetail extends MedicalHistoryDetailModelBase {
  constructor(
    public applicationMedicalHistoryGUID: string,
    public member: string,
    public memberFullName: string,
    public examinationType: string,
    public date: Date,
    public healthResult: string,
    public detailOfAbnormalResult: string,
  ) {
    super(applicationMedicalHistoryGUID, member, memberFullName);
   }
}
