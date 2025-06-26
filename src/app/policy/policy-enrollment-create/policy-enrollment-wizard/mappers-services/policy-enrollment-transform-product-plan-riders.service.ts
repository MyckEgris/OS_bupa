import { Injectable } from '@angular/core';
import { PolicyEnrollmentWizard } from '../entities/policy-enrollment-wizard';
import { FormControl } from '@angular/forms';
import { Rider } from 'src/app/shared/services/policy-application/entities/rider';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { ContactTypes } from 'src/app/shared/services/policy-application/constants/contact-types.enum';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { ModePayment } from 'src/app/shared/services/common/entities/modePayment';
@Injectable({
  providedIn: 'root'
})
export class PolicyEnrollmentTransformProductPlanRidersService {

  private policyEnrollment: PolicyEnrollmentWizard;

    /***
   * Const to Identify the nested FormGroup policyApplicationProductsAndPlans
   */
  public PRODANDPLAN_STEP = 'policyApplicationProductsAndPlans';

  /***
   * Const to Identify the nested FormGroup policyAppProductsAndPlans
   */
  public PRODANDPLAN_SECTION = 'policyAppProductsAndPlans';

  /***
   * Const to Identify the nested FormControl planProduct
   */
  public PRODUCT_CTRL = 'planProduct';
  /***
   * Const to Identify the nested FormControl planDeductible
   */
  public DEDUCT_CTRL = 'planDeductible';
  /***
   * Const to Identify the nested FormControl planAdditionalCoverages
   */
  public ADDCOVER_CTRL = 'planAdditionalCoverages';
  PAYMENT_MODE = 'modeOfPaymentId';
  constructor() { }

  public transformDataFormToModel(policyEnrollment: PolicyEnrollmentWizard) {
    this.policyEnrollment = policyEnrollment;
    const modeOfPayment: ModePayment = this.getControl(this.PRODANDPLAN_STEP, this.PRODANDPLAN_SECTION, this.PAYMENT_MODE).value;
    this.policyEnrollment.policyApplicationModel.modeOfPaymentId = +modeOfPayment.id;
    this.policyEnrollment.policyApplicationModel.modeOfPayment = modeOfPayment.name;
    this.enrichPolicyApplicationModelWithProductAndPlanData();
    this.enrichPolicyApplicationModelWithRidersData();
  }

  private enrichPolicyApplicationModelWithProductAndPlanData() {
    const prod = this.getControl(this.PRODANDPLAN_STEP, this.PRODANDPLAN_SECTION, this.PRODUCT_CTRL).value;
    if (prod) {
      this.policyEnrollment.policyApplicationModel.productId = prod.id;
      this.policyEnrollment.policyApplicationModel.product = prod.name;
    }
    const plan = this.getControl(this.PRODANDPLAN_STEP, this.PRODANDPLAN_SECTION, this.DEDUCT_CTRL).value;
    if (plan) {
      this.policyEnrollment.policyApplicationModel.planId = plan.planId;
      this.policyEnrollment.policyApplicationModel.plan = plan.planDescription;
    }
    const countryId = this.getCountryIdFromOwner();
    if (countryId) {
      this.policyEnrollment.policyApplicationModel.countryId = countryId;
    }
    const cityId = this.getCityIdFromOwner();
    if (cityId) {
      this.policyEnrollment.policyApplicationModel.cityId = cityId;
    }
  }

    /**
   * Get Country Id from Owner.
   * @returns CountryId from Owner.
   */
  private getCountryIdFromOwner(): number {
    if (this.policyEnrollment && this.policyEnrollment.policyApplicationModel) {
      const member: Member = this.policyEnrollment.policyApplicationModel.members
        .find(memberFind => memberFind.relationTypeId === RelationType.OWNER);
      if (member) {
        const address: Address = this.policyEnrollment.policyApplicationModel.addresses
          .find(addressInFind => addressInFind.contactGuid === member.applicationMemberGuid
            && addressInFind.contactType === ContactTypes.MEMBER);
        if (address) {
          return address.countryId;
        }
      }
    }
    return 0;
  }

    /**
   * Get Country Id from Owner.
   * @returns City from Owner.
   */
  private getCityIdFromOwner(): number {
    if (this.policyEnrollment && this.policyEnrollment.policyApplicationModel) {
      const member: Member = this.policyEnrollment.policyApplicationModel.members
        .find(memberFind => memberFind.relationTypeId === RelationType.OWNER);
      if (member) {
        const address: Address = this.policyEnrollment.policyApplicationModel.addresses
          .find(addressInFind => addressInFind.contactGuid === member.applicationMemberGuid
            && addressInFind.contactType === ContactTypes.MEMBER);
        if (address) {
          return address.cityId;
        }
      }
    }
    return 0;
  }


  private enrichPolicyApplicationModelWithRidersData() {
    const modelRiders: Rider[] = [];
    const formRiders = this.getControl(
      this.PRODANDPLAN_STEP, this.PRODANDPLAN_SECTION, this.ADDCOVER_CTRL).value;
    if (formRiders && formRiders.length > 0) {
      formRiders.forEach(element => {
        const rider: Rider = {
          riderId: element.riderId,
          rider: element.spanishDescription,
          applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
          applicationRiderGuid: this.getNewGuid()
        };
        modelRiders.push(rider);
      });
      this.policyEnrollment.policyApplicationModel.riders = modelRiders;
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
