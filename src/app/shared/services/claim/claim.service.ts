/**
* ClaimService.ts
*
* @description: This class interacts with claim API.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 20-05-2019.
*
**/

import { Injectable } from '@angular/core';
import { Claim } from '../../interfaces/claim';
import { Observable, throwError } from 'rxjs';
import { ClaimDto } from './entities/claim.dto';
import { ConfigurationService } from '../configuration/configuration.service';
import { HttpClient, HttpErrorResponse, HttpParams,HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ClaimLinesDetail } from './entities/claim-line-detail.dto';
import { Utilities } from '../../util/utilities';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaimViewEobComponent } from '../../../claim/claim-view-eob/claim-view-eob.component';
import { UUID } from 'angular2-uuid';
import { ClaimByMemberDto } from './entities/claim-by-member.dto';
import { AnyFn } from '@ngrx/store/src/selector';
// import {CLAIMS} from '../../../../assets/mocks/claim/claims-mexico';

/**
 * This class interacts with claim API.
 */
@Injectable({
    providedIn: 'root'
})
export class ClaimService implements Claim {

    messages: string[] = [];
    /**
     * Constant for claims root endpoint
     */
    private CLAIMS = 'claims';

    /**
     * Constant for eob endpoint
     */
    private LINE = 'lines';

    /**
     * Constant for eob endpoint
     */
    private EOB = 'eob';

    /**
     * Constant for bundle endpoint
     */
    private BUNDLE = 'bundle';

    /**
     * Constant for provider id parameter
     */
    private PARAM_PROVIDER_ID = 'providerid';

    /**
     * Constant for state parameter
     */
    private PARAM_STATE = 'state';

    /**
     * Constant for member first name parameter
     */
    private PARAM_MEMBER_FIRST_NAME = 'memberfirstname';

    /**
     * Constant for member last name parameter
     */
    private PARAM_MEMBER_LAST_NAME = 'memberlastname';

    /**
     * Constant for service from parameter
     */
    private PARAM_SERVICE_FROM_START = 'servicefromstart';

    /**
     * Constant for service from parameter
     */
    private PARAM_SERVICE_FROM_END = 'servicefromend';

    /**
     * Constant for service to parameter
     */
    private PARAM_SERVICE_TO_START = 'servicetostart';

    /**
     * Constant for service to parameter
     */
    private PARAM_SERVICE_TO_END = 'servicetoend';

    /**
     * Constant for billed amount parameter
     */
    private PARAM_BILLED_AMOUNT = 'billedamount';

    /**
     * Constant for claim number parameter
     */
    private PARAM_CLAIM_NUMBER = 'claimnumber';

    /**
     * Constant for policy id parameter
     */
    private PARAM_POLICY_ID = 'policyid';

    /**
     * Constant for account number parameter
     */
    private PARAM_ACCOUNT_NUMBER = 'accountnumber';

    /**
     * Constant for page index parameter
     */
    private PARAM_PAGE_INDEX = 'pageindex';

    /**
     * Constant for page size parameter
     */
    private PARAM_PAGE_SIZE = 'pagesize';

    /**
     * Constant for role id parameter
     */
    private PARAM_ROLE_ID = 'roleid';

    /**
     * Constant for business id parameter
     */
    private PARAM_BUSINESS_ID = 'businessid';

    /**
     * Constant for user key parameter
     */
    private PARAM_USER_KEY = 'userkey';

    /**
     * Constant for policy legacy number parameter
     */
    private PARAM_POLICY_LEGACY = 'policylegacyid';

    /**
     * Constant for provider name parameter
     */
    private PARAM_PROVIDER_NAME = 'providername';

    /**
     * Constant for payment type parameter
     */
    private PARAM_PAYMENT_TYPE = 'paymenttype';

    /**
     * Constant for payment number parameter
     */
    private PARAM_PAYMENT_NUMBER = 'paymentnumber';

    /**
     * Constant for member id parameter
     */
    private PARAM_MEMBER_ID = 'memberid';

    /**
     * Constant for claim source parameter
     */
    private PARAM_CLAIM_SOURCE = 'source';

