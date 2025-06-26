import { Injectable } from '@angular/core';
import { PolicyEnrollmentWizard } from '../entities/policy-enrollment-wizard';
import { Agreement } from 'src/app/shared/services/policy-application/entities/agreement';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { FormControl } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class PolicyEnrollmentTransformConsentsService {

    /***
   * Const to Identify the nested FormControl policyApplicationConsents
   */
  private STEP8_NAME = 'policyApplicationConsents';

  /***
  * Const to Identify the nested FormControl policyAppConsentsQuestions4
  */
  private ST08_SECT04 = 'policyAppConsentsQuestions4';

    /***
   * Const to Identify the nested FormControl emailConsents
   */
  public FOURTH_PROMOTER_EMAIL = 'emailConsents';

  /***
   * Const to Identify the nested FormControl emailConsents
   */
  public FOURTH_PROMOTER_KEY = 'promoterKey';

  private policyEnrollment: PolicyEnrollmentWizard;
  constructor() { }

  public transformDataFormToModel(policyEnrollment: PolicyEnrollmentWizard) {
    this.policyEnrollment = policyEnrollment;
    const modelAgreements: Agreement[] = [];

  //#region Agreements and Questions

  let i = 0;
  for (let index = 0; index < this.getConfigStep(8).sections.length; index++) {
    const sectionName = this.getConfigStep(8).sections[index].name;
    for (let c = 0; c < this.getConfigStep(8).sections[index].controls.length; c++) {
      i++;
      const controlName = this.getConfigStep(8).sections[index].controls[c].key;
      const valueResponse = this.getControl(this.STEP8_NAME, sectionName, controlName).value;
      if (controlName !== 'emailConsents' && controlName !== 'promoterKey') {
        if (valueResponse === 'true' || valueResponse === 'false') {
          const agree: Agreement = {
            applicationAgreementGuid: this.getNewGuid(),
            applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
            agreementId: i,
            answer: this.getBoolFromString(valueResponse)
          };
          modelAgreements.push(agree);
        } else {
          const agree: Agreement = {
            applicationAgreementGuid: this.getNewGuid(),
            applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
            agreementId: i,
            answer: valueResponse
          };
          modelAgreements.push(agree);
        }
      }
    }
  }
  this.policyEnrollment.policyApplicationModel.agreements = modelAgreements;
  const FOURTH_PROMOTER_EMAIL = this.getControl(this.STEP8_NAME, this.ST08_SECT04, this.FOURTH_PROMOTER_EMAIL).value;
  if (FOURTH_PROMOTER_EMAIL) {
    this.policyEnrollment.policyApplicationModel.promoterEmail = FOURTH_PROMOTER_EMAIL;
  }

  const FOURTH_PROMOTER_KEY = this.getControl(this.STEP8_NAME, this.ST08_SECT04, this.FOURTH_PROMOTER_KEY).value;
  if (FOURTH_PROMOTER_KEY) {
    this.policyEnrollment.policyApplicationModel.promoterKey = FOURTH_PROMOTER_KEY;
  }
  //#endregion
  }

  /**
   * Gets config step
   * @param step
   * @returns config step
   */
  private getConfigStep(step: number): ViewTemplateStep {
    if (this.policyEnrollment.viewTemplate) {
      return this.policyEnrollment.viewTemplate.steps.find(s => s.stepNumber === step);
    } else {
      return null;
    }
  }

    /**
   * Get nested form controls.
   */
  private getControl(step: string, section: string, field: string): FormControl {
    return this.policyEnrollment.enrollmentForm.get(step).get(section).get(field) as FormControl;
  }

  private getNewGuid(): string {
    if (this.policyEnrollment.applicationGuids.length > 0) {
      const guidToReturn = this.policyEnrollment.applicationGuids[this.policyEnrollment.applicationGuids.length - 1];
      this.policyEnrollment.applicationGuids.splice(this.policyEnrollment.applicationGuids.indexOf(guidToReturn), 1);
      return guidToReturn;
    }
    return '';
  }

  /**
   * Gets bool from string
   * @param value
   * @returns true or false from string
   */
  private getBoolFromString(value: any) {
    return value === 'true' ? true : false;
  }
}
