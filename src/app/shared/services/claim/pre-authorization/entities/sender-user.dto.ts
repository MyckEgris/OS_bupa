/***
 * Information of who creates the PreAuthorization
 */
export interface SenderUserDto {
    id: number;
    roleId: number;
    name: string;

    /***
     * Only sent when you are a user is a Holder
     */
    memberId: number;

    /***
     * Only sent when you are a user is a Provider
     */
    taxNumber: number;
}
