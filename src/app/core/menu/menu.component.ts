/**
* MenuComponent.ts
*
* @description: Left menu component
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Utilities } from '../../shared/util/utilities';
import { MenuModel } from '../../security/model/menu.model';
import { UserInformationReducer } from '../../security/reducers/user-information.reducer';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { AuthService } from '../../security/services/auth/auth.service';
import { OptionState } from '../../security/model/option-state';
import { MenuOptionService } from '../../security/services/menu-option/menu-option.service';
import { Location } from '@angular/common';
import { RedirectService } from '../../shared/services/redirect/redirect.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';


/**
 * Left menu component
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  /**
   * Name
   */
  public name: string;

  /**
   * id
   */
  public currentUserId: string;

  /**
   * State
   */
  public state: OptionState;

  /**
   * dateNow
   */
  public dateNow: any;

  /**
    * showTabs
    */
  public showTabs: boolean;

  /**
    * tabs
    */
  public tabs: MenuModel[];

  /**
    * currentPath
    */
  public currentPath: string;

  /**
    * currentTab
    */
  public currentTab: MenuModel;


  /**
    * selectedTab
    */
  public selectedTab: MenuModel;

  /**
    * menuClicked
    */
  public menuClicked: MenuModel;

  /**
    * permanentSubMenu
    */
  public permanentSubMenu: any;

  /**
    * isAnonymous
    */
  public isAnonymous: Boolean = false;

  /**
  * roleId
  */
  public roleId: string;

  /**
   * rol
   */
  public rol = Rol;

  /**
   * user
   */
  private user: UserInformationModel;

  /**
   * Constant for language warning title resource key.
   */
  public LANGUAGE_WARNING_TITLE = 'POLICY.POLICY_ENROLLMENT.MSG_LANGUAGE_TITLE';

  /**
   * Constant for language warning message resource key.
   */
  public LANGUAGE_WARNING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.MSG_LANGUAGE_BODY';

  /**
   * Constant Array for routes to exclude.
   */
  private routesToExclude: any[] = [
    'create-policy-enrollment-41',
    'create-policy-enrollment-56',
    'create-policy-enrollment-39'
  ];



  /**
   * Constructor Method
   * @param router Router Injection
   * @param translation Translation Service Injection
   * @param authService Auth Service Injection
   * @param userInfoStore User Information Store Injection
   * @param RedirectService Redirect Service Service Injection
   * @param activatedRouter Activated Route Injection
   * @param location Location Injection
   * @param menuOption MenuOptionService Injection
   * @param notification Notification Service Injection
   * @param translate Translate Service Injection
   */
  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private location: Location,
    private translation: TranslationService,
    private authService: AuthService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private menuOption: MenuOptionService,
    private _redirectService: RedirectService,
    private notification: NotificationService,
    private translate: TranslateService
  ) { }


  /**
   * Get User information from access token and build personlized menu
   */
  ngOnInit() {
    this.activatedRouter.url.subscribe(() => this.setCurrentTab());
    this.setCurrentTab();
    this.menuOption.subscribe(() => this.setCurrentTab());
    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.name = userInfo.given_name;
      this.name += userInfo.family_name === 'NA'? '' : ' ' + userInfo.family_name;
      this.currentUserId = userInfo.user_key;
      if (userInfo.user_key_alternative) {
        this.currentUserId = this.currentUserId + ' | ' + userInfo.user_key_alternative;
      }
      this.roleId = userInfo.role_id;
      if (userInfo.is_anonymous) {
        this.isAnonymous = userInfo.is_anonymous;
      } else {
        this.isAnonymous = false;
      }
    });
    this.dateNow = Utilities.getDateNow();
    this.user = this.authService.getUser();
  }

  /**
   * set the tab selected by the user
   */
  setCurrentTab() {
    this.showTabs = false;
    this.currentPath = this.location.path();
    this.state = this.menuOption.state;
    this.currentTab = this.getCurrentTab(this.currentPath, this.state.menus);
    this.selectedTab = this.currentTab;
  }


  /**
   * select the path for the curren selected main option
   * @param path path
   * @param menus list the diferents options that has the current selected main option
   */
  getCurrentTab(path: string, menus: MenuModel[]): MenuModel {

    if (menus) {
      for (const tab of menus) {
        if (tab.pathURL === path) {
          return tab;
        } else if (tab.sons) {
          const child = this.getCurrentTab(path, tab.sons);
          if (child) {
            this.tabs = tab.sons;
            return child;
          }
        }
      }
    }
    return null;
  }

  /**
   * Assign click function for item navigate
   * @param $event Event
   * @param menuItem Menu Item
   */
  menuClick($event, menuItem: MenuModel) {

    const lang = this.translation.getLanguage();
    let pathUrl;
    if (!menuItem.sons) {
      if (menuItem.pathURL) {
        if (menuItem.pathURL.indexOf('http') === -1) {
          this.router.navigate([menuItem.pathURL]);
        } else {
          pathUrl = menuItem.pathURL.replace('*LANG*', lang);
          this._redirectService.showModal(pathUrl);
        }
      }
    } else {
      this.setCurrentTab();
      if (this.currentTab && menuItem.sons.indexOf(this.currentTab) === -1) {
        this.currentTab = menuItem;
      }
      this.permanentSubMenu = menuItem;
      this.tabs = menuItem.sons;
      this.showTabs = true;
    }
    $event.stopPropagation();
    $event.preventDefault();

  }

  /**
   * allow to show the diferent option when the mouse is inside a main option
   * @param $event Event
   * @param menuItem Menu Item
   */
  menuHover($event, menuItem: MenuModel) {
    this.setCurrentTab();
    if (menuItem.sons) {
      this.tabs = menuItem.sons;
      this.showTabs = true;
    }
    if (menuItem.sons !== null) {
      if (this.currentTab && menuItem.sons.indexOf(this.currentTab) === -1) {
        this.currentTab = menuItem;
      }
    }
    this.permanentSubMenu = menuItem;
    this.tabs = menuItem.sons;
    this.showTabs = true;

    $event.stopPropagation();
    $event.preventDefault();
  }

  /**
   * used to select the current option on the menu if the user don´t select any option
   * @param $event event
   */
  mainMenuLeave() {
    this.currentTab = this.selectedTab;
    this.getCurrentTab(this.currentPath, this.state.menus);
    if (this.currentPath !== null) {
      this.showTabs = false;
    }

    this.showTabs = false;
  }

  /**
   * Menu option for change applcation language
   * @param $event Event
   * @param menuItem Menu item
   */
  changeLang($event, menuItem) {
    if (this.validateRouteLanguage()) {
      this.showLanguageModalWarning();
      this.translation.setLanguage('SPA', this.user.bupa_insurance);
    } else {
      this.translation.setLanguage(menuItem.name, this.user.bupa_insurance);
    }

    if (this.validateNewBusinessQuoteRoute()) {
      this.notification.showDialog('Advertencia', 'Esta opción solo está disponible en Español.');
    }

    $event.stopPropagation();
    $event.preventDefault();

  }

  /**
   * Close session
   * @param $event Event click
   */
  closeSession($event) {
    this.authService.logoff();
    $event.stopPropagation();
    $event.preventDefault();
  }

  /**
   * Show the notification panel access icon according to user rol.
   */
  validateNotificationView() {
    return false;
    /* if (this.roleId === this.rol.PROVIDER.toString() || this.roleId === this.rol.ANONYMOUSPAYMENT.toString()) {
      return false;
    } else { return true; } */
  }

  /**
   * Routing to the view notification option.
   */
  notificationClick() {
    this.router.navigate(['notification/notification-panel']);
  }

  /**
   * Validate the change language action according to the current option route and show modal.
   */
  validateRouteLanguage() {
    const currentPath = this.location.path();
    let count = 0;

    this.routesToExclude.forEach(element => {
      if (currentPath.indexOf(element) !== -1) {
        count++;
      }
    });

    if (count > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Validates if Path is from new business quote.
   */
  validateNewBusinessQuoteRoute() {
    const currentPath = this.location.path();

    if (currentPath.indexOf('quote-new-business') !== -1) {
      return true;
    }
    return false;
  }

  /**
   * Show language warning modal message.
   */
  showLanguageModalWarning() {
    let message = '';
    let title = '';
    this.translate.get(this.LANGUAGE_WARNING_TITLE).subscribe(
      result => title = result
    );
    this.translate.get(this.LANGUAGE_WARNING_MESSAGE).subscribe(
      result => message = result
    );
    this.notification.showDialog(title, message);
  }



}
