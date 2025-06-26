/**
* Error401Component.ts
*
* @description: Component for showing Error 401
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';

/**
 * Component for showing Error 401
 */
@Component({
  selector: 'app-error401',
  templateUrl: './error401.component.html'
})
export class Error401Component implements OnInit {

  /**
   * Constructor Method
   * @param _configService Configuration Service Injection
   */
  constructor(private _configService: ConfigurationService) { }

  /**
   * On Init event
   */
  ngOnInit() {
  }

  /**
   * Redirect to home
   */
  public goToHome() {
    location.href = this._configService.returnUrl;
  }

}
