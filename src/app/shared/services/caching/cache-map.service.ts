import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Cache } from './cache';
import { CacheEntry, MAX_CACHE_AGE } from './cache-entry';

@Injectable()
export class CacheMapService implements Cache {
    cacheMap = new Map<string, CacheEntry>();
    get(key: string): any | null {
        const entry = this.cacheMap.get(key);
        if (!entry) {
            return null;
        }
        const isExpired = (Date.now() - entry.entryTime) > MAX_CACHE_AGE;
        return isExpired ? null : entry.response;
    }
    put(key: string, res: any): void {
        const entry: CacheEntry = { url: key, response: res, entryTime: Date.now() };
        this.cacheMap.set(key, entry);
        this.deleteExpiredCache();
    }
    private deleteExpiredCache() {
        this.cacheMap.forEach(entry => {
            if ((Date.now() - entry.entryTime) > MAX_CACHE_AGE) {
                this.cacheMap.delete(entry.url);
            }
        });
    }
}
