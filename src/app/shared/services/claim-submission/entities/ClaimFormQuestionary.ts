/**
* ClaimSubmissionRequest.ts
*
* @description: DTO claim form questionary
* @author Johnny Gutierrez
* @version 1.0
* @date 30-08-2020.
*
**/

import { MedicalQuestions } from "../../medical-questionaries/entities/medical-questions.model";

/**
 * DTO claim form questionary
 */
export interface ClaimFormQuestionary {
    questionaryId: number;

    medicalQuestionId: number;

    medicalQuestionParentId: number;

    medicalQuestion: string;

    answer: string;

    medicalQuestionObject: MedicalQuestions;
}