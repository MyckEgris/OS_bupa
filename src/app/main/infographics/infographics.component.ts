/**
* InfographicsComponent.ts
*
* @description: use to display useful information on prehome
* @author
* @version 1.0
* @date 11-04-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentInformation } from '../home/contentManagementService/conten-Information';
import { ContentInformationService } from '../home/contentManagementService/content.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { AuthService } from '../../security/services/auth/auth.service';
import { ContentType } from '../home/contentManagementService/content-type';
import { RedirectService } from 'src/app/shared/services/redirect/redirect.service';
import { Router } from '@angular/router';
import { InfographicsService } from './infographics.service';

@Component({
  selector: 'app-infographics',
  templateUrl: './infographics.component.html'
})
export class InfographicsComponent implements OnInit, OnDestroy {


  /**
  * Content Information
  */
  public contentInformation: ContentInformation[];
  /**
   * Holds the subscription to realize when the user change language
   */
  private languageSubcripcion;

  /**
   * welcome msg
   */
  public welcomeMsg: string;

  /**
   * @param _authService  auth service injection
   * @param translate  translate injection
   * @param contentInformationService content information service injection
   * @param translation  translation service inyection
   */
  constructor(
    private contentInformationService: ContentInformationService,
    private translate: TranslateService,
    private translation: TranslationService,
    private _authService: AuthService,
    private _redirectService: RedirectService,
    private router: Router,
    private infographicsService: InfographicsService
  ) { }

  /**
   * load the propper information filter by rol and language
  */
  ngOnInit() {
    this.defineTitleMessage();
    this.loadContent();
    this.languageSubcripcion = this.translate.onLangChange.subscribe( () => {
        this.loadContent();
    });
  }

  /**
   * close subscription
   */
  ngOnDestroy(): void {
    this.languageSubcripcion.unsubscribe();
  }

  loadContent() {
    this.contentInformationService.getContentFromStorage(ContentType.InMemoryStorage).subscribe(
      result => {
        this.contentInformation = result.filter(x => x.language === this.translation.getLanguage())
                                  .filter( x => (x.roles.split(',').indexOf( this._authService.getUser().role) !== -1) &&
                                    (x.insuranceBussiness &&
                                      x.insuranceBussiness.split(',').indexOf( this._authService.getUser().bupa_insurance) !== -1) );
      }
    );
  }

  /**
   * define where to find the welcome message according the role
   */
  defineTitleMessage() {
    switch (this._authService.getUser().role) {
      case 'Agent':
      case 'GroupAdmin':
      case 'AgentAssistant':
          this.welcomeMsg = 'AGENT';
      break;
      case 'PolicyHolder':
      case 'GroupPolicyHolder':
          this.welcomeMsg = 'POLICY_HOLDER';
      break;
      case 'Provider':
          this.welcomeMsg = 'PROVIDER';
      break;
      default:
          this.welcomeMsg = 'AGENT';

    }
  }

  /**
   * Allows to open differents links
   * 1: Internal 2: External embedded 3: External open outside
   * @param content Info content
   */
  onNavigate(contentP: ContentInformation) {
    if (contentP.contentUrlTypeId === '3') {
      this._redirectService.showModal(contentP.contentUrl);
    } else if (contentP.contentUrlTypeId === '2') {
      this.infographicsService.newContent(contentP);
      this.router.navigate(['/info']);
    }
  }
}
