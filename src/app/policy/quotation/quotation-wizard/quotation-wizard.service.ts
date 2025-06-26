import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { QuotationWizard } from './entities/quotation-wizard';
import { QuotationPolicy } from 'src/app/shared/services/quote/entities/quotation-policy';
import { QuotationMember } from 'src/app/shared/services/quote/entities/quotation-member';
import { QuoteCustomer } from 'src/app/shared/services/quote/entities/quote-customer';
import { CarouselItem } from './entities/carousel-item';
import { QuotationPolicyProductPlan } from 'src/app/shared/services/quote/entities/quotation-policy-product-plan';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { QuotationPolicyProduct } from 'src/app/shared/services/quote/entities/quotation-policy-product';
import { QuotationPolicyProductPlanRider } from 'src/app/shared/services/quote/entities/quotation-policy-product-plan-rider';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { QuotationMemberExtrapremium } from 'src/app/shared/services/quote/entities/quotation-member-extrapremium';
import { Utilities } from 'src/app/shared/util/utilities';
import { QuotationModeOfPayment } from 'src/app/shared/services/quote/entities/quotation-mode-of-payment';
import { QuotationPolicyDiscount } from 'src/app/shared/services/quote/entities/quotation-policy-discount';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';

@Injectable({
    providedIn: 'root'
})
export class QuotationWizardService {

    /**
     * QuotationWizard Subject
     */
    private quotationSubject: Subject<QuotationWizard>;

    /**
     * QuotationWizard Object
     */
    private quotation: QuotationWizard;

    constructor(
        private auth: AuthService,
        private translation: TranslationService,
        private config: ConfigurationService
    ) {
        this.quotationSubject = new Subject<QuotationWizard>();
    }

    beginQuotationWizard(fn, step?: number): Subscription {
        const subscription = this.quotationSubject.subscribe(fn);
        if (!this.quotation) {
            this.newQuotation();
        }
        if (step) {
            this.quotation.currentStep = step;
        }
        this.next();
        return subscription;
    }

    private next() {
        this.quotationSubject.next(this.quotation);
    }

    newQuotation() {
        this.quotation = {
            policyId: 0,
            currentStep: 0,
            languageId: 0,
            policyDetail: null,
            benefits: {},
            currentPlan: 0,
            quotationPolicy: { quoteId: Utilities.generateUUID(), quoteType: 2 }
        };
    }

    /**
     * Close the wizard of claim submission
     */
    endQuotationWizard() {
        this.newQuotation();
        this.next();
    }

    public mapPolicyDetailsToQuoteRequest() {
        const physicalAddress = this.getPhysicalAddressFromPolicyDto();
        this.quotation.quotationPolicy.countryId =
            physicalAddress ? physicalAddress.countryId : this.quotation.policyDetail.policyCountryId;
        this.quotation.quotationPolicy.cityId = physicalAddress ? physicalAddress.cityId : 0;
        this.quotation.quotationPolicy.countryName = physicalAddress ? physicalAddress.country : '';
        this.quotation.quotationPolicy.countryIsoAlpha = physicalAddress ? physicalAddress.isoAlpha : '';
        this.quotation.quotationPolicy.cityName = physicalAddress ? physicalAddress.city : '';
        this.quotation.quotationPolicy.effectiveDate = new Date(this.quotation.policyDetail.lastEffectiveDate);
        this.quotation.quotationPolicy.modeOfPayment = 4;
        this.quotation.quotationPolicy.currencyCode = this.quotation.policyDetail.currencyCode;
        this.quotation.quotationPolicy.currencyId = this.quotation.policyDetail.currencyId;
        this.quotation.quotationPolicy.exchangeRate = this.quotation.policyDetail.exchangeRate;
        this.quotation.quotationPolicy.customer = this.mapCustomerToQuotationCustomers();
        this.quotation.quotationPolicy.policy = this.mapPolicyToQuotationPolicy();
        this.quotation.quotationPolicy.discounts = [];
        this.quotation.quotationPolicy.products = [];
        this.quotation.quotationPolicy.members = this.mapMembersPolicyDetailsToQuotationMembers();
    }

