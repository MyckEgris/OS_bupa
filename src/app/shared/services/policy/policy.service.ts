/**
* PolicyService.ts
*
* @description: This class gets members information from policy API.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Injectable } from '@angular/core';
import { MemberInputDto } from './entities/member.dto';
import { MemberOutputDto } from './entities/member';
import { Observable, throwError, of } from 'rxjs';
import 'rxjs/add/observable/of';
import { ConfigurationService } from '../configuration/configuration.service';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { RerferenceNumberResponse } from './entities/rerferenceNumberResponse';
import { ClaimSubmissionMember } from '../claim-submission/entities/ClaimSubmissionMember';
import { UserInformationModel } from '../../../security/model/user-information.model';
import { Policy } from '../../interfaces/policy';
import { PolicyResponse } from './entities/policy-response.dto';
import { PaymentDto } from './entities/payment.dto';
import { PolicyDto } from './entities/policy.dto';
import { PolicyLogDto } from './entities/policyLog.dto';
import { CachingService } from '../caching/caching-service';
import { ConstansParamPolicies } from './constants/constant-param-policies';
import { Utilities } from '../../util/utilities';
import { UpdatePolicyRequestDto } from './entities/updatePolicyRequest.dto';
import { BenefitsInputDto } from './entities/benefits-input.dto';
import { IgnoreInterceptorTypeNames } from '../../classes/ignoreInterceptorType.enum';
import { PolicyAutoDeductionResponseDto } from './entities/policyAutoDeductionResponse.dto';
import { PolicyAutoDeductionRequestDto } from './entities/policyAutoDeductionRequest.dto';
import { SearchMemberTypeConstants } from './constants/policy-search-member-type-constants';
import { Rol } from '../../classes/rol.enum';
import { PolicyCountry } from '../../classes/policyCountry.enum';
import { InsuranceBusiness } from '../../classes/insuranceBusiness.enum';
import { Instance } from './entities/Instance';
import { TaxCertificateDataResponse } from './entities/TaxCertificateDataResponse';
import { TaxResponse } from './entities/TaxResponse';


/**
 * This class gets members information from policy API.
 */
@Injectable({
  providedIn: 'root'
})
export class PolicyService implements Policy {

  private PAYMENTS = 'payments';

  /**
   * [HttpGet] Constant for policies endpoint
   */
  private POLICIES = 'policies';

  /**
   * [HttpGet] Constant for policies endpoint
   */
  private NOTIFICATIONS = 'notifications';

  /**
   * [HttpGet] Constant for policies endpoint
   */
  private POLICYLOG = 'policylog';

  /**
   * Constant for policyDetail endpoint parameter
   */
  private POLICY_DETAIL = 'policyDetail';

  /**
   * [HttpGet] Constant for members endpoint
   */
  private MEMBERS = 'members';

  /**
  * [HttpGet] Constant for eligibilities endpoint
  */
  private ELIGIBILITIES = 'eligibilities';

  /**
  * [HttpGet] Constant for benefits endpoint
  */
  private BENEFITS = 'benefits';

  /**
  * [HttpGet] Constant for benefits endpoint
  */
   private RIDERS = 'riders';

  /**
   * [HttpGet] Constant for policy's cards endpoint
   */
  private CARDS = 'cards';

  /**
   * [HttpGet] Constant for policy's cards endpoint
   */
  private DOCUMENTS = 'documents';

  /**
   * Constant for Reference Number endpoint parameter
   */
  private REFERENCE_NUMBER = 'referencenumber';

  /**
   * Constant for Date of Birth parameter
   */
  private DOB = 'dob';

  /**
   * Constant for is eligible parameter
   */
  private IS_ELIGIBLE = 'iseligible';

  /**
   * Constant for Role Id parameter
   */
  private ROLE_ID = 'roleid';

  /**
   * Constant for Policy Id parameter
   */
  private POLICY_ID = 'policyId';

  /**
   * Constant for Policy Id parameter
   */
  private POLICY_MODE = 'policyMode';

  /**
   * Constant for User Id parameter
   */
  private USER_ID = 'userid';

  /**
   * Constant for User Key parameter
   */
  private USER_KEY = 'userkey';

  /**
   * Constant for true value
   */
  private IS_ELIGIBLE_TRUE_VALUE = 'true';

  /**
   * Constant for first name parameter
   */
  private FIRST_NAME = 'firstname';

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
   * Constant for state parameter
   */
  private PARAM_PENDING_TO_PAY = 'paymentPendingTopay';

  /**
   * Constant for member first name parameter
   */
  private PARAM_MEMBER_FIRST_NAME = 'memberfirstname';

  /**
   * Constant for member last name parameter
   */
  private PARAM_MEMBER_LAST_NAME = 'memberlastname';

  /**
   * Constant for member last name parameter
   */
  private PARAM_POLICY_CARDS = 'cardType';

  /**
   * Constant parameter agentid
   */
  private PARAM_AGENT_ID = 'agentid';

  /**
   * Constant parameter renewaldatefrom
   */
  private PARAM_RENEWAL_FROM = 'renewaldatefrom';

  /**
   * Constant parameter renewaldateto
   */
  private PARAM_RENEWAL_TO = 'renewaldateto';

  /**
   * Constant parameter isdependentcoverage
   */
  private PARAM_IS_DEPENDENT = 'isdependentcoverage';

  /**
   * Constant parameter birthdatemonth
   */
  private PARAM_BIRTH_DATE = 'birthdatemonth';

  /**
   * Saves a new Policy Dto with its payments.
   */
  private policyWithPaymentsFiltered: PolicyDto[] = [];

  /**
  * Constant for transaction endpoint
  */
  private POLICIES_AUTODEDUCTION = 'policies/autodeduction/getPolicyActiveAutoDeduction';

  private POLICIES_AUTODEDUCTION_CHANGE_STATE = 'policies/autodeduction';

  /**
   * Constant for Reference GetCFDI endpoint parameter
   */
  private GET_CFDI = 'GetCFDIAndRegimes';

