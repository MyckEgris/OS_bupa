/**
* MemberVerificationEligibilityComponent.ts
*
* @description: This class gets some status and displays them into a printable document.
* @author Ivan Hidalgo
* @author Arturo Suarez.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from '../../shared/services/policy/policy.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { RerferenceNumberResponse } from '../../shared/services/policy/entities/rerferenceNumberResponse';
import { DatePipe } from '@angular/common';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { BenefitsInputDto } from 'src/app/shared/services/policy/entities/benefits-input.dto';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';


/**
 * This class gets some status and displays them into a printable document.
 */
@Component({
  selector: 'app-member-verification-eligibility',
  templateUrl: './member-verification-eligibility.component.html'
})
export class MemberVerificationEligibilityComponent implements OnInit {

  /**
   * Language
   */
  private language: string;

  /**
   * Constant for exception 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Locale for English to pipe
   */
  private SPA_LOCATE = 'es-Us';

  /**
   * Locale for Spanish to pipe
   */
  private ENG_LOCATE = 'en-Us';

  /**
   * Date format for locale English
   */
  private VOE_ENG_FORMAT = 'MMMM dd, yyyy HH:mm';

  /**
   * Date format for locale Spanish
   */
  private VOE_SPA_FORMAT = `dd 'd'e MMMM 'd'e yyyy HH:mm`;

  /**
   * Spanish birth format
   */
  private SPA_MEMBER_BIRTH_FORMAT = 'd MMMM y';

  /**
   * English birth format
   */
  private ENG_MEMBER_BIRTH_FORMAT = 'MMMM d, y';

  /**
   * Language for Spanish option
   */
  private SPA_LANGUAGE = 'SPA';

  /**
   * Member name
   */
  public memberName: string;

  /**
   * Provider Name
   */
  public providerName: string;

  /**
   * Policy number
   */
  public policyNumber: number;

  /**
   * Member birth date
   */
  public memberBirthDate: string;

  /**
   * Member eligibility
   */
  public memberEligibility: string;

  /**
   * Reference Number
   */
  public referenceNumber: string;

  /**
   * VOE Date
   */
  public voeDate: string;

  /**
   * Transaction Id
   */
  public transactionId: number;

  /**
   * Request Name
   */
  public requesterName: string;

  /**
   * Member Id
   */
  public memberId: number;

  /**
   * Member Status
   */
  public memberStatus: string;

  /**
   * RerferenceNumberResponse object
   */
  public referenceNumberResponse: RerferenceNumberResponse;

  /**
   * Error message for business exceptions
   */
  public errorMessage: string;

  /**
   * Today date
   */
  public today: string;

  /**
   * DatePipe object
   */
  public pipe: DatePipe;

  /**
   * Flag for button visible
   */
  public buttonVisible = true;

  /**
   * Date format
   */
  public dateFormat: string;

  /**
   * Eligibility From Date
   */
  public eligibilityFromDate: string;

  /**
   * mainBenefits: BenefitsInputDto
   */
  public mainBenefits: BenefitsInputDto;

  /**
   * otherBenefits: BenefitsInputDto
   */
  public otherBenefits: BenefitsInputDto;

  /***
   * Constant for main benefits benefit type Id
   */
  private MAIN_BENEFITS_NUM = 1;

  /***
   * Constant for other benefits benefit type Id
   */
  private OTHER_BENEFITS_NUM = 2;

  /***
   * Constant for the provider main benefits benefit type Id
   */
  private PROV_MAIN_BENEFITS_NUM = 4;

  /***
   * Constant for benefit scopes array position
   */
  private BENEFIT_SCOPES = 0;

  /**
    * Constant for first pager Page Index parameter
    */
  private firstPageIndex = 1;

  /**
    * Constant for first pager Page Size parameter
    */
  private firstPageSize = 100;

  /**
    * flag for error 404 on main benefits
    */
  public mainBenefitsError = false;

  /**
   * flag for error 404 on other benefits
   */
  public otherBenefitsError = false;

  /**
   * flag for error 404 on riders
   */
  public  riders = false;

