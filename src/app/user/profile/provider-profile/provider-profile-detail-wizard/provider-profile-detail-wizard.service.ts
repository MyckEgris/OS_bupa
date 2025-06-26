/**
* ProviderProfileDetailWizardService.ts
*
* @description: This class handles the data in the provider detail profile.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/


import { Injectable } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ProviderProfileDetailWizardDto } from './entities/providerProfileDetailWizard.dto';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';


/**
 * This class handles the data in the provider detail profile.
 */
@Injectable({
  providedIn: 'root'
})
export class ProviderProfileDetailWizardService {

  /**
   * User Authenticated Object.
   */
  public user: UserInformationModel;

  /**
   * Provider Profile Detail Object.
   */
  private providerProfileDetailWizard: ProviderProfileDetailWizardDto;

  /**
   * Provider Profile Detail Subject.
   */
  private providerProfileDetailSubject: Subject<ProviderProfileDetailWizardDto>;


  /**
   * Constructor Method.
   * @param authService Auth Service Injection.
   * @param router Router Injection.
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.providerProfileDetailSubject = new Subject<ProviderProfileDetailWizardDto>();
  }


  /**
   * Initiate Provider Profile Detail Wizard.
   * @fn subscription function.
   * @param user User Authenticated Object.
   * @param step Current Step.
   */
  beginProviderProfileDetailWizard(fn, user: UserInformationModel, step: number): Subscription {
    this.user = user;
    const subscription = this.providerProfileDetailSubject.subscribe(fn);

    if (!this.providerProfileDetailWizard) {
      this.newProviderProfileDetail(user);
    }

    if (user) {
      this.providerProfileDetailWizard.user = user;
    }

    if (step) {
      this.providerProfileDetailWizard.currentStep = step;
    }

    this.next();
    return subscription;
  }

  /**
   * End the provider profile detail wizard.
   * @param user User Authenticated Object.
   */
  endProviderProfileDetailWizard(user: UserInformationModel) {
    this.newProviderProfileDetail(user);
    this.next();
  }

  /**
   * Create a new provider profile detail object.
   * @param user User Authenticated Object.
   */
  private newProviderProfileDetail(user: UserInformationModel) {
    this.providerProfileDetailWizard = {
      user: user,
      providerProfileDetailInfo: null,
      currentStep: 0,
      providerProfileForm: new FormGroup({}),
      benefitialOwnerList: null,
      countries: null,
      cities: null,
      states: null,
      languages: null,
      documentTypes: null
    };
  }

  /**
   * Send parameters to subscriptions.
   */
  private next() {
    this.providerProfileDetailSubject.next(this.providerProfileDetailWizard);
  }


}
