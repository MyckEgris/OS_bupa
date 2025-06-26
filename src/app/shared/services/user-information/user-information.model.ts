/**
* UserInformationModel.ts
*
* @description: Model user information
* @author Juan Camilo Moreno
* @version 1.0
* @date 17-09-2018.
*
**/

/**
 * Model user information
 */
export interface UserInformationModel {

    /**
     * sub
     */
    sub: string;

    /**
     * name
     */
    name: string;

    /**
     * lang
     */
    lang: string;

    /**
     * role
     */
    role: string;

    /**
     * roles[]
     */
    roles: Array<any>;
}
