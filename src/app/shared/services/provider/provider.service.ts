/**
* ProviderService.ts
*
* @description: Interacts with provider API
* @author Juan Camilo Moreno
* @version 1.0
* @date 10-10-2018.
*
**/

import { Injectable } from '@angular/core';
import { Provider } from '../../interfaces/provider';
import { Provider as ProviderModel } from './entities/provider';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ProviderOutputDto } from './entities/provider.dto';
import { catchError, map } from 'rxjs/operators';
import { ConfigurationService } from '../configuration/configuration.service';
import { UserOutputDto } from '../user/entities/user.dto';

/**
 * Interacts with provider API
 */
@Injectable({
  providedIn: 'root'
})
export class ProviderService implements Provider {

  /**
   * Constant to define root provider endpoint
   */
  private PROVIDER = 'providers';

  /**
   * Contructor Method
   * @param _http HttpClient Injection
   * @param _config Configuration Service Injection
   */
  constructor(private _http: HttpClient, private _config: ConfigurationService) { }

  /**
   * Get provider information filtering by id
   * @param id Id Provider
   */
  getProviderById(id: string): Observable<ProviderOutputDto> {
    return this._http.get<ProviderOutputDto>(`${this._config.apiHostProviders}/${this.PROVIDER}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
  * Get Associated providers with same RFC information filtering by id
  * @param id Id Provider
  */
  getAssociatedProviderById(id: string): Observable<any> {
    return this._http.get<any>(`${this._config.apiHostProviders}/${this.PROVIDER}/${id}/associates`)
      .pipe(map(p => (p as any).providers))
      .pipe(catchError(this.handleError));
  }

  /**
   * Map provider and user dto's information in provider model
   * @param providerDto providerDto
   * @param userDto userDto
   */
  mapperProviderDtoToProvider(providerDto: ProviderOutputDto, userDto: UserOutputDto): ProviderModel {
    let webSite = '';
    if (providerDto.website) {
      webSite = providerDto.website.indexOf('http') === -1 ? `http://${providerDto.website}` : providerDto.website;
    }

    return {
      name: providerDto.name,
      webSite: webSite,
      language: providerDto.language,
      country: providerDto.countryName,
      address1: '',
      address2: '',
      phone1: '',
      phone2: '',
      paymentMethod: providerDto.paymentMethod,
      taxNumber: providerDto.taxNumber,
      accountName: `${userDto.firstName} ${userDto.middleName} ${userDto.lastName}`,
      accountTitle: userDto.position,
      accountPhone: userDto.phoneNumber,
      accountEmail: userDto.name
    };
  }

  /**
   * handle error
   * @param error Error: HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
