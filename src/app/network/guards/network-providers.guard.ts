import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkProvidersGuard  {
  constructor(
    private router: Router,
    private translate: TranslationService
  ) {

  }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return new Promise<boolean>((resolve, reject) => {
  //     this.translate.setLanguage('SPA');
  //     resolve(true);
  //   });
  // }
}
