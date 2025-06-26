/**
* ProviderProfileDetailComponent.ts
*
* @description: This component displays and manages the provider detail profile.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/


import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProviderDetailService } from 'src/app/shared/services/provider-detail/provider-detail.service';
import { ProviderProfileDetailWizardService } from '../provider-profile-detail-wizard/provider-profile-detail-wizard.service';
import { ProviderProfileDetailWizardDto } from '../provider-profile-detail-wizard/entities/providerProfileDetailWizard.dto';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Store, select } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user/user.service';


/**
 * This component displays and manages the provider detail profile.
 */
@Component({
  selector: 'app-provider-profile-detail',
  templateUrl: './provider-profile-detail.component.html'
})
export class ProviderProfileDetailComponent implements OnInit, OnDestroy {


  /**
   * User Authenticated Object.
   */
  public user: UserInformationModel;

  /**
   * Subscription.
   */
  private subscription: Subscription;

  /**
   * ProviderProfileDetailWizardDto Object.
   */
  public wizard: ProviderProfileDetailWizardDto;

  /**
   * Constant to identify the ProviderProfileDetailWizardService current step 1.
   */
  public currentStep = 1;

  /***
   * Subscription provider detail.
   */
  private subProviderDetail: Subscription;

  /***
   * Subscription user.
   */
  private subUser: Subscription;

  /**
   *  Constant to identify Summary Menu Option type.
   */
  public SUMMARY_OPT = 'summary';

  /**
   *  Constant to identify Owners Menu Option type.
   */
  public OWNERS_OPT = 'owners';

  /**
   * Stores agreement acceptance date.
   */
  public actualDate: string;


  /**
   * Constructor Method.
   * @param authService Auth Service Injection.
   * @param router Router Injection.
   * @param translate Translate Service Injection.
   * @param providerProfileDetailWizardService Provider Profile Detail Wizard Service Injection.
   * @param providerDetailService Provider Detail Service Injection.
   * @param userInfoStore User Information Store Injection
   * @param userService User Service Injection.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private providerProfileDetailWizardService: ProviderProfileDetailWizardService,
    private providerDetailService: ProviderDetailService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private userService: UserService
  ) { }


  /**
   * Initialize the component. Get user information from redux store.
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.getProviderInfo();
    this.subscription = this.providerProfileDetailWizardService.beginProviderProfileDetailWizard(wizard => {
      this.wizard = wizard;
      this.getProviderProfileDetail();
    }, this.user, this.currentStep);
  }

  /**
   * Ends subscription to wizard subject.
   */
  ngOnDestroy() {
    // this.providerProfileDetailWizardService.endProviderProfileDetailWizard(this.user);
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subProviderDetail) { this.subProviderDetail.unsubscribe(); }
    if (this.subUser) { this.subUser.unsubscribe(); }
  }

  /**
   * Gets the provider profile detail information from crm.
   */
  getProviderProfileDetail() {
    if (!this.wizard.providerProfileDetailInfo) {
      this.wizard.providerProfileDetailInfo = null;
      this.subProviderDetail = this.providerDetailService.getProviderProfileDetailByProviderKey(
        this.user.user_key_alternative
      ).subscribe(data => {
        this.wizard.providerProfileDetailInfo = data;
      }, error => {
        this.wizard.providerProfileDetailInfo = null;
        console.log(error);
      });
    }
  }

  /**
   * Handles the menu options routing.
   */
  handleRouteMenuOption(optionType: any) {
    switch (optionType) {

      case this.SUMMARY_OPT:
        this.router.navigate(['users/provider-profile/detail/summary']);
        break;

      case this.OWNERS_OPT:
        this.router.navigate(['users/provider-profile/detail/beneficial-owners']);
        break;
    }
  }

  /**
   * Gets the provider information.
   */
  async getProviderInfo() {
    if (!this.actualDate) {
      await this.userInfoStore.pipe(select('userInformation')).pipe(first()).subscribe(token => {
        this.subUser = this.userService.getUserById(
          token.sub
        ).subscribe(data => {
          this.actualDate = data.userAgreementVersionsDto[0].dateAccepted;
        }, error => {
          this.actualDate = null;
          console.log(error);
        });
      });
    }
  }

}
