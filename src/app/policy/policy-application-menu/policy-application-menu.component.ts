import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { MenuOptionService } from 'src/app/security/services/menu-option/menu-option.service';

@Component({
  selector: 'app-policy-application-menu',
  templateUrl: './policy-application-menu.component.html'
})
export class PolicyApplicationMenuComponent implements OnInit {
/**
   * Stores the logged user information
   */
  private user: UserInformationModel;
  private _pathURLQuote2NewBusiness: string;
  private _createPolicyApplication = '/policies/create-policy-application';
  private _createPolicyApplicationEnrollment: string;
  constructor(private router: Router,
    private authService: AuthService,
    private menuOption: MenuOptionService) {
      localStorage.removeItem('mode');
      localStorage.removeItem('applicationId');
    }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.setRouterLinkValues();
  }

  setRouterLinkValues() {
    this._createPolicyApplicationEnrollment = `/policies/create-policy-enrollment-${this.user.bupa_insurance}`;
    if (this.menuOption.state.menus.find(m => m.name === 'QUOTE2')) {
      this._pathURLQuote2NewBusiness = this.menuOption.state.menus
        .find(m => m.name === 'QUOTE2').sons.find(s => s.name === 'NEWBUSINESS').pathURL;
    }
  }

  get pathURLQuote2NewBusiness(): string {
    return this._pathURLQuote2NewBusiness;
  }

  get createPolicyApplication(): string {
    return this._createPolicyApplication;
  }

  get createPolicyApplicationEnrollment(): string {
    return this._createPolicyApplicationEnrollment;
  }

}
