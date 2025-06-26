/**
* PreHomeProviderComponent.ts
*
* @description: PreHomeProviderComponent
* @author Andrés Tamayo
* @version 1.0
* @date 30-11-2020.
*
**/


import {Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuOptionService } from '../../security/services/menu-option/menu-option.service';
import { UserInformationReducer } from '../../security/reducers/user-information.reducer';
import { Store } from '@ngrx/store';
import { UserInformationModel } from '../../security/model/user-information.model';
import { AuthService } from '../../security/services/auth/auth.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';

@Component({
  selector: 'app-pre-home-provider',
  templateUrl: './pre-home-provider.component.html'
})
export class PreHomeProviderComponent implements OnInit {

  /**
   * User Information
   */
  public user: UserInformationModel;

  /**
   * holds the user´s last login
  **/
  public lastLogin: string;

  public splitRedirectUrl;
  public goToHomeTitleCurrentBusiness: string;
  public goToHomeTitleOffsideBusiness: string;
  public authformCurrentBusiness: string;
  public authformOffsideBusiness: string;
  public providersMail: string;

  /**
   * Contruct Methos
   * @param activeModal NgbActiveModal Injection
   * @param _menuOption MenuOptionService Injection
   * @param userInformationStore User Information Store Injection
   * @param _authService authService Injection
   */
  constructor(public activeModal: NgbActiveModal,
    private _menuOption: MenuOptionService,
    private userInformationStore: Store<UserInformationReducer.UserInformationState>,
    private _authService: AuthService,
    private _configurationService: ConfigurationService
  ) {

  }
  ngOnInit() {
    this.user = this._authService.getUser();
    this.splitRedirectUrl = this._configurationService.splitRedirectUrl;
    this.goToHomeTitleCurrentBusiness = this._configurationService.goToHomeTitleCurrentBusiness;
    this.goToHomeTitleOffsideBusiness = this._configurationService.goToHomeTitleOffsideBusiness;
    this.authformCurrentBusiness = this._configurationService.authformCurrentBusiness;
    this.authformOffsideBusiness = this._configurationService.authformOffsideBusiness;
    this.providersMail = this._configurationService.providersMail;
    this.getLastDate();
  }

  /**
   * Action to do if cancel was pressed. Close modal
   */
  cancel() {
    this.activeModal.close();
    sessionStorage.setItem('loadPrehome', 'false');
  }

  /**
   * converts the string to a valid format if its necesary
   */
  getLastDate() {
    this.lastLogin = this._authService.getUser().last_login_date;
    if (this._configurationService.convertDateToken) {
      this.lastLogin = this.lastLogin.replace('//g', '-');
      const dateArr = this.lastLogin.split(' ');
      dateArr[0] = dateArr[0].split(/\D/).reverse().join('-');
      this.lastLogin = dateArr[0] + ' ' + dateArr[1];

    }
    const dateArr2 = this.lastLogin.split(' ');
    const dateArr3 = dateArr2[1].split(':');
    for (let a = 0; a < dateArr3.length; a++) {
      if (Number(dateArr3[a]) < 10) {

        if (dateArr3[a].indexOf('0') !== 0) {
          dateArr3[a] = '0' + dateArr3[a];
        }
      }
    }
    this.lastLogin = dateArr2[0] + ' ' + dateArr3[0] + ':' + dateArr3[1] + ':' + dateArr3[2];
    this.fixDateToInternetExplorer();
  }


  /** fix the date if the navegator its  internet explorer */
  fixDateToInternetExplorer() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('Trident');
    if (msie > 0) { // If Internet Explorer, return version number
      this.lastLogin = this.lastLogin.replace(' ', 'T');
    }
  }

  /**
   * Validates if the user is from mexico and show information.
   */
  validateUserBussiness() {
    if (this.user.bupa_insurance === String(InsuranceBusiness.BUPA_MEXICO)) {
      return true;
    } else {
      return false;
    }
  }

}
