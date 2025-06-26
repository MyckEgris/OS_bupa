import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { error } from 'console';
import { ConsentsComponent } from 'src/app/policy/policy-enrollment-create/policy-enrollment-steps/pan/consents/consents.component';
import { BupaAppService } from 'src/app/shared/services/bupa-app/bupa-app.service';
import { PasswordRulesDTO } from 'src/app/shared/services/bupa-app/entities/PasswordRules.dto';
import { ResetPasswordDTO } from 'src/app/shared/services/bupa-app/entities/ResetPassword.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { RequestLoadingService } from 'src/app/shared/services/request-loading/request-loading.service';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  /**
 * Main Form variable
 */
  changePasswordForm: FormGroup;

  /**
   * Password Variables
  */
  passwordRules: PasswordRulesDTO;

  /*Variable to save token from URL*/
  token: string;

  /*Flag to show/hide message to wait until activation*/
  waitingReset: Boolean = true;

  /*Flag to show/hide Succes/Error Label in Activation*/
  resetSucceeded: Boolean = false;

  errorResponse: ErrorResponse;

  constructor(
    private _requestLoading: RequestLoadingService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private bupaAppService: BupaAppService,
    private route: ActivatedRoute

  ) { }

  async ngOnInit() {
    this._requestLoading.addLoadingRequest();
    this.route.queryParams
      .subscribe(params => {
        this.token = params.token;
      });
    await this.getPasswordRules();
    this.changePasswordForm = this.initializeForm();
    this._requestLoading.removeLoadingRequest();
  }

  /**
  * Sets the form, along with the controls, with their validators
  */
  initializeForm() {
    return new FormGroup({
        newPwd: new FormControl('', {
          validators:
            [Validators.required,
            Validators.maxLength(this.passwordRules.maxLength),
            Validators.minLength(this.passwordRules.minLength),
            CustomValidator.passwordCustomPatternValidator(this.passwordRules.passwordRegex)],
          updateOn: 'blur'
        }),
        confirmPwd: new FormControl('', Validators.required)
      }, CustomValidator.elementsMatch('newPwd', 'confirmPwd'));
  }

  async getPasswordRules() {
    await this.bupaAppService.getPasswordRules().toPromise()
    .then(p => {
          this._requestLoading.removeLoadingRequest();
          this.passwordRules = p;
    })
    .catch(e => this._requestLoading.removeLoadingRequest());
  }


  resetPassword(changePwdObject: any) {
    this._requestLoading.addLoadingRequest();
    const changePwdDto = {} as ResetPasswordDTO;
    changePwdDto.pass = btoa(changePwdObject.newPwd);

    this.bupaAppService.resetPassword(this.token, changePwdDto)
      .subscribe(
        p => {
          this._requestLoading.removeLoadingRequest();
          this.showSuccess(p);
        },
        e => {
          this._requestLoading.removeLoadingRequest();
          this.errorResponse = JSON.parse(e.error);
          this.showError();
        });
  }

    /**
   * Show successful message
   * @param response Response
   */
     async showSuccess(response) {
      const translateMessages = [
        'MOBILEAPP.RESETPASSWORD.SUCCESS.TITLE',
        'MOBILEAPP.RESETPASSWORD.SUCCESS.MESSAGE'];
      const title = await this.getTranslateMessage(translateMessages[0]);
      const body = await this.getTranslateMessage(translateMessages[1]);
      await this.notificationService.showDialog(title, body);
      this.waitingReset = false;
      this.resetSucceeded = true;
    }


    /**
     * Show error message
     */
    async showError() {
      
      //console.log(this.errorResponse.Code);
      //console.log(this.errorResponse.Message);

      if(this.errorResponse.Code == 'SEC_BR_PASSWORD_DIFFERENT_LAST3'){
        const translateMessages = [
          'MOBILEAPP.RESETPASSWORD.ERROR_SEC_BR_PASSWORD_DIFFERENT_LAST3.TITLE',
          'MOBILEAPP.RESETPASSWORD.ERROR_SEC_BR_PASSWORD_DIFFERENT_LAST3.MESSAGE'];
        const title = await this.getTranslateMessage(translateMessages[0]);
        const body = await this.getTranslateMessage(translateMessages[1]);
        await this.notificationService.showDialog(title, body);
        this.waitingReset = false;
        this.resetSucceeded = false;
      }
      else if(this.errorResponse.Code == 'SEC_BR_NEWPASSWORD_CANNOT_SAME_CURRENT'){
        const translateMessages = [
          'MOBILEAPP.RESETPASSWORD.ERROR_SEC_BR_NEWPASSWORD_CANNOT_SAME_CURRENT.TITLE',
          'MOBILEAPP.RESETPASSWORD.ERROR_SEC_BR_NEWPASSWORD_CANNOT_SAME_CURRENT.MESSAGE'];
        const title = await this.getTranslateMessage(translateMessages[0]);
        const body = await this.getTranslateMessage(translateMessages[1]);
        await this.notificationService.showDialog(title, body);
        this.waitingReset = false;
        this.resetSucceeded = false;
      }
      else if(this.errorResponse.Code == 'SEC_TOKEN_EXPIRED'){
        const translateMessages = [
          'MOBILEAPP.RESETPASSWORD.ERROR_SEC_TOKEN_EXPIRED.TITLE',
          'MOBILEAPP.RESETPASSWORD.ERROR_SEC_TOKEN_EXPIRED.MESSAGE'];
        const title = await this.getTranslateMessage(translateMessages[0]);
        const body = await this.getTranslateMessage(translateMessages[1]);
        await this.notificationService.showDialog(title, body);
        this.waitingReset = false;
        this.resetSucceeded = false;
      }
      else{
        const translateMessages = [
          'MOBILEAPP.RESETPASSWORD.ERROR.TITLE',
          'MOBILEAPP.RESETPASSWORD.ERROR.MESSAGE'];
        const title = await this.getTranslateMessage(translateMessages[0]);
        const body = await this.getTranslateMessage(translateMessages[1]);
        await this.notificationService.showDialog(title, body);
        this.waitingReset = false;
        this.resetSucceeded = false;
      }

    }



    /**
     * Get translated value
     * @param key Language key
     */
     getTranslateMessage(key) {
      return this.translate.get(key).toPromise();
    }


}

interface ErrorResponse{
  Code:string;
  Message:string;
}
