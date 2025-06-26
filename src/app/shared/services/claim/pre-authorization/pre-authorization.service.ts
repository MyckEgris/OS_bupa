import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ConfigurationService } from '../../configuration/configuration.service';
import { CachingService } from '../../caching/caching-service';
import { RequestTypeResponse } from './entities/request-type-response';
import { ServiceTypeResponse } from './entities/service-type-response';
import { PreAuthorizationDto } from './entities/pre-authorization.dto';

@Injectable({
  providedIn: 'root'
})
export class PreAuthorizationService {

  /**
   * [HttpGet] Constant for requestType endpoint
   */
  private REQUEST_TYPE = 'requesttypes';

  /**
   * [HttpGet] Constant for serviceType endpoint
   */
  private SERVICE_TYPE = 'servicetypes';

  /**
   * [HttpPost] Constant for serviceType endpoint
   */
  private PRE_AUTHORIZATION = 'preauthorizations';

  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService,
    private _cachingService: CachingService
  ) { }

  /**
   * Searchs all requestType
   */
  getRequestType(): Observable<RequestTypeResponse> {

    return this._cachingService.getCached<RequestTypeResponse>(
      `${this._config.apiHostPreAuthorization}/${this.REQUEST_TYPE}`
    )
      .pipe(catchError(this.handleError));
  }

  /**
   * Searchs all serviceType
   */
  getServiceType(): Observable<ServiceTypeResponse> {

    return this._cachingService.getCached<ServiceTypeResponse>(
      `${this._config.apiHostPreAuthorization}/${this.SERVICE_TYPE}`
    )
      .pipe(catchError(this.handleError));
  }

  /**
   * Error handler.
   * @param error HttpErrorResponse.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  /***
   * Create new PreAuthorization, the trackingNumber is generate in AmigosPlus
   */
  savePreAuthorization(preAuth: PreAuthorizationDto): Observable<any> {
    return this._http.post<PreAuthorizationDto>(`${this._config.apiHostPreAuthorization}/${this.PRE_AUTHORIZATION}`, preAuth)
    .pipe(
      map(data => {
        return data.trackingNumber;
      })
    );
  }
}
