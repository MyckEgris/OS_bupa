/**
* questions.component.ts
*
* @description: This class handle step  policy aplication wizard.
* @author Enrique Durango.
* @version 1.0
* @date 06-12-2019.
*
**/
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { MedicalQuestionTypeEnum } from 'src/app/shared/services/medical-questionaries/entities/medical-question-type.enum';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { MedicalMember } from 'src/app/policy/policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/shared/models/medical-members.model';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html'
})
export class QuestionsComponent implements OnInit {

  /**
   * Input  of questions component
   */
  @Input() medicalQuestionaryName: string;
  /**
   * Input  of questions component
   */
  @Input() questionForm: FormGroup;
  /**
   * Input  of questions component
   */
  @Input() questions$: Observable<MedicalQuestions[]>;

  /**
   * Input  of questions component
   */
  @Input() showValidation: boolean;
  /**
   * Input  of questions component
   */
  @Input() members: Array<MedicalMember>;
  /**
   * Input  of questions component
   */
  @Input() currentSection: number;
  /**
   * String empty of questions component
   */
  public STRING_EMPTY: '';

  public policyApplicationModel: PolicyApplicationModel;
  public isEdit: boolean;
  public questions: Array<MedicalQuestions>;
  questionSaved: any;
  /**
   * Creates an instance of questions component.
   * @param fb
   */
  constructor(private fb: FormBuilder,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService) { }
  /**
   * on init
   */
  async ngOnInit() {
    this.questionForm.addControl(this.medicalQuestionaryName, this.fb.group({}));
    this.policyApplicationModel = this.policyEnrollmentWizardService.getPolicyEnrollment().policyApplicationModel;
    this.questions = await this.questions$.toPromise();
  }
  /**
   * Tracks by fn
   * @param index
   * @param item
   * @returns index
   */
  trackByFn(index, item) {
    return index; // or item.id
  }
}
