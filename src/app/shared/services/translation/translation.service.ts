
/**
* TranslationService.ts
*
* @description: Uses Translate Service and encapsulates any functions for better access
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

import { Injectable } from '@angular/core';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { ConfigurationService } from '../configuration/configuration.service';
import { CacheService } from '../cache/cache.service';
import { StorageKind, IStorage } from '../cache/cache.index';
import { RequestLoadingService } from '../request-loading/request-loading.service';
import { Utilities } from 'src/app/shared/util/utilities';


/**
 * Uses Translate Service and encapsulates any functions for better access
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  /**
   * Constant for defines default language
   */
  private DEFAULT_LANGUAGE = 'SPA';

  /**
   * Constant for defines current language
   */
  private CURRENT_LANGUAGE = 'currentLang';

  /**
   * Constant for define id of spanish
   */
  private ID_SPANISH = 2;

  /**
   * Constant for define name of spanish
   */
  private NAME_SPANISH = 'Spanish';

  /**
   * Constant for define id of spanish
   */
  private ID_ENGLISH = 1;

  /**
   * Constant for define name of english
   */
  private NAME_ENGLISH = 'English';

  /**
   * Constant for spanish
   */
  private DESC_SPANISH = 'Español';

  /**
   * Store
   */
  public store: IStorage;



  /**
   * Contructor Method
   * @param translate Translate Service Injection
   * @param configuration Configuration Service Injection
   * @param cache Cache Service Injection
   * @param requestLoading Request Loading Service Injection
   */
  constructor(
    private translate: TranslateService,
    private requestLoading: RequestLoadingService,
    private configuration: ConfigurationService,
    private cache: CacheService
  ) {

    translate.addLangs(configuration.languages);
    translate.setDefaultLang(this.DEFAULT_LANGUAGE);
    this.store = cache.storage(StorageKind.InLocalStorage);
    const currentLang = this.store.get(this.CURRENT_LANGUAGE);
    if (currentLang) {
      translate.use(currentLang);
    } else {
      this.setLanguage(this.DEFAULT_LANGUAGE);
    }

  }

  /**
   * Set application language
   * @param lang Language
   * @param bupaInsurance Bupa Insurance
   */
  setLanguage(lang: string, bupaInsurance?: any) {

    if (bupaInsurance) {

      const referedSource = `${lang}_${bupaInsurance}`;

      const referedSourceResult = this.configuration.insuranceResources.find(
        languaje => { return languaje === referedSource; }
      );

      if (referedSourceResult) {

        this.requestLoading.addLoadingRequest();
        this.store.put(this.CURRENT_LANGUAGE, lang);
        Utilities.delay(300).then(() => {
          this.translate.use(referedSourceResult);
          this.requestLoading.removeLoadingRequest();
        });

      } else {

        this.requestLoading.addLoadingRequest();
        this.store.put(this.CURRENT_LANGUAGE, lang);
        Utilities.delay(300).then(() => {
          this.translate.use(lang);
          this.requestLoading.removeLoadingRequest();
        });

      }

    } else {

      this.requestLoading.addLoadingRequest();
      this.store.put(this.CURRENT_LANGUAGE, lang);
      Utilities.delay(300).then(() => {
        this.translate.use(lang);
        this.requestLoading.removeLoadingRequest();
      });

    }

  }

  /**
   * Get current language
   */
  getLanguage() {
    return this.store.get(this.CURRENT_LANGUAGE);
  }

  /**
   * Get current language id
   */
  getLanguageId() {
    const currentLanguage = this.getLanguage();
    return (currentLanguage === this.DEFAULT_LANGUAGE ? this.ID_SPANISH : this.ID_ENGLISH);
  }

  /**
   * Get current language name
   */
  getLanguageName() {
    const currentLanguage = this.getLanguage();
    return (currentLanguage === this.DEFAULT_LANGUAGE ? this.NAME_SPANISH : this.NAME_ENGLISH);
  }

  getLanguageDescription() {
    const currentLanguage = this.getLanguage();
    return (currentLanguage === this.DEFAULT_LANGUAGE ? this.DESC_SPANISH : this.NAME_ENGLISH);
  }

}
