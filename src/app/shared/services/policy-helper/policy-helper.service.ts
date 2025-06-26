
/**
* PolicyHelperService.ts
*
* @description: This class contains the logic of PolicyHelperService.
* @author Jose Daniel Hernández M
* @version 1.0
* @date 07-01-2022.
*
*/

import { Injectable } from '@angular/core';
import { PolicyNatureId } from '../../classes/policy-nature.enum';

@Injectable({
  providedIn: 'root'
})
export class PolicyHelperService {

  /**
  * Constructor method.
  */
  constructor() { }

  /**
  * Validates if policy nature is travel.
  */
  public isPolicyNatureTravel(policyNatureId?: number) {
    return policyNatureId && policyNatureId === PolicyNatureId.TRAVEL ? true : false;
  }


  /**
  * Validates if policy nature is travel.
  */
  public isPolicyNatureTravelBTI(policyNatureId?: number) {
    return policyNatureId && policyNatureId === PolicyNatureId.TRAVELBTI ? true : false;
  }

  /**
  * Validates if policy nature is travel.
  */
   public isPolicyNatureTravelHealth(policyNatureId?: number) {
    return policyNatureId && policyNatureId === PolicyNatureId.HEALTH ? true : false;
  }
}
