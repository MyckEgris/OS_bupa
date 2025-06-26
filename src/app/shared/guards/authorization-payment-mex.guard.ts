/**
* AuthorizationPaymentMexGuard.ts
*
* @description: This class protect all routes that was implented, considering allowed roles and comparing with user roles.
* @author Edwin Javier Sanabria M.
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
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CacheService } from '../services/cache/cache.service';
import { IStorage, StorageKind } from '../services/cache/cache.index';

/**
 * This class protect all routes that was implented, considering allowed roles and comparing with user roles.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthorizationPaymentMexGuard implements CanActivate, CanActivateChild {

  /**
   * Storage Object
   */
  private storage: IStorage;

  private MESSAGE_TITLE_FOR_FORBIDDEN = 'Forbidden Request';
  private MESSAGE_BODY_FOR_FORBIDDEN = 'Authorization has been denied for this request';

  /**
   * Constructor Method
   * @param authorizationService Authorization Service Injection
   * @param router Router Injection
   */
  constructor(
    private authorizationService: AuthorizationService,
    private notificationService: NotificationService,
    private cache: CacheService,
    private authService: AuthService
  ) {
      this.storage = this.cache.storage(StorageKind.InLocalStorage);
    }

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
    if (!this.authService.isLogedIn()) {
      this.anonymousAccess(next, state);
    }

    return isAuthorized;
  }

  anonymousAccess(next, state): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      let authConfiguration: Promise<any>;
      authConfiguration = this.authService.configureWithNewPasswordConfigApi(
        next.queryParams.lang
      );
      authConfiguration.then(p => {
        if (!p) {
          this.storage.put('postLoginRoute', state.url);
        }
        resolve(true);
      })
        .catch(p => resolve(false));
    });
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
    if (!this.authService.isLogedIn()) {
      // this.anonymousAccess(next, state);
    }

    return isAuthorized;
  }

}
