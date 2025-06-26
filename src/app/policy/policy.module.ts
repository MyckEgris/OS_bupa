import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PolicyRoutingModule } from './policy-routing.module';
import { MemberElegibilityComponent } from './member-elegibility/member-elegibility.component';
import { SecurityModule } from '../security/security.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MemberVerificationEligibilityComponent } from './member-verification-eligibility/member-verification-eligibility.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { PolicyPaymentsHistoricalComponent } from './policy-payments/policy-payments-historical/policy-payments-historical.component';
import { PolicyPaymentsComponent } from './policy-payments/policy-payments.component';
import { CoreModule } from '../core/core.module';
import { PolicyApplicationComponent } from './policy-application/policy-application/policy-application.component';
import { PolicyApplicationHeaderComponent } from './policy-application/policy-application-header/policy-application-header.component';
import { PolicyApplicationStep1Component } from './policy-application/policy-application-step1/policy-application-step1.component';
import { PolicyApplicationStep2Component } from './policy-application/policy-application-step2/policy-application-step2.component';
import { PolicyApplicationStep3Component } from './policy-application/policy-application-step3/policy-application-step3.component';
import { PolicyApplicationViewComponent } from './policy-application-view/policy-application-view.component';
import { PolicyPaymentsViewReceiptComponent } from './policy-payments/policy-payments-view-receipt/policy-payments-view-receipt.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewPolicyInformationComponent } from './view-policy-information/view-policy-information.component';
import { ViewDetailInformationComponent } from './view-policy-information/view-detail-information/view-detail-information.component';
// tslint:disable-next-line:max-line-length
import { ViewOwnerInformationComponent } from './view-policy-information/view-detail-information/view-owner-information/view-owner-information.component';
// tslint:disable-next-line:max-line-length
import { ViewMembersInformationComponent } from './view-policy-information/view-detail-information/view-members-information/view-members-information.component';
// tslint:disable-next-line:max-line-length
import { ViewDocumentsInformationComponent } from './view-policy-information/view-detail-information/view-documents-information/view-documents-information.component';
import { ViewPolicyCardsComponent } from './view-policy-information/view-detail-information/view-policy-cards/view-policy-cards.component';
import { MemberInformationComponent } from './member-information/member-information.component';
// tslint:disable-next-line:max-line-length
import { PolicyPaymentsWithoutLoggingComponent } from './policy-payments/policy-payments-without-logging/policy-payments-without-logging.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { RatesFormsQuestionariesComponent } from './rates-forms-questionaries/rates-forms-questionaries.component';
import { PolicyChangesComponent } from './policy-changes/policy-changes.component';
import { PolicyChangesStep1Component } from './policy-changes/policy-changes-step1/policy-changes-step1.component';
import { PolicyChangesStep2Component } from './policy-changes/policy-changes-step2/policy-changes-step2.component';
import { PolicyChangesStep2DefaultComponent } from './policy-changes/policy-changes-step2-default/policy-changes-step2-default.component';
import { ChangeAgentSummaryComponent } from './policy-changes/change-agent/change-agent-summary/change-agent-summary.component';
import { ChangeAgentComponent } from './policy-changes/change-agent/change-agent.component';
import { PolicyChangesStep3Component } from './policy-changes/policy-changes-step3/policy-changes-step3.component';
import { PolicyChangesStep3DefaultComponent } from './policy-changes/policy-changes-step3-default/policy-changes-step3-default.component';
import { SearchBenefitsComponent } from './search-benefits/search-benefits.component';
import { SearchBenefitsModalComponent } from './search-benefits/search-benefits-modal/search-benefits-modal.component';
import { ViewRenewalPolicyInformationComponent } from './view-renewal-policy-information/view-renewal-policy-information.component';
import { QuotationComponent } from './quotation/quotation/quotation.component';
import { QuotationStep1Component } from './quotation/quotation-step1/quotation-step1.component';
import { QuotationStep2Component } from './quotation/quotation-step2/quotation-step2.component';
import { QuotationStep3Component } from './quotation/quotation-step3/quotation-step3.component';
import { QuotationRemoveMembersComponent } from './quotation/quotation-remove-members/quotation-remove-members.component';
import { QuotationModifyDeductibleComponent } from './quotation/quotation-modify-deductible/quotation-modify-deductible.component';
import { QuotationStep2DeductiblesComponent } from './quotation/quotation-step2-deductibles/quotation-step2-deductibles.component';
import { PolicyEnrollmentViewComponent } from './policy-enrollment-view/policy-enrollment-view.component';
// tslint:disable-next-line:max-line-length
import { PolicyEnrollmentStep3Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step3/policy-enrollment-step3.component';
// tslint:disable-next-line:max-line-length
import { PolicyEnrollmentStep4Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/policy-enrollment-step4.component';
// tslint:disable-next-line:max-line-length
import { PolicyEnrollmentStep5Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step5/policy-enrollment-step5.component';
import { PolicyEnrollmentComponent } from './policy-enrollment-create/policy-enrollment/policy-enrollment.component';
// tslint:disable-next-line:max-line-length
import { PolicyEnrollmentStep1Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step1/policy-enrollment-step1.component';
// tslint:disable-next-line:max-line-length
import { PolicyEnrollmentStep2Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step2/policy-enrollment-step2.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep2Section1Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step2/policy-enrollment-step2-section1/policy-enrollment-step2-section1.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep2Section2Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step2/policy-enrollment-step2-section2/policy-enrollment-step2-section2.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep2Section3Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step2/policy-enrollment-step2-section3/policy-enrollment-step2-section3.component';
// tslint:disable-next-line:max-line-length
import { FieldErrorDisplayComponent } from './policy-enrollment-create/policy-enrollment-steps/field-error-display/field-error-display.component';
import { BreadcrumbComponent } from './policy-enrollment-create/breadcrumb/breadcrumb.component';
// tslint:disable-next-line: max-line-length
import { MemberComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step3/member/member.component';
// tslint:disable-next-line: max-line-length
import { InfoDependentComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step3/member/info-dependent/info-dependent.component';
// tslint:disable-next-line: max-line-length
import { UnderConstructionComponent } from './policy-enrollment-create/policy-enrollment-steps/under-construction/under-construction.component';
// tslint:disable-next-line: max-line-length
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
import { PolicyEnrollmentStep8Section3Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step8/policy-enrollment-step8-section3/policy-enrollment-step8-section3.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep8Section2Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step8/policy-enrollment-step8-section2/policy-enrollment-step8-section2.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep8Section4Component } from './policy-enrollment-create/policy-enrollment-steps/mex/policy-enrollment-step8/policy-enrollment-step8-section4/policy-enrollment-step8-section4.component';
import { PolicyDocumentsComponent } from './policy-documents/policy-documents.component';
// tslint:disable-next-line: max-line-length
import { InfoContactComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step3/member/info-contact/info-contact.component';
// tslint:disable-next-line: max-line-length
import { InfoAddressComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step3/member/info-address/info-address.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep9Section1Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step9/policy-enrollment-step9-section1/policy-enrollment-step9-section1.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep9Section2Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step9/policy-enrollment-step9-section2/policy-enrollment-step9-section2.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep9Section3Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step9/policy-enrollment-step9-section3/policy-enrollment-step9-section3.component';
import { QuotationStep3CalculatorComponent } from './quotation/quotation-step3-calculator/quotation-step3-calculator.component';
// tslint:disable-next-line: max-line-length
import { PreselectionQuestionsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/preselection-questions/preselection-questions.component';
// tslint:disable-next-line: max-line-length
import { GeneralQuestions1Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/general-questions1/general-questions1.component';
// tslint:disable-next-line: max-line-length
import { GeneralQuestions2Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/general-questions2/general-questions2.component';
// tslint:disable-next-line: max-line-length
import { MedicalHistoryQuestionsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/medical-history-questions/medical-history-questions.component';
// tslint:disable-next-line: max-line-length
import { QuestionsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/shared/questions/questions.component';
// tslint:disable-next-line: max-line-length
import { QuestionComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/shared/question/question.component';
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
import { MenWomenQuestionsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/men-women-questions/men-women-questions.component';
// tslint:disable-next-line: max-line-length
import { GeneralQuestionsDetailsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/shared/question-details/general-questions-details/general-questions-details.component';
// tslint:disable-next-line: max-line-length
import { WomenQuestionDetailsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/shared/question-details/women-question-details/women-question-details.component';
// tslint:disable-next-line: max-line-length
import { MedicalCheckUpDetailsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/shared/question-details/medical-check-up-details/medical-check-up-details.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep10Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/policy-enrollment-step10.component';
// tslint:disable-next-line: max-line-length
import { Section1Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-petitioner/section1/section1.component';
// tslint:disable-next-line: max-line-length
import { Section2Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-petitioner/section2/section2.component';
// tslint:disable-next-line: max-line-length
import { Section3Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-petitioner/section3/section3.component';
// tslint:disable-next-line: max-line-length
import { MoralPetitionerComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/moral-petitioner.component';
// tslint:disable-next-line: max-line-length
import { Section4Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section4/section4.component';
// tslint:disable-next-line: max-line-length
import { PhysicalPetitionerComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-petitioner/physical-petitioner.component';
// tslint:disable-next-line: max-line-length
import { Section1Component as Section1ComponentMoral } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section1/section1.component';
// tslint:disable-next-line: max-line-length
import { Section2Component as Section2ComponentMoral } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section2/section2.component';
// tslint:disable-next-line: max-line-length
import { Section3Component as Section3ComponentMoral } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section3/section3.component';
// tslint:disable-next-line: max-line-length
import { PetitionerContactInformationComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/petitioner-contact-information/petitioner-contact-information.component';
// tslint:disable-next-line: max-line-length
import { PetitionerAddressInformationComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/petitioner-address-information/petitioner-address-information.component';
// tslint:disable-next-line: max-line-length
import { MainOfficersAdvisorsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section4/main-officers-advisors/main-officers-advisors.component';
// tslint:disable-next-line: max-line-length
import { MainSharedholdersComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/moral-petitioner/section4/main-sharedholders/main-sharedholders.component';
// tslint:disable-next-line: max-line-length
import { HabitsDetailsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/shared/question-details/habits-details/habits-details.component';
// tslint:disable-next-line: max-line-length
import { FamilyHistoryDetailsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step4/shared/question-details/family-history-details/family-history-details.component';
// tslint:disable-next-line: max-line-length
import { NavigatorButtonsComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step9/navigator-buttons/navigator-buttons.component';
// tslint:disable-next-line: max-line-length
import { PhysicalOwnerPetitionerComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step10/physical-owner-petitioner/physical-owner-petitioner.component';
import { PolicyEnrollmentInfoComponent } from './policy-enrollment-create/policy-enrollment-info/policy-enrollment-info.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep11Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step11/policy-enrollment-step11.component';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentStep12Component } from './policy-enrollment-create/policy-enrollment-steps/shared/policy-enrollment-step12/policy-enrollment-step12.component';
import { QuotationAddMembersComponent } from './quotation/quotation-add-members/quotation-add-members.component';
import { ModalAddMembersComponent } from './quotation/quotation-add-members/modal-add-members/modal-add-members.component';
import { QuotationEditMembersComponent } from './quotation/quotation-edit-members/quotation-edit-members.component';
import { NewBusinessQuotationComponent } from './quotation/new-business-quotation/new-business-quotation.component';
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
import { IndividualComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/individual/individual.component';
// tslint:disable-next-line: max-line-length
import { ContactEconomicInfoComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/individual/contact-economic-info/contact-economic-info.component';
// tslint:disable-next-line: max-line-length
import { AddressInfoComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/individual/address-info/address-info.component';
import { CompanyComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/company/company.component';
// tslint:disable-next-line: max-line-length
import { GeneralInfoComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/individual/general-info/general-info.component';
// tslint:disable-next-line: max-line-length
import { GeneralInfoCompanyComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/company/general-info-company/general-info-company.component';
// tslint:disable-next-line: max-line-length
import { ContactAddressInfoComponent } from './policy-enrollment-create/policy-enrollment-steps/pan/petitioner/company/contact-address-info/contact-address-info.component';
import { PolicyApplicationMenuComponent } from './policy-application-menu/policy-application-menu.component';
import { SummaryComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/summary/summary.component';
// tslint:disable-next-line: max-line-length
import { ViewPayeeInformationComponent } from './view-policy-information/view-detail-information/view-payee-information/view-payee-information.component';
import { RegisterAccountComponent } from './view-policy-information/view-detail-information/register-account/register-account.component';
// tslint:disable-next-line: max-line-length
import { OffshoreAchComponent } from './view-policy-information/view-detail-information/register-account/offshore-ach/offshore-ach.component';
import { OffshoreWtComponent } from './view-policy-information/view-detail-information/register-account/offshore-wt/offshore-wt.component';
import { OnshoreAchComponent } from './view-policy-information/view-detail-information/register-account/onshore-ach/onshore-ach.component';
// tslint:disable-next-line: max-line-length
import { ViewOffshoreAchComponent } from './view-policy-information/view-detail-information/view-payee-information/view-offshore-ach/view-offshore-ach.component';
// tslint:disable-next-line: max-line-length
import { ViewOffshoreWtComponent } from './view-policy-information/view-detail-information/view-payee-information/view-offshore-wt/view-offshore-wt.component';
// tslint:disable-next-line: max-line-length
import { ViewOnshoreAchComponent } from './view-policy-information/view-detail-information/view-payee-information/view-onshore-ach/view-onshore-ach.component';
// tslint:disable-next-line: max-line-length
import { RegisterSuccessComponent } from './view-policy-information/view-detail-information/register-account/register-success/register-success.component';
import { MaritalStatusComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/marital-status/marital-status.component';
import { WeightHeightComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/weight-height/weight-height.component';
// tslint:disable-next-line: max-line-length
import { WeightHeightBasicComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/weight-height-basic/weight-height-basic.component';
import { GenderComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/gender/gender.component';
import { GenderListComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/gender-list/gender-list.component';
// tslint:disable-next-line: max-line-length
import { MaritalStatusListComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/marital-status-list/marital-status-list.component';
// tslint:disable-next-line: max-line-length
import { MaritalStatusListToFormArrayComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/marital-status-list-to-form-array/marital-status-list-to-form-array.component';
// tslint:disable-next-line: max-line-length
import { GenderListToFormArrayComponent } from './policy-enrollment-create/policy-enrollment-steps/shared/gender-list-to-form-array/gender-list-to-form-array.component';
import { ViewTaxInformationComponent } from './view-policy-information/view-detail-information/view-tax-information/view-tax-information.component';
import { FaqTaxInformationComponent } from './view-policy-information/view-detail-information/view-tax-information/FAQ/faq-tax-information/faq-tax-information.component';
import { QuestionTaxInformationComponent } from './view-policy-information/view-detail-information/view-tax-information/FAQ/question-tax-information/question-tax-information.component';

@NgModule({
  imports: [
    CommonModule,
    PolicyRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SecurityModule,
    TranslateModule,
    NgbModule,
    CoreModule,
    SharedModule,
    NgSelectModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule
  ],
  declarations: [
    MemberElegibilityComponent,
    MemberVerificationEligibilityComponent,
    PolicyPaymentsComponent,
    PolicyPaymentsHistoricalComponent,
    PolicyApplicationComponent,
    PolicyApplicationHeaderComponent,
    PolicyApplicationStep1Component,
    PolicyApplicationStep2Component,
    PolicyApplicationStep3Component,
    PolicyApplicationViewComponent,
    PolicyPaymentsViewReceiptComponent,
    ViewPolicyInformationComponent,
    ViewDetailInformationComponent,
    ViewOwnerInformationComponent,
    ViewMembersInformationComponent,
    ViewDocumentsInformationComponent,
    ViewPolicyCardsComponent,
    MemberInformationComponent,
    PolicyPaymentsWithoutLoggingComponent,
    RatesFormsQuestionariesComponent,
    PolicyChangesComponent,
    PolicyChangesStep1Component,
    PolicyChangesStep2Component,
    PolicyChangesStep2DefaultComponent,
    PolicyChangesStep3Component,
    ChangeAgentComponent,
    ChangeAgentSummaryComponent,
    PolicyChangesStep3DefaultComponent,
    SearchBenefitsComponent,
    SearchBenefitsModalComponent,
    ViewRenewalPolicyInformationComponent,
    QuotationComponent,
    QuotationStep1Component,
    QuotationStep2Component,
    QuotationStep3Component,
    QuotationRemoveMembersComponent,
    PolicyEnrollmentViewComponent,
    PolicyEnrollmentStep1Component,
    PolicyEnrollmentStep2Component,
    PolicyEnrollmentStep3Component,
    MemberComponent,
    InfoDependentComponent,
    PolicyEnrollmentStep4Component,
    PolicyEnrollmentStep5Component,
    PolicyEnrollmentComponent,
    PolicyEnrollmentStep2Section1Component,
    PolicyEnrollmentStep2Section2Component,
    PolicyEnrollmentStep2Section3Component,
    BreadcrumbComponent,
    FieldErrorDisplayComponent,
    QuotationRemoveMembersComponent,
    QuotationModifyDeductibleComponent,
    QuotationStep2DeductiblesComponent,
    UnderConstructionComponent,
    PolicyEnrollmentStep6Component,
    PolicyEnrollmentStep7Component,
    PolicyEnrollmentStep8Component,
    PolicyEnrollmentStep9Component,
    PolicyEnrollmentStep8Section1Component,
    PolicyEnrollmentStep8Section3Component,
    PolicyEnrollmentStep8Section2Component,
    PolicyEnrollmentStep8Section4Component,
    PolicyDocumentsComponent,
    InfoContactComponent,
    InfoAddressComponent,
    PolicyEnrollmentStep9Component,
    QuotationStep3CalculatorComponent,
    PolicyEnrollmentStep10Component,
    Section1Component,
    Section2Component,
    Section3Component,
    MoralPetitionerComponent,
    Section4Component,
    PhysicalPetitionerComponent,
    PetitionerContactInformationComponent,
    PetitionerAddressInformationComponent,
    MainOfficersAdvisorsComponent,
    MainSharedholdersComponent,
    PolicyEnrollmentStep10Component,
    Section1Component,
    Section2Component,
    Section3Component,
    MoralPetitionerComponent,
    Section4Component,
    PhysicalPetitionerComponent,
    Section1ComponentMoral,
    Section2ComponentMoral,
    Section3ComponentMoral,
    PetitionerContactInformationComponent,
    PetitionerAddressInformationComponent,
    MainOfficersAdvisorsComponent,
    MainSharedholdersComponent,
    QuotationStep3CalculatorComponent,
    PreselectionQuestionsComponent,
    GeneralQuestions1Component,
    GeneralQuestions2Component,
    MedicalHistoryQuestionsComponent,
    QuestionsComponent,
    QuestionComponent,
    MenWomenQuestionsComponent,
    GeneralQuestionsDetailsComponent,
    WomenQuestionDetailsComponent,
    MedicalCheckUpDetailsComponent,
    HabitsDetailsComponent,
    FamilyHistoryDetailsComponent,
    QuotationStep3CalculatorComponent,
    PolicyEnrollmentStep8Section4Component,
    PolicyEnrollmentStep9Section1Component,
    PolicyEnrollmentStep9Section2Component,
    PolicyEnrollmentStep9Section3Component,
    NavigatorButtonsComponent,
    PhysicalOwnerPetitionerComponent,
    PolicyEnrollmentInfoComponent,
    PolicyEnrollmentStep11Component,
    PolicyEnrollmentStep12Component,
    QuotationAddMembersComponent,
    ModalAddMembersComponent,
    QuotationEditMembersComponent,
    NewBusinessQuotationComponent,
    HolderAdditionalDataComponent,
    HolderAddressesComponent,
    HolderOtherAddressesComponent,
    ConsentsComponent,
    ConSection1Component,
    ConSection2Component,
    ConSection3Component,
    ConSection4Component,
    IntroductionComponent,
    PetitionerComponent,
    ApplicationSummaryComponent,
    SignAndAttachDocsComponent,
    PaymentInfoComponent,
    IndividualComponent,
    ContactEconomicInfoComponent,
    AddressInfoComponent,
    CompanyComponent,
    GeneralInfoComponent,
    GeneralInfoCompanyComponent,
    ContactAddressInfoComponent,
    PolicyApplicationMenuComponent,
    SummaryComponent,
    ViewPayeeInformationComponent,
    RegisterAccountComponent,
    OffshoreAchComponent,
    OffshoreWtComponent,
    OnshoreAchComponent,
    ViewOffshoreAchComponent,
    ViewOffshoreWtComponent,
    ViewOnshoreAchComponent,
    RegisterSuccessComponent,
    MaritalStatusComponent,
    WeightHeightComponent,
    WeightHeightBasicComponent,
    GenderComponent,
    GenderListComponent,
    MaritalStatusListComponent,
    MaritalStatusListToFormArrayComponent,
    GenderListToFormArrayComponent,
    ViewTaxInformationComponent,
    FaqTaxInformationComponent,
    QuestionTaxInformationComponent
  ],
  exports: [
    MemberElegibilityComponent,
    SearchBenefitsModalComponent
  ]
})
export class PolicyModule { }
