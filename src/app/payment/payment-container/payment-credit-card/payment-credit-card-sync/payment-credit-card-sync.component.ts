import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TypeCreditCard } from 'src/app/shared/classes/typeCreditCard.enum';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { City } from 'src/app/shared/services/common/entities/city';
import { State } from 'src/app/shared/services/common/entities/state';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { CustomCurrencyPipe } from 'src/app/shared/pipes/currency/custom-currency.pipe';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { TranslateService } from '@ngx-translate/core';
import { PaymentDto } from 'src/app/shared/services/payment/entities/paymentPolicy.dto';
import { DecimalPipe, Location } from '@angular/common';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';


@Component({
  selector: 'app-payment-credit-card-sync',
  templateUrl: './payment-credit-card-sync.component.html',
  providers: [CustomCurrencyPipe, DecimalPipe]
})
export class PaymentCreditCardSyncComponent implements OnInit {

  @Input() policy: PolicyDto;

  public paymentForm: FormGroup;
  payment = new PaymentDto();

  private defaultDateFormat = 'MM/dd/yyyy';


  // Maximun character for credit Card
  public maxChars = 16;
  // Maximum character for CVC
  public maxCVC = 3;

  // Save code Policy Insurance
  bupaInsurance: number;

  // stateId selected from the dropdown when the business is mexico.
  public stateId: number;
  // state name selected from the dropdown when the business is mexico.
  public stateName: string;
  // cityId selected from the dropdown when the business is mexico.
  public cityId: number;
  // city name selected from the dropdown when the business is mexico.
  public cityName: string;

  // Variable for show or hide components in html
  public showCVC: boolean;
  public showAdress: boolean;
  public showAmountMx: boolean;
  public showAmountNonFixedRate: boolean;
  public showAmountDolar: Boolean;

  // Arrays for options in components select on html
  typeCards: string[] = [];
  listMonths: string[] = [];
  listYears: number[] = [];
  /**
   * cities by current country
   */
  public cities: City[];

  /**
   * states by current country
   */
  public states: State[];

  /**
 * Constant for error code status # 404
 */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Constant for error code status # 302 for EOB result
   */
  private STATUS_FOR_FOUND = 302;

  /**
   * Title for business exception modal message
   */
  private BUSINESS_EXCEPTION_TITLE = 'Business exception';

  /**
   * Title for business exception modal message
   */
  private BUSINESS_EXCEPTION_TITLE_PAYMENT = '';

  /**
   * Title for business exception modal button message
   */
  private BUSINESS_EXCEPTION_BUTTON = '';

  /**
   * Title for business exception modal button message
   */
  private BUSINESS_BUTTON_CANCEL = '';

  /**
   * Constant for type PDF
   */
  private PDF_APPLICATION_RESPONSE = 'application/pdf';

  // url of image logo credit card
  urlImg = '';

  // variable for save selection of selected Type credit card
  typeCreditCard: TypeCreditCard;

  private PAY_TYPE_CREDIT_CARD = 11;

  /***
   * If it is Panama you must accept the terms to pay
   */
  private acceptTerms: Boolean = undefined;
  public showError: Boolean = false;

  /**
   * Disclaimer Message
   */
  public disclaimerMessage = '';

  // Constructor for inject services necesary
  constructor(
    private paymentService: PaymentService,
    private commonService: CommonService,
    private authService: AuthService,
    private fb: FormBuilder,
    private translationService: TranslationService,
    private translateService: TranslateService,
    private router: Router,
    private notification: NotificationService,
    private currencyPipe: CustomCurrencyPipe,
    private decimalPipe: DecimalPipe,
    private location: Location,
    private config: ConfigurationService) {
  }


  // Init variables and form Group
  ngOnInit() {
    this.bupaInsurance = this.paymentService.getBupaInserance(this.policy);
    this.defaultInitInputs();
    this.obtainTypeCreditCards();
    this.buildDefaultGroup();
    this.obtainDateForExperirations();
    this.loadErrorMessages();
    this.translateService.onLangChange.subscribe(() => {
      this.loadErrorMessages();
    });
  }

