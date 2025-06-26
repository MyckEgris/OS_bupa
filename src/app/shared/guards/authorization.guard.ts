/**
* AuthorizationGuard.ts
*
* @description: This class protect all routes that was implented, considering allowed roles and comparing with user roles.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
 CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../services/authorization/authorization.service';
import { NotificationService } from '../services/notification/notification.service';

/**
 * This class protect all routes that was implented, considering allowed roles and comparing with user roles.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanActivateChild {

  private MESSAGE_TITLE_FOR_FORBIDDEN = 'Forbidden Request';
  private MESSAGE_BODY_FOR_FORBIDDEN = 'Authorization has been denied for this request';

  /**
   * Constructor Method
   * @param authorizationService Authorization Service Injection
   * @param router Router Injection
   */
  constructor(
    private authorizationService: AuthorizationService,
    private notificationService: NotificationService
  ) {}

  /**
   * Event for accept or denied the access in specific route
   * @param next Route
   * @param state State
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = next.data.allowedRoles;
    const isAuthorized = this.authorizationService.isAuthorized(allowedRoles);
    if (!isAuthorized) {
      // this.router.navigate(['access-denied']);
      this.notificationService.showDialog(this.MESSAGE_TITLE_FOR_FORBIDDEN, `${this.MESSAGE_BODY_FOR_FORBIDDEN}.`);
    }

    return isAuthorized;
  }

  /**
   * Event for accept or denied the access in specific child route
   * @param next Route
   * @param state State
   */
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = next.data.allowedRoles;
    const isAuthorized = this.authorizationService.isAuthorized(allowedRoles);

    if (!isAuthorized) {
      // if not authorized, show access denied message
      // this.router.navigate(['/access-denied']);
      // this.notificationService.showDialog(this.MESSAGE_TITLE_FOR_FORBIDDEN, `${this.MESSAGE_BODY_FOR_FORBIDDEN}.`);
    }

    return isAuthorized;
  }

}
