/**
* ErrorsHandler.ts
*
* @description: Class for managing exceptions in application
* @author Yefry Lopez
* @author Juan Camilo Moreno
* @version 1.0
* @date 10-10-2018.
*
**/

import { ErrorHandler, Injectable} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Class for managing exceptions in application
 */
@Injectable({
    providedIn: 'root'
})
export class ErrorsHandler implements ErrorHandler {

  /**
   * Implementation of Error Handler
   * @param error Error | HttpErrorResponse
   */
  handleError(error: Error | HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
       // Server or connection error happened
       if (!navigator.onLine) {
         // Handle offline error
       } else {
         // Handle Http Error (error.status === 403, 404...)
       }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
    }
   // Log the error anyway
   console.error('It happens: ', error);
 }

}
