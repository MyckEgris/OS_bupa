/**
* QuotationStep1Component
*
* @description: This class shows step 1 of quotation wizard.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuotationWizard } from '../quotation-wizard/entities/quotation-wizard';
import { Utilities } from 'src/app/shared/util/utilities';
import { QuotationWizardService } from '../quotation-wizard/quotation-wizard.service';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

/**
 * This class shows step 1 of quotation wizard.
 */
@Component({
    selector: 'app-quotation-step1',
    templateUrl: './quotation-step1.component.html',
    styleUrls: ['./quotation-step1.component.css']
})
export class QuotationStep1Component implements OnInit, OnDestroy {

    /**
     * Constant for time to delay (ms)
     */
    private TIME_TO_DELAY = 10;

    /**
     * Quotation subscription
     */
    private subscription: Subscription;

    /**
     * Current step
     */
    public currentStep = 1;

    /**
     * Quotation wizard instance
     */
    public wizard: QuotationWizard;

    /**
     * User data
     */
    public user: any;

    /**
     * Policy result
     */
    public policy: any;

    /**
     * Deductibles
     */
    public deductibles: any;

    /**
     * Current language id
     */
    public currentLanguageId: number;

    /**
     * City id
     */
    public cityId: number;

    /**
     * City name
     */
    public cityName: string;

    public owner: any;

    public spouse: any;

    public dependents: Array<any>;

    private discount: number;

    private DATA_NOT_FOUND = 404;

    /**
     * Contructor method
     * @param quotation Quotation wizard service injection
     * @param auth Auth service injection
     * @param policyService Policy service injection
     * @param router Router injection
     * @param translation Translation service injection
     * @param translate Translate service injection
     */
    constructor(
        private quotation: QuotationWizardService,
        private auth: AuthService,
        private policyService: PolicyService,
        private router: Router,
        private translation: TranslationService,
        private translate: TranslateService,
        private notification: NotificationService
    ) {
    }

    /**
     * Initialize variables, get user, language and policy detail. Handle wizard information
     */
    ngOnInit() {
        this.user = this.auth.getUser();
        this.currentLanguageId = this.translation.getLanguageId();
        this.subscription = this.quotation.beginQuotationWizard(wizard => this.wizard = wizard, 1);

        this.getPolicyDetail(this.wizard.policyId);

        this.translate.onLangChange.subscribe(lang => {
            this.currentLanguageId = this.translation.getLanguageId();
        });
    }

    /**
     * Get policy detail and map data to quote members object and quote policy object
     * @param policyId Policy id
     */
    getPolicyDetail(policyId) {
        this.policyService.getDetailPolicyByPolicyId(
            this.user.role_id,
            this.user.user_key,
            policyId
        ).subscribe(detail => {
            this.wizard.policyDetail = detail;
            this.wizard.currentPlan = detail.planId;
            const addresses = this.wizard.policyDetail.addresses.find(x => x.addressTypeId === 2);

            if (addresses) {
                this.cityName = addresses.city;
            }

            if (detail.discount && detail.discount.discountValue) {
                if (detail.discount.discountType === 'F') {
                    this.discount = Math.round((detail.discount.discountValue * 100) / detail.policyPremium);
                } else {
                    this.discount = detail.discount.discountValue;
                }
            }

            this.getOwnerOrGuardian();
            this.getSpouse();
            this.getDependents();
            this.getBenefitsByEligibility(detail);
            this.quotation.mapPolicyDetailsToQuoteRequest();
        });
    }

    /**
     * Get duductibles and benefits
     * @param policyDetail Policy detail
     */
    getBenefitsByEligibility(policyDetail) {
        this.policyService.getBenefitsByEligibility(this.wizard.policyId, policyDetail.memberId,
            Utilities.convertDateToString(new Date(policyDetail.lastEffectiveDate)), 3, 10, 1).subscribe(deductibles => {
                this.deductibles = deductibles.data;
                this.wizard.benefits = this.deductibles;
            }, error => {
                if (this.checkIfHasError404(error)) {
                    this.notification.showDialog('EMPLOYEE.QUOTE.QUOTATION.CURRENT_INFORMATION.DATA_NOT_FOUND_TITLE',
                        'EMPLOYEE.QUOTE.QUOTATION.CURRENT_INFORMATION.DATA_NOT_FOUND_MESSAGE');
                }
            });
    }

    /**
     * On destroy component
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Establish step to current step
     * @param step Step number
     */
    async setStep(step: number) {
        await Utilities.delay(this.TIME_TO_DELAY);
        this.wizard.currentStep = step;
    }

    /**
     * Navigate to next step
     */
    goToStep2() {
        this.router.navigate([`/quote/quotation/${this.wizard.policyId}/step2`]);
    }

    /**
     * Calculate member policy total
     * @param memberValue Value
     */
    getTotal(memberValue) {
        let total = 0;
        memberValue.forEach(val => {
            total += val.amount;
        });

        return total;
    }

    /**
     * Get owner
     */
    getOwnerOrGuardian() {
        this.owner = this.wizard.policyDetail.members.find(x => x.relationTypeId === 2 || x.relationTypeId === 5);
    }

    /**
     * Get spouse
     */
    getSpouse() {
        this.spouse = this.wizard.policyDetail.members.find(x => x.relationTypeId === 3);
    }

    /**
     * Get dependents
     */
    getDependents() {
        this.dependents = this.wizard.policyDetail.members.filter(x => x.relationTypeId === 4) || [];
    }

    /**
     * Get premium value by member
     * @param member member
     */
    getPremiumValueByMember(member) {
        // tslint:disable-next-line: max-line-length
        return (member.premiumComponent ? member.premiumComponent.find(x => x.premiumComponentTypeId === 1035 || x.premiumComponentTypeId === 1036).amount : 0);
    }

    /**
     * get total by member
     * @param member Member
     */
    getTotalForMember(member) {
        let total = 0;
        member.premiumComponent.forEach(val => {
            if ((val.premiumComponentTypeId === 1035) || (val.premiumComponentTypeId === 1036) ||
                (val.premiumComponentTypeId === 1038) || (val.premiumComponentTypeId === 1039)) {
                total += val.amount;
            }
        });

        return total;
    }

    /**
     * Get date according date id
     * @param dates Policy dates array
     * @param dateId Dateid
     */
    getPolicyDate(dates: Array<any>, dateId: number) {
        const date = dates.find(x => x.policyDateId === dateId);
        return date ? date.policyDateValue : '';
    }

    /**
     * Toggle slide
     */
    toggleSlideDetail() {
        $('#ig-detallereclamo2').slideToggle();
    }

    /**
     * Navigate to policies search
     */
    back() {
        this.router.navigate(['/policies/view-renewal-policy-information']);
    }

    /**
     * Check Error 404
     * @param error Error
     */
    checkIfHasError404(error) {
        return (error.status === this.DATA_NOT_FOUND);
    }

}