  /**
   * Constant for the endpoint that obtains the tax data through the constancy
   */
  private READ_PDF = 'ProcessPDF';

  /**
   * Constant for the endpoint that update tax data
   */
  private UPDATE_DATA = 'updateTaxData';

  /**
   * Constant for the endpoint that move PDF to Docuphase
   */
  private SAVE_PDF = 'MovePDFToDocuphase';

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



  private policiesUrl = '/assets/mocks/policy/policies.json';
  private policiesPaymentsUrl = '/assets/mocks/policy/policies-payments.json';
  private policyDtoUrl = '/assets/mocks/policy/policy.json';
  private policyResponseUrl = '/assets/mocks/policy/policies-view.json';
  private policyByPolicyId = '/assets/mocks/policy/policies-by-policy-id.json';
  private benefitsUrl = '/assets/mocks/policy/benefits.json';
  private otherBenefitsUrl = '/assets/mocks/policy/otherBenefits.json';

  // Code Example to get Policy DTO Mock. not erase please.
  /*
  return this._http.get<PolicyDto>(this.policyUrl)
      .pipe(map((response) => (response as PolicyDto)))
      .pipe(catchError(this.handleError));
  */

  getPoliciesByUserKeyAndRoleId(userKey: string, roleId: string, paymentPendingTopay: boolean,
    memberFirstName: string, memberLastName: string,
    page: number, pageSize: number, status: string) {
    let params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.PARAM_PENDING_TO_PAY, String(paymentPendingTopay))
      .set(this.USER_KEY, userKey)
      .set(this.PARAM_PAGE_INDEX, page.toString())
      .set(this.PARAM_PAGE_SIZE, pageSize.toString());
    params = this.addOptionalParamsToRequest(params, memberFirstName, memberLastName, status);

