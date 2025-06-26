import { MedicalQuestion } from './../../../../../../../shared/services/medical-questionaries/entities/medical-question';
/**
* question.component.ts
*
* @description: This class handle step  policy aplication wizard.
* @author Enrique Durango.
* @version 1.0
* @date 06-12-2019.
*
**/
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { GeneralQuestionDetail } from '../models/general-question-details.model';
import { QuestionDetailModelBase } from '../models/question-detail-base.model';
import { WomenQuestionDetail } from '../models/women-question-details.model';
import { MedicalHistoryDetailModelBase } from '../models/medical-history-details/medical-history-base.model';
import { MedicalCheckUpQuestionDetail } from '../models/medical-history-details/medical-check-up-details.model';
import { HabitsQuestionDetail } from '../models/medical-history-details/habits-details.model';
import { FamilyHistoryQuestionDetail } from '../models/medical-history-details/family-history-details.model';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { MedicalMember } from '../models/medical-members.model';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { MedicalQuestionExtension } from 'src/app/shared/services/medical-questionaries/entities/medical-question-extension';
import * as moment from 'moment';
import { FamilyDisorder } from 'src/app/shared/services/medical-questionaries/entities/family-disorder.model';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit {

  /**
   * Input  of question component
   */
  @Input() questionForm: FormGroup;
  /**
   * Input  of question component
   */
  @Input() question: MedicalQuestions;
  /**
   * Input  of question component
   */
  @Input() index: number;
  /**
   * Input  of question component
   */
  @Input() medicalQuestionaryName: string;
  /**
   * Input  of question component
   */
  @Input() hasDetails: boolean;
  /**
   * Input  of question component
   */
  @Input() showValidation: boolean;
  /**
   * Input  of question component
   */
  @Input() members: Array<MedicalMember>;
  /**
   * Output  of question component
   */
  @Output() deleteQuestionDetail: EventEmitter<number> = new EventEmitter();
  @Input() isEdit: boolean;
  /**
   * String empty of question component
   */
  public STRING_EMPTY = '';

  private _policyApplicationModel: PolicyApplicationModel;
  @Input()
  set policyApplicationModel(value: PolicyApplicationModel) {
    this._policyApplicationModel = value;
  }

  get policyApplicationModel(): PolicyApplicationModel {
    return this._policyApplicationModel;
  }
  /**
   * Creates an instance of question component.
   * @param fb
   */
  constructor(private fb: FormBuilder,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService) { }
  /**
   * Answer  of question component
   */
  public answer: string;
  /**
   * Options  of question component
   */
  public options: Array<any> = [{key: 'Si', value: 'true'}, {key: 'No', value: 'false'}];
  /**
   * Simple question type of question component
   */
  public SIMPLE_QUESTION_TYPE = 'SimpleQuestionType';
  public MEDICAL_CHECKUP_QUESTION_TYPE = 'medicalCheckUpQuestionType';
  public HABITS_QUESTION_TYPE = 'habitsQuestionType';
  public FAMILY_HISTORY_QUESTION_TYPE = 'familyHistoryQuestionType';
  public GENERAL_QUESTION_TYPE = 'GeneralQuestionType';
  public WOMEN_QUESTION_TYPE = 'WomenQuestionType';
  /**
   * App medical quest guid of question component
   */
  public appMedicalQuestGUID: string;
  /**
   * Determines whether first detail is
   */
  public isFirstDetail: boolean;
  /**
   * on init
   */
  ngOnInit() {
    switch (this.question.medicalQuestionType.medicalQuestionTypeName) {
      case this.MEDICAL_CHECKUP_QUESTION_TYPE:
      case this.HABITS_QUESTION_TYPE:
      case this.FAMILY_HISTORY_QUESTION_TYPE:
        this.factoryMedicalHistory();
        break;
      default: // this.GENERAL_QUESTION_TYPE, this.SIMPLE_QUESTION_TYPE
        this.factoryMedicalQuestion();
        break;
    }
  }

  factoryMedicalQuestion() {
    if (this.policyApplicationModel.medicalQuestion.find(m => m.medicalQuestionId === this.question.medicalQuestionId)) {
      const questionSaved = this.policyApplicationModel.medicalQuestion.find(m => m.medicalQuestionId === this.question.medicalQuestionId);
      (this.questionForm.get(this.medicalQuestionaryName) as FormGroup).addControl(this.question.medicalQuestionReference,
        this.fb.group({
          applicationMedicalQuestionGUID: questionSaved.applicationMedicalQuestionGUID,
          medicalQuestionId: this.question.medicalQuestionId,
          medicalQuestionTypeId: this.question.medicalQuestionType.medicalQuestionTypeId,
          medicalQuestionTypeName: this.question.medicalQuestionType.medicalQuestionTypeName,
          answer: [questionSaved.answer.toString(), Validators.required],
          details: this.fb.array(this.factoryMedicalQuestionDetail(questionSaved)),
        }));
        this.answer = questionSaved.answer.toString();
    } else {
      this.buildFormQuestionNew();
    }
  }

  factoryMedicalQuestionDetail(questionSaved: MedicalQuestion) {
    switch (this.question.medicalQuestionType.medicalQuestionTypeName) {
      case this.GENERAL_QUESTION_TYPE:
        return this.buildDetailGeneralQuestionType(questionSaved);
      default:
        return [];
    }
  }

  buildDetailGeneralQuestionType(questionSaved: MedicalQuestion) {
    if (questionSaved.medicalQuestionExtension) {
      return questionSaved.medicalQuestionExtension.map(q => (this.fb.group(new GeneralQuestionDetail(
        q.applicationMedicalQuestionExtGUID,
        q.attendingPhysician.applicationAttendingPhysicianGUID,
        q.applicationMemberGUID,
        this.members.find(m => m.applicationMemberGuid === q.applicationMemberGUID).fullName,
        q.medicalProblem,
        q.treatmentDetail,
        moment(q.firstSymptomDate).toDate(),
        moment(q.treatmentStartDate).toDate(),
        q.treatmentEndDate,
        q.attendingPhysician.physicianName,
        q.attendingPhysician.specialty,
        q.attendingPhysician.phoneNumber
      ))));
    } else {
      return [];
    }
  }

  factoryMedicalHistory() {
    if (this.policyApplicationModel.medicalHistory.find(m => m.medicalQuestionId === this.question.medicalQuestionId)) {
      const questionSaved = this.policyApplicationModel.medicalHistory.find(m => m.medicalQuestionId === this.question.medicalQuestionId);
      (this.questionForm.get(this.medicalQuestionaryName) as FormGroup).addControl(this.question.medicalQuestionReference,
        this.fb.group({
          applicationMedicalQuestionGUID: questionSaved.applicationMedicalHistoryGUID,
          medicalQuestionId: this.question.medicalQuestionId,
          medicalQuestionTypeId: this.question.medicalQuestionType.medicalQuestionTypeId,
          medicalQuestionTypeName: this.question.medicalQuestionType.medicalQuestionTypeName,
          answer: [questionSaved.answer.toString(), Validators.required],
          details: this.fb.array(this.factoryMedicalHistoryDetail(questionSaved))
        }));
        this.answer = questionSaved.answer.toString();
    } else {
      this.buildFormQuestionNew();
    }
  }

  factoryMedicalHistoryDetail(questionSaved) {
    switch (this.question.medicalQuestionType.medicalQuestionTypeName) {
      case this.HABITS_QUESTION_TYPE:
        return this.buildDetailHabitsQuestionType(questionSaved);
      case this.MEDICAL_CHECKUP_QUESTION_TYPE:
        return this.buildDetailMedicalCheckUpQuestionType(questionSaved);
      case this.FAMILY_HISTORY_QUESTION_TYPE:
        return this.buildDetailFamilyHistoryQuestionType(questionSaved);
      default:
        return [];
    }
  }

  buildDetailHabitsQuestionType(questionSaved) {
    if (questionSaved.medicalHistoryDetail) {
      return questionSaved.medicalHistoryDetail.map(q =>
        (this.fb.group(new HabitsQuestionDetail (
          questionSaved.applicationMedicalHistoryGUID,
          this.members.find(m => m.applicationMemberGuid === q.applicationMemberGUID).applicationMemberGuid,
          this.members.find(m => m.applicationMemberGuid === q.applicationMemberGUID).fullName,
          q.medicalType,
          q.howLongTime,
        q.quantity,
      ))));
    } else {
      return [];
    }
  }

  buildDetailMedicalCheckUpQuestionType(questionSaved) {
    if (questionSaved.medicalHistoryDetail) {
      return questionSaved.medicalHistoryDetail.map(q => (
        this.fb.group(new MedicalCheckUpQuestionDetail(
        q.applicationMedicalHistoryGUID,
        this.members.find(m => m.applicationMemberGuid === q.applicationMemberGUID).applicationMemberGuid,
        this.members.find(m => m.applicationMemberGuid === q.applicationMemberGUID).fullName,
        q.medicalCheckUpType,
        moment(q.medicalHistoryDate).toDate(),
        q.medicalResult,
        q.medicalAbnormalDetailResult
      ))));
    } else {
      return [];
    }
  }

  /**
   * Builds detail family history question type with FamilyDisorder array
   * @param questionSaved
   * @returns
   */
  buildDetailFamilyHistoryQuestionType(questionSaved) {
    const ext: FormGroup = questionSaved.medicalHistoryDetail.map(q => (
      this.fb.group(new FamilyHistoryQuestionDetail(
        q.applicationMedicalHistoryGUID,
        this.members.find(m => m.applicationMemberGuid === q.applicationMemberGUID).applicationMemberGuid,
        this.members.find(m => m.applicationMemberGuid === q.applicationMemberGUID).fullName,
        null,
        q.medicalDisorder
    ))));

    questionSaved.medicalHistoryDetail.forEach((element, index) => {
      const familyDisorder: Array<FamilyDisorder> = this.getFamilyWithDisorders(element);
      ext[index].get('familyMembersWithDisorder').patchValue(familyDisorder);
    });

    return ext;
  }

  buildFormQuestionNew() {
    (this.questionForm.get(this.medicalQuestionaryName) as FormGroup).addControl(this.question.medicalQuestionReference,
      this.fb.group({
        applicationMedicalQuestionGUID: this.STRING_EMPTY,
        medicalQuestionId: this.question.medicalQuestionId,
        medicalQuestionTypeId: this.question.medicalQuestionType.medicalQuestionTypeId,
        medicalQuestionTypeName: this.question.medicalQuestionType.medicalQuestionTypeName,
        answer: ['', Validators.required],
        details: this.fb.array([]),
      }));
  }

  /**
   * Deletes question component
   */
  delete() {
    this.deleteQuestionDetail.emit(this.index);
  }
  /**
   * Gets form group details
   * @param control
   * @returns form group details
   */
  getFormGroupDetails(control: string): FormGroup {
    return this.questionForm.get(this.medicalQuestionaryName).get(control) as FormGroup;
  }
  /**
   * Gets control
   * @param control
   * @returns control
   */
  getControl(control: string): FormControl {
    return (this.questionForm.get(this.medicalQuestionaryName) as FormGroup).get(control).get('answer') as FormControl;
  }

  /**
   * Tracks by fn
   * @param index
   * @param item
   * @returns index
   */
  trackByFn(index: number | any, item: any) {
    return index; // or item.id
  }

  /**
   * Handles answer
   * @param answer
   */
  handleAnswer(answer: string) {
    this.answer = answer;
    if (this.answer === 'true') {
      this.addDetail(this.question.medicalQuestionReference, this.question.medicalQuestionType.medicalQuestionTypeName);
      this.isFirstDetail = true;
    } else {
      this.clearDetails(this.question.medicalQuestionReference);
      this.isFirstDetail = false;
    }
  }
  /**
   * Clears details
   * @param control
   */
  clearDetails(control: string) {
    while ((this.questionForm.get(this.medicalQuestionaryName).get(control.toString()).get('details') as FormArray).length) {
      (this.questionForm.get(this.medicalQuestionaryName).get(control.toString()).get('details') as FormArray).removeAt(0);
   }
  }
  /**
   * Determines whether answer yes is
   * @returns true if selected yes
   */
  isAnswerYes() {
    if (this.answer === 'true') {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Adds detail
   * @param questId
   * @param type
   */
  addDetail(questId: string, type: string) {
    if (type !== this.SIMPLE_QUESTION_TYPE) {
      this.getDetails(questId).push(this.fb.group(this.getDetailsByType(type)));
      const lastIndex: number = this.getDetails(questId).controls.length - 1;
      this.setValidators(questId, type, lastIndex);
    }
  }

  getFamilyWithDisorders(detailMedicalHistory): Array<FamilyDisorder> {
    return detailMedicalHistory.medicalFamilyDisorder as FamilyDisorder[];
  }
      /**
   * Gets details
   * @param control
   * @returns details
   */
  getDetails(control: string): FormArray {
    return this.questionForm.get(this.medicalQuestionaryName).get(control.toString()).get('details') as FormArray;
  }

  /**
   * Gets details by type
   * @param type
   * @returns details by type
   */
  getDetailsByType(type: string): QuestionDetailModelBase | MedicalHistoryDetailModelBase {
    switch (type) {
      case this.WOMEN_QUESTION_TYPE:
          return new WomenQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY,
            this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
            null, this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY);
      case this.MEDICAL_CHECKUP_QUESTION_TYPE:
        return new MedicalCheckUpQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
           this.STRING_EMPTY, null, this.STRING_EMPTY, this.STRING_EMPTY);
      case this.HABITS_QUESTION_TYPE:
        return new HabitsQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
          this.STRING_EMPTY, this.STRING_EMPTY);
      case this.FAMILY_HISTORY_QUESTION_TYPE:
        return new FamilyHistoryQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
           null, this.STRING_EMPTY);
      case this.GENERAL_QUESTION_TYPE:
        return new GeneralQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
           this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
          null, null, null, this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY);
      default:
        return;
    }
  }

  /**
   * Sets validators
   * @param questId
   * @param type
   * @param lastIndex
   */
  setValidators(questId: string, type: string, lastIndex: number, detail?: MedicalQuestionExtension) {
    // common
    this.getDetails(questId).controls[lastIndex].get('member').setValidators([Validators.required]);
    switch (type) {
      case this.MEDICAL_CHECKUP_QUESTION_TYPE:
        this.getDetails(questId).controls[lastIndex].get('examinationType').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('examinationType').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('date').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('date').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('healthResult').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('healthResult').updateValueAndValidity();
        break;
      case this.HABITS_QUESTION_TYPE:
        this.getDetails(questId).controls[lastIndex].get('type').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('type').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('forHowLong').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('forHowLong').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('quantityDay').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('quantityDay').updateValueAndValidity();
        break;
      case this.FAMILY_HISTORY_QUESTION_TYPE:
        this.getDetails(questId).controls[lastIndex].get('familyMembersWithDisorder').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('familyMembersWithDisorder').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('disorder').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('disorder').updateValueAndValidity();
        break;
      case this.GENERAL_QUESTION_TYPE:
        this.getDetails(questId).controls[lastIndex].get('diseaseMedicalProblem').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('treatment').setValidators([Validators.required]);

        if (detail) {
          if (!detail.firstSymptomDate) {
            this.getDetails(questId).controls[lastIndex].get('dateOfFirstSymptom').setValue(undefined);
          }

          if (!detail.treatmentStartDate) {
            this.getDetails(questId).controls[lastIndex].get('treatmentStartDate').setValue(undefined);
          }
        } else {
          this.getDetails(questId).controls[lastIndex].get('dateOfFirstSymptom').setValue(undefined);
          this.getDetails(questId).controls[lastIndex].get('treatmentStartDate').setValue(undefined);
        }

        this.getDetails(questId).controls[lastIndex].get('dateOfFirstSymptom').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('treatmentStartDate').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('treatmentEndDate').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('nameOfDoctor').setValidators([Validators.required]);
        this.getDetails(questId).controls[lastIndex].get('specialtyOfDoctor').setValidators([Validators.required]);
        // this.getDetails(questId).controls[lastIndex].get('phoneNumber').setValidators([Validators.required]);

        this.getDetails(questId).controls[lastIndex].get('treatment').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('dateOfFirstSymptom').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('treatmentStartDate').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('diseaseMedicalProblem').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('treatmentEndDate').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('nameOfDoctor').updateValueAndValidity();
        this.getDetails(questId).controls[lastIndex].get('specialtyOfDoctor').updateValueAndValidity();
        // this.getDetails(questId).controls[lastIndex].get('phoneNumber').updateValueAndValidity();
        break;
      default:
        break;
    }
    this.getDetails(questId).controls[lastIndex].get('member').updateValueAndValidity();
  }
}
