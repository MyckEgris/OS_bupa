
/**
* ViewPreAuthorizationInputDto.ts
*
* @description: Input DTO search pre authorization
* @author Jose Daniel Hernández.
* @version 1.0
* @date 08-06-2019.
*
**/

import { ViewPreAuthorization } from './view-pre-authorization';

/**
 * DTO ViewPreAuthorizationInputDto
 */
export interface ViewPreAuthorizationInputDto {

    /**
     * pageIndex: number
     */
    pageIndex: number;

    /**
     * pageSize: number
     */
    pageSize: number;

    /**
     * total: number
     */
    count: number;

    /**
     * data: ViewPreAuthorization[]
     */
    data: ViewPreAuthorization[];
}
