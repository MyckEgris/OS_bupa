import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Country } from 'src/app/shared/services/common/entities/country';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { RegisterAccountService } from './register-service/register-account.service';
import { RegisterCondition } from './register-service/register-condition';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html'
})
export class RegisterAccountComponent implements OnInit {

  public showOffShoreAch = false;
  public showOffShoreWt = false;
  public showOnShoreAch = false;
  public showCheckEng = false;
  public showCheckSpa = false;
  public returnUrl = '';

  public countries: Array<Country>;

  public selectedCountry: Country;

  public isCountryDisabled = false;

  public isSanctioned = false;

  public policyReference = '';

  public currentLang = '';

  private registerConditions: RegisterCondition;

  private policyId = 0;

  private policy: PolicyDto;

  private COUNTRY_IS_USA = 98;

  // tslint:disable-next-line: max-line-length
  private AMERICA_COUNTRIES = [1, 2, 24, 9, 3, 5, 41, 64, 36, 16, 63, 21, 22, 25, 13, 32, 18, 19, 7, 8, 46, 15, 51, 40, 34, 52, 84, 90, 54, 1052, 45, 37, 59, 65, 10, 55, 17, 4, 1055, 66, 57, 56, 58, 98];

  constructor(
    private registerService: RegisterAccountService,
    private route: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private translation: TranslationService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.currentLang = this.translation.getLanguage();
    this.showCheckHelp(this.currentLang);
    this.getValuesForRoute();
    this.policy = this.registerService.getPolicyInformation();
    this.registerConditions = this.registerService.getRegisterConditions();
    if (!this.registerConditions || !this.policy) {
      this.back();
    }
    // this.policyReference = this.policy.policyReference;
    this.getCountries(this.isCountryDisabled);
    this.translate.onLangChange.subscribe(lang => {
      this.showCheckHelp(lang.lang);
    });
  }

  showCheckHelp(lang) {
    this.showCheckEng = (lang === 'ENG');
    this.showCheckSpa = (lang === 'SPA');
  }

  getValuesForRoute() {
    this.policyId = this.route.snapshot.params['policyId'];
    this.route.data.subscribe(data => {
      this.returnUrl = data.returnUrl.replace('{0}', this.policyId);
    });
  }

  getCountries(isSanctioned: boolean) {
    this.common.getCountriesIsSanctioned(isSanctioned).subscribe(countries => {
      this.countries = countries;
      console.log(this.countries);
      // this.getCountriesInAmerica(countries);
      this.setUsaAsFirstCountry();
      this.getDefaultCountry();
    });
  }

  getCountriesInAmerica(countries) {
    this.countries = countries.filter(x => this.AMERICA_COUNTRIES.includes(x.countryId));
  }

  setUsaAsFirstCountry() {
    const usa = this.countries.find(x => x.countryId === this.COUNTRY_IS_USA);
    const usaIndex = this.countries.findIndex(x => x === usa);
    this.countries.splice(usaIndex, 1);
    this.countries.unshift(usa);
  }

  getDefaultCountry() {
    const defaultCountry = this.countries.find(x => x.countryId === this.policy.policyCountryId);
    if (!this.policy.insuranceBusinessIsOnShore && this.policy.policyCountryId === this.COUNTRY_IS_USA) {
      this.selectedCountry = defaultCountry;
      this.onSelectCountry(defaultCountry);
    }
    if (this.policy.insuranceBusinessIsOnShore) {
      this.selectedCountry = defaultCountry;
      this.onSelectCountry(defaultCountry);
      this.isCountryDisabled = true;
    }
  }

  onSelectCountry(country) {
    this.selectedCountry = country;
    this.showOffShoreAch = !this.policy.insuranceBusinessIsOnShore && (country.countryId === this.COUNTRY_IS_USA);
    this.showOffShoreWt = !this.policy.insuranceBusinessIsOnShore && (country.countryId !== this.COUNTRY_IS_USA);
    this.showOnShoreAch = this.policy.insuranceBusinessIsOnShore;
  }

  back() {
    this.router.navigate([this.returnUrl || '/policies/view-policy-information']);
  }

}
