/**
* AgreementsModel.ts
*
* @description: Model for agreements
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * Model for agreements
 */
export interface AgreementsModel {

  /**
   * title
   */
  title: string;

  /**
   * content
   */
  content: string;

  /**
   * url
   */
  url: string;

  /**
   * acceptText
   */
  acceptText: string;

  /**
   * declineText
   */
  declineText: string;

  /**
   * idContent
   */
  idContent: string;

  /**
   * canUserBeLocked
   */
  canUserBeLocked: boolean;

  /**
   * hideButtonLastRetry
   */
  hideButtonLastRetry: boolean;

  /**
   * retryCount
   */
  retryCount: number;

  /**
   * refuseNumber
   */
  refuseNumber: number;

  /**
   * agreementId
   */
  agreementId: number;
}
