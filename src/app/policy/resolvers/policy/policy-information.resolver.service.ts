/**
* PolicyInformationResolverService.ts
* service who works as a resolver and allows to preload the policy information
* @author Andrés Felipe Tamayo
* @version 1.0
* @date 05-15-2018.
*
**/

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';

import { Store, select } from '@ngrx/store';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PolicyDto } from '../../../shared/services/policy/entities/policy.dto';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Injectable({
  providedIn: 'root'
})

export class PolicyInformationResolverService implements Resolve<any> {

  user: UserInformationModel;
  policyInfo: PolicyDto;

  constructor(
    private _policyService: PolicyService,
    private commonService: CommonService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>
  ) { }

  /**
   * return the policy information according to the policy id saved on redux
   */
  resolve(): Observable<any> {
    this.getUserInfo();
    return this.generateRequest();
  }

  /**
   * get the user information saved from redux
   */
  private getUserInfo() {
    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.user = userInfo;
    });
  }

  /** generate the request to get the information */
  private generateRequest() {
    return this._policyService.getDetailPolicyByPolicyId(
      this.user.role_id,
      this.user.user_key,
      Number(this.user.policy_id)
    ).pipe(
      map(policyInfo => {
        return { 'policyInfo': policyInfo, 'error': 'null' };
      }),
      catchError(error => {
        return of({ policyInfo: null, error: error });
      })
    );
  }

}
