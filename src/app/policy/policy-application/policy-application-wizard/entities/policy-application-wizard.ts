import { FileDocument } from './../../../../shared/upload/dialog/fileDocument';
import { PolicyApplicationModel } from './../../../../shared/services/policy-application/entities/policy-application-model';
import { FormGroup, FormArray } from '@angular/forms';
/**
 * DTO claim submission wizard
 */
export interface PolicyApplicationWizard {

  /**
   * currentStep
   */
  currentStep: number;

  languageId: number;

  language: string;

  insuranceBusinessId: number;

  policyId: string;

  agentId: number;

  agent: string;

  process: string;

  businessInsuranceId: number;

  businessInsurance: string;

  countryId: number;

  countryName: string;

  cityId: number;

  cityName: string;

  productId: number;

  productName: string;

  planId: number;

  planName: string;

  policyForm: FormGroup;

  policyApplication: PolicyApplicationModel;

  /**
   * documents: FileDocument[]
   */
  documents: FileDocument[];

  rulesFormArray?: FormArray;

  folderNameByCategory: Array<any>;

  /**
   * folderName
   */
  folderName: string;

  /**
   * claimGuid
   */
  policyApplicationGuid: string;


  phoneGuid: string;

  emailGuid: string;

  memberGuid: string;

  /**

  /**
   * statusGuid
   */
  statusGuid: string;

  /**
   * user: UserInformationModel
   */
  // user: UserInformationModel;
}
