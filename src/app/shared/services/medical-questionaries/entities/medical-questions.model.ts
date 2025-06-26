import { MedicalQuestionByLanguages } from './medical-question-by-languages.model';
import { MedicalQuestionType } from './medical-question-type.model';

export class MedicalQuestions {
  medicalQuestionId: number;
  medicalQuestionReference: string;
  medicalQuestionExternalId: number;
  medicalQuestionTypeId: number;
  medicalQuestionaryId: number;
  order: number;
  medicalQuestionByLanguages: Array<MedicalQuestionByLanguages>;
  medicalQuestionType: MedicalQuestionType;
}
