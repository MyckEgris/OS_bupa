/**
* LocalStorage.ts
*
* @description: This class implements IStorage to persist data in local storage
* @author Juan Camilo Moreno.
* @version 1.0
* @date 13-10-2018.
*
**/

import { IStorage } from '../interfaces/storage.interface';

/**
 * This class implements IStorage to persist data in local storage
 */
export class LocalStorage implements IStorage {

    /**
     * Get value from local storage
     * @param key Key
     */
    get(key: string): string {
        return window.localStorage.getItem(key);
    }

    /**
     * Set in local storage
     * @param key Key
     * @param value Value
     */
    put(key: string, value: string) {
        window.localStorage.setItem(key, value);
    }

    /**
     * Delete from local storage
     * @param key Key
     */
    delete(key: string) {
        window.localStorage.removeItem(key);
    }
}
