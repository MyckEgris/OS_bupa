import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { MenuOptionService } from 'src/app/security/services/menu-option/menu-option.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { PayeeDto } from 'src/app/shared/services/finance/entities/payee.dto';
import { FinanceService } from 'src/app/shared/services/finance/finance.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { SearchMemberTypeConstants } from 'src/app/shared/services/policy/constants/policy-search-member-type-constants';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { RoleService } from 'src/app/shared/services/roles/role.service';
import { RegisterAccountService } from '../register-account/register-service/register-account.service';

@Component({
  selector: 'app-view-payee-information',
  templateUrl: './view-payee-information.component.html'
})
export class ViewPayeeInformationComponent implements OnInit {

  @Input() payees: any;
  @Input() policy: any;

  payeeInformation: PayeeDto;

  user: UserInformationModel;

  offshoreAch = false;

  offshoreWt = false;

  onshoreAch = false;

  canDeactivateAccount: any;

  canRegisterAccount: any;

  members: Array<any>;

  private PAYEE_USA = 98;

  constructor(
    private registerService: RegisterAccountService,
    private router: Router,
    private policyService: PolicyService,
    private notification: NotificationService,
    private translate: TranslateService,
    private finance: FinanceService,
    private menuOption: MenuOptionService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUser();
    this.getMenuOptions();
    this.getPayeeInformation();
    this.getActiveMembersByPolicy();
  }

  loadUser() {
    this.user = this.authService.getUser();
  }

  getPayeeInformation() {
    if (this.payees && this.payees.payees) {
      this.payeeInformation = this.payees.payees[0];
    }

    this.resolvePayeeInformationViewer();
  }

  resolvePayeeInformationViewer() {
    if (this.payeeInformation) {
      this.onshoreAch = this.policy.insuranceBusinessIsOnShore;
      this.offshoreAch = !this.policy.insuranceBusinessIsOnShore && (this.payeeInformation.accountCountryId === this.PAYEE_USA);
      this.offshoreWt = !this.policy.insuranceBusinessIsOnShore && (this.payeeInformation.accountCountryId !== this.PAYEE_USA);
    } else {
      this.offshoreAch = true;
    }

  }

  async deactivateAccount() {
    const title = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.DEACTIVATE.TITLE').toPromise();
    const text = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.DEACTIVATE.TEXT').toPromise();
    const ok = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.DEACTIVATE.OK').toPromise();
    const cancel = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.DEACTIVATE.CANCEL').toPromise();
    // tslint:disable-next-line: max-line-length
    const success = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.DEACTIVATE.DEACTIVATED').toPromise();

    const sureDeactivate = await this.notification.showDialog(title, text, true, ok, cancel);
    if (sureDeactivate) {
      this.finance.deactivatePayee(this.payeeInformation).subscribe(result => {
        if (result) {
          this.payees = null;
          this.payeeInformation = null;
          this.getPayeeInformation();
          this.notification.showDialog(title, success, false, ok);
        }
      });
    }
  }

  getActiveMembersByPolicy() {
    this.policyService.getPolicyMembersByPolicyId(this.policy.policyId, SearchMemberTypeConstants.BANK_INFORMATION).subscribe(members => {
      this.members = members;
    });
  }

  async registerNewAccount() {
    const title = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.REGISTER').toPromise();
    const text = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.TEXT').toPromise();
    const ok = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.OK').toPromise();
    const cancel = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.CANCEL').toPromise();

    const sureRegister = await this.notification.showDialog(title, text, true, ok, cancel);
    if (sureRegister) {
      this.registerInformation();
      this.registerService.setRegisterConditions(this.offshoreAch, this.offshoreWt, this.onshoreAch, this.policy.policyCountryId);
      this.router.navigate([`/policies/register-account/${this.policy.policyId}`]);
    }
  }

  registerInformation() {
    this.registerService.setPayeeInformation(this.payeeInformation);
    this.registerService.setPolicyInformation(this.policy);
    this.registerService.setMembersInformation(this.members);
    this.registerService.resetRegisterConditions();
  }

  getMenuOptions() {
    this.canDeactivateAccount = this.menuOption.state.homeLinks.find(x => x.name === 'POLICY-BANKINFORMATION-DEACTIVATE'
                                && (!this.user.impersonalized || (this.user.impersonalized
                                    && this.isEmployeeFinancy(this.user.user_impersonalizes_role_id))));
    this.canRegisterAccount = this.menuOption.state.homeLinks.find(x => x.name === 'POLICY-BANKINFORMATION-ACTIVATE'
                                    && (!this.user.impersonalized || (this.user.impersonalized
                                    && this.isEmployeeFinancy(this.user.user_impersonalizes_role_id))));
  }
  isEmployeeFinancy(roleId: string): boolean {
    return (+roleId === Rol.EMPLOYEE_FINANCY);
  }
}
