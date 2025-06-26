/**
* Country.ts
*
* @description: Model country
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/



/**
 * Model country
 */
export interface Country {

    /**
     * countryId
     */
    countryId: number;

    /**
     * countryName
     */
    countryName: string;

    /**
     * areaCode
     */
    areaCode: string;

    /**
     * isoAlpha
     */
    isoAlpha: string;

    /**
     * insuranceBusinessId
     */
    insuranceBusinessId: number;

    /**
     * insuranceBusinessName
     */
    insuranceBusinessName: string;

    /**
     * countryKey?
     */
    countryKey?: string;

    /**
     * nacionality?
     */
    nacionality?: string;

}