  /**
   * flag for eligibility member benefits template visualization
   */
  public isEligibility = false;

  /***
   * Constant for scope description in country
   */
  public IN_COUNTRY = 'In Country';

  /***
   * Constant for scope description out of country
   */
  public OUT_COUNTRY = 'Out Of Country';

  /***
    * Constant for accumulator Benefit By Languages
    */
  public ACCUMULATOR_BENEFIT = 'accumulatorBenefitByLanguages';

  /***
   * Constant for diagnostic By Langages
   */
  public DIAGNOSTIC = 'diagnosticByLanguages';

  /***
  * Constant for diagnostic By Langages
  */
  public selectedLanguageId: number;




  /**
   * Constructor Method
   * @param policyService Policy Service Injection
   * @param route Route Injection
   * @param notification Notification Service Injection
   * @param translationService Translation Service Injection
   * @param translate translate Service Injection
   */
  constructor(
    private policyService: PolicyService,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private translationService: TranslationService,
    private translate: TranslateService
  ) { }

  /**
   * Get Url params and assign to component varibales. Call aligibility services and locale values
   */
  ngOnInit() {
    this.language = this.translationService.getLanguage();
    this.memberName = this.route.snapshot.queryParams['memberName'];
    this.policyNumber = this.route.snapshot.queryParams['policyNumber'];
    this.memberBirthDate = this.route.snapshot.queryParams['dOf'];
    this.voeDate = this.route.snapshot.queryParams['voeDate'];
    this.memberId = this.route.snapshot.queryParams['memberId'];
    this.requesterName = this.route.snapshot.queryParams['requesterName'];
    this.transactionId = this.route.snapshot.queryParams['transactionId'];
    this.memberStatus = this.translateEligibility(this.route.snapshot.queryParams['memberStatus']);
    this.eligibilityFromDate = this.convertDateToFormat(this.route.snapshot.queryParams['lastEligibilityDate']);
    this.selectedLanguageId = this.translationService.getLanguageId();
    this.translate.onLangChange.subscribe(() => {
      this.selectedLanguageId = this.translationService.getLanguageId();
    });
    this.getReferenceNumberOfMemberEligible();
    this.setDateTimeFormatByLocation();
    this.getBenefits(this.route.snapshot.queryParams['memberStatus']);

  }

  /**
   * Formats date and time based on the current language.
   */
  private setDateTimeFormatByLocation() {
    const now = Date.now();
    const newDate = new Date(this.memberBirthDate).getTime();
    if (this.language === this.SPA_LANGUAGE) {
      this.pipe = new DatePipe(this.SPA_LOCATE);
      this.today = this.pipe.transform(now, this.VOE_SPA_FORMAT);
      this.memberBirthDate = this.pipe.transform(newDate, this.SPA_MEMBER_BIRTH_FORMAT);
    } else {
      this.pipe = new DatePipe(this.ENG_LOCATE);
      this.today = this.pipe.transform(now, this.VOE_ENG_FORMAT);
      this.memberBirthDate = this.pipe.transform(newDate, this.ENG_MEMBER_BIRTH_FORMAT);
    }
  }

  /**
   * Checks reference number and Member Elibility.
   */
  private getReferenceNumberOfMemberEligible() {
    this.policyService.getReferenceNumberOfMemberEligible(this.memberId, this.referenceNumber, this.transactionId)
      .subscribe(
        data => {
          this.referenceNumberResponse = data;
          this.referenceNumber = this.referenceNumberResponse.referenceNumber;
        }, error => {
          this.showIfHadBusinessError(error);
        });
  }

  /**
   * Checks if the response has an error.
   * @param error Http error message.
   */
  private showIfHadBusinessError(error) {
    if (error.error.code) {
      this.errorMessage = error.error.message;
      this.notification.showDialog('Business Exception', error.error.message);
    } else if (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND) {
      this.notification.showDialog('No data found', error.message);
    }
  }