  async loadErrorMessages() {
    this.BUSINESS_EXCEPTION_TITLE_PAYMENT = await this.translateService.get('PAYMENTS.ERRORS.BUSINESS_EXCEPTION_TITLE').toPromise();
    this.BUSINESS_EXCEPTION_BUTTON = await this.translateService.get('PAYMENTS.ERRORS.BUSINESS_EXCEPTION_BUTTON').toPromise();
    this.BUSINESS_BUTTON_CANCEL = await this.translateService.get('PAYMENTS.ERRORS.BUSINESS_BUTTON_CANCEL').toPromise();
  }

  // for default fileds don't show
  defaultInitInputs() {
    this.showCVC = false;
    this.showAdress = false;
    this.showAmountMx = false;
    this.showAmountNonFixedRate = false;
    this.showAmountDolar = true;
  }

  // Build default init formGroup
  buildDefaultGroup() {
    this.paymentForm = this.fb.group({
      basics: this.buildBasicForm(),
    });
  }


  /**
 * Check if response has error code to show business exception
 * @param error Http Error
 */
  checksIfHadBusinessError(error) {
    return error.error.code;
  }

  /**
   * Check if status is 404 and show message for data not found
   * @param error Http Error
   */
  checksIfHadNotFoundError(error) {
    return (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND);
  }

