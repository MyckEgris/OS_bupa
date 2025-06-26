import { ServiceTypeDto } from './service-type.dto';

/***
 * Interface for the get one list of Service Type
 */
export interface ServiceTypeResponse {
    serviceTypes: ServiceTypeDto[];
}
