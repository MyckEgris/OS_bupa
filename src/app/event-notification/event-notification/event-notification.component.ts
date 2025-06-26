import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { EventNotificationService } from 'src/app/shared/services/event-notification/event-notification.service';
import { EventNotificationDTO } from 'src/app/shared/services/event-notification/entities/eventNotification.dto';
import { EventNotifications } from 'src/app/shared/services/event-notification/entities/eventNotifications';
import { TranslateService } from '@ngx-translate/core';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { UserInformationReducer } from 'src/app/security/reducers/user-information.reducer';
import { Store, select } from '@ngrx/store';
import { ReadNotification } from 'src/app/shared/services/event-notification/entities/readNotification.dto';
import { UpdateEventNotificationRequest } from 'src/app/shared/services/event-notification/entities/updateEventNotificationRequest.dto';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { NotificationAttachmentDto } from 'src/app/shared/services/event-notification/entities/notificationAttachment.dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-notification',
  templateUrl: './event-notification.component.html'
})
export class EventNotificationComponent implements OnInit {


  /**
   * holds the notifications information who is bring by the resolver
   */
  notificationInfo: EventNotificationDTO = { count: 0, data: [], pageIndex: 0, pageSize: 0 };

  /** contais the notifications id to slideToggle
  */
  private ID_DETAIL_TOGGLE = '#ig-detalleNotification-';

  /**
  * Constant for first querty Page Index parameter
  */
  private pageIndex = 1;

  /**
  * Constant for first querty Page Size parameter
  */
  private pageSize = 10;

  // pager object
  pager: any = {};

  // Shows or hides the not found message
  public dataNotFound: Boolean = false;

  // stores the items per page
  public totalItemsToBePaged: number;

  // paged items
  currentPage: number;

  // User infoStore
  user: UserInformationModel;

  // UserKey infoStore
  userKey: string;



  /**
   * Contruct Methos
   * @param _route   Route  Injection
   * @param translate   Translate  Injection
   * @param eventNotificationService   EventNotificationService  Injection
   * @param pagerService   Pager Service  Injection
   * @param userInfoStore User Information Store Injection
   * @param _commonService common service injection
   * @param notification Notification Service injectio
   */
  constructor(
    private _route: ActivatedRoute,
    private translate: TranslateService,
    private eventNotificationService: EventNotificationService,
    private pagerService: PagerService,
    private _commonService: CommonService,
    private notification: NotificationService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>) {
    this.totalItemsToBePaged = 10;
  }

  ngOnInit() {

    this.userInfoStore.pipe(select('userInformation')).subscribe((userInfo: UserInformationModel) => {
      this.user = userInfo;
      this.userKey = this.user.user_key;
    });

    this.patchNotificationState();

  }

  /**
  * get readed notifications from local storage and patch it to API and delete it
  */
  private patchNotificationState() {
    let notificationsReadCollection: ReadNotification[] = [];
    notificationsReadCollection = JSON.parse(localStorage.getItem('notificationsReadCollection-' + this.userKey));

    if (notificationsReadCollection) {
      const updateEventNotificationRequest = new UpdateEventNotificationRequest();
      updateEventNotificationRequest.eventNotifications = notificationsReadCollection as ReadNotification[];
      this.eventNotificationService.patchEventNotification(updateEventNotificationRequest).subscribe(() => {
        localStorage.removeItem('notificationsReadCollection-' + this.userKey);
        this.generateFirstRequest(this.pageIndex, this.pageSize);
      });
    } else {
      this.generateFirstRequest(this.pageIndex, this.pageSize);
    }

  }


  /**
   * gets the subsequent notifications List and displays the segment from the page selected.
   * @param page page number
   */
  public setPage(page: number) {

    if (this.notificationInfo) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      this.triggerDataNotFound();
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.notificationInfo.count, page, this.totalItemsToBePaged);

