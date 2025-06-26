import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { PaymentContainerComponent } from './payment-container/payment-container.component';
import { PaymentProcessOkComponent } from './payment-container/payment-process-ok/payment-process-ok.component';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
import { PaymentResultEcuComponent } from './payment-container/payment-result-ecu/payment-result-ecu.component';
import { PaymentResultMexComponent } from './payment-container/payment-result-mex/payment-result-mex.component';
import { PaymentProcessErrorComponent } from './payment-container/payment-process-error/payment-process-error.component';
import { PaymentResultMexOkComponent } from './payment-container/payment-result-mex-ok/payment-result-mex-ok.component';
import { PaymentResultMexErrorComponent } from './payment-container/payment-result-mex-error/payment-result-mex-error.component';

const routes: Routes = [
  {
    path: 'payments/payment-bank-result/mex',
    component: PaymentResultMexComponent,
    canActivate: [/*AuthGuardService*/]
  },
  {
    path: 'payments',
    component: LayoutComponent,
    children: [
      {
        path: 'payment-process/:policyId',
        component: PaymentContainerComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'payment-process-ok/:policyId',
        component: PaymentProcessOkComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'payment-bank-result/ecu/:policyId/transactions/:transactionLogId',
        component: PaymentResultEcuComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'payment-bank-result-mex/ok/:policyId/:paymentReference/:amount/:brand/:authorization/:operation/:logId/:datePayment',
        component: PaymentResultMexOkComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'payment-bank-result-mex/error/:error',
        component: PaymentResultMexErrorComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'payment-process-error/:policyId',
        component: PaymentProcessErrorComponent,
        canActivate: [AuthGuardService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
