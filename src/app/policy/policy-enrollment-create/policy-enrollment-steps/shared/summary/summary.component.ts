import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Component, OnInit } from '@angular/core';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnInit {
  policyEnrollment: PolicyEnrollmentWizard;
  user: UserInformationModel;
  currentDate = new Date();
  constructor(private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.policyEnrollment =  this.policyEnrollmentWizardService.getPolicyEnrollment();
  }

  get getRouterLink(): string {
    return '/policies/policy-application-menu';
  }

  get fullNameOwner(): string {
    const owner = this.policyEnrollment.policyApplicationModel.members.find(m => m.relationTypeId === RelationType.OWNER);
    return `${owner.firstName} ${owner.lastName}`;
  }

  get getEstimatedRevisionTime(): string {
    return (this.policyEnrollment.policyApplicationModel.status === 'Clean') ? '24Hrs' : '48Hrs';
  }
}
