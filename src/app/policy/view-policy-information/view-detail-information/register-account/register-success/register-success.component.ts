import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { PayeeDto } from 'src/app/shared/services/finance/entities/payee.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { RegisterAccountService } from '../register-service/register-account.service';
import { RegisterCondition } from '../register-service/register-condition';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html'
})
export class RegisterSuccessComponent implements OnInit {

  public payeeInformation: PayeeDto;

  public conditions: RegisterCondition;

  private policyId: number;

  private returnUrl: string;

  public currencies: any[];

  public currencyCode: string;

  public currencyDescription: string;

  constructor(
    private registerService: RegisterAccountService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private translate: TranslateService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.payeeInformation = this.registerService.getRegisterSummary();
    this.conditions = this.registerService.getRegisterConditions();
    this.getValuesForRoute();
    this.getCurrency();
  }

  getValuesForRoute() {
    this.policyId = this.route.snapshot.params['policyId'];
    this.route.data.subscribe(data => {
      this.returnUrl = data.returnUrl.replace('{0}', this.policyId); // + '?tab=' + data.tab;
    });
  }

  finish() {
    this.registerService.resetRegisterConditions();
    this.router.navigate([this.returnUrl]);
  }

  getCurrency() {
    this.commonService.getCurrencies()
      .subscribe(
        result => {
          this.currencies = result;
          this.currencyCode = this.currencies.find(x => x.currencyId === this.payeeInformation.currencyId).currencyCode;
          this.currencyDescription = this.currencies.find(x => x.currencyId === this.payeeInformation.currencyId).description;
        },
        error => {
          if (error.error.code) {
            this.showErrorMessage(error);
          }
        });
  }

   /**
   * Shows an error message.
   * @param errorMessage error message that will be shown.
   */
  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`AGENT.PROFILE.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`AGENT.PROFILE.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);

  }

}