  /**
   * Delay for print
   * @param ms Milliseconds
   */
  async delay(ms: number) {
    return await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Prints member elegibility document.
   */
  printEligibility() {
    this.buttonVisible = false;
    this.delay(500).then(
      () => {
        window.print();
        this.buttonVisible = true;
      }
    );
  }

  /**
   * Translates the 'Eligible' status based on the language.
   * @param isEligible Is Member elegibility?
   */
  translateEligibility(isEligible: string) {
    if (this.language === this.SPA_LANGUAGE) {
      if (isEligible === 'Eligible') {
        return 'Elegible';
      } else {
        return 'Inelegible';
      }
    }
    return isEligible;
  }

  /**
   * Sets the benefits array if the memeber is elegibility.
   * @param isEligible Is Member elegibility?
   */
  getBenefits(isEligible: string) {
    if (isEligible === 'Eligible') {
      this.isEligibility = true;
      // get the main benefits
      this.getBenefitsByEligibility(this.MAIN_BENEFITS_NUM, null, null);
      // get the other benefits
      this.getBenefitsByEligibility(this.OTHER_BENEFITS_NUM, this.firstPageSize, this.firstPageIndex);
      // get the foreign assistance
      this.getForeignAssistance();
    } else {
      this.isEligibility = false;
    }
  }

  /**
   * You get the if you have benefits for foreign assistance.
   * @param policyId Policy Id.¿
   */
   getForeignAssistance() {
      this.policyService.getForeignAssistance(
        this.policyNumber).subscribe(result => {
          this.riders = result;
          this.mainBenefitsError = false;
        }, error => {
          this.riders = false;
          this.mainBenefitsError = true;
        }
        ) ;
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
  getBenefitsByEligibility(benefitTypeId: number, pageSize?: number, pageIndex?: number) {

    if (benefitTypeId === this.MAIN_BENEFITS_NUM || benefitTypeId === this.PROV_MAIN_BENEFITS_NUM) {
      this.policyService.getBenefitsByEligibility(
        this.policyNumber, this.memberId, this.eligibilityFromDate, benefitTypeId, null, null)
        .subscribe(result => {
          this.mainBenefits = result;
          this.mainBenefitsError = false;
        }, error => {
          this.mainBenefitsError = true;
        }
        );
    } else if (benefitTypeId === this.OTHER_BENEFITS_NUM) {
      this.policyService.getBenefitsByEligibility(
        this.policyNumber, this.memberId, this.eligibilityFromDate, benefitTypeId, pageSize, pageIndex)
        .subscribe(result => {
          this.otherBenefits = result;
          this.otherBenefitsError = false;
        }, error => {
          this.otherBenefitsError = true;
        }
        );
    }

  }

  /**
    * Convert date value to format YYYY-MM-DD.
    * @param value Value
    */
  convertDateToFormat(value: any) {
    return moment(value).format('YYYY-MM-DD');
  }

  /**
    * Filter the desire property translated according to the selected language.
    * @param property Property
    * @param array Array
    * @param defaultOpt Default Opt
    */
  filterParameterByLanguaje(property: string, array: any, defaultOpt: any) {

    if (property === this.ACCUMULATOR_BENEFIT) {
      if (array.length > 1) {
        const benefit = array.find(option => {
          return option.languageId === this.selectedLanguageId;
        }
        );
        return benefit.accumulatorDescription;
      } else if (array.length === 1) {
        return array[0].accumulatorDescription;
      } else {
        return defaultOpt;
      }

    } else if (property === this.DIAGNOSTIC) {
      if (array.length > 0) {
        if (array.length > 1) {
          const diagnostic = array.find(option => {
            return option.diagnosticLanguageId === this.selectedLanguageId;
          }
          );
          return diagnostic.diagnosticDescription;
        } else {
          return array[0].diagnosticDescription;
        }
      }

    }

  }

  /**
    * Validates if scope description is inCountry-outContry and show in template.
    *  @param title Title
    */
  validateScopeDescription(title: any) {
    if (title === this.IN_COUNTRY) {
      return true;
    } else if (title === this.OUT_COUNTRY) {
      return true;
    } else {
      return false;
    }
  }


}
