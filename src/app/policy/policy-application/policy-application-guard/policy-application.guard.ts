import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PolicyApplicationWizardService } from '../policy-application-wizard/policy-application-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyApplicationGuard implements CanActivate {

  /**
   * Constructor Method
   * @param router Router Injection
   * @param policyApplication Policy Application Service Injection
   * @param authService Auth Service Injection
   */
  constructor(
    private router: Router,
    private policyApplication: PolicyApplicationWizardService,
    private authService: AuthService
  ) { }
  /**
   * Method for activate route
   * @param route Route
   * @param state State
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.getUser();
    return new Promise<boolean>((resolve, reject) =>
      this.policyApplication.beginPolicyApplicationWizard(policyApplication => {
        if (route.data.step > 1 && policyApplication.currentStep === 0) {
          this.router.navigate(['policies/create-policy-application']);
          resolve(false);
        } else {
          resolve(true);
        }
      }, user));
  }
}
