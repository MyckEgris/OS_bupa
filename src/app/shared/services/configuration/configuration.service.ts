/**
* ConfigurationService.ts
*
* @description: This class gets the configuration keys at application.
* @author Juan Camilo Moreno.
* @author Yefry Lopez.
* @author Ivan Alajandro Hidalgo.
* @version 1.0
* @date 17-09-2018.
*
**/

import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { IStorage, StorageKind } from '../cache/cache.index';
import { CacheService } from '../cache/cache.service';
import { environment } from '../../../../environments/environment';
import { InsuranceBusiness } from '../../classes/insuranceBusiness.enum';
import { LZStringService } from 'ng-lz-string';

/**
 * This class gets the configuration keys at application.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  /**
   * business Id for mexico
   */
  private mexicoBusinessId = '41';

  /**
   * Flag that indicates if it should load local or server configuration
   */
  private configLoaded: boolean;

  /**
   * Indicates kind of storage
   */
  private storage: IStorage;

  /**
   * Identity parameter for issuer
   */
  private issuer: string;

  /**
   * Identity parameter for client Id
   */
  private clientId: string;

  /**
   * Identity parameter for scopes
   */
  public scope: string;

  /**
   * Identity parameter for oidc
   */
  private oidc: boolean;

  /**
   * Identity parameter for discovery document
   */
  private strictDiscoveryDocumentValidation: boolean;

  /**
   * Identity parameter for post logout url
   */
  private postLogoutRedirectUri: string;

  /**
   * Identity parameter for logout url endpoint
   */
  private logoutUrl: string;


  /**
   * Identity parameter for clear hash
   */
  private clearHashAfterLogin: boolean;

  /**
   * Constant for token access cookie name
   */
  private COOKIE_NAME = 'Y29uZmln';

  /**
   * Constant for policy cookie name
   */
  public KEY_POLICY = 'R30uPmln89';

  /**
   * Constant for policy id cookie name
   */
  public KEY_POLICY_ID = 'cG9saWN5aWQ';

  /**
   * Parameter response type
   */
  public responseType: string;

  /**
   * Root endpoint for user API
   */
  public apiHost: string;

  /**
   * Array of system languages
   */
  public languages: string[];

  /**
   * Identity parameter for redirect url
   */
  public redirectUri: string;

  /**
   * Return url
   */
  public returnUrl: string;

  /**
   * Idle minutes
   */
  public idle: number;

  /**
   * idle timeout
   */
  public timeout: number;

  /**
   * Root endpoint for amigos plus API
   */
  public apiHostAmigosPlus: string;

  /**
   * Root endpoint for common API
   */
  public apiHostCommon: string;

  /**
   * Root endpoint for common CRM API
   */
  public apiHostCommonCrm: string;

  /**
   * Root endpoint for policy API
   */
  public apiHostPolicy: string;

  /**
   * Root endpoint for providers API
   */
  public apiHostProviders: string;

  /**
   * Root endpoint for claims API
   */
  public apiHostClaims: string;

  /**
   * Root endpoint for claim submission API
   */
  public apiHostClaimSubmission: string;

  /**
   * Root endpoint for Agent API
   */
  public apiHostAgent: string;

  /**
   * claimSubmissionFileTypes file types to upload
   */
  public claimSubmissionFileTypes: string;

  /**
   * claimSubmissionFileTypesNoXml file types whitout XML to upload
   */
  public claimSubmissionFileTypesNoXml: string;

  /**
   * interactions file types
   */
  public interactionsFileTypes: string;

  /**
   * claimSubmissionMaxFileSize for max size of type can upload
   */
  public claimSubmissionMaxFileSize: number;

  /**
   * claimSubmissionMaxFileQuantity for max quantity of files can upload currently
   */
  public claimSubmissionMaxFileQuantity: number;

  /**
   * currencyUsdId is the value of USD currency in Amigos Plus
   */
  public currencyUsdId: number;

  /**
   * currencyUsdSymbol is the symbol of USD currency in Amigos Plus
   */
  public currencyUsdSymbol: string;

  /**
   * PaymentHistoricPageSize sets the page size for payment historic
   */
  public paymentHistoricPageSize: number;

  /**
   * paymentMethodTypeMex stores the payment types for Mexico (CC)
   */
  public paymentMethodTypeMex: string;

  /**
   * paymentMethodTypeGlobal stores the payment types for all countries but Mexico (CC|Cheque|WT)
   */
  public paymentMethodTypeGlb: string;

  /**
   * paymentMethodTypePanama stores the payment types for Panama (CC)
   */
  public paymentMethodTypePanama: string;

  /**
   * paymentMethodTypeEcuador stores the payment types for Ecuador (CC)
   */
  public paymentMethodTypeEcuador: string;

  /**
   * Root endpoint for policy-application API
   */
  public apiHostPolicyApplication: string;

  /**
   * Root endpoint for payment-application API
   */
  public apiHostPayments: string;

  /**
   * Path for the static files URL
   */
  public staticHtmlFileRoot: string;

  /**
   * apiHost Impersonation
   */
  public apiHostImpersonation: string;

  /**
   * Api host change portfolio of configuration service
   */
  public apiHostChangePortfolio: string;

  /**
   * Api host for Bupa.Medicals
   */
  public apiHostMedicals: string;

  /**
   * client Id Impersonation
   */
  public clientIdImpersonation: string;

  /**
   * scope Impersonation
   */
  public scopeImpersonation: string;

  /**
   * authorization Impersonation
   */
  public authorizationImpersonation: string;

  /**
   * convert date token to DD/MM/YYYY
   */
  public convertDateToken: boolean;

  public googleCaptchaSiteKey: string;

  public googleCaptchaSiteKeyInvisible: string;

  public clientIdPaymentWithoutLoggin: string;

  public scopePaymentWithoutLoggin: string;

  public userPolicyPayment: string;

  public passwordPolicyPayment: string;

  public numberOfClaimsForEboBundle: number;

  /**
   * Root endpoint for customer API
   */
  public apiHostCustomer: string;

  /**
   * Inquiry File Types
   */
  public inquiryFileTypes: string;

  /**
   * Root endpoint for notification API
   */
  public apiHostEventNotification: string;

  /**
   * Root endpoint for preAuthorization API
   */
  public apiHostPreAuthorization: string;

  /**
   * Files allowed for prior authorizations
   */
  public preAuthFileTypes: string;

  /**
   * Files allowed for policy changes
   */
  public changePolicyFileTypes: string;

  /**
   * Array of Bupa Insurances whit own Dictionary Resource.
   */
  public insuranceResources: string[];

  /**
   * ApiHost Quote.
   */
  public apiHostQuote: string;

  /**
   * Root endpoint for Payment Transaction
   */
  public apiHostPaymentTransaction: string;

  /**
   * ApiHost Quote Engine.
   */
  public apiHostQuoteEngine: string;

  /**
   * Policy Aplication File Types.
   */
  public policyAplicationFileTypes: string;

  /**
   * networkProvidersFiles for type of files to upload
   */
  public networkProvidersFiles: string;

  /**
   * networkProvidersMaxFileSize for max size of type can upload
   */
  public networkProvidersMaxFileSize: number;

  /**
   * networkProvidersMaxFileQuantity for max quantity of files can upload currently
   */
  public networkProvidersMaxFileQuantity: number;

  /**
   * Root endpoint for Network Provider API
   */
  public apiHostNetworks: string;

  /**
   * Root endpoint for Products API
   */
  public apiHostProducts: string;

  /**
   * Root endpoint for Coverages API
   */
  public apiHostCoverages: string;

  /**
   * New Business Quotation URL.
   */
  public newBusinessQuotationUrl: string;

  /**
   * IHI Bupa Insurances .
   */
  public ihiBupaInsurances: string;

  /**
   *  New Business Quotes' URLs which are authorized to throw events to Policy Application.
   */
  public newBusinessQuoteUrlsAuthorized: string;

  /**
   * paymentMethodTypeGblOnlyCC stores the payment types for only (CC)
   */
  public paymentMethodTypeGblOnlyCC: string;

  /**
   * Constant for Inquiry subStep
   */
  public subStepInquiry: string;

  /**
   * Constant for Telemedicine subStep
   */
  public subStepTelemedicine: string;

  public chatbotSource: string;

  public chatbotDataOrgId: string;

  public chatbotDataOrgUrl: string;

  public chatbotDataAppIdEng: string;

  public chatbotDataAppIdSpa: string;

  public apiHostFinance: string;

  public splitRedirectUrl: string;

  public mexicoCostumerServicePhone: string;
  public mexicoCostumerServiceMail: string;
  public bglaCostumerServicePhone: string;
  public bglaCostumerServiceMail: string;
  public goToHomeTitleCurrentBusiness: string;
  public goToHomeTitleOffsideBusiness: string;
  public authformCurrentBusiness: string;
  public authformOffsideBusiness: string;
  public providersMail: string;
  public inactivityMXPortal: string;
  public npsSurveyUrl: string;

  /*APIM Connection*/
  public apimHost: string;
  public apimSubscription: string;
  /**
   * Constructor Method
   * @param cache Cache Service Injection
   */
  constructor(private cache: CacheService, private lz: LZStringService) {
    this.storage = this.cache.storage(StorageKind.InCookieStorage);
  }


  public stringToByteArray(str) {
    const array = [];
    let i = 0;
    let il = 0;

    for (i = 0, il = str.length; i < il; ++i) {
      // tslint:disable-next-line:no-bitwise
      array.push(str.charCodeAt(i));
    }

    return array;
  }



  /**
   * Method for load at initialization of application
   */
  public load() {
    if (!this.configLoaded) {
      this.configLoaded = true;
      try {
        const config64 = this.storage.get(this.COOKIE_NAME);
        if (config64) {

          const config = atob(config64);
          const parameters: Array<any> = config.split('.');
          const baseHost = atob(parameters[0]);
          const digitalHost = atob(parameters[31]);
          this.apiHost = baseHost + atob(parameters[1]);
          this.issuer = baseHost + atob(parameters[2]);
          this.redirectUri = atob(parameters[3]);
          this.responseType = atob(parameters[4]);
          this.clientId = atob(parameters[5]);
          this.scope = atob(parameters[6]);
          this.oidc = (atob(parameters[7]) === 'true' ? true : false);
          this.strictDiscoveryDocumentValidation = (atob(parameters[8]) === 'false' ? false : true);
          this.postLogoutRedirectUri = baseHost + atob(parameters[9]);
          this.logoutUrl = baseHost + atob(parameters[10]);
          this.clearHashAfterLogin = (atob(parameters[11]) === 'true' ? true : false);
          this.languages = 'SPA;ENG'.split(';');
          this.idle = 3600;
          this.timeout = 60;
          this.returnUrl = baseHost + atob(parameters[12]);
          this.apiHostAmigosPlus = digitalHost + 'AmigosPlusNotification/api/v1';
          this.apiHostCommon = digitalHost + 'Common/api/v1';
          this.apiHostPolicy = digitalHost + 'Policy/api/v1';
          this.apiHostProviders = digitalHost + 'Provider/api/v1';
          this.apiHostClaims = digitalHost + 'Claims/api/v1';
          this.apiHostClaimSubmission = digitalHost + 'ClaimSubmission/api/v1';
          this.claimSubmissionFileTypes = 'image:.jpeg,.jpg,.gif|pdf:.pdf|code:.xml';
          this.claimSubmissionFileTypesNoXml = 'image:.jpeg,.jpg,.png,.gif|pdf:.pdf';
          // this.interactionsFileTypes = 'image:.jpeg,.jpg,.gif,.bmp|pdf:.pdf|word:.doc,.docx|excel:.xsl,.xslx|email:.msg|zip:.zip';
          this.interactionsFileTypes = 'image:.jpeg,.jpg,.gif|pdf:.pdf';
          this.claimSubmissionMaxFileSize = 10;
          this.claimSubmissionMaxFileQuantity = 100;
          this.currencyUsdId = 192;
          this.currencyUsdSymbol = 'USD';
          this.apiHostAgent = digitalHost + 'Agent/api/v1';
          this.paymentHistoricPageSize = 5;
          this.paymentMethodTypeMex = 'CC';
          this.paymentMethodTypeGlb = 'CC|Cheque|WT';
          this.apiHostPolicyApplication = digitalHost + 'Enrollment/api/v1';
          this.apiHostPayments = digitalHost + 'Payment/api/v1';
          this.staticHtmlFileRoot = baseHost + '/assets';
          this.apiHostImpersonation = baseHost + atob(parameters[13]);
          this.clientIdImpersonation = atob(parameters[14]);
          this.scopeImpersonation = atob(parameters[15]);
          this.authorizationImpersonation = atob(parameters[16]);
          this.convertDateToken = true;
          this.googleCaptchaSiteKey = atob(parameters[17]);
          this.clientIdPaymentWithoutLoggin = atob(parameters[18]);
          this.scopePaymentWithoutLoggin = atob(parameters[19]);
          this.userPolicyPayment = (atob((atob(parameters[20]))));
          this.passwordPolicyPayment = (atob((atob(parameters[21]))));
          this.numberOfClaimsForEboBundle = 25;
          this.googleCaptchaSiteKeyInvisible = (atob(parameters[22]));
          this.apiHostCustomer = digitalHost + 'Customer/api/v1';
          this.inquiryFileTypes = 'image:.jpeg,.jpg,.gif,.bmp|pdf:.pdf|code:.xml';
          this.apiHostEventNotification = digitalHost + 'Notification/api/v1';
          this.apiHostPreAuthorization = digitalHost + 'ClaimsPreAuthorization/api/v1';
          this.preAuthFileTypes = 'image:.jpeg,.jpg,.gif,.bmp|pdf:.pdf';
          this.paymentMethodTypePanama = 'CC';
          this.changePolicyFileTypes = 'image:.jpeg,.jpg,.gif|pdf:.pdf';
          this.insuranceResources = 'SPA_41;SPA_56;SPA_39;ENG_41'.split(';');
          this.apiHostQuote = digitalHost + 'AmigosPlusQuotes/api/v1';
          this.apiHostChangePortfolio = baseHost + (atob(parameters[23]));
          this.apiHostMedicals = digitalHost + 'Medical/api/v1';
          this.apiHostQuoteEngine = digitalHost + 'Quote/api/v1';
          this.apiHostPaymentTransaction = digitalHost + 'Payment/api/v1';
          this.policyAplicationFileTypes = 'image:.jpeg,.jpg,.gif,.bmp|pdf:.pdf';
          this.networkProvidersFiles = 'code:.xlsx';
          this.networkProvidersMaxFileSize = 25;
          this.networkProvidersMaxFileQuantity = 1;
          this.apiHostNetworks = digitalHost + 'NetworkProvider/api/v1';
          this.apiHostProducts = digitalHost + 'Product/api/v1';
          this.newBusinessQuotationUrl = atob(parameters[24]);
          this.ihiBupaInsurances = '45,49,50,51,52,54,59';
          this.newBusinessQuoteUrlsAuthorized = atob(parameters[25]);
          this.apiHostCoverages = digitalHost + 'Coverage/api/v1';
          this.paymentMethodTypeGblOnlyCC = 'CC';
          this.subStepInquiry = 'inquiry';
          this.subStepTelemedicine = 'telemedicine';
          this.paymentMethodTypeEcuador = 'CC';
          this.chatbotSource = atob(parameters[26]);
          this.chatbotDataOrgId = atob(parameters[27]);
          this.chatbotDataOrgUrl = atob(parameters[28]);
          this.chatbotDataAppIdEng = atob(parameters[29]);
          this.chatbotDataAppIdSpa = atob(parameters[30]);
          this.splitRedirectUrl = atob(parameters[32]);
          this.apiHostCommonCrm = baseHost + 'Bupa.Common/CommonCrmApi/api/v1';
          this.apiHostFinance = digitalHost + 'Finance/api/v1';
          this.mexicoCostumerServicePhone = atob(parameters[33]);
          this.mexicoCostumerServiceMail = atob(parameters[34]);
          this.bglaCostumerServicePhone = atob(parameters[35]);
          this.bglaCostumerServiceMail = atob(parameters[36]);
          this.goToHomeTitleCurrentBusiness = atob(parameters[37]);
          this.goToHomeTitleOffsideBusiness = atob(parameters[38]);
          this.authformCurrentBusiness = atob(parameters[39]);
          this.authformOffsideBusiness = atob(parameters[40]);
          this.providersMail = atob(parameters[41]);
          this.inactivityMXPortal = atob(parameters[42]);
          this.npsSurveyUrl = atob(parameters[43]);
          this.apimHost = atob(parameters[44]);
          this.apimSubscription = atob(parameters[45]);
        } else {
          this.apiHost = environment.apiHost;
          this.issuer = environment.issuer;
          this.redirectUri = environment.redirectUri;
          this.responseType = environment.responseType;
          this.clientId = environment.clientId;
          // tslint:disable-next-line:max-line-length
          this.scope = environment.scope;
          this.oidc = environment.oidc;
          this.strictDiscoveryDocumentValidation = environment.strictDiscoveryDocumentValidation;
          this.postLogoutRedirectUri = environment.postLogoutRedirectUri;
          this.logoutUrl = environment.logoutUrl;
          this.clearHashAfterLogin = environment.clearHashAfterLogin;
          this.languages = environment.languages.split(',');
          this.idle = environment.idle;
          this.timeout = environment.timeout;
          this.returnUrl = environment.returnUrl;
          this.apiHostAmigosPlus = environment.apiHostAmigosPlus;
          this.apiHostCommon = environment.apiHostCommon;
          this.apiHostPolicy = environment.apiHostPolicy;
          this.apiHostProviders = environment.apiHostProviders;
          this.apiHostClaims = environment.apiHostClaims;
          this.apiHostClaimSubmission = environment.apiHostClaimSubmission;
          this.claimSubmissionFileTypes = environment.claimSubmissionFileTypes;
          this.claimSubmissionFileTypesNoXml = environment.claimSubmissionFileTypesNoXml;
          // this.interactionsFileTypes = 'image:.jpeg,.jpg,.gif,.bmp|pdf:.pdf|word:.doc,.docx|excel:.xsl,.xslx|email:.msg|zip:.zip';
          this.interactionsFileTypes = environment.interactionsFileTypes;
          this.claimSubmissionMaxFileSize = environment.claimSubmissionMaxFileSize;
          this.claimSubmissionMaxFileQuantity = environment.claimSubmissionMaxFileQuantity;
          this.currencyUsdId = environment.currencyUsdId;
          this.currencyUsdSymbol = environment.currencyUsdSymbol;
          this.apiHostAgent = environment.apiHostAgent;
          this.paymentHistoricPageSize = environment.paymentHistoricPageSize;
          this.paymentMethodTypeMex = environment.paymentMethodTypeMex;
          this.paymentMethodTypeGlb = environment.paymentMethodTypeGlb;
          this.apiHostPolicyApplication = environment.apiHostPolicyApplication;
          this.apiHostPayments = environment.apiHostPayments;
          this.staticHtmlFileRoot = environment.staticHtmlFileRoot;
          this.apiHostImpersonation = environment.apiHostImpersonation;
          this.clientIdImpersonation = environment.clientIdImpersonation;
          this.scopeImpersonation =environment.scopeImpersonation;
          this.authorizationImpersonation = environment.authorizationImpersonation;
          this.convertDateToken = environment.convertDateToken;
          this.googleCaptchaSiteKey = environment.googleCaptchaSiteKey;
          this.clientIdPaymentWithoutLoggin = environment.clientIdPaymentWithoutLoggin;
          this.scopePaymentWithoutLoggin = environment.scopePaymentWithoutLoggin;
          this.userPolicyPayment = environment.userPolicyPayment;
          this.passwordPolicyPayment = environment.passwordPolicyPayment;
          this.numberOfClaimsForEboBundle = environment.numberOfClaimsForEboBundle;
          this.googleCaptchaSiteKeyInvisible = environment.googleCaptchaSiteKeyInvisible;
          this.apiHostCustomer = environment.apiHostCustomer;
          this.inquiryFileTypes = environment.inquiryFileTypes;
          this.apiHostEventNotification = environment.apiHostEventNotification;
          this.apiHostPreAuthorization = environment.apiHostPreAuthorization;
          this.preAuthFileTypes = environment.preAuthFileTypes;
          this.paymentMethodTypePanama = environment.paymentMethodTypePanama;
          this.changePolicyFileTypes = environment.changePolicyFileTypes;
          this.insuranceResources = environment.insuranceResources.split(';');
          this.apiHostQuote = environment.apiHostQuote;
          this.apiHostChangePortfolio = environment.apiHostChangePortfolio;
          this.apiHostMedicals = environment.apiHostMedicals;
          this.apiHostQuoteEngine = environment.apiHostQuoteEngine;
          this.apiHostPaymentTransaction = environment.apiHostPaymentTransaction;
          this.policyAplicationFileTypes = environment.policyAplicationFileTypes;
          this.networkProvidersFiles = environment.networkProvidersFiles;
          this.networkProvidersMaxFileSize = environment.networkProvidersMaxFileSize;
          this.networkProvidersMaxFileQuantity = environment.networkProvidersMaxFileQuantity;
          this.apiHostNetworks = environment.apiHostNetworks;
          this.apiHostProducts = environment.apiHostProducts;
          this.newBusinessQuotationUrl = environment.newBusinessQuotationUrl;
          this.ihiBupaInsurances = environment.ihiBupaInsurances;
          this.newBusinessQuoteUrlsAuthorized = environment.newBusinessQuoteUrlsAuthorized;
          this.apiHostCoverages = environment.apiHostCoverages;
          this.paymentMethodTypeGblOnlyCC = environment.paymentMethodTypeGblOnlyCC;
          this.subStepInquiry = environment.subStepInquiry;
          this.subStepTelemedicine = environment.subStepTelemedicine;
          this.paymentMethodTypeEcuador = environment.paymentMethodTypeEcuador;
          this.chatbotSource = environment.chatbotSource;
          this.chatbotDataOrgId = environment.chatbotDataOrgId;
          this.chatbotDataOrgUrl = environment.chatbotDataOrgUrl;
          this.chatbotDataAppIdEng = environment.chatbotDataAppIdEng;
          this.chatbotDataAppIdSpa = environment.chatbotDataAppIdSpa;
          this.splitRedirectUrl = environment.splitRedirectUrl;
          this.apiHostCommonCrm = environment.apiHostCommonCrm;
          this.apiHostFinance = environment.apiHostFinance;
          this.mexicoCostumerServicePhone = environment.mexicoCostumerServicePhone;
          this.mexicoCostumerServiceMail = environment.mexicoCostumerServiceMail;
          this.bglaCostumerServicePhone = environment.bglaCostumerServicePhone;
          this.bglaCostumerServiceMail = environment.bglaCostumerServiceMail;
          this.goToHomeTitleCurrentBusiness = environment.goToHomeTitleCurrentBusiness;
          this.goToHomeTitleOffsideBusiness = environment.goToHomeTitleOffsideBusiness;
          this.authformCurrentBusiness = environment.authformCurrentBusiness;
          this.authformOffsideBusiness = environment.authformOffsideBusiness;
          this.providersMail = environment.providersMail;
          this.inactivityMXPortal = environment.inactivityMXPortal;
          this.npsSurveyUrl = environment.npsSurveyUrl;
          this.apimHost = environment.apimHost;
          this.apimSubscription = environment.apimSubscription;
        }
      } catch (error) {
      }
    }

    this.deleteConfig();
  }

  public deleteConfig() {
    try {
      this.storage.delete(this.COOKIE_NAME);
    } catch { }
  }

  /**
   * Get Authentication configuration
   * @param lang Language
   * @param redirectUriParam Redirect url
   */
  public getAuthConfig(lang: string, redirectUriParam: string): AuthConfig {
    this.load();
    return new AuthConfig({
      issuer: this.issuer,
      customQueryParams: { lang: lang, returnUrl: this.returnUrl },
      redirectUri: redirectUriParam,
      responseType: this.responseType,
      clientId: this.clientId,
      scope: this.scope,
      oidc: this.oidc,
      strictDiscoveryDocumentValidation: this.strictDiscoveryDocumentValidation,
      postLogoutRedirectUri: this.postLogoutRedirectUri,
      logoutUrl: this.logoutUrl,
      clearHashAfterLogin: this.clearHashAfterLogin
    });
  }

  public getPaymentMethodTypes(business: number): string[] {
    let typesString = '';
    switch (business) {
      case InsuranceBusiness.BUPA_MEXICO:
        typesString = this.paymentMethodTypeMex;
        break;
      case InsuranceBusiness.BUPA_PANAMA:
        typesString = this.paymentMethodTypePanama;
        break;
      case InsuranceBusiness.BUPA_ECUADOR:
        typesString = this.paymentMethodTypeEcuador;
        break;
      case InsuranceBusiness.BUPA_DR:
        typesString = this.paymentMethodTypeGblOnlyCC;
        break;
      case InsuranceBusiness.BUPA_GUATEMALA:
        typesString = this.paymentMethodTypeGblOnlyCC;
        break;
      case InsuranceBusiness.BUPA_BOLIVIA:
        typesString = this.paymentMethodTypeGblOnlyCC;
        break;
      case InsuranceBusiness.BUPA_BOLIVIA_IHI:
        typesString = this.paymentMethodTypeGblOnlyCC;
        break;
      case InsuranceBusiness.IHI_PROSEGUROS:
        typesString = this.paymentMethodTypeGblOnlyCC;
        break;
      case InsuranceBusiness.IHI_HSBC:
        typesString = this.paymentMethodTypeGblOnlyCC;
        break;
      default:
        typesString = this.paymentMethodTypeGlb;
        break;
    }
    return typesString.split('|');
  }
}
