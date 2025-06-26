import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { UserOutputDto } from 'src/app/shared/services/user/entities/user.dto';
import { UpdateUserInputDto } from 'src/app/shared/services/user/entities/update-user.dto';
import { Role } from 'src/app/shared/services/user/entities/role';

@Component({
  selector: 'app-agent-assistant-approval',
  templateUrl: './agent-assistant-approval.component.html'
})
export class AgentAssistantApprovalComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private translate: TranslateService,
    private notificationService: NotificationService) { }

  private AGENT_CANCELED_STATUS = 12;
  private AGENT_INACTIVE_STATUS = 18;
  private AGENT_HOLD_COMMISSION_STATUS = 271;
  private AUTHENTICATION_MODE_RA = 'RA';
  private AGENT_ASSISTANT_ROLE_ID = 2;
  private ROLE_NAME_FOR_AGENT_ASSISTANT = 'AgentAssistant';
  private AGENT_CAN_NOT_BE_ZERO_EXCEPTION = 'BE_001';

  private ERROR_NOTIFICATION_AGENTID: string;
  private ERROR_NOTIFICATION_TITLE: string;
  private ERROR_NOTIFICATION_EMAIL_LINK: string;
  private ERROR_NOTIFICATION_USER: string;
  private INFO_NOTIFICATION_REJECT: string;
  private INFO_NOTIFICATION_ACCEPT: string;
  private CONFIRMATION_NOTIFICATION_ACCEPT: string;
  private CONFIRMATION_NOTIFICATION_DENY: string;
  private BTN_CONTINUE: string;
  private BTN_CANCEL: string;
  private translPath = 'AGENT.APPROVAL.';

  private userToApprove = '';
  private userObtained: UserOutputDto;
  private token = '';
  private lang = '';
  public role = '';
  public fullName = '';
  public validInformation: Boolean;
  public mainForm: FormGroup;
  private userDto: UpdateUserInputDto;
  private alreadyResponded = false;
  private accepted: string;

  ngOnInit() {
    this.validInformation = false;
    this.translate.onLangChange.subscribe(() => {
      this.translateMessages();
    });
    this.buildMainForm();
    this.readQueryInformation();
  }

  async readQueryInformation() {
    this.route.queryParams.subscribe(params => {
      this.userToApprove = params['userId'];
      this.token = params['token'];
      this.lang = params['language'];
      this.translateMessages().then(a => {
        if (!this.userToApprove || !this.token || !this.lang) {
          this.notificationService.showDialog(this.ERROR_NOTIFICATION_TITLE, this.ERROR_NOTIFICATION_EMAIL_LINK);
        } else {
          this.identifyUser();
        }
      });
    });
  }

  /**
   * Translates all notification messages.
   */
  async translateMessages() {
    Promise.all([
      this.ERROR_NOTIFICATION_TITLE = await this.translate.get(this.translPath + 'ERRORS.TITLE').toPromise(),
      this.ERROR_NOTIFICATION_USER = await this.translate.get(this.translPath + 'ERRORS.USER').toPromise(),
      this.ERROR_NOTIFICATION_EMAIL_LINK = await this.translate.get(this.translPath + 'ERRORS.EMAIL_LINK').toPromise(),
      this.ERROR_NOTIFICATION_AGENTID = await this.translate.get(this.translPath + 'ERRORS.AGENTID').toPromise(),
      this.INFO_NOTIFICATION_ACCEPT = await this.translate.get(this.translPath + 'NOTIFICATIONS.ACCEPT').toPromise(),
      this.INFO_NOTIFICATION_REJECT = await this.translate.get(this.translPath + 'NOTIFICATIONS.REJECT').toPromise(),
      this.BTN_CANCEL = await this.translate.get(this.translPath + 'NOTIFICATIONS.CANCEL').toPromise(),
      this.BTN_CONTINUE = await this.translate.get(this.translPath + 'NOTIFICATIONS.CONTINUE').toPromise(),
      this.CONFIRMATION_NOTIFICATION_ACCEPT = await this.translate.get(this.translPath + 'CONFIRMATION.APPROVED').toPromise(),
      this.CONFIRMATION_NOTIFICATION_DENY = await this.translate.get(this.translPath + 'CONFIRMATION.REJECTED').toPromise(),
      this.role = await this.translate.get(this.translPath + 'AGENT_ASSISTANT').toPromise()
    ]);
  }

  /**
 * Builds default Member Elegibility Form.
 */
  buildMainForm() {
    this.mainForm = new FormGroup({
      decision: new FormControl('', [Validators.required])
    });
  }

  identifyUser() {
    this.userService.getUserById(this.userToApprove).subscribe(
      userObj => {
        this.userObtained = userObj;
        // validate information against the corresponding service
        this.validInformation = true;
        this.fullName =
          userObj.firstName + (userObj.middleName ? userObj.middleName + ' ' : '') + ' ' + userObj.lastName;
        this.userDto = this.mapperUserOutputToUpdateUserInputDto();
      }, error => {
        if (this.checksIfHadBusinessError(error)) {
          this.notificationService.showDialog(this.ERROR_NOTIFICATION_TITLE, this.ERROR_NOTIFICATION_USER);
        }
      });
  }

  /**
* Map agentDto to updateUserInputDto
* @param agent Agent Dto Object
*/
  mapperUserOutputToUpdateUserInputDto() {
    const role: Role = { roleId: this.AGENT_ASSISTANT_ROLE_ID, roleName: this.ROLE_NAME_FOR_AGENT_ASSISTANT };
    const userDto: UpdateUserInputDto = {
      id: this.userToApprove,
      firstName: this.userObtained.firstName,
      middleName: this.userObtained.middleName,
      lastName: this.userObtained.lastName,
      authenticationMode: this.AUTHENTICATION_MODE_RA,
      isAdministrator: false,
      insuranceBusinessId: 0,
      countryId: '0',
      phoneNumber: this.userObtained.phoneNumber,
      policyId: null,
      position: '',
      providerId: null,
      roles: [role],
      lang: this.lang,
      token: this.token
    };
    return userDto;
  }

  /**
  * Check if response has error code to show business exception
  * @param error Http Error
  */
  checksIfHadBusinessError(error) {
    return error.error.code;
  }

  async submit(value) {
    this.alreadyResponded = true;
    if (await this.showMessageIfWishToContinue(value.decision)) {
      this.userDto.isApproving = true;
      this.userDto.isApproved = value.decision;
      this.userDto.lang = this.lang;
      this.accepted = value.decision;
      this.userDto.insuranceBusinessId = 30;
      this.updateUser(this.userDto);
    } else {
      this.alreadyResponded = false;
    }
  }

  async showMessageIfWishToContinue(value) {
    const title = '';
    const message = value === 'true' ?
      this.INFO_NOTIFICATION_ACCEPT :
      this.INFO_NOTIFICATION_REJECT;
    const yes = this.BTN_CONTINUE;
    const no = this.BTN_CANCEL;
    return await this.notificationService.showDialog(title,
      message.toString().replace('{0}', this.fullName), true, yes, no);
  }

  /**
  * Request User API to patch user with provider role
  * @param userDto UpdateUserInputDto
  */
  updateUser(userDto: UpdateUserInputDto) {
    this.userService.updateUser(userDto).subscribe(
      data => {
        let msg;
        if (this.accepted === 'true') {
          msg = this.CONFIRMATION_NOTIFICATION_ACCEPT;
        } else {
          msg = this.CONFIRMATION_NOTIFICATION_DENY;
        }
        this.notificationService.showDialog('', msg.toString().replace('{0}', this.fullName));
      },
      error => {
        if (error.error.code) {
          this.showMessage(error.error.code);
        }
        this.alreadyResponded = false;
      }
    );
  }

  /**
  * Uses notification service to show modal popup with a title and a message
  * @param message Message
  */
  private showMessage(errorCode) {
    this.translate.get(this.translPath + 'ERRORS.TITLE')
      .subscribe(validateTitle => {
        this.notificationService.showDialog(validateTitle, this.translPath + 'ERRORS.' + errorCode);
      });
  }

}
