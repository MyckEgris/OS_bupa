import { FormGroup } from '@angular/forms';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { PolicyChangesDto } from 'src/app/shared/services/common/entities/policy-changes.dto';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { Agent } from 'src/app/shared/services/agent/entities/agent';

export interface PolicyChangesWizard {

  /***
   * Form step 1
   */
  policyChangesForm: FormGroup;

  currentStep: number;

  /**
   * policyDto: PolicyDto
   * Policy selected for create policy changes
   */
  policy: PolicyDto;

  holderMemberId: number;

  policyChange: PolicyChangesDto;

  newAgent: { agentId: number; agentName: string};

  /***
   * List of attachments for created policy changes
   */
  documents: FileDocument[];

  listPolicyChanges: PolicyChangesDto[];
}
