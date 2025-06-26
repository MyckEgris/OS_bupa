
/**
* eventNotifications.ts
*
* @description: Model event Notification
* @author Jose Daniel Hernández.
* @version 1.0
* @date 17-7-2019.
*
**/
import { Email } from '../../agent/entities/email';
import { NotificationAttachmentDto } from './notificationAttachment.dto';

/**
 * Model eventNotifications
 */
export interface EventNotifications {

    /**
     * inboxId: number;
     */
    inboxId: number;

    /**
     * emailAddress: Email;
     */
    emailAddress: Email;

    /**
     *  isRead: Boolean;
     */
    isRead: Boolean;

    /**
     * createdOn: Date;
     */
    createdOn: Date;

    /**
     * subject: string;
     */
    subject: string;

    /**
     *  body: string;
     */
    body: string;

    /**
     * attachments: AttachmentDto[];
     */
    attachments: NotificationAttachmentDto[];


}
