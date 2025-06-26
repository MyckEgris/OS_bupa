/**
* CacheService.ts
*
* @description: Help for persists data in any storage since same service, extending for type of cache
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Injectable } from '@angular/core';
import { IStorage, StorageKind, LocalStorage, SessionStorage, CookieStorage, MemoryStorage } from './cache.index';
import { CookieService } from 'ngx-cookie-service';

/**
 * Help for persists data in any storage since same service, extending for type of cache
 */
@Injectable()
export class CacheService {

  /**
   * Constructor Method
   * @param cookie Cookie Service Injection
   */
  constructor(private cookie: CookieService) {}

  /**
   * Method for manage persistence of data according kind of storage
   * @param kind StorageKind
   */
  storage(kind: StorageKind): IStorage {
    switch (kind) {
      case StorageKind.InLocalStorage:
        return new LocalStorage();
      case StorageKind.InSessionStorage:
        return new SessionStorage();
      case StorageKind.InCookieStorage:
        return new CookieStorage(this.cookie);
      case StorageKind.InMemoryStorage:
        return new MemoryStorage();
      default:
        return new SessionStorage();
    }
  }

}
