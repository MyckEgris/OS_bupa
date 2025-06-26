/**
* HeaderComponent.ts
*
* @description: Header of the application.
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { MenuReducer } from '../../security/reducers/menu.reducer';
import { MenuModel } from '../../security/model/menu.model';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { DatePipe } from '@angular/common';
import { MenuOptionService } from '../../security/services/menu-option/menu-option.service';
import { OptionState } from '../../security/model/option-state';
import { Utilities } from 'src/app/shared/util/utilities';
import { Location } from '@angular/common';
import { RedirectService } from 'src/app/shared/services/redirect/redirect.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
/**
 * Header of the application.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  /**
   * COnstant for Locate for Spanish
   */
  private SPA_LOCATE = 'es-Us';

  /**
   * Constant for Locale for English
   */
  private ENG_LOCATE = 'en-Us';

  /**
   * Constant for Default language
   */
  // private SPA_LANGUAGE = 'SPA';

  /**
   * Constant for month format
   */
  private MONTH_FORMAT = 'MMM';

  /**
   * Constant for day format
   */
  private DAY_FORMAT = 'dd';

  /**
   * Current language
   */
  public language: string;

  public SPANISH_LOADED = 'SPA';

  /**
   * Date variable for date now
   */
  public dateNow: any;

  /**
   * Day
   */
  public day: string;

  /**
   * Month
   */
  public month: string;

  /**
   * Date pipe instance for customization
   */
  public pipe: DatePipe;

  /**
   * State
   */
  public state: OptionState;

  public scrollValue = 0;

  public maxScrollDown: number;

  public showUpArrow = false;

  public showDownArrow = true;

  public currentPath: string;

  public currentTab: MenuModel;

  private languageSubcripcion;

  @ViewChild('scrollableUl') scrollableUl;
  @ViewChild('scrollableContainer') scrollableContainer;

  /**
   * Contructor Method
   * @param menuStore Menu Store Injection
   * @param router Router Injection
   * @param translationService Translation Service Injection
   * @param RedirectService Redirect Service Service Injection
   */
  constructor(
    private menuStore: Store<MenuReducer.MenuState>,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private translationService: TranslationService,
    private menuOption: MenuOptionService,
    private location: Location,
    private _redirectService: RedirectService,
    private _translate: TranslateService,
    private auth: AuthService
  ) { }


  /**
   * Initialize header menu with user language and set date and time for locale
   */
  ngOnInit() {
    debugger;
    this.language = this.translationService.getLanguage();
    this.state = this.menuOption.state;
    this.activatedRouter.url.subscribe(() => this.activateScroll());
    this.setCurrentTab();
    this.menuOption.subscribe(() => {
      this.activateScroll();
    });
    this.dateNow = new Date();
    this.setDateTimeFormatByLocation();

    this.languageSubcripcion = this._translate.onLangChange.subscribe( res => {
        this.language = res.lang;
        this.setDateTimeFormatByLocation();
    });
  }

  ngOnDestroy(): void {
    this.languageSubcripcion.unsubscribe();
  }

  async activateScroll() {
    debugger
    if (this.state.quickLinks && this.state.quickLinks.length > 0) {
      this.setCurrentTab();
      await Utilities.delay(1000);

      this.maxScrollDown = this.scrollableUl.nativeElement.offsetHeight - this.scrollableContainer.nativeElement.offsetHeight;
      if (this.maxScrollDown > 0) {
        this.maxScrollDown = this.maxScrollDown * -1;
      }
    }
  }

  setCurrentTab() {
    debugger
    this.currentPath = this.location.path();
    this.state = this.menuOption.state;
    this.currentTab = this.getCurrentTab(this.currentPath, this.state.quickLinks);
  }


  getCurrentTab(path: string, menus: MenuModel[]): MenuModel {
    debugger
    if (menus) {
      for (const tab of menus) {
        if (path.indexOf(tab.pathURL) !== -1) {
          return tab;
        } else if (tab.sons) {
          const child = this.getCurrentTab(path, tab.sons);
          if (child) {
            return child;
          }
        }
      }
    }
    return null;
  }



  /**
   * Give navigation for menu and submenus options
   * @param $event Event
   * @param menuItem Menu item
   */
  menuClick($event, menuItem) {
    debugger;
    if (!menuItem.sons) {
      if (menuItem.pathURL) {
        if (menuItem.pathURL[0] === '/') {
          this.router.navigate([menuItem.pathURL]);
        } else {
          this._redirectService.showModal(menuItem.pathURL);
        }
      }
      $event.stopPropagation();
      $event.preventDefault();
    }
  }

  /**
   * Formats date and time based on the current language.
   */
  private setDateTimeFormatByLocation() {

    if (this.language === this.SPANISH_LOADED) {
      this.pipe = new DatePipe(this.SPA_LOCATE);
    } else {
      this.pipe = new DatePipe(this.ENG_LOCATE);
    }
    this.month = this.pipe.transform(this.dateNow, this.MONTH_FORMAT);
    this.day = this.pipe.transform(this.dateNow, this.DAY_FORMAT);
    this.month = this.titleCaseWord(this.month);
  }

  /**
   * Put first letter in upper case and others in lower case
   * @param word Word
   */
  titleCaseWord(word: string) {
    if (!word) {
      return word;
    }
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  scrollDown(event) {
    debugger
    this.maxScrollDown = this.scrollableUl.nativeElement.offsetHeight - this.scrollableContainer.nativeElement.offsetHeight;
    if (this.maxScrollDown > 0) {
      this.maxScrollDown = this.maxScrollDown * -1;
      if (this.scrollValue > this.maxScrollDown) {
        this.scrollValue -= 100;
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }

  scrollUp(event) {
    this.scrollValue += this.scrollValue <= -100 ? 100 : 0;
    event.stopPropagation();
    event.preventDefault();
  }

}
