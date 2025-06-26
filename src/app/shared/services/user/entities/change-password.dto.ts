/**
* ChangePasswordDto.ts
*
* @description: DTO change password
* @author Arturo Suarez
* @version 1.0
* @date 24-10-2018.
*
**/

/**
 * DTO change password
 */
export interface ChangePasswordDto {

    /**
     * id
     */
    id: string;

    /**
     * current password
     */
    password: string;

    /**
     * new password
     */
    newPassword: string;

    /**
     * token
     */
    token: string;

    /**
     * Language
     */
    Language: string;
}
