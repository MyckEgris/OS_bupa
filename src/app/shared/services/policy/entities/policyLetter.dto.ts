
/**
* PolicyLetterDto.ts
*
* @description: DTO Policy Letter.
* @author Jose Daniel Hernández M.
* @version 1.0
* @date 06-08-2020.
*
**/

/**
 * DTO Policy Letter.
 */
export interface PolicyLetterDto {

    /**
     * policyId.
     */
    policyId: number;

    /**
     * letterTypeId.
     */
    letterTypeId: string;

    /**
     * letterType.
     */
    letterType: string;

    /**
     * letterId.
     */
    letterId: number;

    /**
     * letterName.
     */
    letterName: string;

    /**
     * letterContent.
     */
    letterContent: any[]
}
