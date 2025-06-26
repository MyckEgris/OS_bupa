/**
* Component for sucessful payments
*
* @description: This class receive denied payments from Santander Bank
* @author Edwin Javier Sanabria Mesa.
* @version 1.0
* @date 11-07-2020.
*
**/
import { Component, OnInit } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';

@Component({
  selector: 'app-payment-result-mex-error',
  templateUrl: './payment-result-mex-error.component.html'
})
export class PaymentResultMexErrorComponent implements OnInit {


  public error: string;
  public user: UserInformationModel;
  public isAuserAnonymous: boolean;

  constructor(private activeRouter: ActivatedRoute,
    private authService: AuthService,
    private config: ConfigurationService,
    private router: Router) { }

  ngOnInit() {
    this.activeRouter.params.subscribe(params => {
      this.setPaymentProperties(params);
    });
    this.setUserType();
  }

  setPaymentProperties(params: Params) {
    // tslint:disable-next-line: max-line-length
    this.error = params['error'] != null && params['error'] !== ''  && params['error'] !== '_' && params['error'] !== 'undefined' ? params['error'] : '';
  }

  setUserType() {
    this.user = this.authService.getUser();
    this.isAuserAnonymous = this.user.is_anonymous != null ? true : false;
  }

  goToBack() {
    if (this.isAuserAnonymous) {
      this.authService.logoff();
      location.href = this.config.redirectUri;
    } else {
      this.router.navigate(['policies/policy-payments']);
    }
  }

}
