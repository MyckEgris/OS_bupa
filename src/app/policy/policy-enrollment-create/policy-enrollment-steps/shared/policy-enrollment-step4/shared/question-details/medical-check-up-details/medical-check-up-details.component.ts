import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MedicalQuestionByLanguages } from 'src/app/shared/services/medical-questionaries/entities/medical-question-by-languages.model';
import { MedicalMember } from '../../models/medical-members.model';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { Utilities } from 'src/app/shared/util/utilities';
import { MedicalCheckUpQuestionDetail } from '../../models/medical-history-details/medical-check-up-details.model';
import * as moment from 'moment';
import { ResultType } from '../../models/result-type.model';
@Component({
  selector: 'app-medical-check-up-details',
  templateUrl: './medical-check-up-details.component.html'
})
export class MedicalCheckUpDetailsComponent implements OnInit {

  resultsType: ResultType[] = [ new ResultType(1, 'Normal'), new ResultType(2, 'Anormal')];
  private TIME_TO_DELAY = 10;
  isExpanded: boolean;
  resultTypeSelected: number;
  indexSelected: number;
  STRING_EMPTY = '';
  @Input() showValidation = false;
  @Input() questionForm: FormGroup;
  @Input() question: MedicalQuestions;
  @Input() index: number;
  @Input() section: string;
  @Input() members: Array<MedicalMember>;
  @Input() answer: string;
  @Input() isFirstDetail: boolean;
  @Input() hasDetails: boolean;
  @Output() deleteQuestionDetail: EventEmitter<number> = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.setIsExpanded();
  }

  setIsExpanded() {
    if (this.answer === 'true' && this.isFirstDetail) {
      this.isExpanded = true;
    } else if (this.answer === 'true' && !this.isFirstDetail) {
      this.isExpanded = false;
    }
  }

  setMaxDateDefault() {
    return moment(new Date()).toDate();
  }

  delete() {
    this.deleteQuestionDetail.emit(this.index);
  }

  getDetails(): FormArray {
    return this.questionForm.get('details') as FormArray;
  }

  hangleChangedMember(member: MedicalMember, i: string) {
    this.getDetails().controls[i].get('memberFullName').value = member.fullName;
  }

  hangleChangedResultType(resultType: any, i: string) {
    this.resultTypeSelected = resultType.id;
  }

  deleteDetail(index: number) {
    this.getDetails().removeAt(index);
  }

  async addDetail() {
    this.getDetails().push(this.fb.group(new MedicalCheckUpQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
      this.STRING_EMPTY, null, this.STRING_EMPTY, this.STRING_EMPTY)));
    this.getDetails().controls[this.getDetails().controls.length - 1].get('member').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('member').updateValueAndValidity();
    this.getDetails().controls[this.getDetails().controls.length - 1].get('examinationType').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('examinationType').updateValueAndValidity();
    this.getDetails().controls[this.getDetails().controls.length - 1].get('date').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('date').updateValueAndValidity();
    this.getDetails().controls[this.getDetails().controls.length - 1].get('healthResult').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('healthResult').updateValueAndValidity();
    await this.setValuesAfterAddDetail();
   }

  async setValuesAfterAddDetail() {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.isExpanded = true;
    this.isFirstDetail = false;
  }

  async changeValueIsExpanded() {
    await Utilities.delay(this.TIME_TO_DELAY);
    if (this.isExpanded) {
      this.isExpanded = false;
    } else {
      this.isExpanded = true;
    }
  }

  ifGreaterThanCero(i: number): boolean {
    if (i > 0) {
      return true;
    } else {
      return false;
    }
  }
}
