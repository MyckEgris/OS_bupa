import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { RoleDto } from 'src/app/shared/services/user/entities/role.dto';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { ImpersonationMode } from 'src/app/security/services/auth/impersonation-mode.enum';
import { UserOutputDto } from 'src/app/shared/services/user/entities/user.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-impersonation',
  templateUrl: './impersonation.component.html'
})
export class ImpersonationComponent implements OnInit, OnDestroy {

  /**
   * Main form
   */
  public impersonationForm: FormGroup;

  /**
   * Array for user search types
   */
  public userSearchType: Array<any>;

  /**
   * Flag for searching proccess
   */
  public searchProccess = false;

  /**
   * Message
   */
  public message: string;

  /**
   * Disable impersonation
   */
  public diseabledImpersonation = true;

  /**
   * Selected type of user for validate form
   */
  public selectedTypeOfUser = 0;

  /**
   * Impersonalized user UserOutputDto
   */
  public userImpersonalized: Array<UserOutputDto>;

  /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  /**
   * Subscription
   */
  private subscription: Subscription;

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
    private translate: TranslateService,
    private userService: UserService,
    private authService: AuthService,
    private notification: NotificationService) { }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



  /**
   * Prepare impersonation for and validations
   */
  ngOnInit() {
    this.prepareImpersonation();
    this.translate.onLangChange.subscribe(() => {
      this.prepareImpersonation();
    });
    this.impersonationForm.controls.userSearchType.valueChanges.subscribe(val => this.setValidations(val));
  }

  /**
   * Prepare impersonation, getting de user types, roles and building the form
   */
  prepareImpersonation() {
    this.userImpersonalized = [];
    this.userSearchType = [];
    this.selectedTypeOfUser = 0;
    this.userSearchType = this.loadAndTranslateSearchTypes();
    this.impersonationForm = this.buildForm();
    this.getRolesCanBeImpersonatedByRoleId();
  }

  /**
   * Create reactive form
   */
  buildForm() {
    return new FormGroup({
      userSearchType: new FormControl(this.userSearchType[0]),
      agentId: new FormControl(''),
      user: new FormControl(''),
    });
  }

  /**
   * Set validations according type of user selected
   * @param value Value
   */
  setValidations(value: any) {
    this.diseabledImpersonation = true;
    this.searchProccess = false;
    this.userImpersonalized = null;
    this.impersonationForm.controls.agentId.setValue('');
    this.impersonationForm.controls.user.setValue('');
  }

  /**
   * New filter user impersonation
   * @param value Value
   */
  newFilterUserImpersonation(value: any) {
    this.getUserImpersonated();
  }

  /**
   * Load type of users and translate
   */
  loadAndTranslateSearchTypes() {
    const searchStatusTypes = [];
    searchStatusTypes.push({ id: 0, value: 'select' });
    return searchStatusTypes;
  }

  /**
   * Calls service for get the roles that the user can be impersonalize
   */
  getRolesCanBeImpersonatedByRoleId() {
    this.userService.getRolesCanBeImpersonatedByRoleId(Number(this.authService.getUser().role_id)).subscribe(
      data => {
        this.getFilter(data);
        this.impersonationForm.controls.userSearchType.setValue
          (this.userSearchType[0]);
      },
      error => {
        this.handlePolicyError(error);
      }
    );
  }

  /***
  * handles Policy Error
  */
  private handlePolicyError(error: any) {
    if (error.status === 404) {
      this.searchProccess = true;
      this.showErrorMessage(null);
    } else if (this.checksIfHadBusinessError(error)) {
      this.showErrorMessage(error);
    }
  }

  /**
    * Check if response has error code to show business exception
    * @param error Http Error
    */
  checksIfHadBusinessError(error) {
    return error.error.code;
  }



  /**
   * Check if status is 404 and show message for data not found
   * @param error Http Error
   */
  checksIfHadNotFoundError(error) {
    return (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND);
  }

  /**
   * Show impersonation businnes exceptions
   * @param errorMessage HttpErrorResponse
   */
  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    if (errorMessage) {
      this.translate.get(`USER.IMPERSONATION.MESSAGE.${errorMessage.error.code}`).subscribe(
        result => message = result
      );
      this.translate.get(`USER.IMPERSONATION.MESSAGE.${errorMessage.error.code}`).subscribe(
        result => message = result
      );
    } else {
      this.translate.get(`USER.IMPERSONATION.MESSAGE.NOT_FOUND`).subscribe(
        result => message = result
      );
      this.translate.get(`USER.IMPERSONATION.MESSAGE.TITLE_NOT_FOUND`).subscribe(
        result => messageTitle = result
      );
    }
    this.notification.showDialog(messageTitle, message);
  }

  /**
   * Get roles than can be impersonalize
   * @param list RoleDto[]
   */
  getFilter(list: RoleDto[]) {
    this.sortItems(list);
    if (this.userSearchType.length === 1) {
      list.forEach(a => {
        this.userSearchType.push({ id: a.roleId, value: a.roleName });
      });
    }
  }

  /**
   * Sort items
   */
  sortItems(list: RoleDto[]) {
    list.sort(function (a, b) {
      if (a.roleName < b.roleName) {
        return -1;
      }
      if (a.roleName > b.roleName) {
        return 1;
      }
      return 0;
    });
  }

  /**
   * Validation of user for make impersonation
   */
  validImpersonationUser() {
    if (!this.impersonationForm.controls.user.value) {
      this.showMessage('NOT_USER_SELECT', 'TITLE_MESSAGE');
    } else {
      const userImpersonalized = this.userImpersonalized.filter(a => a.id === this.impersonationForm.controls.user.value);
      if (!userImpersonalized[0].isApproved) {
        this.showMessage('NOT_IS_APPROVED', 'TITLE_MESSAGE');
      } else if (!userImpersonalized[0].isEnabled) {
        this.showMessage('NOT_IS_ENABLED', 'TITLE_MESSAGE');
      } else if (userImpersonalized[0].isLockedOut) {
        this.cancel(userImpersonalized[0]);
      } else {
        this.impersonationUser(userImpersonalized[0]);
      }
    }
  }

  /**
   * Show message
   * @param messageIn messageIn
   * @param title Title
   */
  showMessage(messageIn: string, title: string) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`USER.IMPERSONATION.MESSAGE.${messageIn}`).subscribe(
      result => message = result
    );
    this.translate.get(`USER.IMPERSONATION.MESSAGE.${title}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /**
   * Calcel impersonation
   * @param userImpersonalized UserOutputDto
   */
  async cancel(userImpersonalized: UserOutputDto) {
    const title = await this.translate.get('USER.IMPERSONATION.MESSAGE.TITLE_MESSAGE').toPromise();
    const message = await this.translate.get('USER.IMPERSONATION.MESSAGE.IS_LOCKED').toPromise();
    const yes = await this.translate.get('USER.IMPERSONATION.MESSAGE.YES').toPromise();
    const no = await this.translate.get('USER.IMPERSONATION.MESSAGE.NO').toPromise();
    const confirmCancel = await this.notification.showDialog(title, message, true, yes, no);
    if (confirmCancel) {
      this.impersonationUser(userImpersonalized);
    } else {
      this.clearFields(true);
    }
  }

  /**
   * Impersonation user
   * @param userImpersonalized UserOutputDto
   */
  impersonationUser(userImpersonalized: UserOutputDto) {
    this.authService.impersonation(ImpersonationMode.Start, this.getComposedFilter(userImpersonalized))
      .then(e => {
        if (e) {
          this.handleImpersonationError(e);
        }
      });
  }

  getComposedFilter(userImpersonalized: UserOutputDto): string {
    const userId = this.impersonationForm.controls.user.value;
    const insuranceBusinessId = userImpersonalized.userInRoles[0].roleByBupaInsurance.bupaInsurance.id;
    const roleId = this.impersonationForm.controls.userSearchType.value.id;
    const userKey = this.impersonationForm.controls.agentId.value;
    return `${userId}|${insuranceBusinessId}|${roleId}|${userKey}`;
  }

  /**
   * Get impersonated user
   */
  getUserImpersonated() {
    this.userImpersonalized = null;
    const bupaInsurances: any = this.authService.getUser().bupa_insurances;
    const sendInsurance = typeof (bupaInsurances) === 'string' ? bupaInsurances : bupaInsurances.join();
    this.userService.getUserImpersonated(this.impersonationForm.controls.agentId.value,
      sendInsurance, this.impersonationForm.controls.userSearchType.value.id).subscribe(
        data => {
          this.userImpersonalized = data;
          if (this.userImpersonalized.length === 1) {
            this.impersonationForm.controls.user.setValue(this.userImpersonalized[0].id);
            this.diseabledImpersonation = false;
          }
          this.searchProccess = true;
        },
        error => {
          this.diseabledImpersonation = true;
          this.searchProccess = true;
          this.handlePolicyError(error);
        }
      );
  }

  /**
   * Clears form object and its elements.
   * @param event status to confirm.
   */
  clearFields(event) {
    this.userImpersonalized = [];
    this.selectedTypeOfUser = 0;
    if (event) {
      this.searchProccess = false;
      this.removeValues('');
      this.userImpersonalized = null;
    }
  }

  removeValues(value: string) {
    Object.keys(this.impersonationForm.controls).forEach(key => {
      if (!(value.indexOf(key) > -1)) {
        this.impersonationForm.get(key).setValue('');
      }
    });

    this.impersonationForm.controls.userSearchType.setValue
      (this.userSearchType[0]);
  }

  /**
   * Event at select user
   */
  selectUser(event) {
    this.diseabledImpersonation = false;
  }

  /**
   * Event on change type of user
   */
  onChangeTypeOfUser(event) {
    this.selectedTypeOfUser = event.target.selectedIndex;
  }


  /**
   * Handle impersonation request errors.
   * @param error Error response.
   */
  private handleImpersonationError(error: HttpErrorResponse) {
    if (error.status === 400) {
      this.showImpersonationErrorMessage(
        this.DEFAULT_ERROR400_TITLE,
        this.DEFAULT_ERROR400_MSG);
    }
  }

  /**
   * Shows pop up message.
   * @param title Message title.
   * @param msg Message body.
   */
  showImpersonationErrorMessage(title: string, msg: string) {
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
