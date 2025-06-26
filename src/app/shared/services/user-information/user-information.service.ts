/**
* UserInformationService.ts
*
* @description: Service for persists user information in memory
* @author Juan Camilo Moreno
* @version 1.0
* @date 17-09-2018.
*
**/

import { Injectable } from '@angular/core';
import { UserInformationModel } from './user-information.model';

/**
 * Service for persists user information in memory
 */
@Injectable({
    providedIn: 'root'
})
export class UserInformationService {

    /**
     * UserInformationModel
     */
    private _userInformation: UserInformationModel;

    /**
     * Constructor Method
     */
    constructor() {
    }

    /**
     * Get user information from memory
     */
    public getUserInformation(): UserInformationModel {
        return this._userInformation;
    }

    /**
     * Save user information in memory
     * @param sub Email
     * @param name User name
     * @param role Role
     * @param roles Array of roles
     * @param lang User language
     */
    public setUserInformation(sub: string, name: string, role: string, roles: Array<any>, lang: string) {
        const userInformation: UserInformationModel = {
            sub: sub,
            name: name,
            role: role,
            roles: roles,
            lang: lang
        };
        this._userInformation = userInformation;
    }

}
