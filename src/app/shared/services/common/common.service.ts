/**
* CommonService.ts
*
* @description: This class interacts with common API.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/


import { Injectable } from '@angular/core';
import { Common } from '../../interfaces/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ConfigurationService } from '../configuration/configuration.service';
import { catchError, map, retry } from 'rxjs/operators';
import { Country } from './entities/country';
import { Language } from './entities/language';
import { UploadService } from '../upload/upload.service';
import { UploadResponse } from './entities/uploadReponse';
import { FileDocument } from './entities/fileDocument';
import { CachingService } from '../caching/caching-service';
import { City } from './entities/city';
import { Product } from './entities/product';
import { Plan } from './entities/plan';
import { RuleByBusiness } from './entities/rule-by-business';
import { State, StateResponse } from './entities/state';
import { Month } from './entities/month';
import { BupaInsuranceDto } from '../user/entities/bupaInsurance.dto';
import { RateDocumentOutput } from '../../../policy/rates-forms-questionaries/entities/rateDocumentOutput.dto';
import { DiagnosticResponse } from './entities/diagnostic-response';
import { ProcedureResponse } from './entities/procedure-response';
import { NotificationAttachmentDto } from '../event-notification/entities/notificationAttachment.dto';
import { PolicyChangesDto } from './entities/policy-changes.dto';
import { Colony } from './entities/colony.dto';
import { MunicipalityDto } from './entities/municipality.dto';
import { ViewTemplate } from '../view-template/entities/view-template';
import { InsuranceBusiness } from '../../classes/insuranceBusiness.enum';
import { Genders } from './entities/genders';
import { MaritalStatus } from './entities/marital-status';
import { SourceOffunding } from './entities/source-offunding';
import { Industry } from './entities/industry';
import { AreaCodes } from './entities/areacodes';
import { Locality } from './entities/locality';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ModePayment } from './entities/modePayment';
import { Identification } from './entities/Identification';
import { AgreementDefinition } from './entities/agreement-def-enrollment-response';
import { PrincipalLanguageDto } from '../provider-detail/entities/principalLanguage.dto';
import { Currency } from './entities/currency';
import { FinanceDependencyDto } from './entities/finance-dependency.dto';
import { BankAccountType } from './entities/bank-account-type';



/**
 * This class interacts with common API.
 */
@Injectable({
  providedIn: 'root'
})
export class CommonService implements Common {

  /**
   * indicates common api.
   */
  private COMMON = 'common';

  /**
   * [HttpGet] Constant for countries endpoint
   */
  private COUNTRIES = 'countries';

  /**
   * [HttpGet] Constant for states endpoint
   */
  private STATES = 'states';

  /**
   * [HttpGet] Constant for languages endpoint
   */
  private LANGUAGES = 'languages';

  /**
   * [HttpGet] Constant for folders endpoint
   */
  private FOLDERS = 'folders';

  /**
   * [HttpGet] Constant for documents endpoint
   */
  private DOCUMENTS = 'documents';

  /**
   * [HttpGet] New Guid endpoint
   */
  private NEWGUID = 'newguid';

  /**
   * [HttpGet] Constant for cities endpoint
   */
  private CITIES = 'cities';

  /**
  * [HttpGet] Constant for products endpoint
  */
  private PRODUCTS = 'products';

  /**
  * [HttpGet] Constant for products endpoint
  */
  private PRODUCT = 'product';

  /**
  * [HttpGet] Constant for plans endpoint
  */
  private PLANS = 'plans';

  /**
   * [HttpGet] Constant for rules endpoint
   */
  private RULES = 'rules';

  /**
  * [HttpGet] Constant for plans endpoint
  */
  private BUSINESS = 'business';

  /**
 * [HttpGet] Constant for customerbanks endpoint
 */
  private CUSTOMERBANKS = 'customerbanks';

  /**
 * [HttpGet] Constant for financedependencies endpoint
 */
  private FINANCEDEPENDENCIES = 'financedependencies';

  /**
  * [HttpGet] Constant for documents endpoint
  */
  private REPOSITORY_TARGET = 'repositoryTarget';

  /**
  * [HttpGet] Constant for documents endpoint
  */

  private RE_WRITE_FILE_NAME = 'rewriteFileName';
  /**
   * Constant for online-only for products
   */
  private ONLINEONLY = 'onlineOnly';

