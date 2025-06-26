import { Injectable } from '@angular/core';
import { PolicyEnrollmentWizard } from '../entities/policy-enrollment-wizard';
import { Agreement } from 'src/app/shared/services/policy-application/entities/agreement';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { PersonalInterview } from 'src/app/shared/services/policy-application/entities/personal-interview';
@Injectable({
  providedIn: 'root'
})
export class TransformConsentsService {

  private policyEnrollment: PolicyEnrollmentWizard;

  constructor(private commonService: CommonService) { }

  public async transformDataFormToModel(policyEnrollment: PolicyEnrollmentWizard) {
    this.policyEnrollment = policyEnrollment;
    this.fillSection4(4);
  }

  private fillSection4(sectionId: number) {
    this.policyEnrollment.policyApplicationModel.promoterEmail = this.getValuesFromEnrollmentForm(this.getConfigStep(8).type,
      this.getConfigStep(8).sections.find(s => s.id === sectionId).name, 'emailConsents');
    this.policyEnrollment.policyApplicationModel.promoterKey = this.getValuesFromEnrollmentForm(this.getConfigStep(8).type,
      this.getConfigStep(8).sections.find(s => s.id === sectionId).name, 'promoterKey');
    this.createPersonalInterview(sectionId);
  }

  private createPersonalInterview(sectionId: number) {
    const personalInterview: PersonalInterview = {
      interviewTypeId: this.getValuesFromEnrollmentForm(this.getConfigStep(8).type,
        this.getConfigStep(8).sections.find(s => s.id === sectionId).name, 'interviewTypeId'),
      previousVisitDate: this.getValuesFromEnrollmentForm(this.getConfigStep(8).type,
        this.getConfigStep(8).sections.find(s => s.id === sectionId).name, 'previousVisitDate'),
      currentVisitDate: this.getValuesFromEnrollmentForm(this.getConfigStep(8).type,
        this.getConfigStep(8).sections.find(s => s.id === sectionId).name, 'currentVisitDate'),
      firstName: this.getValuesFromEnrollmentForm(this.getConfigStep(8).type,
        this.getConfigStep(8).sections.find(s => s.id === sectionId).name, 'firstName'),
      middleName: this.getValuesFromEnrollmentForm(this.getConfigStep(8).type,
        this.getConfigStep(8).sections.find(s => s.id === sectionId).name, 'middleName'),
      paternalLastName: this.getValuesFromEnrollmentForm(this.getConfigStep(8).type,
        this.getConfigStep(8).sections.find(s => s.id === sectionId).name, 'paternalLastName'),
      maternalLastName: this.getValuesFromEnrollmentForm(this.getConfigStep(8).type,
        this.getConfigStep(8).sections.find(s => s.id === sectionId).name, 'maternalLastName')
    };
    this.policyEnrollment.policyApplicationModel.personalInterview = personalInterview;
  }

  private getConfigStep(step: number): ViewTemplateStep {
    if (this.policyEnrollment.viewTemplate) {
      return this.policyEnrollment.viewTemplate.steps.find(s => s.stepNumber === step);
    } else {
      return null;
    }
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

  async createNewAgreement(answer: boolean, agreementId: number, applicationGuid: string) {
    const agreement: Agreement = {
      applicationAgreementGuid: await this.commonService.newGuidNuevo().toPromise(),
      applicationGuid: applicationGuid,
      agreementId: agreementId,
      answer: answer
    };
    return agreement;
  }
}
