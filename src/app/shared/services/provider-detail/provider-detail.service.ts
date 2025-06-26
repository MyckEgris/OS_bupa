/**
* ProviderDetailService.ts
*
* @description: This class interacts with provider API.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { CachingService } from '../caching/caching-service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProviderProfileDetailDto } from './entities/providerProfileDetail.dto';



/**
 * This class interacts with provider API.
 */
@Injectable({
  providedIn: 'root'
})
export class ProviderDetailService {

  /**
   * Constant to define root provider accounts endpoint.
   */
  private PROVIDER_ACCOUNTS = 'provideraccounts';

  /**
   * Constant for Lang parameter.
   */
  private LANG_KEY = 'lang';

  private providerProfileMock = '/assets/mocks/provider/providerProfileMock.json';


  /**
   * Constructor Method.
   * @param _http HttpClient Injection.
   * @param _config Configuration Service Injection.
   * @param _cachingService Caching Service Service Injection.
   */
  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService,
    private _cachingService: CachingService
  ) { }


  /**
   * Get provider profile detail information filtering by provider key.
   * @param providerKey Provider key.
   */
  getProviderProfileDetailByProviderKey(providerKey: string): Observable<ProviderProfileDetailDto> {

    /*return this._http.get<ProviderProfileDetailDto>(this.providerProfileMock)
      .pipe(map((response) => (response as ProviderProfileDetailDto)))
      .pipe(catchError(this.handleError));*/

    return this._http.get<ProviderProfileDetailDto>(`${this._config.apiHostProviders}/${this.PROVIDER_ACCOUNTS}/${providerKey}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Patch the provider profile detail information to crm.
   * @param providerKey Provider key.
   * @param providerInfo Provider Information.
   * @param lang Language.
   */
  patchProviderProfileDetail(providerKey: string, providerInfo: ProviderProfileDetailDto, lang: string) {

    const params = new HttpParams()
      .set(this.LANG_KEY, lang);

    return this._http.patch(`${this._config.apiHostProviders}/${this.PROVIDER_ACCOUNTS}/${providerKey}`,
      providerInfo, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle error.
   * @param error Error: HttpErrorResponse.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
