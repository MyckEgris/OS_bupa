/**
* AuthorizationService.ts
*
* @description: This class handles the application permission according the data from JWT authentication token.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Injectable } from '@angular/core';
import { AuthService } from '../../../security/services/auth/auth.service';

/**
 * This class handles the application permission according the data from JWT authentication token.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  /**
   * Constructor Method
   * @param auth Auth Service Injection
   */
  constructor(
    private auth: AuthService
  ) { }

  /**
   * Returns if role has authorization on requested route
   * @param allowedRoles Array of roles that can access to route. See in data from routing
   */
  isAuthorized(allowedRoles: string[]): boolean {
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }

    const user = this.auth.getUser();
    //const permissions = user.permissions;
    return user.roles.filter(rol => allowedRoles.indexOf(rol) >= 0).length > 0;
  }
}
