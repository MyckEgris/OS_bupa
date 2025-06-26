
/**
* UpdateEventNotificationRequest.ts
*
* @description: Model event Notification
* @author Jose Daniel Hernández.
* @version 1.0
* @date 22-7-2019.
*
**/

import { ReadNotification } from './readNotification.dto';

/**
 * Model UpdateEventNotificationRequest
 */

export class UpdateEventNotificationRequest {

    eventNotifications: ReadNotification[];
}
