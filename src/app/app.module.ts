/**
* AppModule.ts
*
* @description: Modularize application and lazy load
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ApplicationRef } from '@angular/core';
import { AppComponent } from './app.component';
import { ConfigurationService } from './shared/services/configuration/configuration.service';
import { AuthGuardService } from './security/services/auth-guard/auth-guard.service';
import { MainModule } from './main/main.module';
import { SecurityModule } from './security/security.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { SupportModule } from './support/support.module';
import { UserModule } from './user/user.module';
import { PolicyModule } from './policy/policy.module';
import { AgentModule } from './agent/agent.module';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { reducers } from './reducers';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { CacheService } from './shared/services/cache/cache.service';
import { IdleUserComponent } from './shared/services/idle-user/idle-user/idle-user.component';
import { UserIdleModule, UserIdleService } from 'angular-user-idle';
import { AppRoutingModule } from './app-routing.module';
import { AgreementsComponent as AgreementsComponentForm} from './shared/services/agreement/agreements/agreements.component';
import { AgreementsComponent } from './main/services/agreement/agreements/agreements.component';
import { NotificationComponent } from './shared/services/notification/notification-component/notification.component';
import { ClaimModule } from './claim/claim.module';
import { DateFormatService } from './shared/services/date-format/date-format';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-US';
import { Error401Component } from './core/errors/error401/error401.component';
import { ClaimViewEobComponent } from './claim/claim-view-eob/claim-view-eob.component';
import { PaymentModule } from './payment/payment.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable-next-line:max-line-length
import { ViewPolicyCardsComponent } from './policy/view-policy-information/view-detail-information/view-policy-cards/view-policy-cards.component';
import { RedirectComponent } from './shared/services/redirect/redirect.component';
import { PreHomeComponent } from './main/pre-home/pre-home.component';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { InquiryModule } from './inquiry/inquiry.module';
import { ModalDiagnosticComponent } from './claim/pre-authorization/diagnostic/modal-diagnostic/modal-diagnostic.component';
import { ModalProcedureComponent } from './claim/pre-authorization/procedure/modal-procedure/modal-procedure.component';
import { EventNotificationModule } from './event-notification/event-notification.module';
import { SearchBenefitsModalComponent } from './policy/search-benefits/search-benefits-modal/search-benefits-modal.component';
import { NetworkModule } from './network/network.module';
import { QuotationEditMembersComponent } from './policy/quotation/quotation-edit-members/quotation-edit-members.component';
import { CoverageModule } from './coverage/coverage.module';
import { AddPlansModalComponent } from './coverage/add-plans/add-plans-modal/add-plans-modal.component';
import { ReportModule } from './report/report.module';
import { PreHomeProviderComponent } from './main/pre-home-provider/pre-home-provider.component';
import { BupaAppModule } from './bupa-app/bupa-app.module';


/**
 * Load configuration before application starts
 * @param configService Configuration Service Injection
 */
export function initConfiguration(configService: ConfigurationService): Function {
  return () => configService.load();
}

/**
 * Translate Loader for translate service
 * @param http HttpClient
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Modularize application and lazy load
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    SecurityModule.forRoot(),
    MainModule,
    CoreModule,
    RouterModule,
    MainModule,
    UserModule,
    ClaimModule,
    PolicyModule,
    PaymentModule,
    InquiryModule,
    AgentModule,
    SupportModule,
    NetworkModule,
    ReportModule,
    CoverageModule,
    EventNotificationModule,
    BupaAppModule,
    OAuthModule.forRoot(),
    NgbModule.forRoot(),
    UserIdleModule.forRoot({ idle: 3600, timeout: 30, ping: 120 }),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    BootstrapModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxMaskModule.forRoot(),
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    AppRoutingModule
  ],
  providers: [
    ConfigurationService,
    AuthGuardService,
    HttpClient,
    CacheService,
    UserIdleService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfiguration,
      deps: [ConfigurationService],
      multi: true
    },
    {
      provide: NgbDateParserFormatter,
      useClass: DateFormatService
    },
    Title
  ],
  entryComponents: [
    IdleUserComponent,
    AgreementsComponent,
    AgreementsComponentForm,
    NotificationComponent,
    SearchBenefitsModalComponent,
    RedirectComponent,
    Error401Component,
    ClaimViewEobComponent,
    ViewPolicyCardsComponent,
    PreHomeComponent,
    ModalDiagnosticComponent,
    ModalProcedureComponent,
    QuotationEditMembersComponent,
    AddPlansModalComponent,
    PreHomeProviderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  /**
   * Constructor Method
   * @param applicationRef ApplicationRef
   */
  constructor(applicationRef: ApplicationRef) {
    Object.defineProperty(applicationRef, '_rootComponents', { get: () => applicationRef['components'] });
    registerLocaleData(localeEs, 'es-Us');
  }

}

