/**
* PrehomeService.ts
*
* @description: This services handles prehome component
* @author Andrés Tamayo
* @version 1.0
* @date 10-04-2019.
*
**/
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { PreHomeProviderComponent } from '../pre-home-provider/pre-home-provider.component';
import { PreHomeComponent } from './pre-home.component';

@Injectable({
  providedIn: 'root'
})
export class PrehomeService {

  public dialog;
  public result;
  /**
   * Contruct Methos
   * @param modalService Modal Service Injection
   */
  constructor(  private modalService: NgbModal, private _authService: AuthService) { }

    /**
   * Show to modal with the message before redirect
   * @param url url to redirect
   */
  showModal() {
    const userRole = this._authService.getUser().role_id;
    switch (userRole) {
      case Rol.PROVIDER.toString():
        this.result = this.modalService.open(PreHomeProviderComponent,
          { centered: true, backdrop: 'static', keyboard: false, size: 'lg', windowClass: 'ig-modalprehome'});
        this.dialog = this.result.componentInstance as PreHomeProviderComponent;
        break;
      default:
        this.result = this.modalService.open(PreHomeComponent,
          { centered: true, backdrop: 'static', keyboard: false, size: 'lg', windowClass: 'ig-modalprehome'});
        this.dialog = this.result.componentInstance as PreHomeComponent;
        break;
    }

  }

}
