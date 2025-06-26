/**
* ProviderOutputDto.ts
*
* @description: DTO provider response
* @author Juan Camilo Moreno
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * DTO provider response
 */
export interface ProviderOutputDto {

    /**
     * id
     */
    id: number;

    /**
     * name
     */
    name: string;

    /**
     * website
     */
    website: string;

    /**
     * paymentMethod
     */
    paymentMethod: string;

    /**
     * taxNumber
     */
    taxNumber: number;

    /**
     * statusId
     */
    statusId: number;

    /**
     * languageId
     */
    languageId: number;

    /**
     * id
     */
    language: string;

    /**
     * countryId
     */
    countryId: number;

    /**
     * countryCode
     */
    countryCode: string;

    /**
     * countryName
     */
    countryName: string;
}
