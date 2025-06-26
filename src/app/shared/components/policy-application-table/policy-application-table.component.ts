import { Component, OnInit, Input } from '@angular/core';
import { PolicyApplicationResponse } from '../../services/policy-application/entities/policy-application-response.dto';
import { ActionsEnrollmentViewService } from '../../services/policy-enrollment/actions-enrollment-view.service';
import { Router } from '@angular/router';
import { PolicyService } from '../../services/policy/policy.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification/notification.service';
@Component({
  selector: 'app-policy-application-table',
  templateUrl: './policy-application-table.component.html'
})
export class PolicyApplicationTableComponent implements OnInit {

  /**
  * PolicyApplication Dto object
  */
  private _policyAplication: PolicyApplicationResponse = { totalCount: 0, pageindex: 1, pageSize: 0, policyApplications: [] };
  /**
  * Stores the logged user information
  */
  private _user: UserInformationModel;
    /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  constructor(private actionsEnrollmentViewService: ActionsEnrollmentViewService,
    private router: Router,
    private policyService: PolicyService,
    private translate: TranslateService,
    private notification: NotificationService) { }

  ngOnInit() {
  }

  @Input()
  set policyAplication(value: PolicyApplicationResponse) {
    this._policyAplication = value;
  }

  get policyAplication(): PolicyApplicationResponse {
    return this._policyAplication;
  }

  @Input()
  set user(user: UserInformationModel) {
    this._user = user;
  }

  get user(): UserInformationModel {
    return this._user;
  }

  edit(applicationId) {
    this.router.navigate([this.actionsEnrollmentViewService.edit(applicationId)]);
  }

  uploadDocs(applicationId) {
    this.router.navigate([this.actionsEnrollmentViewService.uploadDocs(applicationId)]);
  }

  capturePaymentInfo(applicationId) {
    this.router.navigate([this.actionsEnrollmentViewService.capturePaymentInfo(applicationId)]);
  }

  getStatusEdit(process, status, policyId): boolean {
    return this.actionsEnrollmentViewService.getStatusEdit(process, status, policyId);
  }

  getStatusUploadDocs(process, status): boolean {
    return this.actionsEnrollmentViewService.getStatusUploadDocs(process, status);
  }

  getStatusDownloadDocs(process, status, policyId): boolean {
    return this.actionsEnrollmentViewService.getStatusDownloadDocs(process, status, policyId);
  }

  getStatusPaymentInfo(process, status): boolean {
    return this.actionsEnrollmentViewService.getStatusPaymentInfo(process, status);
  }

  downloadFile(applicationGuid: string, applicationId: number, status: string) {
    this.actionsEnrollmentViewService.downloadFile(applicationGuid, applicationId, status);
  }

  showPolicyDetail(policyId: string) {
    this.actionsEnrollmentViewService.showPolicyDetail(policyId);
  }

}
