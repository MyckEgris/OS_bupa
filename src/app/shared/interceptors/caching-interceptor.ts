import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheMapService } from '../services/caching/cache-map.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor(private cache: CacheMapService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRequestCachable(req)) {
            return next.handle(req);
        }
        const cachedResponse = this.cache.get(req.urlWithParams);
        if (cachedResponse !== null) {
            return of(cachedResponse);
        }
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cache.put(req.urlWithParams, event);
                }
            })
        );
    }
    private isRequestCachable(req: HttpRequest<any>) {
        return (req.method === 'GET');
    }
}
