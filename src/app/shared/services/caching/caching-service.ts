import { Injectable } from '@angular/core';
import { HttpRequest, HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { CacheMapService } from './cache-map.service';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CachingService {

    constructor(private cache: CacheMapService, private http: HttpClient) {

    }

    getCached<T>(url: string, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<T> {
        const urlBuilder = new HttpRequest('GET', url, { params: options ? options.params : undefined });
        const urlWithParams = urlBuilder.urlWithParams;
        const cachedResponse = this.cache.get(urlWithParams);
        if (cachedResponse) {
            return of(cachedResponse);
        } else {
            return this.http.get<T>(url, options).pipe(tap(p => {
                this.cache.put(urlWithParams, p);
            }));
        }
    }
}
