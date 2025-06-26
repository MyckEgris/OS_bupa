import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { PolicyApplicationResponse } from './entities/policy-application-response.dto';
import { map, catchError } from 'rxjs/operators';
import { PolicyApplicationModel } from './entities/policy-application-model';
import { CachingService } from '../caching/caching-service';
import { ResponsePolicyApp } from './entities/response-policy-app';
import { PolicyApplicationWizard } from 'src/app/policy/policy-application/policy-application-wizard/entities/policy-application-wizard';
import { PolicyOnlineRequestOuput } from 'src/app/shared/services/policy/entities/policyOnlineRequestOutput.dto';
import { ConstansParamsPolicyApplication } from './constants/constant-params-policy-application';
import { Router } from '@angular/router';
import { InsuranceBusiness } from '../../classes/insuranceBusiness.enum';
import { RuleByBusiness } from '../common/entities/rule-by-business';




@Injectable({
  providedIn: 'root'
})
export class PolicyApplicationService {

  /**
   * [HttpGet] Constant for applications endpoint
   */
  private APPLICATIONS = 'applications';

  /**
   * [HttpGet] Constant for documents endpoint
   */
  private DOCUMENTS = 'documents';

  /**
   * Constant for Role Id parameter
   */
  private ROLE_ID = 'roleid';

  /**
   * Constant for User Key parameter
   */
  private USER_KEY = 'userkey';

  /**
   * Constant for first name parameter
   */
  private FIRST_NAME = 'firstname';

  /**
   * Constant exclude detail search.
   */
  private EXCLUDE_DETAIL = 'excludedetail';

  /**
   * Constant for last name parameter
   */
  private LAST_NAME = 'lastname';

  /**
   * Constant for page index parameter
   */
  private PARAM_PAGE_INDEX = 'pageindex';

  /**
   * Constant for page size parameter
   */
  private PARAM_PAGE_SIZE = 'pagesize';

  /**
   * Constant for policyId parameter
   */
  private POLICY_ID = 'policyid';

  /**
   * PolicyApplicationWizard Object
   */
  private policyApplication: PolicyApplicationWizard;

  /**
   * PolicyApplicationWizard Subject
   */
  private policyApplicationSubject: Subject<PolicyApplicationWizard>;

  /**
   * Constant for default datetime value
   */
  private DEFAULT_DATE_TIME = new Date().toDateString();

  /**
   * Constant for initial value in any parameter for zero value
   */
  private INITIAL_VALUE_ZERO = 0;

  private policyAppUrl = '/assets/mocks/policies-application/application.json';

  private policiesAppUrl = '/assets/mocks/policies-application/applications.json';

