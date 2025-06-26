import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PreAuthorizationWizardService } from '../pre-authorization-wizard/pre-authorization-wizard.service';

/***
 * Guard that does not skip steps.
 */
@Injectable({
  providedIn: 'root'
})
export class PreAuthorizationGuard implements CanActivate {

  constructor(
    private router: Router,
    private preAuthWizardService: PreAuthorizationWizardService,
    private authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const user = this.authService.getUser();
    return new Promise<boolean>((resolve, reject) =>
      this.preAuthWizardService.beginPreAuthWizardServiceWizard(preAuth => {
        if (next.data.step > 1 && preAuth.currentStep === 0) {
          this.router.navigate(['claims/pre-authorization']);
          resolve(false);
        } else {
          resolve(true);
        }
      }, user));
  }
}