    public mapCustomerToQuotationCustomers() {
        const user = this.auth.getUser();

        const customer = {} as QuoteCustomer;
        let emails = '';
        switch (user.role_id) {
            case '1':
                emails = emails + this.getHolderCustomer(this.quotation.policyDetail.emails);
                emails = emails + this.getAgentCustomer(this.quotation.policyDetail.agent, user);
                emails = emails + this.getAuthenticatedCustomer(user);
                break;
            case '2':
                emails = emails + this.getAgentCustomer(this.quotation.policyDetail.agent, user);
                emails = emails + this.getAuthenticatedCustomer(user);
                break;
            case '5':
                emails = emails + this.getHolderCustomer(this.quotation.policyDetail.emails);
                emails = emails + this.getAgentCustomer(this.quotation.policyDetail.agent, user);
                emails = emails + this.getAuthenticatedCustomer(user);
                break;
            default:
                emails = emails + this.getAuthenticatedCustomer(user);
                break;

        }

        /*if (this.quotation.policyDetail.emails.length !== 0) {
            const preferedEmail = this.quotation.policyDetail.emails.find(x=> x.emailTypeId === 1);
            if (preferedEmail !== null) {
                emails = `${preferedEmail.eMailAddress};`;
            }
        }*/

        /*if (this.quotation.policyDetail.agent.agentEmail !== '') {
            emails = emails + `${this.quotation.policyDetail.agent.agentEmail};`;
        }*/

        /*emails = emails + user.sub;*/

        customer.customerId = user.sub;
        customer.fullName = user.name;
        customer.bupaInsurance = { insuranceCode: Number(user.bupa_insurance), insuranceName: '' };
        customer.contact = { email: emails };
        customer.accountType = { accountId: Number(user.user_key), accountTypeId: Number(user.role_id), name: user.role };

        return customer;
    }

    private getAuthenticatedCustomer(user) {
        if (user && user.sub !== '') {
            return user.sub;
        }
        return '';
    }

    private getAgentCustomer(agent, user) {
        if (agent && agent.agentEmail !== '') {
            const authEmail = this.getAuthenticatedCustomer(user);
            if (authEmail !== agent.agentEmail) {
                return `${this.quotation.policyDetail.agent.agentEmail};`;
            }
        }
        return '';
    }

    private getHolderCustomer(emails) {
        if (emails && emails.length > 0) {
            const preferedEmail = emails.find(x => x.emailTypeId === 1);
            if (preferedEmail !== null) {
                return `${preferedEmail.eMailAddress};`;
            }
        }
        return '';
    }



    public mapPolicyToQuotationPolicy() {
        const policy = {} as QuotationPolicy;
        policy.policyId = this.quotation.policyId;
        policy.policyTypeId = 1;
        policy.policyStatus = this.quotation.policyDetail.policyStatus;

        return policy;
    }

    public mapDiscountsToQuotationDiscounts() {
        const discount = {} as QuotationPolicyDiscount;
        discount.discountType = this.quotation.policyDetail.discount.discountType;
        discount.value = this.quotation.policyDetail.discount.discountValue;

        return discount;
    }

    public setProductAndPlansToQuotationRequest(plans, paymentMethods) {
        this.mapProductToQuotationProducts(plans);
        this.mapPaymentTypesToQuotationPaymentTypes(paymentMethods);
    }

    public getProductAndPlansFromQuotation() {
        return this.quotation.quotationPolicy.products;
    }

    public getCurrentPlan(planId) {
        const product = this.quotation.quotationPolicy.products[0];
        return product.plans.find(x => x.planId === planId);
    }

    public setCurrentPlan(planId) {
        this.quotation.currentPlan = planId;
    }

