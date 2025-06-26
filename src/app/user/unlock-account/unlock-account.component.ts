/**
* UnlockAccountComponent.ts
* use for employers and admins roles to unlocks accounts
* @description: UnlockAccountComponent
* @author Andrés Tamayo
* @version 1.0
* @date 4-16-2019.
*
**/
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user/user.service';
import { UserOutputDto } from 'src/app/shared/services/user/entities/user.dto';

import { UpdateUserInputDto } from 'src/app/shared/services/user/entities/update-user.dto';
import { Role } from 'src/app/shared/services/user/entities/role';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-unlock-account',
  templateUrl: './unlock-account.component.html'
})
export class UnlockAccountComponent {

  /**
   * hold the form's fields
   */
  form: FormGroup;
  /**
   * contains the user's information who is going to be unlock
   */
  userToUnlock: UserOutputDto;

  /**
   * @param _userService  _userService Injection
   * @param _notificationService _notificationService Injection
   * @param translate translate Injection
   * @param TranslationService TranslationService Injection
   */
  constructor( public _userService: UserService, public _notificationService: NotificationService,
    private translate: TranslateService, private _tranlationL: TranslationService) {
    this.form = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email,
         Validators.pattern('[a-zA-Z.0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
    });

  }

  /**
   * Search the account written by the user
   */
  searchAccount() {

    this._userService.getUserById(this.form.value.email)
    .subscribe(
      user => {
        this.userToUnlock = user;
        this.unlock();
      },
      err => {
        this.showLoadedMessages(`USER.UNLOCK_ACCOUNT.ERRORS.BE_001_TITLE`, `USER.UNLOCK_ACCOUNT.ERRORS.BE_001`);
      }
    );
  }

  /**Resets form values */
  clear() {
    this.form.reset();
  }

  /**
   * handles the unlock functionality
   */
  private unlock() {
    const userTransformed = this.mapperUserOutputToUpdateUserInputDto();

    this._userService.unlockUser(userTransformed).subscribe(
      (data: any) => {
        this.showLoadedMessages('USER.UNLOCK_ACCOUNT.SUCCESS_TITLE', `USER.UNLOCK_ACCOUNT.SUCCCESS`);
      },
      err => {
       this.showLoadedMessages(`USER.UNLOCK_ACCOUNT.ERRORS.${err.error.code}_TITLE`, `USER.UNLOCK_ACCOUNT.ERRORS.${err.error.code}`);
      });
  }

  /**
   * launch the modal with the result's message
   * @param msg code to look for the message
   */
  private showLoadedMessages(title: string, msg: string) {

    const messageS = this.translate.get(msg);
    const tittleS = this.translate.get(title);

    forkJoin([tittleS, messageS]).subscribe( response => {
      if (response[0] !== '' && response[0] !== undefined) {
        this._notificationService.showDialog(response[0], response[1]);
      }
    });
  }

  /**
  * Map UserOutputDto to updateUserInputDto
  * @param agent Agent Dto Object
  */
  mapperUserOutputToUpdateUserInputDto() {
    const role: Role = { roleId: this.userToUnlock.userInRoles[0].roleByBupaInsurance.role.roleId,
                        roleName: this.userToUnlock.userInRoles[0].roleByBupaInsurance.role.roleName};

    const userDto: UpdateUserInputDto = {
      id: this.userToUnlock.id,
      firstName: this.userToUnlock.firstName,
      middleName: this.userToUnlock.middleName,
      lastName: this.userToUnlock.lastName,
      authenticationMode: null,
      isAdministrator: false,
      insuranceBusinessId: this.userToUnlock.userInRoles[0].roleByBupaInsurance.bupaInsurance.id,
      countryId: '0',
      phoneNumber: this.userToUnlock.phoneNumber,
      policyId: null,
      position: '',
      providerId: null,
      roles: [role],
      lang:  this._tranlationL.getLanguageName(),
      token: null
    };
    return userDto;
  }
}
