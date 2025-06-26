/**
* claim-submission.service.ts
*
* @description: This class allow create a claim submission.
* @author Yefry Lopez.
* @version 1.0
* @date 09-10-2018.
*
**/


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { ClaimSubmissionRequest } from './entities/ClaimSubmissionRequest';
import { ClaimSubmissionModel } from './entities/ClaimSubmissionModel';
import { Observable, throwError } from 'rxjs';
import { ClaimSubmissionResponse } from './entities/ClaimSubmissionResponse';
import { IgnoreInterceptorTypeNames } from '../../classes/ignoreInterceptorType.enum';
import { catchError } from 'rxjs/operators';

/**
 * This class allow create a claim submission.
 */
@Injectable({
  providedIn: 'root'
})
export class ClaimSubmissionService {

  /**
   * Constant for claim submission root endpoint
   */
  private CLAIMSUBMISSION = 'claimsubmissions';

  /**
   * [HttpPost] Constant for claim submission create endpoint
   */
  private CREATE = 'create';

  /**
   * [HttpPost] Constant for claims submission validate endpoint
   */
  private VALIDATE = 'validate';



  /**
   * Constructor Method
   * @param http HttpClient Injection
   * @param config Configuration Service Injection
   */
  constructor(
    private http: HttpClient,
    private config: ConfigurationService
  ) { }



  /**
   * This function allow submit a new claim.
   * @param request  Claim Submission Request.
   */
  submit(claim: ClaimSubmissionModel, validateduplicate: boolean, lang: string) {

    const headers = new HttpHeaders()
      .set(IgnoreInterceptorTypeNames.ERROR_400, IgnoreInterceptorTypeNames.ERROR_400);

    const params = new HttpParams()
      .set('validateduplicate', validateduplicate.toString())
      .set('lang', lang);

    return this.http.post(`${this.config.apiHostClaimSubmission}/${this.CLAIMSUBMISSION}`,
      claim, { headers: headers, params })
      .pipe(catchError(this.handleError));
  }

   /**
   * This function allow submit a new claim.
   * @param request  Claim Submission Request.
   */
   submitList(claim: any, validateduplicate: boolean, lang: string) {

    const headers = new HttpHeaders()
      .set(IgnoreInterceptorTypeNames.ERROR_400, IgnoreInterceptorTypeNames.ERROR_400);

    const params = new HttpParams()
      .set('validateduplicate', validateduplicate.toString())
      .set('lang', lang);

    return this.http.post(`${this.config.apiHostClaimSubmission}/${this.CLAIMSUBMISSION}/submitClaimsList`,
      claim, { headers: headers, params })
      .pipe(catchError(this.handleError));
  }

  /**
   * This function allow submit a new claim.
   * @param request  Claim Submission Request.
   */
  update(claim: ClaimSubmissionModel, lang: string) {

    const headers = new HttpHeaders()
      .set(IgnoreInterceptorTypeNames.ERROR_400, IgnoreInterceptorTypeNames.ERROR_400);

    const params = new HttpParams()
      .set('lang', lang);

    return this.http.patch(`${this.config.apiHostClaimSubmission}/${this.CLAIMSUBMISSION}`,
      claim, { headers: headers, params })
      .pipe(catchError(this.handleError));
  }

  /**
   * This function allow submit a new claim.
   * @param request  Claim Submission Request.
   */
  getClaimSubmissionByHeaderId(headerId): Observable<ClaimSubmissionResponse> {

    const params = new HttpParams()
      .set('claimheaderid', headerId)
      .set('sort', 'desc')
      .set('pageindex', '1')
      .set('pagesize', '1');

    return this.http.get<ClaimSubmissionResponse>(`${this.config.apiHostClaimSubmission}/${this.CLAIMSUBMISSION}`,
      { params })
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
