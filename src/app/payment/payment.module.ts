import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentRoutingModule } from './payment-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PaymentContainerComponent } from './payment-container/payment-container.component';
import { PaymentPolicyInfoComponent } from './payment-container/payment-policy-info/payment-policy-info.component';
import { CoreModule } from '../core/core.module';
import { PaymentProcessOkComponent } from './payment-container/payment-process-ok/payment-process-ok.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentCheckComponent } from './payment-container/payment-check/payment-check.component';

// tslint:disable-next-line: max-line-length
import { PaymentCreditCardSyncComponent } from './payment-container/payment-credit-card/payment-credit-card-sync/payment-credit-card-sync.component';
import { PaymentCreditCardComponent } from './payment-container/payment-credit-card/payment-credit-card.component';
// tslint:disable-next-line: max-line-length
import { PaymentCreditCardMexComponent } from './payment-container/payment-credit-card/payment-credit-card-mex/payment-credit-card-mex.component';
// tslint:disable-next-line: max-line-length
import { PaymentCreditCardEcuComponent } from './payment-container/payment-credit-card/payment-credit-card-ecu/payment-credit-card-ecu.component';
import { PaymentResultMexComponent } from './payment-container/payment-result-mex/payment-result-mex.component';
import { PaymentResultEcuComponent } from './payment-container/payment-result-ecu/payment-result-ecu.component';
import { PaymentProcessErrorComponent } from './payment-container/payment-process-error/payment-process-error.component';
// tslint:disable-next-line: max-line-length
import { PaymentWidgetComponent } from './payment-container/payment-credit-card/payment-credit-card-ecu/payment-widget/payment-widget.component';
import { PaymentCreditCardStepsComponent } from './payment-container/payment-credit-card/payment-credit-card-steps/payment-credit-card-steps.component';
import { PaymentResultMexOkComponent } from './payment-container/payment-result-mex-ok/payment-result-mex-ok.component';
import { PaymentResultMexErrorComponent } from './payment-container/payment-result-mex-error/payment-result-mex-error.component';
import { PaymentWidgetMexComponent } from './payment-container/payment-credit-card/payment-credit-card-mex/payment-widget-mex/payment-widget-mex.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PaymentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    NgSelectModule
  ],
  declarations: [PaymentContainerComponent,
    PaymentPolicyInfoComponent,
    PaymentCreditCardComponent,
    PaymentCreditCardSyncComponent,
    PaymentProcessOkComponent,
    PaymentCheckComponent,
    PaymentCreditCardMexComponent,
    PaymentCreditCardEcuComponent,
    PaymentResultMexComponent,
    PaymentResultEcuComponent,
    PaymentProcessErrorComponent,
    PaymentWidgetComponent,
    PaymentCreditCardStepsComponent,
    PaymentResultMexOkComponent,
    PaymentResultMexErrorComponent,
    PaymentWidgetMexComponent]
})
export class PaymentModule { }
