/**
* ViewDetailInformationComponent
*
* @description: use to show a policy detail information
* @author Andres Tamayo
* @version 1.0
* @date 13-02-2019.
*
**/
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { TranslateService } from '@ngx-translate/core';
import { PolicyDate } from 'src/app/shared/services/policy/entities/policy-date.dto';
import { HttpErrorResponse } from '@angular/common/http/http';
import { PolicyDetailDates } from 'src/app/shared/services/policy/constants/policy-detail-dates.enum';
import { DocumentOutputDto } from 'src/app/shared/services/policy/entities/documents.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { Location } from '@angular/common';
import * as $ from 'jquery';
import { StatusPolicy } from 'src/app/shared/classes/status-policy.enum';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { SearchMemberTypeConstants } from 'src/app/shared/services/policy/constants/policy-search-member-type-constants';
import { PolicyDocumentTypeConstants } from 'src/app/shared/services/policy/constants/policy-document-type-constants';
import { FinanceService } from 'src/app/shared/services/finance/finance.service';
import { PayeeDto } from 'src/app/shared/services/finance/entities/payee.dto';
import { RoutingStateService } from 'src/app/shared/services/routing/routing-state.service';
import { Utilities } from 'src/app/shared/util/utilities';


@Component({
  selector: 'app-view-detail-information',
  templateUrl: './view-detail-information.component.html'
})
export class ViewDetailInformationComponent implements OnInit, AfterViewChecked {

  @ViewChild('payee') payee: ElementRef;

  role_id_agent = '1';
  role_id_agentassistant = '2';
  role_id_employee = '5'; // Role Employee
  role_id_admin = '4';

  private ID_DETAIL_TOGGLE = '#ig-detallePago-';
  public showToPayMexicanPeso: boolean;
  public sizeColumnToPay = 6;
  /**
   * Flag for searching proccess
   */
  public searchProccess = false;
  /** policy id */

  /**
   * policyId
   */
  private policyId: number;

  /**
   * pageGoBack
   */
  private pageGoBack: number;

  /**
   * contain all the policy information
   */
  public policyDto: PolicyDto;

  /**
   * tooltip on the component's header
   */
  public tooltip: string[] = [];

  /**
   * contains the mainMember's information
   */
  public mainMember: MemberOutputDto;

  /**
   * documents
   */
  public documents: DocumentOutputDto[];

  /**
   * application Received date
   */
  public policyDates_applicationReceived: PolicyDate;

  /**
   * policy Issue Date
   */
  public policyDates_policyIssueDate: PolicyDate;

  /**
   * renewal Date
   */
  public policyDates_renewalDate: PolicyDate;

  /**
   * Stores the logged user information
   */
  private user: UserInformationModel;

  /**
   * holds the role of the logged person
   */
  public role: string;

  /**
   * User role
   */
  private role_id: string;

  /**
   * returnUrl
   */
  public returnUrl: string;

  /**
   * ERROR_STATUS_FOR_DATA_NOT_FOUND
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = '404';

  /**
   * bupaInsuranceValid
   */
  public bupaInsuranceValid = false;

  /**
 * bupaInsuranceValid
 */
  public viewClaimMethodPayment = false;


  /**
   * isDiffGroupAdminAgentRole
   */
  public isDiffGroupAdminAgentRole = false;

  /**
   * tells if the current user has permissions to see the documents
   */
  public documentsPermission = true;

  public payees: PayeeDto;

  public loadingPayee = false;

  /**
   * listDatesToShow
   */
  public listDatesToShow =
    [PolicyDetailDates.APPLICATION_RECEIVED,
    PolicyDetailDates.POLICY_ISSUE_DATE,
    PolicyDetailDates.RENEWALS_DATE];

  /***
   * Constants for the download documents data not found (400) error request message.
   */
  private SEARCH_DOCUMENTS_ERROR400_TITLE = 'POLICY.ERROR.ERROR_CODE.400';
  private SEARCH_DOCUMENTS_ERROR400_MSG = 'POLICY.ERROR.ERROR_MESSAGE.400.BE_011';

  /***
   * Constants for the download documents data not found (400) error default request message.
   */
  private SEARCH_DOCUMENTS_DEFAULT_ERROR400_TITLE = 'APP.HTTP_ERRORS.HANDLED_ERRORS.ERROR_TITLE.NOT_AUTHORIZED';
  private SEARCH_DOCUMENTS_DEFAULT_ERROR400_MSG = 'APP.HTTP_ERRORS.HANDLED_ERRORS.ERROR_MESSAGE.NOT_AUTHORIZED';

