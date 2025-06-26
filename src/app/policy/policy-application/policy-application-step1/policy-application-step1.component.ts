/**
* policy-application-step1.component.ts
*
* @description: This class handle step 1 policy aplication wizard.
* @author Sergio Silva.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-01-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../../shared/services/common/common.service';
import { AuthService } from '../../../security/services/auth/auth.service';
import { FormGroup } from '../../../../../node_modules/@angular/forms';
import { AgentService } from '../../../shared/services/agent/agent.service';
import { Agent } from '../../../shared/services/agent/entities/agent';
import { Country } from '../../../shared/services/common/entities/country';
import { City } from '../../../shared/services/common/entities/city';
import { Product } from '../../../shared/services/common/entities/product';
import { Plan } from '../../../shared/services/common/entities/plan';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PolicyApplicationWizard } from '../policy-application-wizard/entities/policy-application-wizard';
import { PolicyApplicationWizardService } from '../policy-application-wizard/policy-application-wizard.service';

/**
 * This class handle step 1 policy aplication wizard.
 */
@Component({
  selector: 'app-policy-application-step1',
  templateUrl: './policy-application-step1.component.html'
})
export class PolicyApplicationStep1Component implements OnInit, OnDestroy {

  /**
   * FormGoup Object
   */
  public policyForm: FormGroup;

  /**
   * Agent Object
   */
  public agent: Agent;

  /**
   * hierarchy angents Object
   */
  public hierarchyAgents: any[];

  /**
   * User Object
   */
  public user: any;

  /**
   * validate form initialization
   */
  public checked = false;

  /**
   * Current agent phone string
   */
  public agentPhone = '';

  /**
   * Current agent phone string
   */
  public agentRole = '';

  /**
   * Current agent insurance business
   */
  public insuranceBusiness: string;

  /**
   * Current agent insurance business id
   */
  public insuranceBusinessId: number;

  /**
   * Current agent phone string
   */
  public agentEmail = '';

  /**
   * countries by current insurance business
   */
  public countries: Country[];

  /**
   * current country
   */
  public country: Country;

  /**
   * cities by current country
   */
  public cities: City[];

  /**
   * current city
   */
  public city: City;

  /**
   * produts by current insurance business, country and city
   */
  public products: Product[];

  /**
   * current product
   */
  public product: Product;

  /**
   * plans by current product
   */
  public plans: Plan[];

  /**
   * current plan
   */
  public plan: Plan;

  /**
   * PolicyApplicationWizard Object
   */
  public wizard: PolicyApplicationWizard;

  /**
   * Constant for current step # 1
   */
  public currentStep = 1;

  /**
   * Constant for current step # 1
   */
  public showValidations = false;

  /**
   * Max date
   */
  public maxDate = new Date();

  /**
   * max policy holder date
   */
  public maxPolicyHolderDate;

  /**
   * max policy holder date
   */
  public minPolicyHolderDate;

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * Constant office
   */
  private OFFICE = 'Office';

  /**
   * Constant preferred email
   */
  private PREFERRED_EMAIL = 'Preferred Email';

