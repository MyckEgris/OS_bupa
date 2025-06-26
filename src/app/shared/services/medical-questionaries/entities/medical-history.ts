import { MedicalHistoryDetail } from './medical-hitory-detail';

export class MedicalHistory {
  constructor(public applicationMedicalHistoryGUID: string,
    public applicationGUID: string,
    public medicalQuestionId: number,
    public medicalHistoryTypeId: number,
    public answer: boolean,
    public medicalHistoryDetail: Array<MedicalHistoryDetail>
    ) {}
}
