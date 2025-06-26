/**
* AppComponent.ts
*
* @description: Initial application component
* @author Juan Camilo Moreno.
* @author Yefry Lopez.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { ConfigurationService } from './shared/services/configuration/configuration.service';
import { UserIdleService } from 'angular-user-idle';
import { RoutingStateService } from './shared/services/routing/routing-state.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from './security/services/auth/auth.service';
import { TranslationService } from './shared/services/translation/translation.service';
// import { AppinsightService } from './shared/services/insight/appinsight.service';

/**
 * Initial application component
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * Constant for time out
   */
  private TIME_OUT = 3000;

  /**
   * Title
   */
  public title = 'app';

  /**
   * Now
   */
  public now = '';
  subs: Subscription;
  /**
   * Constructor Method
   * @param config Configuration Service Injection
   * @param userIdle User Idle Service Injection
   * @param _insightService User AppinsightService Service Injection
   */
  constructor(
    private config: ConfigurationService,
    private userIdle: UserIdleService,
    private routingState: RoutingStateService,
    private titleService: Title,
    private translate: TranslateService,
    private hostElement: ElementRef,
    private auth: AuthService,
    private translation: TranslationService
  ) {
    routingState.loadRouting();
  }


  ngOnDestroy(): void {
    if (this.subs) { this.subs.unsubscribe(); }
  }

  /**
   * On Init event. Initialize drag listener and drop listener. Config idle
   */
  ngOnInit(): void {
    window.addEventListener('dragover', e => e.preventDefault());
    window.addEventListener('drop', e => e.preventDefault());
    this.userIdle.setConfigValues({ idle: this.config.idle, timeout: this.config.timeout, ping: 120 });
    setTimeout(() => {
      this.title = this.config.apiHost;
      this.now = new Date().toString();
    }, this.TIME_OUT);

    this.subs = this.translate.onLangChange.subscribe(app => {
      this.titleService.setTitle(app.translations.APP.APP_TITLE);
    });
  }

  ngAfterViewInit(): void {
    const iframe = document.getElementById('page-top');
  }

}