    private PARAM_CLAIM_LIST_LOG_ID = 'ClaimBatchId';
    /**
         * Constant for role id parameter
         */
    private PARAM_CLAIM_DETAIL_LIST = 'claimdetailidlist';

    private claimsUrl = '/assets/mocks/agent/claim.json';

    /**
     * Constructor Method
     * @param _config Configuration Service Injection
     * @param _http HttpClient Injection
     * @param modalService Modal Service Injection
     */
    constructor(
        private _config: ConfigurationService,
        private _http: HttpClient,
        
        private modalService: NgbModal
    ) {
        this.claimsUrl = _config.returnUrl + this.claimsUrl;
    }

    /**
     * This method gets claims from claim API with provider id, member name as parameter and state of claims
     * @param userKey User Key
     * @param roleId Role Id
     * @param providerId ID Provider
     * @param memberName Member Name
     * @param state State (incomplete - pending - processed)
     * @param page Page
     * @param pageSize Page size
     * @param billedAmount billedAmount
     * @param claimNumber claimNumber
     * @param policyId policyId
     * @param accountNumber accountNumber
     * @param serviceFromStart serviceFromStart
     * @param serviceFromEnd serviceFromEnd
     * @param serviceToStart serviceToStart
     * @param serviceToEnd serviceToEnd
     */

    /*inicio nuevo reporte*/

    add(message: string) {
        this.messages.push(message);
      }
    
      message: string

    public getReport(formato: string,fechaIn: Date,fechaFn:Date,name: string,id:string ){

        var monthI =fechaIn.getMonth() +1
      
        let dayI = fechaIn.getDate()
        let yearI =   fechaIn.getFullYear()
        let fechaI = monthI + '/' +dayI + '/' + yearI
        let monthF =fechaFn.getMonth() +1
        let dayF = fechaFn.getDate()
        let yearF =   fechaFn.getFullYear()
        let fechaF = monthF + '/' +dayF + '/' + yearF

        const params = new HttpParams()
        const httpOptions = { 'responseType': 'any' as 'json', params };
        
        return this._http.get<any>(`${this._config.apiHostCommon}/common/reports/claims?reportformat=${formato}&FromDate=${fechaI}&ToDate=${fechaF}&Provider=${name}&Hospital=1&IdProvider=${id}`, httpOptions)
       .pipe(catchError(this.handleError));
   
    }
    /*fin nuevo reporte*/

    public getClaimsByProviderIdAndStateAndAdvancedOptions(userKey: string, roleId: string, providerId: string,
        memberFirstName: string, memberLastName: string, state: string, page: number, pageSize: number, billedAmount: number,
        claimNumber: number, policyId: number, accountNumber: number, serviceFromStart: Date, serviceFromEnd: Date,
        serviceToStart: Date, serviceToEnd: Date
    ): Observable<ClaimDto> {

        let params = this.AddParamsToClaimRequest(state, page, pageSize, userKey, roleId);
        params = this.AddOptionalParamsToProviderClaimRequest(params, providerId, memberFirstName, memberLastName, serviceFromStart,
            serviceFromEnd, serviceToStart, serviceToEnd, billedAmount, claimNumber, policyId, accountNumber);

        return this._http.get<ClaimDto>(`${this._config.apiHostClaims}/${this.CLAIMS}`, { params })
            .pipe(catchError(this.handleError));
    }

    /**
     * This method gets claims from claim API with role id agent and state of claims
     * @param userKey userKey
     * @param roleId roleId
     * @param state state
     * @param memberId memberId
     */
    public getClaimsByMemberId(userKey: string, roleId: string, state: string, memberId: string
    ): Observable<ClaimByMemberDto> {

        const params = this.AddParamsToAllClaimRequest(state, userKey, roleId, memberId);

        return this._http.get<ClaimByMemberDto>(`${this._config.apiHostClaims}/${this.CLAIMS}`, { params })
            .pipe(catchError(this.handleError));
        /*return this._http.get<ClaimDto>(this.claimsUrl)
            .pipe(catchError(this.handleError));*/
    }

