import { MedicalQuestions } from './medical-questions.model';
/**
* MedicalQuestionary.ts
*
* @description: Model to support dto from api mecial.
* @author Enrique Durango
* @version 1.0
* @date 2019-12-09.
*
**/
export class MedicalQuestionary {
  medicalQuestionaryId: number;
  medicalQuestionaryName: string;
  medicalQuestionaryFrom: Date;
  medicalQuestionaryTo: Date;
  medicalQuestionaryVersion: string;
  insuranceBusinessId: number;
  processOptionId: number;
  medicalQuestions: Array<MedicalQuestions>;
}
