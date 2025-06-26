import { FamilyDisorder } from './family-disorder.model';
import { MedicalHistoryDetail } from './medical-hitory-detail';

export class MedicalFamilyHistoryDetail extends MedicalHistoryDetail {
  constructor(public applicationMemberGUID: string,
    public medicalDisorder: string,
    public medicalFamilyDisorder: Array<FamilyDisorder>) {
      super(applicationMemberGUID);
    }
}
