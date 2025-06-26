import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicalQuestionByLanguages } from 'src/app/shared/services/medical-questionaries/entities/medical-question-by-languages.model';
import { WomenQuestionDetail } from '../../models/women-question-details.model';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { MedicalMember } from '../../models/medical-members.model';
import { Utilities } from 'src/app/shared/util/utilities';

@Component({
  selector: 'app-women-question-details',
  templateUrl: './women-question-details.component.html'
})
export class WomenQuestionDetailsComponent implements OnInit {
  STRING_EMPTY = '';
  private TIME_TO_DELAY = 10;
  appMedicalQuestionGUID: string;
  FIRST_INDEX_DETAIL = '0';
  icon_keyboard_arrow_collapse = '';
  @Input() showValidation = false;
  @Input() questionForm: FormGroup;
  @Input() question: MedicalQuestions;
  @Input() index: number;
  @Input() section: string;
  @Input() members: Array<MedicalMember>;
  @Input() answer: string;
  @Input() isFirstDetail: boolean;
  @Output() deleteQuestionDetail: EventEmitter<number> = new EventEmitter();
  isExpanded: boolean;

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

  addDetail() {
    this.getDetails().push(this.fb.group(new WomenQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
      this.STRING_EMPTY, this.STRING_EMPTY, null, this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY)));
    this.getDetails().controls[this.getDetails().controls.length - 1].get('member').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('member').updateValueAndValidity();
    this.isExpanded = true;
    this.isFirstDetail = false;
   }

  deleteDetail(index: number) {
    this.getDetails().removeAt(index);
  }

  hangleChangedMember(member: MedicalMember, i: string) {
    this.getDetails().controls[i].get('memberFullName').value = member.fullName;
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
