/**
* NetworkService.ts
*
* @description: Interacts with Network Provider API
* @author Jose Daniel Hernández M
* @version 1.0
* @date 17-01-2020.
*
*/


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigurationService } from '../configuration/configuration.service';
import { CachingService } from '../caching/caching-service';
import { ConstantParamsNetwork } from './constants/constant-params-network';
import { UploadResponse } from '../common/entities/uploadReponse';
import { NetworksByProductKeyDto } from './entities/networksByProductKey.dto';
import { DocumentProcessingResponseDto } from './entities/documentProcessingResponse.dto';
import { NetworkResponseDto } from './entities/networkResponse.dto';
import { NetworkDto } from './entities/network.dto';
import { ExcludedNetworksResponseDto } from './entities/excludedNetworkResponse.dto';
import { AddedNetworkDto } from './entities/addedNetwork.dto';

/**
 * Interacts with Network Provider API
 */
@Injectable({
  providedIn: 'root'
})

export class NetworkService {

  /**
   * [Http] Constant for contracts endpoint
   */
  private CONTRACTS = 'contracts';

  /**
   * [Http] Constant for networks endpoint
   */
  private PRODUCT_NETWORKS = 'productNetworks';

  /**
  * [Http] Constant for networks endpoint
  */
  private NETWORKS = 'networks';

  /**
   * Constant to identify network mock url
   */
  private networkUrl = '/assets/mocks/policy/policies.json';


  /**
   * Constructor
   * @param _http HttpClient Injection
   * @param _config Configuration Service Injection
   * @param _cachingService Caching Service Service Injection
   */
  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService,
    private _cachingService: CachingService
  ) { }


  /**
   * Sends the network providers documents to be processed.
   * @param documentInfo Document Info.
   */
  sendContractProcessing(documentInfo: UploadResponse) {
    const contractDocument = {
      fileName: documentInfo.fileName,
      folderName: documentInfo.folderName
    };

    return this._http.post<DocumentProcessingResponseDto>(`${this._config.apiHostNetworks}/providers/${this.CONTRACTS}`,
      contractDocument)
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets the list of networks filtering by ProductKey.
   * @param productKey Product Key.
   */
  getNetworksByProductKey(productKey: string, pageIndex: string, pageSize: string): Observable<NetworkResponseDto> {
    const params = new HttpParams()
      .set(ConstantParamsNetwork.PRODUCT_KEY, productKey)
      .set(ConstantParamsNetwork.PAGE_INDEX, pageIndex)
      .set(ConstantParamsNetwork.PAGE_SIZE, pageSize);

    return this._http.get<NetworkResponseDto>(`${this._config.apiHostNetworks}/${this.PRODUCT_NETWORKS}`,
      { params: params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets the list of not associated networks filtering by ProductKey.
   * @param productKey Product Key.
   */
  getNotAssociatedNetworksByProductKey(
    productKey: string, pendingAssociated: string, pageIndex: string, pageSize: string): Observable<ExcludedNetworksResponseDto> {
    const params = new HttpParams()
      .set(ConstantParamsNetwork.PRODUCT_KEY, productKey)
      .set(ConstantParamsNetwork.PENDING_ASSOCIATED, pendingAssociated)
      .set(ConstantParamsNetwork.PAGE_INDEX, pageIndex)
      .set(ConstantParamsNetwork.PAGE_SIZE, pageSize);

    return this._http.get<ExcludedNetworksResponseDto>(`${this._config.apiHostNetworks}/${this.NETWORKS}`,
      { params: params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Posts the added list of networks to product.
   * @param productKey Product Key.
   */
  postAddedNetworksToProduct(networksList: AddedNetworkDto[]) {
    return this._http.post<any>(`${this._config.apiHostNetworks}/${this.PRODUCT_NETWORKS}`,
      networksList)
      .pipe(catchError(this.handleError));
  }



  /**
   * Error handler.
   * @param error HttpErrorResponse.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
