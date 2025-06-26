import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-offshore-wt',
  templateUrl: './view-offshore-wt.component.html'
})
export class ViewOffshoreWtComponent implements OnInit {

  @Input() payeeInformation: any;

  constructor() { }

  ngOnInit() {
  }

}
