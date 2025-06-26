/**
* IStorage.ts
*
* @description: Contract for cache service
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * Contract for cache service
 */
export interface IStorage {

    /**
     * Get cache value according key
     * @param key Key
     */
    get(key: string): string;

    /**
     * Set cache key in any storage
     * @param key Key
     * @param value Value
     */
    put(key: string, value: string);

    /**
     * Delete key from any storage
     * @param key Key
     */
    delete(key: string);
}
