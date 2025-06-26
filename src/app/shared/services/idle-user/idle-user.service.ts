/**
* IdleUserService.ts
*
* @description: This class handle the user inactivity and close session if not interacts.
* @author Juan Camilo Moreno.
* @author Yefry Lopez.
* @author Ivan Alajandro Hidalgo.
* @version 1.0
* @date 17-09-2018.
*
**/

import { Injectable } from '@angular/core';
import { IdleUserComponent } from './idle-user/idle-user.component';
import { NgbModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../security/services/auth/auth.service';
import { UserIdleService } from '../../../../../node_modules/angular-user-idle';
import { TranslateService } from '@ngx-translate/core';

/**
 * This class handle the user inactivity and close session if not interacts.
 */
@Injectable({
  providedIn: 'root'
})
export class IdleUserService {

  /**
   * Indicates when start the counting
   */
  private startedCounting: boolean;

  /**
   * Instance of user idle component for be opened in modal window
   */
  private modal: IdleUserComponent;

  /**
   * Constructor
   * @param userIdle User Idle User injection
   * @param modalService Modal Service injection
   * @param authService Auth Service injection
   * @param translate Translate Service injection
   */
  constructor(
    private userIdle: UserIdleService,
    private modalService: NgbModal,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  /**
   * Start inactivity timer
   */
  startTimer() {
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe(counter => this.countingHandler(counter));
    this.userIdle.onTimeout().subscribe(() => this.logout());
  }

  /**
   * Show a modal showing the time before logout
   */
  private showModal(): IdleUserComponent {
    const result = this.modalService.open(IdleUserComponent,
      { centered: true, backdrop: 'static', keyboard: false, windowClass: 'ig-timessession' });
    result.result.then(r => this.logout()).catch(r => this.continue());
    return result.componentInstance;
  }

  /**
   * Logout
   */
  private logout(): void | PromiseLike<void> {
    this.authService.logoff();
  }

  /**
   * Reset the timer
   */
  private continue(): void | PromiseLike<void> {
    this.userIdle.stopTimer();
    this.startedCounting = false;
    document.title = 'Mi Bupa';
  }

  /**
   * Show time before close session
   * @param counter Counter
   */
  private countingHandler(counter) {
    if (!this.startedCounting) {
      this.modal = this.showModal();
      this.modal.title = 'Tiempo de sesión';
      this.startedCounting = true;
    }
    const formatCounter = new Date(null);
    formatCounter.setSeconds(10 - counter);
    const minutes = formatCounter.getMinutes();
    const seconds = formatCounter.getSeconds();
    this.modal.message = `${(minutes > 0 ? minutes + 'm' : '')} ${seconds}s`;
    document.title = this.modal.message;
  }
}