  /**
  * [HttpGet] Constant for diagnostics endpoint
  */
  private DIAGNOSTICS = 'diagnostics';

  private PAGE_INDEX = 'pageindex';

  private PAGE_SIZE = 'pagesize';

  private TYPE = 'type';

  /**
   * [HttpGet] Constant for procedures endpoint
   */
  private PROCEDURES = 'procedures';

  /**
    * [HttpGet] Constant for process endpoint
    */
  private PROCESS = 'process';

  /**
   * [HttpGet] Constant for options endpoint
   */
  private OPTIONS = 'options';

  /***
   * [HttpGet] Constant for roleId endpoint
   */
  private ROLEID = 'roleId';

  /***
   * [HttpGet] Constant for insurancebusinessid endpoint
   */
  private INSURANCEBUSINESSID = 'insurancebusinessid';

  /***
   * [HttpGet] Constant for businessmodeid endpoint
   */
  private BUSINESSMODEID = 'businessmodeid';

  /***
   * [HttpGet] Constant for zipcode endpoint
   */
  private ZIP_CODE = 'zipcode';

  private diagnosticsURL = '/assets/mocks/common/pre-authorization/diagnostics.json';

  /**
    * [HttpGet] Constant for colonies endpoint
    */
  private COLONIES = 'colonies';

  /**
   * [HttpGet] Constant for municipalities endpoint
   */
  private MUNICIPALITIES = 'municipalities';

  /**
   * [HttpGet] Constant for Genders endpoint
   */
  private GENDERS = 'Genders';

  /**
   * [HttpGet] Constant for maritalstatuses endpoint
   */
  private MARITAL_STATUS = 'maritalstatuses';

  /**
   * [HttpGet] Constant for sourceoffundings endpoint
   */
  private SOURCE_OFFUNDING = 'sourceoffundings';

  /**
   * [HttpGet] Constant for industries endpoint
   */
  private INDUSTRIES = 'industries';

  /**
   * [HttpGet] Constant for areacodes endpoint
   */
  private AREACODES = 'areacodes';

  private LOCALITIES = 'localities';

  private MODE_OF_PAYMENTS = 'modeofpayment';

  private PROCESS_OPTION_ID_VALUE = 49;
  private PROCESS_OPTION = 'processOption';
  private VIEW_TEMPLATE = 'viewtemplate';
  private VERSION_PARAM = 'version';
  private VERSION_VALUE = '1.0';
  private PROCESS_VALUE = 2;
  private BUSINESS_MODE_ID_PARAM = 'businessModeId';
  private BUSINESS_MODE_ID_VALUE = 1;
  private COUNTRY_ID = 'countryId';
  private CITY_ID = 'cityId';
  private POLICY_TYPE_ID = 'policyTypeId';
  private PLAN_DATE = 'planDate';
  private IDENTIFICATIONS = 'identifications';
  private AGREEMENTS_DEF_ENROLLMENT = 'agreements';
  private CURRENCIES = 'currencies';

  private IS_SANCTIONED = 'isSanctioned';


  /**
   * Constructor Method
   * @param _http HttpClient injection
   * @param _config Configuration Service Injection
   * @param _upload Upload Service Injection
   * @param _cachingService Caching Service injection.
   */
  constructor(private _http: HttpClient,
    private _config: ConfigurationService,
    private _upload: UploadService,
    private _cachingService: CachingService,
    private translate: TranslateService
  ) {
    this.diagnosticsURL = _config.returnUrl + this.diagnosticsURL;
  }


