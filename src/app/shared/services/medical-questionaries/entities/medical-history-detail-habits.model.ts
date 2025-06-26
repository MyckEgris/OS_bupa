import { MedicalHistoryDetail } from './medical-hitory-detail';

export class MedicalHistoryDetailHabits extends MedicalHistoryDetail {
  constructor(public applicationMemberGUID: string,
    public howLongTime: string,
    public quantity: string,
    public medicalType: string) {
      super(applicationMemberGUID);
    }
}
