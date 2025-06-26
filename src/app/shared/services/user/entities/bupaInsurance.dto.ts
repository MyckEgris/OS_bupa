/**
* BupaInsuranceDto.ts
*
* @description: DTO bupa insurance
* @author Juan Camilo Moreno
* @version 1.0
* @date 17-09-2018.
*
**/

import { CountryDto } from './country.dto';

/**
 * DTO bupa insurance
 */
export interface BupaInsuranceDto {

    /**
     * id
     */
    id: number;

    /**
     * name
     */
    name: string;

    /**
     * insuranceCode
     */
    insuranceCode?: number;

    /**
     * countryDto: CountryDto
     */
    countryDto?: CountryDto;
}
