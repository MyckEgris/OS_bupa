/**
* QuoteMemberResponse
*
* @description: This class contains member response information
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class contains member response information
 */
export interface QuoteMemberResponse {
    /**
     * Relation
     */
    relation: string;

    /**
     * Relation Id
     */
    relationId: number;

    /**
     * Name
     */
    name: string;

    /**
     * Age
     */
    age: number;

    /**
     * DOB
     */
    dob: Date;

    /**
     * Premium
     */
    premium: any;

    /**
     * Extra Premium
     */
    xtra: Array<any>;

    /**
     * Total
     */
    total: number;

    /**
     * Member's status Id.
     */
    statusId: number;
}
