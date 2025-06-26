import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PolicyEnrollmentWizardService } from '../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyEnrollmentPhase2Guard implements CanActivate {
  constructor(
    private router: Router,
    private policyEnrollment: PolicyEnrollmentWizardService,
    private authService: AuthService
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.getUser();
    return new Promise<boolean>((resolve, reject) => {
      const policyEnrollment = this.policyEnrollment.getPolicyEnrollment();
      if (policyEnrollment) {
        if (next.data.step > 11 && policyEnrollment.currentStep === 0) {
          this.router.navigate([`policies/create-policy-enrollment-P2-${user.bupa_insurance}`]);
          resolve(false);
        } else {
          resolve(true);
        }
      } else {
        if (next.data.step > 11) {
          this.router.navigate([`policies/create-policy-enrollment-P2-${user.bupa_insurance}`]);
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });
  }
}