    private mapProductToQuotationProducts(plans) {
        const existsProduct = (this.quotation.quotationPolicy.products.length > 0);
        if (existsProduct) {
            this.quotation.quotationPolicy.products.splice(0, this.quotation.quotationPolicy.products.length);
        }
        const quoteProduct = {} as QuotationPolicyProduct;
        quoteProduct.productId = this.quotation.policyDetail.productId;
        quoteProduct.productName = this.quotation.policyDetail.productName;
        const orderedPlans = this.putCurrentPlanAsFirst(plans);
        quoteProduct.plans = this.mapPlansToQuotationProductPlan(orderedPlans);

        this.quotation.quotationPolicy.products.push(quoteProduct);
    }

    private mapPaymentTypesToQuotationPaymentTypes(paymentMethods) {
        const quotePayments: Array<QuotationModeOfPayment> = [];
        paymentMethods.forEach(pmethod => {
            const payment = {} as QuotationModeOfPayment;
            payment.modeOfPaymentId = pmethod.modeOfPaymentId;
            quotePayments.push(payment);
        });

        this.quotation.quotationPolicy.modeOfPayments = quotePayments;
    }

    private putCurrentPlanAsFirst(plans: Array<any>) {
        if (plans.length > 0) {
            plans.forEach(plan => { plan.currentPlan = false; });
            const currentPlan = plans.find(x => x.planId === this.quotation.currentPlan);
            if (currentPlan) {
                currentPlan.currentPlan = true;
                const positionCurrentPlan = plans.findIndex(x => x.planId === this.quotation.currentPlan);
                plans.splice(positionCurrentPlan, 1);
                plans.unshift(currentPlan);
            }
        }

        return plans;
    }

    private mapMembersPolicyDetailsToQuotationMembers() {
        const quoteMembers = [];
        this.quotation.policyDetail.members.forEach(member => {
            const fbirth: any = new Date(member.dob);
            const ftoday: any = new Date();
            const quoteMember = {} as QuotationMember;

            quoteMember.memberId = member.memberId;
            quoteMember.memberNumber = member.memberId;
            quoteMember.memberName = member.fullName;
            quoteMember.dateOfBirth = new Date(member.dob);
            quoteMember.age = Math.trunc((ftoday - fbirth) / (1000 * 60 * 60 * 24 * 365));
            quoteMember.gender = 2;
            quoteMember.relationTypeId = member.relationTypeId;
            quoteMember.extraPremiums = this.mapPremiumComponentToQuotationMemberExtraPremiums(member);

            quoteMember.relationType = member.relationType;
            quoteMember.removedFromQuote = false;
            quoteMember.checked = false;
            quoteMember.statusId = member.memberStatusId;
            quoteMember.added = false;

            quoteMembers.push(quoteMember);
        });

        return quoteMembers;
    }

    private mapPlansToQuotationProductPlan(plans) {
        const quotationPlans = [];
        if (plans.length > 0) {
            plans.forEach(plan => {
                const quotePlan = {} as QuotationPolicyProductPlan;
                quotePlan.planId = plan.planId;
                quotePlan.planName = plan.planName;
                quotePlan.planDescription = plan.planDescription;
                quotePlan.deductibleId = plan.deductibleId;
                quotePlan.riders = this.mapRidersToQuotationProductPlan(plan.planId, plan.riders);
                quotePlan.currentPlan = plan.currentPlan ? true : false;
                quotationPlans.push(quotePlan);
            });
        }

        return quotationPlans;
    }

    private mapRidersToQuotationProductPlan(selectedPlan, riders) {
        const quotationPlanRiders = [];
        const languageId = this.translation.getLanguageId();
        if (this.validateIncludeRidersInQuotation(selectedPlan)) {
            const activeRiders = this.matchRidersBetweenPolicyAndSelectedPlan(riders);
            if (activeRiders.length > 0) {
                activeRiders.forEach(rider => {
                    const quoteRider = {} as QuotationPolicyProductPlanRider;
                    quoteRider.riderId = rider.riderId;
                    quoteRider.name = (languageId === 1 ? rider.englishDescription : rider.spanishDescription);
                    quoteRider.cost = rider.cost;
                    quoteRider.applyRiderId = rider.applyRiderId;
                    quoteRider.fixedAmtOrPct = rider.fixedAmtOrPct;

                    quotationPlanRiders.push(quoteRider);
                });
            }
        }

        return quotationPlanRiders;
    }

