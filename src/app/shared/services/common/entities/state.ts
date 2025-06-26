/**
 * StateResponse.ts / State.ts
 * @description Model State
 * @author Arturo Suarez
 * @version 1.0
 * @date 14-01-2019.
 *
 **/



/**
 * Model State
 */
export interface State {

  /**
   * stateId
   */
  stateId: number;

  /**
   * countryId
   */
  countryId: number;

  /**
   * stateName
   */
  stateName: string;

  /**
   * StateKey?
   */
  StateKey?: string;

  /**
   * countryKey?
   */
  countryKey?: string;

}

/**
 * Model StateResponse
 */
export interface StateResponse {
  /**
   * stateId
   */
  state: State[];

}
