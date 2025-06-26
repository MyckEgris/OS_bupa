import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { PolicyDto } from '../policy/entities/policy.dto';
import { PaymentDto } from './entities/paymentPolicy.dto';
import { ConfigurationService } from '../configuration/configuration.service';
import { PaymentResponseDto } from './entities/paymentResponse.dto';
import { InsuranceBusiness } from '../../classes/insuranceBusiness.enum';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../notification/notification.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { IgnoreInterceptorTypeNames } from '../../classes/ignoreInterceptorType.enum';
import { catchError } from 'rxjs/operators';
import { TransactionDto } from './entities/transaction.dto';
import { throwError } from 'rxjs';
import { TransactionResponseDto } from './entities/transactionResponse.dto';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private policyToPay: PolicyDto;
  private paymentResponse: PaymentResponseDto;
  private amountPaid: number;
  private paymentTransactionError: TransactionDto;


  /**
  * Constant for transaction endpoint
  */
  private TRANSACTIONS = 'transactions';

   /**
  * Constant for transaction endpoint
  */
 private TRANSACTIONS_STATUS = 'transactions/getTransactionStatus';


  constructor(private http: HttpClient,
    private config: ConfigurationService,
    private translate: TranslateService,
    private translationService: TranslationService,
    private notification: NotificationService,
    private authService: AuthService) { }

  POLICIES = 'policies';
  PAYMENTS = 'payments';


  // Obtain Policy to pay
  public getPolicyToPay(policyId: number)
    : PolicyDto {
    if (this.policyToPay != null) {
      if (this.policyToPay.policyId === policyId) {
        return this.policyToPay;
      }
    }
    return null;
  }

  // set policy to pay
  public setPolicyToPay(policyToPayIn: PolicyDto) {
    this.policyToPay = policyToPayIn;
  }

  // Execute payment, send payment dto
  public excecutePayment(paymentObject: PaymentDto) {

    const headers = new HttpHeaders()
      .set(IgnoreInterceptorTypeNames.ERROR_400, IgnoreInterceptorTypeNames.ERROR_400);

    return this.http.post<PaymentResponseDto>(`${this.config.apiHostPayments}/${this.PAYMENTS}`, paymentObject, { headers: headers });
  }

  // set amount paid
  public setAmountPaid(requestAmountPaid: number) {
    this.amountPaid = requestAmountPaid;
  }

  // set result pay policy
  public setResultPayPolicy(resultPayment: PaymentResponseDto) {
    this.paymentResponse = resultPayment;
  }

  // obtaint result pay policy
  public getResultPayPolicy() {
    return this.paymentResponse;
  }

  public setErrorPayPolicy(response: TransactionDto) {
    this.paymentTransactionError = response;
  }

  public getErrorPayPolicy() {
    return this.paymentTransactionError;
  }

  // obtain amount paid
  public getAmountPaid() {
    return this.amountPaid;
  }

  /**
   * Validate can be pay policy.
   * @param policy policy to pay.
   */
  validtePayPolicy(policy: PolicyDto) {
    if (this.getBupaInserance(policy) === InsuranceBusiness.BUPA_MEXICO) {
      if (policy.exchangeRate && policy.exchangeRate > 0) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  }

  /***
   * Show Message Payment Status
   */
  showMessagePaymentStatus(policyObject: PolicyDto) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`POLICY.PAYMENTSTATUS.${policyObject.paymentStatus.replace(' ', '_').toUpperCase()}`).subscribe(
      result => message = result
    );
    this.translate.get(`POLICY.PAYMENT_STATUS`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /***
   * Get Bupa Inserance policy/user
   */
  getBupaInserance(policy: PolicyDto): number {
    if (policy && policy.insuranceBusinessId) {
      return policy.insuranceBusinessId;
    } else {
      return Number(this.authService.getUser().bupa_insurance);
    }
  }

  /***
   * Validate if can make payment
   */
  public validateCanMakePayment(policy: PolicyDto): boolean {
    const bupaInsurance = this.getBupaInserance(policy);
    const rolId = this.authService.getUser().role_id;
    const validBupaInsurance = [InsuranceBusiness.BUPA_MEXICO,
    InsuranceBusiness.BUPA_TRINIDAD_AND_TOBAGO,
    InsuranceBusiness.BUPA_ECUADOR,
    InsuranceBusiness.IHI,
    InsuranceBusiness.IHI_PSI,
    InsuranceBusiness.BUPA_PANAMA,
    InsuranceBusiness.BUPA,
    InsuranceBusiness.BUPA_BOLIVIA,
    InsuranceBusiness.BUPA_BOLIVIA_IHI,
    InsuranceBusiness.BUPA_DR,
    InsuranceBusiness.BUPA_PR,
    InsuranceBusiness.BUPA_GUATEMALA];
    return (validBupaInsurance.indexOf(bupaInsurance) > -1);
  }

  /**
 * Error handler.
 * @param error HttpErrorResponse.
 */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  // Execute payment, send payment dto
  startTransaction(transaction: TransactionDto) {
    return this.http.post<TransactionResponseDto>(`${this.config.apiHostPaymentTransaction}/${this.TRANSACTIONS}`, transaction)
      .pipe(catchError(this.handleError));
  }


  confirmTransaction(transaction: TransactionDto) {
    return this.http.patch<TransactionResponseDto>(`${this.config.apiHostPaymentTransaction}/${this.TRANSACTIONS}`, transaction)
      .pipe(catchError(this.handleError));
  }

  getCurrencyCode(policy: PolicyDto): string {
    return policy.currencyId === 131 ? 'MXN' : 'USD';
  }
  buildStartTransactionRequest(user: any, policy: PolicyDto): TransactionDto {

    const bupaInsurance = this.getBupaInserance(policy);

    const transaction = {
      transactionMode: 1,
      transactionLogId: '0',
      transactionFingerKey: null,
      transactionExternalKey: null,
      transactionErrorCode: null,
      transactionMessage: null,
      transactionStatusId: null,
      language: this.getLanguage(),
      payment: {
        paymentId: 0,
        transactionLogId: '0',
        paymentGatewayId: '',
        policyId: policy.policyId,
        premiumId: policy.premiumId,
        number: policy.number,
        policy: {
          policyId: policy.policyId,
          policyReference: null,
          fixedRate: policy.fixedRate,
          firstName: policy.firstName,
          middleName: null,
          lastName: policy.lastName,
          phoneNumber: null,
          email: null,
          plan: {
            id: policy.planId,
            name: policy.plan,
            description: policy.planDescription,
            productId: policy.productId
          },
          modeOfPayment: policy.modeOfPayment
        },
        businessId: bupaInsurance,
        paymentMethodId: 11,
        paymentDataCreditCard: {
          amountApply: policy.amountToPay,
          amountApplyUSD: policy.amountUSDToPay,
          currencyId: policy.currencyId,
          currencySymbolIso3: this.getCurrencyCode(policy),
          accountFirstName: null,
          accountLastName: null,
          cardNumber: null,
          creditCardTypeId: 0,
          expirationMonth: 0,
          expirationYear: 0,
          isOneTime: true,
          isPrimary: true,
          ExchangeRate: policy.exchangeRate,
          AutomaticDeduction: policy.automaticDeduction
        },
        paymentDataElectronicCheck: null,
        authorizationCode: null
      }
    };

    return transaction;
  }

  // Method for get transaction status
  getTransactionStatus(transaction: TransactionDto) {
    return this.http.post<TransactionResponseDto>(`${this.config.apiHostPaymentTransaction}/${this.TRANSACTIONS_STATUS}`, transaction)
      .pipe(catchError(this.handleError));
  }

  buildGeTransactionStatus(transactionLogId: any, policyId: number): TransactionDto {

    const transaction = {
      transactionMode: 3,
      transactionLogId: transactionLogId,
      transactionFingerKey: null,
      transactionExternalKey: null,
      transactionErrorCode: null,
      transactionMessage: null,
      transactionStatusId: null,
      language: null,
      payment: {
        paymentId: 0,
        transactionLogId: transactionLogId,
        paymentGatewayId: '',
        policyId: policyId,
        premiumId: 0,
        number: null,
        policy: {
          policyId: policyId,
          policyReference: null,
          fixedRate: 0,
          firstName: '',
          middleName: null,
          lastName: '',
          phoneNumber: null,
          email: null,
          plan: {
            id: 0,
            name: null,
            description: null,
            productId: 0
          },
          modeOfPayment : null
        },
        businessId: 0,
        paymentMethodId: 0,
        paymentDataCreditCard: {
          amountApply: 0,
          amountApplyUSD: 0,
          currencyId: 0,
          currencySymbolIso3: null,
          accountFirstName: null,
          accountLastName: null,
          cardNumber: null,
          creditCardTypeId: 0,
          expirationMonth: 0,
          expirationYear: 0,
          isOneTime: true,
          isPrimary: true,
          ExchangeRate: 0,
          AutomaticDeduction: false
        },
        paymentDataElectronicCheck: null,
        authorizationCode: null
      }
    };

    return transaction;
  }

  buildApplyTransactionRequest(user: any, policy: PolicyDto, transactionExternalId: string, transactionLogId: string): TransactionDto {

    const bupaInsurance = this.getBupaInserance(policy);

    const transaction = {
      transactionMode: 2,
      transactionLogId: transactionLogId,
      transactionFingerKey: null,
      transactionExternalKey: transactionExternalId,
      transactionErrorCode: null,
      transactionMessage: null,
      transactionStatusId: null,
      language: this.getLanguage(),
      payment: {
        paymentId: 0,
        transactionLogId: transactionLogId,
        paymentGatewayId: '',
        policyId: policy.policyId,
        premiumId: policy.premiumId,
        number: policy.number,
        policy: {
          policyId: policy.policyId,
          policyReference: null,
          fixedRate: policy.fixedRate,
          firstName: policy.firstName,
          middleName: null,
          lastName: policy.lastName,
          phoneNumber: null,
          email: null,
          plan: {
            id: policy.planId,
            name: policy.plan,
            description: policy.planDescription,
            productId:  policy.productId
          },
          modeOfPayment : null
        },
        businessId: bupaInsurance,
        paymentMethodId: 11,
        paymentDataCreditCard: {
          amountApply: policy.amountToPay,
          amountApplyUSD: policy.amountToPay,
          currencyId: policy.currencyId,
          currencySymbolIso3: this.getCurrencyCode(policy),
          accountFirstName: null,
          accountLastName: null,
          cardNumber: null,
          creditCardTypeId: 0,
          expirationMonth: 0,
          expirationYear: 0,
          isOneTime: true,
          isPrimary: true,
          ExchangeRate: policy.exchangeRate,
          AutomaticDeduction: policy.automaticDeduction
        },
        paymentDataElectronicCheck: null,
        authorizationCode: null
      }
    };

    return transaction;
  }

  setPaymentResponse(policy: PolicyDto, transactionResult: any) {
    policy.payments.push(
      {
        amountUSDtoPay: transactionResult.amountApplyedUSD,
        paymentId: transactionResult.paymentId,
        policyId: transactionResult.policyId,
        amount: transactionResult.amountApplyedUSD,
        currencySymbol: '',
        paymentDate: '',
        paymentMethod: '',
        accountNumber: 0,
        confirmationNumber: 0,
        reference: '',
        paymentStatus: '',
        currencySimbol: '',
        exchangeRate: 0,
        paymentDateToShow: '',
        paymentMethodId: 0,
        issueDate: '',
        paidTo: ''
      }
    );
  }

  getLanguage(): string {
    return this.translationService.getLanguage();
  }
}
