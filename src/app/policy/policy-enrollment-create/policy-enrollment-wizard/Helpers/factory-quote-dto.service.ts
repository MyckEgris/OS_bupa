import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { PolicyEnrollmentWizard } from '../entities/policy-enrollment-wizard';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { QuoteCustomer } from 'src/app/shared/services/quote/entities/quote-customer';
import { EmailEnum } from 'src/app/shared/classes/email.enum';
import { Utilities } from 'src/app/shared/util/utilities';
import { QuotationMember } from 'src/app/shared/services/quote/entities/quotation-member';
import { QuotationPolicy } from 'src/app/shared/services/quote/entities/quotation-policy';
import * as moment from 'moment';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { QuoteMode } from 'src/app/shared/services/quote/entities/quote-mode.enum';
import { QuoteDto } from 'src/app/shared/services/quote/entities/quote.dto';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { _MatChipListMixinBase } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class FactoryQuoteDtoService {
  private user: UserInformationModel;
  private wizard: PolicyEnrollmentWizard;
  private _deductibleValue;

  constructor(private commonService: CommonService) { }

  async createQuoteDto(wizard: PolicyEnrollmentWizard, user: UserInformationModel) {
    this.wizard = wizard;
    this.user = user;
    const owner: Member = this.wizard.policyApplicationModel.members.find(m => m.relationTypeId === RelationType.OWNER);
    const address: Address = this.getPhysicalAddress(owner);
    return {
      quoteId: await this.commonService.newGuidNuevo().toPromise(),
      quoteType: 2,
      countryId: address.countryId,
      cityId: address.cityId,
      countryName: address.country,
      countryIsoAlpha: this.user.cc,
      cityName: address.city,
      effectiveDate: this.wizard.policyApplicationModel.issueDate,
      modeOfPayment: this.wizard.policyApplicationModel.modeOfPaymentId,
      currencyCode: 'USD',
      currencyId: 192,
      exchangeRate: 1,
      customer: this.createCustomers(owner),
      policy: this.createPolicy(),
      discounts: [],
      products: await this.createProducts(address),
      members: this.createMembers(),
      modeOfPayments: await this.getModeOfPayment(),
      quoteMode: QuoteMode.Full
    };
  }

  private getPhysicalAddress(owner: Member): Address {
    return this.wizard.policyApplicationModel.addresses
      .find(a => a.addressTypeId === AddressTypes.PHYSICAL && a.contactGuid === owner.applicationMemberGuid);
  }

  private createCustomers(owner: Member) {
    const customer = {} as QuoteCustomer;
    let emails = '';
    switch (this.user.role_id) {
      case '1':
          emails = emails + this.getHolderCustomer(owner);
          emails = emails + this.getAuthenticatedCustomer();
          break;
      case '2':
          emails = emails + this.getAuthenticatedCustomer();
          break;
      case '5':
          emails = emails + this.getHolderCustomer(owner);
          emails = emails + this.getAuthenticatedCustomer();
          break;
      default:
          emails = emails + this.getAuthenticatedCustomer();
          break;
    }
    customer.customerId = this.user.sub;
    customer.fullName = this.user.name;
    customer.bupaInsurance = { insuranceCode: Number(this.user.bupa_insurance), insuranceName: '' };
    customer.contact = { email: emails };
    customer.accountType = { accountId: Number(this.user.user_key), accountTypeId: Number(this.user.role_id), name: this.user.role };
    return customer;
  }

  private createPolicy(): QuotationPolicy {
    return {
      policyReferenceId: '',
      policyId: 0,
      policyTypeId: 1,
      policyStatus: 'Active', // 'Approved by Underwriting',
      policyIssueDate: this.wizard.policyApplicationModel.issueDate
    };
  }

  private getHolderCustomer(owner: Member) {
      const preferedEmail = this.wizard.policyApplicationModel.emails
        .find(x => x.emailTypeId === EmailEnum.PREFERRED_EMAIL && x.contactGuid === owner.applicationMemberGuid);
      if (preferedEmail) {
          return `${preferedEmail.emailAddress};`;
      }
    return '';
  }

  private getAuthenticatedCustomer() {
    if (this.user && this.user.sub !== '') {
        return this.user.sub;
    }
    return '';
  }

  async createProducts(address: Address) {
    const plans = await this.getDeductibleFromPlanSelected(address);
    this._deductibleValue = {
      deductibleInCountry: plans.deductibleInCountry,
      deductibleOutCountry: plans.deductibleOutCountry
    };
    return  [
      {
      productId: this.wizard.policyApplicationModel.productId,
      productName: this.wizard.policyApplicationModel.product,
      plans: [
        {
          planId: this.wizard.policyApplicationModel.planId,
          planName: plans.planName,
          planDescription: this.wizard.policyApplicationModel.plan,
          deductibleId: plans.deductibleId,
          riders: [],
          currentPlan: true
        }
      ]
    }];
  }

  async getDeductibleFromPlanSelected(address: Address) {
    return this.commonService.getPlansAndRidersByProductAndCountryIdAndCityIdAndPolicyTypeId(
      this.wizard.policyApplicationModel.productId,
      address.countryId,
      address.cityId,
      1,
      this.convertDateToFormat(this.wizard.policyApplicationModel.issueDate)
    ).toPromise().then(plans => {
      return plans[0].plans.find(x => x.planId === this.wizard.policyApplicationModel.planId);
    });
  }

  get deductibleValue() {
    return this._deductibleValue;
  }

    /**
    * Convert date value to format YYYY-MM-DD.
    * @param value Value
    */
   convertDateToFormat(value: any) {
    if (value) {
      return moment(value).format('YYYY-MM-DD');
    } else { return null; }
  }

  private createMembers(): Array<QuotationMember> {
    return this.wizard.policyApplicationModel.members.map((currentValue, index) => {
      return {
        memberId: index,
        memberNumber: index,
        memberName: `${currentValue.firstName} ${currentValue.lastName}`,
        dateOfBirth: currentValue.dob,
        age: Utilities.calculateAge(currentValue.dob),
        gender: currentValue.genderId,
        relationTypeId: currentValue.relationTypeId,
        extraPremiums: [],
        relationType: currentValue.relationType,
        removedFromQuote: false,
        checked: false,
        statusId: 29,
        added: false
      };
    });
  }

  async getModeOfPayment() {
    return await this.commonService.getModeOfPayment().toPromise()
      .then(modeOfPayments => modeOfPayments.map(mode => ({ modeOfPaymentId: +mode.id })));
  }

}
