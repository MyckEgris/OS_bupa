import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ContentInformation } from '../../home/contentManagementService/conten-Information';
import { InfographicsService } from '../infographics.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-secure',
  templateUrl: './info-secure.component.html'
})
export class InfoSecureComponent implements OnInit, OnDestroy {

  /**
  * Content Information
  */
 public contentInformation: ContentInformation;

 /**
  * welcome msg
  */
 public welcomeMsg: string;

  constructor(
    private router: Router,
    private infographicsService: InfographicsService
  ) { }

  ngOnInit() {
    this.contentInformation = this.infographicsService.content;
  }

  /**
   * close subscription
   */
  ngOnDestroy(): void {
    this.infographicsService.removeContent();
  }

  goToBack() {
    this.infographicsService.removeContent();
    this.router.navigate(['/infographics']);
  }

}
