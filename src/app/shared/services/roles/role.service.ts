/**
* RoleService.ts
*
* @description: Interacts with role endpoint from user API
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { MenuModel } from '../../../security/model/menu.model';
import { Role } from '../../interfaces/role';

/**
 * Interacts with role endpoint from user API
 */
@Injectable({
  providedIn: 'root'
})
export class RoleService implements Role {

  /**
   * Constant for roles root endpoint
   */
  private ROLES = 'roles';

  /**
   * Constant for request by roles and bupa insurance id showing
   */
  private BUPA_INSURANCE_ENDPOINT = 'bupainsurance';

  /**
   * Constant for describe request options
   */
  private OPTIONS_ENDPOINT = 'options';

  /**
   * Contructor Method
   * @param _http HttpClient Injection
   * @param _config Consiguration Service Injection
   */
  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService
  ) { }

  /**
   * Get role options by role and bupa insurance id
   * @param roleId Role id
   * @param idBupaInsurance Bupa insurance id
   */
  GetRoleOptionsByRoleIdAndBupaInsurance(roleId: string, idBupaInsurance: string): Observable<MenuModel[]> {
    //debugger
    // tslint:disable-next-line:max-line-length
    return this._http.get<MenuModel[]>(`${this._config.apiHost}/${this.ROLES}/${roleId}/${this.BUPA_INSURANCE_ENDPOINT}/${idBupaInsurance}/${this.OPTIONS_ENDPOINT}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * handle service errors
   * @param error HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
