
/**
* eventNotificationDto.ts
*
* @description: DTO event Notification
* @author Jose Daniel Hernández.
* @version 1.0
* @date 17-7-2019.
*
**/

import { EventNotifications } from './eventNotifications';

/**
 * DTO eventNotification
 */
export interface EventNotificationDTO {

    /**
     * pageIndex: number
     */
    pageIndex: number;

    /**
     * pageSize: number
     */
    pageSize: number;

    /**
     * total: number
     */
    count: number;

    /**
     * notifications: EventNotifications[]
     */
    data: EventNotifications[];
}
