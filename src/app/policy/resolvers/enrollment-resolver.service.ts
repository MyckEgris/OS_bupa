import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ViewTemplate } from 'src/app/shared/services/view-template/entities/view-template';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ResourcesCreatedByBupaInsurance } from 'src/app/shared/classes/resourcesCreatedByBupaInsurance.enum';
@Injectable({
  providedIn: 'root'
})
export class EnrollmentResolverService implements Resolve<ViewTemplate> {

  private user: UserInformationModel;
  constructor(
    private commonService: CommonService,
    private translation: TranslationService,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
   }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<ViewTemplate> {
    this.setLanguageSpanish();
    return this.getViewTemplate(this.user.bupa_insurance);
  }

  private getViewTemplate(bupaInsurance: string): Observable<ViewTemplate> {
    return this.commonService.getViewTemplate(bupaInsurance).pipe(
      map(policyInfo => {
        return policyInfo;
      })
    );
  }

  /**
  * Sets policyEnrollment language in Spanish.
  */
  async setLanguageSpanish() {
    await this.translate.use(`SPA_${this.user.bupa_insurance}`).toPromise();
  }

}