    /**
     * This method gets claims from claim API with role id agent and state of claims
     * @param userKey userKey
     * @param roleId roleId
     * @param state state
     * @param pageSize pageSize
     * @param page page
     * @param memberLastName memberLastName
     * @param policyId policyId
     * @param policyLegacyId policyLegacyId
     * @param providerName providerName
     * @param paymentType paymentType
     * @param paymentNumber paymentNumber
     * @param claimNumber claimNumber
     * @param claimSource claimSource All = 0, BupaMex = 1, BupaBGLA = 2
     */
    public getClaimsByAgentRoleAndStateAndAdvancedOptions(userKey: string, roleId: string, state: string, pageSize: number,
        page: number, memberLastName: string, policyId: number, policyLegacyId: number, providerName: string, paymentType: string,
        paymentNumber: string, claimNumber: number, claimSource?: number, claimsListLogId?: number
    ): Observable<ClaimDto> {

        let params = this.AddParamsToClaimRequest(state, page, pageSize, userKey, roleId);
        params = this.AddOptionalParamsToAgentClaimRequest(params, memberLastName, policyId, policyLegacyId,
            providerName, paymentType, paymentNumber, claimNumber, claimSource, claimsListLogId);

        return this._http.get<ClaimDto>(`${this._config.apiHostClaims}/${this.CLAIMS}`, { params })
            .pipe(catchError(this.handleError));
        /*return this._http.get<ClaimDto>(this.claimsUrl)
            .pipe(catchError(this.handleError));*/
    }

    /**
     * Get detail for each claim
     * @param claimDetail Claim Detail ID
     */
    public getDetailsForClaim(claimDetail: number, claimSource?: number ): Observable<ClaimLinesDetail[]> {
        return this._http.get<ClaimLinesDetail[]>(`${this._config.apiHostClaims}/${this.CLAIMS}/${claimDetail}/${this.LINE}/${claimSource}`)
            .pipe(map(p => (p as any).claimLinesDetails))
            .pipe(catchError(this.handleError));
        /*return this._http.get<ClaimLinesDetail[]>(this.claimsDetailUrl)
            .pipe(map(p => (p as any).claimLinesDetails))
            .pipe(catchError(this.handleError));*/

    }

    /**
     * Get explanation of benefits document.
     * @param claimDetail Claim Detail ID
     * @param roleId User Role ID
     * @param businessId Business ID
     */
    public getEobForClaim(claimDetail: number, roleId: string, businessId: string): Observable<ArrayBuffer> {
        const params = this.AddParamsToEobRequest(roleId, businessId);
        const httpOptions = { 'responseType': 'arraybuffer' as 'json', params };
        return this._http.get<ArrayBuffer>(`${this._config.apiHostClaims}/${this.CLAIMS}/${claimDetail}/${this.EOB}`, httpOptions)
            .pipe(catchError(this.handleError));
    }

    /**
     * Get bundle explanation of benefits document.
     * @param claimDetails Claim Details list
     * @param roleId User Role ID
     * @param businessId Business ID
     */
    public getEobBundleForClaim(claimDetails: string, roleId: string, businessId: string): Observable<ArrayBuffer> {
        const params = this.AddParamsToEobBundleRequest(claimDetails, roleId, businessId);
        const httpOptions = { 'responseType': 'arraybuffer' as 'json', params };
        return this._http.get<ArrayBuffer>(`${this._config.apiHostClaims}/${this.CLAIMS}/${this.BUNDLE}`, httpOptions)
            .pipe(catchError(this.handleError));
    }

    /**
     * Add URL parameters for request claim
     * @param state State
     * @param page Page
     * @param pageSize Page Size
     */
    private AddParamsToClaimRequest(state: string, page: number, pageSize: number, userKey: string, roleId: string): HttpParams {

        return new HttpParams()
            .set(this.PARAM_STATE, state)
            .set(this.PARAM_USER_KEY, userKey)
            .set(this.PARAM_ROLE_ID, roleId)
            .set(this.PARAM_PAGE_INDEX, page.toString())
            .set(this.PARAM_PAGE_SIZE, pageSize.toString());
    }

