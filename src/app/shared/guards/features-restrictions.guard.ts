import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureRestrictionsGuard implements CanActivate {

  /**
 * Title for business exception modal message
 */
  private EMPLOYEE_EXCEPTION_TITLE = 'EMPLOYEE.ECXEPTION_TITTLE';

  private NOT_AUTHORIZED_EMPLOYEE = 'EMPLOYEE.RESTRICTION';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const userLoaded = this.authService.getUser();
    if (userLoaded.impersonalized === 'True') {

        let title: string;
        let message: string;

        this.translate.get(this.EMPLOYEE_EXCEPTION_TITLE).subscribe(t => title = t);
        this.translate.get(this.NOT_AUTHORIZED_EMPLOYEE).subscribe(m => message = m);

        this.notificationService.showDialog(title, message);

        return false;
    }

    return true;
  }
}
