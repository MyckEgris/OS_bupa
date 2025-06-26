import { Component, OnInit, Input } from '@angular/core';
import { PolicyApplicationResponse } from '../../services/policy-application/entities/policy-application-response.dto';
import { Router } from '@angular/router';
import { ActionsEnrollmentViewService } from '../../services/policy-enrollment/actions-enrollment-view.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
@Component({
  selector: 'app-policy-application-cards',
  templateUrl: './policy-application-cards.component.html'
})
export class PolicyApplicationCardsComponent implements OnInit {

  /**
  * PolicyApplication Dto object
  */
  private _policyAplication: PolicyApplicationResponse = { totalCount: 0, pageindex: 1, pageSize: 0, policyApplications: [] };
  /**
  * Stores the logged user information
  */
 private _user: UserInformationModel;
  constructor(private actionsEnrollmentViewService: ActionsEnrollmentViewService,
    private router: Router) { }

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
