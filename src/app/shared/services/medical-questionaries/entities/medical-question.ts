import { MedicalQuestionExtension } from './medical-question-extension';

export class MedicalQuestion {
  constructor(public applicationMedicalQuestionGUID: string,
    public applicationGUID: string,
    public medicalQuestionId: number,
    public answer: boolean,
    public medicalQuestionExtension: Array<MedicalQuestionExtension>) {  }
}
