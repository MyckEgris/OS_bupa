/**
* ViewDisclaimerComponent.ts
*
* @description: This component shows Terms of user agreements
* @version 1.0
* @date 22-03-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AgreementService } from 'src/app/main/services/agreement/agreement.service';
import { Store, select } from '@ngrx/store';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Agreement } from 'src/app/main/services/agreement/models/agreement.model';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-view-disclaimer',
  templateUrl: './view-disclaimer.component.html'
})
export class ViewDisclaimerComponent implements OnInit, OnDestroy {
  agreements: any;
  agreementContent: string;
  acceptedOn: string;
  agentAcceptedOn: string;
  agreementTitle: string;
  user: any;


  /**
   * Holds the subscription to realize when the user change language
   */
  private languageSubcripcion;

  constructor(
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private agreementService: AgreementService,
    private translation: TranslationService,
    private translate: TranslateService) { }


  /**
   * Loads the current agrements acording to the language
   */
  async ngOnInit() {
    let lang;
    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.user = userInfo;

    });
    lang = this.translation.getLanguage();
    this.disclaimer(lang);

    this.languageSubcripcion = this.translate.onLangChange.subscribe(() => {
      lang = this.translation.getLanguage();
      this.disclaimer(lang);
    });
  }

  ngOnDestroy(): void {
    this.languageSubcripcion.unsubscribe();
  }

  async disclaimer(lang) {

    this.agreements = await this.agreementService.getUserAgreementById(this.user.sub);
    this.acceptedOn = this.agreements.userAgreementVersionsDto.filter(agr => agr.agreementVersionId === 2)[0].dateAccepted;


    if (this.user.role !== 'Provider' && this.user.role !== 'PolicyHolder' && this.user.role !== 'GroupPolicyHolder') {
      // this.agentAcceptedOn = this.agreements.userAgreementVersionsDto.filter(agr => agr.agreementVersionId === 6)[0].dateAccepted;
      const existsAgreement = this.agreements.userAgreementVersionsDto.filter(agr => agr.agreementId === 1);
      if (existsAgreement.length > 0) {
        this.agentAcceptedOn = existsAgreement[0].dateAccepted;
        const agreementsByRoles: any = await this.agreementService.getAgreementsByRole(this.user.roles, lang);
        const agreementDtoList: Array<Agreement> = agreementsByRoles.aggrementsDto;
        const agreementByRoleFiltered: any = agreementDtoList.filter(p => p.agreementId === 1);
        this.agreementTitle = agreementByRoleFiltered[0].title;
        this.agreementContent = await this.agreementService.getHtmlAgreement(`./assets/${agreementByRoleFiltered[0].agreementUrl}`);
      }
    }
  }
}
