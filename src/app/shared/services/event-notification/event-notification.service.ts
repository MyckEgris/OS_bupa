/**
* EventNotificationService.ts
*
* @description: Interacts with Notification API
* @author Jose Daniel Hernández
* @version 1.0
* @date 17-07-2019.
*
**/

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigurationService } from '../configuration/configuration.service';
import { EventNotificationDTO } from './entities/eventNotification.dto';
import { UpdateEventNotificationRequest } from './entities/updateEventNotificationRequest.dto';



/**
 * Interacts with Notification API
 */
@Injectable({
    providedIn: 'root'
})


export class EventNotificationService {


    /**
     * Constant to define root notification endpoint
     */
    private NOTIFICATION = 'eventnotifications';

    /**
     * Constant for page index parameter
     */
    private PARAM_PAGE_INDEX = 'pageindex';

    /**
     * Constant for page size parameter
     */
    private PARAM_PAGE_SIZE = 'pagesize';


    /**
    * Contructor Method
    * @param _http HttpClient Injection
    * @param _config Configuration Service Injection
    */
    constructor(private _http: HttpClient, private _config: ConfigurationService) { }

    /**
    * Get claim notifications filtering by pageSize and pageIndex
    * @param pageIndex Page Index
    * @param pageSize Page Size
    */
    public getEventNotification(pageIndex: number, pageSize: number): Observable<EventNotificationDTO> {
        const params = this.AddParamsToNotificationRequest(pageIndex, pageSize);
        return this._http.get<EventNotificationDTO>(`${this._config.apiHostEventNotification}/${this.NOTIFICATION}`, { params })
            .pipe(catchError(this.handleError));
    }


    /**
     * Add URL parameters for notificatio request
     * @param pageIndex Page Index
     * @param pageSize Page Size
     */
    private AddParamsToNotificationRequest(pageIndex: number, pageSize: number): HttpParams {
        return new HttpParams()
            .set(this.PARAM_PAGE_SIZE, pageSize.toString())
            .set(this.PARAM_PAGE_INDEX, pageIndex.toString());
    }



    /**
    * patch claim notifications state array
    * @param eventNotifications Event Notifications
    */
    public patchEventNotification(updateEventNotificationRequest: UpdateEventNotificationRequest) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        const body = JSON.stringify(updateEventNotificationRequest);
        return this._http.patch<UpdateEventNotificationRequest>(`${this._config.apiHostEventNotification}/${this.NOTIFICATION}`,
            body, httpOptions)
            .pipe(catchError(this.handleError));
    }



    /**
    * handle error
    * @param error Error: HttpErrorResponse
    */
    private handleError(error: HttpErrorResponse) {
        return throwError(error);
    }

}
