/**
* CookieStorage.ts
*
* @description: This class implements IStorage to persist data in cookies
* @author Juan Camilo Moreno.
* @version 1.0
* @date 13-10-2018.
*
**/
import { IStorage } from '../interfaces/storage.interface';
import { CookieService } from 'ngx-cookie-service';

/**
 * This class implements IStorage to persist data in cookies
 */
export class CookieStorage implements IStorage {
    /**
     * Constructor Method
     * @param cookie CookieService Injection
     */
    constructor(private cookie: CookieService) { }

    /**
    * Get value from cookie storage
    * @param key Key
    */
    get(key: string): string {
        return this.cookie.get(key);
    }

    /**
     * Set in cookie storage
     * @param key Key
     * @param value Value
     */
    put(key: string, value: string) {
        const now = new Date();
        now.setTime(now.getTime() + 1 * 3600 * 1000);
        this.cookie.set(key, value, now, '/');
    }

    /**
     * Delete from cookie storage
     * @param key Key
     */
    delete(key: string) {
      this.cookie.set(key, '', -1, '/');
    }
}
