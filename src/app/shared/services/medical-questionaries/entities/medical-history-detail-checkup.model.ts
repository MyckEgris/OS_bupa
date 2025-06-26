import { MedicalHistoryDetail } from './medical-hitory-detail';

export class MedicalHistoryDetailCheckUp extends MedicalHistoryDetail {
  constructor(public applicationMemberGUID: string,
    public medicalHistoryDate: Date,
    public medicalResult: string,
    public medicalCheckUpType: string,
    public medicalAbnormalDetailResult: string) {
      super(applicationMemberGUID);
    }
}
