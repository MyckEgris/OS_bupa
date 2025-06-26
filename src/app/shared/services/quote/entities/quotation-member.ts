/**
* QuoteDto
*
* @description: This class contains member information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/
import { QuotationMemberExtrapremium } from './quotation-member-extrapremium';

/**
 * This class contains member information for make a quotation request
 */
export interface QuotationMember {

    memberId: number;
    /**
     * member Number
     */
    memberNumber: number;

    /**
     * name
     */
    memberName: string;

    /**
     * dob
     */
    dateOfBirth: Date;

    /**
     * age
     */
    age: number;

    /**
     * gender
     */
    gender: number;

    /**
     * relation type id
     */
    relationTypeId: number;

    /**
     * extraPremiums
     */
    extraPremiums: Array<QuotationMemberExtrapremium>;

    /**
     * relation type description
     */
    relationType?: string;

    /**
     * Member's status Id.
     */
    statusId: number;

    /**
     * Not mapped; handles remove quote action
     */
    removedFromQuote: boolean;

    /**
     * Not mapped; handles remove quote action
     */
    checked: boolean;

    added: boolean;
}
