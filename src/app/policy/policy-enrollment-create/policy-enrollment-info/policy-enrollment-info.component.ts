import { Component, OnInit } from '@angular/core';
import { PolicyEnrollmentWizard } from '../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { TranslateService } from '@ngx-translate/core';
import { PolicyEnrollmentWizardService } from '../policy-enrollment-wizard/policy-enrollment-wizard.service';

@Component({
  selector: 'app-policy-enrollment-info',
  templateUrl: './policy-enrollment-info.component.html'
})
export class PolicyEnrollmentInfoComponent implements OnInit {

  /**
   * PolicyEnrollment Wizard Object
   */
  public wizard: PolicyEnrollmentWizard;

  constructor(
    private translate: TranslateService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService
  ) { }

  ngOnInit() {
    this.wizard = this.policyEnrollmentWizardService.getPolicyEnrollment();
  }

  /**
  * Handle the policy application information view.
  */
  handleInfoView(option: any) {
    if (this.wizard && this.wizard.policyApplicationModel) {
      if (+option === 1) {
        if (this.wizard.policyApplicationModel.applicationId) {
          return this.wizard.policyApplicationModel.applicationId;
        } else {
          return null;
        }
      } else {
        const owner = this.wizard.policyApplicationModel.members.find(element => +element.relationTypeId === 2);
        if (owner) {
          return `${owner.firstName} ${owner.middleName} ${owner.paternalLastName} ${owner.maternalLastName}`;
        }
      }
    }
  }

}
