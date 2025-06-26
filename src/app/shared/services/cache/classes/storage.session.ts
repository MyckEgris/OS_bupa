/**
* SessionStorage.ts
*
* @description: This class implements IStorage to persist data in memory
* @author Juan Camilo Moreno.
* @version 1.0
* @date 13-10-2018.
*
**/

import { IStorage } from '../interfaces/storage.interface';

/**
 * This class implements IStorage to persist session storage
 */
export class SessionStorage implements IStorage {

    /**
     * Get value from session storage
     * @param key Key
     */
    get(key: string): string {
        return window.sessionStorage.getItem(key);
    }

    /**
     * Set in session storage
     * @param key Key
     * @param value Value
     */
    put(key: string, value: string) {
        window.sessionStorage.setItem(key, value);
    }

    /**
     * Delete from session storage
     * @param key Key
     */
    delete(key: string) {
        window.sessionStorage.removeItem(key);
    }
}
