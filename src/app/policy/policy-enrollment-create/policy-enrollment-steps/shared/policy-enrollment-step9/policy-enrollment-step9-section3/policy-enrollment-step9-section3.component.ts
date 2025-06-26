import { RELATIONSHIP_TYPES } from './../entities/relationship-type-list';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { FormGroup, FormControl } from '@angular/forms';
import { RelationshipType } from '../entities/relationship-type';

@Component({
  selector: 'app-policy-enrollment-step9-section3',
  templateUrl: './policy-enrollment-step9-section3.component.html',
  styles: []
})
export class PolicyEnrollmentStep9Section3Component implements OnInit {

  /**
 * PolicyEnrollment Wizard Step Configuration
 */
  private configStep: ViewTemplateStep;

  /**
 * PolicyEnrollment Wizard Filtered Current Section
 */
  public currentSection: Section;

  /**
   * PolicyEnrollment Wizard Object
   */
  wizard: PolicyEnrollmentWizard;

  /**
    * Const to Identify the current section name
    */
   SECTION_NAME = 'policyAppPaymentsCreditCard2';

   /**
     *  Const to Identify the current step name
     */
  STEP_NAME = 'policyApplicationPayments';

  /**
   *Const to identify the control disclaimerCheck
   */
  DISCLAIMER_CHECK = 'disclaimerCheck';

  /**
   *Const to identify the control relationship
   */
  RELATIONSHIP = 'relationship';

  // Arrays for options in components select on html
  typeRelationships: RelationshipType[] = [];

  /**
   * Current step number
   * @private
   * @memberof PolicyEnrollmentStep9Section3Component
   */
  private CURRENT_STEP = 9;

  /**
   * Current section number
   * @private
   * @memberof PolicyEnrollmentStep9Section3Component
   */
  private CURRENT_SECTION = 3;

  /**
   * Authenticated User Object
   */
  public user: UserInformationModel;

  /**
   *Creates an instance of PolicyEnrollmentStep9Section3Component.
   * @param {AuthService} authService
   * @param {PolicyEnrollmentWizardService} policyEnrollmentWizardService
   * @memberof PolicyEnrollmentStep9Section3Component
   */
  constructor(private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService) { }


 /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.obtainTypeRelationships();
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.currentSection = this.configStep.sections.find(id => id.id === this.CURRENT_SECTION);
    this.user = this.authService.getUser();
    this.wizard = this.policyEnrollmentWizardService.
                  getPolicyEnrollmentWithSetCurrentStep(null, this.CURRENT_STEP, this.CURRENT_SECTION);
    this.setUpForm();
    if (localStorage.getItem('mode') === 'Edit') {
      if (this.wizard.policyApplicationModel.paymentMethodId === 1) {
        this.getControl('disclaimerCheck').setValue('true');
        this.getControl('relationship').setValue(this.wizard.policyApplicationModel.creditCard.relationTypeId);
      }
    }
  }


  /**
    * Get nested form controls.
    */
   getControl(field: string) {
    return this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name).get(field) as FormControl;
  }

  /**
   *Set the step form Group
   */
  setUpForm() {
    const formBasic: FormGroup = this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup;
    formBasic.addControl(this.configStep.sections.find(i => i.id === 3).name,
      this.policyEnrollmentWizardService.buildSection(9, 3));
      (formBasic.get(this.configStep.sections.find(i => i.id === this.CURRENT_SECTION).name) as FormGroup)
      .setValidators(this.validateDisclaimer);
  }

  // Validate date expirations, Validated only if the month is less when current year is selected
  validateDisclaimer(group: FormGroup) {
    const disclaimer = group.controls['disclaimerCheck'];
    if (disclaimer) {
      if (!disclaimer.value) {
        group.controls['disclaimerCheck'].setErrors({'incorrect': true});
        return { invalidDisclaimer: true };
      }
      group.controls['disclaimerCheck'].setErrors(null);
      return null;
    }
  }

// Get relationships
  obtainTypeRelationships() {
    this.typeRelationships = RELATIONSHIP_TYPES;
  }

  /**
   * Set required validator
   * @param {string} field
   * @returns
   * @memberof PolicyEnrollmentStep9Section3Component
   */
  isFieldRequired(field: string) {
    if (this.wizard.enrollmentForm.get(this.configStep.type)
      .get('policyAppPaymentsCreditCard2')
      .get(field).hasError('required')) {
      return true;
    } else {
      return false;
    }
  }



}
