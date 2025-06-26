import { Injectable } from '@angular/core';
import { RegisterCondition } from './register-condition';

@Injectable({
  providedIn: 'root'
})
export class RegisterAccountService {

  private registerConditions: RegisterCondition;

  private payeeInformation: any;

  private policyInformation: any;

  private members: Array<any>;

  private summary: any;

  private DEFAULT_CURRENCY = { currencyId: 192, currencyCode: 'USD' };

  constructor() { }

  getRegisterConditions(): RegisterCondition {
    return this.registerConditions;
  }

  setRegisterConditions(isOffShoreAch: boolean,isOffShoreWt: boolean, isOnShoreAch: boolean,  countryId: number) {
    this.registerConditions.isOffShoreAch = isOffShoreAch;
    this.registerConditions.isOffShoreWt = isOffShoreWt;
    this.registerConditions.isOnShoreAch = isOnShoreAch;
    this.registerConditions.countryId = countryId;
  }

  resetRegisterConditions() {
    this.registerConditions = {} as RegisterCondition;
  }

  getPayeeInformation() {
    return this.payeeInformation;
  }

  setPayeeInformation(payee) {
    this.payeeInformation = payee;
  }

  getPolicyInformation() {
    return this.policyInformation;
  }

  setPolicyInformation(policy) {
    this.policyInformation = policy;
  }

  getMembersInformation() {
    return this.members;
  }

  setMembersInformation(members: Array<any>) {
    this.members = members;
  }

  getRegisterSummary() {
    return this.summary;
  }

  setRegisterSummary(result) {
    this.summary = result;
  }

  getDocumentTypes() {
    return [
      { id: 1, value: 'POLICY.VIEW_POLICY_DETAILS.TABS.DOCUMENT_TYPES.CC' },
      { id: 2, value: 'POLICY.VIEW_POLICY_DETAILS.TABS.DOCUMENT_TYPES.PASSPORT' },
      { id: 3, value: 'POLICY.VIEW_POLICY_DETAILS.TABS.DOCUMENT_TYPES.RUC' },
    ];
  }

  getAccountTypes() {
    return [
      { id: 1, value: 'POLICY.VIEW_POLICY_DETAILS.TABS.ACCOUNT_TYPES.SAVINGS' },
      { id: 2, value: 'POLICY.VIEW_POLICY_DETAILS.TABS.ACCOUNT_TYPES.CHECKING' }
    ];
  }

  getCurrencyies(currencyId: number, currencyCode: string) {
    const currencies = [];
    const policyCurrency =  { currencyId: currencyId, currencyCode: currencyCode };
    currencies.push(this.DEFAULT_CURRENCY);
    if (policyCurrency !== this.DEFAULT_CURRENCY) {
      currencies.push(policyCurrency);
    }

    return currencies;
  }

  getPatternForField() {
    return [
      { id: 'onlyNumber', pattern: '^[0-9]*$'},
      { id: 'alphaNumeric', pattern: '^[a-zA-Z0-9]*$'},
      { id: 'numberAndSpace', pattern: '^[0-9 ]*$'}
    ];
  }

}
