import { MemberOutputDto } from './member';
import { PaymentDto } from './payment.dto';
import { Agent } from '../../agent/entities/agent';
import { SpecialConditionOutputDto } from './specialCondition.dto';
import { DocumentOutputDto } from './documents.dto';
import { PolicyDate } from './policy-date.dto';
import { CardDto } from './card.dto';
import { EmailOutputDto } from './email.dto';
import { AddressOutputDto } from './address.dto';
import { PhoneOutputDto } from './phone.dto';
import { Country } from '../../common/entities/country';
import { Rider } from '../../policy-application/entities/rider';
import { Discount } from './discount';
 import { PolicyLetterDto } from './policyLetter.dto';


/**
* Policy.ts
*
* @description: DTO member
* @author Arturo Suarez
* @version 1.0
* @date 10-10-2018.
*
**/


/**
 * DTO member
 */
export interface PolicyDto {
    policyId: number;
    legacyNumber: string;
    policyReference: string;
    policyStatus: string;
    modeOfPayment: string;
    modeOfPaymentId: string;
    policyCountry: string;
    policyCountryId: number;
    paymentStatus: string;
    paymentDate: string;
    daysToPay: number;
    isGroupPolicy: any;
    amountToPay: number;
    policyPremium: number;
    premiumId: number;
    number: string;
    amountTotalToPay: number;
    amountUSDTotalToPay: number;
    amountUSDToPay: number;
    groupId: number;
    groupName: string;
    currencySymbol: string;
    currencyId: number;
    exchangeRate: number;
    plan: string;
    language: string;
    languageId: number;
    paperless: boolean;
    printIdCard: number;
    hasGeoBlueIdCard: number;
    policyDates: PolicyDate[];
    agent: Agent;
    specialConditions: SpecialConditionOutputDto[];
    members: MemberOutputDto[];
    payments: PaymentDto[];
    documents: DocumentOutputDto[];
    cards: CardDto[];
    emails: EmailOutputDto[];
    email: string;
    addresses: AddressOutputDto[];
    phones: PhoneOutputDto[];
    fixedRate: number;
    planId?: number;
    planDescription: string;
    dependentPremium: number;
    currencyCode: string;
    agentNotAccess: boolean;
    memberId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    insuranceBusinessId: number;
    insuranceBusinessIsOnShore?: boolean;
    lastEffectiveDate: Date;
    ownerDob?: string;
    /**
     * Color: Para diferenciar los grupos
     * No viene del back, se usa solo en front
     */
    color?: string;
    showFixedRates?: boolean;
    benefitYear?: number;
    productId?: number;
    productName?: string;
    referencePolicyId?: any;
    referenceGroupId?: any;
    policyCountryObject: Country;
    policyStatusId: number;
    discount?: Discount;
    discountType?: string;
    riders?: Rider[];
    automaticDeduction?: boolean;
    letters?: PolicyLetterDto[];
    phone?: string;
    receivedMethodId: number;
    receivedMethod: string;
    policyNatureId?: number;

}




