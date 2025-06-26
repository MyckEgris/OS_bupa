/**
* MemoryStorage.ts
*
* @description: This class implements IStorage to persist data in memory
* @author Juan Camilo Moreno.
* @version 1.0
* @date 13-10-2018.
*
**/
import { IStorage } from '../interfaces/storage.interface';
import { Observable, Subject, of } from 'rxjs';

/**
 * Cache Content
 */
interface CacheContent {
    /**
     * Expiry
     */
    expiry: number;

    /**
     * Value
     */
    value: any;
}

/**
 * This class implements IStorage to persist data in memory
 */
export class MemoryStorage implements IStorage {

    /**
     * Cache Mapping
     */
    private cache: Map<string, CacheContent> = new Map<string, CacheContent>();

    /**
     * inFlightObservables
     */
    private inFlightObservables: Map<string, Subject<any>> = new Map<string, Subject<any>>();

    /**
     * DEFAULT_MAX_AGE
     */
    readonly DEFAULT_MAX_AGE: number = 300000;

    /**
     * Get value from memory
     * @param key Key
     */
    get(key: string/*, fallback?: Observable<any>, maxAge?: number*/) {
        /*if (this.hasValidCachedValue(key)) {
            let obteinedCache: Observable<any> | Subject<any> = of(this.cache.get(key).value);
            let result: any;

            obteinedCache.subscribe(value => { result = value });

            return JSON.stringify(result);
        }

        if (!maxAge) {
            maxAge = this.DEFAULT_MAX_AGE;
        }

        if (this.inFlightObservables.has(key)) {
            return this.inFlightObservables.get(key);
        } else if (fallback && fallback instanceof Observable) {
            this.inFlightObservables.set(key, new Subject());
            return fallback.do((value) => { this.put(key, value, maxAge); });
        } else {
            return Observable.throw('Requested key is not available in Cache');
        }*/
        // Quitar despues de implementar
        return ''; // Observable.throw('Requested key is not available in Cache');
    }

    /**
     * Exists key in memory store
     * @param key key
     */
    private exists(key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * Set in memory
     * @param key Key
     * @param value Value
     * @param maxAge Expire
     */
    put(key: string, value: any, maxAge: number = this.DEFAULT_MAX_AGE): void {
        this.cache.set(key, { value, expiry: Date.now() + maxAge });
        this.notifyInFlightObservers(key, value);
    }

    /**
     * Delete from memory
     * @param key Key
     */
    delete(key: string): void {
        this.put(key, null);
    }

    /**
   * Publishes the value to all observers of the given
   * in progress observables if observers exist.
   */
    private notifyInFlightObservers(key: string, value: any): void {
        if (this.inFlightObservables.has(key)) {
            const inFlight = this.inFlightObservables.get(key);
            const observersCount = inFlight.observers.length;
            if (observersCount) {
                inFlight.next(value);
            }
            inFlight.complete();
            this.inFlightObservables.delete(key);
        }
    }

    /**
     * Checks if the key exists and   has not expired.
     */
    private hasValidCachedValue(key: string): boolean {
        if (this.cache.has(key)) {
            if (this.cache.get(key).expiry < Date.now()) {
                this.cache.delete(key);
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
}
