/**
* AddTokenInterceptor.ts
*
* @description: This class implements how to add a Http Authentication Bearer token
                to each request done via HttpClient by implementing a HttpInterceptor.
* @author Ivan Alejandro Hidalgo.
* @version 1.0
* @date 10-01-2019.
*
**/

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { IgnoreAddTokenInterceptor } from './entities/interceptor-commands';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

    /**
     * Injects an oauthService instance for getting the access token.
     * @param oauthService oauthService instance.
     */
    constructor(
        private oauthService: OAuthService,
      ) { }

    /**
     * Sets access token to each request done via HttpClient.
     * @param request HttpRequest.
     * @param next HttpHandler.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.oauthService.getAccessToken();
        const authorizationHeader = request.headers.get('Authorization');
        let customReq = request.clone();

        if (!this.checkForHeaderInstructions(request.headers, IgnoreAddTokenInterceptor) &&
            !authorizationHeader) {
            customReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`)
            });
        }

        return next.handle(customReq);
    }

    checkForHeaderInstructions(headers: HttpHeaders, instruction: string): boolean {
      return headers.has(instruction);
    }
}
