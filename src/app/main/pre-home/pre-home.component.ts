/**
* PreHomeComponent.ts
*
* @description: PreHomeComponent
* @author Andrés Tamayo
* @version 1.0
* @date 4-10-2019.
*
**/


import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuOptionService } from '../../security/services/menu-option/menu-option.service';
import { UserInformationReducer } from '../../security/reducers/user-information.reducer';
import { Store } from '@ngrx/store';
import { UserInformationModel } from '../../security/model/user-information.model';
import { AuthService } from '../../security/services/auth/auth.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { RedirectService } from 'src/app/shared/services/redirect/redirect.service';



@Component({
  selector: 'app-pre-home',
  templateUrl: './pre-home.component.html',
})
export class PreHomeComponent implements OnInit  {

  /**
   * containts the diferents navigation's options
   */
  public options;
  /**
   * User Information
   */
  public user: UserInformationModel;

  /**
   * holds the user´s last login
  **/
  public lastLogin: string;

  public npsSurveyUrl: string;

  /**
   * Contruct Methos
   * @param activeModal NgbActiveModal Injection
   * @param _menuOption MenuOptionService Injection
   * @param userInformationStore User Information Store Injection
   * @param _authService authService Injection
   * @param RedirectService Redirect Service Service Injection
   */
  constructor(public activeModal: NgbActiveModal,
    private _menuOption: MenuOptionService,
    private userInformationStore: Store<UserInformationReducer.UserInformationState>,
    private _authService: AuthService,
    private _configurationService: ConfigurationService,
    private _redirectService: RedirectService
  ) {
    this.userInformationStore.select('userInformation')
      .subscribe(p => this.user = p);
  }
  ngOnInit() {
    this.options = this._menuOption.state.preHomeLinks;
    this._menuOption.subscribe(p => {
      this.options = p.preHomeLinks;
    });
    this.npsSurveyUrl=this._configurationService.npsSurveyUrl;
    this.getLastDate();
  }

  /**
   * Allows to open differents links
   * @param url url to open
   */
   onNavigate(url: string) {
    this._redirectService.showModal(url);
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

   /**
  * Delay X ms before reload page
  * @param ms Milliseconds
  */
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms));
  }

}

