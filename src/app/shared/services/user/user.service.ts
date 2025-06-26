/**
* UserService.ts
*
* @description: Service for interacts with user api
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserOutputDto } from './entities/user.dto';
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from '../configuration/configuration.service';
import { ChangePasswordDto } from './entities/change-password.dto';
import { UpdateUserInputDto } from './entities/update-user.dto';
import { RoleDto } from './entities/role.dto';
import { CachingService } from '../caching/caching-service';

/**
 * Service for interacts with user api
 */
@Injectable({
  providedIn: 'root'
})
export class UserService implements User {

  /**
   * Constant for user root endpoint
   */
  private USER = 'users';

  /**
   * Constant for id root endpoint
   */
  private ID = 'id';

  /**
   * Constant for password root endpoint
   */
  private PASSWORD = 'password';

  /**
   * Constant for newPassword root endpoint
   */
  private NEW_PASSWORD = 'newPassword';

  /**
   * Constant for token root endpoint
   */
  private TOKEN = 'token';

  /**
   * Constant for forgot password parameter
   */
  FORGOT_PWD = 'forgotPassword';

  // Constant for save user path
  private SAVE_USER = 'users';

  private ROLES = 'roles';

  private ROLESCANBEIMPERSONATED = 'rolesCanBeImpersonated';

  // Constant used to unlocked users accounts
  private IS_LOCKED = 'false';
  private USER_KEY = 'userKey';
  private BUSINESSLIST = 'businessList';
  private ROLTOBEIMPERSONALIZED = 'rolToBeImpersonalized';
  private USERID = 'userId';

  /**
   * Contructor Method
   * @param _http HttpClient Injection
   * @param _config Configuration Service Injection
   */
  constructor(private _http: HttpClient,
    private _config: ConfigurationService,
    private _cachingService: CachingService) { }

  /**
   * Get user by id
   * @param id User Id
   */
  getUserById(id: string): Observable<UserOutputDto> {
    return this._http.get<UserOutputDto>(`${this._config.apiHost}/${this.USER}/${id}/`)
    .pipe(catchError(this.handleError));
  }

    /**
   * Get user by id
   * @param id User Id
   */
  getUserRolesByUserIdAndRolesId(id: string, roles: string): Observable<UserOutputDto> {
    return this._http.get<UserOutputDto>(`${this._config.apiHost}/${this.USER}/${id}/roles?roleIds=${roles}`)
    .pipe(catchError(this.handleError));
  }

  /**
   * Handle error
   * @param error HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  /**
   * Change password service
   * @param changePwdDto Object containing required information
   */
  ChangePassword(changePwdDto: ChangePasswordDto) {
    const params = new HttpParams().set(this.FORGOT_PWD, 'false');
    return this._http.patch(`${this._config.apiHost}/${this.USER}/${changePwdDto.id}/password`, changePwdDto,
      { params });
  }

  /**
 * Method to save user in Step 3 of registration, Activation
 * @param userInputDto UpdateUserInputDto
 */
  updateUser(userInputDto: UpdateUserInputDto): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const body = JSON.stringify(userInputDto);

    return this._http.patch<UpdateUserInputDto>(`${this._config.apiHost}/${this.SAVE_USER}/${userInputDto.id}/`, body, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * unlocks an userAccount
   * @param user user to be unlocked
   */
  unlockUser(user: UpdateUserInputDto) {

    const body = JSON.stringify(user);
    const params = new HttpParams().set('isLocked', this.IS_LOCKED);

    return this._http.patch(`${this._config.apiHost}/${this.SAVE_USER}/${user.id}/`, body,
                            { headers: { 'Content-Type': 'application/json'}, params: params});
  }

  getRolesCanBeImpersonatedByRoleId(rolId: number): Observable<RoleDto[]> {
    return this._cachingService.getCached<RoleDto[]>(`${this._config.apiHost}/${this.ROLES}/${rolId}/${this.ROLESCANBEIMPERSONATED}`);
  }

  getUserImpersonated(userKey: string,
    businessList: string, rolToBeImpersonalized: number, userId?: string): Observable<UserOutputDto[]> {
      let params = new HttpParams()
      .set(this.USER_KEY, userKey)
      .set(this.BUSINESSLIST, businessList)
      .set(this.ROLTOBEIMPERSONALIZED, rolToBeImpersonalized.toString());
      if (userId) {
        params = params.set(this.USERID, userId);
      }
      return this._http.get<UserOutputDto[]>(`${this._config.apiHost}/${this.USER}/`, { params: params });
  }
}
