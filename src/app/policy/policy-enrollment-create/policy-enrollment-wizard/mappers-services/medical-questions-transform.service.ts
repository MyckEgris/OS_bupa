import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { MedicalQuestion } from 'src/app/shared/services/medical-questionaries/entities/medical-question';
import { MedicalQuestionExtension } from 'src/app/shared/services/medical-questionaries/entities/medical-question-extension';
import { MedicalPhysician } from 'src/app/shared/services/medical-questionaries/entities/medical-physician';
// tslint:disable-next-line: max-line-length
import { GeneralQuestionDetail } from '../../policy-enrollment-steps/shared/policy-enrollment-step4/shared/models/general-question-details.model';
// tslint:disable-next-line: max-line-length
import { WomenQuestionDetail } from '../../policy-enrollment-steps/shared/policy-enrollment-step4/shared/models/women-question-details.model';
// tslint:disable-next-line: max-line-length
import { MedicalCheckUpQuestionDetail } from '../../policy-enrollment-steps/shared/policy-enrollment-step4/shared/models/medical-history-details/medical-check-up-details.model';
// tslint:disable-next-line: max-line-length
import { FamilyHistoryQuestionDetail } from '../../policy-enrollment-steps/shared/policy-enrollment-step4/shared/models/medical-history-details/family-history-details.model';
// tslint:disable-next-line: max-line-length
import { HabitsQuestionDetail } from '../../policy-enrollment-steps/shared/policy-enrollment-step4/shared/models/medical-history-details/habits-details.model';
import { MedicalHistory } from 'src/app/shared/services/medical-questionaries/entities/medical-history';
import { MedicalHistoryDetailCheckUp } from 'src/app/shared/services/medical-questionaries/entities/medical-history-detail-checkup.model';
import { MedicalHistoryDetailHabits } from 'src/app/shared/services/medical-questionaries/entities/medical-history-detail-habits.model';
import { FamilyDisorder } from 'src/app/shared/services/medical-questionaries/entities/family-disorder.model';
import { MedicalFamilyHistoryDetail } from 'src/app/shared/services/medical-questionaries/entities/medical-family-history-detail.model';
import { MedicalQuestionTypeEnum } from 'src/app/shared/services/medical-questionaries/entities/medical-question-type.enum';
// tslint:disable-next-line: max-line-length
import { QuestionsFormValues } from '../../policy-enrollment-steps/shared/policy-enrollment-step4/shared/models/questions-form-values.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalQuestionsTransformService {

  STRING_EMPTY = '';
  MEDICAL_EXAMS_ID = 1;
  HABITS_ID = 2;
  FAMILY_HISTORY_ID = 3;
  constructor(private commonService: CommonService) { }


  async transformPolicyApplicationModelMedicalQuestionnaires(currentSectionId: number,
    enrollmentForm: FormGroup, policyApplicationModel: PolicyApplicationModel) {
      switch (currentSectionId) {
        case 1:
          if (policyApplicationModel.medicalQuestion.length === 0) {
            await this.createPreselectionQuestions(enrollmentForm.get('preselectionQuestions') as FormGroup, policyApplicationModel);
          } else {
            await this.updatePreselectionQuestions(enrollmentForm.get('preselectionQuestions') as FormGroup, policyApplicationModel);
          }
          break;
        case 2:
          await this.createGeneralQuestions(enrollmentForm.get('generalQuestions1') as FormGroup, policyApplicationModel);
          break;
        case 3:
          await this.createGeneralQuestions(enrollmentForm.get('generalQuestions2') as FormGroup, policyApplicationModel);
          break;
        case 4:
          if (enrollmentForm.get('menQuestions')) {
            await this.createGeneralQuestions(enrollmentForm.get('menQuestions') as FormGroup, policyApplicationModel);
          }

          if (enrollmentForm.get('womenQuestions')) {
            await this.createWomenQuestions(enrollmentForm.get('womenQuestions') as FormGroup, policyApplicationModel);
          }
          break;
        case 5:
          await this.createMedicalsQuestionnaires(enrollmentForm.get('medicalHistoryQuestions') as FormGroup, policyApplicationModel);
          break;
        default:
          break;
      }
  }

  /**
   * Creates preselection questions
   * @param preselectionQuestionsForm
   * @param policyApplicationModel
   */
  async createPreselectionQuestions(preselectionQuestionsForm: FormGroup, policyApplicationModel: PolicyApplicationModel) {
    const keys = Object.keys(preselectionQuestionsForm.value);
    for (let index = 0; index < keys.length; index++) {
      const applicationMedicalQuestionGUID = await this.commonService.newGuidNuevo().toPromise();
      const questionTypeName = preselectionQuestionsForm.get(keys[index]).get('medicalQuestionTypeName').value;
      switch (questionTypeName) {
        case MedicalQuestionTypeEnum.HABITS:
          await this.createMedicalHabits(preselectionQuestionsForm.get(keys[index]) as FormGroup, policyApplicationModel);
          break;
        default:
          policyApplicationModel.medicalQuestion.push(new MedicalQuestion(applicationMedicalQuestionGUID,
            policyApplicationModel.applicationGuid,
            preselectionQuestionsForm.get(keys[index]).get('medicalQuestionId').value,
            preselectionQuestionsForm.get(keys[index]).get('answer').value, null));
          break;
      }
    }
  }
  /**
   * Updates preselection questions
   * @param preselectionQuestionsForm
   * @param policyApplicationModel
   */
  async updatePreselectionQuestions(preselectionQuestionsForm: FormGroup, policyApplicationModel: PolicyApplicationModel) {
    const keys = Object.keys(preselectionQuestionsForm.value);
    for (let index = 0; index < keys.length; index++) {
      const questionTypeName = preselectionQuestionsForm.get(keys[index]).get('medicalQuestionTypeName').value;
      switch (questionTypeName) {
        case MedicalQuestionTypeEnum.HABITS:
          await this.createMedicalHabits(preselectionQuestionsForm.get(keys[index]) as FormGroup, policyApplicationModel);
          break;
        default:
          policyApplicationModel.medicalQuestion[index].answer = preselectionQuestionsForm.get(keys[index]).get('answer').value;
          break;
      }
    }
    const anyYesAnswered = await this.anyQuestionAnsweredYes(preselectionQuestionsForm);
    if (!anyYesAnswered) {
      policyApplicationModel.medicalQuestion.splice(keys.length, policyApplicationModel.medicalQuestion.length);
    }
  }

  async anyQuestionAnsweredYes(preselectionQuestionsForm: FormGroup) {
    const controlsKeys = Object.keys(preselectionQuestionsForm.value);
    for (let index = 0; index < controlsKeys.length; index++) {
      if (preselectionQuestionsForm.get(controlsKeys[index]).get('answer').value === 'true') {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }

  /**
   * Creates general questions
   * @param generalQuestionsForm
   * @param policyApplicationModel
   */
  async createGeneralQuestions(generalQuestionsForm: FormGroup, policyApplicationModel: PolicyApplicationModel) {

    const generalQuestionsValues: QuestionsFormValues<GeneralQuestionDetail>[] = Object.values(generalQuestionsForm.value);
    const generalQuestionsKeys = Object.keys(generalQuestionsForm.value);

    for (let index = 0; index < generalQuestionsValues.length; index++) {

      if (!generalQuestionsValues[index].applicationMedicalQuestionGUID) { // This is a new register

        const applicationMedicalQuestionGUID = await this.commonService.newGuidNuevo().toPromise();
        const answer = generalQuestionsValues[index].answer === 'true' ? true : false;

        const medicalQuestion = new MedicalQuestion(applicationMedicalQuestionGUID, policyApplicationModel.applicationGuid,
          generalQuestionsValues[index].medicalQuestionId, answer, []);

        // To create details
        if (generalQuestionsValues[index].details.length > 0) {
          const keysDetail = Object.keys(generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').value);
          for (let i = 0; i < keysDetail.length; i++) {
            const applicationMedicalQuestionExtGUID = await this.commonService.newGuidNuevo().toPromise();
            const applicationAttendingPhysicianGUID = await this.commonService.newGuidNuevo().toPromise();

            const physician = new MedicalPhysician(applicationAttendingPhysicianGUID, applicationMedicalQuestionExtGUID,
              policyApplicationModel.applicationGuid,
              generalQuestionsValues[index].details[i].nameOfDoctor,
              generalQuestionsValues[index].details[i].specialtyOfDoctor,
              generalQuestionsValues[index].details[i].phoneNumber);

            const medicalQuestionExtension = new MedicalQuestionExtension(
              applicationMedicalQuestionExtGUID, applicationMedicalQuestionGUID,
              generalQuestionsValues[index].details[i].member,
              generalQuestionsValues[index].details[i].diseaseMedicalProblem,
              generalQuestionsValues[index].details[i].dateOfFirstSymptom,
              generalQuestionsValues[index].details[i].treatmentStartDate,
              generalQuestionsValues[index].details[i].treatmentEndDate,
              generalQuestionsValues[index].details[i].treatment,
              this.STRING_EMPTY, this.STRING_EMPTY, null, this.STRING_EMPTY,
              this.STRING_EMPTY, this.STRING_EMPTY, physician);

            // It's neccessary to set the value of GUID to field on form. In order to carry on what is new and what is not.
            generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').get(keysDetail[i])
              .get('applicationMedicalQuestionExtGUID').setValue(applicationMedicalQuestionExtGUID);

            generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').get(keysDetail[i])
              .get('applicationAttendingPhysicianGUID').setValue(applicationAttendingPhysicianGUID);

            medicalQuestion.medicalQuestionExtension.push(medicalQuestionExtension);
          }
        }
        policyApplicationModel.medicalQuestion.push(medicalQuestion);

        generalQuestionsForm.get(generalQuestionsKeys[index])
          .get('applicationMedicalQuestionGUID')
          .setValue(applicationMedicalQuestionGUID);

      } else { // This is an update
        try {
          const indexFound = policyApplicationModel.medicalQuestion
            .findIndex(guid => guid.applicationMedicalQuestionGUID === generalQuestionsValues[index].applicationMedicalQuestionGUID);

          policyApplicationModel.medicalQuestion[indexFound].answer = generalQuestionsValues[index].answer === 'true' ? true : false;

          if (generalQuestionsValues[index].answer.toString() === 'true') {
            if (generalQuestionsValues[index].details.length > 0) {

              policyApplicationModel.medicalQuestion[indexFound].medicalQuestionExtension = [];

              const keysDetail = Object.keys(generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').value);

              for (let i = 0; i < keysDetail.length; i++) {
                if (!generalQuestionsValues[index].details[i].applicationMedicalQuestionExtGUID ||
                  generalQuestionsValues[index].details[i].applicationMedicalQuestionExtGUID === '') { // Add detail
                  await this.addDetail(index, i, indexFound, generalQuestionsValues,
                    generalQuestionsKeys, keysDetail, generalQuestionsForm, policyApplicationModel);
                } else {
                  await this.updateDetail(generalQuestionsValues, index, i, indexFound, policyApplicationModel);
                }
              }
            }
          } else { // Doesnt neccessary details
            policyApplicationModel.medicalQuestion[indexFound].medicalQuestionExtension = [];
          }

        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  async addDetail(index: number, i: number, indexFound: number,
    generalQuestionsValues: QuestionsFormValues<GeneralQuestionDetail>[],
    generalQuestionsKeys, keysDetail, generalQuestionsForm: FormGroup,
    policyApplicationModel: PolicyApplicationModel) {
    const applicationMedicalQuestionExtGUID = await this.commonService.newGuidNuevo().toPromise();
    const applicationAttendingPhysicianGUID = await this.commonService.newGuidNuevo().toPromise();

    const physician = new MedicalPhysician(applicationAttendingPhysicianGUID,
      applicationMedicalQuestionExtGUID, policyApplicationModel.applicationGuid,
      generalQuestionsValues[index].details[i].nameOfDoctor,
      generalQuestionsValues[index].details[i].specialtyOfDoctor,
      generalQuestionsValues[index].details[i].phoneNumber);

    const medicalQuestionExtension = new MedicalQuestionExtension(
      applicationMedicalQuestionExtGUID, generalQuestionsValues[index].applicationMedicalQuestionGUID,
      generalQuestionsValues[index].details[i].member,
      generalQuestionsValues[index].details[i].diseaseMedicalProblem,
      generalQuestionsValues[index].details[i].dateOfFirstSymptom,
      generalQuestionsValues[index].details[i].treatmentStartDate,
      generalQuestionsValues[index].details[i].treatmentEndDate,
      generalQuestionsValues[index].details[i].treatment,
      this.STRING_EMPTY, this.STRING_EMPTY, null, this.STRING_EMPTY,
      this.STRING_EMPTY, this.STRING_EMPTY, physician);

    // It's neccessary to set the value of GUID to field on form. In order to carry on what is new and what is not.
    generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').get(keysDetail[i])
      .get('applicationMedicalQuestionExtGUID').setValue(applicationMedicalQuestionExtGUID);

    generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').get(keysDetail[i])
      .get('applicationAttendingPhysicianGUID').setValue(applicationAttendingPhysicianGUID);

    policyApplicationModel.medicalQuestion[indexFound].medicalQuestionExtension.push(medicalQuestionExtension);
  }

  async updateDetail(generalQuestionsValues: QuestionsFormValues<GeneralQuestionDetail>[], index: number, i: number, indexFound: number,
    policyApplicationModel: PolicyApplicationModel) {
    const applicationMedicalQuestionExtGUID = generalQuestionsValues[index].details[i].applicationMedicalQuestionExtGUID;
    const applicationAttendingPhysicianGUID = generalQuestionsValues[index].details[i].applicationAttendingPhysicianGUID;

    const physician = new MedicalPhysician(applicationAttendingPhysicianGUID,
      applicationMedicalQuestionExtGUID, policyApplicationModel.applicationGuid,
      generalQuestionsValues[index].details[i].nameOfDoctor,
      generalQuestionsValues[index].details[i].specialtyOfDoctor,
      generalQuestionsValues[index].details[i].phoneNumber);

    const medicalQuestionExtension = new MedicalQuestionExtension(
      applicationMedicalQuestionExtGUID, generalQuestionsValues[index].applicationMedicalQuestionGUID,
      generalQuestionsValues[index].details[i].member,
      generalQuestionsValues[index].details[i].diseaseMedicalProblem,
      generalQuestionsValues[index].details[i].dateOfFirstSymptom,
      generalQuestionsValues[index].details[i].treatmentStartDate,
      generalQuestionsValues[index].details[i].treatmentEndDate,
      generalQuestionsValues[index].details[i].treatment,
      this.STRING_EMPTY, this.STRING_EMPTY, null, this.STRING_EMPTY,
      this.STRING_EMPTY, this.STRING_EMPTY, physician);

    policyApplicationModel.medicalQuestion[indexFound].medicalQuestionExtension.push(medicalQuestionExtension);
  }

  /**
   * Creates general questions
   * @param generalQuestionsForm
   * @param policyApplicationModel
   */
  async createWomenQuestions(generalQuestionsForm: FormGroup, policyApplicationModel: PolicyApplicationModel) {

    const generalQuestionsValues: QuestionsFormValues<WomenQuestionDetail>[] = Object.values(generalQuestionsForm.value);
    const generalQuestionsKeys = Object.keys(generalQuestionsForm.value);

    for (let index = 0; index < generalQuestionsValues.length; index++) {

      if (!generalQuestionsValues[index].applicationMedicalQuestionGUID) { // This is a new register

        const applicationMedicalQuestionGUID = await this.commonService.newGuidNuevo().toPromise();
        const answer = generalQuestionsValues[index].answer === 'true' ? true : false;
        const medicalQuestion = new MedicalQuestion(applicationMedicalQuestionGUID, policyApplicationModel.applicationGuid,
          generalQuestionsValues[index].medicalQuestionId, answer, []);

        // To create details
        if (generalQuestionsValues[index].details.length > 0) {
          const keysDetail = Object.keys(generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').value);
          for (let i = 0; i < keysDetail.length; i++) {
            const applicationMedicalQuestionExtGUID = await this.commonService.newGuidNuevo().toPromise();
            const applicationAttendingPhysicianGUID = await this.commonService.newGuidNuevo().toPromise();

            const physician = new MedicalPhysician(applicationAttendingPhysicianGUID, applicationMedicalQuestionExtGUID,
              policyApplicationModel.applicationGuid,
              generalQuestionsValues[index].details[i].nameOfDoctor,
              generalQuestionsValues[index].details[i].specialtyOfDoctor,
              generalQuestionsValues[index].details[i].phoneNumber);

            const medicalQuestionExtension = new MedicalQuestionExtension(
              applicationMedicalQuestionExtGUID,
              applicationMedicalQuestionGUID,
              generalQuestionsValues[index].details[i].member,
              this.STRING_EMPTY, null, null, null, this.STRING_EMPTY,
              generalQuestionsValues[index].details[i].eventType,
              generalQuestionsValues[index].details[i].eventCause,
              generalQuestionsValues[index].details[i].eventDate, this.STRING_EMPTY, this.STRING_EMPTY,
              this.STRING_EMPTY, physician);

            // It's neccessary to set the value of GUID to field on form. In order to carry on what is new and what is not.
            generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').get(keysDetail[i])
              .get('applicationMedicalQuestionExtGUID').setValue(applicationMedicalQuestionExtGUID);

            generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').get(keysDetail[i])
              .get('applicationAttendingPhysicianGUID').setValue(applicationAttendingPhysicianGUID);


            medicalQuestion.medicalQuestionExtension.push(medicalQuestionExtension);
          }
        }
        policyApplicationModel.medicalQuestion.push(medicalQuestion);

        generalQuestionsForm.get(generalQuestionsKeys[index])
          .get('applicationMedicalQuestionGUID')
          .setValue(applicationMedicalQuestionGUID);

      } else { // This is an update
        try {
          const indexFound = policyApplicationModel.medicalQuestion
            .findIndex(guid => guid.applicationMedicalQuestionGUID === generalQuestionsValues[index].applicationMedicalQuestionGUID);
          policyApplicationModel.medicalQuestion[indexFound].answer =  generalQuestionsValues[index].answer === 'true' ? true : false;

          if (generalQuestionsValues[index].answer.toString() === 'true') {
            if (generalQuestionsValues[index].details.length > 0) {

              policyApplicationModel.medicalQuestion[indexFound].medicalQuestionExtension = [];

              const keysDetail = Object.keys(generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').value);
              for (let i = 0; i < keysDetail.length; i++) {
                if (!generalQuestionsValues[index].details[i].applicationMedicalQuestionExtGUID) { // New detail
                  const applicationMedicalQuestionExtGUID = await this.commonService.newGuidNuevo().toPromise();
                  const applicationAttendingPhysicianGUID = await this.commonService.newGuidNuevo().toPromise();

                  const physician = new MedicalPhysician(applicationAttendingPhysicianGUID,
                    applicationMedicalQuestionExtGUID, policyApplicationModel.applicationGuid,
                    generalQuestionsValues[index].details[i].nameOfDoctor,
                    generalQuestionsValues[index].details[i].specialtyOfDoctor,
                    generalQuestionsValues[index].details[i].phoneNumber);

                  const medicalQuestionExtension = new MedicalQuestionExtension(
                    applicationMedicalQuestionExtGUID,
                    generalQuestionsValues[index].applicationMedicalQuestionGUID,
                    generalQuestionsValues[index].details[i].member,
                    this.STRING_EMPTY, null, null, null, this.STRING_EMPTY,
                    generalQuestionsValues[index].details[i].eventType,
                    generalQuestionsValues[index].details[i].eventCause,
                    generalQuestionsValues[index].details[i].eventDate, this.STRING_EMPTY, this.STRING_EMPTY,
                    this.STRING_EMPTY, physician);

                  // It's neccessary to set the value of GUID to field on form. In order to carry on what is new and what is not.
                  generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').get(keysDetail[i])
                    .get('applicationMedicalQuestionExtGUID').setValue(applicationMedicalQuestionExtGUID);

                  generalQuestionsForm.get(generalQuestionsKeys[index]).get('details').get(keysDetail[i])
                    .get('applicationAttendingPhysicianGUID').setValue(applicationAttendingPhysicianGUID);

                  policyApplicationModel.medicalQuestion[indexFound].medicalQuestionExtension.push(medicalQuestionExtension);

                } else { // Update detail

                  const applicationMedicalQuestionExtGUID = generalQuestionsValues[index].details[i].applicationMedicalQuestionExtGUID;
                  const applicationAttendingPhysicianGUID = generalQuestionsValues[index].details[i].applicationAttendingPhysicianGUID;

                  const physician = new MedicalPhysician(applicationAttendingPhysicianGUID,
                    applicationMedicalQuestionExtGUID, policyApplicationModel.applicationGuid,
                    generalQuestionsValues[index].details[i].nameOfDoctor,
                    generalQuestionsValues[index].details[i].specialtyOfDoctor,
                    generalQuestionsValues[index].details[i].phoneNumber);

                  const medicalQuestionExtension = new MedicalQuestionExtension(
                    applicationMedicalQuestionExtGUID,
                    generalQuestionsValues[index].applicationMedicalQuestionGUID,
                    generalQuestionsValues[index].details[i].member,
                    this.STRING_EMPTY, null, null, null, this.STRING_EMPTY,
                    generalQuestionsValues[index].details[i].eventType,
                    generalQuestionsValues[index].details[i].eventCause,
                    generalQuestionsValues[index].details[i].eventDate, this.STRING_EMPTY, this.STRING_EMPTY,
                    this.STRING_EMPTY, physician);

                  policyApplicationModel.medicalQuestion[indexFound].medicalQuestionExtension.push(medicalQuestionExtension);
                }
              }
            }
          } else { // Doesnt neccessary details
            policyApplicationModel.medicalQuestion[indexFound].medicalQuestionExtension = [];
          }

        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  async createMedicalsQuestionnaires(generalQuestionsForm: FormGroup, policyApplicationModel: PolicyApplicationModel) {
    const keys = Object.keys(generalQuestionsForm.value);
    for (let index = 0; index < keys.length; index++) {
      switch (keys[index]) {
        case 'STEP45Q1':
          await this.createMedicalCheckUp(generalQuestionsForm.get(keys[index]) as FormGroup, policyApplicationModel);
          break;
        case 'STEP45Q2':
          await this.createMedicalHabits(generalQuestionsForm.get(keys[index]) as FormGroup, policyApplicationModel);
          break;
        case 'STEP45Q3':
          await this.createMedicalFamilyHistory(generalQuestionsForm.get(keys[index]) as FormGroup, policyApplicationModel);
          break;
        default:
          break;
      }
    }
  }

  async createMedicalCheckUp(questionsForm: FormGroup, policyApplicationModel: PolicyApplicationModel) {
    const questionsValues: QuestionsFormValues<MedicalCheckUpQuestionDetail> = questionsForm.value;
    if (!questionsValues.applicationMedicalQuestionGUID) {
      await this.newMedicalCheckUp(questionsValues, policyApplicationModel, questionsForm);
    } else {
      await this.updateMedicalCheckUp(questionsValues, policyApplicationModel);
    }
  }

  async newMedicalCheckUp(questionsValues: QuestionsFormValues<MedicalCheckUpQuestionDetail>,
    policyApplicationModel: PolicyApplicationModel, questionsForm: FormGroup) {
      const applicationMedicalHistoryGUID = await this.commonService.newGuidNuevo().toPromise();
      const answer = questionsValues.answer === 'true' ? true : false;
      const medicalHistory = new MedicalHistory(applicationMedicalHistoryGUID, policyApplicationModel.applicationGuid,
        questionsValues.medicalQuestionId, this.MEDICAL_EXAMS_ID, answer, []);
      if (answer) {
        const medicalCheckupQuestDetail = (questionsValues.details as MedicalCheckUpQuestionDetail[]);
        for (let index = 0; index < medicalCheckupQuestDetail.length; index++) {
          const medicalCheckUpDetail = medicalCheckupQuestDetail[index];
          const medicalHistoryDetail = new MedicalHistoryDetailCheckUp(medicalCheckUpDetail.member,
            medicalCheckupQuestDetail[index].date, medicalCheckupQuestDetail[index].healthResult,
            medicalCheckupQuestDetail[index].examinationType, medicalCheckupQuestDetail[index].detailOfAbnormalResult);
          medicalHistory.medicalHistoryDetail.push(medicalHistoryDetail);
        }
      }
      questionsForm.get('applicationMedicalQuestionGUID').setValue(applicationMedicalHistoryGUID);
      policyApplicationModel.medicalHistory.push(medicalHistory);
  }

  async updateMedicalCheckUp(questionsValues: QuestionsFormValues<MedicalCheckUpQuestionDetail>,
    policyApplicationModel: PolicyApplicationModel) {
    const answer = questionsValues.answer === 'true' ? true : false;
    const indexFound = policyApplicationModel.medicalHistory
      .findIndex(guid => guid.applicationMedicalHistoryGUID === questionsValues.applicationMedicalQuestionGUID);
    policyApplicationModel.medicalHistory[indexFound].answer = answer;
    policyApplicationModel.medicalHistory[indexFound].medicalQuestionId = questionsValues.medicalQuestionId;
    policyApplicationModel.medicalHistory[indexFound].medicalHistoryDetail = [];
    if (answer) {
      const medicalCheckupQuestDetail = (questionsValues.details as MedicalCheckUpQuestionDetail[]);
      for (let index = 0; index < medicalCheckupQuestDetail.length; index++) {
        const medicalCheckUpDetail = medicalCheckupQuestDetail[index];
        const medicalHistoryDetail = new MedicalHistoryDetailCheckUp(medicalCheckUpDetail.member,
          medicalCheckupQuestDetail[index].date, medicalCheckupQuestDetail[index].healthResult,
          medicalCheckupQuestDetail[index].examinationType, medicalCheckupQuestDetail[index].detailOfAbnormalResult);
        policyApplicationModel.medicalHistory[indexFound].medicalHistoryDetail.push(medicalHistoryDetail);
      }
    }
  }

  async createMedicalHabits(questionsForm: FormGroup, policyApplicationModel: PolicyApplicationModel) {
    const questionsValues: QuestionsFormValues<HabitsQuestionDetail> = questionsForm.value;
    if (!questionsValues.applicationMedicalQuestionGUID) {
      await this.newMedicalHabit(questionsValues, policyApplicationModel, questionsForm);
    } else {
      this.updateMedicalHabit(questionsValues, policyApplicationModel);
    }
  }

  async newMedicalHabit(questionsValues: QuestionsFormValues<HabitsQuestionDetail>,
     policyApplicationModel: PolicyApplicationModel, questionsForm: FormGroup) {
    const applicationMedicalHistoryGUID = await this.commonService.newGuidNuevo().toPromise();
    const answer: boolean = questionsValues.answer === 'true' ? true : false;
    const medicalHistory = new MedicalHistory(applicationMedicalHistoryGUID,
      policyApplicationModel.applicationGuid, questionsValues.medicalQuestionId, this.HABITS_ID, answer, []);

    if (answer) {
      const medicalHabitQuestDetail = (questionsValues.details as HabitsQuestionDetail[]);
      for (let index = 0; index < medicalHabitQuestDetail.length; index++) {
        const habitDetail = medicalHabitQuestDetail[index];
        const medicalHistoryHabitDetail = new MedicalHistoryDetailHabits(habitDetail.member, habitDetail.forHowLong,
          habitDetail.quantityDay, habitDetail.type);
        medicalHistory.medicalHistoryDetail.push(medicalHistoryHabitDetail);
      }
    }
    questionsForm.get('applicationMedicalQuestionGUID').setValue(applicationMedicalHistoryGUID);
    policyApplicationModel.medicalHistory.push(medicalHistory);
  }

  async updateMedicalHabit(questionsValues: QuestionsFormValues<HabitsQuestionDetail>,
    policyApplicationModel: PolicyApplicationModel) {
      const answer: boolean = questionsValues.answer === 'true' ? true : false;
      const indexFound = policyApplicationModel.medicalHistory
        .findIndex(guid => guid.applicationMedicalHistoryGUID === questionsValues.applicationMedicalQuestionGUID);
      policyApplicationModel.medicalHistory[indexFound].answer = answer;
      policyApplicationModel.medicalHistory[indexFound].medicalQuestionId = questionsValues.medicalQuestionId;
      policyApplicationModel.medicalHistory[indexFound].medicalHistoryDetail = [];
      if (answer) {
        const medicalHabitQuestDetail = (questionsValues.details as HabitsQuestionDetail[]);
        for (let index = 0; index < medicalHabitQuestDetail.length; index++) {
          const habitDetail = medicalHabitQuestDetail[index];

          const medicalHistoryHabitDetail = new MedicalHistoryDetailHabits(habitDetail.member, habitDetail.forHowLong,
            habitDetail.quantityDay, habitDetail.type);

          policyApplicationModel.medicalHistory[indexFound].medicalHistoryDetail.push(medicalHistoryHabitDetail);
        }
      }
  }


  async createMedicalFamilyHistory(questionsForm: FormGroup, policyApplicationModel: PolicyApplicationModel) {
    const questionsValues: QuestionsFormValues<FamilyHistoryQuestionDetail> = questionsForm.value;
    if (!questionsValues.applicationMedicalQuestionGUID) { // New register
      const applicationMedicalHistoryGUID = await this.commonService.newGuidNuevo().toPromise();
      const answer = questionsValues.answer === 'true' ? true : false;
      const medicalHistory = new MedicalHistory(applicationMedicalHistoryGUID,
        policyApplicationModel.applicationGuid, questionsValues.medicalQuestionId, this.FAMILY_HISTORY_ID, answer, []);

      if (answer) {
        const medicalFamilyHistoryDetail = (questionsValues.details as FamilyHistoryQuestionDetail[]);

        for (let index = 0; index < medicalFamilyHistoryDetail.length; index++) {
          const familyDetail = medicalFamilyHistoryDetail[index];

          const familyDisorder: FamilyDisorder[] = familyDetail.familyMembersWithDisorder as FamilyDisorder[];

          const familyHistoryDetail = new MedicalFamilyHistoryDetail(familyDetail.member, familyDetail.disorder,
            familyDisorder);

          medicalHistory.medicalHistoryDetail.push(familyHistoryDetail);
        }
      }
      questionsForm.get('applicationMedicalQuestionGUID').setValue(applicationMedicalHistoryGUID);
      policyApplicationModel.medicalHistory.push(medicalHistory);
    } else { // This is an update
      const answer = questionsValues.answer === 'true' ? true : false;
      const indexFound = policyApplicationModel.medicalHistory
        .findIndex(guid => guid.applicationMedicalHistoryGUID === questionsValues.applicationMedicalQuestionGUID);
      policyApplicationModel.medicalHistory[indexFound].answer = answer;
      policyApplicationModel.medicalHistory[indexFound].medicalQuestionId = questionsValues.medicalQuestionId;
      policyApplicationModel.medicalHistory[indexFound].medicalHistoryDetail = [];
      if (answer) {
        const medicalFamilyHistoryDetail = (questionsValues.details as FamilyHistoryQuestionDetail[]);
        for (let index = 0; index < medicalFamilyHistoryDetail.length; index++) {
          const familyDetail = medicalFamilyHistoryDetail[index];

          const familyDisorder: FamilyDisorder[] = familyDetail.familyMembersWithDisorder as FamilyDisorder[];

          const familyHistoryDetail = new MedicalFamilyHistoryDetail(familyDetail.member, familyDetail.disorder,
            familyDisorder);

          policyApplicationModel.medicalHistory[indexFound].medicalHistoryDetail.push(familyHistoryDetail);
        }
      }
    }
  }

}

