import { Component, OnInit } from '@angular/core';
import { Utilities } from 'src/app/shared/util/utilities';

@Component({
  selector: 'app-policy-application-header',
  templateUrl: './policy-application-header.component.html'
})
export class PolicyApplicationHeaderComponent implements OnInit {

  public creationDate: any;

  constructor() { }

  ngOnInit() {
    this.creationDate = Utilities.getDateNow();
  }

}
