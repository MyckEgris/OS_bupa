import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CommonService } from './../services/common/common.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateBusinessInsuranceGuard implements CanActivate {

  /**
 * Title for business exception modal message
 */
  private BUSINESS_EXCEPTION_TITLE = 'POLICY.APPLICATION.EXCEPTIONS.UNAUTHORIZED_BUSINESS_INSURANCE_TITTLE';

  private NOT_AUTHORIZED_BUSINESS_INSURANCE = 'POLICY.APPLICATION.EXCEPTIONS.UNAUTHORIZED_BUSINESS_INSURANCE';

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const validateBusinessInsurance = this.commonService.validateAuthorizedBusinessInsurance(+this.authService.getUser().bupa_insurance);
    if (!validateBusinessInsurance) {
      let title: string;
      let message: string;

      this.translate.get(this.BUSINESS_EXCEPTION_TITLE).subscribe(t => title = t);
      this.translate.get(this.NOT_AUTHORIZED_BUSINESS_INSURANCE).subscribe(m => message = m);

      this.notificationService.showDialog(title, message);
    }

    return validateBusinessInsurance;
  }
}
