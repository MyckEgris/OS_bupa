import { Component, OnInit, EventEmitter, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { MedicalMember } from '../../models/medical-members.model';
import { Utilities } from 'src/app/shared/util/utilities';
import { FamilyHistoryQuestionDetail } from '../../models/medical-history-details/family-history-details.model';
import { FamilyDisorder } from 'src/app/shared/services/medical-questionaries/entities/family-disorder.model';

@Component({
  selector: 'app-family-history-details',
  templateUrl: './family-history-details.component.html'
})
export class FamilyHistoryDetailsComponent implements OnInit {

  medicalFamilyDisorder: FamilyDisorder[] = [
    new FamilyDisorder(1, 'Padre'),
    new FamilyDisorder( 2, 'Madre'),
    new FamilyDisorder(3, 'Hermano'),
    new FamilyDisorder(4, 'Hijo')
  ];

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
    this.getDetails().push(this.fb.group(new FamilyHistoryQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
       null, this.STRING_EMPTY)));
    this.getDetails().controls[this.getDetails().controls.length - 1].get('member').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('member').updateValueAndValidity();
    this.getDetails().controls[this.getDetails().controls.length - 1].get('familyMembersWithDisorder').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('familyMembersWithDisorder').updateValueAndValidity();
    this.getDetails().controls[this.getDetails().controls.length - 1].get('disorder').setValidators([Validators.required]);
    this.getDetails().controls[this.getDetails().controls.length - 1].get('disorder').updateValueAndValidity();
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
