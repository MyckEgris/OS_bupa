import { Injectable } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyApplicationService } from '../policy-application/policy-application.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../notification/notification.service';
import { PolicyService } from '../policy/policy.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ActionsEnrollmentViewService {

  private user: UserInformationModel;
  private ELECTRONIC_APPLICATION = 'ElectronicApplication';
      /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;
  constructor(
    private authService: AuthService,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService,
    private policyService: PolicyService,
    private router: Router) {
      this.user = this.authService.getUser();
    }

  edit(applicationId): string {
    this.saveIntoLocalStorage(applicationId);
    return `/policies/create-policy-enrollment-${this.user.bupa_insurance}`;
  }

  uploadDocs(applicationId): string {
    this.saveIntoLocalStorage(applicationId);
    return `/policies/create-policy-enrollment-${this.user.bupa_insurance}/sign-and-attach-docs`;
  }

  capturePaymentInfo(applicationId): string {
    this.saveIntoLocalStorage(applicationId);
    return `/policies/create-policy-enrollment-${this.user.bupa_insurance}/payment-info`;
  }

  downloadPdf(applicationId): string {
    this.saveIntoLocalStorage(applicationId);
    return `/policies/create-policy-enrollment-${this.user.bupa_insurance}/summary`;
  }

  saveIntoLocalStorage(applicationId) {
    const appId = btoa(applicationId);
    localStorage.setItem('applicationId', appId);
    localStorage.setItem('mode', 'Edit');
  }

  getStatusEdit(process, status, policyId): boolean {
    return (((process === this.ELECTRONIC_APPLICATION && status === 'PendingInformation')
      || (process === this.ELECTRONIC_APPLICATION && status === 'ReadyToUploadDocs')
      || (process === this.ELECTRONIC_APPLICATION && status === 'Clean')
      || (process === this.ELECTRONIC_APPLICATION && status === 'NotClean')
      || (process === this.ELECTRONIC_APPLICATION && status === 'NotApplicable')) && !policyId);
  }

  getStatusUploadDocs(process, status): boolean {
    return (process === this.ELECTRONIC_APPLICATION && status === 'ReadyToUploadDocs');
  }

  getStatusDownloadDocs(process, status, policyId): boolean {
    return (process === this.ELECTRONIC_APPLICATION && policyId) ? true : false;
    // return (((process === 'ElectronicApplication' && status === 'NewClean') ||
    //  (process === 'ElectronicApplication' && status === 'New') ||
    //  (process === 'ElectronicApplication' && status === 'IN_PROCESS')) &&
    //  policyId);
  }

  getStatusPaymentInfo(process, status): boolean {
    return ((process === this.ELECTRONIC_APPLICATION && status === 'Clean')
      || (process === this.ELECTRONIC_APPLICATION && status === 'NotClean'));
  }

    /**
   * downloads the documents the user select on the screen
   * @param doc Document object.
   */
  downloadFile(applicationGuid: string, applicationId: number, status: string) {
    const peticion = this.policyApplicationService.generatePolicyApplicationPdf(applicationGuid,
      applicationId, status,
      this.user.language, 'false');
    peticion.subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      saveAs(blob, String(applicationId));
    }, error => {
      this.showNotFoundDocument(error);
    }
    );
  }
      /**
   * Shows the message when the Item was not found.
   * @param error Http Error message.
   */
  showNotFoundDocument(error: HttpErrorResponse) {
    if (error.error === '404') {
      let message = '';
      let messageTitle = '';
      this.translate.get(`POLICY.ERROR.ERROR_CODE.404`).subscribe(
        result => messageTitle = result
      );
      this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.404`).subscribe(
        result => message = result
      );
      this.notification.showDialog(messageTitle, message);
    }
  }

  showPolicyDetail(policyId: string) {
    this.policyService.getAllPoliciesByPolicyId(this.user.role_id, this.user.user_key, +policyId)
    .subscribe(
      data => {
        return this.router.navigate([`/policies/view-policy-information/${policyId}`]);
      },
      error => {
        this.handlePolicyError(error);
      });
  }

      /***
    * handles Policy Error
    */
  private handlePolicyError(error: any) {
    if (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND) {
      this.showMessageForPolicyDetailNotFound();
    } else if (this.checksIfHadBusinessError(error)) {
      this.showErrorMessage(error);
    }
  }

  /**
    * Check if response has error code to show business exception
    * @param error Http Error
    */
  private checksIfHadBusinessError(error) {
    return error.error.code;
  }

  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`POLICY.ERROR.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  private showMessageForPolicyDetailNotFound() {
    let message = '';
    let messageTitle = '';
    this.translate.get('POLICY.APPLICATION.POLICY_ENROLLMENT_VIEW.MSG_POLICY_NOT_FOUND').subscribe(
      result => message = result
    );
    this.translate.get('POLICY.APPLICATION.POLICY_ENROLLMENT_VIEW.TITLE_POLICY_NOT_FOUND').subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

}
