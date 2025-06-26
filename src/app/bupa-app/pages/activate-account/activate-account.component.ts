import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BupaAppService } from 'src/app/shared/services/bupa-app/bupa-app.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { RequestLoadingService } from 'src/app/shared/services/request-loading/request-loading.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {

  /*Flag to show/hide loading*/
  loading: Boolean = true;

  /*Flag to show/hide message to wait until activation*/
  waitingActivation: Boolean = true;

  /*Flag to show/hide Succes/Error Label in Activation*/
  activationSucceeded: Boolean = false;

  /*Variable to save token from URL*/
  token: string;
  constructor(
    private _requestLoading: RequestLoadingService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private bupaAppService: BupaAppService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this._requestLoading.addLoadingRequest();
    this.route.queryParams
      .subscribe(params => {
        this.token = params.token;
      });
    this.activateAccount(this.token);
  }

  activateAccount(token: string) {
    this.bupaAppService.activateAccount(token)
      .subscribe(
        p => {
          this._requestLoading.removeLoadingRequest();
          this.showSuccess(p);
        },
        e => {
          this._requestLoading.removeLoadingRequest();
          this.showError();
        });
  }


    /**
   * Show successful message
   * @param response Response
   */
     async showSuccess(response) {
      const translateMessages = [
        'MOBILEAPP.ACTIVATIONACCOUNT.SUCCESS.TITLE',
        'MOBILEAPP.ACTIVATIONACCOUNT.SUCCESS.MESSAGE'];
      const title = await this.getTranslateMessage(translateMessages[0]);
      const body = await this.getTranslateMessage(translateMessages[1]);
      await this.notificationService.showDialog(title, body);
      this.waitingActivation = false;
      this.activationSucceeded = true;
    }

    /**
     * Show error message
     */
    async showError() {
      const translateMessages = [
        'MOBILEAPP.ACTIVATIONACCOUNT.ERROR.TITLE',
        'MOBILEAPP.ACTIVATIONACCOUNT.ERROR.MESSAGE'];
      const title = await this.getTranslateMessage(translateMessages[0]);
      const body = await this.getTranslateMessage(translateMessages[1]);
      await this.notificationService.showDialog(title, body);
      this.waitingActivation = false;
      this.activationSucceeded = false;
    }


    /**
     * Get translated value
     * @param key Language key
     */
    getTranslateMessage(key) {
      return this.translate.get(key).toPromise();
    }
}