  private statusesToExcludeTabMembers = ['Pending Evaluation', 'Pending Information', 'Pending Others'];

  /**
   *
   * @param router Router inyection
   * @param route route inyection
   * @param authService AuthService inyection
   * @param policyService PolicyService inyection
   * @param translate TranslateService inyection
   * @param agentService AgentService inyection
   * @param translationService Translation Service injection
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private policyService: PolicyService,
    private translate: TranslateService,
    private agentService: AgentService,
    private notification: NotificationService,
    private paymentService: PaymentService,
    private location: Location,
    private translationService: TranslationService,
    private financeService: FinanceService,
    private routingState: RoutingStateService
  ) {
    this.returnUrl = this.route.snapshot.data.returnUrl;
  }

  /**
   * loads the policy information, the page's actual language
   * and show them on the scream
   */
  ngOnInit() {
    this.documents = [];
    this.user = this.authService.getUser();
    this.role_id = this.user.role_id    
    this.policyId = this.route.snapshot.params['policyId'];
    this.isAgentGroup();
    if (!this.policyId) {
      this.policyId = Number(this.user.user_key);
    }
    this.policyService.getDetailPolicyByPolicyId(
      this.user.role_id,
      this.user.user_key,
      this.policyId,
      null,
      SearchMemberTypeConstants.ALL_MEMBERS
    ).subscribe(
      data => {
        this.policyDto = data;                
        this.showPaymentByInsurance();
        this.setViewPaymentMethod();
        if (this.policyDto.agent !== null) {
          this.policyDto.agent.companyName = this.agentService.getAgentName(this.policyDto.agent);
        }
        this.setMainMember(this.policyDto.members);
        this.loadActualLanguaje();
      },
      error => {
        this.showErrorMessage(error);
      }
    );

    this.translate.onLangChange.subscribe(res => {
      if (this.policyDto) {
        this.loadActualLanguaje();
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.payee) {
      this.setClaimPaymentMethodAsActiveTab();
    }
  }

  setViewPaymentMethod() {
    const bupaInsurance = this.getBupaInserance(this.policyDto);
    const inValidBupaInsurance = [
      // InsuranceBusiness.BUPA_MEXICO,
    InsuranceBusiness.SANITAS,
    InsuranceBusiness.BUPA_COLOMBIA_SEGUROS_BOLIVAR,
    InsuranceBusiness.CRUZ_BLANCA
  ];
    this.viewClaimMethodPayment = !(inValidBupaInsurance.indexOf(bupaInsurance) > -1);
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

  setMainMember(members: MemberOutputDto[]) {
    this.mainMember = members.filter(membersF => membersF.relationTypeId === 2)[0];

    if (!this.mainMember) {
      this.mainMember = members.filter(membersF => membersF.relationTypeId === 5)[0];
    }
    if (!this.mainMember) {
      this.mainMember = {
        memberId: this.policyDto.memberId,
        firstName: this.policyDto.firstName,
        middleName: this.policyDto.middleName,
        lastName: this.policyDto.lastName,
        fullName: '',
        dob: this.policyDto.ownerDob,
        policyId: this.policyDto.policyId.toString(),
        policyNumber: 0,
        isGroupPolicy: false,
        applicationId: 0,
        contactBaseId: 0,
        memberStatus: '',
        memberStatusId: 0,
        premiumValue: 0,
        policyStatus: '',
        policyCountry: '',
        policyCountryId: 0,
        insuranceBusinessId: 0,
        insuranceBusinessName: '',
        relationTypeId: 0,
        relationType: '',
        genderId: 0,
        gender: '',
        searchDate: '',
        referenceNumber: '',
        requesterName: '',
        transactionId: 0,
        benefitCurrencyCode: '',
        deductibleId: 0,
        deductibleValue: 0,
        maximumCoverageValue: 0,
        plan: '',
        wWperiod: false,
        address: '',
        email: '',
        specialConditions: null,
        filterSpecialConditions: null,
        eligibilities: null,
        premiumComponent: null
      };
    }
  }

  /**
  * If the role is GroupAdmin, it mustn't show money.
  */
  isAgentGroup() {
    const groupAdmin = 'GroupAdmin';
    const userRole = this.user.role;
    this.isDiffGroupAdminAgentRole = !(groupAdmin.indexOf(userRole) > -1);
  }

  /**
   * handles posible mistakes on the request who query the policy information
   * @param errorMessage error return on the request
   */
  private showErrorMessage(errorMessage: HttpErrorResponse) {
    const that = this;

    if (this.checkError400(errorMessage)) {
      if (errorMessage.error.code === 'BE_011') {
        this.documentsPermission = false;
        this.showMessage(this.SEARCH_DOCUMENTS_ERROR400_TITLE, this.SEARCH_DOCUMENTS_ERROR400_MSG);
      } else {
        this.showMessage(this.SEARCH_DOCUMENTS_DEFAULT_ERROR400_TITLE, this.SEARCH_DOCUMENTS_DEFAULT_ERROR400_MSG);
      }
    }

    if (this.checkIfIsBusinessError(errorMessage)) {
      setTimeout(function () {
        that.router.navigate(['/']);
      }, 3000);
    }

  }

  /**
   * Checks if error has business exception.
   */
  private checkError400(error) {
    return (error.status === 400);
  }

  /**
   * Load the page's actual language to show the information
   */
  private loadActualLanguaje() {
    this.tooltip = [];

    if (this.policyDto && this.policyDto.legacyNumber) {
      const label1 = this.translate.get('POLICY.VIEW_POLICY_DETAILS.LEGACY_POLICY').toPromise();
      label1.then(val => {
        this.tooltip.push(`${val}: ${this.policyDto.legacyNumber}`);
      });

      const label11 = this.translate.get('POLICY.VIEW_POLICY_DETAILS.POLICY_ID').toPromise();
      label11.then(val => {
        this.tooltip.push(`${val}: ${this.policyDto.policyId}`);
      });


      if (this.policyDto.isGroupPolicy) {
        const label2 = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GROUP_ID').toPromise();
        label2.then(val => {
          this.tooltip.push(`${val}: ${this.policyDto.groupId}`);
        });

        const label3 = this.translate.get('POLICY.VIEW_POLICY_DETAILS.GROUP_NAME').toPromise();
        label3.then(val => {
          this.tooltip.push(`${val}: ${this.policyDto.groupName}`);
        });
      }
    }
  }

  getPolicyPaymentSatatusToPay() {
    this.policyService.getPaymentPendingToPayByPolicy(this.user.role_id, this.user.user_key, this.policyDto.policyId).subscribe(
      data => {
        this.policyDto.paymentStatus = data.paymentStatus;
        if (this.policyDto.paymentStatus) {
          this.paymentService.showMessagePaymentStatus(this.policyDto);
        } else {
          if (this.paymentService.validtePayPolicy(data)) {
            this.paymentService.setPolicyToPay(data);
            this.router.navigate(['payments/payment-process', this.policyDto.policyId]);
          }
        }
      },
      error => {
        this.showErrorMessage(error);
      }
    );
  }

  /**
   * Gets Policy's documents by its policy identifier.
   */
  getDocumentsByPolicyId() {
    this.policyService.getPolicyDocumentsByPolicyId(this.policyDto.policyId).subscribe(data => {
      this.documents = data.documents;
    }, error => {
      this.showErrorMessage(error);
    });
  }

  /**
   * Shows pop up message.
   * @param title Message title.
   * @param msg Message body.
   */
  showMessage(title: string, msg: string) {
    let message = '';
    let messageTitle = '';
    this.translate.get(title).subscribe(
      result => messageTitle = result
    );
    this.translate.get(msg).subscribe(
      result => message = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /** check if there is mistake on the request service */
  checkIfIsBusinessError(error) {
    return error.status === 404;
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

  showPaymentByInsurance() {
    this.bupaInsuranceValid = this.paymentService.validateCanMakePayment(this.policyDto);
  }

  goToBack() {

    if (this.routingState.getPreviousUrl().includes('/policies/enrollment-application-view')) {
      return this.router.navigate(['/policies/enrollment-application-view']);
    }

    if (this.routingState.getPreviousUrl().includes('register-account-success')) {
      this.router.navigate(['/policies/view-policy-information']);
    } else {
      this.location.back();
    }

  }

  setClaimPaymentMethodAsActiveTab() {
    if (this.routingState.getPreviousUrl().includes('register-account')) {
    // #finance
    if (this.viewClaimMethodPayment && !this.loadingPayee) {
      this.getPayeesByPolicyId();
      Utilities.delay(1000).then(() => {
        this.payee.nativeElement.click();
      });
    }
    }
  }

  getPaymentsByPolicyId() {
    // $(this.ID_DETAIL_TOGGLE + this.policyDto.policyId).slideToggle();
    this.policyService.getPolicyPaymentsByPolicyId(this.policyDto.policyId)
      .subscribe(
        data => {
          this.searchProccess = true;
          this.policyDto.payments = data.payments;
        }, error => {
          if (error.status === 404) {
            this.searchProccess = true;
            this.policyDto.payments = [];
          } else if (this.checksIfHadBusinessError(error)) {
            this.showErrorMessage(error);
          }
        });
  }

  getPayeesByPolicyId() {
    if (!this.payees) {
      this.loadingPayee = true;
      this.financeService.getPayeesByPolicy(this.policyId.toString()).subscribe(payee => {
        this.payees = payee;
      }, error => {
        this.payees = error;
      });
    }

  }

  showToPayMexicanPesos() {
    const insuranceBusinessAgent = Number(this.user.bupa_insurance);
    if (insuranceBusinessAgent === InsuranceBusiness.BUPA_MEXICO) {
      this.sizeColumnToPay = 4;
      this.showToPayMexicanPeso = true;
    } else {
      this.sizeColumnToPay = 6;
      this.showToPayMexicanPeso = false;
    }
  }

  isRoleEmployeeOrAdmin(): boolean {
    return (this.user.role_id === this.role_id_employee || this.user.role_id === this.role_id_admin);
  }

  /**
  * If the role is Agent/AgentAssist, it must show money ReceivedMethod.
  */
  isRoleAgent(): boolean {
    return (this.user.role_id === this.role_id_agent || this.user.role_id === this.role_id_agentassistant);
  }

  /**
   * Handle the generate certificate button display.
   */
  handleShowCertificateBtn() {
    if (this.policyDto && this.policyDto.letters) {
      if (this.policyDto.letters.find(x => x.letterTypeId === PolicyDocumentTypeConstants.CERTIFICATE_COVERAGE)) {
        return true;
      } else {
        return false;
      }
    } else { return false; }
  }

  /**
   * Generate certificate of coverage.
   */
  generateCertificate() {
    this.policyService.getPolicyDocumentLetter(
      String(this.policyDto.policyId),
      String(this.translationService.getLanguageId()),
      PolicyDocumentTypeConstants.CERTIFICATE_COVERAGE
    ).subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      saveAs(blob, '.pdf');
    }, error => {
      this.showNotFoundDocument(error);
    }
    );
  }



  /**
   * Shows the message when the Item was not found.
   * @param error Http Error message.
   */
  showNotFoundDocument(error: HttpErrorResponse) {
    if (error.error === '404') {
      let message = '';
      let messageTitle = '';
      this.translate.get(`POLICY.ERROR.ERROR_CODE.404`).subscribe(
        result => messageTitle = result
      );
      this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.404`).subscribe(
        result => message = result
      );
      this.notification.showDialog(messageTitle, message);
    }
  }

  /**
   * Shows tab members by policy status
   * @param policyStatus
   * @returns
   */
  showTabMembersByPolicyStatus(policyStatus): boolean {
    return !this.statusesToExcludeTabMembers.includes(policyStatus);
  }

  /**
   * Handle the generate payment status letter button display.
   */
  handleShowPaymentStatusBtn() {
    if (this.policyDto && this.policyDto.letters) {
      if (this.policyDto.letters.find(x => x.letterTypeId === PolicyDocumentTypeConstants.ACCOUNT_STATUS)) {
        return true;
      } else {
        return false;
      }
    } else { return false; }
  }

  /**
   * Generate payment status letter.
   */
  generatePaymentStatus() {
    this.policyService.getPolicyDocumentLetter(
      String(this.policyDto.policyId),
      String(this.translationService.getLanguageId()),
      PolicyDocumentTypeConstants.ACCOUNT_STATUS
    ).subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      saveAs(blob, '.pdf');
    }, error => {
      this.showNotFoundDocument(error);
    }
    );
  }

  get enabletaxdataupdate() {    
    return this.role_id === "1" || this.role_id === "3";
  }

}
