import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InformationRequestWizardService } from '../information-request-wizard/information-request-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';

/***
 * Guard that does not skip steps.
 */
@Injectable({
  providedIn: 'root'
})
export class InformationRequestGuard implements CanActivate {

  constructor(
    private router: Router,
    private informationRequestWizardService: InformationRequestWizardService,
    private authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const user = this.authService.getUser();
    return new Promise<boolean>((resolve, reject) =>
      this.informationRequestWizardService.beginRequestInformationWizard(informationRequest => {
        if (next.data.step > 1 && informationRequest.currentStep === 0) {
          this.router.navigate(['inquiry/information-request']);
          resolve(false);
        } else {
          resolve(true);
        }
      }, user));
  }
}
