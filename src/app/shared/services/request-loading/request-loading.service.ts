/**
* RequestLoadingService.ts
*
* @description: Creates loading element and show at user
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

import { Injectable } from '@angular/core';
import { Subject, PartialObserver, Subscription } from 'rxjs';

/**
 * Creates loading element and show at user
 */
@Injectable({
  providedIn: 'root'
})
export class RequestLoadingService {

  /**
   * Subject
   */
  private loadNotifier: Subject<boolean>;

  /**
   * Counter
   */
  private loadCounter = 0;

  /**
   * Contructor Method
   */
  constructor() {
    this.loadNotifier = new Subject<boolean>();
  }

  /**
   * Subscribe request of loading
   * @param observer Observer
   */
  subscribe(observer?: any): Subscription {
    return this.loadNotifier.subscribe(observer);
  }

  /**
   * Count and notify
   */
  addLoadingRequest() {
    this.loadCounter++;
    this.notify();
  }

  /**
   * Remove loading
   */
  removeLoadingRequest() {
    this.loadCounter -= this.loadCounter === 0 ? 0 : 1;
    this.notify();
  }

  /**
   * Notify counter
   */
  private notify() {
    this.loadNotifier.next(this.loadCounter > 0);
  }


}
