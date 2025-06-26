/**
* QuickAccessLinksComponent.ts
*
* @description: This component shows the proper quick access on home's pages
* @version 1.0
* @date 22-03-2019.
*
**/
import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { RedirectService } from 'src/app/shared/services/redirect/redirect.service';
import { MenuOptionService } from '../../security/services/menu-option/menu-option.service';

@Component({
  selector: 'app-quick-access-links',
  templateUrl: './quick-access-links.component.html',
  styleUrls: ['./quick-access-links.component.css']
})
export class QuickAccessLinksComponent implements OnInit {


  /**
   * containts the diferents navigation's options
   */
  public options;

  /**
   *
   * @param router router injection
   * @param RedirectService Redirect Service Service Injection
   * @param _menuOption Menu Service Service Injection
   */
  constructor(private router: Router,  private _redirectService: RedirectService,
    private _menuOption: MenuOptionService ) { }


  /**
   * load options to show on the screen
   */
  ngOnInit(): void {
    this.options = this._menuOption.state.quickLinksHome;

    this._menuOption.subscribe(p => {
      this.options = p.quickLinksHome;
    });

  }

  /**
   * validate the route and according to it shot the navigation
   * @param route url to open
   */
  goTo(route: string) {
    if ( route.indexOf('http') > -1) {
      this._redirectService.showModal(route);
    } else {
      this.router.navigate([route]);
    }
  }

}
