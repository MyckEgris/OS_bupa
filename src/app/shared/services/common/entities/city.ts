/**
 * City.ts
 * @description Model City
 * @author Sergio Daniel Silva
 * @version 1.0
 * @date 08-01-2019.
 **/



/**
 * Model City
 */
export interface City {

    /**
     * cityId
     */
    cityId: number;

    /**
     * countryId
     */
    countryId: number;

    /**
     * cityName
     */
    cityName: string;

    /**
     * cityKey?
     */
    cityKey?: string;

    /**
    * countryKey?
    */
    countryKey?: string;

}
