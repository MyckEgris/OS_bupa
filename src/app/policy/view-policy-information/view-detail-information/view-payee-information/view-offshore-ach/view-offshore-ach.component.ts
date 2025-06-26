import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-offshore-ach',
  templateUrl: './view-offshore-ach.component.html'
})
export class ViewOffshoreAchComponent implements OnInit {

  @Input() payeeInformation: any;

  constructor() { }

  ngOnInit() {
  }

}
