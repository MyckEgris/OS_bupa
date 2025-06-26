import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IgnoreInterceptorTypeNames } from '../../classes/ignoreInterceptorType.enum';
import { ConfigurationService } from '../configuration/configuration.service';
import {  ResetPasswordDTO } from './entities/ResetPassword.dto';

@Injectable({
  providedIn: 'root'
})
export class BupaAppService {

  constructor(
    private http: HttpClient,
    private config: ConfigurationService,
    handler: HttpBackend) {
      this.http = new HttpClient(handler);
     }

     /**
     * Error handler.
     * @param error HttpErrorResponse.
     */
      private handleError(error: HttpErrorResponse) {
        return throwError(error);
      }

    activateAccount(token: string) {      
      const headers = new HttpHeaders()
        .append('serviceToken', token)
        .append('Ocp-Apim-Subscription-Key', this.config.apimSubscription);  
        
      return this.http.post(`${this.config.apimHost}/accounts/activationAccount`, null, { headers: headers, responseType: 'text' })
        .pipe(catchError(this.handleError));
    }

    getPasswordRules(): Observable<any> {      
      const headers = new HttpHeaders()
        .append('Ocp-Apim-Subscription-Key', this.config.apimSubscription);     
        
      return this.http.get(`${this.config.apimHost}/passwords/rules`, { headers: headers })
        .pipe(catchError(this.handleError));
    }

    resetPassword(token: string, resetPasswordDto: ResetPasswordDTO) {
      const headers = new HttpHeaders()
        .append('serviceToken', token)
        .append('Ocp-Apim-Subscription-Key', this.config.apimSubscription);

      // tslint:disable-next-line: max-line-length
      return this.http.post(`${this.config.apimHost}/passwords/newPassword`, resetPasswordDto, { headers: headers, responseType: 'text' })
        .pipe(catchError(this.handleError));
    }
}
