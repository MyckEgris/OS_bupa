import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { LayoutComponent } from '../core/layout/layout.component';
import { MemberElegibilityComponent } from './member-elegibility/member-elegibility.component';
import { AuthGuardService } from '../security/services/auth-guard/auth-guard.service';
import { MemberVerificationEligibilityComponent } from './member-verification-eligibility/member-verification-eligibility.component';
import { PolicyPaymentsComponent } from './policy-payments/policy-payments.component';
import { PolicyApplicationComponent } from './policy-application/policy-application/policy-application.component';
import { PolicyApplicationStep1Component } from './policy-application/policy-application-step1/policy-application-step1.component';
import { PolicyApplicationStep2Component } from './policy-application/policy-application-step2/policy-application-step2.component';
import { PolicyApplicationStep3Component } from './policy-application/policy-application-step3/policy-application-step3.component';
import { PolicyApplicationViewComponent } from './policy-application-view/policy-application-view.component';
import { PolicyPaymentsViewReceiptComponent } from './policy-payments/policy-payments-view-receipt/policy-payments-view-receipt.component';
import { PolicyApplicationGuard } from './policy-application/policy-application-guard/policy-application.guard';
import { ViewPolicyInformationComponent } from './view-policy-information/view-policy-information.component';
import { ViewDetailInformationComponent } from './view-policy-information/view-detail-information/view-detail-information.component';
import { MemberInformationComponent } from './member-information/member-information.component';
import { AuthorizationGuard } from '../shared/guards/authorization.guard';
import { DeactivateRouteGuard } from '../shared/guards/deactivate-route.guard';
import { FeatureRestrictionsGuard } from '../shared/guards/features-restrictions.guard';
// tslint:disable-next-line:max-line-length
import { PolicyPaymentsWithoutLoggingComponent } from './policy-payments/policy-payments-without-logging/policy-payments-without-logging.component';
import { AuthorizationAnonymousGuard } from '../shared/guards/authorization-anonymous.guard';
import { RatesFormsQuestionariesComponent } from './rates-forms-questionaries/rates-forms-questionaries.component';
import { MyAgentComponent } from '../policy/my-agent/my-agent.component';
import { PolicyInformationResolverService } from './resolvers/policy/policy-information.resolver.service';
import { DocumentsResolverService } from './resolvers/documents/documents.resolver.service';
import { PolicyChangesComponent } from './policy-changes/policy-changes.component';
import { PolicyChangesStep1Component } from './policy-changes/policy-changes-step1/policy-changes-step1.component';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { PolicyChangesGuard } from './policy-changes/policy-changes-guard/policy-changes.guard';
import { PolicyChangesStep2Component } from './policy-changes/policy-changes-step2/policy-changes-step2.component';
import { ChangeAgentComponent } from './policy-changes/change-agent/change-agent.component';
import { ChangeAgentSummaryComponent } from './policy-changes/change-agent/change-agent-summary/change-agent-summary.component';
import { PolicyChangesStep3Component } from './policy-changes/policy-changes-step3/policy-changes-step3.component';
import { SearchBenefitsComponent } from './search-benefits/search-benefits.component';
import { ViewRenewalPolicyInformationComponent } from './view-renewal-policy-information/view-renewal-policy-information.component';
import { QuotationComponent } from './quotation/quotation/quotation.component';
import { QuotationStep1Component } from './quotation/quotation-step1/quotation-step1.component';
import { QuotationStep2Component } from './quotation/quotation-step2/quotation-step2.component';
import { QuotationStep3Component } from './quotation/quotation-step3/quotation-step3.component';
import { PolicyEnrollmentComponent } from './policy-enrollment-create/policy-enrollment/policy-enrollment.component';
// tslint:disable-next-line:max-line-length
import { PolicyEnrollmentStep1Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step1/policy-enrollment-step1.component';
// tslint:disable-next-line:max-line-length
import { PolicyEnrollmentStep3Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step3/policy-enrollment-step3.component';
// tslint:disable-next-line:max-line-length
import { PolicyEnrollmentStep2Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step2/policy-enrollment-step2.component';
import { PolicyEnrollmentGuard } from './policy-enrollment-create/policy-enrollment-guard/policy-enrollment.guard';
import { EnrollmentResolverService } from './resolvers/enrollment-resolver.service';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep2Section1Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step2/policy-enrollment-step2-section1/policy-enrollment-step2-section1.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep2Section2Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step2/policy-enrollment-step2-section2/policy-enrollment-step2-section2.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep2Section3Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step2/policy-enrollment-step2-section3/policy-enrollment-step2-section3.component';
// tslint:disable-next-line: max-line-length
import { EnrollmentDeactivateRouteGuard } from './policy-enrollment-create/policy-enrollment-guard/policy-enrollment-deactivate-route.guard';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep4Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/policy-enrollment-step4.component';
// tslint:disable-next-line: max-line-length
import { UnderConstructionComponent } from './policy-enrollment-create/policy-enrollment-steps/under-construction/under-construction.component';
import { QuotationStep2DeductiblesComponent } from './quotation/quotation-step2-deductibles/quotation-step2-deductibles.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep5Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step5/policy-enrollment-step5.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep6Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step6/policy-enrollment-step6.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep7Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step7/policy-enrollment-step7.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep8Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step8/policy-enrollment-step8.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep9Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step9/policy-enrollment-step9.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep8Section1Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step8/policy-enrollment-step8-section1/policy-enrollment-step8-section1.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep8Section2Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step8/policy-enrollment-step8-section2/policy-enrollment-step8-section2.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep8Section3Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step8/policy-enrollment-step8-section3/policy-enrollment-step8-section3.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep8Section4Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step8/policy-enrollment-step8-section4/policy-enrollment-step8-section4.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep10Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/policy-enrollment-step10.component';
// tslint:disable-next-line: max-line-length
import { Section3Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-petitioner/section3/section3.component';
// tslint:disable-next-line: max-line-length
import { Section1Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-petitioner/section1/section1.component';
// tslint:disable-next-line: max-line-length
import { Section2Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-petitioner/section2/section2.component';
// tslint:disable-next-line: max-line-length
import { Section4Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section4/section4.component';
// tslint:disable-next-line: max-line-length
import { PhysicalPetitionerComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-petitioner/physical-petitioner.component';
// tslint:disable-next-line: max-line-length
import { MoralPetitionerComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/moral-petitioner.component';
// tslint:disable-next-line: max-line-length
import { Section1Component as Section1ComponentMoral } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section1/section1.component';
// tslint:disable-next-line: max-line-length
import { Section2Component as Section2ComponentMoral } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section2/section2.component';
// tslint:disable-next-line: max-line-length
import { Section3Component as Section3ComponentMoral } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section3/section3.component';
import { PolicyDocumentsComponent } from './policy-documents/policy-documents.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep11Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step11/policy-enrollment-step11.component';
// tslint:disable-next-line: max-line-length
import { PreselectionQuestionsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/preselection-questions/preselection-questions.component';
// tslint:disable-next-line: max-line-length
import { GeneralQuestions1Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/general-questions1/general-questions1.component';
// tslint:disable-next-line: max-line-length
import { GeneralQuestions2Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/general-questions2/general-questions2.component';
// tslint:disable-next-line: max-line-length
import { MenWomenQuestionsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/men-women-questions/men-women-questions.component';
// tslint:disable-next-line: max-line-length
import { MedicalHistoryQuestionsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/medical-history-questions/medical-history-questions.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep9Section3Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step9/policy-enrollment-step9-section3/policy-enrollment-step9-section3.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep9Section2Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step9/policy-enrollment-step9-section2/policy-enrollment-step9-section2.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep9Section1Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step9/policy-enrollment-step9-section1/policy-enrollment-step9-section1.component';
// tslint:disable-next-line: max-line-length
import { PhysicalOwnerPetitionerComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-owner-petitioner/physical-owner-petitioner.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep12Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step12/policy-enrollment-step12.component';
import { PolicyAppEnrollmentResolverService } from './resolvers/policy/policy-app-enrollment.resolver.service';
import { NewBusinessQuotationComponent } from './quotation/new-business-quotation/new-business-quotation.component';
import { QuotationDeactivateRouteGuard } from './quotation/quotation-guard/quotation-deactivate.guard';
// tslint:disable-next-line: max-line-length
import { HolderAdditionalDataComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/holder/holder-additional-data/holder-additional-data.component';
// tslint:disable-next-line: max-line-length
import { HolderAddressesComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/holder/holder-addresses/holder-addresses.component';
// tslint:disable-next-line: max-line-length
import { HolderOtherAddressesComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/holder/holder-other-addresses/holder-other-addresses.component';
import { ConsentsComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/consents/consents.component';
import { ConSection1Component } from './policy-enrollment-create/policy-enrollment-steps/pan/consents/con-section1/con-section1.component';
import { ConSection2Component } from './policy-enrollment-create/policy-enrollment-steps/pan/consents/con-section2/con-section2.component';
import { ConSection3Component } from './policy-enrollment-create/policy-enrollment-steps/pan/consents/con-section3/con-section3.component';
import { ConSection4Component } from './policy-enrollment-create/policy-enrollment-steps/pan/consents/con-section4/con-section4.component';
import { IntroductionComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/introduction/introduction.component';
import { PetitionerComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/petitioner.component';
// tslint:disable-next-line: max-line-length
import { ApplicationSummaryComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/application-summary/application-summary.component';
// tslint:disable-next-line: max-line-length
import { SignAndAttachDocsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/sign-and-attach-docs/sign-and-attach-docs.component';
import { PaymentInfoComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/payment-info/payment-info.component';
import { PolicyEnrollmentPhase2Guard } from './policy-enrollment-create/policy-enrollment-guard/policy-enrollment-phase2.guard';
import { IndividualComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/individual/individual.component';
// tslint:disable-next-line: max-line-length
import { ContactEconomicInfoComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/individual/contact-economic-info/contact-economic-info.component';
// tslint:disable-next-line: max-line-length
import { AddressInfoComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/individual/address-info/address-info.component';
import { CompanyComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/company/company.component';
// tslint:disable-next-line: max-line-length
import { GeneralInfoCompanyComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/company/general-info-company/general-info-company.component';
// tslint:disable-next-line: max-line-length
import { ContactAddressInfoComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/company/contact-address-info/contact-address-info.component';
// tslint:disable-next-line: max-line-length
import { GeneralInfoComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/individual/general-info/general-info.component';
import { PolicyApplicationMenuComponent } from './policy-application-menu/policy-application-menu.component';
import { PolicyEnrollmentViewComponent } from './policy-enrollment-view/policy-enrollment-view.component';
import { SummaryComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/summary/summary.component';
import { RegisterAccountComponent } from './view-policy-information/view-detail-information/register-account/register-account.component';
// tslint:disable-next-line: max-line-length
import { RegisterSuccessComponent } from './view-policy-information/view-detail-information/register-account/register-success/register-success.component';

const routes: Routes = [
    {
        path: 'policies',
        component: LayoutComponent,
        children: [
            {
                path: 'rates-forms-questionaries',
                component: RatesFormsQuestionariesComponent,
                canActivate: [AuthGuardService],
                resolve: { RatesDocumentsContract: DocumentsResolverService }
            },
            {
                path: 'member-elegibility',
                component: MemberElegibilityComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'policy-payments-without-loggin',
                component: PolicyPaymentsWithoutLoggingComponent,
                canActivate: [AuthorizationAnonymousGuard]
            },
            {
                path: 'policy-payments', component: PolicyPaymentsComponent, canActivate: [AuthGuardService],
                children: []
            },
            {
                path: 'create-policy-application',
                component: PolicyApplicationComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'step1'
                    },
                    {
                        path: 'step1',
                        component: PolicyApplicationStep1Component,
                        data: { step: 1 },
                        canActivate: [AuthGuardService, FeatureRestrictionsGuard],
                    },
                    {
                        path: 'step2',
                        component: PolicyApplicationStep2Component,
                        data: { step: 2 },
                        canActivate: [AuthGuardService, PolicyApplicationGuard]
                    },
                    {
                        path: 'step3',
                        component: PolicyApplicationStep3Component,
                        data: { step: 3 },
                        canActivate: [AuthGuardService, PolicyApplicationGuard]
                    }
                ],
                canDeactivate: [DeactivateRouteGuard],
            },
            {
                path: 'create-policy-enrollment-41',
                component: PolicyEnrollmentComponent,
                resolve: { viewTemplate: EnrollmentResolverService, applicationModel: PolicyAppEnrollmentResolverService },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'step1'
                    },
                    {
                        path: 'step1',
                        component: PolicyEnrollmentStep1Component,
                        data: { step: 1 },
                        canActivate: [AuthGuardService]
                    },
                    {
                        path: 'step2',
                        component: PolicyEnrollmentStep2Component,
                        data: { step: 2, breadcrumb: 'Pasos: ' },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'section1'
                            },
                            {
                                path: 'section1',
                                component: PolicyEnrollmentStep2Section1Component,
                                data: { step: 2.1, breadcrumb: '2.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section2',
                                component: PolicyEnrollmentStep2Section2Component,
                                data: { step: 2.2, breadcrumb: '2.1/2.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section3',
                                component: PolicyEnrollmentStep2Section3Component,
                                data: { step: 2.3, breadcrumb: '2.1/2.2/2.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'step3',
                        component: PolicyEnrollmentStep3Component,
                        data: { step: 3 },
                        canActivate: [AuthGuardService/*, PolicyEnrollmentGuard*/]
                    },
                    {
                        path: 'step4',
                        component: PolicyEnrollmentStep4Component,
                        data: { step: 4, breadcrumb: 'Pasos: ' },
                        canActivate: [AuthGuardService/*, PolicyEnrollmentGuard*/],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'preselection-questions'
                            },
                            {
                                path: 'preselection-questions',
                                component: PreselectionQuestionsComponent,
                                data: { step: 4.1, breadcrumb: '4.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'general-questions1',
                                component: GeneralQuestions1Component,
                                data: { step: 4.2, breadcrumb: '4.1/4.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'general-questions2',
                                component: GeneralQuestions2Component,
                                data: { step: 4.3, breadcrumb: '4.1/4.2/4.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'men-women-questions',
                                component: MenWomenQuestionsComponent,
                                data: { step: 4.4, breadcrumb: '4.1/4.2/4.3/4.4' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'medical-history-questions',
                                component: MedicalHistoryQuestionsComponent,
                                data: { step: 4.5, breadcrumb: '4.1/4.2/4.3/4.4/4.5' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'step5',
                        component: PolicyEnrollmentStep5Component,
                        data: { step: 5 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step6',
                        component: PolicyEnrollmentStep6Component,
                        data: { step: 6 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step7',
                        component: PolicyEnrollmentStep7Component,
                        data: { step: 7 },
                        canActivate: [AuthGuardService]
                    },
                    {
                        path: 'step8',
                        component: PolicyEnrollmentStep8Component,
                        data: { step: 8, breadcrumb: 'Pasos: ' },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'section1'
                            },
                            {
                                path: 'section1',
                                component: PolicyEnrollmentStep8Section1Component,
                                data: { step: 8.1, breadcrumb: '8.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section2',
                                component: PolicyEnrollmentStep8Section2Component,
                                data: { step: 8.2, breadcrumb: '8.1/8.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section3',
                                component: PolicyEnrollmentStep8Section3Component,
                                data: { step: 8.3, breadcrumb: '8.1/8.2/8.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section4',
                                component: PolicyEnrollmentStep8Section4Component,
                                data: { step: 8.4, breadcrumb: '8.1/8.2/8.3/8.4' },
                                canActivateChild: [AuthGuardService]
                            }
                        ]
                    },
                    {
                        path: 'step9',
                        component: PolicyEnrollmentStep9Component,
                        data: { step: 9 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'step9'
                            },
                            {
                                path: 'section1',
                                component: PolicyEnrollmentStep9Section1Component,
                                data: { step: 9.1, breadcrumb: '9.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section2',
                                component: PolicyEnrollmentStep9Section2Component,
                                data: { step: 9.2, breadcrumb: '9.1/9.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section3',
                                component: PolicyEnrollmentStep9Section3Component,
                                data: { step: 9.3, breadcrumb: '9.1/9.2/9.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'step10',
                        component: PolicyEnrollmentStep10Component,
                        data: { step: 10 },
                        canActivate: [AuthGuardService/*, PolicyEnrollmentGuard*/],
                        children: [
                            {
                                path: '3',
                                component: PhysicalPetitionerComponent,
                                data: { step: 10 },
                                children: [
                                    {
                                        path: 'section1',
                                        component: Section1Component,
                                        data: { step: 10.1 },
                                        canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                                    },
                                    {
                                        path: 'section2',
                                        component: Section2Component,
                                        data: { step: 10.2 },
                                        canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                                    },
                                    {
                                        path: 'section3',
                                        component: Section3Component,
                                        data: { step: 10.3 },
                                        canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                                    }
                                ]
                            },
                            {
                                path: '2',
                                component: MoralPetitionerComponent,
                                data: { step: 10 },
                                children: [
                                    {
                                        path: 'section1',
                                        component: Section1ComponentMoral,
                                        data: { step: 10.1 },
                                        canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                                    },
                                    {
                                        path: 'section2',
                                        component: Section2ComponentMoral,
                                        data: { step: 10.2 },
                                        canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                                    },
                                    {
                                        path: 'section3',
                                        component: Section3ComponentMoral,
                                        data: { step: 10.3 },
                                        canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                                    },
                                    {
                                        path: 'section4',
                                        component: Section4Component,
                                        data: { step: 10.4 },
                                        canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                                    }
                                ]
                            },
                            {
                                path: '1/section1',
                                component: PhysicalOwnerPetitionerComponent,
                                data: { step: 10 },
                                canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'step11',
                        component: PolicyEnrollmentStep11Component,
                        data: { step: 11 },
                        canActivate: [AuthGuardService]
                    },
                    {
                        path: 'step12',
                        component: PolicyEnrollmentStep12Component,
                        data: { step: 12 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'underconstruction',
                        component: UnderConstructionComponent,
                        data: { step: 11 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    }
                ],
                canDeactivate: [EnrollmentDeactivateRouteGuard]
            },
            {
                path: 'create-policy-enrollment-56',
                component: PolicyEnrollmentComponent,
                resolve: { viewTemplate: EnrollmentResolverService, applicationModel: PolicyAppEnrollmentResolverService },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'step1'
                    },
                    {
                        path: 'step1',
                        component: IntroductionComponent,
                        data: { step: 1 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step2',
                        component: PolicyEnrollmentStep2Component,
                        data: { step: 2, breadcrumb: 'Pasos: ' },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'section1'
                            },
                            {
                                path: 'section1',
                                component: PolicyEnrollmentStep2Section1Component,
                                data: { step: 2.1, breadcrumb: '2.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section2',
                                component: HolderAdditionalDataComponent,
                                data: { step: 2.2, breadcrumb: '2.1/2.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section3',
                                component: HolderAddressesComponent,
                                data: { step: 2.3, breadcrumb: '2.1/2.2/2.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section4',
                                component: HolderOtherAddressesComponent,
                                data: { step: 2.4, breadcrumb: '2.1/2.2/2.3/2.4' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'step3',
                        component: PolicyEnrollmentStep3Component,
                        data: { step: 3 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step4',
                        component: PolicyEnrollmentStep4Component,
                        data: { step: 4, breadcrumb: 'Pasos: ' },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'preselection-questions'
                            },
                            {
                                path: 'preselection-questions',
                                component: PreselectionQuestionsComponent,
                                data: { step: 4.1, breadcrumb: '4.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'general-questions1',
                                component: GeneralQuestions1Component,
                                data: { step: 4.2, breadcrumb: '4.1/4.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'general-questions2',
                                component: GeneralQuestions2Component,
                                data: { step: 4.3, breadcrumb: '4.1/4.2/4.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'men-women-questions',
                                component: MenWomenQuestionsComponent,
                                data: { step: 4.4, breadcrumb: '4.1/4.2/4.3/4.4' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'medical-history-questions',
                                component: MedicalHistoryQuestionsComponent,
                                data: { step: 4.5, breadcrumb: '4.1/4.2/4.3/4.4/4.5' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'step5',
                        component: PolicyEnrollmentStep5Component,
                        data: { step: 5 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step6',
                        component: PolicyEnrollmentStep6Component,
                        data: { step: 6 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step7',
                        component: PolicyEnrollmentStep7Component,
                        data: { step: 7 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step8',
                        component: ConsentsComponent,
                        data: { step: 8, breadcrumb: 'Pasos: ' },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'section1'
                            },
                            {
                                path: 'section1',
                                component: ConSection1Component,
                                data: { step: 8.1, breadcrumb: '8.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section2',
                                component: ConSection2Component,
                                data: { step: 8.2, breadcrumb: '8.1/8.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section3',
                                component: ConSection3Component,
                                data: { step: 8.3, breadcrumb: '8.1/8.2/8.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section4',
                                component: ConSection4Component,
                                data: { step: 8.4, breadcrumb: '8.1/8.2/8.3/8.4' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'petitioner',
                        component: PetitionerComponent,
                        data: { step: 9 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                              path: '3', // Individual ID
                              component: GeneralInfoComponent,
                              data: { step: 9.1 },
                              canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                              path: '2', // Company ID
                              component: GeneralInfoCompanyComponent,
                              data: { step: 9.1 },
                              canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                      path: 'individual',
                      component: IndividualComponent,
                      data: { step: 9 },
                      canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                      children: [
                        {
                            path: '',
                            pathMatch: 'full',
                            redirectTo: 'contact-economic-info'
                        },
                        {
                            path: 'contact-economic-info',
                            component: ContactEconomicInfoComponent,
                            data: { step: 9.2 },
                            canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                        },
                        {
                            path: 'address-info',
                            component: AddressInfoComponent,
                            data: { step: 9.3 },
                            canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                        }
                      ]
                    },
                    {
                      path: 'company',
                      component: CompanyComponent,
                      data: { step: 9 },
                      canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                      children: [
                        {
                            path: '',
                            pathMatch: 'full',
                            redirectTo: 'contact-address-info'
                        },
                        {
                            path: 'contact-address-info',
                            component: ContactAddressInfoComponent,
                            data: { step: 9.2 },
                            canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                        }
                      ]
                    },
                    {
                        path: 'summary',
                        component: ApplicationSummaryComponent,
                        data: { step: 10 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'sign-and-attach-docs',
                        component: SignAndAttachDocsComponent,
                        data: { step: 11 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'payment-info',
                        component: PaymentInfoComponent,
                        data: { step: 12 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'summary-final',
                        component: SummaryComponent,
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    }
                ],
                canDeactivate: [EnrollmentDeactivateRouteGuard]
            },
            {
                path: 'policy-application-view',
                component: PolicyApplicationViewComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'view-policy-information',
                component: ViewPolicyInformationComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'view-detail-policy-information',
                component: ViewDetailInformationComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'view-policy-information/:policyId',
                component: ViewDetailInformationComponent,
                canActivate: [AuthGuardService],
                data: {
                    returnUrl: '/policies/view-policy-information'
                }
            },
            {
                path: 'register-account/:policyId',
                component: RegisterAccountComponent,
                canActivate: [AuthGuardService],
                data: {
                    returnUrl: '/policies/view-policy-information/{0}'
                }
            },
            {
                path: 'register-account-success/:policyId',
                component: RegisterSuccessComponent,
                canActivate: [AuthGuardService],
                data: {
                    returnUrl: '/policies/view-policy-information/{0}',
                    tab: 'claimPaymentMethod'
                }
            },
            {
                path: 'member-information',
                component: MemberInformationComponent,
                canActivate: [AuthGuardService, AuthorizationGuard],
                data: {
                    allowedRoles: ['GroupAdmin', 'Agent', 'AgentAssistant']
                }
            },
            {
                path: 'member-information/:policyId',
                component: ViewDetailInformationComponent,
                canActivate: [AuthGuardService, AuthorizationGuard],
                data: {
                    returnUrl: '/policies/member-information',
                    allowedRoles: ['GroupAdmin', 'Agent', 'AgentAssistant']
                }
            },
            {
                path: 'myAgent',
                component: MyAgentComponent,
                canActivate: [AuthGuardService],
                resolve: { policyInfo: PolicyInformationResolverService }
            },
            {
                path: 'policy-changes',
                component: PolicyChangesComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'step1'
                    },
                    {
                        path: 'step1',
                        component: PolicyChangesStep1Component,
                        data: { step: 1 },
                        canActivate: [AuthGuardService],
                    },
                    {
                        path: 'step2',
                        data: { step: 2 },
                        component: PolicyChangesStep2Component,
                        canActivate: [AuthGuardService, PolicyChangesGuard]
                    },
                    {
                        path: 'step3',
                        data: { step: 3 },
                        component: PolicyChangesStep3Component,
                        canActivate: [AuthGuardService, PolicyChangesGuard]
                    }
                ],
                canDeactivate: [DeactivateRouteGuard],
            },
            {
                path: 'view-renewal-policy-information',
                component: ViewRenewalPolicyInformationComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'policy-documents',
                component: PolicyDocumentsComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'policy-application-menu',
                component: PolicyApplicationMenuComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'enrollment-application-view',
                component: PolicyEnrollmentViewComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'create-policy-enrollment-39',
                component: PolicyEnrollmentComponent,
                resolve: { viewTemplate: EnrollmentResolverService, applicationModel: PolicyAppEnrollmentResolverService },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'step1'
                    },
                    {
                        path: 'step1',
                        component: IntroductionComponent,
                        data: { step: 1 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step2',
                        component: PolicyEnrollmentStep2Component,
                        data: { step: 2, breadcrumb: 'Pasos: ' },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'section1'
                            },
                            {
                                path: 'section1',
                                component: PolicyEnrollmentStep2Section1Component,
                                data: { step: 2.1, breadcrumb: '2.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section2',
                                component: HolderAdditionalDataComponent,
                                data: { step: 2.2, breadcrumb: '2.1/2.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section3',
                                component: HolderAddressesComponent,
                                data: { step: 2.3, breadcrumb: '2.1/2.2/2.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section4',
                                component: HolderOtherAddressesComponent,
                                data: { step: 2.4, breadcrumb: '2.1/2.2/2.3/2.4' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'step3',
                        component: PolicyEnrollmentStep3Component,
                        data: { step: 3 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step4',
                        component: PolicyEnrollmentStep4Component,
                        data: { step: 4, breadcrumb: 'Pasos: ' },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'preselection-questions'
                            },
                            {
                                path: 'preselection-questions',
                                component: PreselectionQuestionsComponent,
                                data: { step: 4.1, breadcrumb: '4.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'general-questions1',
                                component: GeneralQuestions1Component,
                                data: { step: 4.2, breadcrumb: '4.1/4.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'general-questions2',
                                component: GeneralQuestions2Component,
                                data: { step: 4.3, breadcrumb: '4.1/4.2/4.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'men-women-questions',
                                component: MenWomenQuestionsComponent,
                                data: { step: 4.4, breadcrumb: '4.1/4.2/4.3/4.4' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'medical-history-questions',
                                component: MedicalHistoryQuestionsComponent,
                                data: { step: 4.5, breadcrumb: '4.1/4.2/4.3/4.4/4.5' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'step5',
                        component: PolicyEnrollmentStep5Component,
                        data: { step: 5 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step6',
                        component: PolicyEnrollmentStep6Component,
                        data: { step: 6 },
                        canActivate: [AuthGuardService /*, PolicyEnrollmentGuard*/]
                    },
                    {
                        path: 'step7',
                        component: PolicyEnrollmentStep7Component,
                        data: { step: 7 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'step8',
                        component: ConsentsComponent,
                        data: { step: 8, breadcrumb: 'Pasos: ' },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                redirectTo: 'section1'
                            },
                            {
                                path: 'section1',
                                component: ConSection1Component,
                                data: { step: 8.1, breadcrumb: '8.1' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section2',
                                component: ConSection2Component,
                                data: { step: 8.2, breadcrumb: '8.1/8.2' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section3',
                                component: ConSection3Component,
                                data: { step: 8.3, breadcrumb: '8.1/8.2/8.3' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                                path: 'section4',
                                component: ConSection4Component,
                                data: { step: 8.4, breadcrumb: '8.1/8.2/8.3/8.4' },
                                canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                        path: 'petitioner',
                        component: PetitionerComponent,
                        data: { step: 9 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                        children: [
                            {
                              path: '3', // Individual ID
                              component: GeneralInfoComponent,
                              data: { step: 9.1 },
                              canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            },
                            {
                              path: '2', // Company ID
                              component: GeneralInfoCompanyComponent,
                              data: { step: 9.1 },
                              canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                            }
                        ]
                    },
                    {
                      path: 'individual',
                      component: IndividualComponent,
                      data: { step: 9 },
                      canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                      children: [
                        {
                            path: '',
                            pathMatch: 'full',
                            redirectTo: 'contact-economic-info'
                        },
                        {
                            path: 'contact-economic-info',
                            component: ContactEconomicInfoComponent,
                            data: { step: 9.2 },
                            canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                        },
                        {
                            path: 'address-info',
                            component: AddressInfoComponent,
                            data: { step: 9.3 },
                            canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                        }
                      ]
                    },
                    {
                      path: 'company',
                      component: CompanyComponent,
                      data: { step: 9 },
                      canActivate: [AuthGuardService, PolicyEnrollmentGuard],
                      children: [
                        {
                            path: '',
                            pathMatch: 'full',
                            redirectTo: 'contact-address-info'
                        },
                        {
                            path: 'contact-address-info',
                            component: ContactAddressInfoComponent,
                            data: { step: 9.2 },
                            canActivateChild: [AuthGuardService, PolicyEnrollmentGuard]
                        }
                      ]
                    },
                    {
                        path: 'summary',
                        component: ApplicationSummaryComponent,
                        data: { step: 10 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'sign-and-attach-docs',
                        component: SignAndAttachDocsComponent,
                        data: { step: 11 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'payment-info',
                        component: PaymentInfoComponent,
                        data: { step: 12 },
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    },
                    {
                        path: 'summary-final',
                        component: SummaryComponent,
                        canActivate: [AuthGuardService, PolicyEnrollmentGuard]
                    }
                ],
                canDeactivate: [EnrollmentDeactivateRouteGuard]
            }
        ]
    },
    {
        path: 'member-verification-elegibility',
        component: MemberVerificationEligibilityComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'policy-payments-view-receipt',
        component: PolicyPaymentsViewReceiptComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'quote',
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: 'quotation/:policyId',
                component: QuotationComponent,
                canDeactivate: [QuotationDeactivateRouteGuard],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'step1'
                    },
                    {
                        path: 'step1',
                        component: QuotationStep1Component,
                        data: { step: 1 }
                    },
                    {
                        path: 'step2',
                        component: QuotationStep2Component,
                        data: { step: 2 }
                    },
                    {
                        path: 'step2-deductibles',
                        component: QuotationStep2DeductiblesComponent,
                        data: { step: 2 }
                    },
                    {
                        path: 'step3',
                        component: QuotationStep3Component,
                        data: { step: 3 }
                    }
                ]
            }
        ]
    },
    {
        path: 'quote-new-business',
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: 'new-business',
                component: NewBusinessQuotationComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PolicyRoutingModule { }




export function secundMatcher(url: UrlSegment[]) {
    return url.length === 4 && isInteger(1) ? ({ consumed: url }) : null;
}
