import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentDeactivateRouteGuard implements CanDeactivate<CanComponentDeactivate> {

  private MODAL_TITTLE = 'POLICY.POLICY_ENROLLMENT.DEACTIVATE_ROUTE_TITTLE';

  private MODAL_BODY = 'POLICY.POLICY_ENROLLMENT.DEACTIVATE_ROUTE_BODY';

  private LEAVE = 'POLICY.POLICY_ENROLLMENT.DEACTIVATE_ROUTE_LEAVE';

  private STAY = 'POLICY.POLICY_ENROLLMENT.DEACTIVATE_ROUTE_STAY';


  /**
  * constructor method
  * @param authService auth service injection
  * @param policyEnrollmentWizardService Policy Enrollment Wizard Service Injection
  */
  constructor(
    private notification: NotificationService,
    private translate: TranslateService,
    private location: Location
  ) { }

  async canDeactivate(component: CanComponentDeactivate,
  ) {
    if (!this.location.path().includes('summary-final')) {
      const title = await this.translate.get(this.MODAL_TITTLE).toPromise();
      const message = await this.translate.get(this.MODAL_BODY).toPromise();
      const leave = await this.translate.get(this.LEAVE).toPromise();
      const stay = await this.translate.get(this.STAY).toPromise();
      const failed = await this.notification.showDialog(title, message, true, leave, stay);
      return failed;
    } else {
      return true;
    }
  }
}