  /**
   * Get a bupa registered country by id
   * @param id Country ID
   */
  getCountryById(id: number): Observable<Country> {
    return this._cachingService.getCached<Country>(`${this._config.apiHostCommon}/${this.COMMON}/${this.COUNTRIES}/${id}`)
      .pipe(map(p => (p as any).country))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets list of all Countries whit Nationalities from CRM.
   */
  getCountriesCrm(): Observable<Country[]> {
    return this._http.get<Country[]>(`${this._config.apiHostCommonCrm}/${this.COUNTRIES}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * This method get countries from Amigos Plus
   */
  getCountries(): Observable<Country[]> {
    return this._cachingService.getCached<Country[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.COUNTRIES}`)
      .pipe(map(p => (p as any).countries))
      .pipe(catchError(this.handleError));
  }

  /**
   * This method get countries from Amigos Plus
   */
  getCountriesIsSanctioned(isSanctioned: boolean): Observable<Country[]> {
    return this._cachingService.getCached<Country[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.COUNTRIES}?${this.IS_SANCTIONED}=${isSanctioned}`)
      .pipe(map(p => (p as any).countries))
      .pipe(catchError(this.handleError));
  }

  /**
   * This method get countries by business id from Amigos Plus
   */
  getCountriesByBusinessId(businessId: number): Observable<Country[]> {
    return this._cachingService.getCached<Country[]>(
      `${this._config.apiHostCommon}/${this.COMMON}/${this.BUSINESS}/${businessId}/${this.COUNTRIES}`)
      .pipe(map(p => (p as any).countries))
      .pipe(catchError(this.handleError));
  }

  /**
   * This method get cities by country id from Amigos Plus
   * @param countryId Country Id
   */
  getCitiesByCountry(countryId: number): Observable<City[]> {
    return this._cachingService.
      getCached<City>(`${this._config.apiHostCommon}/${this.COMMON}/${this.COUNTRIES}/${countryId}/${this.CITIES}`)
      .pipe(map(p => (p as any).cities))
      .pipe(catchError(this.handleError));
  }

  /**
   * This method get states by country id from Amigos Plus
   * @param countryId Country Id
   */
  getStatesByCountry(countryId: number): Observable<State[]> {
    countryId = 13;

    return this._http.
      get<State[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.COUNTRIES}/${countryId}/${this.STATES}`)
      .pipe(map(p => {
        return (p as any).states.filter(s => s.stateName !== 'ALL');
      }))
      .pipe(catchError(this.handleError));
  }
  // online-only=true
  /**
   * this method get products by country id and city id
   * @param countryId
   * @param cityId
   * @param onlyOnline
   */
  getProductByCityAndCountry(businessId: number, countryId: number, cityId: number, onlyOnline: boolean): Observable<Product[]> {
    return this._cachingService.
      // tslint:disable-next-line:max-line-length
      getCached<Product>(`${this._config.apiHostCommon}/${this.COMMON}/${this.BUSINESS}/${businessId}/${this.COUNTRIES}/${countryId}/${this.CITIES}/${cityId}/${this.PRODUCTS}?${this.ONLINEONLY}=${onlyOnline}`)
      .pipe(map(p => (p as any).nameValuePairs))
      .pipe(catchError(this.handleError));
  }

  /**
   * get plans by product id
   * @param productId
   */
  getPlansByProduct(productId: number): Observable<Plan[]> {
    return this._cachingService.getCached<Plan>(`${this._config.apiHostCommon}/${this.COMMON}/${this.PRODUCT}/${productId}/${this.PLANS}`)
      .pipe(map(p => (p as any).nameValuePairs))
      .pipe(catchError(this.handleError));
  }

