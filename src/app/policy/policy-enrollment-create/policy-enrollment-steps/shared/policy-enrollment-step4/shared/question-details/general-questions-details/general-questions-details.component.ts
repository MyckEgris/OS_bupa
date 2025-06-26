import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { GeneralQuestionDetail } from '../../models/general-question-details.model';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { MedicalMember } from '../../models/medical-members.model';
import { Utilities } from 'src/app/shared/util/utilities';
import {ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-general-questions-details',
  templateUrl: './general-questions-details.component.html'
})
export class GeneralQuestionsDetailsComponent implements OnInit, AfterContentChecked {


  STRING_EMPTY = '';
  private TIME_TO_DELAY = 10;
  appMedicalQuestionGUID: string;
  icon_keyboard_arrow_collapse = '';
  maxDateFirstSymptom: Date = new Date();
  minDateTreatmentStartDate: Date = new Date();
  minDateTreatmentEndDate: Date = new Date();
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
  lastIndex: number;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private cdref: ChangeDetectorRef) { }

  async ngOnInit() {
    // this.setValueChanges();
    this.setIsExpanded();
  }

  setValueChanges() {
    this.getDetails().controls.forEach((cont, index) => {
      (cont as FormGroup).controls.treatmentStartDate.valueChanges.subscribe(val => {
        this.setDateTreatmentStartDate(val, index.toString());
      });
    });
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  setIsExpanded() {
    if (this.answer === 'true' && this.isFirstDetail) {
      this.isExpanded = true;
    } else if (this.answer === 'true' && !this.isFirstDetail) {
      this.isExpanded = false;
    }
  }

  setDateTreatmentStartDate(date: Date, index: string) {
    const errorsStartDate = (this.getDetails().controls[index] as FormGroup).controls.treatmentStartDate.errors;
    if (errorsStartDate === null) {
      (this.getDetails().controls[index] as FormGroup).controls.treatmentEndDate.setValue(null);
    }
  }


  hasAppMedicalQuestionGUID() {
    if (!this.appMedicalQuestionGUID) {
      return false;
    } else {
      return true;
    }
  }


  delete() {
    this.deleteQuestionDetail.emit(this.index);
  }

  getDetails(): FormArray {
    return this.questionForm.get('details') as FormArray;
  }

  addDetail() {
    this.getDetails().push(this.fb.group(new GeneralQuestionDetail(this.STRING_EMPTY, this.STRING_EMPTY,
      this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY,
       null, null, null, this.STRING_EMPTY, this.STRING_EMPTY, this.STRING_EMPTY)));
    this.lastIndex = this.getDetails().controls.length - 1;
    this.getDetails().controls[this.lastIndex].get('member').setValidators([Validators.required]);
    this.getDetails().controls[this.lastIndex].get('member').updateValueAndValidity();
    this.getDetails().controls[this.lastIndex].get('diseaseMedicalProblem').setValidators([Validators.required]);
    this.getDetails().controls[this.lastIndex].get('treatment').setValidators([Validators.required]);
    this.getDetails().controls[this.lastIndex].get('dateOfFirstSymptom').setValidators([Validators.required]);
    this.getDetails().controls[this.lastIndex].get('treatmentStartDate').setValidators([Validators.required]);
    this.getDetails().controls[this.lastIndex].get('treatmentEndDate').setValidators([Validators.required]);
    this.getDetails().controls[this.lastIndex].get('nameOfDoctor').setValidators([Validators.required]);
    this.getDetails().controls[this.lastIndex].get('specialtyOfDoctor').setValidators([Validators.required]);
    // this.getDetails().controls[this.lastIndex].get('phoneNumber').setValidators([Validators.required]);

    this.getDetails().controls[this.lastIndex].get('diseaseMedicalProblem').updateValueAndValidity();
    this.getDetails().controls[this.lastIndex].get('treatment').updateValueAndValidity();
    this.getDetails().controls[this.lastIndex].get('dateOfFirstSymptom').updateValueAndValidity();
    this.getDetails().controls[this.lastIndex].get('treatmentStartDate').updateValueAndValidity();
    this.getDetails().controls[this.lastIndex].get('treatmentEndDate').updateValueAndValidity();
    this.getDetails().controls[this.lastIndex].get('nameOfDoctor').updateValueAndValidity();
    this.getDetails().controls[this.lastIndex].get('specialtyOfDoctor').updateValueAndValidity();
    // this.getDetails().controls[this.lastIndex].get('phoneNumber').updateValueAndValidity();

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
