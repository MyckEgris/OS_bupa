/**
* ProviderHomeComponent.ts
*
* @description: This component shows the proper information for provider
* @author Andrés Tamayo
* @version 1.0
* @date 22-03-2019.
*
**/
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PrehomeService } from '../pre-home/prehome.service';

@Component({
  selector: 'app-provider-home',
  templateUrl: './provider-home.component.html'
})
export class ProviderHomeComponent implements OnInit {

  /**
   * Redirect URL for the split.
   */
  public redirectUrlForSplitMexico: string;

  /**
   * Constructor Method
   * @param config Configuration Service Injection
   */
  constructor(
    private config: ConfigurationService
  ) { }

  ngOnInit(): void {
    this.redirectUrlForSplitMexico = this.config.splitRedirectUrl;
  }

}
