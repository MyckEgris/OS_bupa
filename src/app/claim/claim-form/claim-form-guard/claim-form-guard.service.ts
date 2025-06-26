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
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { ClaimFormWizardService } from '../claim-form-wizard/claim-form-wizard.service';
import { ClaimFormWizard } from '../claim-form-wizard/entities/ClaimFormWizard';

/**
 * This class iteracts with ClaimSubmissionWizardService and Router module.
 */
@Injectable({
  providedIn: 'root'
})
export class ClaimFormGuardService implements CanActivate {

  /**
  * Wizard current step indicator.
  */
  public currentStep = 0;

  /**
  * Constructor Method
  * @param router Router Injection
  * @param claimSubmission Claim Submission Service Injection
  */
  constructor(
    private router: Router,
    private claimFormWizardService: ClaimFormWizardService,
    private authService: AuthService
  ) { }

  /**
   * Method for activate route
   * @param route Route
   * @param state State
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise<boolean>((resolve, reject) =>
      this.claimFormWizardService.beginWizard((wizard: ClaimFormWizard) => {
        if (next.data.step > 1 && wizard.currentStep === 0) {
          const url = document.URL;
          const claimsubmissiontype = url.indexOf('quickpay') > -1 ? 'quickpay' : 'massmngt';
          this.router.navigate(['claims/claim-submission-create-v2/' + claimsubmissiontype]);
          resolve(false);
        } else {
          resolve(true);
        }
      })
    );
  }
}
