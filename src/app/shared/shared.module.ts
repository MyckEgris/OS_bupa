import { HideIfRoleDirective } from './directives/hide-if-role.directive';
import { ValueOrMoneyPipe } from './pipes/value-or-money.pipe';
import { DateDashedDirective } from './directives/date-dash-format.directive';
import { OnlyLettersDirective } from './directives/only-letter.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IdleUserComponent } from './services/idle-user/idle-user/idle-user.component';
import { NotificationComponent } from './services/notification/notification-component/notification.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from './services/common/common.service';
import { ProviderService } from './services/provider/provider.service';
import { UserService } from './services/user/user.service';
import { RoleService } from './services/roles/role.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './interceptors/http-error-interceptor';
import { TranslateModule } from '@ngx-translate/core';
import { PolicyService } from './services/policy/policy.service';
import { DateTranslatePipe } from './pipes/date-translate/date-translate.pipe';
import { RequestLoadingService } from './services/request-loading/request-loading.service';
import { CustomDatePickerComponent } from './components/custom-date-picker/custom-date-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { CustomDatePickerFromToComponent } from './components/custom-date-picker-from-to/custom-date-picker-from-to.component';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
import { SafePipe } from './pipes/sanitize/safe.pipe';
import { ShowPasswordDirective } from './directives/show-password.directive';
import { ValidateFieldDirective } from './directives/validate-field.directive';
import { NgxMaskModule } from 'ngx-mask';
import { CacheMapService } from './services/caching/cache-map.service';
import { CachingService } from './services/caching/caching-service';
import { AgentService } from './services/agent/agent.service';
import { ConcatenatePipe } from './pipes/concatenate/concatenate-pipe';
import { FormatValueDirective } from './directives/format-value.directive';
import { PagerService } from './services/pager/pager.service';
import { MoreInformationDirective } from './directives/more-information.directive';
import { CustomPopoverComponent } from './components/custom-popover/custom-popover.component';
import { ReplaceSpacesPipe } from './pipes/replace-spaces/replace-spaces-pipe';
import { MatButtonModule, MatDialogModule, MatListModule, MatProgressBarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { UploadComponent } from './upload/upload.component';
import { DialogComponent } from './upload/dialog/dialog.component';
import { UploadService } from './upload/upload.service';
import { DxPieChartModule } from 'devextreme-angular/ui/pie-chart';
import { PortfolioPieChartComponent } from './components/charts/portfolio-pie-chart/portfolio-pie-chart.component';
import { AddTokenInterceptor } from './interceptors/add-token.interceptor';
import { MaxCharsAllowedDirective } from './directives/max-chars-allowed.directive';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { CustomCurrencyPipe } from './pipes/currency/custom-currency.pipe';
import { CurrencyFormatterDirective } from './directives/currency.directive';
import { ShowIfRoleDirective } from './directives/show-if-role.directive';
import { DxChartModule } from '../../../node_modules/devextreme-angular';
import { CalculateAgePipe } from './pipes/calculate-age/calculate-age.pipe';
import { DateMaskDirective } from './directives/date-mask.directive';
import { RedirectComponent } from './services/redirect/redirect.component';
import { RoutingStateService } from './services/routing/routing-state.service';
import { DisableControlDirective } from './directives/disable-control.directive';
import { MyAgentComponent } from './../policy/my-agent/my-agent.component';
import { ShowIfBusinessInsuranceDirective } from './directives/show-if-business-insurance.directive';
import { DomSecurityPipe } from './pipes/dom-security/dom-security.pipe';
import { LZStringModule, LZStringService } from 'ng-lz-string';
import { PolicyProfileComponent } from '../policy/policy-profile/policy-profile.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { QuotationWizardService } from '../policy/quotation/quotation-wizard/quotation-wizard.service';
import { Ng5SliderModule } from 'ng5-slider';
// Import your library
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MultiStepWizardComponent } from './components/multi-step-wizard/multi-step-wizard.component';
import { QuoteService } from './services/quote/quote.service';
import { BreadcrumbEnrollmentComponent } from './components/breadcrumb-enrollment/breadcrumb-enrollment.component';
import { DatepickerWrapperComponent } from './components/custom-datepicker-wrapper/datepicker-wrapper';
import { NavigationButtonsComponent } from './components/navigation-buttons/navigation-buttons.component';
import { FilterRulesBydocumentTypeIdPipe } from './pipes/filter-rules-by-document-type-id.pipe';
import { PolicyApplicationTableComponent } from './components/policy-application-table/policy-application-table.component';
import { PolicyApplicationCardsComponent } from './components/policy-application-cards/policy-application-cards.component';
import { PolicyApplicationListSearchComponent } from './components/policy-application-list-search/policy-application-list-search.component';
import { CreditCardMaskDirective } from './directives/credit-card-mask.directive';
import { ProviderDetailService } from './services/provider-detail/provider-detail.service';
import { TranslateObservableListGenderPipe } from './pipes/translate-observable-list-gender.pipe';
import { TranslateObservableListMaritalStatusPipePipe } from './pipes/translate-observable-list-marital-status-pipe.pipe';
import { RegexInputDirective } from './directives/regex-input-field.directive';
import { ReplaceParamsPipe } from './pipes/replace-params/replace-params.pipe';
import { ReceivedMethodPipe } from './pipes/received-method/received-method.pipe';
import { AgreementsComponent } from './services/agreement/agreements/agreements.component';
import { InformationComponent } from './components/information/information.component';
import { UploadFormMultiComponent } from './upload-form-multi/upload-form-multi.component';
import { DialogFormMultiComponent } from './upload-form-multi/dialog-form-multi/dialog-form-multi.component';
import { UploadFilePaymentComponent } from './upload-file-payment/upload-file-payment.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatProgressBarModule,
    FlexLayoutModule,
    HttpClientModule,
    //  BrowserAnimationsModule,
    RouterModule,
    TranslateModule,
    NgbModule,
    NgxMaskModule,
    DxPieChartModule,
    DxChartModule,
    FormsModule,
    LZStringModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    SlickCarouselModule
  ],
  declarations: [IdleUserComponent, NotificationComponent, DateTranslatePipe, ConcatenatePipe,
    CustomDatePickerComponent, DatepickerWrapperComponent, CustomDatePickerFromToComponent, OnlyNumberDirective, OnlyLettersDirective,
    BlockCopyPasteDirective, SafePipe, ShowPasswordDirective, ValidateFieldDirective, DateDashedDirective, FormatValueDirective,
    ValueOrMoneyPipe, MoreInformationDirective, CustomPopoverComponent, ReplaceSpacesPipe, UploadComponent, DialogComponent,
    PortfolioPieChartComponent, MaxCharsAllowedDirective, AutocompleteComponent,
    CustomCurrencyPipe, CurrencyFormatterDirective, ShowIfRoleDirective, CalculateAgePipe, HideIfRoleDirective, DateMaskDirective,
    RedirectComponent, DisableControlDirective, MyAgentComponent, PolicyProfileComponent, ShowIfBusinessInsuranceDirective,
    DomSecurityPipe, DynamicFormComponent, MultiStepWizardComponent, BreadcrumbEnrollmentComponent, NavigationButtonsComponent,
    FilterRulesBydocumentTypeIdPipe,
    PolicyApplicationTableComponent,
    PolicyApplicationCardsComponent,
    PolicyApplicationListSearchComponent,
    CreditCardMaskDirective,
    TranslateObservableListGenderPipe,
    AgreementsComponent,
    InformationComponent,
    TranslateObservableListMaritalStatusPipePipe,
    RegexInputDirective,
    ReplaceParamsPipe,
    ReceivedMethodPipe,
    UploadFormMultiComponent,
    DialogFormMultiComponent,
    UploadFilePaymentComponent
  ],
  exports: [NotificationComponent, DateTranslatePipe, ConcatenatePipe, CustomDatePickerComponent, DatepickerWrapperComponent,
    OnlyNumberDirective, OnlyLettersDirective, CustomDatePickerFromToComponent, SafePipe, ShowPasswordDirective,
    ValidateFieldDirective, DateDashedDirective, FormatValueDirective, ValueOrMoneyPipe, MoreInformationDirective,
    CustomPopoverComponent, ReplaceSpacesPipe, UploadComponent, PortfolioPieChartComponent, MaxCharsAllowedDirective,
    AutocompleteComponent, CustomCurrencyPipe, CurrencyFormatterDirective, ShowIfRoleDirective, CalculateAgePipe, HideIfRoleDirective,
    FormsModule, ReactiveFormsModule, DateMaskDirective, RedirectComponent, DisableControlDirective, MyAgentComponent,
    PolicyProfileComponent, ShowIfBusinessInsuranceDirective, DomSecurityPipe, DynamicFormComponent, Ng5SliderModule, SlickCarouselModule,
    MultiStepWizardComponent, BreadcrumbEnrollmentComponent, NavigationButtonsComponent, DialogComponent,
    FilterRulesBydocumentTypeIdPipe, PolicyApplicationListSearchComponent,
    PolicyApplicationCardsComponent, PolicyApplicationTableComponent,
    CreditCardMaskDirective,
    AgreementsComponent,
    InformationComponent,
    TranslateObservableListGenderPipe,
    TranslateObservableListMaritalStatusPipePipe, RegexInputDirective,ReplaceParamsPipe, ReceivedMethodPipe, UploadFormMultiComponent, DialogFormMultiComponent, UploadFilePaymentComponent
  ],
  entryComponents: [DialogComponent, DialogFormMultiComponent, UploadFilePaymentComponent],
  providers: [CachingService, UploadService, LZStringService]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AgentService,
        CookieService,
        CommonService,
        ProviderService,
        UserService,
        RoleService,
        PolicyService,
        PagerService,
        RequestLoadingService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true
        },
        QuotationWizardService,
        CacheMapService,
        AddTokenInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AddTokenInterceptor,
          multi: true
        },
        RoutingStateService,
        ProviderDetailService
      ]
    };
  }
}
