import { Injectable } from '@angular/core';
import { PolicyEnrollmentWizard } from '../entities/policy-enrollment-wizard';
import { CreditCard } from 'src/app/shared/services/policy-application/entities/credit-card';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PolicyEnrollmentTransformPaymentDetailsService {
  private policyEnrollment: PolicyEnrollmentWizard;
  constructor() { }

  public transformDataFormToModel(policyEnrollment: PolicyEnrollmentWizard) {
    this.policyEnrollment = policyEnrollment;
    const modeOfPayment = this.getControl('policyApplicationPayments', 'policyAppPaymentsHome', 'paymentMode').value;
    const paymentMethod = this.getControl('policyApplicationPayments', 'policyAppPaymentsHome', 'paymentMethod').value;
    const paymentMehodIn = Number(paymentMethod.id);
    this.policyEnrollment.policyApplicationModel.paymentMethodId = paymentMethod.id;
    this.policyEnrollment.policyApplicationModel.paymentMethod = paymentMethod.englishName;
    this.policyEnrollment.policyApplicationModel.modeOfPaymentId = Number(modeOfPayment.id);
    this.policyEnrollment.policyApplicationModel.modeOfPayment = modeOfPayment.name;

    if (paymentMehodIn === 1) {
      const creditCardInfo: CreditCard = {
        applicationCreditCardGuid: this.getNewGuid(),
        applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
        creditCardNumber: this.getControl('policyApplicationPayments', 'policyAppPaymentsCreditCard1', 'cardNumber').value,
        creditCardTypeId: this.getControl('policyApplicationPayments', 'policyAppPaymentsCreditCard1', 'creditCardType').value.id,
        expirationMonth: Number(this.getControl('policyApplicationPayments', 'policyAppPaymentsCreditCard1', 'monthExpiration').value),
        expirationYear: Number(this.getControl('policyApplicationPayments', 'policyAppPaymentsCreditCard1', 'yearExpiration').value),
        securityCode: this.getControl('policyApplicationPayments', 'policyAppPaymentsCreditCard1', 'securityCode').value,
        cardHolderName: this.getControl('policyApplicationPayments', 'policyAppPaymentsCreditCard1', 'fullName').value,
        cardHolderAddress: this.getControl('policyApplicationPayments', 'policyAppPaymentsCreditCard1', 'cardHolderDirection').value,
        cardHolderEmail: this.getControl('policyApplicationPayments', 'policyAppPaymentsCreditCard1', 'email').value,
        relationTypeId: Number(this.getControl('policyApplicationPayments', 'policyAppPaymentsCreditCard2', 'relationship').value),
      };
      this.policyEnrollment.policyApplicationModel.creditCard = creditCardInfo;
    }
  }

  private getNewGuid(): string {
    if (this.policyEnrollment.applicationGuids.length > 0) {
      const guidToReturn = this.policyEnrollment.applicationGuids[this.policyEnrollment.applicationGuids.length - 1];
      this.policyEnrollment.applicationGuids.splice(this.policyEnrollment.applicationGuids.indexOf(guidToReturn), 1);
      return guidToReturn;
    }
    return '';
  }

    /**
   * Get nested form controls.
   */
  private getControl(step: string, section: string, field: string): FormControl {
    return this.policyEnrollment.enrollmentForm.get(step).get(section).get(field) as FormControl;
  }
}
