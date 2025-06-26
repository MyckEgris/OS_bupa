import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MedicalQuestionByLanguages } from 'src/app/shared/services/medical-questionaries/entities/medical-question-by-languages.model';
import { MedicalMember } from '../../models/medical-members.model';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { Utilities } from 'src/app/shared/util/utilities';
import { HabitsQuestionDetail } from '../../models/medical-history-details/habits-details.model';

@Component({
  selector: 'app-habits-details',
  templateUrl: './habits-details.component.html'
})
export class HabitsDetailsComponent implements OnInit {

  private TIME_TO_DELAY = 10;
  isExpanded: boolean;
  resultTypeSelected: number;
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

  delete() {
    this.deleteQuestionDetail.emit(this.index);
  }

  getDetails(): FormArray {
    return this.questionForm.get('details') as FormArray;
  }

  hangleChangedMember(member: MedicalMember, i: string) {
    this.getDetails().controls[i].get('memberFullName').value = member.fullName;
  }

  deleteDetail(index: number) {
    this.getDetails().removeAt(index);
  }

  async addDetail() {
    this.getDetails().push(this.fb.group(new HabitsQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
      this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY)));
    this.getDetails().controls[this.getDetails().controls.length - 1].get('member').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('member').updateValueAndValidity();
    this.getDetails().controls[this.getDetails().controls.length - 1].get('type').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('type').updateValueAndValidity();
    this.getDetails().controls[this.getDetails().controls.length - 1].get('forHowLong').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('forHowLong').updateValueAndValidity();
    this.getDetails().controls[this.getDetails().controls.length - 1].get('quantityDay').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('quantityDay').updateValueAndValidity();
    await this.setValuesAfterAddDetail();
   }

  async setValuesAfterAddDetail() {
    await Utilities.delay(this.TIME_TO_DELAY);
    if (!this.isExpanded) {
      this.isExpanded = true;
    }
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
