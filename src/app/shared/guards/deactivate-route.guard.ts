import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification/notification.service';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DeactivateRouteGuard implements CanDeactivate<CanComponentDeactivate> {

  private MODAL_TITTLE = 'APP.DEACTIVATE_ROUTE_TITTLE';

  private MODAL_BODY = 'APP.DEACTIVATE_ROUTE_BODDY';

  private STAY = 'APP.DEACTIVATE_ROUTE_STAY';

  private LEAVE = 'APP.DEACTIVATE_ROUTE_LEAVE';

  constructor(
    private notification: NotificationService,
    private translate: TranslateService
  ) { }

  async canDeactivate(component: CanComponentDeactivate,
  ) {
    debugger;
    const title = await this.translate.get(this.MODAL_TITTLE).toPromise();
    const message = await this.translate.get(this.MODAL_BODY).toPromise();
    const leave = await this.translate.get(this.LEAVE).toPromise();
    const close = await this.translate.get(this.STAY).toPromise();

    const failed = await this.notification.showDialog(title, message, true, close, leave);
    return failed;
  }
}
