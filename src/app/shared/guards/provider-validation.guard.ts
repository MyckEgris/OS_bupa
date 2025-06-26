import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Rol } from '../classes/rol.enum';

@Injectable({
  providedIn: 'root'
})
export class ProviderValidationGuard implements CanActivate {

  /**
 * Title for business exception modal message
 */
  private PROVIDER_EXCEPTION_TITLE = 'INQUIRY.RESTRICTION_PROVIDER.TITLE_ERROR';

  private NOT_AUTHORIZED_PROVIDER = 'INQUIRY.RESTRICTION_PROVIDER.MESSAGE_ERROR';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const userLoaded = this.authService.getUser();
    if (Number(userLoaded.role_id) === Rol.PROVIDER
          && !userLoaded.user_key_alternative) {

        let title: string;
        let message: string;

        this.translate.get(this.PROVIDER_EXCEPTION_TITLE).subscribe(t => title = t);
        this.translate.get(this.NOT_AUTHORIZED_PROVIDER).subscribe(m => message = m);

        this.notificationService.showDialog(title, message);

        return false;
    }

    return true;
  }
}
