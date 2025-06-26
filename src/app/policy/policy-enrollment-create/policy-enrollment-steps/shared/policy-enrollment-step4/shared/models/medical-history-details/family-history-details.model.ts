import { MedicalHistoryDetailModelBase } from './medical-history-base.model';
import { FamilyDisorder } from 'src/app/shared/services/medical-questionaries/entities/family-disorder.model';

export class FamilyHistoryQuestionDetail extends MedicalHistoryDetailModelBase {
  constructor(
    public applicationMedicalHistoryGUID: string,
    public member: string,
    public memberFullName: string,
    public familyMembersWithDisorder: FamilyDisorder[],
    public disorder: string
  ) {
    super(applicationMedicalHistoryGUID, member, memberFullName);
   }
}
