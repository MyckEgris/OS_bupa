import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { OtherInsurance } from 'src/app/shared/services/policy-application/entities/other-insurance';
import { Injectable } from '@angular/core';
import { PolicyEnrollmentWizard } from '../entities/policy-enrollment-wizard';
@Injectable({
  providedIn: 'root'
})
export class PolicyEnrollmentTransformOtherInsuranceService {
  private policyEnrollment: PolicyEnrollmentWizard;
  constructor() { }

  public transformDataFormToModel(policyEnrollment: PolicyEnrollmentWizard) {
    this.policyEnrollment = policyEnrollment;
    if (!this.policyEnrollment.policyApplicationModel.otherInsurance) {
      this.policyEnrollment.policyApplicationModel.otherInsurance = {} as OtherInsurance;
      this.policyEnrollment.policyApplicationModel.otherInsurance.applicationGuid =
        this.policyEnrollment.policyApplicationGuid;
      this.policyEnrollment.policyApplicationModel.otherInsurance.applicationOtherInsuranceGuid =
        this.policyEnrollment.otherInsuranceGuid;
    }
    this.policyEnrollment.policyApplicationModel.otherInsurance.companyName =
      this.getValuesFromEnrollmentForm(this.getConfigStep(7).type,
        this.getConfigStep(7).sections.find(s => s.id === 1).name, 'companyName');
    this.policyEnrollment.policyApplicationModel.otherInsurance.policyNumber =
      this.getValuesFromEnrollmentForm(this.getConfigStep(7).type,
        this.getConfigStep(7).sections.find(s => s.id === 1).name, 'policyNumber');
    this.policyEnrollment.policyApplicationModel.otherInsurance.renewalDate =
      this.getValuesFromEnrollmentForm(this.getConfigStep(7).type,
        this.getConfigStep(7).sections.find(s => s.id === 1).name, 'renewalDate');
    this.policyEnrollment.policyApplicationModel.otherInsurance.deductibles =
      this.getValuesFromEnrollmentForm(this.getConfigStep(7).type,
        this.getConfigStep(7).sections.find(s => s.id === 1).name, 'deductibleValue');
  }

  private getValuesFromEnrollmentForm(stepName: string, sectionName: string, controlName: string) {
    if (this.policyEnrollment.enrollmentForm) {
      const step = this.policyEnrollment.enrollmentForm.get(stepName);
      if (step) {
        const section = step.get(sectionName);
        if (section) {
          const control = section.get(controlName);
          if (control) {
            return control.value;
          }
        }
      }
    }
    return null;
  }

  private getConfigStep(step: number): ViewTemplateStep {
    if (this.policyEnrollment.viewTemplate) {
      return this.policyEnrollment.viewTemplate.steps.find(s => s.stepNumber === step);
    } else {
      return null;
    }
  }
}
