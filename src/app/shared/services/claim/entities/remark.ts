/**
* Remark.ts
*
* @description: Model remarks
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * Model remarks
 */
export interface Remark {

    /**
     * remarkId
     */
    remarkId: number;

    /**
     * remarkMessageId
     */
    remarkMessageId: number;

    /**
     * languageId
     */
    languageId: number;

    /**
     * remarkMessage
     */
    remarkMessage: string;

    /**
     * claimLineDetailId
     */
    claimLineDetailId: number;
}