    // get current page of items
    this.generateNewRequest(this.pager.currentPage, this.pager.pageSize);

  }


  /**
  * generate the first requests to get the notifications information
  */
  generateFirstRequest(pageIndex: number, pageSize: number) {
    this.eventNotificationService.getEventNotification(pageIndex, pageSize)
      .subscribe(n => {
        this.notificationInfo = n;
        this.pager = this.pagerService.getPager(this.notificationInfo.count, 1, this.totalItemsToBePaged);
        this.viewAllBtnDisabled();
        this.triggerDataNotFound();
      }, error => {
        if (error) {
          this.notificationInfo = { count: 0, data: [], pageIndex: 0, pageSize: 0 };
          this.triggerDataNotFound();
        }
      }
      );
  }



  /**
  * generate the subsequent requests to get the notifications information
  */
  generateNewRequest(pageIndex: number, pageSize: number) {
    this.eventNotificationService.getEventNotification(pageIndex, pageSize)
      .subscribe(n => {
        this.notificationInfo = n;
        this.triggerDataNotFound();
      }, error => {
        if (error) {
          this.notificationInfo = { count: 0, data: [], pageIndex: 0, pageSize: 0 };
          this.triggerDataNotFound();
        }
      }
      );
  }


  /**
  * change the state of the nofitications for Read and store on the LocalStorage
  */
  changeReadState(notification: EventNotifications) {

    const notificationsReadCollection: ReadNotification[] = [];
    const not = this.notificationInfo.data.indexOf(notification);
    this.notificationInfo.data[not].isRead = true;
    notification.isRead = true;
    const noti: ReadNotification = { inboxId: notification.inboxId, isRead: true };
    this.addToLocalStorage(noti, notificationsReadCollection);
  }

  /**
  * add element to local storage
  */
  addToLocalStorage(noti: ReadNotification, notificationsReadCollection: ReadNotification[]) {
    if (localStorage.getItem(`notificationsReadCollection-${this.userKey}`) === null) {
      this.searchElementIsRead(noti);
      notificationsReadCollection.push(noti);
      localStorage.setItem(`notificationsReadCollection-${this.userKey}`, JSON.stringify(notificationsReadCollection));
    } else {
      notificationsReadCollection = JSON.parse(localStorage.getItem(`notificationsReadCollection-${this.userKey}`));

      const existInboxId = notificationsReadCollection.find(element => element.inboxId === noti.inboxId);

      if (existInboxId === undefined) {
        this.searchElementIsRead(noti);
        notificationsReadCollection.push(noti);
        localStorage.setItem(`notificationsReadCollection-${this.userKey}`, JSON.stringify(notificationsReadCollection));
      }
    }
  }



  /**
  * search if element is read
  */
  searchElementIsRead(noti: ReadNotification) {
    this.notificationInfo.data.find(element => element.inboxId === noti.inboxId).isRead = true;
  }


  /**
  * downloads the documents the user select on the screen
  * @param doc document
  */
  downloadFile(doc: NotificationAttachmentDto) {
    const peticion = this._commonService.getDocumentByDocumentPathAndId(doc);
    peticion.subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      saveAs(blob, doc.fileName);
    },
      error => {
        this.showNotFoundDocument(error);
      }
    );
  }

  /**
  * Shows the message when the Item was not found.
  * @param error Http Error message.
  */
  showNotFoundDocument(error: HttpErrorResponse) {
    if (error.error === '404') {
      let message = '';
      let messageTitle = '';
      this.translate.get(`POLICY.ERROR.ERROR_CODE.404`).subscribe(
        result => messageTitle = result
      );
      this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.404`).subscribe(
        result => message = result
      );
      this.notification.showDialog(messageTitle, message);
    }
  }



  /**
   * use to slidown the notification detail
   *
   */
  toggleSlideDetail(notifi: EventNotifications) {
    $(this.ID_DETAIL_TOGGLE + notifi.inboxId).slideToggle();
  }


  // triggers the not found message
  triggerDataNotFound() {
    if (this.notificationInfo.data.length === 0) {
      this.dataNotFound = true;
    } else {
      this.dataNotFound = false;
    }
  }

  /**
   * triggers the disiabled Read button
   *
   */
  disabledReadButton(notifi: EventNotifications) {
    const notificationsReadCollection = JSON.parse(localStorage.getItem(`notificationsReadCollection-${this.userKey}`));
    if (notificationsReadCollection && !notifi.isRead) {
      const existInboxId = notificationsReadCollection.find(element => element.inboxId === notifi.inboxId);
      if (existInboxId === undefined) { return true; }
    } else { return !notifi.isRead; }
  }

  /**
   * set all notifications as read
   *
   */
  setAllAsRead() {
    this.notificationInfo.data.forEach(element => {
      element.isRead = true;
      this.changeReadState(element);
    });
  }

  /**
   * trigger viewAll button disabled
   *
   */
  viewAllBtnDisabled() {
    const flag = this.notificationInfo.data.find(element => element.isRead === false);
    if (flag === undefined) {
      return true;
    }
  }


}
