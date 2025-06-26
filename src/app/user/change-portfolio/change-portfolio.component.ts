import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { UserInRolesDto } from 'src/app/shared/services/user/entities/user-in-roles.dto';
import { map, count } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http/http';



@Component({
  selector: 'app-change-portfolio',
  templateUrl: './change-portfolio.component.html',
  styles: []
})
export class ChangePortfolioComponent implements OnInit {

  /***
   * userInRoleSelected
   */
  userInRoleSelected: UserInRolesDto;

  /***
   * user
   */
  user: UserInformationModel;

  /***
   * users
   */
  users$: Observable<UserInRolesDto[]>;

  /***
   * enableControl
   */
  enableControl: boolean;

  /***
   * roleIdsToQuery
   */
  private roleIdsToQuery = ['1', '2', '8'];

  /***
   * Constants for the download documents data not found (400) error default request message.
   */
  private DEFAULT_ERROR400_TITLE = 'APP.HTTP_ERRORS.HANDLED_ERRORS.ERROR_TITLE.NOT_AUTHORIZED';
  private DEFAULT_ERROR400_MSG = 'APP.HTTP_ERRORS.HANDLED_ERRORS.ERROR_MESSAGE.NOT_AUTHORIZED';



  /**
   * Contructor method
   * @param translate Translate service injection
   * @param userService User service injection
   * @param authService Auth service injection
   * @param notification Notification service injection
   */
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private translate: TranslateService,
    private notification: NotificationService
  ) { }


  ngOnInit() {
    this.getUsersInRoles();
  }

  getUsersInRoles() {
    this.getUser();
    this.users$ = this.userService.getUserRolesByUserIdAndRolesId(this.user.sub,
      this.roleIdsToQuery.toString()).pipe(map(x => x.userInRoles.filter(y => y.agentNumber !== this.user.agent_number)));
  }

  async getUser() {
    this.user = this.authService.getUser();
  }

  executeChangePortfolio() {
    this.changePortfolio();
  }

  /**
   * change portfolio user
   * Example: '3751@gmail.com|41|1|12079'
   */
  changePortfolio() {
    this.authService.changePortfolio(this.getComposedFilter())
      .then(e => {
        console.error(e);
        if (e) {
          this.handleImpersonationError(e);
        }
      });
  }

  getComposedFilter(): string {
    // tslint:disable-next-line: max-line-length
    return `${this.user.sub}|${this.userInRoleSelected.roleByBupaInsurance.bupaInsurance.id}|${this.userInRoleSelected.roleByBupaInsurance.role.roleId}|${this.userInRoleSelected.agentNumber}`;
  }

  isSelectedUser() {
    if (!this.userInRoleSelected) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Handle impersonation request errors.
   * @param error Error response.
   */
  private handleImpersonationError(error: HttpErrorResponse) {
    if (error.status === 400) {
      this.showErrorMessage(
        this.DEFAULT_ERROR400_TITLE,
        this.DEFAULT_ERROR400_MSG);
    }
  }

  /**
   * Shows pop up message.
   * @param title Message title.
   * @param msg Message body.
   */
  showErrorMessage(title: string, msg: string) {
    let message = '';
    let messageTitle = '';
    this.translate.get(title).subscribe(
      result => messageTitle = result
    );
    this.translate.get(msg).subscribe(
      result => message = result
    );
    this.notification.showDialog(messageTitle, message);
  }


}