    /**
 * Add URL parameters for request claim
 * @param state State
 * @param page Page
 * @param pageSize Page Size
 * @param memberId memberId
 */
    private AddParamsToAllClaimRequest(state: string, userKey: string, roleId: string, memberId: string): HttpParams {

        let httpParams = new HttpParams();
        httpParams = httpParams.set(this.PARAM_STATE, state);
        httpParams = httpParams.set(this.PARAM_USER_KEY, userKey);
        httpParams = httpParams.set(this.PARAM_ROLE_ID, roleId);
        httpParams = httpParams.set(this.PARAM_MEMBER_ID, memberId);
        if (roleId === '3' || roleId === '6') {
            httpParams = httpParams.set('policyid', userKey);
        } else {
            httpParams = httpParams.set('agentid', userKey);
        }
        return httpParams;

    }

    /**
     * Add URL parameters for provider request claim with advanced options
     * @param params HttpParams
     * @param providerId Provider ID
     * @param memberFirstName memberFirstName
     * @param memberLastName memberLastName
     * @param billedAmount billedAmount
     * @param claimNumber claimNumber
     * @param policyId policyId
     * @param accountNumber accountNumber
     */
    private AddOptionalParamsToProviderClaimRequest(params: HttpParams, providerId: string, memberFirstName: string, memberLastName: string,
        serviceFromStart: Date, serviceFromEnd: Date, serviceToStart: Date, serviceToEnd: Date, billedAmount: number, claimNumber: number,
        policyId: number, accountNumber: number): HttpParams {

        if (providerId) {
            if (!params.has(this.PARAM_PROVIDER_ID)) {
                params = params.set(this.PARAM_PROVIDER_ID, providerId);
            }
        }

        if (memberFirstName) {
            if (!params.has(this.PARAM_MEMBER_FIRST_NAME)) {
                params = params.set(this.PARAM_MEMBER_FIRST_NAME, memberFirstName);
            }
        }

        if (memberLastName) {
            if (!params.has(this.PARAM_MEMBER_LAST_NAME)) {
                params = params.set(this.PARAM_MEMBER_LAST_NAME, memberLastName);
            }
        }

        if (serviceFromStart) {
            if (!params.has(this.PARAM_SERVICE_FROM_START)) {
                params = params.set(this.PARAM_SERVICE_FROM_START, Utilities.convertDateToString(serviceFromStart));
            }
        }

        if (serviceFromEnd) {
            if (!params.has(this.PARAM_SERVICE_FROM_END)) {
                params = params.set(this.PARAM_SERVICE_FROM_END, Utilities.convertDateToString(serviceFromEnd));
            }
        }

        if (serviceToStart) {
            if (!params.has(this.PARAM_SERVICE_TO_START)) {
                params = params.set(this.PARAM_SERVICE_TO_START, Utilities.convertDateToString(serviceToStart));
            }
        }

        if (serviceToEnd) {
            if (!params.has(this.PARAM_SERVICE_TO_END)) {
                params = params.set(this.PARAM_SERVICE_TO_END, Utilities.convertDateToString(serviceToEnd));
            }
        }

        if (billedAmount) {
            if (!params.has(this.PARAM_BILLED_AMOUNT)) {
                params = params.set(this.PARAM_BILLED_AMOUNT, billedAmount.toString());
            }
        }

        if (claimNumber) {
            if (!params.has(this.PARAM_CLAIM_NUMBER)) {
                params = params.set(this.PARAM_CLAIM_NUMBER, claimNumber.toString());
            }
        }

        if (policyId) {
            if (!params.has(this.PARAM_POLICY_ID)) {
                params = params.set(this.PARAM_POLICY_ID, policyId.toString());
            }
        }

        if (accountNumber) {
            if (!params.has(this.PARAM_ACCOUNT_NUMBER)) {
                params = params.set(this.PARAM_ACCOUNT_NUMBER, accountNumber.toString());
            }
        }

        return params;
    }

