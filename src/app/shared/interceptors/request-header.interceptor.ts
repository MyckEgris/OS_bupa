/**
* HttpErrorInterceptor.ts
*
* @description: This class Intercepts request for add header content type = json.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestHeaderInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const customReq = request.clone({
            headers: request.headers.set('Content-Type', 'application/json')
        });

        return next.handle(customReq);
    }
}
