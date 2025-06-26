/**
* ViewMembersInformationComponent
*
* @description: recibes the member's information and show it on the screen
* @author Andres Tamayo
* @version 1.0
* @date 13-02-2019.
*
**/
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewPolicyCardsComponent } from '../view-policy-cards/view-policy-cards.component';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { SearchBenefitsService } from 'src/app/policy/search-benefits/search-benefits.service';
@Component({
  selector: 'app-view-members-information',
  templateUrl: './view-members-information.component.html'
})
export class ViewMembersInformationComponent implements OnInit, OnDestroy {

  /** contains all the member information */
  public members: MemberOutputDto[];
  /** Policy id */
  public policyId: number;
  /** contains if the first card can be print */
  public printIdCard: number;
  /** contains if the second card can be print */
  public hasGeoBlueIdCard: number;

  public policyReference: string;

  public currencyInput: string;

  showSearchBenefit: boolean;

  @Input() policyDto: PolicyDto;
  /** contais the element who has the special conditions */
  private ID_DETAIL_TOGGLE = '#ig-detalleExclusiones-';
  /** array with the member's special conditions */
  public specialConditionsR = [];
  /** holds the role of the logged person */
  public role: string;

  public mainMember: MemberOutputDto;

  public showDependentPremium = false;
  public isDiffGroupAdminAgentRole = false;

  /**
   * Holds the subscription to realize when the user change language
   */
  private languageSubcripcion;

  /**
   *
   * @param _policeService  police service inyection
   * @param modalService modal service inyection
   * @param _authService auth service inyection
   */
  constructor(
    private _policeService: PolicyService,
    private modalService: NgbModal,
    private _authService: AuthService,
    private translate: TranslateService,
    private notification: NotificationService,
    private translationService: TranslationService,
    private searchBenefitsService: SearchBenefitsService
  ) { }

  /**
   * Loads the role of the person who is log on the page
   */
  ngOnInit() {
    this.role = this._authService.getUser().role;
    this.members = this.policyDto.members;
    this.policyId = this.policyDto.policyId;
    this.printIdCard = this.policyDto.printIdCard;
    this.hasGeoBlueIdCard = this.policyDto.hasGeoBlueIdCard;
    this.policyReference = this.policyDto.policyReference;
    this.mainMember = this.members.filter(membersF => membersF.relationTypeId === 2)[0];
    this.isAgentGroup();
    this.existsDependents();

    this.languageSubcripcion = this.translate.onLangChange.subscribe(res => {
      this.loadactualLanguages();
    });

    this.loadactualLanguages();
  }

  ngOnDestroy(): void {
    this.languageSubcripcion.unsubscribe();
  }

  /**
  * If the role is GroupAdmin, it mustn't show money.
  */
  isAgentGroup() {
    const groupAdmin = 'GroupAdmin';
    this.isDiffGroupAdminAgentRole = !(groupAdmin.indexOf(this.role) > -1);
  }

  /**
  * use to update the string to show on diferents segments
  * @param lng string with the current language
  */
  private loadactualLanguages() {
    const languageId = this.translationService.getLanguageId();
    for (let a = 0; a < this.members.length; a++) {

      this.members[a].filterSpecialConditions = this.members[a].specialConditions.filter(x => x.languageId === languageId);
      if (languageId === 1 && this.policyDto.isGroupPolicy) {
        this.members[a].filterSpecialConditions = this.members[a].filterSpecialConditions.filter(
          x => x.limitationName !== 'Extra Premium' && x.limitationName !== 'Cap Amount');
      }
      if (languageId === 2 && this.policyDto.isGroupPolicy) {
        this.members[a].filterSpecialConditions = this.members[a].filterSpecialConditions.filter(
          x => x.limitationName !== 'Prima Extra' && x.limitationName !== 'Sobreprima' && x.limitationName !== 'Tope máximo');
      }

      // this.members[a].specialConditions.filter(x => x.languageId === 0).forEach(z => {
      //   this.members[a].filterSpecialConditions.push(z);
      // });
    }
  }

  asignedUSD() {
    return this.policyDto.currencySymbol === '$ ' ? 'USD '.concat(this.policyDto.currencySymbol) : this.policyDto.currencySymbol;
  }

  /**
   * Check if exists dependants
   */
  existsDependents() {
    const found = this.members.find(function (element) {
      return (element.relationTypeId !== 2 && element.relationTypeId !== 3 && element.memberStatusId === Number(29));
    });
    if (found) {
      this.showDependentPremium = true;
    }
  }

  /**
   * Receive the card an makes a query to get his cards
   * @param memberId  member's id
   * @param cardType type card
   */
  showCards(memberId, cardType) {
    this._policeService.getPolicyCardsByPolicyIdAndMemberId(this.policyId, memberId, cardType)
      .subscribe(Response => {
        const cardsCollection = [];
        for (const key in Response.cards[0]) {
          if (Response.cards[0].hasOwnProperty(key)) {
            const element = Response.cards[0][key];
            if (typeof (element) === 'string') {
              cardsCollection.push(element);
            }
          }
        }
        this.showDialog(this.policyId + '_' + memberId, cardsCollection);
      },
        error => {
          this.showNotFoundDocument();
        });
  }

  /**
   * Shows the message when the Item was not found.
   * @param error Http Error message.
   */
  showNotFoundDocument() {

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

  /**
   * Launch the modal with the card members
   * @param title  modal´s title
   * @param cardsCollection array with the card's images
   */
  async showDialog(title, cardsCollection) {
    const result = this.modalService.open(ViewPolicyCardsComponent,
      { centered: true, backdrop: 'static', keyboard: false, size: 'lg', windowClass: 'modal-cards-collection' });
    const dialog = result.componentInstance as ViewPolicyCardsComponent;
    dialog.title = title;
    dialog.cardsCollection = cardsCollection;
    dialog.policyID = this.policyReference;

    return await result.result;
  }

  /**
   * use to slidown  the members special conditions
   * @param member
   */
  toggleSlideDetail(member: MemberOutputDto) {
    $(this.ID_DETAIL_TOGGLE + member.memberId).slideToggle();
  }

  /**
   * use to slidown  the members special conditions
   * @param member
   */
  showSearchBenefits(policyId: number, memberId: number) {
    this.searchBenefitsService.showDialog(policyId, memberId);
  }



}
