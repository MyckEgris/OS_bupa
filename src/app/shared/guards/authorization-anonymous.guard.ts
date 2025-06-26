import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CacheService } from '../services/cache/cache.service';
import { IStorage, StorageKind } from '../services/cache/cache.index';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationAnonymousGuard implements CanActivate {

  /**
   * Storage Object
   */
  private storage: IStorage;

  constructor(
    private cache: CacheService,
    private authService: AuthService
  ) {
    this.storage = this.cache.storage(StorageKind.InLocalStorage);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

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
}
