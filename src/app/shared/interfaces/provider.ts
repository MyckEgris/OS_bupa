/**
* Provider.ts
*
* @description: Contract for provider service.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

/**
 * Contract for provider service.
 */
export interface Provider {
    /**
     * Get provider by id
     * @param id Id Provider
     */
    getProviderById(id: string);
}