  // Basic form field that apply to all combinations
  buildBasicForm() {
    const formBasic: FormGroup = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(this.maxChars), this.validateCcNumber.bind(this)]],
      monthExpiration: ['', [Validators.required]],
      yearExpiraton: ['', [Validators.required]],
      email: ['', [CustomValidator.emailPatternValidator]],
      firstName: [this.policy.members[0].firstName, [Validators.required]],
      surnameName: [this.policy.members[0].lastName, [Validators.required]],
      amountToPay: new FormControl({
        value: 'USD' + this.decimalPipe.transform(this.policy.amountUSDToPay, '1.2-2'),
        disabled: (this.isInsuranceMexico())
      }, [Validators.required, CustomValidator.maxAmountExceeded(this.policy.amountUSDToPay)])
    });
    formBasic.setValidators(this.validateExpirationsDate);
    return formBasic;
  }

  // fill array select mounths and year.
  obtainDateForExperirations() {
    for (let i = 1; i <= 12; i++) {
      if (i < 10) {
        this.listMonths.push('0' + i);
      } else {
        this.listMonths.push('' + i);
      }
    }

    for (let i = new Date().getFullYear(); i < (new Date().getFullYear() + 10); i++) {
      this.listYears.push(i);
    }
  }

  /**
   * Fill select to type credit card.
   * The EMPTY cases are required, dont erase it, because EMPTY doesnt have amex, diners or discover CCs.
   */
  obtainTypeCreditCards() {
    this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.VISA));
    this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.MASTERCARD));

    switch (this.bupaInsurance) {
      case InsuranceBusiness.BUPA_MEXICO:
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.AMEX));
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.DINERS));
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.DISCOVER));
        break;
      case InsuranceBusiness.BUPA_PANAMA:
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.AMEX));
        break;
      case InsuranceBusiness.BUPA_DR:
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.AMEX));
        break;
      case InsuranceBusiness.BUPA_GUATEMALA:
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.AMEX));
        break;
      case InsuranceBusiness.BUPA_BOLIVIA:
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.AMEX));
        break;
      case InsuranceBusiness.BUPA_BOLIVIA_IHI:
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.AMEX));
        break;
      default:
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.AMEX));
        this.typeCards.push(TypeCreditCard.getDescription(TypeCreditCard.DINERS));
        break;
    }
  }

  // Depend of selection one chooses show image SVG and start construct form
  buildFormByCardType(cardType: string) {
    this.getCcValidationLength(cardType);
    if (cardType === TypeCreditCard.getDescription(TypeCreditCard.AMEX)) {
      this.urlImg = 'assets/images/amex.svg';
      this.buildFormAmex();
      this.typeCreditCard = TypeCreditCard.AMEX;
    } else {
      this.buildFormDifferentAmex();
      if (cardType === TypeCreditCard.getDescription(TypeCreditCard.MASTERCARD)) {
        this.typeCreditCard = TypeCreditCard.MASTERCARD;
        this.urlImg = 'assets/images/mastercard.svg';
      } else if (cardType === TypeCreditCard.getDescription(TypeCreditCard.VISA)) {
        this.typeCreditCard = TypeCreditCard.VISA;
        this.urlImg = 'assets/images/visa.svg';
      } else if (cardType === TypeCreditCard.getDescription(TypeCreditCard.DINERS)) {
        this.typeCreditCard = TypeCreditCard.DINERS;
        this.urlImg = 'assets/images/diners-club.svg';
      } else if (cardType === TypeCreditCard.getDescription(TypeCreditCard.DISCOVER)) {
        this.typeCreditCard = TypeCreditCard.DISCOVER;
        this.urlImg = 'assets/images/discover.svg';
      } else {
        this.typeCreditCard = null;
        this.urlImg = null;
      }
    }
  }

  // parent construct type American Express
  buildFormAmex() {
    this.defaultInitInputs();
    if (this.isInsuranceMexico()) {
      this.buildFormAmexInMexico();
    } else {
      this.buildFormAmexWithoutMexico();
    }
  }

  // Credit Card American Express in Mexico
  buildFormAmexInMexico() {
    this.showCVC = true;
    this.showAdress = true;
    this.showMxAmountOrRateMessage();
    this.paymentForm = this.fb.group({
      basics: this.buildBasicForm(),
      amexMx: this.fb.group({
        street: [this.policy.members[0].address, Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required]
      }),
      cvc: this.fb.control('', [Validators.required, Validators.minLength(this.maxCVC)]),

      // Given the country is Mexico so show amount in Peso Mexicano
      amountInMx: new FormControl({
        value: 'MXN ' + this.decimalPipe.transform(this.policy.amountToPay, '1.2-2'),
        disabled: true
      })

    });
    Utilities.delay(3000);
    this.loadCitiesState();
  }

  showMxAmountOrRateMessage() {
    if (this.policy.fixedRate === 0) { // Check if this is false
      this.showAmountNonFixedRate = true;
      this.showAmountDolar = true;
    } else {
      this.showAmountNonFixedRate = false;
      this.showAmountMx = true;
      this.showAmountDolar = false;
    }
  }

  // Credit Card American Express without Mexico
  buildFormAmexWithoutMexico() {
    this.paymentForm = this.fb.group({
      basics: this.buildBasicForm()
    });
  }

  // Credit Card Different than American Express (Visa, Mastercard, Dinners, Discover)
  buildFormDifferentAmex() {
    this.defaultInitInputs();

    this.paymentForm = this.fb.group({
      basics: this.buildBasicForm()
    });
    if (this.isInsuranceMexico()) {
      this.showCVC = true;
      this.showMxAmountOrRateMessage();
      this.paymentForm.addControl('cvc', new FormControl('', [Validators.required]));
      this.paymentForm.addControl('amountInMx', new FormControl({
        value: 'MXN ' + this.decimalPipe.transform(this.policy.amountToPay, '1.2-2'),
        disabled: true
      }));
    }
  }


  // Send Pay to back-end
  async payPolicy() {
    if (this.paymentForm.valid && this.validateAcceptTerms()) {
      this.buildDTO();
      if (!this.payment.payment.paymentDataCreditCard.amountApplyUSD) {
        this.showMessageNumberInvalid();
      } else {
        this.paymentService.excecutePayment(this.payment).subscribe(p => {
          this.paymentService.setResultPayPolicy(p);
          this.paymentService.setAmountPaid(this.payment.payment.paymentDataCreditCard.amountApplyUSD);
          this.router.navigate(['payments/payment-process-ok', this.policy.policyId]);
        }, error => {
          if (this.checksIfHadBusinessError(error)) {
            if (error.error.code === 'BE_002') {
              this.paymentService.setResultPayPolicy(this.buildFakePaymentResponse());
              this.paymentService.setAmountPaid(this.payment.payment.paymentDataCreditCard.amountApplyUSD);
              this.router.navigate(['payments/payment-process-ok', this.policy.policyId]);
            } else {
              this.showTryAgainMessage(error.error.code);
            }
          }
        });
      }
    } else {
      this.validateAcceptTerms();
      this.markFormAsTouched(this.paymentForm);
    }
  }

  buildFakePaymentResponse() {
    return {
      paymentId: 0,
      policyId: this.policy.policyId,
      amountApplyedUSD: this.payment.payment.paymentDataCreditCard.amountApplyUSD,
      authorizationCode: '',
      cardNumber : ''
    };
  }

  /**
   * If it is Panama, validate if you accept the terms
   */
  validateAcceptTerms(): Boolean {
    if (!this.acceptTerms) {
      this.showError = true;
      return false;
    } else {
      this.showError = false;
      return true;
    }
  }

  private markFormAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control instanceof FormGroup) {
        this.markFormAsTouched(control);
      } else {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  // Construct dto with informations for send to server
  buildDTO() {

    // validate to amountopay format
    let amounToPay = null;

    // when the policy is mexico insurance, the amount toy pay is taken of the policy
    if (this.isInsuranceMexico()) {
      amounToPay = this.policy.amountUSDToPay;
    } else {
      // if has format currency, delete currency with pipe
      if (this.paymentForm.getRawValue().basics.amountToPay.indexOf('USD') > -1) {
        amounToPay = this.currencyPipe.parse(this.paymentForm.getRawValue().basics.amountToPay,
          this.policy.currencySymbol).replace('USD', '');
      } else {
        amounToPay = this.paymentForm.getRawValue().basics.amountToPay;
      }
    }
    let language: string;
    this.translateService.stream(this.defaultDateFormat).subscribe(format => {
      language = this.translationService.getLanguage();
    });
    this.payment.payment = {
      policy: {
        policyId: this.policy.policyId.toString(),
        policyReference: this.policy.policyReference,
        fixedRate: this.policy.fixedRate
      },
      businessId: this.bupaInsurance,
      paymentMethodId: this.PAY_TYPE_CREDIT_CARD,
      paymentDataCreditCard: {
        creditCardTypeId: this.typeCreditCard,
        cardNumber: this.paymentForm.value.basics.cardNumber,
        expirationMonth: Number(this.paymentForm.value.basics.monthExpiration),
        expirationYear: Number(this.paymentForm.value.basics.yearExpiraton),
        accountFirstName: this.paymentForm.value.basics.firstName,
        accountLastName: this.paymentForm.value.basics.surnameName,
        currencyId: this.policy.currencyId,
        amountApplyUSD: Number(amounToPay),
        cvc: this.paymentForm.value.cvc !== undefined ? this.paymentForm.value.cvc : '',
        exchangeRate: this.policy.exchangeRate
      }
    };

    this.payment.notification = {
      language: language,
      emails: [this.authService.getUser().sub, this.paymentForm.value.basics.email]
    };
    if (this.showAdress) {
      this.payment.payment.paymentDataCreditCard.address = this.paymentForm.value.amexMx.street;
      this.payment.payment.paymentDataCreditCard.city = this.paymentForm.value.amexMx.city;
      this.payment.payment.paymentDataCreditCard.state = this.paymentForm.value.amexMx.state;
      this.payment.payment.paymentDataCreditCard.zipCode = this.paymentForm.value.amexMx.zip;
    }
  }

  // Validate letter start of credit card depending of insurance + type credit card
  validateCcNumber(control: AbstractControl): { [key: string]: boolean } | null {
    let invalidCard = false;
    switch (this.typeCreditCard) {
      case TypeCreditCard.VISA:
        if (!control.value.startsWith('4')) { invalidCard = true; }
        break;
      case TypeCreditCard.AMEX:
        if (this.isInsuranceMexico()) {
          if (!control.value.startsWith('34') && !control.value.startsWith('37')) { invalidCard = true; }
        } else {
          if (!control.value.startsWith('3')) { invalidCard = true; }
        }
        break;
      case TypeCreditCard.DISCOVER:
        if (!control.value.startsWith('6')) { invalidCard = true; }
        break;
      case TypeCreditCard.DINERS:
        if (!control.value.startsWith('3')) { invalidCard = true; }
        break;
      case TypeCreditCard.MASTERCARD:
        if (!control.value.startsWith('5')) { invalidCard = true; }
        break;
      default:
        break;
    }
    if (invalidCard) {
      return { invalidCardFormat: true };
    }
    return null;
  }

  changePolicyAmount(event) {
    const newAmountToPay = event.target.value != null ? event.target.value : null;
    this.policy.amountUSDToPay = newAmountToPay != null ? newAmountToPay : this.policy.amountUSDToPay;
  }
  // Validate date expirations, Validated only if the month is less when current year is selected
  validateExpirationsDate(group: FormGroup) {

    const month = group.controls['monthExpiration'];
    const year = group.controls['yearExpiraton'];
    if (!month.value || !year.value) { return null; }
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = (date.getUTCMonth() + 1);

    // If it is the current year
    if (currentYear.toString() === year.value) {
      if (Number(month.value) < currentMonth) {
        return { invalidDate: true };
      }
    }
  }

  /**
  * Sets the max lenght of the card depending on the card type selected.
  * @param cardType Card type selected by the user
  */
  getCcValidationLength(cardType: string) {
    this.maxChars = 16;
    this.maxCVC = 4;
    switch (cardType) {
      case TypeCreditCard.getDescription(TypeCreditCard.AMEX):
        this.maxChars = 15;
        break;
      case TypeCreditCard.getDescription(TypeCreditCard.MASTERCARD):
        break;
      case TypeCreditCard.getDescription(TypeCreditCard.VISA):
        break;
      case TypeCreditCard.getDescription(TypeCreditCard.DINERS):
        this.maxChars = 14;
        break;
      case TypeCreditCard.getDescription(TypeCreditCard.DISCOVER):
        break;
      default:
        this.maxChars = 16;
        break;
    }
  }

  /**
   * Search cities and state dependinde depending of isoalpha code of user and business
   */
  loadCitiesState(): void {
    if (this.isInsuranceMexico() || (this.authService.getUser().cc === 'GBL')) {
      this.loadCitiesAndStateByBusiness();
    } else {
      this.loadCitiesAndState();
    }
  }

  /**
   *  Search cities and state depending of isoalpha code of user
   * */
  loadCitiesAndState(): void {
    let countryUser: Country;
    this.commonService.getCountryByIsoalpha(this.authService.getUser().cc).subscribe(country => {
      countryUser = country[0];
      this.getCities(countryUser.countryId);
      this.getStates(countryUser.countryId);
    }, error => {
      if (this.checksIfHadBusinessError(error)) {
        this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
      }
    });
  }

  /**
   *  Search cities and state depending of isoalpha code of user
   * */
  loadCitiesAndStateByBusiness(): void {
    let countryUser: Country;
    this.commonService.getCountryByBusiness(this.bupaInsurance).subscribe(country => {
      countryUser = country[0];
      this.getCities(countryUser.countryId);
      this.getStates(countryUser.countryId);
    }, error => {
      if (this.checksIfHadBusinessError(error)) {
        this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
      }
    });
  }

  // Obtains all cities by the country id
  getCities(countryId: number) {
    this.commonService.getCitiesByCountry(countryId).subscribe(cities => {
      this.cities = cities;
    }, error => {
      this.cities = [];
      if (this.checksIfHadBusinessError(error)) {
        this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
      }
    });
  }

  // Obtains all states by the country id
  getStates(countryId: number) {
    this.commonService.getStatesByCountry(countryId).subscribe(states => {
      this.states = states;
    }, error => {
      this.states = new Array<State>();
      if (this.checksIfHadBusinessError(error)) {
        this.notification.showDialog(this.BUSINESS_EXCEPTION_TITLE, error.error.message);
      }
    });
  }

  /**
  * Uses notification service to show modal popup with a title and a message
  * @param message Message
  */
  async showTryAgainMessage(errorCode) {
    const message = await this.translateService.get('PAYMENTS.ERRORS.' + errorCode).toPromise();
    const tryAgain = await this.notification.showDialog
      (this.BUSINESS_EXCEPTION_TITLE_PAYMENT, message, true, this.BUSINESS_EXCEPTION_BUTTON, this.BUSINESS_BUTTON_CANCEL);
    if (tryAgain) {
      this.payPolicy();
    }
  }

  /**
   * @param errorCode Business Error Code
   */
  async showErrorMessage(errorCode: string) {
    const message = await this.translateService.get('PAYMENTS.ERRORS.' + errorCode).toPromise();
    const title = await this.translateService.get('PAYMENTS.ERRORS.' + errorCode + '_TITLE').toPromise();
    const ok = await this.notification.showDialog(title, message);
    if (ok) {
      this.finishOnError();
    }
  }

  /**
   * Finish on Error.
   */
  finishOnError() {
    if (this.authService.getUser().is_anonymous) {
      this.authService.logoff();
      location.href = this.config.redirectUri;
    } else {
      this.router.navigate(['policies/policy-payments']);
    }
  }


  // Validate if Insurance is Mexico
  isInsuranceMexico(): boolean {
    return this.bupaInsurance === InsuranceBusiness.BUPA_MEXICO;
  }
  // get American Express Mexican Controls
  get amexMxControls() {
    return (this.paymentForm.controls.amexMx as FormGroup).controls;
  }

  /***
   * Is Panama
   */
  isInsurancePanama(): boolean {
    return this.bupaInsurance === InsuranceBusiness.BUPA_PANAMA;
  }

  // get basic Controls
  get basicsControls() {
    return (this.paymentForm.controls.basics as FormGroup).controls;
  }

  // get formgroup controls
  get formGroupControls() {
    return (this.paymentForm as FormGroup).controls;
  }

  goToBack() {
    this.location.back();
  }

  showMessageNumberInvalid() {
    let message = '';
    let messageTitle = '';
    this.translateService.get(`PAYMENTS.ERRORS.NUMBER_INVALID`).subscribe(
      result => message = result
    );
    this.translateService.get(`PAYMENTS.ERRORS.ERROR`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /***
   * For Insurnce is Panama should mark accept
   */
  changeConfirm(e) {
    this.acceptTerms = e.target.checked;
  }

  /***
   * Handle the disclaimer message show and message.
   */
  handleDisclaimerShowMsg() {

    if (this.bupaInsurance) {
      switch (this.bupaInsurance) {
        case InsuranceBusiness.BUPA_PANAMA:
          this.disclaimerMessage = 'PAYMENTS.CC.PANAMA_DISCLAIMER_MSG';
          return true;

        case InsuranceBusiness.BUPA_BOLIVIA:
          this.disclaimerMessage = 'PAYMENTS.CC.BOLIVIA_DISCLAIMER_MSG';
          return true;

        case InsuranceBusiness.BUPA_BOLIVIA_IHI:
          this.disclaimerMessage = 'PAYMENTS.CC.BOLIVIA_DISCLAIMER_MSG';
          return true;

        case InsuranceBusiness.BUPA_GUATEMALA:
          this.disclaimerMessage = 'PAYMENTS.CC.GUAT_DR_DISCLAIMER_MSG';
          return true;

        case InsuranceBusiness.BUPA_DR:
          this.disclaimerMessage = 'PAYMENTS.CC.GUAT_DR_DISCLAIMER_MSG';
          return true;

        default:
          this.disclaimerMessage = 'PAYMENTS.CC.OTHERS_DISCLAIMER_MSG';
          return true;
      }
    }
  }


}
