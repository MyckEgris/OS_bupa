import { FormGroup } from '@angular/forms';
import { ProviderOutputDto } from 'src/app/shared/services/provider/entities/provider.dto';
import { Country } from 'src/app/shared/services/common/entities/country';
import { City } from 'src/app/shared/services/common/entities/city';
import { DiagnosticDto } from 'src/app/shared/services/common/entities/diagnostic.dto';
import { ProcedureDto } from 'src/app/shared/services/common/entities/procedure.dto';
import { RequestTypeDto } from 'src/app/shared/services/claim/pre-authorization/entities/request-type.dto';
import { ServiceTypeDto } from 'src/app/shared/services/claim/pre-authorization/entities/service-type.dto';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { getTreeControlFunctionsMissingError } from '@angular/cdk/tree';

/****
 * DTO Pre-Authorization wizard
 */
export interface PreAuthorizationWizard {

  /***
   * Form step 1
   */
  preAuthForm: FormGroup;

  currentStep: number;

  /**
 * member: ClaimSubmissionMember
 * Member selected for create pre authorization
 */
  member: MemberOutputDto;

  /***
   * country: Country
   * Country seleted for create pre authorization
   */
  country: Country;

  /****
   * city: City
   * City seleted for create pre authorization
   */
  city: City;

  /***
   * listDiagnosticSelected: DiagnosticDto[]
   * List diagnostic seleted for create pre-authorization
   */
  listDiagnosticSelected: DiagnosticDto[];

  /***
   * listProcedureSelected: ProcedureDto[]
   * List procedures seleted for create pre-authorization
   */
  listProcedureSelected: ProcedureDto[];

  /***
   * Type of event causing the Insured to request medical service authorization
   */
  requestType: RequestTypeDto;

  /***
   * Medical service requested by the insured
   * ServiceType
   */
  serviceType: ServiceTypeDto;

  /***
    * List of attachments for created preauthorization
    */
  documents: FileDocument[];

  /***
   * When the user is PolicyHolder or GroupPolicyHolder the member id must be stored to create preauthorization
   */
  holderMemberId: number;

  /**
 * memberSearch: MemberOutputDto[]
 * List member associated to policy
 */
  memberSearch: MemberOutputDto[];

  /**
   * When user authenticated is provider
   */
  taxNumber: number;

  /***
   * Object Policy
   */
  policyDto: PolicyDto;

  /**
   * Provider Select
   */
  associatedProvider: ProviderOutputDto;

  /***
   * List provider associated with the userKey (Only for Provider Authenticated)
   */
  lstAssociatedProvider: ProviderOutputDto[];

  /**
   * Provider in Session Authenticated.
   */
  providerInSession: ProviderOutputDto;
}
