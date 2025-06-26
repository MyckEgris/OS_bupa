/**
* AgentHomeComponent.ts
*
* @description: This component shows the proper information for provider
* @author
* @version 1.0
* @date 22-03-2019.
*
**/
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../security/services/auth/auth.service';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { ContentInformation } from '../home/contentManagementService/conten-Information';
import { RedirectService } from 'src/app/shared/services/redirect/redirect.service';


@Component({
  selector: 'app-agent-home',
  templateUrl: './agent-home.component.html'
})
export class AgentHomeComponent implements OnInit {

  /**
   * current user id
   */
  @Input() currentUserId: string;

  /**
   * current user role id
   */
  public currentUserRoleId: string;
  /**
   * Content Information
   */
  public contentInformation: ContentInformation[];


  /**
   * Constructor method
   * @param _authService  auth service injection
   * @param contentInformationService content information service injection
   * @param translate  translate injection
   * @param translation  translation service inyection
   * @param RedirectService Redirect Service Service Injection
   */
  constructor(
    private _authService: AuthService,
    private translation: TranslationService,
    private _redirectService: RedirectService
  ) { }

  /**
   * load the propper information filter by rol and language
  */
  ngOnInit() {
    this.currentUserRoleId = this._authService.getUser().role_id;
  }


  /**
   * Allows to open differents links
   * @param url url to open
   */
  onNavigate(url: string) {
    this._redirectService.showModal(url);
  }

  /**
   * valid the language to load the proper document
   * @param key
   */
  onNavigateTranslated(key) {
    const urls = this.translation.getLanguage() === 'ENG' ? this.getEngUrls() : this.getSpaUrls();
    window.open(urls[key]);
  }

  /**
   * load the proper document for english language
   */
  getEngUrls() {
    const urls = {};
    urls['incentive'] = 'https://www.bupalatinamerica.com/Agents/bupa/pdf/sales_incentives/Bupa_Personal-Policy_Incentive-2016-Eng.pdf';
    return urls;
  }

  /**
   * Load the proper document for spanish language
   */
  getSpaUrls() {
    const urls = {};
    urls['incentive'] = 'https://www.bupalatinamerica.com/Agents/bupa/pdf/sales_incentives/Bupa_Personal_Policy_Incentive-2016-Spa.pdf';
    return urls;
  }


}
