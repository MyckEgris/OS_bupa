/**
* DocumentsResolverService.ts
* service who works as a resolver and allows to preload the contract for rates, form and documents application
* @author Andrés Felipe Tamayo
* @version 1.0
* @date 06-15-2018.
*
**/

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { AgentService } from '../../../shared/services/agent/agent.service';
import { PolicyService } from '../../../shared/services/policy/policy.service';


import { RatesDocumentsInput } from '../../rates-forms-questionaries/entities/ratesDocumentsInput.dto';
import { Product } from '../../rates-forms-questionaries/entities/product.dto';
import { map, catchError } from 'rxjs/operators';

import { TranslationService } from '../../../shared/services/translation/translation.service';

import { Rol } from '../../../shared/classes/rol.enum';

@Injectable({
  providedIn: 'root'
})
export class DocumentsResolverService implements Resolve<any> {

  /**
   * holds the user information who is autenticated
   */
  public user;

  /**
   * ratesDocumentsContract
   */
  public ratesDocumentsContract: RatesDocumentsInput;

  /**
   *
   * @param _authService auth service inyeccion
   * @param _agentService  agent service inyeccion
   * @param _policyService  policy service inyeccion
   * @param _translationService  translation service inyeccion
   */
  constructor(
    private _authService: AuthService,
    private _agentService: AgentService,
    private _policyService: PolicyService,
    private _translationService: TranslationService
  ) {

  }

  /**
   * return the promise according if its agent or provider
   */
  resolve(): Observable<any> {

    this.user = this._authService.getUser();

    if (Number(this.user.role_id) === Rol.AGENT ||
      Number(this.user.role_id) === Rol.AGENT_ASSISTANT ||
      Number(this.user.role_id) === Rol.GROUP_ADMIN) {

      return this.getContractForAgent();
    }

    if (Number(this.user.role_id) === Rol.POLICY_HOLDER || Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) {
      return this.getContractForPolicyHolder();
    }

    return;
  }

  /**
   * load fields to the contract for agents role
  */
  getContractForAgent() {

    return this._agentService.getAgentById(this.user.agent_number)
      .pipe(
        map(agentInfo => {

          this.ratesDocumentsContract = {
            roleId: Number(this.user.role_id),
            products: [],
            dob: new Date().getFullYear(),
            referencePolicyId: 0,
            referenceGroupId: 0,
            policyId: null,
            bussinessId: agentInfo.insuranceBusinessId,
            countryId: agentInfo.countryId,
            agentId: agentInfo.agentId,
            languageId: this._translationService.getLanguageId()
          };

          return { RatesDocumentsContract: this.ratesDocumentsContract, 'error': 'null' };
        }),
        catchError(error => {
          return of({ RatesDocumentsContract: null, error: error });
        })
      );
  }

  /**
   * load field for policy holders
   */
  getContractForPolicyHolder() {

    return this._policyService.getDetailPolicyByPolicyId(
      this.user.role_id,
      this.user.user_key,
      Number(this.user.policy_id)
    ).pipe(
      map(policyInfo => {

        const productRecieved: Product = {
          id: policyInfo.productId,
          name: policyInfo.productName
        };

        this.ratesDocumentsContract = {
          roleId: Number(this.user.role_id),
          products: [productRecieved],
          dob: policyInfo.benefitYear,
          referencePolicyId: (policyInfo.referencePolicyId === '') ? 0 : policyInfo.referencePolicyId,
          referenceGroupId: (policyInfo.referenceGroupId === '') ? 0 : policyInfo.referenceGroupId,
          policyId: policyInfo.policyId,
          bussinessId: policyInfo.insuranceBusinessId,
          countryId: null,
          agentId: null,
          languageId: policyInfo.languageId
        };

        return { RatesDocumentsContract: this.ratesDocumentsContract, 'error': 'null' };
      }),
      catchError(error => {
        return of({ RatesDocumentsContract: null, error: error });
      })
    );
  }

}
