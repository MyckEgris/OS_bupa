import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { ImpersonationMode } from 'src/app/security/services/auth/impersonation-mode.enum';

@Component({
  selector: 'app-go-back-impersonation',
  templateUrl: './go-back-impersonation.component.html'
})
export class GoBackImpersonationComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.goBackImpersonation();
  }

  public goBackImpersonation() {
    const user = this.authService.getUser();
    const filter = this.getComposedFilter(user);
    this.authService.impersonation(ImpersonationMode.GoBack, filter);
  }


  getComposedFilter(user): string {
    const userId = user.user_impersonalizes_user_id;
    const insuranceBusinessId = 999;
    const roleId = user.user_impersonalizes_role_id;
    const userKey = user.user_impersonalizes_employee_id;
    return `${userId}|${insuranceBusinessId}|${roleId}|${userKey}`;
  }


}
