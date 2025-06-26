/**
* change-password.component.ts
*
* @description: Custom component to change password of the logged in user
* @author Arturo Suarez.
* @version 1.0
* @date 11-10-2018.
*
**/

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ChangePasswordDto } from 'src/app/shared/services/user/entities/change-password.dto';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Store, select } from '@ngrx/store';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { UserService } from 'src/app/shared/services/user/user.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {

  /**
   * Dependencies in the constructor:
   * @param userInfoStore Gets the loggedIn user information reducer
   * @param userService Is the service that contains the change password request
   * @param notification Is the service that contains the modal show components
   * @param translate It's the service in charge of translating the page between english or spanish
   */
  constructor(private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private userService: UserService,
    private notification: NotificationService,
    private translate: TranslateService) { }

  /**
   * Main Form variable
   */
  changePasswordForm: FormGroup;

  /**
   * Contains the logged in user information
   */
  private user: UserInformationModel;

  /**
   * Obtains the user information from the reducer, and initializes the form and its validations
   */
  ngOnInit() {
    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.user = userInfo;
    });
    this.changePasswordForm = this.initializeForm();
  }

  /**
   * Sets the form, along with the controls, with their validators
   */
  initializeForm() {
    return new FormGroup({
      currentPwd: new FormControl('', Validators.required),
      setupPasswordGroup: new FormGroup({
        newPwd: new FormControl('', {
          validators:
            [Validators.required,
            Validators.maxLength(12),
            CustomValidator.passwordPatternValidator],
          updateOn: 'blur'
        }),
        confirmPwd: new FormControl('', Validators.required)
      }, CustomValidator.elementsMatch('newPwd', 'confirmPwd'))
    });
  }

  /**
   * Calls the service to change the password in the server.
   * @param changePwdObject formGroup value
   */
  submitNewPassword(changePwdObject: any) {
    const changePwdDto = {} as ChangePasswordDto;
    changePwdDto.password = changePwdObject.currentPwd;
    changePwdDto.newPassword = changePwdObject.setupPasswordGroup.newPwd;
    changePwdDto.id = this.user.sub;
    changePwdDto.Language = this.user.language;
    changePwdDto.token = '';

    this.userService.ChangePassword(changePwdDto)
      .subscribe(async () => {
        const message = await this.translate.get('USER.CHANGEPASSWORD.OK_MESSAGE').toPromise();
        this.notification.showDialog('', message);
      },
        async error => {
          if (error.error.code) {
            const message = await this.translate.get(`USER.CHANGEPASSWORD.ERROR.${error.error.code}`).toPromise();
            const title = await this.translate.get(`USER.CHANGEPASSWORD.ERROR.TITLE`).toPromise();
            this.notification.showDialog(title, message);
          }
        });
  }
}
