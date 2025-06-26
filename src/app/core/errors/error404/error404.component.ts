/**
* Error404Component.ts
*
* @description: Component for showing Error 404
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';

/**
 * Component for showing Error 404
 */
@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html'
})
export class Error404Component implements OnInit {

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
