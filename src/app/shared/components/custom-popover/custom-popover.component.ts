import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-popover',
  templateUrl: './custom-popover.component.html'
})
export class CustomPopoverComponent implements OnInit {

  /**
   * Component input properties.
   */
  @Input() type?: string;
  @Input() title?: string;
  @Input() content: string[];
  @Input() linkValue?: string;
  @Input() icon?: string;
  @Input() colorHex?: string;
  @Input() template?: string[];
  @Input() image?: string;
  @Input() autoClose?: boolean;

  /**
   * Default icon color value.
   */
  public greenValue = '#888888';



  /**
   * Constructor Method
   */
  constructor() {
  }


  ngOnInit() {
    if (!this.icon) {
      this.icon = 'help_outline';
    }
    if (!this.colorHex) {
      this.colorHex = this.greenValue;
    }
  }

}
