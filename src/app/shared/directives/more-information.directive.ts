import { NotificationComponent } from './../services/notification/notification-component/notification.component';
/**
* MoreInformationDirective.ts
*
* @description: Custom directive to open poppover and show additional information
* @author Juan Camilo Moreno.
* @version 1.0
* @date 19-12-2018.
*
**/

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Directive({
    selector: '[appMoreInformation]'
})
export class MoreInformationDirective {

    @Input() appMoreInformation: any;
    @Input() message: Array<string>;

    popContent: string;
    popTitle: string;
    popover: NgbPopover;

    constructor(
        private el: ElementRef
    ) {
        this.setup();
    }

    setup() {
        const parent = this.el.nativeElement.parentNode;
        const newParentDiv = document.createElement('div');
        newParentDiv.className = 'input-group';
        parent.replaceChild(newParentDiv, this.el.nativeElement);
        newParentDiv.appendChild(this.el.nativeElement);
        const icon = document.createElement('div');
        // eyeIcon.className = 'input-group-append';

        icon.innerHTML = `<button #popover="ngbPopover" placement="bottom" ngbPopover="adfga"  popoverTitle="Popover on left"
        triggers="manual" (click)="openPop(popover)"></button>`;
        icon.addEventListener('click', (event) => { this.openPop(this.popover); });
        newParentDiv.appendChild(icon);
    }

    openPop(p: NgbPopover): void {
        this.popover.isOpen() ? this.popover.close() : this.popover.open();
    }

    openPopover(event: any) {
        event.preventDefault();
        event.stopPropagation();
        // this.popover.popoverTitle = 'Title';
    }
}
