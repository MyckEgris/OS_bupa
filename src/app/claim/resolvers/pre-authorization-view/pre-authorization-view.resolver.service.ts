/**
* PreAuthorizationViewResolverService.ts
* service who works as a resolver and allows to preload the preAuthorization view information
* @author Jose Daniel Hernández
* @version 1.0
* @date 09-08-2019.
*
**/

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PreAuthorizationService } from 'src/app/shared/services/pre-authorization/pre-authorization.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Store, select } from '@ngrx/store';
import { Rol } from 'src/app/shared/classes/rol.enum';

@Injectable({
  providedIn: 'root'
})

export class PreAuthorizationViewResolverService implements Resolve<any> {

  user: UserInformationModel;

  /**
  * rol
  */
  public rol = Rol;

  /**
  * Constant for first pager Page Index parameter
  */
  private firstPageIndex = '1';

  /**
  * Constant for first pager Page Size parameter
  */
  private firstPageSize = '10';



  constructor(
    private _preAuthService: PreAuthorizationService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>
  ) { }



  /**
  * return the policy information according to the policy id saved on redux
  */
  resolve(): Observable<any> {
    this.getUserInfo();
    return this.generateRequestFilteringByRoleId();
  }

  /**
  * get the user information saved from redux
  */
  private getUserInfo() {
    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.user = userInfo;
    });
  }

  /**
  * generate the request to get the information filtering by RoleId
  */
  private generateRequestFilteringByRoleId() {

    if (
    this.user.role_id === Rol.AGENT.toString() ||
    this.user.role_id === Rol.POLICY_HOLDER.toString() ||
    this.user.role_id === Rol.GROUP_POLICY_HOLDER.toString() ||
    this.user.role_id === Rol.AGENT_ASSISTANT.toString() ||
    this.user.role_id === Rol.GROUP_ADMIN.toString() ||
    this.user.role_id === Rol.PROVIDER.toString() ) {
      return this._preAuthService.getViewPreAuthorizations(
        this.firstPageIndex, this.firstPageSize, null, null, null, null,
        null, null, null, null, null).pipe(
            map( preAuthInfo => {
              return { 'preAuthInfo': preAuthInfo, 'error': 'null' };
            }),
          catchError( error => {
            return of({preAuthInfo: null, error: error});
          })
        );
    } // else {return {preAuthInfo: null}; }

  }


}
