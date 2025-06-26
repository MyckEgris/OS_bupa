/**
* ProviderProfileComponent.ts
*
* @description: This component displays and manages the provider profile.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/


import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Router } from '@angular/router';


/**
 * This component displays and manages the provider profile.
 */
@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html'
})
export class ProviderProfileComponent implements OnInit {


  /**
   * User Authenticated Object.
   */
  public user: UserInformationModel;


  /**
   * Constructor Method.
   * @param authService Auth Service Injection.
   * @param router Router Injection.
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit() {
    this.user = this.authService.getUser();
    if (this.user) {
      if (!this.validateNullValue(this.user.user_key_alternative)) {
        this.router.navigate(['users/provider-profile/view']);
      } else {
        this.router.navigate(['users/provider-profile/detail']);
      }
    }
  }

  /**
   * Validates if the value is empty and assign it to null.
   * @param value Value.
   */
  validateNullValue(value: any) {
    if (!value || value === '' || value === undefined) {
      const newValue = null;
      return newValue;
    } else { return value.toString(); }
  }

}
