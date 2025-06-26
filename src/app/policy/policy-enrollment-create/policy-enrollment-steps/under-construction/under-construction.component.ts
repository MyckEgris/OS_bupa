import { Component, OnInit } from '@angular/core';
import { PolicyEnrollmentWizardService } from '../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizard } from '../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PetitionerConctactType } from 'src/app/shared/classes/petitioner-contact-type.enum';
@Component({
  selector: 'app-under-construction',
  template: `
  <div class="col-md-12">
    <h1>En construcción...</h1>
  </div>
  <div class="col-md-12">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <div class="row align-items-center">
          <div class="col-md-6">
            <button class="bp-btn bp-btnsecondary" type="button" (click)="back()">
              {{ 'POLICY.POLICY_ENROLLMENT.BACK' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: []
})
export class UnderConstructionComponent implements OnInit {
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 3;
  public user: UserInformationModel;
  private subscription: Subscription;
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      wizard => { this.wizard = wizard; }, this.user, null, this.currentStep, null);
  }

  back() {
    if (this.wizard.policyApplicationModel.petitionerTypeId === PetitionerType.COMPANY) {
      this.router.navigate(['policies/create-policy-enrollment/step10/2/section4']);
    } else if (this.wizard.policyApplicationModel.petitionerTypeId === PetitionerType.INDIVIDUAL) {
      this.router.navigate(['policies/create-policy-enrollment/step10/3/section3']);
    } else {
      this.router.navigate(['policies/create-policy-enrollment/step10/1/section1']);
    }
  }
}
