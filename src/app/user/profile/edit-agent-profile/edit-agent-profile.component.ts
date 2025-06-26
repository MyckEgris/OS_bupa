import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Store } from '@ngrx/store';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-agent-profile',
  templateUrl: './edit-agent-profile.component.html'
})
export class EditAgentProfileComponent implements OnInit {

  constructor(
    private _userService: UserService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private notification: NotificationService,
    private translate: TranslateService,
    private router: Router) { }

  ngOnInit() {
  }

  GoBack() {
    this.router.navigate(['users/profile-view']);
  }
}
