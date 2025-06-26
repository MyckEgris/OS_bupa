/**
* ProductsService.ts
*
* @description: Interacts with Products API
* @author Jose Daniel Hernández M
* @version 1.0
* @date 20-01-2020.
*
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigurationService } from '../configuration/configuration.service';
import { CachingService } from '../caching/caching-service';
import { ConstantParamsProducts } from './constants/constant-params-products';
import { ProductByBussinessDto } from './entities/productByBussiness.dto';
import { PlanbyProductDto } from './entities/planbyProductDto';
// import { GeographicalLimitationsUploadHistory } from '../network/entities/geographicalLimitationsUploadHistory.dto';
import { ProductByUrlProductDto } from './entities/product.dto';
import { RequestOptions } from '@angular/http';


/**
 * Interacts with Products API
 */
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  /**
   * [Http] Constant for products endpoint
   */
  private PRODUCTS = 'products';

  /**
   * [Http] Constant for products endpoint
   */
  private PLANS = 'plans';


  /**
   * Constructor
   * @param _http HttpClient Injection
   * @param _config Configuration Service Injection
   * @param _cachingService Caching Service Service Injection
   */
  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService
  ) { }

  /**
   * Gets products filtering by insurance business id.
   * @param BussinessId Bussiness Id.
   */
  getProductsByBussinessId(BussinessId: number): Observable<ProductByBussinessDto[]> {
    const params = new HttpParams()
      .set(ConstantParamsProducts.BUSSINESS_ID, String(BussinessId));

    return this._http.get<ProductByBussinessDto[]>(
      `${this._config.apiHostProducts}/${this.PRODUCTS}`, { params: params })
      .pipe(catchError(this.handleError));
  }

/*  getProductsByProductKeys(geographicalLimitationsUploadHistory: GeographicalLimitationsUploadHistory){
    const httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      })
    };

    return this._http.post<ProductByUrlProductDto[]>(`${this._config.apiHostProducts}/${this.PRODUCTS}`, geographicalLimitationsUploadHistory, httpOptions).pipe(catchError(this.handleError));
  }*/

  sendProductToUpdate(productByBussinessDto: ProductByBussinessDto) {
    return this._http.patch(`${this._config.apiHostProducts}/${this.PRODUCTS}/${productByBussinessDto.productKey}`, productByBussinessDto)
    .pipe(catchError(this.handleError));
  }

  getPlansByProductKey(productKey: string): Observable<PlanbyProductDto[]> {
    return this._http.get<PlanbyProductDto[]>(
      `${this._config.apiHostProducts}/${this.PRODUCTS}/${productKey}/${this.PLANS}`)
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
