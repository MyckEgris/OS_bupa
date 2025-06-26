/**
* claim-submission-guard.service.ts
*
* @description: This class iteracts with ClaimSubmissionWizardService and Router module.
* @author Yefry Lopez.
* @version 1.0
* @date 09-10-2018.
*
**/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClaimSubmissionWizardService } from '../claim-submission-wizard/claim-submission-wizard.service';

/**
 * This class iteracts with ClaimSubmissionWizardService and Router module.
 */
@Injectable({
  providedIn: 'root'
})
export class ClaimSubmissionGuardService implements CanActivate {

  /**
   * Constructor Method
   * @param router Router Injection
   * @param claimSubmission Claim Submission Service Injection
   */
  constructor(
    private router: Router,
    private claimSubmission: ClaimSubmissionWizardService
  ) { }

  /**
   * Method for activate route
   * @param route Route
   * @param state State
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve, reject) =>
      this.claimSubmission.beginClaimSubmissionWizard(claimSubmission => {
        if (route.data.step > 1 && claimSubmission.currentStep === 0) {
          const url = document.URL;
          const claimsubmissiontype = url.indexOf('quickpay') > -1 ? 'quickpay' : 'massmngt';
          this.router.navigate(['claims/claim-submission-create-v1/' + claimsubmissiontype]);
          resolve(false);
        } else {
          resolve(true);
        }
      }));
  }
}
