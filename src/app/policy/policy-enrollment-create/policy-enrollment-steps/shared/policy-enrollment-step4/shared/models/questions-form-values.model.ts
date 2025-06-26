export class QuestionsFormValues<T> {
    applicationMedicalQuestionGUID: string;
    medicalQuestionId: number;
    medicalQuestionTypeId: number;
    medicalQuestionTypeName: string;
    answer: string;
    details: Array<T>;
}