  /**
   * Get a bupa registered language by id
   * @param id Language ID
   */
  getLanguageById(id: number): Observable<Language> {
    return this._http.get<Language>(`${this._config.apiHostCommon}/${this.COMMON}/${this.LANGUAGES}/${id}`)
      .pipe(map(p => (p as any).language))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets list of all Languages from CRM.
   */
  getLanguagesCrm(): Observable<PrincipalLanguageDto[]> {
    return this._http.get<PrincipalLanguageDto[]>(`${this._config.apiHostCommonCrm}/${this.LANGUAGES}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get rules by business
   * @param businessId businessId
   * @param process process
   */
  getRulesByBusiness(businessId: number, process: string, name?: any): Observable<RuleByBusiness[]> {
    let params = new HttpParams()
      .set('businessId', businessId.toString())
      .set('process', process);

    if (name && name.toString().length > 0) {
      params = params.set('name', name);
    }

    return this._cachingService.getCached<RuleByBusiness[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.RULES}`, { params })
      .pipe(map(p => (p as any).rulesByBusiness))
      .pipe(catchError(this.handleError));
  }

  /**
   * Upload first document file to folder.
   * @param document Document file selected.
   */
  uploadFirstDocument(document: FileDocument): Promise<UploadResponse> {
    return this._upload.uploadFile(`${this._config.apiHostCommon}/${this.COMMON}/${this.DOCUMENTS}`, document);
  }

  /**
   * Upload Document To Folder.
   * @param file Document file selected to upload.
   * @param folder Folder that contain the document file selected.
   */
  uploadDocumentToFolder(file: FileDocument, folder: string): Promise<UploadResponse> {
    return this._upload.uploadFile(`${this._config.apiHostCommon}/${this.COMMON}/${this.FOLDERS}/${folder}/${this.DOCUMENTS}`, file);
  }

  /**
   * Upload Document To Folder and Repository.
   * @param file Document file selected to Upload.
   * @param folder folder that contain the document file selected.
   */
  uploadDocumentToFolderToRepository(file: FileDocument, folder: string,
    repository: string, createAlias: Boolean): Promise<UploadResponse> {
    const params = new HttpParams()
      .set(this.REPOSITORY_TARGET, repository)
      .set(this.RE_WRITE_FILE_NAME, String(createAlias));
    return this._upload.uploadFile(`${this._config.apiHostCommon}/${this.COMMON}/${this.FOLDERS}/${folder}/${this.DOCUMENTS}`,
      file, params);
  }

  /**
   * Delete folder , It was create in claim submission
   * @param folder folder to delete.
   */
  deleteFolder(folder: string): Observable<any> {
    return this._http.delete(`${this._config.apiHostCommon}/${this.COMMON}/${this.FOLDERS}/${folder}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * New Guid generator endpoint
   * @param fn Callback
   */
  newGuid(fn) {
    return this._http.get(`${this._config.apiHostCommon}/${this.COMMON}/${this.NEWGUID}`)
      .pipe(retry(5))
      .subscribe(fn);
  }

  newGuidNuevo(): Observable<any> {
    return this._http.get(`${this._config.apiHostCommon}/${this.COMMON}/${this.NEWGUID}`);
  }

  /**
   * Validate if business insurance is Bupa Mexico (41) or Bupa Global (1?)
   * @param businessInsurance businessInsurance
   */
  validateAuthorizedBusinessInsurance(businessInsurance: number): boolean {
    return (businessInsurance === InsuranceBusiness.BUPA_MEXICO || businessInsurance === InsuranceBusiness.BUPA_GLOBAL);
  }

  /**
   * Handle error
   * @param error HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  /**
   * Obtain a country by isoalpha code
   * @param isoalpha
   */
  getCountryByIsoalpha(isoalpha: string): Observable<Country> {
    const params = new HttpParams()
      .set('isoalpha', isoalpha);
    return this._cachingService.getCached<Country[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.COUNTRIES}`, { params })
      .pipe(map(p => (p as any).countries))
      .pipe(catchError(this.handleError));
  }


  /**
   * Get documents filtering by documentPath
   * @param fileParams Any
   */
  getDocumentByDocumentPath(fileParams: any) {
    const bodyParams = new HttpParams()
      .append('documentLocation', fileParams.documentPath);
    return this._http.get<Blob>(this._config.apiHostCommon + '/common/documents/' + fileParams.documentType + '/',
      { params: bodyParams, responseType: 'blob' as 'json' }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get documents filtering by documentPathAndId
   * @param docParams NotificationAttachmentDto
   */
  getDocumentByDocumentPathAndId(docParams: NotificationAttachmentDto) {
    const documentLocation = docParams.path + docParams.fileName;
    const body = new HttpParams().append('documentLocation', documentLocation);
    return this._http.get<Blob>(this._config.apiHostCommon + '/common/documents/' + docParams.fileName + '/',
      { params: body, responseType: 'blob' as 'json' })
      .pipe(catchError(this.handleError));
  }

  /**
   * Search for documents, used from view : rates form and questionaries
   * @param fileParams file params
   */
  getRatesFormsDocuments(fileParams): Observable<RateDocumentOutput[]> {

    const bodyParams = new HttpParams()
      .set('insuranceBusinessId', fileParams.insurance_bussiness)
      .set('roleId', fileParams.role_id)
      .set('benefitYear', fileParams.benefic_year)
      .set('externalPolicyid', fileParams.referencePolicyId)
      .set('externalGroupPolicyid', fileParams.referenceGroupId);

    return this._http.get<RateDocumentOutput[]>(`${this._config.apiHostCommon}/common/products/${fileParams.product}/documents`,
      { params: bodyParams }
    ).pipe(catchError(this.handleError));

  }

  /**
   * get the document selected by the user
   * @param doc RateDocumentOutput
   * @param language language ID
   * @param productId  product Id
   * @param externarlPolicyId  externarlPolicyId
   * @param externalGroupPolicyid  externalGroupPolicyid
   */
  getFileRatesFormDocument(doc: RateDocumentOutput, languageId: number, productId: number,
    externarlPolicyId: number, externalGroupPolicyid: number) {

    const uri = (doc.documentSource === 'sanitas_source') ? '"' : doc.documentPath;

    const bodyParams = new HttpParams()
      .set('documentUri', uri)
      .set('source', doc.documentSource)
      .set('languageId', languageId.toString())
      .set('externalPolicyid', externarlPolicyId.toString())
      .set('externalGroupPolicyid', externalGroupPolicyid.toString());

    return this._http.get<Blob>(`${this._config.apiHostCommon}/common/products/${productId}/documents/${doc.documentId}`,
      { params: bodyParams, responseType: 'blob' as 'json' }
    ).pipe(catchError(this.handleError));
  }

  monthsOfYear(): Array<Month> {
    return [
      { id: 1, name: 'APP.MONTHS.JANUARY' },
      { id: 2, name: 'APP.MONTHS.FEBRUARY' },
      { id: 3, name: 'APP.MONTHS.MARCH' },
      { id: 4, name: 'APP.MONTHS.APRIL' },
      { id: 5, name: 'APP.MONTHS.MAY' },
      { id: 6, name: 'APP.MONTHS.JUNE' },
      { id: 7, name: 'APP.MONTHS.JULY' },
      { id: 8, name: 'APP.MONTHS.AUGUST' },
      { id: 9, name: 'APP.MONTHS.SEPTEMBER' },
      { id: 10, name: 'APP.MONTHS.OCTOBER' },
      { id: 11, name: 'APP.MONTHS.NOVEMBER' },
      { id: 12, name: 'APP.MONTHS.DECEMBER' }
    ];
  }

  getBupaBusiness() {
    return this._cachingService.getCached<BupaInsuranceDto[]>(
      `${this._config.apiHostCommon}/${this.COMMON}/${this.BUSINESS}`)
      .pipe(map(p => (p as any)))
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtain a country by business code
   * @param business
   */
  getCountryByBusiness(business: number): Observable<Country> {
    // tslint:disable-next-line:max-line-length
    return this._cachingService.getCached<Country[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.BUSINESS}/${business}/${this.COUNTRIES}`)
      .pipe(map(p => (p as any).countries))
      .pipe(catchError(this.handleError));
  }

  /***
   * Get Diagnostics
   */
  getDiagnostics(pageIndex: number, pageSize: number, code?: string, name?: string): Observable<DiagnosticResponse> {
    let params = new HttpParams()
      .set(this.PAGE_INDEX, pageIndex.toString())
      .set(this.PAGE_SIZE, pageSize.toString())
      .set(this.TYPE, 'ICD10');

    if (code) {
      params = params.set('code', code);
    }

    if (name) {
      params = params.set('description', name);
    }
    return this._cachingService.getCached<DiagnosticResponse>
      (`${this._config.apiHostCommon}/${this.COMMON}/${this.DIAGNOSTICS}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  /***
   * Get Procedures
   */
  getProcedures(pageIndex: number, pageSize: number, code?: string, name?: string): Observable<ProcedureResponse> {
    let params = new HttpParams()
      .set(this.PAGE_INDEX, pageIndex.toString())
      .set(this.PAGE_SIZE, pageSize.toString());

    if (code) {
      params = params.set('code', code);
    }

    if (name) {
      params = params.set('description', name);
    }
    return this._cachingService.getCached<ProcedureResponse>
      (`${this._config.apiHostCommon}/${this.COMMON}/${this.PROCEDURES}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  getPolicyChangesByFilter(processId: number, insurancebusinessid: string, businessmodeid: number): Observable<PolicyChangesDto[]> {
    const params = new HttpParams()
      .set(this.INSURANCEBUSINESSID, insurancebusinessid.toString())
      .set(this.BUSINESSMODEID, businessmodeid.toString());

    return this._cachingService.getCached<PolicyChangesDto[]>
      (`${this._config.apiHostCommon}/${this.COMMON}/${this.PROCESS}/${processId}/${this.OPTIONS}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  getColoniesByZipCode(zipCode: string): Observable<Colony[]> {
    const params = new HttpParams()
      .set(this.ZIP_CODE, zipCode);

    return this._cachingService.getCached<Colony[]>
      (`${this._config.apiHostCommon}/${this.COMMON}/${this.COLONIES}`, { params: params })
      .pipe(map(p => (p as any).colonies))
      .pipe(catchError(this.handleError));
  }

  getMunicipalitiesByZipCode(zipCode: string): Observable<MunicipalityDto[]> {
    const params = new HttpParams()
      .set(this.ZIP_CODE, zipCode);

    return this._cachingService.getCached<MunicipalityDto>
      (`${this._config.apiHostCommon}/${this.COMMON}/${this.MUNICIPALITIES}`, { params: params })
      .pipe(map(p => (p as any).municipalities))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets view template
   * @returns view template
   */
  getViewTemplate(insuranceBusinessIdVal: string): Observable<ViewTemplate> {
    const params = new HttpParams()
      .set(this.INSURANCEBUSINESSID, insuranceBusinessIdVal)
      .set(this.VERSION_PARAM, this.VERSION_VALUE)
      .set(this.BUSINESS_MODE_ID_PARAM, this.BUSINESS_MODE_ID_VALUE.toLocaleString());
    return this._cachingService.getCached<ViewTemplate>
      // tslint:disable-next-line:max-line-length
      (`${this._config.apiHostCommon}/${this.COMMON}/${this.PROCESS}/${this.PROCESS_VALUE}/${this.PROCESS_OPTION}/${this.PROCESS_OPTION_ID_VALUE}/${this.VIEW_TEMPLATE}`, { params: params })
      .pipe(map(p => (p as any).viewTemplate))
      .pipe(catchError(this.handleError));
  }

  /**
   * This method get Genders from Amigos Plus
   */
  getGenders(): Observable<Genders[]> {
    return this._cachingService.getCached<Genders[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.GENDERS}`)
      .pipe(map(p => (p as any).genders))
      .pipe(catchError(this.handleError));
  }

  /**
   * This method get MaritalStatus from Amigos Plus
   */
  getMaritalstatus(): Observable<MaritalStatus[]> {
    return this._cachingService.getCached<MaritalStatus[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.MARITAL_STATUS}`)
      .pipe(map(p => (p as any).maritalStatuses))
      .pipe(catchError(this.handleError));
  }

  /**
   * This method get SourceOffunding from Amigos Plus
   */
  getSourceOffunding(): Observable<SourceOffunding[]> {
    return this._cachingService.getCached<SourceOffunding[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.SOURCE_OFFUNDING}`)
      .pipe(map(p => (p as any).sourceOfFundings))
      .pipe(catchError(this.handleError));
  }

  /**
   * This method get Industry from Amigos Plus
   */
  getIndustries(): Observable<Industry[]> {
    return this._cachingService.getCached<Industry[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.INDUSTRIES}`)
      .pipe(map(p => (p as any).industries))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets area codes by city
   * @param cityId
   * @returns area codes by city
   */
  getAreaCodesByCity(cityId: number): Observable<AreaCodes[]> {
    return this._cachingService.getCached<AreaCodes[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.AREACODES}/${cityId}`)
      .pipe(map(p => (p as any).areaCodes))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets localities by state id
   * @param stateId
   * @returns localities by state id
   */
  getLocalitiesByStateId(stateId: number): Observable<Locality[]> {
    return this._cachingService.getCached<Locality[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.LOCALITIES}/${stateId}`)
      .pipe(map(p => (p as any).localities))
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets the plans and its Raiders filtering by.
   * @param productId Product Id.
   * @param countryId Country Id.
   * @param cityId City Id.
   * @param policyTypeId Policy type Id.
   * @param planDate Plan Date.
   */
  getPlansAndRidersByProductAndCountryIdAndCityIdAndPolicyTypeId(productId: number, countryId: number,
    cityId: number, policyTypeId: number, planDate?: string): Observable<any> {
    let params = new HttpParams()
      .set(this.COUNTRY_ID, countryId.toString())
      .set(this.CITY_ID, countryId === 13 ? cityId.toString() : '0')
      .set(this.POLICY_TYPE_ID, policyTypeId.toString());
    if (planDate) {
      params = params.set(this.PLAN_DATE, planDate.toString());
    }
    return this._cachingService.getCached<any>(`${this._config.apiHostCommon}/${this.COMMON}/${this.PRODUCTS}/${productId}/${this.PLANS}`,
      { params: params })
      .pipe(map(p => (p as any).products))
      .pipe(catchError(this.handleError));
  }

  /**
   * Returns an array whith the years between the provided range.
   * @param minRange Min Index.
   * @param maxRange Max Index.
   */
  getArrayOfYearsByRange(minRange: number, maxRange: number): Observable<any[]> {
    const actualYear = Number(moment().format('YYYY'));
    const min = actualYear - minRange;
    const max = actualYear + maxRange;
    const yearsArray = [];
    for (let index = min; index <= max; index++) {
      yearsArray.push({ year: index });
    }
    return Observable.of(yearsArray);
  }

  /**
   * Returns an array whith the names of the months of year translated.
   */
  getMonthsofYearTranslated(): Observable<any[]> {
    const monthsOfYear: any[] = [
      { id: 1, name: this.translate.get('APP.MONTHS.JANUARY') },
      { id: 2, name: this.translate.get('APP.MONTHS.FEBRUARY') },
      { id: 3, name: this.translate.get('APP.MONTHS.MARCH') },
      { id: 4, name: this.translate.get('APP.MONTHS.APRIL') },
      { id: 5, name: this.translate.get('APP.MONTHS.MAY') },
      { id: 6, name: this.translate.get('APP.MONTHS.JUNE') },
      { id: 7, name: this.translate.get('APP.MONTHS.JULY') },
      { id: 8, name: this.translate.get('APP.MONTHS.AUGUST') },
      { id: 9, name: this.translate.get('APP.MONTHS.SEPTEMBER') },
      { id: 10, name: this.translate.get('APP.MONTHS.OCTOBER') },
      { id: 11, name: this.translate.get('APP.MONTHS.NOVEMBER') },
      { id: 12, name: this.translate.get('APP.MONTHS.DECEMBER') }
    ];

    return Observable.of(monthsOfYear);
  }



  /**
   * Gets mode of payment
   * @returns mode of payment exclude the record named _unknown
   */
  getModeOfPayment(): Observable<ModePayment[]> {
    return this._cachingService.
      // tslint:disable-next-line:max-line-length
      getCached<ModePayment>(`${this._config.apiHostCommon}/${this.COMMON}/${this.MODE_OF_PAYMENTS}`)
      .pipe(map(p => (p as any).nameValuePairs.filter(x => x.id !== '1')))
      .pipe(catchError(this.handleError));
  }

  getIdentifications(businessId?: number): Observable<Identification[]> {
    return this._cachingService.
      getCached<Identification>(`${this._config.apiHostCommon}/${this.COMMON}/${this.IDENTIFICATIONS}/${businessId}`)
      .pipe(map(p => (p as any).identifications))
      .pipe(catchError(this.handleError));
  }

  getAgreementsDefByBusinessId(businessId?: number): Observable<AgreementDefinition[]> {
    return this._cachingService.
      getCached<AgreementDefinition[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.AGREEMENTS_DEF_ENROLLMENT}/${businessId}`)
      .pipe(map(p => (p as AgreementDefinition[])))
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all currencies
   */
  getCurrencies() {
    return this._cachingService.getCached<Currency[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.CURRENCIES}`)
      .pipe(map(p => (p as any).currencies))
      .pipe(catchError(this.handleError));
  }

  /**
   * Get banks
   */
  getCustomerBanksByCountryId(countryId) {
    // tslint:disable-next-line: max-line-length
    return this._cachingService.getCached<BankAccountType[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.COUNTRIES}/${countryId}/${this.CUSTOMERBANKS}?visibleOnline=true`)
      .pipe(map(p => (p as any).customerBanks))
      .pipe(catchError(this.handleError));
  }

  getFinanceDependenciesByinsurance(insurance) {
    // tslint:disable-next-line: max-line-length
    return this._http.get<FinanceDependencyDto>(`${this._config.apiHostCommon}/${this.COMMON}/${this.BUSINESS}/${insurance}/${this.FINANCEDEPENDENCIES}`)
      .pipe(catchError(this.handleError));
  }

  getStatesByCountryId(countryId) {
    // tslint:disable-next-line: max-line-length
    return this._cachingService.getCached<StateResponse[]>(`${this._config.apiHostCommon}/${this.COMMON}/${this.COUNTRIES}/${countryId}/${this.STATES}`)
      .pipe(map(p => (p as any).states))
      .pipe(catchError(this.handleError));
  }

}
