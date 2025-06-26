import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { HttpClient } from '@angular/common/http';
/**
* claim-submission-wizardService.ts
*
* @description: This class interacts with ClaimUpdateWizardService API.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 09-10-2018.
*
**/

import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from '../common/common.service';
import { AuthService } from '../../../security/services/auth/auth.service';
import { ClaimUpdateWizard } from './entities/claim-update-wizard';
import { ClaimUpdateModel } from './entities/claim-update.model';
import { HttpParams } from '@angular/common/http';

/**
 * This class interacts with ClaimUpdateWizardService API.
 */
@Injectable({
  providedIn: 'root'
})
export class ClaimUpdateWizardService {

  public claim: any;

  /**
   * ClaimUpdateWizard Object
   */
  private claimUpdate: ClaimUpdateWizard;

  /**
   * Constant for default datetime value
   */
  private DOCUMENTS = 'documents';

  /**
   * Constructor Method
   */
  constructor(
    private http: HttpClient,
    private config: ConfigurationService) {
  }

  /**
   * Create a new claim submission.
   */
  public newClaimUpdate() {
    this.claimUpdate = {
      documents: [],
      folderName: '',
      claimGuid: '',
      statusGuid: '',
      claimUpdateModel: null
    };
    return this.claimUpdate;
  }

  buildClaimUpdate() {
    this.claimUpdate.claimUpdateModel = this.getInitialClaimUpdate();
    for (const fileDocument of this.claimUpdate.documents) {
      this.claimUpdate.claimUpdateModel.documents.push(
        {
          documentName: fileDocument.file.name,
          folderName: this.claimUpdate.folderName
        }
      );
    }
  }

  /**
   * Get initial object for claim submission proccess
   * @param user User
   */
  getInitialClaimUpdate(): ClaimUpdateModel {
    return {
      // claimSubmissionGuid: this.claimSubmission.claimGuid,
      claimDetailId: this.claim.claimDetailId,
      openClaim: true,
      documents: [],
      insuranceBusinessId: this.claim.insuranceBusinessId,
      policyId: this.claim.policy.policyId,
      memberId: this.claim.member.memberId,
      memberFirstName: this.claim.member.firstName,
      memberLastName: this.claim.member.lastName,
      headerId: this.claim.claimNumber,
      isGroupPolicy: this.claim.policy.isGroupPolicy,
      groupId: this.claim.policy.groupId
    };
  }

  submit(claim: ClaimUpdateModel, lang: string) {
    const params  = new HttpParams()
    .set('lang', lang);
    return this.http.patch(`${this.config.apiHostClaims}/claims?lang=${lang}`, claim, { params });
  }

}

