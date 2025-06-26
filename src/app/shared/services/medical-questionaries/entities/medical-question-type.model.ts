import { MedicalQuestionExtensions } from './medical-question-extensions.model';

export class MedicalQuestionType {
  medicalQuestionTypeId: number;
  medicalQuestionTypeName: string;
  medicalQuestionExtensions: Array<MedicalQuestionExtensions>;
}