    private validateIncludeRidersInQuotation(selectedPlan) {
        return (this.quotation.currentPlan === this.quotation.policyDetail.planId && this.quotation.currentPlan === selectedPlan);
    }

    private matchRidersBetweenPolicyAndSelectedPlan(riders) {
        const activeRiders = [];
        riders.forEach(rider => {
            const findRider = this.quotation.policyDetail.riders.find(x => x.riderId === rider.riderId);
            if (findRider) {
                activeRiders.push(rider);
            }
        });

        return activeRiders;
    }

    private mapPremiumComponentToQuotationMemberExtraPremiums(member) {
        const extraPremiums = [];
        if (member.specialConditions && member.specialConditions.length > 0) {
            const lang = this.translation.getLanguageId();
            const xtraPremiumsByLang = member.specialConditions.filter(x => x.limitationName === 'Extra Premium');
            if (xtraPremiumsByLang) {
                xtraPremiumsByLang.forEach(extra => {
                    const extraPremium = {} as QuotationMemberExtrapremium;
                    if ((member.relationTypeId) && (member.relationTypeId === 3)) {
                        extraPremium.extraPremiumId = 1036;
                    } else {
                        extraPremium.extraPremiumId = 1038;
                    }
                    extraPremium.extraPremiumValue = extra.limitationValue;
                    extraPremium.quantity = 1;
                    extraPremium.extraPremiumType = (!extra.limitationType ? 0 : 1);

                    extraPremiums.push(extraPremium);
                });
            }
        }

        return extraPremiums;
    }

    private getPhysicalAddressFromPolicyDto() {
        return this.quotation.policyDetail.addresses.find(x => x.addressTypeId === 2);
    }

    private getEffectiveDateFromPolicyDto() {
        return this.quotation.policyDetail.policyDates.find(x => x.policyDateId === 101).policyDateValue;
    }

    private getOwnerFromPolicyDetail() {
        const ownerId = this.quotation.policyDetail.memberId;
        return (this.quotation.policyDetail.members.find(m => m.memberId === ownerId));
    }

    public getPlanFromOwnerDeductible(products) {
        const owner = this.getOwnerFromPolicyDetail();
        const deductibleId = owner.deductibleId;
        return products.plans.find(x => x.deductibleId === deductibleId);
    }

    public mapCurrentPlanToPolicyQuotation(selectedPlan?: any) {
        const currentPlan = {} as QuotationPolicyProductPlan;
        currentPlan.planId = selectedPlan ? selectedPlan.planId : this.quotation.policyDetail.planId;
        currentPlan.planName = selectedPlan ? selectedPlan.planName : this.quotation.policyDetail.plan;
        currentPlan.planDescription = selectedPlan ? selectedPlan.planDescription : this.quotation.policyDetail.planDescription;
    }

    buildCarouselItemsAndCards(plans) {
        const countCarouselItems = this.calculateCarouselItems(plans);
        const carouselItems: Array<CarouselItem> = [];
        const plansByItem = 3;

        for (let i = 0; i < countCarouselItems; i++) {
            const indexMin = i * plansByItem;
            const indexMax = indexMin + plansByItem;
            const items = plans.filter(
                (x, index) => index >= indexMin && index < indexMax
            );

            carouselItems.push(items);
        }

        return carouselItems;
    }

    public isIhiBupaInsurances(bupaInsurance: string) {
        const bupaInsuranceToExcludeList = this.config.ihiBupaInsurances.split(',');
        const bupaInsuranceFound = bupaInsuranceToExcludeList.findIndex(x => x === bupaInsurance);
        if (bupaInsuranceFound !== -1) { return true; }
        return false;

    }

    calculateCarouselItems(plans) {
        return Math.ceil(plans.length / 3);
    }

}
