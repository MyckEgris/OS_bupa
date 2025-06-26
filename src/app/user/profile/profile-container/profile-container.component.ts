import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Store, select } from '@ngrx/store';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-container',
  templateUrl: './profile-container.component.html'
})
export class ProfileContainerComponent implements OnInit {

  user: any;

  role: string;

  constructor(
    private _userService: UserService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private notification: NotificationService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.user = userInfo;
    });
    this.role = this.user.role;
  }

}
