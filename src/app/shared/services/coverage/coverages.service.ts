import { AddedCoverageDto } from './entities/addedCoverage.dto';
import { CoverageResponseDto } from './entities/coverageResponse.dto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { CachingService } from '../caching/caching-service';
import { UploadResponse } from '../common/entities/uploadReponse';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConstantParamsCoverages } from '../network/constants/constant-params-coverages';
import { ExcludedCoverageResponseDto } from './entities/excludedCoverageResponse.dto';
import { IgnoreInterceptorTypeNames } from '../../classes/ignoreInterceptorType.enum';
import { PlanByProductKeyDto } from '../network/entities/planByProductKey.dto';
import { Body } from '@angular/http/src/body';

@Injectable({
  providedIn: 'root'
})
export class CoveragesService {

  /**
   * [Http] Constant for contracts endpoint
   */
  private COVERAGES = 'coverages';

  /**
   * [Http] Constant for coverageByPlan endpoint
   */
  private COVERAGE_BY_PLAN = 'CoverageByPlan';

  /**
   * [Http] Constant for plan endpoint
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
    private _config: ConfigurationService,
    private _cachingService: CachingService
  ) { }



  /**
  * Sends the network providers documents to be processed.
  * @param documentInfo Document Info.
  */
  sendContractProcessingCoverages(documentInfo: UploadResponse) {
    const coverage = {
      document: {
        fileName: documentInfo.fileName,
        folderName: documentInfo.folderName
      }
    };

    const headers = new HttpHeaders()
      .set(IgnoreInterceptorTypeNames.ERROR_400, IgnoreInterceptorTypeNames.ERROR_400);

    return this._http.post<any>(`${this._config.apiHostCoverages}/${this.COVERAGES}?lang=SPA`,
      coverage, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  getCoveragesByPlanKey(planKey: string, pageIndex: string, pageSize: string): Observable<CoverageResponseDto> {
    const params = new HttpParams()
      .set(ConstantParamsCoverages.PLAN_KEY, planKey)
      .set(ConstantParamsCoverages.PAGE_INDEX, pageIndex)
      .set(ConstantParamsCoverages.PAGE_SIZE, pageSize);

    return this._http.get<CoverageResponseDto>(`${this._config.apiHostCoverages}/${this.COVERAGE_BY_PLAN}`,
      { params: params })
      .pipe(catchError(this.handleError));
  }

  // tslint:disable-next-line: max-line-length
  getNotAssociatedCoveragesByPlanKey(planKey: string, pendingtoassociate: string, pageIndex: string, pageSize: string): Observable<ExcludedCoverageResponseDto> {
    const params = new HttpParams()
      .set(ConstantParamsCoverages.PENDING_ASSOCIATED, pendingtoassociate)
      .set(ConstantParamsCoverages.PLAN_KEY, planKey)
      .set(ConstantParamsCoverages.PAGE_INDEX, pageIndex)
      .set(ConstantParamsCoverages.PAGE_SIZE, pageSize);

    return this._http.get<ExcludedCoverageResponseDto>(`${this._config.apiHostCoverages}/${this.COVERAGES}`,
      { params: params })
      .pipe(catchError(this.handleError));
  }

  postAddedCoveragesToPlan(coveragesList: AddedCoverageDto[]) {
    return this._http.post<any>(`${this._config.apiHostCoverages}/${this.COVERAGE_BY_PLAN}`,
      coveragesList)
      .pipe(catchError(this.handleError));
  }

  getPlansAndCoveragesConfigurated(plansSourceList: PlanByProductKeyDto[]) {
    return this._http.post<any>(`${this._config.apiHostCoverages}/${this.COVERAGE_BY_PLAN}/${this.PLANS}`,
    plansSourceList)
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
