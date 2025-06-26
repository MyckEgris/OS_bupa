import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { EligibilitiesDto } from 'src/app/shared/services/policy/entities/eligibilities.dto';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { TranslateService } from '@ngx-translate/core';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BenefitsInputDto } from 'src/app/shared/services/policy/entities/benefits-input.dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import * as moment from 'moment';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-search-benefits',
  templateUrl: './search-benefits.component.html',
  providers: [NgbActiveModal]
})
export class SearchBenefitsComponent implements OnInit, OnDestroy {

  /**
   * Input policyInfo
   */
  @Input() inputPolicyId: number;

  /**
   * Input memberInfo
   */
  @Input() inputMemberId: number;

  /**
   * Input isModal
   */
  @Input() isModal?: boolean;

  /**
   * Output close
   */
  @Output() close = new EventEmitter<boolean>();

  /**
   * policyId
   */
  private policyId: number;

  /**
   * memberId
   */
  private memberId: number;

  /**
   * eligibilityFromDate
   */
  private eligibilityFromDate: string;

  /**
   * benefitTypeId
   */
  private benefitTypeId: number;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /**
   * eligibilityOptions: EligibilitiesDto[]
   */
  public eligibilityOptions: EligibilitiesDto[];

  /**
   * mainBenefits: BenefitsInputDto
   */
  public mainBenefits: BenefitsInputDto;

  /**
   * otherBenefits: BenefitsInputDto
   */
  public otherBenefits: BenefitsInputDto;

  /**
   * flag for input info
   */
  public inputInfo = true;

  /**
    * flag for error 404 search
    */
  public errorSearch = false;

  /***
   * Subscription Eligibility
   */
  private subEligibility: Subscription;

  /***
   * Subscription Benefits
   */
  private subBenefits: Subscription;

  /**
  * Main form
  */
  public benefitsForm: FormGroup;

  /***
   * Constant for first members array position
   */
  private MEMBERS_POSITION = 0;

  /***
    * Constant for first eligibility array position
    */
  private ELIGIBILITY_OPTION = 'eligibilityOption';

  /***
   * Constant for main benefits benefit type Id
   */
  private MAIN_BENEFITS_NUM = 1;

  /***
   * Constant for other benefits benefit type Id
   */
  private OTHER_BENEFITS_NUM = 2;

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
  private firstPageSize = 5;

  /**
    * Collection size for pagination component
    */
  public collectionSize = 0;

  /**
    * pager object
    */
  public pager: any = {};

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
    * flag for error 404 on main benefits
    */
  public mainBenefitsError = false;

  /**
   * flag for error 404 on other benefits
   */
  public otherBenefitsError = false;

  /***
   * Constant for scope description in country
   */
  public IN_COUNTRY = 'In Country';


  /***
   * Constant for scope description out of country
   */
  public OUT_COUNTRY = 'Out Of Country';

  /**
   * flag for scope description visualization
   */
  public scopeDescriptionFlag;


  /**
   * Contruct Methods
   * @param translate translate injection
   * @param policyService policyService injection
   * @param notification Notification Service injection
   * @param pagerService Pager Service  Injection
   * @param translationService translation Service  Injection
   * @param activeModal activeModal Service Injection
   */
  constructor(
    private translate: TranslateService,
    private policyService: PolicyService,
    private pagerService: PagerService,
    private translationService: TranslationService,
    public activeModal: NgbActiveModal
  ) { }


  ngOnInit() {
    this.getInputInformation();
    this.benefitsForm = this.buildForm();
    if (this.inputInfo) {
      this.getEligibilityByPolicyIdAndMemberId(this.policyId, this.memberId);
    }
    this.benefitsForm.controls.eligibilityOption.valueChanges.subscribe(val => {
    }
    );
    this.selectedLanguageId = this.translationService.getLanguageId();
    this.translate.onLangChange.subscribe(() => {
      this.selectedLanguageId = this.translationService.getLanguageId();
    });
  }

  /***
   * kill subscriptions to free memory
   */
  ngOnDestroy(): void {
    this.subEligibility.unsubscribe();
  }

  getInputInformation() {

    if (this.inputPolicyId && this.inputMemberId) {
      this.policyId = this.inputPolicyId;
      this.memberId = this.inputMemberId;
      this.inputInfo = true;
    } else { this.inputInfo = false; }

  }

  /**
    * Builds default benefits Form.
    */
  buildForm() {
    return new FormGroup({
      eligibilityOption: new FormControl('', [Validators.required])
    });
  }

  /**
   * Gets eligibility by policyId and memberId.
   * @param policyId Policy Id.
   * @param memberId Member Id.
   */
  getEligibilityByPolicyIdAndMemberId(policyId?: number, memberId?: number) {
    this.subEligibility = this.policyService.getEligibilityByPolicyIdAndMemberId(policyId, memberId)
      .subscribe(result => {
        this.eligibilityOptions = result.members[this.MEMBERS_POSITION].eligibilities;
      }, error => {
        console.error(error);
      }
      );
  }

  /**
   * sets eligibility From Date.
   */
  setEligibilityFromDate() {
    const fromDate = this.benefitsForm.controls.eligibilityOption.value.eligibilityFromDate;
    this.eligibilityFromDate = this.convertDateToFormat(fromDate);
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

    this.setEligibilityFromDate();

    if (benefitTypeId === this.MAIN_BENEFITS_NUM) {
      this.subBenefits = this.policyService.getBenefitsByEligibility(
        this.policyId, this.memberId, this.eligibilityFromDate, benefitTypeId, null, null)
        .subscribe(result => {
          this.mainBenefits = result;
          this.mainBenefitsError = false;
        }, error => {
          this.mainBenefitsError = true;
        }
        );
    } else if (benefitTypeId === this.OTHER_BENEFITS_NUM) {
      this.subBenefits = this.policyService.getBenefitsByEligibility(
        this.policyId, this.memberId, this.eligibilityFromDate, benefitTypeId, pageSize, pageIndex)
        .subscribe(result => {
          this.otherBenefits = result;
          this.otherBenefitsError = false;
          // set pager
          this.setPage(pageIndex);
        }, error => {
          this.otherBenefitsError = true;
        }
        );
    }

  }

  /***
    * Set the pager object
    */
  setPage(page: number) {
    if (this.otherBenefits.count && page) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }
      this.pager = this.pagerService.getPager(this.otherBenefits.count, page, this.firstPageSize);
    }
  }

  /***
    * Search the benefits filtering by eligibility
    */
  searchBenefits(page: number, isNextPage: Boolean) {
    if (!isNextPage) {
      // get the main benefits
      this.getBenefitsByEligibility(this.MAIN_BENEFITS_NUM, null, null);
    }
    // get the other benefits
    this.getBenefitsByEligibility(this.OTHER_BENEFITS_NUM, this.firstPageSize, page);
  }

  /**
    * Convert date value to format YYYY-MM-DD.
    * @param value Value
    */
  convertDateToFormat(value: any) {
    return moment(value).format('YYYY-MM-DD');
  }

  /**
    * Clean the benefits search.
    */
  cleanSearch() {
    this.mainBenefits = null;
    this.otherBenefits = null;
    this.mainBenefitsError = false;
    this.otherBenefitsError = false;
    this.scopeDescriptionFlag = false;
    this.benefitsForm.controls.eligibilityOption.setValue('');
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

  /**
    * Redirects to Rates, forms and questionnaires.
    */
  redirectToRatesForm() {
    if (this.isModal) {
      this.close.emit(true);
    }
  }

}
