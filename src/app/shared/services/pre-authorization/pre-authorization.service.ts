/**
* PreAuthorizationService.ts
*
* @description: Interacts with pre authorization API
* @author Jose Daniel Hernández
* @version 1.0
* @date 08-06-2019.
*
**/

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigurationService } from '../configuration/configuration.service';
import { ViewPreAuthorizationInputDto } from './entities/view-pre-authorization-input.dto';
import { ClaimDto } from '../claim/entities/claim.dto';

/**
 * Interacts with pre authorization API
 */
@Injectable({
    providedIn: 'root'
})


export class PreAuthorizationService {


    /**
     * Constant to define root notification endpoint
     */
    private PREAUTHORIZATION = 'preauthorizations';

    /**
     * Constant for page index parameter
     */
    private PARAM_PAGE_INDEX = 'pageindex';

    /**
     * Constant for page size parameter
     */
    private PARAM_PAGE_SIZE = 'pagesize';

    /**
     * Constant for policy id parameter
     */
    private PARAM_POLICY_ID = 'policyid';

    /**
     * Constant for reference number parameter
     */
    private PARAM_REF_NUM = 'referencenumber';

    /**
     * Constant for tracking number parameter
     */
    private PARAM_TRACK_NUM = 'trackingnumber';

    /**
     * Constant for member first name parameter
     */
    private PARAM_MEMB_FIRST_NAME = 'memberfirstname';

    /**
     * Constant for member last name parameter
     */
    private PARAM_MEMB_LAST_NAME = 'memberlastname';

    /**
     * Constant for request start date parameter
     */
    private PARAM_REQ_START_DATE = 'requeststartdate';

    /**
     * Constant for request end date parameter
     */
    private PARAM_REQ_END_DATE = 'requestenddate';

    /**
     * Constant for service country parameter
     */
    private PARAM_SERV_COUNT = 'servicecountry';

    /**
     * Constant for provider id parameter
     */
    private PARAM_PROV_ID = 'providerid';


    private preAuthUrl = '/assets/mocks/claim/preAuthView.json';



    /**
    * Contructor Method
    * @param _http HttpClient Injection
    * @param _config Configuration Service Injection
    */
    constructor(private _http: HttpClient, private _config: ConfigurationService) { }



    /**
    * Get Pre Authorizations for view
    * @param pageIndex Page Index
    * @param pageSize Page Size
    * @param policyId Page Size
    * @param referenceNumber Policy Id
    * @param trackingNumber Tracking Number
    * @param memberFirstName Member First Name
    * @param memberLastName Member Last Name
    * @param requestStartDate Request Start Date
    * @param requestEndDate Request End Date
    * @param serviceCountry Service Country
    * @param providerId Provider Id
    */
    public getViewPreAuthorizations(
        pageIndex: string, pageSize: string,
        policyId: string, referenceNumber: string,
        trackingNumber: string, memberFirstName: string,
        memberLastName: string,  requestStartDate: string,
        requestEndDate: string, serviceCountry: string,
        providerId: string): Observable<ViewPreAuthorizationInputDto> {
        const params = this.AddParamsToPreAuthorizationRequest(
            pageIndex, pageSize,
            policyId, referenceNumber,
            trackingNumber, memberFirstName,
            memberLastName,  requestStartDate,
            requestEndDate, serviceCountry,
            providerId );
        return this._http.get<ViewPreAuthorizationInputDto>(`${this._config.apiHostPreAuthorization}/${this.PREAUTHORIZATION}`, {params})
        .pipe(catchError(this.handleError));

        /*return this._http.get<ViewPreAuthorizationInputDto>(this.preAuthUrl)
            .pipe(catchError(this.handleError));*/

    }


    /**
     * Add URL parameters for Pre Authorizations request
     * @param pageIndex Page Index
     * @param pageSize Page Size
     * @param policyId Page Size
     * @param referenceNumber Policy Id
     * @param trackingNumber Tracking Number
     * @param memberFirstName Member First Name
     * @param memberLastName Member Last Name
     * @param requestStartDate Request Start Date
     * @param requestEndDate Request End Date
     * @param serviceCountry Service Country
     * @param providerId Provider Id
     */
    private AddParamsToPreAuthorizationRequest(
        pageIndex: string, pageSize: string,
        policyId: string, referenceNumber: string,
        trackingNumber: string, memberFirstName: string,
        memberLastName: string,  requestStartDate: string,
        requestEndDate: string, serviceCountry: string,
        providerId: string ): HttpParams {

            switch (this.validateAllNull( policyId, referenceNumber,
                                        trackingNumber, memberFirstName,
                                        memberLastName,  requestStartDate,
                                        requestEndDate, serviceCountry,
                                        providerId)) {

                // se manda solamente pageIndex y pageSize cuando los otros son null.
                case 1:
                return new HttpParams()
                .set(this.PARAM_PAGE_INDEX, pageIndex)
                .set(this.PARAM_PAGE_SIZE, pageSize);

                // se mandan todos los parametros.
                case 2:
                return new HttpParams()
                .set(this.PARAM_PAGE_INDEX, pageIndex)
                .set(this.PARAM_PAGE_SIZE, pageSize)
                .set(this.PARAM_POLICY_ID, policyId)
                .set(this.PARAM_REF_NUM, referenceNumber)
                .set(this.PARAM_TRACK_NUM, trackingNumber)
                .set(this.PARAM_MEMB_FIRST_NAME, memberFirstName)
                .set(this.PARAM_MEMB_LAST_NAME, memberLastName)
                .set(this.PARAM_REQ_START_DATE, requestStartDate)
                .set(this.PARAM_REQ_END_DATE, requestEndDate)
                .set(this.PARAM_SERV_COUNT, serviceCountry)
                .set(this.PARAM_PROV_ID, providerId);

                default:
                break;
            }
    }


    /**
     * Validate null parameters for Pre Authorizations request
     * @param policyId Page Size
     * @param referenceNumber Policy Id
     * @param trackingNumber Tracking Number
     * @param memberFirstName Member First Name
     * @param memberLastName Member Last Name
     * @param requestStartDate Request Start Date
     * @param requestEndDate Request End Date
     * @param serviceCountry Service Country
     * @param providerId Provider Id
     */
    private validateAllNull(
        policyId: string, referenceNumber: string,
        trackingNumber: string, memberFirstName: string,
        memberLastName: string,  requestStartDate: string,
        requestEndDate: string, serviceCountry: string,
        providerId: string) {

        if ( !policyId && !referenceNumber &&
            !trackingNumber && !memberFirstName &&
            !memberLastName &&  !requestStartDate &&
            !requestEndDate && !serviceCountry &&
            !providerId ) {
            return 1; } else { return 2; }
    }


    /**
    * handle error
    * @param error Error: HttpErrorResponse
    */
    private handleError(error: HttpErrorResponse) {
        return throwError(error);
    }

}
