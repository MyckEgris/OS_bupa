import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyChangesWizardService } from '../policy-changes-wizard/policy-changes-wizard.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyChangesGuard implements CanActivate {

  constructor(
    private router: Router,
    private policyChangeWizardService: PolicyChangesWizardService,
    private authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const user = this.authService.getUser();
    return new Promise<boolean>((resolve, reject) =>
      this.policyChangeWizardService.beginPolicyChangesWizardServiceWizard(policy => {
        if (next.data.step > 1 && policy.currentStep === 0) {
          this.router.navigate(['policy/policy-changes']);
          resolve(false);
        } else {
          resolve(true);
        }
      }, user));
  }
}