  private PRE_VALIDATIONS = 'prevalidations';

  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService,
    private _cachingService: CachingService,
    private router: Router
  ) {
    this.policyApplicationSubject = new Subject<PolicyApplicationWizard>();
  }


  /**
   * Gets all policy application filtered by policy application number.
   * @param policyAppNumber Policy Application Number.
   */
  getPolicyAppByPolicyAppNumber(roleId: string, userKey: string, policyAppNumber: number, excludeDetail?: boolean)
    : Observable<PolicyApplicationResponse> {

    let params = null;
    if (excludeDetail) {
      params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey)
      .set(this.EXCLUDE_DETAIL, String(excludeDetail));
    } else {
      params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey);
    }
    return this._http.get<ResponsePolicyApp>(
      `${this._config.apiHostPolicyApplication}/${this.APPLICATIONS}/${policyAppNumber}`, { params: params })
      .pipe(map(data => {
        const policyAppDto = (data as ResponsePolicyApp);
        const result = this.createNewPolicyAppResponse();
        result.policyApplications.push(policyAppDto.policyApplication);
        return result;
      }));
  }

  /**
   * Gets all policy application filtered by policy number.
   * @param policyId Policy Id.
   * @param roleId Role Id.
   * @param userKey User Key.
   */
  getAllPolicyApplicationByFilter(roleId: string, userKey: string, policyId: number,
    firstName: string, lastName: string, pageIndex: number, pageSize: number):
    Observable<PolicyApplicationResponse> {

    let params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey)
      .set(this.PARAM_PAGE_INDEX, pageIndex.toString())
      .set(this.PARAM_PAGE_SIZE, pageSize.toString());

    params = this.addOptionalParams(params, policyId, firstName, lastName);

    return this._http.get<PolicyApplicationResponse>(
      `${this._config.apiHostPolicyApplication}/${this.APPLICATIONS}`, { params: params })

      .pipe(map(data => {
        const policyAppDto = (data as PolicyApplicationResponse);
        return policyAppDto;
      }));
  }

  /**
   * Add URL parameters for provider request policyApp with advanced options
   * @param params params
   * @param policyId policyId
   * @param firstName Owner
   * @param lastName Owner
   */
  addOptionalParams(params: HttpParams, policyId: number,
    firstName: string, lastName: string): HttpParams {
    if (policyId) {
      params = params.set(this.POLICY_ID, policyId.toString());
    } if (firstName) {
      params = params.set(this.FIRST_NAME, firstName);
    } if (lastName) {
      params = params.set(this.LAST_NAME, lastName);
    }
    return params;
  }

  /**
   * Create new PolicyAppResponse
   */
  createNewPolicyAppResponse() {
    const response: PolicyApplicationResponse = {
      totalCount: 1,
      pageSize: 1,
      pageindex: 1,
      policyApplications: []
    };
    return response;
  }

  /**
   * This function allow submit a new claim.
   * @param policyApplication Policy Application Model.
   */
  createPolicyApplication(policyApplication: PolicyApplicationModel) {
    const params = new HttpParams().set('submit', 'true');
    const request = { 'policyApplication': policyApplication };
    return this._http.post<PolicyOnlineRequestOuput>(`${this._config.apiHostPolicyApplication}/${this.APPLICATIONS}?submit=true`, request)
      .pipe(
        map(data => {
          return data.policyApplication;
        })
      );
  }


  /**
   * This function allow submit a new claim.
   * @param policyApplication Policy Application Model.
   */
  createPolicyEnrollment(policyApplication: PolicyApplicationModel) {
    const params = new HttpParams().set('submit', 'false');
    const request = { 'policyApplication': policyApplication };
    return this._http.post<PolicyOnlineRequestOuput>(`${this._config.apiHostPolicyApplication}/${this.APPLICATIONS}?submit=false`, request)
      .pipe(
        map(data => {
          return data.policyApplication;
        })
      );
  }

  /**
   * This function allow to generate the policy application PDF.
   * @param policyApplication Policy Application Model.
   */
  generatePolicyApplicationPdf(applicationGuid: string, applicationId: number, status: string, lang?: string, isWaterMark?: string) {
    const params = new HttpParams()
      .set(ConstansParamsPolicyApplication.APP_GUID, applicationGuid)
      .set(ConstansParamsPolicyApplication.STATUS, status)
      .set(ConstansParamsPolicyApplication.GENERATE_APP, 'true')
      .set(ConstansParamsPolicyApplication.LANGUAGE_WATERMARK, lang)
      .set(ConstansParamsPolicyApplication.WATERMARK, isWaterMark);

    // tslint:disable-next-line: max-line-length
    return this._http.get<Blob>(`${this._config.apiHostPolicyApplication}/${this.APPLICATIONS}/${applicationId}/${this.DOCUMENTS}`,
      { params: params, responseType: 'blob' as 'json' })
      .pipe(catchError(this.handleError));
  }

  /**
   * Routes New Busness Quotes' process to Policy application process.
   * @param bupaInsuranceCode Bupa Insurance identifier.
   * @param applicationId Policy Application identifier.
   */
  routeToPolicyApplicationForm(bupaInsuranceCode, applicationId) {
    localStorage.setItem('applicationId', applicationId);
    localStorage.removeItem('mode');
    localStorage.setItem('mode', 'Edit');
    this.router.navigate([`policies/create-policy-enrollment-${bupaInsuranceCode}`]);
  }

  /**
   * Error handler.
   * @param error HttpErrorResponse.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  /**
   * Get rules by business
   * @param businessId businessId
   * @param process process
   */
  getRulesByApplicationId(applicationId: number): Observable<RuleByBusiness[]> {
    return this._cachingService
      .getCached<RuleByBusiness[]>(`${this._config.apiHostPolicyApplication}/${this.APPLICATIONS}/${applicationId}/rules`)
      .pipe(map(p => (p as any).policyApplicationRules))
      .pipe(catchError(this.handleError));
  }

    /**
   * This function allow submit a new claim.
   * @param policyApplication Policy Application Model.
   */
  preValidatePolicyEnrollment(applicationId: number) {
    return this._http
      // tslint:disable-next-line: max-line-length
      .get<PolicyOnlineRequestOuput>(`${this._config.apiHostPolicyApplication}/${this.APPLICATIONS}/${applicationId}/${this.PRE_VALIDATIONS}`)
      .pipe(
        map(data => {
          return data.policyApplication;
        })
      );
  }
}


