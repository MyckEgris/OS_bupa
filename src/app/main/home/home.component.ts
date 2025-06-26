/**
* HomeComponent.ts
*
* @description: Home component
* @author Juan Camilo Moreno.
* @author Yefry Lopez.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../security/services/auth/auth.service';
import { Utilities } from '../../shared/util/utilities';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';

import { Router } from '@angular/router';

import { CacheService } from '../../shared/services/cache/cache.service';
import { IStorage, StorageKind } from '../../shared/services/cache/cache.index';
import { MenuOptionService } from '../../security/services/menu-option/menu-option.service';
import { OptionState } from '../../security/model/option-state';
import { PrehomeService } from '../pre-home/prehome.service';
import { Rol } from 'src/app/shared/classes/rol.enum';

/**
 * Home component
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    providers: [AuthService]
})
export class HomeComponent implements OnInit {




    /**
     * Storage
     */
    private storage: IStorage;

    /**
     * Current Date
     */
    public dateNow: any;

    /**
     * Array of languages
     */
    public langs: string[];

    public state: OptionState;

    /**
     * current user id
     */
    public currentUserId: string;

    /**
     * current user role id
     */
    public currentUserRoleId: string;

    /**
     * indicates if its necesary to load home role´s home component
     */
    public loadMainHome = false;

    /**
     * indicates if the website had open for a link in an email
     */
    public hasReturnUrl: boolean;

    /**
     * Constructor Method
     * @param _authService Auth Service Injection
     * @param configuration Configuration Service Injection
     * @param translation Translation Service Injection
     * @param router Router Injection
     * @param cache Cache Service Injection
     */
    constructor(private _authService: AuthService,
        private configuration: ConfigurationService,
        private translation: TranslationService,
        private router: Router,
        private cache: CacheService,
        private menuOptions: MenuOptionService,
        private _prehomeService: PrehomeService
    ) {
        this.storage = this.cache.storage(StorageKind.InLocalStorage);
        this.dateNow = Utilities.getDateNow();
        this.langs = this.configuration.languages;

    }


    /**
     * loads the user's information
     */
    async ngOnInit() {
        // this.translation.setLanguage(this._authService.getUser().language);
        this.hasReturnUrl = false;
        await this.verifyIfExistsReturnUrlAndRedirect();
        this.currentUserId = this._authService.getUser().agent_number;
        this.currentUserRoleId = this._authService.getUser().role_id;
    }

    /** loads options values of differents menus */
    loadMenuOptions(): void {
        let launchPreHome = true;
        this.menuOptions.subscribe(state => {

            this.state = this.menuOptions.state;
            if (launchPreHome) {
                // this.loadPreHome();
            }
            launchPreHome = false;
        });
    }

    /**
     * ask if its necesary to show or not prehome component
     */
    private loadPreHome() {
        if (sessionStorage.getItem('loadPrehome') === null || sessionStorage.getItem('loadPrehome') !== 'false') {
            if (this.state.preHomeLinks && this.state.preHomeLinks.length > 0) {
                this._prehomeService.showModal();
            }
        }
    }


    /**
     * Logout
     */
    public logOut() {
        this._authService.logoff();
    }

    /**
     * Navigate to provider home
     */
    public goToProfileProvider() {
        this.router.navigate(['user/profile-view']);
    }

    /**
     * Change language for application
     * @param lang Language
     */
    changeLang(lang: string) {
        this._authService.setUser();
        this.translation.setLanguage(lang);
    }

    /**
     * Allows to open differents links
     * @param url url to open
     */
    onNavigate(url: string) {
        window.open(url);
    }

    async verifyIfExistsReturnUrlAndRedirect() {
        const postLoginRoute = this.storage.get('postLoginRoute');
        if (this.verifyIfExistsValidAnonymousReturnUrlOrOtherUrl(postLoginRoute)) {
            this.hasReturnUrl = true;
            this.storage.delete('postLoginRoute');
            sessionStorage.setItem('loadPrehome', 'false');
            this.router.navigateByUrl(postLoginRoute ? postLoginRoute : '/');
        } else {
            this.loadMenuOptions();
        }
    }

    verifyIfExistsValidAnonymousReturnUrlOrOtherUrl(postLoginRoute: string): boolean {
        const roleId = this._authService.getUser().role_id;
        if (postLoginRoute && postLoginRoute !== '/') {
            if (postLoginRoute.indexOf('/policies/policy-payments-without-loggin') > -1) {
                if (roleId !== '10') {
                    this.storage.delete('postLoginRoute');
                    return false;
                }
            }

            return true;
        } else {
            if (roleId === '10') {
                this._authService.logoff();
                location.href = this.configuration.redirectUri;
            }
        }

        return false;
    }
}
