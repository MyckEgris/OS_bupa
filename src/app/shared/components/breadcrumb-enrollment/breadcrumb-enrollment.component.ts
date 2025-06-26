import { Component, OnInit, Input } from '@angular/core';
import { Utilities } from '../../util/utilities';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { InsuranceBusiness } from '../../classes/insuranceBusiness.enum';

@Component({
  selector: 'app-breadcrumb-enrollment',
  templateUrl: './breadcrumb-enrollment.component.html'
})
export class BreadcrumbEnrollmentComponent implements OnInit {

  @Input('currentStep') currentStep: number;

  @Input('lengthSection') lengthSection: number;

  @Input('stepActive') stepActive: number;
  /**
   * Get enrollmentForm to control the flow of step 4
   * If all answer is equal to No, then show in subtep 4.5 the breadcrumb 4.1 / 4.2
   * If any answer is equal to Yes, then show in subtep 4.5 the breadcrumb 4.1 / 4.2 / 4.3 / 4.4 / 4.5
   */
  wizard: PolicyEnrollmentWizard;

  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService) { }

  ngOnInit() {
    this.wizard = this.policyEnrollmentWizardService.getPolicyEnrollment();
  }

  array(n: number): any[] {
    return Array(n);
  }

  showFlowStep4Section5() {
    if (this.currentStep === 4 && this.stepActive === 5) {
      return true;
    } else {
      return false;
    }
  }

  getNumberStep4Section5(): number {
    if (this.currentStep === 4 && this.stepActive === 5) {
      if (this.anyQuestionAnsweredYes()) {
        if (+this.wizard.user.bupa_insurance === InsuranceBusiness.BUPA_PANAMA) {
          return 4;
        } else {
          return 5;
        }
      } else {
        return 2;
      }
    }
  }

  anyQuestionAnsweredYes() {
    const enrollmentForm: FormGroup =  this.wizard.enrollmentForm.get('preselectionQuestions') as FormGroup;
    const controlsKeys = Object.keys((this.wizard.enrollmentForm.get('preselectionQuestions') as FormGroup).controls);
    for (let index = 0; index < controlsKeys.length; index++) {
      if (enrollmentForm.get(controlsKeys[index]).get('answer').value === 'true') {
        return true;
      } else {
        continue;
      }
    }
    return false;
  }

  showFlowStep4OtherSections() {
    if ((this.currentStep === 4 && this.stepActive === 1)
      || (this.currentStep === 4 && this.stepActive === 2)
      || (this.currentStep === 4 && this.stepActive === 3)
      || (this.currentStep === 4 && this.stepActive === 4)) {
      return true;
    } else {
      return false;
    }
  }
}
