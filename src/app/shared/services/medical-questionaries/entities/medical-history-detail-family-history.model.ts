import { MedicalHistoryDetail } from './medical-hitory-detail';
import { FamilyDisorder } from './family-disorder.model';

export class MedicalHistoryDetailFamilyHistory extends MedicalHistoryDetail {
  constructor(public applicationMemberGUID: string,
    public medicalDisorder: string,
    public medicalFamilyDisorder: FamilyDisorder) {
      super(applicationMemberGUID);
    }
}
