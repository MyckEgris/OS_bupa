import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventNotificationComponent } from './event-notification/event-notification.component';
import { EventNotificationRoutingModule } from './event-notification-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    EventNotificationRoutingModule,
    TranslateModule
  ],
  declarations: [EventNotificationComponent]
})
export class EventNotificationModule { }
