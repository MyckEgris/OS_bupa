/**
* HttpErrorInterceptor.ts
*
* @description: This class Intercepts request if there is an error response.
* @author Juan Camilo Moreno.
* @author Yefry Lopez.
* @author Ivan Alajandro Hidalgo.
* @version 1.0
* @date 17-09-2018.
*
**/

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestLoadingService } from '../services/request-loading/request-loading.service';
import { IgnoreInterceptorTypeNames } from '../classes/ignoreInterceptorType.enum';

/**
 * This class Intercepts request if there is an error response.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  private MESSAGE_TITLE_FOR_BAD_REQUEST = 'Bad Request';
  private MESSAGE_TITLE_FOR_DENIED_AUTHORIZATION = 'Authorization has been denied';
  private MESSAGE_TITLE_FOR_FORBIDDEN = 'Forbidden Request';
  private MESSAGE_TITLE_FOR_INTERNAL_SERVER_ERROR = 'Internal Error Server';
  private MESSAGE_TITLE_FOR_UNHANDLED_ERROR = 'Unhandled error';
  private MESSAGE_TITLE_FOR_SERVICE_UNAVAILABLE = 'Service Unavailable';
  private MESSAGE_WITH_TICKET = 'You should by the ticket:';
  private MESSAGE_BODY_FOR_UNHANDLED = 'We lost connection with Bupa Online Services. Please, try later';
  private MESSAGE_BODY_FOR_FORBIDDEN = 'Authorization has been denied for this request';



  constructor(
    private router: Router,
    private notification: NotificationService,
    private translate: TranslateService,
    private requestLoading: RequestLoadingService) { }



  /**
   * Intercepts request if there is a error response.
   * @param request HttpRequest
   * @param next HttpHandler
   */
  intercept(request: HttpRequest<any> | any, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.loadStore.dispatch(new loadingActions.AddLoad());
    this.requestLoading.addLoadingRequest();
    const handle = next.handle(request).pipe(tap(
      event => {
        if (event instanceof HttpResponse) {
          this.requestLoading.removeLoadingRequest();
        }
        return event;
      },
      error => {
        if (error instanceof HttpErrorResponse) {
          this.requestLoading.removeLoadingRequest();

          switch (error.status) {
            case 302:
              break;
            case 503:
              this.handleHttpError503(error);
              break;
            case 500:
              this.handleHttpError500(error);
              break;
            case 404:
              break;
            case 403:
              this.handleHttpError403(error);
              break;
            case 401:
              this.handleHttpError401(error);
              break;
            case 400:
              this.handleHttpError400(error, request);
              break;
            default:
              this.handleunhandledError(error);
              break;
          }
        }
        return error;
      }));
    return handle;
  }


  /**
   * Handles bad resquest.
   * @param error HttpErrorResponses.
   */
  handleHttpError400(error: HttpErrorResponse, request: HttpRequest<any>) {
    // this.translate.get('APP.HTTP_ERRORS.ERROR_TITLE.400').subscribe(msg => {
    //   this.MESSAGE_TITLE_FOR_BAD_REQUEST = msg;

    //   if (this.checkBadRequest(error) && this.checkIfErrorMessages(error)) {
    //     this.notification.showDialog(this.MESSAGE_TITLE_FOR_BAD_REQUEST, `${error.error.message}.`);

    //   } else if (this.checkIfRequestHasValidationErrors(error)) {
    //     let stringErrors = '';
    //     error.error.errors.forEach(err => {
    //       stringErrors += err.message + '<br>';
    //     });
    //     this.notification.showDialog(error.error.message, stringErrors);
    //   } else if (this.checkIfIdentityErrorMessages(error)) {
    //     const errorMessage = JSON.parse(error.error.error_description);
    //     this.notification.showDialog(this.MESSAGE_TITLE_FOR_BAD_REQUEST, `${errorMessage.message}.`);
    //   }
    // });
    if (!this.checkForHeaderInstructions(request.headers, IgnoreInterceptorTypeNames.ERROR_400)) {
      const messageS = this.translate.get(`APP.HTTP_ERRORS.ERROR_MESSAGE.400`);
      const tittleS = this.translate.get(`APP.HTTP_ERRORS.ERROR_TITLE.400`);
      forkJoin([tittleS, messageS]).subscribe(async response => {
        this.notification.showDialog(response[0], response[1]);
      });
    }
  }

  /**
   * Handles error response when the request is not authorized to interact with the resource.
   * @param error HttpErrorResponses
   */
  handleHttpError401(error: HttpErrorResponse) {
    const messageS = this.translate.get(`APP.HTTP_ERRORS.ERROR_MESSAGE.401`);
    const tittleS = this.translate.get(`APP.HTTP_ERRORS.ERROR_TITLE.401`);
    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  /**
   * Handles error response when the request is not authorized to interact with the resource.
   * @param error HttpErrorResponses
   */
  handleHttpError403(error: HttpErrorResponse) {
    const messageS = this.translate.get(`APP.HTTP_ERRORS.ERROR_MESSAGE.403`);
    const tittleS = this.translate.get(`APP.HTTP_ERRORS.ERROR_TITLE.403`);
    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  /**
   * Hanldes an error response when it was thrown as a internal error on the API.
   * @param error HttpErrorResponse
   */
  handleHttpError500(error: HttpErrorResponse) {
    this.translate.get(`APP.HTTP_ERRORS.ERROR_TITLE.${error.status}`).subscribe(validateTitle => {
      this.translate.get(`APP.HTTP_ERRORS.ERROR_MESSAGE.${error.status}`).subscribe(validateMessage => {
        this.translate.get(`APP.HTTP_ERRORS.ERROR_MESSAGE_WITH_TICKET`).subscribe(validateWhitTicket => {
          this.translate.get(`APP.HTTP_ERRORS.ERROR_ACCEPT_BTN`).subscribe(validateOkBtn => {
            this.notification.showDialog(validateTitle,
              `${validateMessage}`,
              false,
              validateOkBtn);
          });
        });
      });
    });
  }

  /**
 * Handles error response when it was thrown as a service unavailable on the API.
 * @param error HttpErrorResponse
 */
  handleHttpError503(error: HttpErrorResponse) {
    const messageS = this.translate.get(`APP.HTTP_ERRORS.ERROR_MESSAGE.503`);
    const tittleS = this.translate.get(`APP.HTTP_ERRORS.ERROR_TITLE.503`);
    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  /**
   * Handles error response when it does not have error codes between 400, 401, 404 and 500.
   * @param error HttpErrorResponse
   */
  handleunhandledError(error: HttpErrorResponse) {
    error.error.unhandled = true;
    const errorMessage = error.error.message ? error.error.message : this.MESSAGE_BODY_FOR_UNHANDLED;
    this.notification.showDialog(this.MESSAGE_TITLE_FOR_UNHANDLED_ERROR, `${errorMessage}.`);
  }

  /**
   * Checks HttpErrorResponse in order to validate if the request is a bad request.
   * @param error HttpErrorResponse
   */
  checkBadRequest(error: HttpErrorResponse) {
    return !error.error.code;
  }

  /**
   * Checks If the request has some errors on its content.
   * @param error HttpErrorResponse
   */
  checkIfRequestHasValidationErrors(error: HttpErrorResponse) {
    return error.error.errors;
  }

  checkIfErrorMessages(error: HttpErrorResponse) {
    return error.error.message;
  }

  checkIfIdentityErrorMessages(error: HttpErrorResponse) {
    return error.error.error_description;
  }

  checkForHeaderInstructions(headers: HttpHeaders, instruction: string): boolean {
    return headers.has(instruction);
  }

  /**
   * getTranslatedUnhandledException
   */
  getTranslatedUnhandledException() {
    this.translate.get('APP.UNHANDLED_EXCEPTION_MESSAGE').subscribe(message => console.error(message));
  }

  showHttpError500ForJsonRequest(error) {
    this.notification.showDialog(this.MESSAGE_TITLE_FOR_INTERNAL_SERVER_ERROR,
      `${error.error.message}. <br> ${this.MESSAGE_WITH_TICKET} <br> ${error.error.ticketId}`);
  }

  showHttpError500ForArrayBytesRequest(error) {
    const decodedString = String.fromCharCode.apply(null, new Uint8Array(error.error));
    const objectError = JSON.parse(decodedString);
    this.notification.showDialog(this.MESSAGE_TITLE_FOR_INTERNAL_SERVER_ERROR,
      `${objectError['message']}. <br> ${this.MESSAGE_WITH_TICKET} <br> ${objectError['ticketId']}`);
  }

}
