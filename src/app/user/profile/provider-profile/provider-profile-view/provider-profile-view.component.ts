/**
* ProfileViewComponent.ts
*
* @description: Class for managing profile home of provider role
* @author Juan Camilo Moreno
* @version 1.0
* @date 17-09-2018.
*
**/

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/services/user/user.service';
import { ProviderService } from '../../../../shared/services/provider/provider.service';
import { Provider } from '../../../../shared/services/provider/entities/provider';
import { forkJoin, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { UserInformationReducer } from '../../../../security/reducers/user-information.reducer';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

import { first } from 'rxjs/operators';

/**
 * Class for managing profile home of provider role
 */
@Component({
  selector: 'app-provider-profile-view',
  templateUrl: './provider-profile-view.component.html'
})
export class ProviderProfileViewComponent implements OnInit {

  /**
   * Constant for show error of provider inactivated
   */
  private PROVIDER_IS_INACTIVE_ERROR_MESSAGE = 'Provider is inactivated.';

  /**
   * Constant for bupa email contact
   */
  private BUPA_EMAIL = 'providersupdate@bupalatinamerica.com';

  /**
   * Constant with status id of a inactivated provider
   */
  private IDSTATUS_PROVIDER_INACTIVATED = 108;

  /**
   * Error code for 404 not data found exception
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;


  /**
   * Provider
   */
  public providerInformation: Provider;

  /**
   * agreementState
   */
  public agreementState: any;

  /**
   * mailTo
   */
  public mailTo: string;

  /**
   * errorMessage
   */
  public errorMessage: string;

  /**
   * holds actual date
   */
  public actualDate: string;


  /**
   * Constructor Method
   * @param _userService User Service Injection
   * @param _providerService Provider Service Injection
   * @param userInfoStore User Information Store Injection
   * @param notification Notification Service Injection
   * @param translate Translate Service Injection
   */
  constructor(
    private _userService: UserService,
    private _providerService: ProviderService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private notification: NotificationService,
    private translate: TranslateService) {
  }

  /**
   * Recovery token and search user and provider information in user and provider API, respectively, at same time
   * and, map information in provider model
   */
  ngOnInit() {
    this.mailTo = this.BUPA_EMAIL;


    this.userInfoStore.pipe(select('userInformation')).pipe(first()).subscribe(token => {

      const providerById = this._providerService.getProviderById(token.provider_id);
      const userById = this._userService.getUserById(token.sub);
      forkJoin([providerById, userById])
        .subscribe(results => {

          if (!(results[0].statusId === this.IDSTATUS_PROVIDER_INACTIVATED)) {


           this.actualDate = results[1].userAgreementVersionsDto[0].dateAccepted;


            this.providerInformation =
              this._providerService.mapperProviderDtoToProvider(results[0], results[1]);
          } else {
            this.errorMessage = this.PROVIDER_IS_INACTIVE_ERROR_MESSAGE;
          }
        }, error => {
          this.showIfHadBusinessError(error);
        });

    });
  }





  /**
   * Handle error for business exceptions and translate according current language
   * @param error HttpErrorResponse
   */
  private showIfHadBusinessError(error) {
    if (error.error.code) {
      this.errorMessage = error.error.message;
    } else if (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND) {
      this.translate.get('USER.PROFILEVIEW.VALIDATE_TITLE')
        .subscribe(validateTitle => {
          this.translate.get(`USER.PROFILEVIEW.ERRORS.PROVIDER_NOT_FOUND`).subscribe(res => {
            this.notification.showDialog(validateTitle, error.error.message);
          });
        });
    }
  }
}