    return this._http.get<any>(
      `${this._config.apiHostPolicy}/${this.POLICIES}`, { params })
      .pipe(
      )
      .pipe(catchError(this.handleError));
  }

  getPolicyPaymentsByPolicyId(policyId: number): Observable<PolicyDto> {
    return this._http.get<PolicyDto>(
      `${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/${this.PAYMENTS}`)
      .pipe(
        tap(
          response => {
            if (!(this.policyWithPaymentsFiltered.findIndex(x => x.policyId === response.policyId) > -1)) {
              this.policyWithPaymentsFiltered.push(response);
            }
          }
        ),
      )
      .pipe(catchError(this.handleError));
  }

  getPolicyPaymentByPolicyId(policyId: number): PolicyDto[] {

    const policyPayment = this.policyWithPaymentsFiltered.filter(x => x.policyId === policyId);
    return policyPayment;
  }

  /**
   * Gets members by policy and DoB.
   * @param member MemberInputDto
   * @param user User information
   */
  getPolicyMembersByPolicyIdAndDoBAndEligibility(member: MemberInputDto, user: UserInformationModel): Observable<MemberOutputDto[]> {

    let params = new HttpParams();
    params = params.append(this.DOB, member.dob.toISOString().split('T')[0]);
    params = params.append(this.IS_ELIGIBLE, this.IS_ELIGIBLE_TRUE_VALUE);
    params = params.append(this.ROLE_ID, user.role_id);
    params = params.append(this.USER_ID, user.sub);
    params = params.append(this.USER_KEY, user.user_key);

    return this._http.get<MemberOutputDto[]>(
      `${this._config.apiHostPolicy}/${this.POLICIES}/${member.policyId}/${this.MEMBERS}`, { params: params })
      .pipe(
        map(p => (p as any).members)
      )
      .pipe(catchError(this.handleError));
  }

    /**
  * Gets policy detail information searching by policy id.
  * @param roleId Role Id.
  * @param userKey User Key.
  * @param policyId Policy Id.
  * @param policyStatusIds Policy Status Ids.
  * @param searchMemberType Search Member Type.
  */
  // tslint:disable-next-line:max-line-length
  SavePolicyLog(policyLogDto: PolicyLogDto): Observable<any> {
    return this._http.post<any>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyLogDto.policyId}/${this.POLICYLOG}`,
      policyLogDto)
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets members by name, last name and DoB filters.
   * @param member MemberInputDto
   * @param user User information
   */
  getMembersEligibility(member: MemberInputDto, user: UserInformationModel): Observable<MemberOutputDto[]> {

    let params = new HttpParams();
    params = params.append(this.FIRST_NAME, member.firstName);
    params = params.append(this.LAST_NAME, member.lastName);
    params = params.append(this.DOB, member.dob.toISOString().split('T')[0]);
    params = params.append(this.IS_ELIGIBLE, this.IS_ELIGIBLE_TRUE_VALUE);
    params = params.append(this.ROLE_ID, user.role_id);
    params = params.append(this.USER_ID, user.sub);
    params = params.append(this.USER_KEY, user.user_key);

    return this._http.get<MemberOutputDto[]>(`${this._config.apiHostPolicy}/${this.MEMBERS}`, { params: params })
      .pipe(
        map(p => (p as any).members)
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets the reference number of a member.
   * @param memberId Member Id.
   * @param referencenumber Reference Number.
   * @param transactionId Transaction Id.
   */
  getReferenceNumberOfMemberEligible(memberId: number, referencenumber: string, transactionId: number)
    : Observable<RerferenceNumberResponse> {
    let params = new HttpParams();
    params = params.append('referencenumber', referencenumber);
    params = params.append('transactionid', transactionId.toString());

    return this._http.get<RerferenceNumberResponse>(
      `${this._config.apiHostPolicy}/${this.MEMBERS}/${memberId}/${this.REFERENCE_NUMBER}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets all policy members filtering by policy id.
   * @param policyId Policy Id.
   * @param searchMemberType Search Member Type.
   */
  getPolicyMembersByPolicyId(policyId: number, searchMemberType?: string): Observable<ClaimSubmissionMember[]> {

    let params = new HttpParams();

    if (searchMemberType) {
      params = params.set(ConstansParamPolicies.SEARCH_MEMBER_TYPE, searchMemberType);
    } else {
      params = params.set(ConstansParamPolicies.SEARCH_MEMBER_TYPE, SearchMemberTypeConstants.ACTIVE_MEMBERS);
    }

    return this._http.get<ClaimSubmissionMember[]>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/members`,
      { params: params })
      .pipe(map(response => (response as any).members))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets all policy members filtering by legacy policy number.
   * @param legacyPolicyNumber Legacy Policy Number.
   * @param searchMemberType Search Member Type.
   */
  getPolicyMembersByLegacyPolicyNumber(legacyPolicyNumber: string, searchMemberType?: string): Observable<ClaimSubmissionMember[]> {

    let params = new HttpParams()
      .set(ConstansParamPolicies.LEGACY_POLICY_NUMBER, legacyPolicyNumber);

    if (searchMemberType) {
      params = params.set(ConstansParamPolicies.SEARCH_MEMBER_TYPE, searchMemberType);
    } else {
      params = params.set(ConstansParamPolicies.SEARCH_MEMBER_TYPE, SearchMemberTypeConstants.ACTIVE_MEMBERS);
    }

    return this._http.get<ClaimSubmissionMember[]>(`${this._config.apiHostPolicy}/${this.MEMBERS}`,
      { params: params })
      .pipe(map(response => (response as any).members))
      .pipe(catchError(this.handleError));
  }

  /**
  * Gets all policy members filtered by names.
  * @param policyId Policy Id.
  * @param roleId Role Id.
  * @param paymentPendingTopay Set to true to include the records with status Pending to pay.
  * @param userKey User Key.
  * @param firstName First Name
  * @param lastName Last Name
  * @param pageSize Page Size
  * @param pageIndex Page Index
  */
  getListOfPolicies(roleId: string, userKey: string, paymentPendingTopay: boolean,
    firstName: string, lastName: string, pageIndex: number, pageSize: number)
    : Observable<PolicyResponse[]> {

    let params = new HttpParams();
    params = params.append('roleid', roleId);
    params = params.append('paymentPendingTopay', paymentPendingTopay.toString());
    params = params.append('userkey', userKey);
    params = params.append('memberfirstname', firstName);
    params = params.append('memberlastname', lastName);
    params = params.append('pageindex', pageIndex.toString());
    params = params.append('pagesize', pageSize.toString());

    return this._http.get<PolicyResponse[]>(`${this._config.apiHostPolicy}/${this.POLICIES}`,
      { params: params })
      .pipe(map(response => (response as any).members))
      .pipe(catchError(this.handleError));
  }

  /**
   * If first and last name have value, they will be added to parameters
   * @param params parameter list
   * @param memberFirstName first name
   * @param memberLastName last name
   */
  private addOptionalParamsToRequest(params: HttpParams, memberFirstName: string,
    memberLastName: string, status: string): HttpParams {

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

    if (status) {
      params = params.set(ConstansParamPolicies.STATUS, status);
    }

    return params;
  }

  /**
   * Gets all policy members filtered by policy number.
   * @param policyId Policy Id.
   * @param roleId Role Id.
   * @param paymentPendingTopay Set to true to include the records with status Pending to pay.
   * @param userKey User Key.
   */
  getPolicyByPolicyId(roleId: string, userKey: string, paymentPendingTopay: boolean, policyId: number)
    : Observable<PolicyResponse> {

    const params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.PARAM_PENDING_TO_PAY, String(paymentPendingTopay))
      .set(this.USER_KEY, userKey);

    return this._http.get<PolicyDto>(
      `${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}`, { params: params })
      .pipe(map(data => {
        const policyDto = (data as PolicyDto);
        const result = this.CreateNewPolicyResponse();
        result.count = 1;
        result.data = [];
        result.data.push(policyDto);
        return result;
      }))
      .pipe(catchError(this.handleError));
  }

  thePolicyHasAutodeduction(policyAutodeduction: PolicyAutoDeductionRequestDto) {
    // tslint:disable-next-line: max-line-length
    return this._http.post<PolicyAutoDeductionResponseDto>(`${this._config.apiHostPaymentTransaction}/${this.POLICIES_AUTODEDUCTION}`, policyAutodeduction)
      .pipe(catchError(this.handleError));
  }

  autodeductionChangeState(policyAutodeduction: PolicyAutoDeductionRequestDto) {
    // tslint:disable-next-line: max-line-length
    return this._http.post<PolicyAutoDeductionResponseDto>(`${this._config.apiHostPaymentTransaction}/${this.POLICIES_AUTODEDUCTION_CHANGE_STATE}`, policyAutodeduction)
      .pipe(catchError(this.handleError));
  }


  /**
   * Gets all policy cards filtered by policy number and memeber number.
   * @param policyId Policy Id.
   * @param memeberId Policy Id.
   * @param cardType 1 - Default Card | 2 - Blue Card.
   * @param paymentPendingTopay Set to true to include the records with status Pending to pay.
   * @param userKey User Key.
   */
  getPolicyCardsByPolicyIdAndMemberId(policyId: number, memberId: number, cardType: number)
    : Observable<PolicyDto> {

    const params = new HttpParams()
      .set(this.PARAM_POLICY_CARDS, String(cardType));

    return this._http.get<PolicyDto>(
      `${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/${this.MEMBERS}/${memberId}/${this.CARDS}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  CreateNewPolicyResponse() {
    const response: PolicyResponse = {
      count: 0,
      pageSize: 1,
      pageindex: 1,
      data: []
    };
    return response;
  }

  /**
     * Gets all payments belonging to a policy.
     * @param policyId Policy Id.
     */
  getPaymentsByPolicyId(policyId: number)
    : Observable<PolicyResponse[]> {

    return this._http.get<PaymentDto[]>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/payments`)
      .pipe(map(response => (response as any).members))
      .pipe(catchError(this.handleError));
  }

  /**
     * Gets all payments belonging to a policy.
     * @param policyId Policy Id.
     */
  getPaymentsByPolicyIdReturnPayment(policyId: number)
    : Observable<PaymentDto[]> {

    return this._http.get<PaymentDto[]>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/payments`)
      .pipe(map(response => (response as any).payments))
      .pipe(catchError(this.handleError));
  }

  /**
   *
   * @param policyDto :
   */
  updatePolicyInformation(policyDto: PolicyDto) {

    return this._http.patch(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyDto.policyId}`, policyDto)
      .pipe(catchError(this.handleError));
  }

  /**
   *
   * @param policyDto :
   */
  updatePolicy(updatedPolicyRequestDto: UpdatePolicyRequestDto, optionName: string) {

    const headers = new HttpHeaders()
      .set(IgnoreInterceptorTypeNames.ERROR_400, IgnoreInterceptorTypeNames.ERROR_400);

    const params = new HttpParams()
      .set('policyChangeTypeName', String(optionName));

    return this._http.patch(`${this._config.apiHostPolicy}/${this.POLICIES}/${updatedPolicyRequestDto.policy.policyId}`,
      updatedPolicyRequestDto, { headers: headers, params: params })
      .pipe(catchError(this.handleError));
  }

  /**
   *
   * @param policyDto :
   */
  updatePolicyInformationPreference(policyDto: PolicyDto) {

    return this._http.patch(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyDto.policyId}/preferences`, policyDto)
      .pipe(catchError(this.handleError));
  }

  /**
   * Searchs all policies depending on the filter.
   * The following parameters are mandatory:
   * @param roleId Usuario autenticado
   * @param userKey Usuario autenticado
   * @param pageIndex Paginacion
   * @param pageSize Paginacion
   */
  getPoliciesByFilter(roleId: string, userKey: string, pageIndex: number, pageSize: number,
    businessType: number, policyId: number, legacyNumber: string, firstName: string,
    lastName: string, status: string, agentId: number, ownerDOB: string, receptionDateFrom: string, receptionDateTo: string,
    renewalsDateFrom: string, renewalsDateTo: string, bupaInsurancesList: string = '')
    : Observable<PolicyResponse> {

    let params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey)
      .set(this.PARAM_PAGE_INDEX, pageIndex.toString())
      .set(this.PARAM_PAGE_SIZE, pageSize.toString());

    params = this.addOptionalParamsSearchPolicies(params, businessType, policyId, legacyNumber, firstName, lastName,
      status, agentId, ownerDOB, receptionDateFrom, receptionDateTo, renewalsDateFrom, renewalsDateTo, bupaInsurancesList);

    return this._cachingService.getCached<PolicyResponse>(
      `${this._config.apiHostPolicy}/${this.POLICIES}`, { params: params }
    )
      .pipe(catchError(this.handleError));
  }

  /**
   * Search all info policies by roleId, userKey and policyId
   */
  getAllPoliciesByPolicyId(roleId: string, userKey: string, policyId: number, bupaInsurancesList: string = ''): Observable<PolicyResponse> {

    let params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey)
      .set(ConstansParamPolicies.EXCLUDEDETAIL, String(true));
    if (bupaInsurancesList) {
      params = params.set(ConstansParamPolicies.BUPA_INSURANCE_LIST, bupaInsurancesList);
    }

    return this._cachingService.getCached<PolicyDto>(
      `${this._config.apiHostPolicy}/${this.POLICIES}/${policyId.toString().trim()}`, { params: params })
      .pipe(map(data => {
        const policyDto = (data as PolicyDto);
        const result = this.CreateNewPolicyResponse();
        result.count = 1;
        result.data.push(policyDto);
        return result;
      }));
  }

  /**
  * Gets policy detail information searching by policy id.
  * @param roleId Role Id.
  * @param userKey User Key.
  * @param policyId Policy Id.
  * @param policyStatusIds Policy Status Ids.
  * @param searchMemberType Search Member Type.
  */
  // tslint:disable-next-line:max-line-length
  // SavePolicyLog(policyLogDto: PolicyLogDto): Observable<any> {
  //   return this._http.post<any>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyLogDto.policyId}/${this.POLICYLOG}`,
  //     policyLogDto)
  //     .pipe(catchError(this.handleError));
  // }
  /**
   * Gets policy detail information searching by policy id.
   * @param roleId Role Id.
   * @param userKey User Key.
   * @param policyId Policy Id.
   * @param policyStatusIds Policy Status Ids.
   * @param searchMemberType Search Member Type.
   */
  // tslint:disable-next-line:max-line-length
  getDetailPolicyByPolicyId(roleId: string, userKey: string, policyId: number, policyStatusIds?: string, searchMemberType?: string): Observable<PolicyDto> {

    let params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey);

    if (policyStatusIds) {
      params = params.set(ConstansParamPolicies.POLICY_STATUS_IDS, policyStatusIds);
    }

    if (searchMemberType) {
      params = params.set(ConstansParamPolicies.SEARCH_MEMBER_TYPE, searchMemberType);
    } else {
      params = params.set(ConstansParamPolicies.SEARCH_MEMBER_TYPE, SearchMemberTypeConstants.ACTIVE_MEMBERS);
    }

    return this._http.get<PolicyDto>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  getDetailPolicyByPolicyIdAndExclueDetail(roleId: string, userKey: string, policyId: number, policyStatusIds?: string,
    excludeDetail?: Boolean): Observable<PolicyDto> {

    let params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey)
      .set(ConstansParamPolicies.EXCLUDEDETAIL, String(excludeDetail));

    if (policyStatusIds) {
      params = params.set(ConstansParamPolicies.POLICY_STATUS_IDS, policyStatusIds);
    }

    return this._http.get<PolicyDto>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets policy's documents by its identifier.
   * @param policyId Policy Idntifier.
   */
  getPolicyDocumentsByPolicyId(policyId: number): Observable<PolicyDto> {

    const headers = new HttpHeaders()
      .set(IgnoreInterceptorTypeNames.ERROR_400, IgnoreInterceptorTypeNames.ERROR_400);

    return this._cachingService.getCached<PolicyDto>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/${this.DOCUMENTS}`,
      { headers: headers })
      .pipe(catchError(this.handleError));
  }

  getLastPayment(policyId: number): Observable<PolicyDto> {
    const params = new HttpParams()
      .set(ConstansParamPolicies.LAST_PAYMENT, String(true));

    return this._cachingService.getCached<PolicyDto>
      (`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/${this.PAYMENTS}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  getPaymentPendingToPayByPolicy(roleId: string, userKey: string, policyId: number): Observable<PolicyDto> {
    const params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey)
      .set(this.PARAM_PENDING_TO_PAY, String(true));

    return this._http.get<PolicyDto>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Add URL parameters for provider request policy with advanced opt ions
   */
  addOptionalParamsSearchPolicies(params: HttpParams, businessType: number, policyId: number, legacyNumber: string, firstName: string,
    lastName: string, status: string, agentId: number, ownerDOB: string, receptionDateFrom: string, receptionDateTo: string,
    renewalsDateFrom: string, renewalsDateTo: string, bupaInsurancesList: string): HttpParams {
    if (businessType) {
      params = params.set(ConstansParamPolicies.BUSINESS_TYPE, businessType.toString());
    } if (policyId) {
      params = params.set(ConstansParamPolicies.POLICY_ID, policyId.toString().trim());
    } if (legacyNumber) {
      params = params.set(ConstansParamPolicies.LEGACY_NUMBER, legacyNumber.toString().trim());
    } if (firstName) {
      params = params.set(ConstansParamPolicies.POLICY_OWNER_FIRST_NAME, firstName.trim());
    } if (lastName) {
      params = params.set(ConstansParamPolicies.POLICY_OWNER_LAST_NAME, lastName.trim());
    } if (status) {
      params = params.set(ConstansParamPolicies.STATUS, status);
    } if (agentId) {
      params = params.set(ConstansParamPolicies.AGENT_ID, agentId.toString());
    } if (ownerDOB) {
      params = params.set(ConstansParamPolicies.OWNERDOB, Utilities.convertDateToString(ownerDOB));
    } if (receptionDateFrom && receptionDateTo) {
      params = params.set(ConstansParamPolicies.RECEPTION_DATE_FROM, Utilities.convertDateToString(receptionDateFrom));
      params = params.set(ConstansParamPolicies.RECEPTION_DATE_TO, Utilities.convertDateToString(receptionDateTo));
    } if (renewalsDateFrom && renewalsDateTo) {
      params = params.set(ConstansParamPolicies.RENEWALS_DATE_FROM, Utilities.convertDateToString(renewalsDateFrom));
      params = params.set(ConstansParamPolicies.RENEWALS_DATE_TO, Utilities.convertDateToString(renewalsDateTo));
    }
    if (bupaInsurancesList) { params = params.set(ConstansParamPolicies.BUPA_INSURANCE_LIST, bupaInsurancesList); }
    return params;
  }

  getPoliciesByDependantCoverage(roleId: string, userKey: string, pageIndex: number, pageSize: number, agentId: number,
    from: Date, to: Date, isDependantCoverage: boolean): Observable<PolicyResponse> {
    const params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey)
      .set(this.PARAM_PAGE_INDEX, pageIndex.toString())
      .set(this.PARAM_PAGE_SIZE, pageSize.toString())
      .set(this.PARAM_AGENT_ID, agentId.toString())
      .set(this.PARAM_RENEWAL_FROM, Utilities.convertDateToString(from))
      .set(this.PARAM_RENEWAL_TO, Utilities.convertDateToString(to))
      .set(this.PARAM_IS_DEPENDENT, String(isDependantCoverage));

    return this._cachingService.getCached<PolicyResponse>(`${this._config.apiHostPolicy}/${this.POLICIES}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  getPoliciesByBirthDate(roleId: string, userKey: string, pageIndex: number, pageSize: number, agentId: number,
    birthDateMonth: any): Observable<PolicyResponse> {
    const params = new HttpParams()
      .set(this.ROLE_ID, roleId)
      .set(this.USER_KEY, userKey)
      .set(this.PARAM_PAGE_INDEX, pageIndex.toString())
      .set(this.PARAM_PAGE_SIZE, pageSize.toString())
      .set(this.PARAM_AGENT_ID, agentId.toString())
      .set(this.PARAM_BIRTH_DATE, birthDateMonth);

    return this._cachingService.getCached<PolicyResponse>(`${this._config.apiHostPolicy}/${this.POLICIES}`, { params: params })
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
   * get Policy Payment Information with captcha and anonymous param
   */
  getPolicyByPolicyIdAndAnonymous(policyId: number, captchaResponse,
    paymentPendingTopay: boolean, isAnonymous: boolean, keyType: string, dob?: Date): Observable<PolicyDto> {
    const options = {
      params: this.getParamOptionalPolicyPaymentInfo(paymentPendingTopay, isAnonymous, dob),
      headers: this.getHeaderCaptcha(captchaResponse, keyType).set(IgnoreInterceptorTypeNames.ERROR_400, IgnoreInterceptorTypeNames.ERROR_400)
    };

    return this._http.get<PolicyDto>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}`, options)
      .pipe()
      .pipe(catchError(this.handleError));
  }

  getHeaderCaptcha(captchaResponse: string, keyType: string): HttpHeaders {
    return new HttpHeaders()
      .set(ConstansParamPolicies.KEY, captchaResponse)
      .set(ConstansParamPolicies.KEY_TYPE, keyType);
  }

  getParamOptionalPolicyPaymentInfo(paymentPendingTopay: boolean, isAnonymous: boolean, dob?: Date): HttpParams {
    let params = new HttpParams()
      .set(ConstansParamPolicies.ISANONYMOUS, String(isAnonymous));
    if (dob) {
      params = params.set(ConstansParamPolicies.OWNERDOB, Utilities.convertDateToString(dob));
    }

    if (paymentPendingTopay) {
      params = params.set(ConstansParamPolicies.PAYMENT_PENDING_TO_PAY, String(paymentPendingTopay));
    }

    return params;
  }

  /**
   * Gets payments belonging to a policy.
   * @param policyId Policy Id.
   */
  getPaymentsByPaymentIdByPolicyIdIsAnonymous(policyId: number, paymentId: number,
    captchaResponse: string, key_type: string, isAnonymous: boolean): Observable<PolicyDto> {

    const options = {
      params: new HttpParams().set(ConstansParamPolicies.ISANONYMOUS, String(isAnonymous)),
      headers: this.getHeaderCaptcha(captchaResponse, key_type)
    };

    return this._http.get<PolicyDto>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/${this.PAYMENTS}/${paymentId}`, options)
      .pipe(map((response) => (response as PolicyDto)))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets payments belonging to a policy is user anonymous.
   * @param policyId Policy Id.
   */
  getPaymentsByPaymentIdByPolicyId(policyId: number, paymentId: number): Observable<PolicyDto> {

    return this._http.get<PolicyDto>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/${this.PAYMENTS}/${paymentId}`)
      .pipe(map((response) => (response as PolicyDto)))
      .pipe(catchError(this.handleError));
  }

  getPoliciesToRenewalByPolicyId(policyId: string, roleId: string, userKey: string, policyStatus: string,
    bussinessmode: string, bupaInsurancesList: string, excludeDetail: boolean, pageIndex: number, pageSize: number,
    isforrenewal: boolean)
    : Observable<PolicyDto> {

    const params = this.addRenewalPolicyParamsToRequest(roleId, userKey, policyStatus, bussinessmode, bupaInsurancesList,
      excludeDetail, pageIndex, pageSize, null, null, null, isforrenewal);

    return this._http.get<PolicyDto>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}`,
      { params: params })
      .pipe(map((response) => (response as PolicyDto)))
      .pipe(catchError(this.handleError));
  }

  getPoliciesToRenewalByStatus(roleId: string, userKey: string, policyStatus: string,
    bussinessmode: string, bupaInsurancesList: string, renewalDateFrom: Date, renewalDateTo: Date,
    pageIndex: number, pageSize: number)
    : Observable<PolicyResponse> {

    const params = this.addRenewalPolicyParamsToRequest(roleId, userKey, policyStatus, bussinessmode, bupaInsurancesList,
      null, pageIndex, pageSize, renewalDateFrom, renewalDateTo, null);

    return this._http.get<PolicyResponse>(`${this._config.apiHostPolicy}/${this.POLICIES}`,
      { params: params })
      .pipe(map(response => (response as any)))
      .pipe(catchError(this.handleError));
  }

  getPoliciesToRenewalByAgent(roleId: string, userKey: string, policyStatus: string,
    bussinessmode: string, bupaInsurancesList: string, renewalDateFrom: Date, renewalDateTo: Date,
    pageIndex: number, pageSize: number, agentId: number)
    : Observable<PolicyResponse> {

    const params = this.addRenewalPolicyParamsToRequest(roleId, userKey, policyStatus, bussinessmode, bupaInsurancesList,
      null, pageIndex, pageSize, renewalDateFrom, renewalDateTo, agentId);

    return this._http.get<PolicyResponse>(`${this._config.apiHostPolicy}/${this.POLICIES}`,
      { params: params })
      .pipe(map(response => (response as any)))
      .pipe(catchError(this.handleError));
  }

  getPoliciesToRenewalByRenewalDates(roleId: string, userKey: string, bupaInsurancesList: string, renewalDateFrom: Date,
    renewalDateTo: Date, pageIndex: number, pageSize: number)
    : Observable<PolicyResponse> {

    const params = this.addRenewalPolicyParamsToRequest(roleId, userKey, null, null, bupaInsurancesList,
      null, pageIndex, pageSize, renewalDateFrom, renewalDateTo, null);

    return this._http.get<PolicyResponse>(`${this._config.apiHostPolicy}/${this.POLICIES}`,
      { params: params })
      .pipe(map(response => (response as any)))
      .pipe(catchError(this.handleError));
  }

  private addRenewalPolicyParamsToRequest(roleId: string, userKey: string, policyStatus: string,
    bussinessmode: string, bupaInsurancesList: string, excludeDetail: boolean, pageIndex: number, pageSize: number,
    renewalDateFrom: Date, renewalDateTo: Date, agentId: number, isforrenewal?: boolean): HttpParams {

    let params = new HttpParams;
    if (roleId) { params = params.set(ConstansParamPolicies.ROLE_ID, roleId); }
    if (userKey) { params = params.set(ConstansParamPolicies.USER_KEY, userKey); }
    if (policyStatus) { params = params.set(ConstansParamPolicies.STATUS, policyStatus); }
    if (bussinessmode) { params = params.set(ConstansParamPolicies.BUSINESS_MODE, bussinessmode); }
    if (bupaInsurancesList) { params = params.set(ConstansParamPolicies.BUPA_INSURANCE_LIST, bupaInsurancesList); }
    if (excludeDetail) { params = params.set(ConstansParamPolicies.EXCLUDEDETAIL, String(excludeDetail)); }
    if (pageIndex) { params = params.set(ConstansParamPolicies.PAGE_INDEX, String(pageIndex)); }
    if (pageSize) { params = params.set(ConstansParamPolicies.PAGE_SIZE, String(pageSize)); }
    if (renewalDateFrom) { params = params.set(ConstansParamPolicies.RENEWALS_DATE_FROM, Utilities.convertDateToString(renewalDateFrom)); }
    if (renewalDateTo) { params = params.set(ConstansParamPolicies.RENEWALS_DATE_TO, Utilities.convertDateToString(renewalDateTo)); }
    if (agentId) { params = params.set(ConstansParamPolicies.AGENT_ID, String(agentId)); }
    if (isforrenewal) { params = params.set(ConstansParamPolicies.IS_FOR_RENEWALS, isforrenewal.toString()); }
    return params;
  }

  /**
   * Gets eligibility by policyId and memberId.
   * @param policyId Policy Id.
   * @param memberId Member Id.
   */
  getEligibilityByPolicyIdAndMemberId(policyId: number, memberId: number) {
    return this._http.get<PolicyDto>(
      `${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/${this.MEMBERS}/${memberId}/${this.ELIGIBILITIES}`)
      .pipe(map((response) => (response as PolicyDto)))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets type of benefits by eligibility.
   * @param policyId Policy Id.
   * @param memberId Member Id.
   * @param eligibilityFromDate Eligibility From Date.
   * @param benefitTypeId Benefit Type Id.
   * @param pageSize page Size.
   * @param pageIndex page Index.
   */
  getBenefitsByEligibility(
    policyId: number, memberId: number, eligibilityFromDate: string, benefitTypeId: number, pageSize?: number, pageIndex?: number) {
    let params = new HttpParams().set(ConstansParamPolicies.GROUP_BENEFIT_TYPE, String(benefitTypeId));
    if (benefitTypeId === 2 || benefitTypeId === 3) {
      params = params
        .set(ConstansParamPolicies.PAGE_INDEX, String(pageIndex))
        .set(ConstansParamPolicies.PAGE_SIZE, String(pageSize));
    }

    return this._http.get<BenefitsInputDto>(
      // tslint:disable-next-line: max-line-length
      `${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/${this.MEMBERS}/${memberId}/${this.ELIGIBILITIES}/${eligibilityFromDate}/${this.BENEFITS}`, { params })
      .pipe(map((response) => (response as BenefitsInputDto)))
      .pipe(catchError(this.handleError));
  }

  /**
  * Gets type of benefits by eligibility.
  * @param policyId Policy Id.
  */
  getForeignAssistance(policyId: number){
    return this._cachingService.getCached<boolean>
    (`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/${this.RIDERS}`);
  }

  /**
   * Gets the array of policies and its documents filtering by.
   * @param agentId Agent Id.
   * @param renewalDateFrom Renewal From Date.
   * @param renewalDateTo Renewal To Date.
   * @param viewDocuments View Documents.
   * @param roleId Role Id.
   * @param userKey User Key.
   * @param rolepageSizeId Page Size.
   * @param pageIndex Page Index.
   */
  getPoliciesAndDocumentsByFilter(
    agentId: string, renewalDateFrom: string,
    renewalDateTo: string, viewDocuments: string,
    roleId: string, userKey: string,
    pageSize: string, pageIndex: string)
    : Observable<PolicyResponse> {

    let params = new HttpParams()
      .set(ConstansParamPolicies.AGENT_ID, agentId)
      .set(ConstansParamPolicies.RENEWALS_DATE_FROM, renewalDateFrom)
      .set(ConstansParamPolicies.RENEWALS_DATE_TO, renewalDateTo)
      .set(ConstansParamPolicies.VIEW_DOCUMENTS, viewDocuments)
      .set(ConstansParamPolicies.ROLE_ID, roleId)
      .set(ConstansParamPolicies.USER_KEY, userKey)
      .set(ConstansParamPolicies.PAGE_SIZE, pageSize)
      .set(ConstansParamPolicies.PAGE_INDEX, pageIndex);

    // if (agentId) { params = params.set(ConstansParamPolicies.AGENT_ID, agentId); }

    return this._http.get<PolicyResponse>(`${this._config.apiHostPolicy}/${this.POLICIES}`,
      { params: params })
      .pipe(map(response => (response as any)))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets Policy Document Type array translated.
   * @param lang Language.
   */
  getPolicyDocumentsTypeArrayTranslated(lang: string): Observable<any[]> {
    if (lang.indexOf('SPA') !== -1) {
      const docTypeArray = [
        {
          name: 'Documentos de renovaciones',
          value: true
        }
      ];
      return Observable.of(docTypeArray);
    } else {
      const docTypeArray = [
        {
          name: 'Renewal documents',
          value: true
        }
      ];
      return Observable.of(docTypeArray);
    }
  }

  /**
   * Sends the policy documents to the selected policy emails.
   * @param notificationType Notification Type.
   * @param policyArray Policy Array.
   * @param lalangng Language.
   */
  sendPolicyNotifications(notificationType: string, policyArray: PolicyDto[], lang: string) {

    const policyNotificationObject = {
      notificationType: notificationType,
      language: lang,
      policies: policyArray
    };

    const params = new HttpParams()
      .set(ConstansParamPolicies.NOTIFICATION_TYPE, notificationType);

    return this._http.post(`${this._config.apiHostPolicy}/${this.POLICIES}/${this.NOTIFICATIONS}`,
      policyNotificationObject, { params })
      .pipe(catchError(this.handleError));

  }

  /**
   * Returns the member name.
   * @param member Member.
   */
  getMemberName(member: ClaimSubmissionMember) {
    if (member.fullName) {
      return member.fullName;
    } else {
      return `${member.firstName} ${member.middleName} ${member.lastName}`;
    }
  }

  /**
     * Get document renewals
     * @param languageId LanguageID
     * @param agentId AgentID
     * @param agentName AgentName
     * @param pageSize PageSize
     * @param renewalDateFrom RenewalDateFrom
     * @param renewalsDateTo RenewalsDateTo
     */
  getDocumentRenewals(languageId: string, agentId: string, agentName: string, renewalDateFrom: string,
    renewalsDateTo: string, pageSize: string) {
    const params = new HttpParams()
      .set('reportformat', '3')
      .set('languageId', languageId)
      .set('agentId', agentId)
      .set('agentName', agentName)
      .set('renewalDateFrom', renewalDateFrom)
      .set('renewalDateTo', renewalsDateTo)
      .set('pageIndex', '1')
      .set('pageSize', pageSize);
    const httpOptions = { 'responseType': 'arraybuffer' as 'json', params };

    return this._http.get<ArrayBuffer>(`${this._config.apiHostCommon}/common/reports/policyrenewals`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get document Policies
   * @param languageId LanguageID
   * @param agentId AgentID
   * @param agentName AgentName
   * @param pageSize PageSize
   * @param businessMode BusinessModeID
   * @param policyStatus PolicyStatus
   * @param policyId PolicyID
   * @param legacyNumber PolicyLegacyNumber
   * @param memberDOB MemberDOB
   * @param memberFirstName MemberFirstName
   * @param memberLastName MemberLastName
   */
  getDocumentPolicies(languageId: string, agentId: string, agentName: string, pageSize: string, businessMode: string,
    policyStatus: string, policyId: string, legacyNumber: string, memberDOB: string, memberFirstName: string,
    memberLastName: string) {
    const params = new HttpParams()
      .set('reportformat', '3')
      .set('languageId', languageId)
      .set('agentId', agentId)
      .set('agentName', agentName)
      .set('pageIndex', '1')
      .set('pageSize', pageSize)
      .set('businessMode', businessMode)
      .set('policyStatus', policyStatus)
      .set('policyId', policyId)
      .set('legacyNumber', legacyNumber)
      .set('memberDOB', memberDOB)
      .set('memberFirstName', memberFirstName)
      .set('memberLastName', memberLastName);
    const httpOptions = { 'responseType': 'arraybuffer' as 'json', params };

    return this._http.get<ArrayBuffer>(`${this._config.apiHostCommon}/common/reports/policies`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get document renewals
   * @param languageId LanguageID
   * @param agentId AgentID
   * @param agentName AgentName
   * @param pageSize PageSize
   * @param policyStatus PolicyStatus
   * @param receptionDateTo ReceptionDateFrom
   * @param receptionDateTo ReceptionDateTo
   */
  getDocumentNewBusiness(languageId: string, agentId: string, agentName: string, policyStatus: string,
    receptionDateFrom: string, receptionDateTo: string, pageSize: string) {
    const params = new HttpParams()
      .set('reportformat', '3')
      .set('languageId', languageId)
      .set('agentId', agentId)
      .set('agentName', agentName)
      .set('policyStatus', policyStatus)
      .set('receptionDateFrom', receptionDateFrom)
      .set('receptionDateTo', receptionDateTo)
      .set('pageIndex', '1')
      .set('pageSize', pageSize);
    const httpOptions = { 'responseType': 'arraybuffer' as 'json', params };

    return this._http.get<ArrayBuffer>(`${this._config.apiHostCommon}/common/reports/policynewbusiness`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get policy document letter for policy document type.
   * @param policyId Policy id.
   * @param langId Lang Id.
   * @param policyDocumentType Policy Document Type.
   */
  getPolicyDocumentLetter(policyId: string, langId: string, policyDocumentType: string) {
    const params = new HttpParams()
      .set(ConstansParamPolicies.LANGUAJE_ID, langId);

    return this._http.get<Blob>(`${this._config.apiHostPolicy}/${this.POLICIES}/${policyId}/letters/${policyDocumentType}`,
      { params: params, responseType: 'blob' as 'json' })
      .pipe(catchError(this.handleError));
  }

  /**
   * Validate policy according to domain url only for Mexico split.
   * @param rolId user rol.
   * @param policyCountryId policy country id.
   */
  validatePolicyAccordingToDomainUrlMexicoSplit(rolId: string, insuranceBusinessId: number): boolean {
    const URLdomain = window.location.host;
    if ((+rolId === Rol.PROVIDER && insuranceBusinessId === InsuranceBusiness.BUPA_MEXICO
      && !URLdomain.toLocaleLowerCase().includes('.com.mx')) ||
      (+rolId === Rol.PROVIDER && insuranceBusinessId !== InsuranceBusiness.BUPA_MEXICO
        && URLdomain.toLocaleLowerCase().includes('.com.mx'))) {
      return true;
    }
    return false;
  }

  /**
     * Gets all Uso CFDI active.     
     */
  getCFDIAndRegimes() 
  : Observable<Instance<TaxResponse>> {
    return this._http.get<Instance<TaxResponse>>(`${this._config.apiHostPolicy}/${this.POLICIES}/${this.GET_CFDI}`);      
  }

  /**
     * Send a pdf file to API.
     * @param pdf Pdf file.
     */
  processPDF(formData: FormData)
    : Observable<Instance<TaxCertificateDataResponse>> 
    {
    return this._http.post<Instance<TaxCertificateDataResponse>>(`${this._config.apiHostPolicy}/${this.POLICIES}/${this.READ_PDF}`, formData);
  }

  /**
     * Send tax data to API.
     * @param data Tax data.
     */
  updateTaxData(data: any) {     
    return this._http.post<any>(`${this._config.apiHostPolicy}/${this.POLICIES}/${this.UPDATE_DATA}`, data);
  }

  /**
     * Save PDF document
     * @param data 
     * @param file
     */
  saveDocument(data: any, file: File) 
    : Observable<Instance<boolean>>
    {    
    const form: FormData = new FormData();
    form.append("PDF", file, file.name);
    form.append("PolicyId", data.policyid);
    form.append("LastName", `${data.individualData.firstName} ${data.individualData.lastName}`);
    form.append("AgentCode", data.documentInformation.agentId);
    form.append("PolicyCountry", data.documentInformation.policyCountry);
    form.append("DOB", data.documentInformation.ownerDob);
    form.append("CompanyName", "Bupa Mexico");
    form.append("InsuranceBusinessId", data.documentInformation.insuranceBusinessId);
    form.append("PDFName", file.name);

    return this._http.post<any>(`${this._config.apiHostPolicy}/${this.POLICIES}/${this.SAVE_PDF}`, form);
  }
}
