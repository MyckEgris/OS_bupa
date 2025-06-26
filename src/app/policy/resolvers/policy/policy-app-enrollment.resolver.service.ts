import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyApplicationResponse } from 'src/app/shared/services/policy-application/entities/policy-application-response.dto';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyAppEnrollmentResolverService implements Resolve<any> {
  /**
 * Stores the logged user information
 */
  private user: UserInformationModel;
  /**
 * PolicyApplication Dto object
 */
  public policyAplication: PolicyApplicationResponse = { totalCount: 0, pageindex: 1, pageSize: 0, policyApplications: [] };

  constructor(
    private policyAppService: PolicyApplicationService,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const applicationId = Number(atob(localStorage.getItem('applicationId')));
    if (applicationId) {
      const id = +applicationId;
      this.user = this.authService.getUser();
      return this.searchPolicyAppByNumber(id);
      // if (this.policyAplication.policyApplications.length > 0) {
      //   return this.policyAplication.policyApplications[0];
      // }
    }
  }

  /**
 * Searches in the policy API the policy matching policy application number entered
 * @param policyAppNumber Policy application number
 */
  searchPolicyAppByNumber(policyAppNumber: number): Observable<PolicyApplicationResponse> {
    return this.policyAppService.getPolicyAppByPolicyAppNumber(this.user.role_id, this.user.user_key, policyAppNumber, false).pipe(
      map(policyAppResponse => {
        return policyAppResponse;
      }),
      catchError(error => {
        // return of(error);
        if (this.checkIfBusinessError(error)) {
          this.notification.showDialog('EMPLOYEE.QUOTE.QUOTATION.CURRENT_INFORMATION.DATA_NOT_FOUND_TITLE',
            'EMPLOYEE.QUOTE.QUOTATION.CURRENT_INFORMATION.DATA_NOT_FOUND_MESSAGE');
        }

        this.router.navigate(['/policies/policy-application-view']);
        return of(error);
      }));
  }

  checkIfBusinessError(error) {
    return (error.status === 404);
  }
}
