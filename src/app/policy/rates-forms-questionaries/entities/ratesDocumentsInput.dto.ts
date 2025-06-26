/**
* RatesDocumentsInput
*
* @description: RatesDocumentsInput Interface.
* @author Andrés Tamayo
* @version 1.0
* @date 13-06-2019.
*
**/

import { Product } from './product.dto';

export interface RatesDocumentsInput {
    /**
     * role id
     */
    roleId: number;
    /**
     * array of products
     */
    products: Product[];
    /**
     * dob
     */
    dob: number;
    /**
     * reference policy id
     */
    referencePolicyId: any;
    /**
     * reference group id
     */
    referenceGroupId: any;
    /**
     * policy id
     */
    policyId: number;
    /**
     * bussiness id
     */
    bussinessId: number;
    /**
     * country id
     */
    countryId: number;
    /**
     * agent id
     */
    agentId: number;
    /**
     * language id
     */
    languageId: number;
}