  /**
   * constructor method
   * @param commonService common service injection
   * @param authService auth service injection
   * @param agentService agent service injection
   */
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private agentService: AgentService,
    private router: Router,
    private policyApplicationWizardService: PolicyApplicationWizardService
  ) { }

  /**
   * PENDING
   */
  ngOnInit() {
    this.hierarchyAgents = [];
    this.user = this.authService.getUser();
    this.subscription = this.policyApplicationWizardService.beginPolicyApplicationWizard(
      wizard => { this.wizard = wizard; }, this.user, this.currentStep);
    this.setUpForm();
    this.getRoleTranslated();
    this.setUpDates();
  }

  /**
   * Destroy subscription
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * this method set up the policy aplication form
   */
  setUpForm() {
    this.agentService.getAgentById(this.user.agent_number).subscribe(agent => {
      this.agent = agent;
      this.getAgentHierarchyById(this.user.agent_number);
      if (this.checkIfComeBackFromStep2()) {
        this.getMasterDataValues();
      } else {
        this.getCountriesByBusinessId(+this.agent.insuranceBusinessId);
      }
    });
  }

  /**
   * translate current user role
   */
  getRoleTranslated() {
    this.agentRole = this.policyApplicationWizardService.getRoleTranslated(this.user.role);
  }

  getCountriesByBusinessId(businessId: number) {
    this.commonService.getCountriesByBusinessId(businessId).subscribe(countries => {
      this.countries = countries;
      this.checked = true;
    });
  }

  loadDefaultCities(countryId: number) {
    this.getCities(countryId);
  }

  getCities(countryId: number) {
    this.commonService.getCitiesByCountry(countryId).subscribe(cities => {
      this.cities = cities;
    });
  }

  getProductByBusinessAndCityAndCountry(businessId: number, country: number, city: number) {
    this.commonService.getProductByCityAndCountry(businessId, country, city, true).subscribe(products => {
      this.products = products;
    });
  }

  getPlansByProduct(productId: number) {
    this.commonService.getPlansByProduct(productId).subscribe(plans => {
      this.plans = plans;
    });
  }

  handleCountryChange(country: Country) {
    this.country = country;
    this.wizard.policyForm.controls['product'].reset();
    this.wizard.policyForm.controls['plan'].reset();
    this.wizard.policyForm.controls['city'].reset();
    this.products = [];
    this.plans = [];
    this.cities = [];
    if (country) {
      this.wizard.countryName = country.countryName;
      this.wizard.countryId = country.countryId;
      this.getCities(country.countryId);
    }
  }

  handleCityChange(city: City) {
    this.city = city;
    this.wizard.policyForm.controls['product'].reset();
    this.wizard.policyForm.controls['plan'].reset();
    this.products = [];
    this.plans = [];
    if (city) {
      this.wizard.cityId = city.cityId;
      this.wizard.cityName = city.cityName;
      this.getProductByBusinessAndCityAndCountry(this.agent.insuranceBusinessId, this.country.countryId,
        city.cityId);
    }
  }

  handleProductChange(product: Product) {
    this.wizard.policyForm.controls['plan'].reset();
    this.plans = [];
    this.product = product;
    if (product) {
      this.wizard.productId = +product.id;
      this.wizard.productName = product.name;
      this.getPlansByProduct(+product.id);
    }
  }

  handlePlanChange(plan: Plan) {
    this.plan = plan;
    if (plan) {
      this.wizard.planId = +plan.id;
      this.wizard.planName = plan.name;
    }
  }

  handleAgentChange(agent: any) {
    this.countries = [];
    this.products = [];
    this.plans = [];
    this.cities = [];
    this.wizard.policyForm.controls['insuranceBusiness'].setValue(agent.insuranceBusiness);
    this.getCountriesByBusinessId(+agent.insuranceBusinessId);
    this.wizard.agentId = agent.agentId;
    this.wizard.agent = agent.companyName;
    const agentPhone = !agent.phones ? '' : agent.phones.filter(phone => phone.type === this.OFFICE)[0].phoneNumber;
    const agentEmail = !agent.emails ? '' : agent.emails.filter(email => email.type === this.PREFERRED_EMAIL)[0].eMailAddress;
    this.wizard.policyForm.controls['phone'].setValue(agentPhone);
    this.wizard.policyForm.controls['email'].setValue(agentEmail);
  }

  /**
   * This function route to the next step (Step2).
   */
  next() {
    if (this.wizard.policyForm.valid) {
      this.wizard.policyForm.valueChanges.subscribe(() => {
        this.wizard.documents = [];
        this.wizard.rulesFormArray.reset();
      });
      this.router.navigate(['policies/create-policy-application/step2']);
    } else {
      this.showValidations = true;
    }
  }

  goToSearchPolicyApplication() {
    this.router.navigate(['policies/policy-application-view']);
  }

  /**
   * this method fetch the full agent hierarchy
   * @param id agent id
   */
  getAgentHierarchyById(id: string) {
    this.agentService.getAgentHierarchyById(id).subscribe(agents => {
      agents.push(this.agent);
      const agentsAux = agents.map(agent => {
        return {
          companyName: this.agentService.getAgentName(agent) + '-' + agent.agentNumber.toString(),
          agentId: agent.agentId,
          insuranceBusinessId: agent.insuranceBusinessId,
          insuranceBusiness: agent.insuranceBusiness,
          emails: agent.emails,
          phones: agent.phones
        };
      });
      this.hierarchyAgents = agentsAux;
    }, err => {
    }
    );
    if (this.hierarchyAgents.length === 0) {
      this.agent.companyName = this.agentService.getAgentName(this.agent) + '-' + this.agent.agentNumber.toString(),
        this.hierarchyAgents.push(this.agent);
    }
  }

  checkIfComeBackFromStep2() {
    return (this.wizard.countryId !== 0);
  }

  getMasterDataValues() {
    this.getCountriesByBusinessId(this.wizard.businessInsuranceId);
    this.getCities(this.wizard.countryId);
    this.getProductByBusinessAndCityAndCountry(this.wizard.businessInsuranceId, this.wizard.countryId, this.wizard.cityId);
    this.getPlansByProduct(this.wizard.productId);
    this.checked = true;
  }

  setUpDates() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    this.maxPolicyHolderDate = new Date(year - 18, month, day);
    d = new Date();
    year = d.getFullYear();
    month = d.getMonth();
    day = d.getDate();
    this.minPolicyHolderDate = new Date(year - 74, month, day);
  }

}
