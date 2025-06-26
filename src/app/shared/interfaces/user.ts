/**
* User.ts
*
* @description: Contract for user service.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

/**
 * Contract for user service.
 */
export interface User {
    /**
     * Get user by id
     * @param id User Id
     */
    getUserById(id: string);
}
