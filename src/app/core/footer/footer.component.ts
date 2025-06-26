/**
* FooterComponent.ts
*
* @description: FooterComponent
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component, OnInit,ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { RedirectService } from 'src/app/shared/services/redirect/redirect.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { HostListener } from '@angular/core';

/**
 * FooterComponent
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  @ViewChild('tooltipPrivacyPolitics') tooltipPrivacyPolitics: NgbTooltip;

  anio: string = new Date().getFullYear() + ' ';

  /**
   * Code for the external links
   */
  public code = 'ES';

  /**
   * Path for the static files URL
  */
  public urlBase = '';

  private urlPolicy = '';
  private urlTerms = '';
  private urlServices = '';

  /**
   * Constructor method
   * @param translate  translate injection
   * @param translation  translation service inyection
   * @param RedirectService Redirect Service Service Injection
   */
  constructor(private translate: TranslateService,
    private translationService: TranslationService,
    private _redirectService: RedirectService,
    private _config: ConfigurationService,
    private _auth: AuthService) { }

  /**
   * load the actual page language
   */
  ngOnInit() {
    this.urlBase = this._config.staticHtmlFileRoot;

    this.translate.onLangChange.subscribe(res => {
      this.properlink();
    });

    this.properlink();
  }


  /**
   * changes the links according to the language
   */
  private properlink() {
    const language = this.translationService.getLanguage();
    if (language === 'SPA') {
      this.code = 'es';
    }
    if (language === 'ENG') {
      this.code = 'en';
    }
    this.translate.get('FOOTER.POLICY_URL').subscribe(message => {
      this.urlPolicy = message;
    });

    this.translate.get('FOOTER.TERMS_URL').subscribe(message => {
      this.urlTerms = message;
    });
    this.translate.get('FOOTER.SERVICES_URL').subscribe(message => {
      this.urlServices = message;
    });
  }

  navigate(pathUrl) {
    switch (pathUrl) {
      case 'Privacy':
        this._redirectService.showModal(`${this.urlPolicy}`);
        break;
      case 'Services':
        this._redirectService.showModal(`${this.urlBase}${this.urlServices}`);
          break;
      case 'Terms':
        this._redirectService.showModal(`${this.urlTerms}`);
        break;
      default:
        break;
    }
  }

  closeTooltipPrivacyPolitics(){
    this.tooltipPrivacyPolitics.close();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    if (target.id !== "tooltipPrivacyPolitics") this.tooltipPrivacyPolitics.close();
  }
}
