import { Injectable } from '@angular/core';
import { PolicyChangesWizard } from './entities/policy-changes-wizard';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subject, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { UpdatePolicyRequestDto } from 'src/app/shared/services/policy/entities/updatePolicyRequest.dto';
import { UploadResponse } from 'src/app/shared/services/common/entities/uploadReponse';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { DocumentOutputDto } from 'src/app/shared/services/policy/entities/documents.dto';
import { PolicyChangesDto } from 'src/app/shared/services/common/entities/policy-changes.dto';
import { UploadService } from 'src/app/shared/upload/upload.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyChangesWizardService {

  private user: UserInformationModel;

  private policyChangesSubject: Subject<PolicyChangesWizard>;

  private policyChanges: PolicyChangesWizard;

  constructor(
    private uploadService: UploadService
  ) {
    this.policyChangesSubject = new Subject<PolicyChangesWizard>();
  }

  /**
   *  Initiate Policy Changes wizard.
   * @fn subscription function
   */
  beginPolicyChangesWizardServiceWizard(fn, user, step?: number): Subscription {
    this.user = user;
    const subscription = this.policyChangesSubject.subscribe(fn);
    if (!this.policyChanges) {
      this.newPolicyChanges(user);
    }
    if (step) {
      this.policyChanges.currentStep = step;
    }
    this.next();
    return subscription;
  }

  /***
   * Initiate Policy Changes wizard.
   */
  newPolicyChanges(user: UserInformationModel) {
    this.policyChanges = {
      currentStep: 0,
      policy: null,
      holderMemberId: null,
      policyChange: null,
      documents: null,
      listPolicyChanges: null,
      newAgent: { agentId: 0, agentName: '' },
      policyChangesForm: this.createFormDefault()
    };
  }

  createFormDefault(): FormGroup {
    return new FormGroup({
      step1: new FormGroup({
        policyNumber: new FormControl('', [Validators.required]),
        policyChange: new FormControl(null, [Validators.required])
      }),
      step2: new FormGroup({
        description: new FormControl('', [Validators.required])
      })
    });
  }

  /**
   * Close the wizard of preAuthorization
   */
  endPolicyChangesWizard(user) {
    this.newPolicyChanges(user);
    this.uploadService.removeAllDocuments();
    this.next();
  }

  /**
     * Send parameters to subscriptors
     */
  private next() {
    this.policyChangesSubject.next(this.policyChanges);
  }

  buildUpdatePolicyRequestDto(listUrlDoc: UploadResponse[],
    languajeId: number, policy: PolicyDto, description: string,
    policyChange: PolicyChangesDto, newAgent: { agentId: number; agentName: string }): UpdatePolicyRequestDto {
    policy.documents = this.buildDocumentsDto(listUrlDoc, policy.policyId);
    if (newAgent) {
      policy.agent.agentId = newAgent.agentId;
      policy.agent.agentName = newAgent.agentName;
    }
    return {
      policy: policy,
      changeMetadata: {
        policyChangeType: {
          processId: policyChange.processId,
          processOptionId: policyChange.processOptionId,
          processOptionName: policyChange.processOptionName,
          descriptionByLanguage: [{
            languageId: languajeId,
            processOptionDescription: policyChange.description,
            processOptionByLanguageId: languajeId,
            processOptionId: policyChange.processOptionId.toString()
          }]
        },
        languageId: languajeId,
        description: description,
        effectiveDate: new Date(),
      }
    };
  }

  buildDocumentsDto(listUrlDoc: UploadResponse[], policyId: number): DocumentOutputDto[] {
    const documents: DocumentOutputDto[] = [];
    listUrlDoc.forEach(
      doc => {
        documents.push({
          documentLanguage: null,
          documentPath: `/${doc.folderName}/${doc.aliasFileName}`,
          documentType: null,
          eligibilityDate: null,
          policyId: policyId,
          lastSentDate: null
        });
      }
    );
    return documents;
  }

}