    /**
     * Add URL parameters for agent request claim with advanced options
     * @param params HttpParams
     * @param userKey userKey
     * @param roleId roleId
     * @param memberLastName memberLastName
     * @param policyId policyId
     * @param policyLegacy policyLegacy
     * @param providerName providerName
     * @param paymentType paymentType
     * @param paymentNumber paymentNumber
     * @param claimNumber claimNumber
     * @param claimSource claimSource All = 0, BupaMex = 1, BupaBGLA = 2
     * @param claimsListLogId claimsListLogId
     */
    private AddOptionalParamsToAgentClaimRequest(params: HttpParams, memberLastName: string,
        policyId: number, policyLegacy: number, providerName: string, paymentType: string, paymentNumber: string,
        claimNumber: number, claimSource?: number, claimsListLogId?: number): HttpParams {

        if (memberLastName) {
            if (!params.has(this.PARAM_MEMBER_LAST_NAME)) {
                params = params.set(this.PARAM_MEMBER_LAST_NAME, memberLastName);
            }
        }

        if (policyId) {
            if (!params.has(this.PARAM_POLICY_ID)) {
                params = params.set(this.PARAM_POLICY_ID, policyId.toString());
            }
        }

        if (policyLegacy) {
            if (!params.has(this.PARAM_POLICY_LEGACY)) {
                params = params.set(this.PARAM_POLICY_LEGACY, policyLegacy.toString());
            }
        }

        if (providerName) {
            if (!params.has(this.PARAM_PROVIDER_NAME)) {
                params = params.set(this.PARAM_PROVIDER_NAME, providerName);
            }
        }

        if (paymentType && paymentType !== 'select') {
            if (!params.has(this.PARAM_PAYMENT_TYPE)) {
                params = params.set(this.PARAM_PAYMENT_TYPE, paymentType);
            }
        }

        if (paymentNumber) {
            if (!params.has(this.PARAM_PAYMENT_NUMBER)) {
                params = params.set(this.PARAM_PAYMENT_NUMBER, paymentNumber);
            }
        }

        if (claimNumber) {
            if (!params.has(this.PARAM_CLAIM_NUMBER)) {
                params = params.set(this.PARAM_CLAIM_NUMBER, claimNumber.toString());
            }
        }

        if (claimSource != null) {
          if (!params.has(this.PARAM_CLAIM_SOURCE)) {
              params = params.set(this.PARAM_CLAIM_SOURCE, claimSource.toString());
          }
      }

      if (claimsListLogId) {
        if (!params.has(this.PARAM_CLAIM_LIST_LOG_ID)) {
            params = params.set(this.PARAM_CLAIM_LIST_LOG_ID, claimsListLogId.toString());
        }
    }

        return params;
    }

    /**
     * Add params to eob request
     * @param roleId Role Id
     * @param businessId Business Id
     */
    private AddParamsToEobRequest(roleId: string, businessId): HttpParams {
        return new HttpParams()
            .set(this.PARAM_ROLE_ID, roleId)
            .set(this.PARAM_BUSINESS_ID, businessId);
    }

    /**
     * Add params to eob request
     * @param claimDetailList claim Detail List
     * @param roleId Role Id
     * @param businessId Business Id
     */
    private AddParamsToEobBundleRequest(claimDetailList: string, roleId: string, businessId: string): HttpParams {
        return new HttpParams()
            .set(this.PARAM_CLAIM_DETAIL_LIST, claimDetailList)
            .set(this.PARAM_ROLE_ID, roleId)
            .set(this.PARAM_BUSINESS_ID, businessId);
    }

    /**
     * Show modal dialog for EOB document
     * @param content Html content?
     */
    async showClaimEobDialog(fileUrl) {
        await Utilities.delay(1000);
        const result = this.modalService.open(ClaimViewEobComponent,
            { windowClass: 'ig-modal-xl', centered: true, backdrop: 'static', keyboard: false });
        const dialog = result.componentInstance;
        dialog.title = 'EOB TITLE';
        dialog.setFilePath(fileUrl);
        dialog.acceptText = 'APP.BUTTON.CLOSE_BTN';
        dialog.declineText = '';
        dialog.idContent = UUID.UUID();
    }

    /**
     * Build default claim response
     */
    public buildDefaultClaimResponse(): ClaimDto {
        return {
            pageIndex: 0,
            pageSize: 0,
            count: 0,
            data: []
        };
    }

    /**
     * Build default claim response
     */
    public buildDefaultClaimByMemberResponse(): ClaimByMemberDto {
        return {
            pageIndex: 0,
            pageSize: 0,
            totalCount: 0,
            list: []
        };
    }

    /**
     * Handle error
     * @param error HttpErrorResponse
     */
    private handleError(error: HttpErrorResponse) {
        return throwError(error);
    }

}
